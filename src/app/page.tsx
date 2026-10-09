// app/page.tsx — Retro Arcade Title & Welcome Screen
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import Character from '@/components/game/Character';

export default function LandingPage() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-between pt-2 md:pt-4 px-4 md:px-6 pb-4 overflow-x-clip bg-slate-950 scanlines select-none">
            <div className="retro-scene absolute inset-0 pointer-events-none z-0" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/55" />
            </div>

            {/* Drifting Clouds */}
            <div className="absolute top-4 inset-x-0 h-40 pointer-events-none z-0 overflow-hidden opacity-60">
                <div className="pixel-cloud pixel-cloud-one" />
                <div className="pixel-cloud pixel-cloud-two" />
                <div className="pixel-cloud pixel-cloud-three" />
            </div>

            {/* Retro Arcade Top HUD Banner */}
            <header className="relative z-10 w-full max-w-4xl flex items-center justify-between text-xs md:text-sm font-pixel text-yellow-400 py-2 border-b-2 border-yellow-400/30">
                <div className="flex items-center gap-2">
                    <span className="text-red-500 animate-pulse">1UP</span>
                    <span className="text-white">004200</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-cyan-400">HIGH SCORE</span>
                    <span className="text-white">099900</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-emerald-400">CREDIT</span>
                    <span className="text-emerald-300">FREE PLAY</span>
                </div>
            </header>

            {/* Central Arcade Hero Content */}
            <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-lg w-full">
                {/* Floating Animated Flies */}
                <motion.div
                    animate={{ y: [-8, 8, -8], x: [-6, 6, -6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-8 -left-2 sm:-left-8 md:-left-16 text-2xl sm:text-3xl fly-float pointer-events-none"
                >
                    <span aria-hidden="true">🪰</span>
                </motion.div>

                <motion.div
                    animate={{ y: [8, -8, 8], x: [6, -6, 6] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-6 -right-2 sm:-right-8 md:-right-16 text-2xl sm:text-3xl fly-float-reverse pointer-events-none"
                >
                    <span aria-hidden="true">🪰</span>
                </motion.div>

                {/* Game Logo */}
                <motion.div
                    initial={{ scale: 0.8, y: -20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="mb-3 flex items-center gap-3 border-y-4 border-yellow-400/70 bg-slate-950/75 px-5 py-3 shadow-[4px_4px_0_#000]"
                >
                    <span className="text-4xl md:text-5xl" aria-hidden="true">🐸</span>
                    <span className="font-pixel text-left text-base sm:text-lg md:text-xl leading-relaxed text-yellow-300">
                        FROG<br /><span className="text-cyan-300">ARCADE</span>
                    </span>
                </motion.div>

                {/* Subtitle */}
                <p className="font-arcade text-base md:text-lg text-emerald-400 font-bold mb-6 tracking-wide drop-shadow-md">
                    ★ 2D RETRO KONUŞMA TERAPİSİ OYUNU ★
                </p>

                {/* Mascot on Lilypad */}
                <div className="mb-6 flex flex-col items-center">
                    <Character mood="happy" size={100} showLilypad={true} />
                </div>

                {/* Retro Arcade CTA Buttons */}
                <div className="flex flex-col gap-3.5 w-full max-w-xs">
                    <Link href="/giris" className="w-full">
                        <button className="pixel-btn w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 text-sm md:text-base flex items-center justify-center gap-3">
                            <Play size={18} className="fill-slate-950" />
                            <span>OYUNA BAŞLA</span>
                        </button>
                    </Link>

                    <Link href="/kayit" className="w-full">
                        <button className="pixel-btn w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-xs md:text-sm flex items-center justify-center gap-2">
                            <Sparkles size={16} />
                            <span>ÜCRETSİZ KAYIT OL</span>
                        </button>
                    </Link>

                    <Link
                        href="/panel"
                        className="font-pixel text-[11px] text-amber-300 hover:text-amber-100 mt-2 transition-colors flex items-center justify-center gap-1.5"
                    >
                        <span>▶ MİSAFİR MODUNDA OYNA</span>
                    </Link>
                </div>
            </div>

            {/* Bottom Retro Info Bar */}
            <footer className="relative z-10 w-full max-w-4xl flex flex-wrap items-center justify-between text-[11px] font-pixel text-slate-400 pt-4 border-t-2 border-slate-800 gap-2">
                <div className="flex items-center gap-3">
                    <span className="text-emerald-400">🐸 4 EĞLENCELİ RETRO OYUN</span>
                    <span>•</span>
                    <span className="text-yellow-400">🎤 CANLI MİKROFON ANALİZİ</span>
                </div>
                <div className="text-slate-500">
                    © 2026 KONUŞMA OYUNU
                </div>
            </footer>
        </main>
    );
}