// app/panel/oyunlar/page.tsx — Game Selection
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mic, Bug, MessageCircle, BookOpen, Play, ArrowLeft } from 'lucide-react';

const games = [
    {
        id: 'ses-tekrari',
        title: 'Ses Tekrarı',
        description: 'Kelimeleri dinle, mikrofona söyle ve puanları topla!',
        icon: Mic,
        color: 'green',
        gradient: 'from-green-500 to-emerald-500',
        href: '/panel/oyunlar/ses-tekrari',
    },
    {
        id: 'hece-avi',
        title: 'Hece Avı',
        description: 'Göldeki hedef sinekleri yakala, kurbağayı besle!',
        icon: Bug,
        color: 'blue',
        gradient: 'from-blue-500 to-sky-500',
        href: '/panel/oyunlar/hece-avi',
    },
    {
        id: 'cumle-soyle',
        title: 'Cümle Söyle',
        description: 'Eksik kelimeyi bularak cümleyi tamamla!',
        icon: MessageCircle,
        color: 'yellow',
        gradient: 'from-yellow-500 to-orange-500',
        href: '/panel/oyunlar/cumle-soyle',
    },
    {
        id: 'sesli-masal',
        title: 'Sesli Masal',
        description: 'Eğlenceli masalları karaoke gibi oku ve dinle!',
        icon: BookOpen,
        color: 'purple',
        gradient: 'from-purple-500 to-pink-500',
        href: '/panel/oyunlar/sesli-masal',
    },
];

type ColorKey = 'green' | 'blue' | 'yellow' | 'purple';

interface ColorClass {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    gradient: string;
}

const colorClasses: Record<ColorKey, ColorClass> = {
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', iconBg: 'bg-green-100', gradient: 'from-green-500 to-emerald-500' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100', gradient: 'from-blue-500 to-sky-500' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', iconBg: 'bg-yellow-100', gradient: 'from-yellow-500 to-orange-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconBg: 'bg-purple-100', gradient: 'from-purple-500 to-pink-500' },
};

export default function OyunlarPage() {
    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <Link href="/panel" className="btn btn-ghost btn-small">
                    <ArrowLeft className="w-4 h-4" />
                    Geri
                </Link>
                <div>
                    <h1 className="font-fun text-3xl text-gray-800">🎮 Oyunlar</h1>
                    <p className="text-gray-500 mt-1">Sevdiğin oyunu seç ve oynamaya başla!</p>
                </div>
            </motion.div>

            {/* Game Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game, index) => (
                    <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <Link href={game.href} className="block">
                            <GameCard game={game} />
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Features Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
            >
                <h3 className="font-fun text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-green-600" />
                    Neden FrogFriends?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Ses tanıma teknolojisi ile anlık geri bildirim</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>Yıldız ve rozetlerle motive edici sistem</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Veli paneli ile gelişim takibi</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function GameCard({ game }: { game: typeof games[0] }) {
    const colors = colorClasses[game.color as ColorKey];

    return (
        <div className={`card card-elevated p-6 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 ${colors.bg} border-l-4 ${colors.border}`}>
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-transparent via-white/50 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative flex flex-col h-full">
                {/* Icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <game.icon className="w-8 h-8" style={{color: colors.text}} />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="font-fun text-xl text-gray-800 mb-2">{game.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{game.description}</p>
                </div>

                {/* Play Button */}
                <div className="pt-4 border-t border-gray-100">
                    <button className={`btn w-full ${colors.text.replace('text-', 'bg-').replace('700', '600')} hover:opacity-90 transition-opacity group-hover:translate-x-1`}>
                        <Play className="w-4 h-4 transition-transform" />
                        Oyna
                    </button>
                </div>
            </div>
        </div>
    );
}