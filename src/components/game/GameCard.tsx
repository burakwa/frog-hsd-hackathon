// components/game/GameCard.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
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
                whileHover={locked ? {} : { y: -6, scale: 1.02 }}
                whileTap={locked ? {} : { scale: 0.97 }}
                className={`relative rounded-[1.75rem] p-6 shadow-lg cursor-pointer overflow-hidden ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ background: gradient }}
            >
                {/* Background decoration */}
                <div
                    className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                />
                <div
                    className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full opacity-10"
                    style={{ background: 'rgba(255,255,255,0.8)' }}
                />

                {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 rounded-[1.75rem] z-10">
                        <Lock size={32} className="text-white" />
                    </div>
                )}

                {/* Star badge */}
                {bestStars > 0 && (
                    <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1 text-xs font-bold text-yellow-600">
                        {'⭐'.repeat(bestStars)}
                    </div>
                )}

                <div className="text-5xl mb-3">{emoji}</div>
                <h3 className="text-xl font-black text-white mb-1">{title}</h3>
                <p className="text-sm text-white/80 font-semibold leading-snug">{description}</p>

                {!locked && (
                    <div className="mt-4">
                        <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                            ▶ Oyna
                        </span>
                    </div>
                )}
            </motion.div>
        </Wrapper>
    );
}
