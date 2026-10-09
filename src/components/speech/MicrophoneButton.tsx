// components/speech/MicrophoneButton.tsx
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
    md: { btn: 'w-24 h-24', icon: 36, rings: 'w-32 h-32' },
    lg: { btn: 'w-32 h-32', icon: 48, rings: 'w-44 h-44' },
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
        <div className="relative flex items-center justify-center" style={{ width: 'fit-content' }}>
            {/* Pulse rings when listening */}
            {isListening && (
                <>
                    <motion.div
                        className={`absolute ${s.rings} rounded-full border-2 border-red-400`}
                        animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <motion.div
                        className={`absolute ${s.rings} rounded-full border-2 border-red-300`}
                        animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    />
                </>
            )}

            <motion.button
                onClick={onToggle}
                disabled={disabled}
                whileTap={{ scale: 0.9 }}
                animate={isListening ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={isListening ? { repeat: Infinity, duration: 0.9 } : {}}
                className={`
                    ${s.btn} rounded-full flex items-center justify-center text-white
                    shadow-xl transition-colors relative z-10
                    ${isListening
                        ? 'bg-red-500 mic-listening'
                        : disabled
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 cursor-pointer'
                    }
                `}
                aria-label={isListening ? 'Mikrofonu durdur' : 'Konuşmaya başla'}
            >
                {isListening ? <Square size={s.icon} /> : <Mic size={s.icon} />}
            </motion.button>
        </div>
    );
}
