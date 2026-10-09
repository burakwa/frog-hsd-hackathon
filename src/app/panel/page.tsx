// app/panel/page.tsx — Duolingo-style Learning Path
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, Lock, Star, Flame, ArrowRight, Flag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import Character from '@/components/game/Character';
import { starsToLevel } from '@/lib/utils/helpers';

interface LearningStep {
    id: number;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    href: string;
    color: 'green' | 'emerald';
    requiredStars: number;
    gameType: 'speech' | 'syllable' | 'sentence' | 'story';
}

const learningPath: LearningStep[] = [
    {
        id: 1,
        title: 'Ses Tekrarı',
        subtitle: 'Kelimeleri dinle ve tekrar et',
        icon: <span className="text-3xl">🎤</span>,
        href: '/panel/oyunlar/ses-tekrari',
        color: 'green',
        requiredStars: 0,
        gameType: 'speech',
    },
    {
        id: 2,
        title: 'Hece Avı',
        subtitle: 'Heceleri öğren, sinekleri yakala',
        icon: <span className="text-3xl">🪰</span>,
        href: '/panel/oyunlar/hece-avi',
        color: 'emerald',
        requiredStars: 5,
        gameType: 'syllable',
    },
    {
        id: 3,
        title: 'Cümle Kur',
        subtitle: 'Eksik kelimeleri bul, cümle oluştur',
        icon: <span className="text-3xl">📝</span>,
        href: '/panel/oyunlar/cumle-soyle',
        color: 'emerald',
        requiredStars: 15,
        gameType: 'sentence',
    },
    {
        id: 4,
        title: 'Sesli Masal',
        subtitle: 'Hikayeleri oku ve dinle',
        icon: <span className="text-3xl">📖</span>,
        href: '/panel/oyunlar/sesli-masal',
        color: 'green',
        requiredStars: 30,
        gameType: 'story',
    },
];

const colorStyles = {
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', main: 'bg-green-500', hover: 'hover:bg-green-600', iconBg: 'bg-green-100' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', main: 'bg-emerald-500', hover: 'hover:bg-emerald-600', iconBg: 'bg-emerald-100' },
};

export default function PanelPage() {
    const { user } = useAuth();
    const { totalStars, sessions } = useProgress();
    const level = starsToLevel(totalStars);
    const levelProgress = (totalStars % 10) * 10;
    const name = user?.user_metadata?.ad || user?.email?.split('@')[0] || 'KAHRAMAN';

    // Find current step (the first locked or current one)
    const currentStepIndex = learningPath.findIndex(step => totalStars < step.requiredStars);
    const currentStep = currentStepIndex >= 0 ? learningPath[currentStepIndex] : learningPath[learningPath.length - 1];
    const completedSteps = learningPath.filter(step => totalStars >= step.requiredStars).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Top Bar - Simple */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-sm">
                            <img src="/assets/logo.png" alt="FrogFriends" className="w-6 h-6" />
                        </div>
                        <span className="font-fun text-xl text-gray-800">FrogFriends</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-fun text-yellow-700">{totalStars}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="font-fun text-orange-700">Lv.{level}</span>
                        </div>
                    </div>
                </div>

                {/* Character Greeting - Simple */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <Character mood="happy" size={100} showLilypad={true} />
                    <h1 className="font-fun text-2xl md:text-3xl text-gray-800 mt-2 mb-1">
                        Merhaba <span className="text-green-600">{name}</span>! 👋
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Bugün nereye kadar gideceğiz?
                    </p>
                </motion.div>

                {/* Progress Ring - Simple */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                >
                    <div className="relative w-32 h-32 md:w-40 md:h-40">
                        <svg viewBox="0 0 128 128" className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                fill="none"
                                stroke="#e8f5e9"
                                strokeWidth="8"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r="58"
                                fill="none"
                                stroke="#4ade80"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={364.4}
                                initial={{ strokeDashoffset: 364.4 }}
                                animate={{ strokeDashoffset: 364.4 - (levelProgress / 100) * 364.4 }}
                                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-fun text-2xl md:text-3xl text-green-700">{levelProgress}%</span>
                            <span className="text-xs text-green-500 font-medium">Seviye {level} → {level + 1}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Learning Path - Duolingo Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-fun text-lg text-gray-800 flex items-center gap-2">
                            <Flag className="w-5 h-5 text-green-500" />
                            Öğrenme Yolu
                        </h2>
                        <span className="text-xs text-green-500 font-medium">
                            {completedSteps} / {learningPath.length} tamamlandı
                        </span>
                    </div>

                    <div className="space-y-3">
                        {learningPath.map((step, index) => {
                            const isCompleted = totalStars >= step.requiredStars;
                            const isCurrent = !isCompleted && index === currentStepIndex;
                            const isLocked = !isCompleted && !isCurrent;
                            const styles = colorStyles[step.color];

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className={`relative group ${isLocked ? 'opacity-50' : ''}`}
                                >
                                    {/* Connecting line */}
                                    {index < learningPath.length - 1 && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: isCompleted ? '100%' : 0 }}
                                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                            className="absolute left-[36px] top-12 bottom-0 w-1 bg-green-200 rounded-full"
                                        />
                                    )}

                                    <Link href={isLocked ? '#' : step.href} className="block">
                                        <div className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all ${isLocked ? 'bg-gray-50 border border-gray-200' : `bg-white border-2 ${styles.border} shadow-sm hover:shadow-md`}`}>
                                            {/* Step number / status */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5 + index * 0.1, type: 'spring', bounce: 0.4 }}
                                                className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? `${styles.main} text-white animate-pulse` : 'bg-gray-200 text-gray-400'}`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-6 h-6" />
                                                ) : isCurrent ? (
                                                    <Play className="w-5 h-5 ml-1" />
                                                ) : (
                                                    <Lock className="w-5 h-5" />
                                                )}
                                            </motion.div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {step.icon}
                                                    <h3 className={`font-fun text-base ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                                                        {step.title}
                                                    </h3>
                                                    {isCurrent && (
                                                        <motion.span
                                                            animate={{ opacity: [1, 0.5, 1] }}
                                                            transition={{ repeat: Infinity, duration: 1 }}
                                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.bg} ${styles.text}`}
                                                        >
                                                            ŞİMDİ
                                                        </motion.span>
                                                    )}
                                                </div>
                                                <p className={`text-xs ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {step.subtitle}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.bg} ${styles.text}`}>
                                                        {step.requiredStars} ★ gerekli
                                                    </span>
                                                    {isCompleted && (
                                                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Tamamlandı
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            {!isLocked && (
                                                <motion.div
                                                    whileHover={{ x: 4 }}
                                                    className={`flex-shrink-0 w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center ${styles.text}`}
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Continue Button - Big CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4"
                >
                    <Link href={currentStep.href} className="block">
                        <button className={`w-full py-4 rounded-2xl ${colorStyles[currentStep.color].main} text-white font-fun text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5`}>
                            <Play className="w-6 h-6" />
                            <span>Devam Et: {currentStep.title}</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </motion.div>

                {/* Simple Stats Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-green-100"
                >
                    <div className="p-3 bg-green-50 rounded-xl">
                        <div className="font-fun text-2xl text-green-700">{sessions.length}</div>
                        <div className="text-xs text-green-500">Oynanan Oyun</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                        <div className="font-fun text-2xl text-emerald-700">{totalStars}</div>
                        <div className="text-xs text-emerald-500">Toplam Yıldız</div>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-xl">
                        <div className="font-fun text-2xl text-teal-700">{completedSteps}</div>
                        <div className="text-xs text-teal-500">Bölüm Tamamlandı</div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}