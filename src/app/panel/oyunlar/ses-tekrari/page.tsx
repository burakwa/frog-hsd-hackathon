'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2 } from 'lucide-react';
import PraiseOverlay from '@/components/game/PraiseOverlay';
import MicrophoneButton from '@/components/speech/MicrophoneButton';
import SpeechVisualizer from '@/components/speech/SpeechVisualizer';
import PronunciationFeedback from '@/components/speech/PronunciationFeedback';
import Character from '@/components/game/Character';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { analyze } from '@/lib/comparison/analyze';
import { exercises } from '@/lib/data/exercises';
import { randomPraise, randomEncouragement } from '@/lib/utils/praise';
import { scoreToStars } from '@/lib/utils/helpers';
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

    const ex = exercises[index % exercises.length];

    useEffect(() => { setMounted(true); }, []);

    // Konuşma bitince analiz
    useEffect(() => {
        const spoken = (finalTranscript || transcript).trim();
        if (isListening || !spoken || spoken === lastFinal) return;

        setLastFinal(spoken);
        setMascotMood('thinking');

        const r = analyze(ex.metin, spoken);
        setResult(r);
        const s = scoreToStars(r.score);
        setStars(s);

        if (s >= 2) {
            const msg = randomPraise();
            setOverlayMsg(msg);
            setMascotMood('excited');
            setTimeout(() => speak(msg), 300);
            setTimeout(() => setShowOverlay(true), 600);
        } else {
            setOverlayMsg(randomEncouragement());
            setMascotMood('sad');
        }
    }, [isListening, finalTranscript, transcript, lastFinal, ex.metin, speak]);

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
            <div className="min-h-screen bg-app flex items-center justify-center p-6">
                <div className="card text-center max-w-sm">
                    <p className="text-5xl mb-4">🌐</p>
                    <h2 className="text-xl font-black text-gray-700 mb-2">Tarayıcın desteklemiyor</h2>
                    <p className="text-gray-500 text-sm">Bu oyun <b>Chrome</b> veya <b>Edge</b> ile çalışır.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-game p-4">
            <div className="max-w-lg mx-auto pt-4">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-5">
                    <Link href="/panel/oyunlar">
                        <button className="flex items-center gap-1 text-purple-600 font-bold bg-white rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition text-sm">
                            <ArrowLeft size={16} /> Geri
                        </button>
                    </Link>
                    <div className="bg-white rounded-full px-4 py-1.5 shadow-sm font-bold text-purple-600 text-sm">
                        {index + 1} / {exercises.length}
                    </div>
                    <button onClick={handleNext} className="text-xs font-bold text-gray-400 hover:text-purple-500 bg-white rounded-full px-3 py-1.5 shadow-sm transition">
                        Sonraki →
                    </button>
                </div>

                {/* Mascot */}
                <div className="flex justify-center mb-2">
                    <Character mood={mascotMood} size={80} />
                </div>

                {/* Exercise card */}
                <motion.div
                    key={ex.id}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card text-center mb-5"
                >
                    <div className="text-8xl mb-3">{ex.emoji}</div>
                    <h1 className="text-4xl font-black text-purple-800 tracking-wide mb-4">{ex.metin}</h1>
                    <button
                        onClick={() => { setMascotMood('speaking'); speak(ex.metin); }}
                        className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-5 py-2 font-bold hover:bg-purple-200 transition text-sm"
                    >
                        <Volume2 size={18} /> Dinle
                    </button>
                </motion.div>

                {/* Live transcript */}
                <div className="h-8 text-center text-base text-gray-500 font-semibold mb-4">
                    {isListening
                        ? `🎤 "${transcript || '...'}"`
                        : transcript
                            ? `"${transcript}"`
                            : <span className="text-purple-300">Konuşmak için mikrofona bas!</span>
                    }
                </div>

                {/* Mic + Visualizer */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <SpeechVisualizer isActive={isListening} />
                    <MicrophoneButton
                        isListening={isListening}
                        onToggle={() => isListening ? stop() : start()}
                        size="lg"
                    />
                </div>

                {/* Feedback */}
                {result && !showOverlay && result.score < 70 && (
                    <PronunciationFeedback
                        errors={result.errors}
                        score={result.score}
                        message={overlayMsg}
                        onRetry={reset}
                    />
                )}

                {error && (
                    <p className="text-center text-red-500 font-bold text-sm mt-2">{error}</p>
                )}
            </div>

            <PraiseOverlay
                open={showOverlay}
                stars={stars}
                message={overlayMsg}
                onNext={handleNext}
                onRetry={reset}
            />
        </div>
    );
}
