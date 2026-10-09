// app/panel/oyunlar/hece-avi/page.tsx — Hece Avı Oyunu
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
            })),
            ...wrongs.map((w, idx) => ({
                id: `w-${idx}`,
                word: w,
                isCorrect: false,
                popped: false,
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
            // Success sound
            playChiptune(440, 'square', 0.1);
            setTimeout(() => playChiptune(880, 'triangle', 0.25), 80);

            setMood('excited');
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
            // Error sound
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

                <div className="flex items-center gap-4">
                    <div className="badge badge-yellow">
                        <Trophy className="w-3 h-3" />
                        {score} PUAN
                    </div>
                    <div className="badge badge-emerald">
                        STAGE {exerciseIndex + 1}/{heceExercises.length}
                    </div>
                </div>
            </motion.div>

            {/* Target Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card card-colored-green p-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center animate-bounce-subtle">
                            <span className="text-3xl" aria-hidden="true">🪰</span>
                        </div>
                        <div>
                            <p className="font-rounded text-sm text-green-700 uppercase tracking-wider">Hedef Hece</p>
                            <h2 className="font-fun text-3xl text-green-800">&apos;{currentEx.hece.toUpperCase()}&apos;</h2>
                            <p className="text-green-600 text-sm mt-1">
                                İçinde <span className="font-bold underline">{currentEx.hece}</span> hecesi olan sinekleri yakala!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => speak(currentEx.hece)}
                        className="btn btn-primary btn-icon"
                        title="Hecenin sesini dinle"
                    >
                        <Volume2 className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Game Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card card-elevated p-6 relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-100/50 rounded-full blur-3xl" />

                {/* Flies Grid */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {flies.map((fly, index) => (
                        <motion.button
                            key={fly.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1,
                                x: shakeFlyId === fly.id ? [-8, 8, -6, 6, 0] : 0
                            }}
                            transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                            whileHover={{ scale: fly.popped ? 1 : 1.05 }}
                            whileTap={{ scale: fly.popped ? 1 : 0.95 }}
                            onClick={() => handleFlyClick(fly)}
                            disabled={fly.popped}
                            className={`relative group p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                                fly.popped
                                    ? 'bg-gray-100 border-gray-200 opacity-50 scale-95'
                                    : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-lg shadow-sm'
                            }`}
                        >
                            {fly.popped ? (
                                <motion.div
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    className="flex flex-col items-center"
                                >
                                    <span className="font-fun text-sm text-green-600">YAKALANDI!</span>
                                    <span className="font-fun text-xs text-yellow-600">+50 PUAN</span>
                                </motion.div>
                            ) : (
                                <>
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                                        className="w-16 h-16 mb-2 flex items-center justify-center"
                                        aria-hidden="true"
                                    >
                                        <span className="text-4xl drop-shadow-lg" aria-hidden="true">🪰</span>
                                    </motion.div>
                                    <span className="font-fun text-base text-gray-800 text-center">{fly.word}</span>
                                </>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Frog at bottom */}
                <div className="relative z-10 flex justify-center pt-6">
                    <Character mood={mood} size={100} showLilypad={true} />
                </div>
            </motion.div>

            {/* Praise Overlay */}
            <PraiseOverlay
                isOpen={showPraise}
                stars={earnedStars}
                score={score}
                message="TÜM SİNEKLERİ YAKALADIN! 🎉"
                onNext={handleNextExercise}
                onRetry={() => {
                    setShowPraise(false);
                    setExerciseIndex(i => i);
                }}
            />
        </div>
    );
}