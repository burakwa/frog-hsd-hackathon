'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, TrendingUp, Star, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import Character from '@/components/game/Character';
import ProgressBar from '@/components/ui/ProgressBar';
import { starsToLevel } from '@/lib/utils/helpers';

const dailyTasks = [
    { id: 1, title: 'Ses Tekrarı', desc: 'Bugün 5 kelime söyle', emoji: '🎤', href: '/panel/oyunlar/ses-tekrari', points: 10 },
    { id: 2, title: 'Hece Avı', desc: '3 hece yakala', emoji: '🦋', href: '/panel/oyunlar/hece-avi', points: 15 },
    { id: 3, title: 'Cümle Söyle', desc: '2 cümle tamamla', emoji: '💬', href: '/panel/oyunlar/cumle-soyle', points: 20 },
    { id: 4, title: 'Sesli Masal', desc: '1 eğlenceli masal dinle & oku', emoji: '📖', href: '/panel/oyunlar/sesli-masal', points: 25 },
];

export default function PanelPage() {
    const { user } = useAuth();
    const { totalStars, sessions } = useProgress(user?.id);
    const level = starsToLevel(totalStars);
    const levelProgress = (totalStars % 10) * 10;
    const name = user?.user_metadata?.ad || user?.email?.split('@')[0] || 'Kahraman';

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Greeting */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="card-glass mb-6 flex items-center gap-4"
            >
                <Character mood="happy" size={70} />
                <div className="flex-1">
                    <p className="text-sm font-bold text-purple-400 mb-0.5">Hoş geldin!</p>
                    <h1 className="text-2xl font-black text-purple-800">{name} 👋</h1>
                    <p className="text-sm text-gray-500 font-semibold">
                        Bugün de harika bir gün olacak! 🌟
                    </p>
                </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-3 mb-6"
            >
                {[
                    { label: 'Toplam ⭐', value: totalStars, icon: Star, color: 'from-yellow-400 to-amber-500' },
                    { label: 'Seviye', value: level, icon: TrendingUp, color: 'from-purple-500 to-purple-700' },
                    { label: 'Oyun', value: sessions.length, icon: Gamepad2, color: 'from-pink-400 to-pink-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="card text-center p-4">
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
                            <Icon size={18} className="text-white" />
                        </div>
                        <p className="text-2xl font-black text-gray-800">{value}</p>
                        <p className="text-xs font-bold text-gray-400">{label}</p>
                    </div>
                ))}
            </motion.div>

            {/* Level progress */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="card mb-6"
            >
                <div className="flex items-center gap-2 mb-3">
                    <Flame size={18} className="text-orange-500" />
                    <h2 className="font-black text-gray-700">Seviye {level} → {level + 1}</h2>
                    <span className="ml-auto text-xs font-bold text-gray-400">{totalStars % 10}/10 ⭐</span>
                </div>
                <ProgressBar value={levelProgress} showPercent={false} height="h-4" />
            </motion.div>

            {/* Daily tasks */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="font-black text-gray-700 text-lg mb-3 flex items-center gap-2">
                    🎯 Günlük Görevler
                </h2>
                <div className="flex flex-col gap-3">
                    {dailyTasks.map((task, i) => (
                        <motion.div
                            key={task.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                        >
                            <Link href={task.href}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="card flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                                >
                                    <span className="text-3xl">{task.emoji}</span>
                                    <div className="flex-1">
                                        <p className="font-black text-gray-800">{task.title}</p>
                                        <p className="text-sm text-gray-500 font-semibold">{task.desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                                            +{task.points} ⭐
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Quick link to all games */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
            >
                <Link href="/panel/oyunlar">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="btn-primary inline-flex py-3 px-8 text-base">
                        🎮 Tüm Oyunları Gör
                    </motion.div>
                </Link>
            </motion.div>
        </div>
    );
}
