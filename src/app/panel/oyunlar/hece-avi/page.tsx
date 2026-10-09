// app/panel/oyunlar/hece-avi/page.tsx — 2. Oyun: Hece Avı (Retro 2D Sinek Yakalama)
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Sparkles, RefreshCw, Trophy, Zap } from 'lucide-react';
import PraiseOverlay from '@/components/game/PraiseOverlay';
import Character from '@/components/game/Character';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useProgress } from '@/hooks/useProgress';
import { heceExercises } from '@/lib/data/heceExercises';
import type { MascotMood } from '@/types';

// Distractor words
const distractors: Record<string, string[]> = {
    el: ['kedi', 'masa', 'güneş', 'kapı'],
    ba: ['kalem', 'çiçek', 'kitap', 'kuş'],
    top: ['şeker', 'ağaç', 'orman', 'ev'],
    ar: ['su', 'deniz', 'göz', 'bulut'],
    kur: ['yıldız', 'gemi', 'tren', 'yol'],
    çi: ['araba', 'biber', 'köpek', 'halı'],
    gök: ['limon', 'bardak', 'çanta', 'ip'],
    şem: ['tavşan', 'balık', 'kurt', 'kuğu'],
};

interface FlyTarget {
    id: string;
    word: string;
    isCorrect: boolean;
    popped: boolean;
    sprite: string;
}

