// app/panel/oyunlar/hece-avi/page.tsx — 2. Oyun: Hece Yakalama (2D Mini Oyun)
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import PraiseOverlay from '@/components/game/PraiseOverlay';
import Character from '@/components/game/Character';
import StarRating from '@/components/game/StarRating';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useProgress } from '@/hooks/useProgress';
import { heceExercises } from '@/lib/data/heceExercises';
import type { MascotMood } from '@/types';

// Distractor words for bubbles
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

interface Bubble {
    id: string;
    word: string;
    isCorrect: boolean;
    popped: boolean;
    x: number;
    y: number;
}

export default function HeceAviPage() {
    const { speak } = useSpeechSynthesis();
    const { addStars, recordSession } = useProgress();

    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalTarget, setTotalTarget] = useState(0);
    const [mood, setMood] = useState<MascotMood>('happy');
    const [shakeBubbleId, setShakeBubbleId] = useState<string | null>(null);
    const [showPraise, setShowPraise] = useState(false);
    const [earnedStars, setEarnedStars] = useState(0);
    const [score, setScore] = useState(0);

    const currentEx = heceExercises[exerciseIndex];

    // Setup level bubbles
    useEffect(() => {
        if (!currentEx) return;

        const corrects = currentEx.kelimeler.slice(0, 3);
        const wrongs = (distractors[currentEx.hece] || ['kedi', 'kuş', 'elma']).slice(0, 3);

        const items = [
            ...corrects.map((w, idx) => ({ id: `c-${idx}`, word: w, isCorrect: true, popped: false })),
            ...wrongs.map((w, idx) => ({ id: `w-${idx}`, word: w, isCorrect: false, popped: false })),
        ].sort(() => Math.random() - 0.5);

        // Assign positions
        const generated = items.map((item, i) => ({
            ...item,
            x: 10 + (i % 3) * 30 + (Math.random() * 8 - 4),
            y: 15 + Math.floor(i / 3) * 45 + (Math.random() * 10 - 5),
        }));

        setBubbles(generated);
        setCorrectCount(0);
        setTotalTarget(corrects.length);
        setMood('happy');

        // Pronounce syllable guidance
        speak(`İçinde "${currentEx.hece}" hecesi olan balonları patlat!`);
    }, [exerciseIndex]);

    const playAudioPing = (freq: number, type: OscillatorType = 'sine') => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch {
            // ignore WebAudio restrictions
        }
    };

    const handleBubbleClick = (b: Bubble) => {
        if (b.popped) return;

        speak(b.word);

        if (b.isCorrect) {
            playAudioPing(600);
            setBubbles(prev =>
                prev.map(item => (item.id === b.id ? { ...item, popped: true } : item))
            );
            const newCount = correctCount + 1;
            setCorrectCount(newCount);
            setScore(s => s + 25);
            setMood('excited');

            if (newCount >= totalTarget) {
                // Completed this round!
                playAudioPing(880);
                setTimeout(() => {
                    const stars = 3;
                    setEarnedStars(stars);
                    setShowPraise(true);
                    addStars(stars);
                    recordSession('hece-avi', score + 25, stars, 45);
                }, 600);
            }
        } else {
            // Incorrect
            playAudioPing(220, 'square');
            setShakeBubbleId(b.id);
            setMood('sad');
            setTimeout(() => {
                setShakeBubbleId(null);
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
        <main className="min-h-screen bg-game p-4 md:p-8 flex flex-col max-w-4xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/panel/oyunlar"
                    className="flex items-center gap-2 text-purple-700 font-bold bg-white/80 px-4 py-2 rounded-2xl shadow-sm hover:bg-white transition-all"
                >
                    <ArrowLeft size={18} />
                    <span>Oyunlar</span>
                </Link>

                <div className="flex items-center gap-3">
                    <div className="bg-white/80 px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-amber-600 shadow-sm">
                        <Trophy size={18} />
                        <span>{score} Puan</span>
                    </div>
                    <div className="bg-white/80 px-3 py-1.5 rounded-2xl font-bold text-xs text-purple-600">
                        Seviye {exerciseIndex + 1}/{heceExercises.length}
                    </div>
                </div>
            </div>

            {/* Target Header Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card-glass text-center mb-6 relative overflow-hidden"
            >
                <div className="flex items-center justify-center gap-4">
                    <Character mood={mood} size={70} />
                    <div className="text-left">
                        <p className="text-xs font-black text-purple-600 uppercase tracking-widest flex items-center gap-1">
                            <Sparkles size={14} /> Hece Hedefi
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black text-purple-900">
                            &quot;{currentEx.hece.toUpperCase()}&quot; Hecesini Bul!
                        </h1>
                        <p className="text-sm text-gray-500 font-bold">
                            İçinde <span className="text-purple-700 underline font-black">{currentEx.hece}</span> geçen balonları patlat!
                        </p>
                    </div>

                    <button
                        onClick={() => speak(currentEx.hece)}
                        className="ml-auto w-12 h-12 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center transition-all shadow-sm"
                        title="Hecenin sesini dinle"
                    >
                        <Volume2 size={24} />
                    </button>
                </div>

                {/* Progress Indicators */}
                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: totalTarget }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-3 w-10 rounded-full transition-all duration-300 ${
                                i < correctCount ? 'bg-green-500 shadow-md shadow-green-200' : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
            </motion.div>

            {/* 2D Interactive Pond Game Board */}
            <div className="flex-1 bg-gradient-to-b from-sky-100 via-teal-50 to-emerald-100 rounded-3xl border-4 border-white/80 shadow-xl p-6 relative min-h-[380px] overflow-hidden flex flex-col justify-between">
                {/* Decorative Pond water lilies & sparkles */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <span className="absolute top-10 left-8 text-4xl">🪷</span>
                    <span className="absolute bottom-8 right-12 text-4xl">🌿</span>
                    <span className="absolute top-1/2 right-1/4 text-3xl">🫧</span>
                    <span className="absolute bottom-16 left-1/4 text-3xl">🫧</span>
                </div>

                {/* Grid of Floating Bubbles */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 relative z-10 my-auto">
                    {bubbles.map(bubble => {
                        const isShaking = shakeBubbleId === bubble.id;
                        return (
                            <motion.button
                                key={bubble.id}
                                whileHover={{ scale: bubble.popped ? 1 : 1.05 }}
                                whileTap={{ scale: bubble.popped ? 1 : 0.95 }}
                                animate={
                                    isShaking
                                        ? { x: [-8, 8, -6, 6, 0] }
                                        : { y: [0, -6, 0] }
                                }
                                transition={
                                    isShaking
                                        ? { duration: 0.4 }
                                        : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                                }
                                onClick={() => handleBubbleClick(bubble)}
                                disabled={bubble.popped}
                                className={`h-28 md:h-32 rounded-3xl p-4 flex flex-col items-center justify-center font-black transition-all shadow-lg ${
                                    bubble.popped
                                        ? 'bg-emerald-500/20 border-2 border-dashed border-emerald-400 text-emerald-600 scale-90 opacity-60'
                                        : 'bg-white/90 backdrop-blur-md hover:bg-white text-purple-900 border-2 border-white shadow-purple-100 cursor-pointer active:scale-95'
                                }`}
                            >
                                {bubble.popped ? (
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl">✨</span>
                                        <span className="text-xs font-bold text-emerald-700 mt-1">Harika!</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-3xl mb-1">🫧</span>
                                        <span className="text-xl md:text-2xl font-black tracking-wide">
                                            {bubble.word}
                                        </span>
                                    </>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Bottom Lilypad with Mascot */}
                <div className="mt-4 flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/60">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🐸</span>
                        <p className="text-xs md:text-sm font-bold text-purple-800">
                            Hedef hece: <span className="text-emerald-700 font-black text-base">{currentEx.hece}</span>
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setExerciseIndex(i => (i + 1) % heceExercises.length);
                        }}
                        className="flex items-center gap-1.5 text-xs font-black text-purple-600 hover:text-purple-900 px-3 py-1.5 rounded-xl hover:bg-purple-100/60 transition-all"
                    >
                        <RefreshCw size={14} />
                        <span>Farklı Hece</span>
                    </button>
                </div>
            </div>

            {/* Praise overlay modal */}
            <PraiseOverlay
                isOpen={showPraise}
                stars={earnedStars}
                onNext={handleNextExercise}
                onRetry={() => {
                    setShowPraise(false);
                    setExerciseIndex(i => i);
                }}
            />
        </main>
    );
}
