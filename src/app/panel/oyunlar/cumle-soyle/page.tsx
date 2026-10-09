// app/panel/oyunlar/cumle-soyle/page.tsx — 3. Oyun: Cümle Tamamlama
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
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

    // Reset when exercise changes
    useEffect(() => {
        setMood('happy');
        setAnalysis(null);
        setShowPraise(false);
        setShowHint(false);
        setCompleted(false);

        const list = [
            current.bosluk,
            ...['koşar', 'uyur', 'yürür', 'bakar'].filter(w => w !== current.bosluk).slice(0, 2),
        ].sort(() => Math.random() - 0.5);
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

        // Check if the target word is inside transcript or matches
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
        // Allow tapping word option too
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
        <main className="min-h-screen bg-game p-4 md:p-8 flex flex-col max-w-4xl mx-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/panel/oyunlar"
                    className="flex items-center gap-2 text-purple-700 font-bold bg-white/80 px-4 py-2 rounded-2xl shadow-sm hover:bg-white transition-all"
                >
                    <ArrowLeft size={18} />
                    <span>Oyunlar</span>
                </Link>
                <div className="bg-white/80 px-4 py-2 rounded-2xl font-bold text-sm text-purple-700 shadow-sm">
                    Cümle {exerciseIndex + 1} / {sentences.length}
                </div>
            </div>

            {/* Mascot & Exercise Card */}
            <div className="card-glass text-center mb-6 relative">
                <div className="flex justify-center mb-2">
                    <Character mood={mood} size={84} />
                </div>

                <span className="text-4xl mb-2 block">{current.emoji}</span>

                {/* Sentence with Blank Highlight */}
                <h1 className="text-2xl md:text-3xl font-black text-purple-900 mb-3 px-4">
                    {completed ? (
                        <span>
                            {current.cumle.split('___')[0]}
                            <span className="text-emerald-600 underline decoration-wavy px-2 bg-emerald-50 rounded-xl">
                                {current.bosluk}
                            </span>
                            {current.cumle.split('___')[1]}
                        </span>
                    ) : (
                        <span>
                            {current.cumle.split('___')[0]}
                            <span className="inline-block border-b-4 border-dashed border-purple-500 text-purple-600 px-3 bg-purple-50 rounded-xl min-w-[80px]">
                                ???
                            </span>
                            {current.cumle.split('___')[1]}
                        </span>
                    )}
                </h1>

                {/* Voice Pronounce & Hint Actions */}
                <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                        onClick={() => speak(current.cumle.replace('___', '...'))}
                        className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                    >
                        <Volume2 size={18} />
                        <span>Cümleyi Dinle</span>
                    </button>

                    <button
                        onClick={() => setShowHint(h => !h)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm py-2 px-4 rounded-full flex items-center gap-2 transition-colors"
                    >
                        <HelpCircle size={18} />
                        <span>İpucu {showHint ? 'Kapat' : 'Göster'}</span>
                    </button>
                </div>

                <AnimatePresence>
                    {showHint && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-sm font-semibold max-w-md mx-auto"
                        >
                            💡 {current.ipucu}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Speaking & Interaction Section */}
            <div className="card text-center mb-6 flex flex-col items-center gap-4">
                <p className="text-sm font-bold text-gray-500">
                    Eksik kelimeyi mikrofona söyle veya aşağıdaki seçeneklerden seç!
                </p>

                {/* Live Audio Visualizer */}
                <SpeechVisualizer isActive={isListening} level={level} bars={9} />

                {/* Microphone Button */}
                <MicrophoneButton
                    isListening={isListening}
                    onToggle={handleToggleMic}
                    size={76}
                />

                {/* Spoken Word Display */}
                {transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-purple-50 px-5 py-2.5 rounded-2xl border border-purple-200 font-black text-purple-900 text-lg"
                    >
                        Senin söylediğin: &quot;{transcript}&quot;
                    </motion.div>
                )}

                {/* Pronunciation Feedback */}
                {analysis && (
                    <div className="w-full max-w-md">
                        <PronunciationFeedback
                            errors={analysis.errors}
                            score={analysis.score}
                        />
                    </div>
                )}

                {/* Choice Pills */}
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelectOption(opt)}
                            className="bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-800 font-black px-5 py-2.5 rounded-2xl border-2 border-purple-200 hover:border-purple-600 transition-all text-base shadow-sm active:scale-95"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Praise Overlay */}
            <PraiseOverlay
                isOpen={showPraise}
                stars={stars}
                score={analysis?.score ?? 100}
                onNext={handleNext}
                onRetry={() => {
                    setShowPraise(false);
                    setCompleted(false);
                    setAnalysis(null);
                }}
            />
        </main>
    );
}
