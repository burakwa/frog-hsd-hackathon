// app/panel/page.tsx — Retro Arcade Ana Panel
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, TrendingUp, Star, Flame, Play, Trophy, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import Character from '@/components/game/Character';
import ProgressBar from '@/components/ui/ProgressBar';
import { starsToLevel } from '@/lib/utils/helpers';

const dailyTasks = [
    { id: 1, title: 'Ses Tekrarı', desc: '5 kelime söyle ve telaffuz et', emoji: '🎤', href: '/panel/oyunlar/ses-tekrari', points: 10, bg: 'border-yellow-400' },
    { id: 2, title: 'Hece Avı', desc: 'Göldeki 3 hedef sineği yakala', emoji: '🪰', href: '/panel/oyunlar/hece-avi', points: 15, bg: 'border-emerald-400' },
    { id: 3, title: 'Cümle Söyle', desc: '2 eksik cümleyi tamamla', emoji: '💬', href: '/panel/oyunlar/cumle-soyle', points: 20, bg: 'border-cyan-400' },
    { id: 4, title: 'Sesli Masal', desc: '1 eğlenceli masal dinle & oku', emoji: '📖', href: '/panel/oyunlar/sesli-masal', points: 25, bg: 'border-purple-400' },
];

export default function PanelPage() {
    const { user } = useAuth();
    const { totalStars, sessions } = useProgress(user?.id);
    const level = starsToLevel(totalStars);
    const levelProgress = (totalStars % 10) * 10;
    const name = user?.user_metadata?.ad || user?.email?.split('@')[0] || 'KAHRAMAN';

    return (
        <div className="w-full pt-2 md:pt-4 px-4 md:px-6 pb-4 max-w-3xl mx-auto space-y-6 select-none">
            {/* Retro Player Greeting Banner */}
            <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pixel-box p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 bg-slate-900 border-indigo-500 shadow-xl"
            >
                <div className="shrink-0">
                    <Character mood="happy" size={68} showLilypad={true} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <p className="font-pixel text-[10px] text-cyan-400 mb-1">PLAYER 1 CONNECTED</p>
                    <h1 className="font-pixel text-xl md:text-2xl text-yellow-300 drop-shadow">
                        HOŞ GELDİN, {name.toUpperCase()}! 👋
                    </h1>
                    <p className="font-arcade text-xs text-slate-300 mt-1">
                        Bugünkü konuşma görevlerini tamamla ve yeni rozetler kazan!
                    </p>
                </div>
            </motion.div>

            {/* Retro 3-Column Arcade Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="pixel-box p-3 md:p-4 text-center rounded-xl bg-slate-900 border-yellow-400">
                    <span className="text-2xl mb-1 block">⭐</span>
                    <p className="font-pixel text-lg md:text-2xl text-yellow-300">{totalStars}</p>
                    <p className="font-pixel text-[9px] md:text-[10px] text-slate-400 uppercase mt-0.5">YILDIZ</p>
                </div>

                <div className="pixel-box p-3 md:p-4 text-center rounded-xl bg-slate-900 border-emerald-400">
                    <span className="text-2xl mb-1 block">🏆</span>
                    <p className="font-pixel text-lg md:text-2xl text-emerald-400">LVL {level}</p>
                    <p className="font-pixel text-[9px] md:text-[10px] text-slate-400 uppercase mt-0.5">SEVİYE</p>
                </div>

                <div className="pixel-box p-3 md:p-4 text-center rounded-xl bg-slate-900 border-purple-400">
                    <span className="text-2xl mb-1 block">🎮</span>
                    <p className="font-pixel text-lg md:text-2xl text-purple-400">{sessions.length}</p>
                    <p className="font-pixel text-[9px] md:text-[10px] text-slate-400 uppercase mt-0.5">SEANS</p>
                </div>
            </div>

            {/* Level XP Progress Bar */}
            <div className="pixel-box p-4 rounded-xl bg-slate-900 border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Flame size={16} className="text-orange-400" />
                        <span className="font-pixel text-[11px] text-white">
                            LEVEL {level} → LEVEL {level + 1}
                        </span>
                    </div>
                    <span className="font-pixel text-[10px] text-yellow-400">
                        {totalStars % 10}/10 EXP
                    </span>
                </div>
                <div className="w-full bg-slate-950 h-4 rounded border-2 border-slate-700 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                    />
                </div>
            </div>

            {/* Daily Quests Section */}
            <div>
                <h2 className="font-pixel text-sm md:text-base text-yellow-400 mb-3 flex items-center gap-2">
                    <span>⚔️</span>
                    <span>GÜNLÜK GÖREVLER (DAILY QUESTS)</span>
                </h2>

                <div className="space-y-3">
                    {dailyTasks.map((task) => (
                        <Link key={task.id} href={task.href} className="block">
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`pixel-box p-4 rounded-xl flex items-center gap-4 bg-slate-900 ${task.bg} transition-all cursor-pointer`}
                            >
                                <span className="text-3xl shrink-0">{task.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-pixel text-xs md:text-sm text-white mb-1 truncate">
                                        {task.title}
                                    </h3>
                                    <p className="font-arcade text-xs text-slate-400">
                                        {task.desc}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <span className="font-pixel text-[10px] text-yellow-300 bg-black/60 px-2.5 py-1.5 rounded border border-yellow-400/40 inline-flex items-center gap-1">
                                        +{task.points} ★
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Play CTA Button */}
            <div className="text-center pt-2">
                <Link href="/panel/oyunlar" className="inline-block">
                    <button className="pixel-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 px-8 text-sm flex items-center gap-2">
                        <Play size={16} className="fill-slate-950" />
                        <span>TÜM OYUNLARI GÖR (ARCADE)</span>
                    </button>
                </Link>
            </div>
        </div>
    );
}
