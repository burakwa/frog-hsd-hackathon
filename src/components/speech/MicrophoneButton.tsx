// components/speech/MicrophoneButton.tsx — Retro Arcade Mikrofon Butonu
'use client';
import { motion } from 'framer-motion';
import { Mic, Square } from 'lucide-react';

interface Props {
    isListening: boolean;
    disabled?: boolean;
    onToggle: () => void;
    size?: 'sm' | 'md' | 'lg' | number;
}

const sizes = {
    sm: { btn: 'w-16 h-16', icon: 24, rings: 'w-20 h-20' },
    md: { btn: 'w-22 h-22', icon: 34, rings: 'w-28 h-28' },
    lg: { btn: 'w-28 h-28', icon: 44, rings: 'w-36 h-36' },
};

export default function MicrophoneButton({ isListening, disabled = false, onToggle, size = 'md' }: Props) {
    const resolvedKey: 'sm' | 'md' | 'lg' =
        typeof size === 'number'
            ? size >= 70
                ? 'lg'
                : size >= 55
                ? 'md'
                : 'sm'
            : size;
    const s = sizes[resolvedKey];

    return (
        <div className="relative flex items-center justify-center select-none" style={{ width: 'fit-content' }}>
            {/* Retro pulse rings when listening */}
            {isListening && (
                <>
                    <motion.div
                        className={`absolute ${s.rings} rounded-full border-3 border-red-500`}
                        animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                        transition={{ duration: 1.0, repeat: Infinity }}
                    />
                    <motion.div
                        className={`absolute ${s.rings} rounded-full border-3 border-yellow-400`}
                        animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                        transition={{ duration: 1.0, repeat: Infinity, delay: 0.3 }}
                    />
                </>
            )}

            <motion.button
                onClick={onToggle}
                disabled={disabled}
                whileTap={{ scale: 0.94 }}
                animate={isListening ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={isListening ? { repeat: Infinity, duration: 0.8 } : {}}
                className={`
                    ${s.btn} rounded-full flex items-center justify-center text-white
                    border-4 border-black shadow-[4px_4px_0px_#000] transition-colors relative z-10 cursor-pointer
                    ${isListening
                        ? 'bg-red-500 animate-pulse'
                        : disabled
                            ? 'bg-slate-700 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500'
                    }
                `}
                aria-label={isListening ? 'Mikrofonu durdur' : 'Konuşmaya başla'}
            >
                {isListening ? (
                    <Square size={s.icon} className="fill-white" />
                ) : (
                    <Mic size={s.icon} className="stroke-[2.5]" />
                )}
            </motion.button>
        </div>
    );
}
