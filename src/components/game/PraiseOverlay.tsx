// components/game/PraiseOverlay.tsx — Bright Celebration Overlay
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from './StarRating';
import Character from './Character';
import ConfettiReward from './ConfettiReward';
import { Play, RotateCcw } from 'lucide-react';

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
    message = 'HARİKA İŞ ÇIKARDIN! 🌟',
    score,
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onNext}
                    >
                        <motion.div
                            className="card card-elevated p-6 md:p-8 text-center shadow-2xl max-w-sm w-full relative overflow-hidden bg-gradient-to-br from-white to-green-50"
                            initial={{ scale: 0.5, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.5, y: 40, opacity: 0 }}
                            transition={{ type: 'spring', bounce: 0.4 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative top accent */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-pink-400" />

                            {/* Star burst decoration */}
                            <div className="absolute top-4 right-4 w-8 h-8 opacity-20">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" className="w-full h-full animate-bounce-subtle">
                                    <path d="M12 2l1 4h4l-3 3 1 4-4-3-4 3 1-4-3-3h4z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-4 left-4 w-6 h-6 opacity-20">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="w-full h-full animate-bounce-subtle" style={{animationDelay: '0.2s'}}>
                                    <path d="M12 2l1 4h4l-3 3 1 4-4-3-4 3 1-4-3-3h4z" />
                                </svg>
                            </div>

                            {/* Character */}
                            <div className="relative mb-4 flex justify-center">
                                <Character mood="excited" size={80} showLilypad={true} />
                            </div>

                            {/* Stars */}
                            <div className="relative mb-4 flex justify-center">
                                <StarRating stars={stars} size={40} animated />
                            </div>

                            {/* Message */}
                            <h2 className="font-fun text-lg md:text-xl text-gray-800 mb-2 leading-tight">
                                {message}
                            </h2>

                            {/* Score display */}
                            {score && typeof score === 'number' && score > 0 && (
                                <p className="font-rounded text-sm text-gray-500 mb-6">
                                    Doğruluk: <span className="font-fun text-green-700">%{score}</span>
                                </p>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onRetry(); }}
                                    className="btn btn-secondary flex-1 sm:flex-none group"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" />
                                    Tekrar Dene
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                                    className="btn btn-primary flex-1 sm:flex-none group"
                                >
                                    <Play className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                                    Sonraki
                                </button>
                            </div>

                            {/* Close hint */}
                            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-rounded">
                                Herhangi bir yere tıkla →
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}