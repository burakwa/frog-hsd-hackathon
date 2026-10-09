// hooks/useEnhancedSpeechAnalysis.ts — Enhanced Speech Analysis with Real-time Audio & Phoneme Detection
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { analyze, type AnalysisResult, type PronunciationError } from '@/lib/comparison/analyze';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import type { DetailedPhonemeError } from '@/lib/ai/openrouter';

export interface EnhancedAnalysisResult extends AnalysisResult {
    aiErrors?: DetailedPhonemeError[];
    audioMetrics?: {
        averageLevel: number;
        maxLevel: number;
        duration: number;
    };
}

export function useEnhancedSpeechAnalysis() {
    const [transcript, setTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);
    const [audioLevel, setAudioLevel] = useState(0);
    const [audioMetrics, setAudioMetrics] = useState<{ averageLevel: number; maxLevel: number; duration: number }>({
        averageLevel: 0,
        maxLevel: 0,
        duration: 0,
    });
    
    const recRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const levelHistoryRef = useRef<number[]>([]);
    const startTimeRef = useRef<number>(0);
    const { analyze: analyzeWithAI, analyzing: aiAnalyzing } = useAIAnalysis();
    const isInitialMount = useRef(true);

    // Check browser support
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const supported =
            typeof window !== 'undefined' &&
            !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
        setIsSupported(supported);
    }, []);

    // Real-time audio level monitoring
    const setupAudioMonitoring = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                } 
            });
            
            streamRef.current = stream;
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;
            
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            analyserRef.current = analyser;
            
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            const updateLevel = () => {
                if (!analyserRef.current || !isListening) return;
                
                analyserRef.current.getByteFrequencyData(dataArray);
                
                // Calculate average volume (focus on speech frequencies ~300-3400Hz)
                let sum = 0;
                const speechBinStart = Math.floor(300 / (audioContext.sampleRate / analyser.fftSize));
                const speechBinEnd = Math.floor(3400 / (audioContext.sampleRate / analyser.fftSize));
                
                for (let i = speechBinStart; i < Math.min(speechBinEnd, dataArray.length); i++) {
                    sum += dataArray[i];
                }
                
                const average = sum / (speechBinEnd - speechBinStart) / 255; // Normalize to 0-1
                const clampedLevel = Math.min(Math.max(average * 3, 0), 1); // Amplify for visibility
                
                setAudioLevel(clampedLevel);
                levelHistoryRef.current.push(clampedLevel);
                
                // Keep last 100 samples for metrics
                if (levelHistoryRef.current.length > 100) {
                    levelHistoryRef.current.shift();
                }
                
                animationFrameRef.current = requestAnimationFrame(updateLevel);
            };
            
            startTimeRef.current = Date.now();
            updateLevel();
        } catch (err) {
            console.warn('Audio monitoring setup failed:', err);
        }
    }, [isListening]);

    const stopAudioMonitoring = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        
        // Calculate final metrics
        if (levelHistoryRef.current.length > 0) {
            const avg = levelHistoryRef.current.reduce((a, b) => a + b, 0) / levelHistoryRef.current.length;
            const max = Math.max(...levelHistoryRef.current);
            const duration = (Date.now() - startTimeRef.current) / 1000;
            
            setAudioMetrics({
                averageLevel: avg,
                maxLevel: max,
                duration,
            });
        }
        
        levelHistoryRef.current = [];
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        
        analyserRef.current = null;
        setAudioLevel(0);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setFinalTranscript('');
    }, []);

    const start = useCallback(async () => {
        const win = typeof window !== 'undefined' ? (window as any) : null;
        const SR = win?.SpeechRecognition || win?.webkitSpeechRecognition;
        
        if (!SR) {
            setError('Bu tarayıcı ses tanımayı desteklemiyor. Lütfen Chrome, Edge veya Safari kullanın.');
            return;
        }

        // HTTPS check (except localhost)
        if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && 
            window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            setError('Ses tanıma için HTTPS gerekli. Yerel test için localhost kullanın.');
            return;
        }

        setError(null);
        setTranscript('');
        setFinalTranscript('');

        try {
            if (recRef.current) {
                try { recRef.current.abort(); } catch {}
            }

            const rec = new SR();
            rec.lang = 'tr-TR';
            rec.interimResults = true;
            rec.continuous = false;
            rec.maxAlternatives = 1;

            rec.onresult = (e: any) => {
                let interim = '';
                let final = '';
                for (let i = 0; i < e.results.length; i++) {
                    const t = e.results[i][0].transcript;
                    if (e.results[i].isFinal) {
                        final += t;
                    } else {
                        interim += t;
                    }
                }
                const cleanFinal = final.trim();
                const cleanTotal = (final + interim).trim();

                if (cleanFinal) {
                    setFinalTranscript(cleanFinal);
                }
                setTranscript(cleanTotal);
            };

            rec.onerror = (e: any) => {
                let errorMessage = 'Bir sorun oluştu';
                if (e.error === 'not-allowed') {
                    errorMessage = 'Mikrofon izni gerekli! Tarayıcı adres çubuğundaki kilit ikonuna tıklayıp "İzin ver" seçin. 🔒';
                } else if (e.error === 'no-speech') {
                    errorMessage = 'Ses duyamadım, tekrar dener misin? 🎤';
                } else if (e.error === 'network') {
                    errorMessage = 'Ağ hatası: İnternet bağlantınızı kontrol edin. Production için HTTPS gereklidir.';
                } else if (e.error === 'service-not-allowed') {
                    errorMessage = 'Ses tanıma servisi kullanılamıyor. Chrome/Edge/Safari güncel sürüm kullanın.';
                } else if (e.error === 'aborted') {
                    errorMessage = 'Dinleme iptal edildi.';
                } else {
                    errorMessage = `Ses tanıma hatası: ${e.error}`;
                }
                setError(errorMessage);
                setIsListening(false);
                stopAudioMonitoring();
            };

            rec.onend = () => {
                setIsListening(false);
                stopAudioMonitoring();
            };

            recRef.current = rec;
            
            // Start audio monitoring in parallel
            await setupAudioMonitoring();
            
            rec.start();
            setIsListening(true);
        } catch (err: any) {
            setError('Mikrofon başlatılamadı: ' + (err?.message || err));
            setIsListening(false);
            stopAudioMonitoring();
        }
    }, [setupAudioMonitoring, stopAudioMonitoring]);

    const stop = useCallback(() => {
        try {
            recRef.current?.stop();
        } catch {}
        stopAudioMonitoring();
    }, [stopAudioMonitoring]);

    // Enhanced analysis with AI
    const analyzeWithEnhancements = useCallback(async (
        targetWord: string,
        spokenWord: string,
        childAge: number = 6,
        context: 'word' | 'sentence' | 'story' = 'word'
    ): Promise<EnhancedAnalysisResult> => {
        // Local analysis first
        const localResult = analyze(targetWord, spokenWord);
        
        // AI analysis for detailed phoneme feedback
        let aiErrors: DetailedPhonemeError[] = [];
        if (localResult.score < 85 && localResult.errors.length > 0) {
            try {
                const aiResult = await analyzeWithAI({
                    targetWord,
                    spokenWord,
                    score: localResult.score,
                    errors: localResult.errors,
                    context,
                    childAge,
                });
                if (aiResult?.detailedErrors) {
                    aiErrors = aiResult.detailedErrors;
                }
            } catch {
                // Silently fail, use local analysis only
            }
        }

        return {
            ...localResult,
            aiErrors,
            audioMetrics: audioMetrics,
        };
    }, [analyzeWithAI, audioMetrics]);

    useEffect(() => {
        return () => {
            try {
                recRef.current?.abort();
                stopAudioMonitoring();
            } catch {}
        };
    }, [stopAudioMonitoring]);

    return {
        transcript,
        finalTranscript,
        isListening,
        error,
        isSupported,
        audioLevel,
        audioMetrics,
        aiAnalyzing,
        start,
        stop,
        startListening: start,
        stopListening: stop,
        resetTranscript,
        analyze: analyzeWithEnhancements,
    };
}