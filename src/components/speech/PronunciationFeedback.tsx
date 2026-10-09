// components/speech/PronunciationFeedback.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { PronunciationError } from '@/types';

interface Props {
    errors: PronunciationError[];
    score: number;
    message?: string;
    onRetry?: () => void;
}

export default function PronunciationFeedback({
    errors,
    score,
    message = 'Biraz daha pratik yapalım! 💪',
    onRetry,
}: Props) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="card mt-4"
            >
                <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-black text-orange-500">{message}</p>
                    <span className="bg-orange-100 text-orange-600 text-sm font-bold px-3 py-1 rounded-full">
                        {score}/100
                    </span>
                </div>

                {errors.slice(0, 3).map((e, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 bg-orange-50 rounded-2xl p-3 mb-2"
                    >
                        <span className="text-2xl flex-shrink-0">💡</span>
                        <div>
                            <p className="font-bold text-orange-700 text-sm">
                                &ldquo;{e.expected}&rdquo; yerine &ldquo;{e.spoken || '-'}&rdquo; duyuldu
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">{e.tip}</p>
                        </div>
                    </div>
                ))}

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="btn-primary w-full mt-3 py-3 text-base"
                    >
                        🔄 Tekrar Dene
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
