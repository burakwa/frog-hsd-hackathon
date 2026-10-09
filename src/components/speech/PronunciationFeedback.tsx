// components/speech/PronunciationFeedback.tsx — Retro Hata ve Geri Bildirim
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
    message = 'BİRAZ DAHA PRATİK YAPALIM! 💪',
    onRetry,
}: Props) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 15, opacity: 0 }}
                className="pixel-box bg-slate-900 border-amber-500 rounded-xl p-4 mt-3 select-none"
            >
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <p className="font-pixel text-[11px] text-amber-400">{message}</p>
                    <span className="font-pixel text-[10px] text-yellow-300 bg-slate-950 px-2 py-1 rounded border border-yellow-400/50">
                        {score}/100 PTS
                    </span>
                </div>

                {errors.slice(0, 3).map((e, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-2.5 bg-slate-950/80 rounded-lg p-2.5 mb-2 border border-slate-800"
                    >
                        <span className="text-xl shrink-0">💡</span>
                        <div>
                            <p className="font-pixel text-[10px] text-amber-300">
                                &ldquo;{e.expected}&rdquo; yerine &ldquo;{e.spoken || '-'}&rdquo; duyuldu
                            </p>
                            <p className="font-arcade text-xs text-slate-300 mt-0.5">{e.tip}</p>
                        </div>
                    </div>
                ))}

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="pixel-btn bg-amber-500 hover:bg-amber-400 text-slate-950 w-full mt-2 py-2.5 text-xs flex items-center justify-center gap-2"
                    >
                        <span>🔄 TEKRAR DENE</span>
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