export default function HeceAviPage() {
    const { speak } = useSpeechSynthesis();
    const { addStars, recordSession } = useProgress();

    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [flies, setFlies] = useState<FlyTarget[]>([]);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalTarget, setTotalTarget] = useState(0);
    const [mood, setMood] = useState<MascotMood>('happy');
    const [shakeFlyId, setShakeFlyId] = useState<string | null>(null);
    const [showPraise, setShowPraise] = useState(false);
    const [earnedStars, setEarnedStars] = useState(0);
    const [score, setScore] = useState(0);

    const currentEx = heceExercises[exerciseIndex];

    // Setup level flies
    useEffect(() => {
        if (!currentEx) return;

        const corrects = currentEx.kelimeler.slice(0, 3);
        const wrongs = (distractors[currentEx.hece] || ['kedi', 'kuş', 'elma']).slice(0, 3);

        const items: FlyTarget[] = [
            ...corrects.map((w, idx) => ({
                id: `c-${idx}`,
                word: w,
                isCorrect: true,
                popped: false,
                sprite: '🪰',
            })),
            ...wrongs.map((w, idx) => ({
                id: `w-${idx}`,
                word: w,
                isCorrect: false,
                popped: false,
                sprite: '🪰',
            })),
        ].sort(() => 0.5 - ((currentEx.id + 1) % 2 ? 0.3 : 0.7));

        setFlies(items);
        setCorrectCount(0);
        setTotalTarget(corrects.length);
        setMood('happy');

        speak(`"${currentEx.hece}" hecesi olan sinekleri yakala!`);
    }, [exerciseIndex]);

    // 8-bit sound generator
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

    const handleFlyClick = (fly: FlyTarget) => {
        if (fly.popped) return;

        speak(fly.word);

        if (fly.isCorrect) {
            // Retro 8-bit gulp sound
            playChiptune(440, 'square', 0.1);
            setTimeout(() => playChiptune(880, 'triangle', 0.25), 80);

            setMood('excited'); // frog3.png tongue out
            setFlies(prev =>
                prev.map(item => (item.id === fly.id ? { ...item, popped: true } : item))
            );
            const newCount = correctCount + 1;
            setCorrectCount(newCount);
            setScore(s => s + 50);

            if (newCount >= totalTarget) {
                // Fanfare
                setTimeout(() => playChiptune(1046, 'square', 0.4), 200);
                setTimeout(() => {
                    const stars = 3;
                    setEarnedStars(stars);
                    setShowPraise(true);
                    addStars(stars);
                    recordSession('hece-avi', score + 50, stars, 45);
                }, 600);
            } else {
                setTimeout(() => setMood('happy'), 600);
            }
        } else {
            // Retro buzz error
            playChiptune(150, 'sawtooth', 0.3);
            setShakeFlyId(fly.id);
            setMood('sad');
            setTimeout(() => {
                setShakeFlyId(null);
                setMood('happy');
            }, 500);
        }
    };

    const handleNextExercise = () => {
        setShowPraise(false);
        if (exerciseIndex + 1 < heceExercises.length) {
            setExerciseIndex(i => i + 1);
        } else {
            setExerciseIndex(0);
        }
    };

    return (
        <main className="w-full min-h-screen bg-slate-950 pt-2 md:pt-4 px-4 md:px-6 pb-4 flex flex-col max-w-4xl mx-auto select-none">
            {/* Retro Top Bar */}
            <div className="flex items-center justify-between mb-4 border-b-2 border-slate-800 pb-3">
                <Link
                    href="/panel/oyunlar"
                    className="pixel-btn bg-slate-800 hover:bg-slate-700 text-cyan-400 py-2 px-3 text-xs flex items-center gap-1.5"
                >
                    <ArrowLeft size={14} />
                    <span>GERİ</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="font-pixel text-yellow-400 text-xs md:text-sm flex items-center gap-1.5 bg-slate-900 border-2 border-yellow-400/50 px-3 py-1.5 rounded-lg shadow-sm">
                        <Trophy size={14} />
                        <span>{score} PTS</span>
                    </div>
                    <div className="font-pixel text-[11px] text-cyan-300 bg-slate-900 border-2 border-cyan-400/50 px-3 py-1.5 rounded-lg">
                        STAGE {exerciseIndex + 1}/{heceExercises.length}
                    </div>
                </div>
            </div>

            {/* Target Objective Card */}
            <div className="pixel-box-green p-4 rounded-xl mb-4 flex items-center justify-between relative overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 shrink-0 flex items-center justify-center text-3xl animate-bounce" aria-hidden="true">
                        🪰
                    </div>
                    <div>
                        <p className="font-pixel text-[10px] text-emerald-300 uppercase tracking-wider">
                            HEDEF HECE:
                        </p>
                        <h1 className="font-pixel text-xl md:text-2xl text-yellow-300 drop-shadow-md">
                            &quot;{currentEx.hece.toUpperCase()}&quot;
                        </h1>
                        <p className="text-xs font-bold text-emerald-100">
                            İçinde <span className="underline font-black text-white">{currentEx.hece}</span> hecesi olan sinekleri yakala!
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => speak(currentEx.hece)}
                        className="pixel-btn bg-emerald-600 hover:bg-emerald-500 text-white p-3 text-xs"
                        title="Hecenin sesini dinle"
                    >
                        <Volume2 size={16} />
                    </button>
                </div>
            </div>

            {/* 2D Retro Lake & Lilypad Game Arena */}
            <div className="relative flex-1 rounded-2xl border-4 border-slate-700 overflow-hidden shadow-2xl flex flex-col justify-between min-h-[440px] bg-sky-950">
                <div className="retro-lake-scene absolute inset-0 pointer-events-none z-0 opacity-80" aria-hidden="true" />

                {/* Flying Target Flies Grid */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 p-4 my-auto">
                    {flies.map(fly => {
                        const isShaking = shakeFlyId === fly.id;
                        return (
                            <motion.button
                                key={fly.id}
                                whileHover={{ scale: fly.popped ? 1 : 1.05 }}
                                whileTap={{ scale: fly.popped ? 1 : 0.95 }}
                                animate={isShaking ? { x: [-10, 10, -6, 6, 0] } : undefined}
                                transition={isShaking ? { duration: 0.4 } : undefined}
                                onClick={() => handleFlyClick(fly)}
                                disabled={fly.popped}
                                className={`group relative p-3 md:p-4 rounded-xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer ${
                                    fly.popped
                                        ? 'bg-slate-900/60 border-slate-700 opacity-40 scale-90'
                                        : 'bg-slate-900/85 hover:bg-slate-900 border-yellow-400/80 shadow-md shadow-yellow-900/40'
                                }`}
                            >
                                {fly.popped ? (
                                    <div className="flex flex-col items-center">
                                        <span className="font-pixel text-[11px] text-emerald-400">YAKALANDI!</span>
                                        <span className="font-pixel text-[9px] text-yellow-300">+50 PTS</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative w-12 h-12 md:w-14 md:h-14 mb-1 flex items-center justify-center text-3xl md:text-4xl" aria-hidden="true">
                                            {fly.sprite}
                                        </div>
                                        <span className="font-pixel text-sm md:text-base text-white tracking-wide drop-shadow">
                                            {fly.word}
                                        </span>
                                    </>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Bottom Lilypad & Animated Frog Mascot */}
                <div className="relative z-10 flex flex-col items-center justify-end pb-3 pointer-events-none">
                    <Character mood={mood} size={88} showLilypad={true} />
                </div>
            </div>

            {/* Praise Overlay */}
            <PraiseOverlay
                isOpen={showPraise}
                stars={earnedStars}
                score={score}
                message="TÜM SİNEKLERİ YAKALADIN! 🐸✨"
                onNext={handleNextExercise}
                onRetry={() => {
                    setShowPraise(false);
                    setExerciseIndex(i => i);
                }}
            />
        </main>
    );
}
