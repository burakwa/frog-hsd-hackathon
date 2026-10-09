// components/game/PraiseOverlay.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface Props {
    open: boolean;
    stars: number;
    message: string;
    onNext: () => void;
    onRetry: () => void;
}

export default function PraiseOverlay({ open, stars, message, onNext, onRetry }: Props) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full mx-4"
                        initial={{ scale: 0.6, y: 40 }} animate={{ scale: 1, y: 0 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                    >
                        <div className="text-7xl mb-2">🐼</div>
                        <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: i * 0.25, type: 'spring', bounce: 0.6 }}
                                >
                                    <Star size={48} className={i <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-2xl font-bold text-purple-700 mb-6">{message}</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={onRetry} className="px-5 py-3 rounded-2xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200">
                                🔄 Tekrar
                            </button>
                            <button onClick={onNext} className="px-6 py-3 rounded-2xl bg-purple-500 text-white font-bold text-lg hover:bg-purple-600">
                                Devam →
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}