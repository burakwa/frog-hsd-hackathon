// app/panel/oyunlar/ses-tekrari/page.tsx — Ses Tekrarı Oyunu
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Trophy, Sparkles, Mic, AlertTriangle } from 'lucide-react';
import PraiseOverlay from '@/components/game/PraiseOverlay';
import MicrophoneButton from '@/components/speech/MicrophoneButton';
import SpeechVisualizer from '@/components/speech/SpeechVisualizer';
import PronunciationFeedback from '@/components/speech/PronunciationFeedback';
import Character from '@/components/game/Character';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useProgress } from '@/hooks/useProgress';
import { analyze } from '@/lib/comparison/analyze';
import { exercises } from '@/lib/data/exercises';
import { randomPraise, randomEncouragement } from '@/lib/utils/praise';
import { scoreToStars } from '@/lib/utils/helpers';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import type { AnalysisResult, MascotMood } from '@/types';

export default function SesTekrariGame() {
    const [mounted, setMounted] = useState(false);
    const [index, setIndex] = useState(0);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [stars, setStars] = useState(0);
    const [overlayMsg, setOverlayMsg] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);
    const [lastFinal, setLastFinal] = useState('');
    const [mascotMood, setMascotMood] = useState<MascotMood>('happy');

    const { transcript, finalTranscript, isListening, error, isSupported, start, stop, resetTranscript } = useSpeechRecognition();
    const { speak } = useSpeechSynthesis();
    const { addStars, recordSession } = useProgress();
    const { analyze: analyzeWithAI, analyzing: aiAnalyzing } = useAIAnalysis();

    const ex = exercises[index % exercises.length];

    useEffect(() => { setMounted(true); }, []);

    // 8-bit sound
    const playChiptune = (freq: number, type: OscillatorType = 'square', duration: number = 0.2) => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch {
            // ignore WebAudio restrictions
        }
    };

    // Analyze speech
    useEffect(() => {
        const spoken = (finalTranscript || transcript).trim();
        if (isListening || !spoken || spoken === lastFinal) return;

        setLastFinal(spoken);
        setMascotMood('thinking');

        const r = analyze(ex.metin, spoken);
        setResult(r);
        const s = scoreToStars(r.score);
        setStars(s);

        // Enhanced AI Analysis for better feedback
        if (s < 3) { // Only for non-perfect scores
            analyzeWithAI({
                targetWord: ex.metin,
                spokenWord: spoken,
                score: r.score,
                errors: r.errors,
                context: 'word',
                childAge: 6
            }).then(aiResult => {
                if (aiResult) {
                    // Use AI feedback for overlay message if score is low
                    if (s < 2) {
                        setOverlayMsg(aiResult.feedback);
                    }
                    // Could store aiResult for detailed feedback display
                }
            }).catch(() => {
                // Silently fail, use local feedback
            });
        }

        if (s >= 2) {
            playChiptune(587, 'square', 0.15);
            setTimeout(() => playChiptune(880, 'triangle', 0.3), 100);

            const msg = randomPraise();
            setOverlayMsg(msg);
            setMascotMood('excited');
            addStars(s);
            recordSession('ses-tekrari', r.score, s, 30);
            setTimeout(() => speak(msg), 300);
            setTimeout(() => setShowOverlay(true), 600);
        } else {
            playChiptune(200, 'sawtooth', 0.25);
            setOverlayMsg(randomEncouragement());
            setMascotMood('sad');
        }
    }, [isListening, finalTranscript, transcript, lastFinal, ex.metin, speak, analyzeWithAI]);

    useEffect(() => {
        if (isListening) setMascotMood('speaking');
    }, [isListening]);

    const reset = () => {
        stop(); resetTranscript();
        setResult(null); setStars(0); setLastFinal('');
        setShowOverlay(false); setMascotMood('happy');
    };

    const handleNext = () => {
        reset();
        setIndex(i => (i + 1) % exercises.length);
    };

    if (mounted && !isSupported) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card card-elevated p-8 text-center max-w-md"
                >
                    <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                        <span className="text-4xl">😕</span>
                    </div>
                    <h2 className="font-fun text-xl text-gray-800 mb-2">Tarayıcı Desteği Yok</h2>
                    <p className="text-gray-600">Ses tanıma için Chrome, Edge veya Safari kullanın.</p>
                </motion.div>
            </div>
        );
    }

    const spokenText = (finalTranscript || transcript).trim();

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
            {/* Top Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <Link href="/panel/oyunlar" className="btn btn-ghost btn-small">
                    <ArrowLeft className="w-4 h-4" />
                    Geri
                </Link>
                <div className="flex items-center gap-3">
                    <div className="badge badge-green">
                        <Trophy className="w-3 h-3" />
                        STAGE {index + 1} / {exercises.length}
                    </div>
                    <button
                        onClick={handleNext}
                        className="btn btn-secondary btn-small"
                    >
                        Sonraki
                        <ArrowLeft className="w-4 h-4 -rotate-180" />
                    </button>
                </div>
            </motion.div>

            {/* Main Game Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card card-elevated p-6 md:p-8 relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl" />

                {/* Flying fly decoration */}
                <motion.div
                    animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-6 right-6 pointer-events-none"
                    aria-hidden="true"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" className="w-10 h-10 opacity-60"><path d="M12 2v20M2 12h20"/></svg>
                </motion.div>

                {/* Frog Mascot */}
                <div className="relative z-10 flex justify-center mb-6">
                    <Character mood={mascotMood} size={120} showLilypad={true} />
                </div>

                {/* Target Word Card */}
                <motion.div
                    key={ex.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 card card-colored-green p-8 text-center mx-auto max-w-md"
                >
                    <span className="text-6xl mb-4 block">{ex.emoji}</span>
                    <h1 className="font-fun text-3xl md:text-4xl text-green-800 mb-6 tracking-wide">
                        {ex.metin.toUpperCase()}
                    </h1>

                    <button
                        onClick={() => { setMascotMood('speaking'); speak(ex.metin); }}
                        className="btn btn-primary group"
                    >
                        <Volume2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                        Dinle
                    </button>
                </motion.div>
            </motion.div>

            {/* Recording Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card card-elevated p-6"
            >
                {/* Status Display */}
                <div className="min-h-[60px] mb-6">
                    {isListening ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-3 text-center"
                        >
                            <div className="flex items-center gap-2 text-red-600">
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-3 h-3 rounded-full bg-red-500"
                                />
                                <span className="font-fun text-lg">Dinleniyor...</span>
                            </div>
                            <div className="font-mono text-lg text-gray-700 bg-gray-50 px-4 py-2 rounded-xl min-w-[200px]">
                                {spokenText || '...'}
                            </div>
                        </motion.div>
                    ) : spokenText ? (
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="flex items-center gap-2 text-green-600">
                                <span className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="font-fun text-lg">Duyuldu</span>
                            </div>
                            <div className="font-mono text-lg text-gray-700 bg-green-50 px-4 py-2 rounded-xl min-w-[200px]">
                                {spokenText}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-center text-gray-500">
                            <Mic className="w-12 h-12 text-gray-300" />
                            <span className="font-rounded">Mikrofona bas ve kelimeyi söyle!</span>
                        </div>
                    )}
                </div>

                {/* Audio Visualizer */}
                <div className="mb-6">
                    <SpeechVisualizer isActive={isListening} />
                </div>

                {/* Microphone Button */}
                <div className="flex justify-center mb-6">
                    <MicrophoneButton
                        isListening={isListening}
                        onToggle={() => isListening ? stop() : start()}
                        size="lg"
                    />
                </div>

                {/* Pronunciation Feedback */}
                {result && !showOverlay && result.score < 70 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        <PronunciationFeedback
                            errors={result.errors}
                            score={result.score}
                            message={overlayMsg}
                            onRetry={reset}
                        />
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl"
                    >
                        <div className="flex items-center gap-2 text-orange-700 mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-fun text-sm">Ses tanıma çalışmıyor</span>
                        </div>
                        <p className="text-sm text-orange-600 mb-3">{error}</p>
                        <p className="text-xs text-orange-500 mb-3">Aşağıdan doğru kelimeyi seçerek oynayabilirsiniz:</p>
                    </motion.div>
                )}

                {/* Fallback: Manuel Kelime Seçimi */}
                {(error || !isSupported) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <p className="font-rounded text-sm text-gray-500 text-center mb-3">Ya da kelimeyi seç:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {ex.options?.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setMascotMood('thinking');
                                        setTimeout(() => {
                                            const r = analyze(ex.metin, opt);
                                            setResult(r);
                                            const s = scoreToStars(r.score);
                                            setStars(s);
                                            if (s >= 2) {
                                                setOverlayMsg(randomPraise());
                                                setMascotMood('excited');
                                                addStars(s);
                                                recordSession('ses-tekrari', r.score, s, 30);
                                                setTimeout(() => speak(randomPraise()), 300);
                                                setTimeout(() => setShowOverlay(true), 600);
                                            } else {
                                                setOverlayMsg(randomEncouragement());
                                                setMascotMood('sad');
                                            }
                                        }, 300);
                                    }}
                                    className="btn btn-secondary text-sm"
                                >
                                    {opt.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-red-600 font-rounded text-sm mt-4 p-3 bg-red-50 rounded-xl"
                    >
                        {error}
                    </motion.p>
                )}
            </motion.div>

            {/* Praise Overlay */}
            <PraiseOverlay
                isOpen={showOverlay}
                stars={stars}
                message={overlayMsg}
                onNext={handleNext}
                onRetry={reset}
            />
        </div>
    );
}