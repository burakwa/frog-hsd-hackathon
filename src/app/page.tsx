// app/page.tsx — Landing / Welcome screen
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mic, Star, Trophy, Heart } from 'lucide-react';
import Character from '@/components/game/Character';

const features = [
    { icon: Mic, label: 'Sesli Oyunlar', color: 'bg-purple-100 text-purple-600' },
    { icon: Star, label: '3 Yıldız Sistemi', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Trophy, label: 'Rozetler', color: 'bg-green-100 text-green-600' },
    { icon: Heart, label: '100% Ücretsiz', color: 'bg-pink-100 text-pink-600' },
];

export default function LandingPage() {
    return (
        <main className="bg-app min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200 rounded-full opacity-30 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-100 rounded-full opacity-40 blur-3xl" />
            </div>

            <div className="relative z-10 max-w-md w-full text-center">
                {/* Mascot */}
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6, delay: 0.1 }}
                    className="mb-4 flex justify-center"
                >
                    <Character mood="excited" size={120} />
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-5xl font-black text-purple-800 leading-tight mb-2">
                        Konuşma<br />
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Oyunu
                        </span>
                    </h1>
                    <p className="text-gray-500 font-semibold text-lg mb-6">
                        Kurbağa ile eğlenerek konuşmayı öğren! 🎤
                    </p>
                </motion.div>

                {/* Feature pills */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-2 mb-8"
                >
                    {features.map(({ icon: Icon, label, color }) => (
                        <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${color}`}>
                            <Icon size={14} />
                            {label}
                        </div>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col gap-3"
                >
                    <Link href="/giris">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="btn-primary w-full py-4 text-lg justify-center"
                        >
                            🚀 Hemen Oyna!
                        </motion.div>
                    </Link>
                    <Link href="/kayit">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="btn-secondary w-full py-4 text-lg justify-center"
                        >
                            ✨ Ücretsiz Kayıt Ol
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Guest link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-4"
                >
                    <Link
                        href="/panel"
                        className="text-sm text-gray-400 hover:text-purple-500 font-semibold transition-colors"
                    >
                        Misafir olarak devam et →
                    </Link>
                </motion.div>

                {/* Decorative stars */}
                <div className="absolute top-8 right-8 text-3xl animate-bounce">⭐</div>
                <div className="absolute top-20 left-6 text-2xl" style={{ animation: 'frog-idle 2.5s ease-in-out infinite' }}>🌟</div>
            </div>
        </main>
    );
}