// components/game/StarRating.tsx
'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Props {
    stars: number; // 0-3
    size?: number;
    animated?: boolean;
}

export default function StarRating({ stars, size = 40, animated = true }: Props) {
    return (
        <div className="flex items-center gap-2 justify-center">
            {[1, 2, 3].map(i => (
                <motion.div
                    key={i}
                    initial={animated ? { scale: 0, rotate: -30 } : { scale: 1 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: animated ? i * 0.2 : 0, type: 'spring', bounce: 0.6 }}
                >
                    <Star
                        size={size}
                        className={i <= stars ? 'star-lit fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
                    />
                </motion.div>
            ))}
        </div>
    );
}
