'use client';
import { motion } from 'framer-motion';
import GameCard from '@/components/game/GameCard';

const games = [
    {
        id: 'ses-tekrari' as const,
        title: 'Ses Tekrarı',
        description: 'Kelimeyi dinle ve sesine benzetmeye çalış!',
        emoji: '🎤',
        gradient: 'linear-gradient(135deg, #7c3aed, #9333ea)',
        href: '/panel/oyunlar/ses-tekrari',
    },
    {
        id: 'hece-avi' as const,
        title: 'Hece Avı',
        description: 'Uçan hecelerden doğru olanı yakala!',
        emoji: '🦋',
        gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
        href: '/panel/oyunlar/hece-avi',
    },
    {
        id: 'cumle-soyle' as const,
        title: 'Cümle Söyle',
        description: 'Eksik kelimeyi söyleyerek cümleyi tamamla!',
        emoji: '💬',
        gradient: 'linear-gradient(135deg, #10b981, #34d399)',
        href: '/panel/oyunlar/cumle-soyle',
    },
    {
        id: 'sesli-masal' as const,
        title: 'Sesli Masal',
        description: 'Hikayeyi sesli okuyarak hem eğlen hem öğren!',
        emoji: '📖',
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        href: '/panel/oyunlar/sesli-masal',
    },
];

export default function OyunlarPage() {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6"
            >
                <h1 className="text-3xl font-black text-purple-800 mb-1">🎮 Oyunlar</h1>
                <p className="text-gray-500 font-semibold">Hangisini oynamak istersin?</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {games.map((game, i) => (
                    <motion.div
                        key={game.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GameCard {...game} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
