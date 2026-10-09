'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Mic, Square, Volume2, Globe, ArrowLeft } from 'lucide-react';
import PraiseOverlay from '@/components/game/PraiseOverlay';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { analyze, type AnalysisResult } from '@/lib/comparison/analyze';
import { exercises } from '@/lib/data/exercises';
import { randomPraise, randomEncouragement } from '@/lib/utils/praise';

export default function SesTekrariPage() {
    const [mounted, setMounted] = useState(false);
    const [index, setIndex] = useState(0);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [stars, setStars] = useState(0);
    const [overlayMessage, setOverlayMessage] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);
    const [lastFinal, setLastFinal] = useState('');

    const {
        transcript,
        finalTranscript,
        isListening,
        error,
        isSupported,
        start,
        stop,
        resetTranscript,
    } = useSpeechRecognition();
    const { speak } = useSpeechSynthesis();

    useEffect(() => {
        setMounted(true);
    }, []);

    const ex = exercises[index % exercises.length];

    // Konuşma bitince otomatik analiz
    useEffect(() => {
        const spoken = (finalTranscript || transcript).trim();
        if (isListening || !spoken || spoken === lastFinal) return;

        setLastFinal(spoken);
        const r = analyze(ex.metin, spoken);
        setResult(r);

        const s = r.score >= 90 ? 3 : r.score >= 70 ? 2 : 1;
        setStars(s);

        if (s >= 2) {
            const msg = randomPraise();
            setOverlayMessage(msg);
            confetti({
                particleCount: 130,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#a855f7', '#facc15', '#34d399', '#f472b6'],
            });
            setTimeout(() => speak(msg), 300);
            setTimeout(() => setShowOverlay(true), 700);
        } else {
            setOverlayMessage(randomEncouragement());
        }
    }, [isListening, finalTranscript, transcript, lastFinal, ex.metin, speak]);

    const handleMic = () => (isListening ? stop() : start());

    const reset = () => {
        stop();
        resetTranscript();
        setResult(null);
        setStars(0);
        setLastFinal('');
        setShowOverlay(false);
    };

    const handleNext = () => {
        reset();
        setIndex(i => (i + 1) % exercises.length);
    };

    if (mounted && !isSupported) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-purple-100 p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
                    <Globe size={48} className="mx-auto mb-4 text-purple-500" />
                    <h1 className="text-xl font-bold mb-2">Tarayıcın desteklemiyor 🙁</h1>
                    <p className="text-gray-600">Bu oyun <b>Chrome</b> veya <b>Edge</b> ile çalışır.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 p-4">
            <div className="max-w-xl mx-auto pt-6">
                {/* Üst bar */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 bg-white px-3 py-1.5 rounded-full shadow-sm"
                    >
                        <ArrowLeft size={16} /> Ana Sayfa
                    </Link>
                    <span className="bg-white rounded-full px-4 py-2 font-bold text-purple-600 shadow">
                        {index + 1} / {exercises.length}
                    </span>
                    <button
                        onClick={handleNext}
                        className="text-sm font-medium text-purple-600 hover:text-purple-800 bg-white px-3 py-1.5 rounded-full shadow-sm"
                    >
                        Sonraki kelime →
                    </button>
                </div>

                {/* Egzersiz kartı */}
                <motion.div
                    key={ex.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[2rem] shadow-lg p-8 text-center mb-6"
                >
                    <div className="text-8xl mb-4">{ex.emoji}</div>
                    <h1 className="text-4xl font-extrabold text-purple-800 tracking-wide mb-3">{ex.metin}</h1>
                    <button
                        onClick={() => speak(ex.metin)}
                        className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-5 py-2 font-bold hover:bg-purple-200 transition"
                    >
                        <Volume2 size={20} /> Dinle
                    </button>
                </motion.div>

                {/* Canlı transcript */}
                <div className="h-8 text-center text-lg text-gray-500 mb-4">
                    {isListening ? `🎤 "${transcript || '...'}"` : transcript ? `"${transcript}"` : ''}
                </div>

                {/* Mikrofon butonu */}
                <div className="flex justify-center mb-8">
                    <motion.button
                        onClick={handleMic}
                        whileTap={{ scale: 0.9 }}
                        animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                        transition={isListening ? { repeat: Infinity, duration: 0.9 } : {}}
                        className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-colors ${
                            isListening ? 'bg-red-500' : 'bg-purple-500 hover:bg-purple-600'
                        }`}
                        aria-label={isListening ? 'Mikrofonu Durdur' : 'Konuşmaya Başla'}
                    >
                        {isListening ? <Square size={36} /> : <Mic size={40} />}
                    </motion.button>
                </div>

                {/* Hata geri bildirimi (skor düşükse) */}
                {result && !showOverlay && result.score < 70 && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white rounded-3xl shadow p-6"
                    >
                        <p className="text-center text-xl font-bold text-orange-500 mb-1">{overlayMessage}</p>
                        <p className="text-center text-gray-400 text-sm mb-3">Skor: {result.score}/100</p>
                        {result.errors.map((e, i) => (
                            <div key={i} className="bg-orange-50 rounded-2xl p-3 mb-2 flex items-start gap-3">
                                <span className="text-2xl">💡</span>
                                <div>
                                    <p className="font-bold text-orange-700">
                                        &quot;{e.expected}&quot; yerine &quot;{e.spoken}&quot; duyuldu
                                    </p>
                                    <p className="text-sm text-gray-600">{e.tip}</p>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={reset}
                            className="w-full mt-3 bg-purple-500 text-white rounded-2xl py-3 font-bold text-lg hover:bg-purple-600 transition"
                        >
                            🔄 Tekrar Dene
                        </button>
                    </motion.div>
                )}

                {error && <p className="text-center text-red-500 font-bold mb-4">{error}</p>}
            </div>

            <PraiseOverlay
                open={showOverlay}
                stars={stars}
                message={overlayMessage}
                onNext={handleNext}
                onRetry={reset}
            />
        </div>
    );
}