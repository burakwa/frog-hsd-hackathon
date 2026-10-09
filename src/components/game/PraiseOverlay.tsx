// components/game/PraiseOverlay.tsx
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
    message = 'Harika İş Çıkardın! 🌟',
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(88,28,135,0.55)', backdropFilter: 'blur(8px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-[2rem] p-8 text-center shadow-2xl max-w-sm w-full"
                            initial={{ scale: 0.5, y: 60 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.5, y: 60, opacity: 0 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                        >
                            <div className="mb-2">
                                <Character mood="excited" size={80} />
                            </div>

                            <StarRating stars={stars} size={44} animated />

                            <p className="text-2xl font-black text-purple-700 mt-4 mb-6">
                                {message}
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={onRetry}
                                    className="btn-secondary px-5 py-3 text-base"
                                >
                                    🔄 Tekrar
                                </button>
                                <button
                                    onClick={onNext}
                                    className="btn-primary px-6 py-3 text-base"
                                >
                                    Devam → 
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}