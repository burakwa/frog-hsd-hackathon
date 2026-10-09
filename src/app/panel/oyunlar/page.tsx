// app/panel/oyunlar/page.tsx — Retro Arcade Oyun Seçim Ekranı
'use client';
import { motion } from 'framer-motion';
import GameCard from '@/components/game/GameCard';

const games = [
    {
        id: 'ses-tekrari' as const,
        title: 'SES TEKRARI',
        description: 'Kelimeyi dinle, mikrofona söyle ve puanları topla!',
        emoji: '🎤',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        href: '/panel/oyunlar/ses-tekrari',
    },
    {
        id: 'hece-avi' as const,
        title: 'HECE AVI',
        description: 'Göldeki hedef sinekleri yakala, kurbağayı besle!',
        emoji: '🪰',
        gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        href: '/panel/oyunlar/hece-avi',
    },
    {
        id: 'cumle-soyle' as const,
        title: 'CÜMLE SÖYLE',
        description: 'Eksik kelimeyi bularak cümleyi tamamla!',
        emoji: '💬',
        gradient: 'linear-gradient(135deg, #155e75 0%, #0e7490 50%, #0284c7 100%)',
        href: '/panel/oyunlar/cumle-soyle',
    },
    {
        id: 'sesli-masal' as const,
        title: 'SESLİ MASAL',
        description: 'Eğlenceli masalları karaoke gibi oku ve dinle!',
        emoji: '📖',
        gradient: 'linear-gradient(135deg, #701a75 0%, #86198f 50%, #a21caf 100%)',
        href: '/panel/oyunlar/sesli-masal',
    },
];

export default function OyunlarPage() {
    return (
        <div className="w-full pt-2 md:pt-4 px-4 md:px-6 pb-4 max-w-3xl mx-auto select-none">
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6 border-b-2 border-slate-800 pb-3"
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl animate-pulse">🕹️</span>
                    <h1 className="font-pixel text-xl md:text-2xl text-yellow-300 drop-shadow">
                        ARCADE OYUNLARI
                    </h1>
                </div>
                <p className="font-arcade text-xs text-cyan-400 font-bold">
                    SELECT A GAME TO START PLAYING • FREE PLAY MODE
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {games.map((game, i) => (
                    <motion.div
                        key={game.id}
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <GameCard {...game} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
