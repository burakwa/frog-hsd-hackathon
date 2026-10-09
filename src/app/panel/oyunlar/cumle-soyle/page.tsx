// app/panel/oyunlar/cumle-soyle/page.tsx — Cümle Söyle Oyunu
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, HelpCircle, CheckCircle2, Mic } from 'lucide-react';
import PraiseOverlay from '@/components/game/PraiseOverlay';
import Character from '@/components/game/Character';
import MicrophoneButton from '@/components/speech/MicrophoneButton';
import SpeechVisualizer from '@/components/speech/SpeechVisualizer';
import PronunciationFeedback from '@/components/speech/PronunciationFeedback';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useMicrophone } from '@/hooks/useMicrophone';
import { useProgress } from '@/hooks/useProgress';
import { sentences } from '@/lib/data/sentences';
import { analyze, type AnalysisResult } from '@/lib/comparison/analyze';
import type { MascotMood } from '@/types';

export default function CumleSoylePage() {
    const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();
    const { speak } = useSpeechSynthesis();
    const { level, start: startMic, stop: stopMic } = useMicrophone();
    const { addStars, recordSession } = useProgress();

    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [mood, setMood] = useState<MascotMood>('happy');
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [showPraise, setShowPraise] = useState(false);
    const [stars, setStars] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [options, setOptions] = useState<string[]>([]);

    const current = sentences[exerciseIndex];

    useEffect(() => {
        setMood('happy');
        setAnalysis(null);
        setShowPraise(false);
        setShowHint(false);
        setCompleted(false);

        const list = [
            current.bosluk,
            ...['koşar', 'uyur', 'yürür', 'bakar'].filter(w => w !== current.bosluk).slice(0, 2),
        ].sort(() => 0.5 - ((current.id % 2) ? 0.3 : 0.7));
        setOptions(list);
    }, [exerciseIndex]);

    const handleToggleMic = async () => {
        if (isListening) {
            stopListening();
            stopMic();
            setMood('thinking');
        } else {
            setAnalysis(null);
            await startMic();
            startListening();
            setMood('speaking');
        }
    };

    // Analyze spoken transcript
    useEffect(() => {
        if (!transcript || isListening) return;

        const targetWord = current.bosluk.toLowerCase();
        const spokenNormalized = transcript.toLowerCase();
        const matchesWord = spokenNormalized.includes(targetWord);
        const result = analyze(targetWord, transcript);

        setAnalysis(result);

        if (matchesWord || result.score >= 65) {
            setCompleted(true);
            setMood('excited');
            const earnedStars = result.score >= 85 ? 3 : result.score >= 65 ? 2 : 1;
            setStars(earnedStars);
            setTimeout(() => {
                setShowPraise(true);
                addStars(earnedStars);
                recordSession('cumle-soyle', result.score, earnedStars, 30);
            }, 600);
        } else {
            setMood('sad');
        }
    }, [transcript, isListening]);

    const handleNext = () => {
        setShowPraise(false);
        if (exerciseIndex + 1 < sentences.length) {
            setExerciseIndex(i => i + 1);
        } else {
            setExerciseIndex(0);
        }
    };

    const handleSelectOption = (word: string) => {
        const targetWord = current.bosluk.toLowerCase();
        const result = analyze(targetWord, word.toLowerCase());
        setAnalysis(result);

        if (result.score >= 65 || word.toLowerCase() === targetWord) {
            setCompleted(true);
            setMood('excited');
            const earnedStars = 3;
            setStars(earnedStars);
            speak(current.cumle.replace('___', word));
            setTimeout(() => {
                setShowPraise(true);
                addStars(earnedStars);
                recordSession('cumle-soyle', 100, earnedStars, 20);
            }, 800);
        } else {
            setMood('sad');
            speak('Tekrar dene');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
            {/* Top Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <Link
                    href="/panel/oyunlar"
                    className="btn btn-ghost btn-small"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Geri
                </Link>
                <div className="badge badge-blue">
                    QUEST {exerciseIndex + 1} / {sentences.length}
                </div>
            </motion.div>

            {/* Sentence Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card card-elevated p-6 md:p-8 relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100/50 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Frog */}
                    <div className="mb-4">
                        <Character mood={mood} size={80} showLilypad={true} />
                    </div>

                    <span className="text-5xl mb-4">{current.emoji}</span>

                    {/* Sentence with Blank */}
                    <h1 className="font-fun text-xl md:text-2xl text-gray-800 mb-6 leading-relaxed max-w-2xl text-center">
                        {completed ? (
                            <span>
                                {current.cumle.split('___')[0]}
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-xl font-bold underline decoration-wavy underline-offset-4">
                                    {current.bosluk.toUpperCase()}
                                </span>
                                {current.cumle.split('___')[1]}
                            </span>
                        ) : (
                            <span>
                                {current.cumle.split('___')[0]}
                                <span className="inline-block border-b-4 border-dashed border-yellow-400 text-yellow-600 px-4 bg-yellow-50 rounded-xl font-bold">
                                    [ ??? ]
                                </span>
                                {current.cumle.split('___')[1]}
                            </span>
                        )}
                    </h1>

                    {/* Audio & Hint Buttons */}
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => speak(current.cumle.replace('___', '...'))}
                            className="btn btn-secondary"
                        >
                            <Volume2 className="w-4 h-4" />
                            Dinle
                        </button>

                        <button
                            onClick={() => setShowHint(h => !h)}
                            className="btn btn-accent"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span>İpucu {showHint ? 'Kapat' : 'Göster'}</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {showHint && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm font-rounded"
                            >
                                💡 İpucu: {current.ipucu}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Microphone & Options */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card card-elevated p-6"
            >
                <p className="font-rounded text-sm text-gray-500 text-center mb-4">
                    Kelimeyi mikrofonla söyle veya aşağıdan seç!
                </p>

                <div className="mb-6">
                    <SpeechVisualizer isActive={isListening} level={level} bars={9} />
                </div>

                <div className="flex justify-center mb-6">
                    <MicrophoneButton
                        isListening={isListening}
                        onToggle={handleToggleMic}
                        size={76}
                    />
                </div>

                {transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center"
                    >
                        <span className="font-fun text-sm text-blue-700">Duyulan: </span>
                        <span className="font-mono text-blue-800">"{transcript}"</span>
                    </motion.div>
                )}

                {analysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md mx-auto mb-6"
                    >
                        <PronunciationFeedback
                            errors={analysis.errors}
                            score={analysis.score}
                        />
                    </motion.div>
                )}

                {/* Word Options */}
                <div className="flex flex-wrap gap-3 justify-center">
                    {options.map((opt, i) => (
                        <motion.button
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            onClick={() => handleSelectOption(opt)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn btn-secondary px-6 py-3 group"
                        >
                            <Mic className="w-4 h-4 transition-transform group-hover:scale-110" />
                            {opt.toUpperCase()}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <PraiseOverlay
                isOpen={showPraise}
                stars={stars}
                score={analysis?.score ?? 100}
                message="CÜMLE TAMAMLANDI! 🌟"
                onNext={handleNext}
                onRetry={() => {
                    setShowPraise(false);
                    setCompleted(false);
                    setAnalysis(null);
                }}
            />
        </div>
    );
}