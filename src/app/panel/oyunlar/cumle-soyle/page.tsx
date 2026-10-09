// app/panel/oyunlar/cumle-soyle/page.tsx — 3. Oyun: Cümle Tamamlama (Retro RPG Tarzı)
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, HelpCircle, CheckCircle2 } from 'lucide-react';
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
        <main className="w-full min-h-screen bg-slate-950 pt-2 md:pt-4 px-4 md:px-6 pb-4 flex flex-col max-w-4xl mx-auto select-none">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4 border-b-2 border-slate-800 pb-3">
                <Link
                    href="/panel/oyunlar"
                    className="pixel-btn bg-slate-800 hover:bg-slate-700 text-cyan-400 py-2 px-3 text-xs flex items-center gap-1.5"
                >
                    <ArrowLeft size={14} />
                    <span>GERİ</span>
                </Link>
                <div className="font-pixel text-yellow-400 text-xs bg-slate-900 border-2 border-yellow-400/50 px-3 py-1.5 rounded-lg shadow-sm">
                    QUEST {exerciseIndex + 1} / {sentences.length}
                </div>
            </div>

            {/* Retro RPG Dialogue Box Card */}
            <div className="relative pixel-box bg-slate-900/90 border-cyan-400 p-6 rounded-2xl mb-4 overflow-hidden">
                <div className="retro-lake-scene absolute inset-0 pointer-events-none z-0 opacity-35" aria-hidden="true" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-2">
                        <Character mood={mood} size={72} showLilypad={true} />
                    </div>

                    <span className="text-4xl mb-2">{current.emoji}</span>

                    {/* Sentence with Blank Highlight */}
                    <h1 className="font-pixel text-lg md:text-xl text-white mb-4 leading-relaxed max-w-2xl">
                        {completed ? (
                            <span>
                                {current.cumle.split('___')[0]}
                                <span className="text-emerald-400 underline decoration-wavy px-2 bg-emerald-950/80 rounded border border-emerald-400">
                                    {current.bosluk.toUpperCase()}
                                </span>
                                {current.cumle.split('___')[1]}
                            </span>
                        ) : (
                            <span>
                                {current.cumle.split('___')[0]}
                                <span className="inline-block border-b-4 border-dashed border-yellow-400 text-yellow-300 px-3 bg-yellow-950/60 rounded">
                                    [ ??? ]
                                </span>
                                {current.cumle.split('___')[1]}
                            </span>
                        )}
                    </h1>

                    {/* Audio & Hint Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => speak(current.cumle.replace('___', '...'))}
                            className="pixel-btn bg-slate-800 hover:bg-slate-700 text-cyan-300 py-2 px-3 text-xs flex items-center gap-2"
                        >
                            <Volume2 size={14} /> DİNLE
                        </button>

                        <button
                            onClick={() => setShowHint(h => !h)}
                            className="pixel-btn bg-amber-600 hover:bg-amber-500 text-slate-950 py-2 px-3 text-xs flex items-center gap-1.5"
                        >
                            <HelpCircle size={14} />
                            <span>İPUCU {showHint ? 'KAPAT' : 'GÖSTER'}</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {showHint && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 p-2.5 bg-amber-950 border border-amber-500 text-amber-200 text-xs font-arcade rounded-xl max-w-md mx-auto"
                            >
                                💡 İPUCU: {current.ipucu}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Retro Microphone & Choice Pills Section */}
            <div className="pixel-box p-4 rounded-xl flex flex-col items-center gap-3">
                <p className="font-pixel text-[10px] text-slate-400 text-center">
                    KELİMEYİ MİKROFONA SÖYLE VEYA AŞAĞIDAN SEÇ!
                </p>

                <SpeechVisualizer isActive={isListening} level={level} bars={9} />

                <MicrophoneButton
                    isListening={isListening}
                    onToggle={handleToggleMic}
                    size={76}
                />

                {transcript && (
                    <div className="bg-slate-900 border border-cyan-400 font-pixel text-xs text-yellow-300 px-4 py-2 rounded-lg">
                        DUYULAN: &quot;{transcript}&quot;
                    </div>
                )}

                {analysis && (
                    <div className="w-full max-w-md">
                        <PronunciationFeedback
                            errors={analysis.errors}
                            score={analysis.score}
                        />
                    </div>
                )}

                {/* Choice Pills as Retro Arcade Buttons */}
                <div className="mt-2 flex flex-wrap gap-2.5 justify-center">
                    {options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelectOption(opt)}
                            className="pixel-btn bg-slate-900 hover:bg-indigo-600 text-yellow-300 hover:text-white border-yellow-400 py-2.5 px-4 text-xs tracking-wider"
                        >
                            ▶ {opt.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

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
        </main>
    );
}
