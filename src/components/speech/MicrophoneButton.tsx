// components/speech/MicrophoneButton.tsx — Enhanced Microphone with Audio Visualization
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Volume2, VolumeX } from 'lucide-react';

interface Props {
    isListening: boolean;
    disabled?: boolean;
    onToggle: () => void;
    size?: 'sm' | 'md' | 'lg' | number;
    audioLevel?: number; // 0-1
}

const sizes = {
    sm: { btn: 'w-16 h-16', icon: 24, rings: 'w-20 h-20' },
    md: { btn: 'w-22 h-22', icon: 34, rings: 'w-28 h-28' },
    lg: { btn: 'w-28 h-28', icon: 44, rings: 'w-36 h-36' },
};

export default function MicrophoneButton({ 
    isListening, 
    disabled = false, 
    onToggle, 
    size = 'md',
    audioLevel = 0 
}: Props) {
    const resolvedKey: 'sm' | 'md' | 'lg' =
        typeof size === 'number'
            ? size >= 70
                ? 'lg'
                : size >= 55
                ? 'md'
                : 'sm'
            : size;
    const s = sizes[resolvedKey];
    const [hasAudioPermission, setHasAudioPermission] = useState(false);

    // Check for microphone permission
    useEffect(() => {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
            navigator.permissions.query({ name: 'microphone' as PermissionName }).then(result => {
                setHasAudioPermission(result.state === 'granted');
            });
        }
    }, []);

    return (
        <div className="relative flex items-center justify-center select-none" style={{ width: 'fit-content' }}>
            {/* Audio Level Ring Visualization */}
            {isListening && (
                <motion.div
                    className={`absolute ${s.rings} rounded-full border-3 transition-opacity`}
                    style={{ 
                        borderColor: audioLevel > 0.5 ? '#ef4444' : audioLevel > 0.2 ? '#facc15' : '#22c55e',
                        opacity: audioLevel > 0.1 ? 1 : 0.3,
                        transform: `scale(${1 + audioLevel * 0.5})`
                    }}
                    animate={{ opacity: [0.8, 0.4, 0.8] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                />
            )}

            {/* Pulse rings when listening */}
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
                    border-4 border-black shadow-[4px_4px_0px_#000] transition-all relative z-10 cursor-pointer
                    ${isListening
                        ? 'bg-red-500 animate-pulse'
                        : disabled
                            ? 'bg-slate-700 cursor-not-allowed opacity-50'
                            : hasAudioPermission
                                ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500'
                                : 'bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500'
                    }
                `}
                aria-label={isListening ? 'Mikrofonu durdur' : 'Konuşmaya başla'}
                style={{
                    boxShadow: isListening 
                        ? `0 0 ${20 + audioLevel * 30}px ${audioLevel > 0.5 ? '#ef4444' : '#22c55e'}`
                        : '4px 4px 0px #000'
                }}
            >
                {isListening ? (
                    <>
                        <Square size={s.icon} className="fill-white" />
                        {/* Center pulsing dot showing audio level */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            animate={{ scale: [1, 1 + audioLevel * 0.3, 1] }}
                            transition={{ duration: 0.1 }}
                        >
                            <div 
                                className="rounded-full bg-white/30" 
                                style={{ 
                                    width: `${12 + audioLevel * 20}px`, 
                                    height: `${12 + audioLevel * 20}px` 
                                }}
                            />
                        </motion.div>
                    </>
                ) : hasAudioPermission ? (
                    <Mic size={s.icon} className="stroke-[2.5]" />
                ) : (
                    <VolumeX size={s.icon} className="stroke-[2.5] opacity-70" />
                )}
            </motion.button>

            {/* Audio level indicator bar */}
            {isListening && (
                <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"
                        animate={{ width: `${audioLevel * 100}%` }}
                        transition={{ duration: 0.05, ease: 'linear' }}
                    />
                </motion.div>
            )}

            {/* Permission hint */}
            {!hasAudioPermission && !isListening && !disabled && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 white-space-nowrap bg-slate-900 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-700"
                >
                    Mikrofon izni gerekli 🎤
                </motion.div>
            )}
        </div>
    );
}
