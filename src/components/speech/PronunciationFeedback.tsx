// components/speech/PronunciationFeedback.tsx — Enhanced Speech Analysis Feedback
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { PronunciationError } from '@/types';
import type { DetailedPhonemeError } from '@/lib/ai/openrouter';

interface Props {
    errors: PronunciationError[];
    score: number;
    message?: string;
    onRetry?: () => void;
    targetWord?: string;
    spokenWord?: string;
    aiErrors?: DetailedPhonemeError[];
}

function WordWithErrorHighlights({ targetWord, errors }: { targetWord: string; errors: PronunciationError[] }) {
    const errorPositions = new Set(errors.map(e => e.position));
    
    return (
        <div className="font-mono text-lg tracking-wider">
            {targetWord.split('').map((char, idx) => (
                <span
                    key={idx}
                    className={`inline-block px-1 transition-all ${
                        errorPositions.has(idx)
                            ? 'bg-amber-500/30 text-amber-400 rounded border border-amber-500/50 animate-pulse'
                            : 'text-slate-300'
                    }`}
                >
                    {char}
                </span>
            ))}
        </div>
    );
}

function PhonemeErrorDetail({ error }: { error: DetailedPhonemeError }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-950/80 rounded-lg p-3 mb-2 border border-slate-800"
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎯</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-pixel text-[10px] text-amber-300">Pozisyon</span>
                    <span className="font-arcade text-xs text-yellow-300 bg-slate-900 px-1.5 py-0.5 rounded border border-yellow-400/30">{error.position + 1}</span>
                    <span className="font-pixel text-[10px] text-slate-500">→</span>
                    <span className="font-arcade text-xs text-green-400 bg-slate-900 px-1.5 py-0.5 rounded border border-green-400/30">{error.expectedPhoneme}</span>
                    <span className="font-pixel text-[10px] text-slate-500">/</span>
                    <span className="font-arcade text-xs text-red-400 bg-slate-900 px-1.5 py-0.5 rounded border border-red-400/30">{error.spokenPhoneme}</span>
                </div>
            </div>
            <p className="font-pixel text-[10px] text-slate-300 mb-1">{error.description}</p>
            <p className="font-arcade text-xs text-cyan-300">💡 {error.articulationTip}</p>
        </motion.div>
    );
}

export default function PronunciationFeedback({
    errors,
    score,
    message = 'BİRAZ DAHA PRATİK YAPALIM! 💪',
    onRetry,
    targetWord,
    spokenWord,
    aiErrors,
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

                {targetWord && (
                    <div className="mb-4 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                        <p className="font-pixel text-[10px] text-slate-400 mb-2">Hedef Kelime:</p>
                        <WordWithErrorHighlights targetWord={targetWord} errors={errors} />
                        {spokenWord && (
                            <p className="font-pixel text-[10px] text-slate-500 mt-2">Sen söyledin: <span className="text-amber-300">{spokenWord}</span></p>
                        )}
                    </div>
                )}

                {aiErrors && aiErrors.length > 0 ? (
                    <div className="space-y-2">
                        <p className="font-pixel text-[10px] text-cyan-400 mb-2">🤖 AI Analizi - Detaylı Hatalar:</p>
                        {aiErrors.map((e, i) => (
                            <PhonemeErrorDetail key={i} error={e} />
                        ))}
                    </div>
                ) : errors.length > 0 ? (
                    <div className="space-y-2">
                        <p className="font-pixel text-[10px] text-amber-400 mb-2">Tespit Edilen Hatalar:</p>
                        {errors.slice(0, 3).map((e, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start gap-2.5 bg-slate-950/80 rounded-lg p-2.5 border border-slate-800"
                            >
                                <span className="text-xl shrink-0">💡</span>
                                <div>
                                    <p className="font-pixel text-[10px] text-amber-300">
                                        Pozisyon {e.position + 1}: &apos;{e.expected}&apos; yerine &apos;{e.spoken || '-'}&apos; duyuldu
                                    </p>
                                    <p className="font-arcade text-xs text-slate-300 mt-0.5">{e.tip}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="font-pixel text-[10px] text-green-400 text-center py-4">
                        🎉 Harika! Herhangi bir hata tespit edilmedi!
                    </p>
                )}

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="pixel-btn bg-amber-500 hover:bg-amber-400 text-slate-950 w-full mt-4 py-2.5 text-xs flex items-center justify-center gap-2"
                    >
                        <span>🔄 TEKRAR DENE</span>
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
