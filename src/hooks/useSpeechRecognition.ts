// hooks/useSpeechRecognition.ts
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeechRecognition() {
    const [transcript, setTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);
    const recRef = useRef<any>(null);

    useEffect(() => {
        const supported =
            typeof window !== 'undefined' &&
            !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
        setIsSupported(supported);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setFinalTranscript('');
    }, []);

    const start = useCallback(() => {
        const win = typeof window !== 'undefined' ? (window as any) : null;
        const SR = win?.SpeechRecognition || win?.webkitSpeechRecognition;
        if (!SR) {
            setError('Tarayıcın desteklemiyor, Chrome veya Edge kullan!');
            return;
        }

        setError(null);
        setTranscript('');
        setFinalTranscript('');

        try {
            if (recRef.current) {
                try {
                    recRef.current.abort();
                } catch {
                    // Ignore abort error
                }
            }

            const rec = new SR();
            rec.lang = 'tr-TR';        // ⚠️ mutlaka tr-TR
            rec.interimResults = true; // canlı takip
            rec.continuous = false;    // tek kelime için yeterli
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
                if (e.error === 'not-allowed') {
                    setError('Mikrofon izni gerekli! 🔒');
                } else if (e.error === 'no-speech') {
                    setError('Ses duyamadım, tekrar dener misin? 🎤');
                } else {
                    setError('Bir sorun oluştu: ' + e.error);
                }
                setIsListening(false);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            recRef.current = rec;
            rec.start();
            setIsListening(true);
        } catch (err: any) {
            setError('Mikrofon başlatılamadı: ' + (err?.message || err));
            setIsListening(false);
        }
    }, []);

    const stop = useCallback(() => {
        try {
            recRef.current?.stop();
        } catch {
            // Ignore stop error
        }
    }, []);

    useEffect(() => {
        return () => {
            try {
                recRef.current?.abort();
            } catch {
                // Ignore abort error
            }
        };
    }, []);

    return {
        transcript,
        finalTranscript,
        isListening,
        error,
        isSupported,
        start,
        stop,
        startListening: start,
        stopListening: stop,
        resetTranscript,
    };
}