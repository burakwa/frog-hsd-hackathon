// components/game/PraiseOverlay.tsx — Retro Arcade Zafer Ekranı
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from './StarRating';
import Character from './Character';
import ConfettiReward from './ConfettiReward';

interface Props {
    open?: boolean;
    isOpen?: boolean;
    stars: number;
    message?: string;
    score?: number;
    onNext: () => void;
    onRetry?: () => void;
}

export default function PraiseOverlay({
    open,
    isOpen,
    stars,
    message = 'HARİKA İŞ ÇIKARDIN! ★',
    onNext,
    onRetry = onNext,
}: Props) {
    const isVisible = open ?? isOpen ?? false;
    return (
        <>
            <ConfettiReward trigger={isVisible} stars={stars} />
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm scanlines"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="pixel-box bg-slate-900 border-yellow-400 rounded-2xl p-6 md:p-8 text-center shadow-[10px_10px_0px_#000] max-w-sm w-full relative"
                            initial={{ scale: 0.5, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.5, y: 40, opacity: 0 }}
                            transition={{ type: 'spring', bounce: 0.4 }}
                        >
                            <div className="mb-2 flex justify-center">
                                <Character mood="excited" size={72} showLilypad={true} />
                            </div>

                            <div className="my-2 flex justify-center">
                                <StarRating stars={stars} size={36} animated />
                            </div>

                            <h2 className="font-pixel text-sm md:text-base text-yellow-300 mt-2 mb-6 tracking-wide drop-shadow">
                                {message}
                            </h2>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={onRetry}
                                    className="pixel-btn bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-4 text-xs"
                                >
                                    🔄 TEKRAR
                                </button>
                                <button
                                    onClick={onNext}
                                    className="pixel-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 px-5 text-xs"
                                >
                                    DEVAM →
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}