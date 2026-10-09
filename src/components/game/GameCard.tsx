// components/game/GameCard.tsx — Retro Arcade Game Card
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Play } from 'lucide-react';
import type { GameId } from '@/types';

interface Props {
    id: GameId;
    title: string;
    description: string;
    emoji: string;
    gradient: string;
    locked?: boolean;
    bestStars?: number;
    href: string;
}

export default function GameCard({ title, description, emoji, gradient, locked, bestStars = 0, href }: Props) {
    const Wrapper = locked ? 'div' : Link;

    return (
        <Wrapper href={locked ? '#' : href} className="block focus:outline-none">
            <motion.div
                whileHover={locked ? {} : { y: -4, scale: 1.02 }}
                whileTap={locked ? {} : { scale: 0.98 }}
                className={`relative rounded-2xl p-5 border-4 border-black shadow-[6px_6px_0px_#000] cursor-pointer overflow-hidden transition-all ${
                    locked ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                style={{ background: gradient }}
            >
                {/* Retro CRT highlight sheen */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10">
                        <Lock size={32} className="text-white" />
                    </div>
                )}

                {/* Star rating chip */}
                {bestStars > 0 && (
                    <div className="absolute top-3 right-3 bg-black/80 border-2 border-yellow-400 rounded-lg px-2 py-0.5 text-xs font-pixel text-yellow-300">
                        {'★'.repeat(bestStars)}
                    </div>
                )}

                <div className="text-4xl mb-2">{emoji}</div>
                <h3 className="font-pixel text-base text-white mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {title}
                </h3>
                <p className="font-arcade text-xs text-white/90 font-bold leading-relaxed mb-4">
                    {description}
                </p>

                {!locked && (
                    <div className="mt-auto">
                        <span className="inline-flex items-center gap-1.5 bg-black/80 hover:bg-black text-yellow-300 border-2 border-yellow-400 font-pixel text-[10px] px-3 py-1.5 rounded-lg shadow-sm">
                            <Play size={10} className="fill-yellow-300" />
                            OYNA
                        </span>
                    </div>
                )}
            </motion.div>
        </Wrapper>
    );
}
