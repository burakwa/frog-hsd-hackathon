// app/panel/page.tsx — Clean Dashboard
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, TrendingUp, Star, Flame, Play, Trophy, Sparkles, Target, Award, Mic, Bug, MessageCircle, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import Character from '@/components/game/Character';
import { starsToLevel } from '@/lib/utils/helpers';

type ColorKey = 'green' | 'blue' | 'yellow' | 'purple';

interface ColorClass {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
}

const colorClasses: Record<ColorKey, ColorClass> = {
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', iconBg: 'bg-green-100' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', iconBg: 'bg-yellow-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconBg: 'bg-purple-100' },
};

const dailyTasks = [
    { id: 1, title: 'Ses Tekrarı', desc: '5 kelime söyle ve telaffuz et', icon: Mic, href: '/panel/oyunlar/ses-tekrari', points: 10, color: 'green' as ColorKey },
    { id: 2, title: 'Hece Avı', desc: 'Göldeki 3 hedef sineği yakala', icon: Bug, href: '/panel/oyunlar/hece-avi', points: 15, color: 'blue' as ColorKey },
    { id: 3, title: 'Cümle Söyle', desc: '2 eksik cümleyi tamamla', icon: MessageCircle, href: '/panel/oyunlar/cumle-soyle', points: 20, color: 'yellow' as ColorKey },
    { id: 4, title: 'Sesli Masal', desc: '1 eğlenceli masal dinle & oku', icon: BookOpen, href: '/panel/oyunlar/sesli-masal', points: 25, color: 'purple' as ColorKey },
];

export default function PanelPage() {
    const { user } = useAuth();
    const { totalStars, sessions } = useProgress();
    const level = starsToLevel(totalStars);
    const levelProgress = (totalStars % 10) * 10;
    const name = user?.user_metadata?.ad || user?.email?.split('@')[0] || 'KAHRAMAN';

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card card-elevated p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 opacity-50" />
                <div className="relative shrink-0">
                    <Character mood="happy" size={80} showLilypad={true} />
                </div>
                <div className="relative flex-1 text-center md:text-left">
                    <p className="font-rounded text-sm text-green-700 mb-2">🎮 HOŞ GELDİN, {name.toUpperCase()}!</p>
                    <h1 className="font-fun text-2xl md:text-3xl text-gray-800 mb-2">
                        Bugün de harika bir gün olacak!
                    </h1>
                    <p className="text-gray-600">
                        Konuşma görevlerini tamamla, yıldız kazanın ve seviye atlayın 🌟
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    icon={<Star className="w-6 h-6" />}
                    value={totalStars}
                    label="Toplam Yıldız"
                    color="yellow"
                    delay={0}
                />
                <StatCard
                    icon={<Trophy className="w-6 h-6" />}
                    value={`Seviye ${level}`}
                    label="Seviye"
                    color="green"
                    delay={0.1}
                />
                <StatCard
                    icon={<Gamepad2 className="w-6 h-6" />}
                    value={sessions.length}
                    label="Oynanan Oyun"
                    color="blue"
                    delay={0.2}
                />
            </div>

            {/* Level Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card card-elevated p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="font-fun text-gray-700">Seviye {level} → {level + 1}</span>
                    </div>
                    <span className="font-fun text-green-700">{totalStars % 10}/10 XP</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    />
                </div>
            </motion.div>

            {/* Daily Quests */}
            <div>
                <h2 className="font-fun text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Günlük Görevler
                </h2>
                <div className="space-y-3">
                    {dailyTasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <DailyTaskCard task={task} />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="card card-colored-green p-6 text-center"
            >
                <h3 className="font-fun text-xl text-green-800 mb-2">Hazır mısın?</h3>
                <p className="text-green-700 mb-4">Tüm oyunları keşfet ve bugünkü macerana başla!</p>
                <Link href="/panel/oyunlar">
                    <button className="btn btn-primary btn-large group">
                        <Play className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        Oyunlara Git
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}

function StatCard({ icon, value, label, color, delay }: { 
    icon: React.ReactNode; 
    value: string | number; 
    label: string; 
    color: ColorKey;
    delay: number;
}) {
    const colors = colorClasses[color];
    
    const iconBg = {
        green: 'bg-green-200',
        blue: 'bg-blue-200',
        yellow: 'bg-yellow-200',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + delay }}
            className={`card ${colors.bg} border-l-4 ${colors.border} p-6 text-center group hover:scale-[1.02] transition-transform`}
        >
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${iconBg[color as 'green' | 'blue' | 'yellow']} mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <p className="font-fun text-3xl md:text-4xl text-gray-800 mb-1">{value}</p>
            <p className="text-gray-600 font-rounded">{label}</p>
        </motion.div>
    );
}

function DailyTaskCard({ task }: { task: typeof dailyTasks[0] }) {
    const colors = colorClasses[task.color];

    return (
        <Link href={task.href} className="block">
            <div className={`card p-4 flex items-center gap-4 hover:shadow-card transition-shadow border-l-4 ${colors.border} ${colors.bg}`}>
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                    <task.icon className="w-6 h-6" style={{color: colors.text}} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-fun text-base text-gray-800 truncate">{task.title}</h3>
                    <p className="text-gray-600 text-sm mt-0.5">{task.desc}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                    <span className={`font-fun text-sm px-3 py-1.5 rounded-full ${colors.iconBg} ${colors.text}`}>
                        +{task.points} ★
                    </span>
                </div>
            </div>
        </Link>
    );
}