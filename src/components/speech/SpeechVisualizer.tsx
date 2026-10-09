// components/speech/SpeechVisualizer.tsx
'use client';
import { motion } from 'framer-motion';

interface Props {
    isActive: boolean;
    level?: number; // 0-1
    bars?: number;
}

export default function SpeechVisualizer({ isActive, level = 0.5, bars = 5 }: Props) {
    if (!isActive) {
        return (
            <div className="flex items-center justify-center gap-1 h-10">
                {Array.from({ length: bars }).map((_, i) => (
                    <div
                        key={i}
                        className="w-1.5 rounded-full bg-gray-200"
                        style={{ height: 8 }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-1 h-10">
            {Array.from({ length: bars }).map((_, i) => {
                const maxH = 14 + level * 24;
                const waveFactor = 0.7 + ((i % 3) * 0.15);
                const delay = i * 0.1;
                return (
                    <motion.div
                        key={i}
                        className="w-1.5 rounded-full bg-gradient-to-b from-purple-400 to-purple-600"
                        animate={{
                            height: [8, maxH * waveFactor, 8],
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay,
                            ease: 'easeInOut',
                        }}
                    />
                );
            })}
        </div>
    );
}
