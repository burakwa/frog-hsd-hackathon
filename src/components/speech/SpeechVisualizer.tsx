// components/speech/SpeechVisualizer.tsx — Enhanced Real-time Waveform Visualizer
'use client';
import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Props {
    isActive: boolean;
    level?: number; // 0-1
    bars?: number;
    showWaveform?: boolean;
}

export default function SpeechVisualizer({ 
    isActive, 
    level = 0, 
    bars = 12,
    showWaveform = true 
}: Props) {
    // Create motion values for smooth animations
    const levelMotion = useMotionValue(level);
    const waveformPhase = useMotionValue(0);
    
    // Smooth the level input
    const smoothLevel = useSpring(levelMotion, { 
        stiffness: 300, 
        damping: 30,
        mass: 0.5 
    });

    // Animate waveform phase when active
    useEffect(() => {
        if (isActive) {
            let frame = 0;
            const animate = () => {
                waveformPhase.set(frame * 0.1);
                frame++;
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }, [isActive, waveformPhase]);

    // Update level motion value when prop changes
    useEffect(() => {
        levelMotion.set(level);
    }, [level, levelMotion]);

    // Always call hooks - move before conditional render
    const barHeight = useTransform(smoothLevel, [0, 1], [4, 36]);

    if (!isActive) {
        return (
            <div className="flex items-center justify-center gap-1 h-12">
                {Array.from({ length: bars }).map((_, i) => (
                    <div
                        key={i}
                        className="w-2 rounded-full bg-gray-200 dark:bg-slate-700"
                        style={{ height: 6 + (i % 3) * 4 }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="relative w-full">
            {/* Waveform Background */}
            {showWaveform && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <svg 
                        viewBox="0 0 200 40" 
                        className="w-full h-full text-green-400/20"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#eab308" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,20 Q25,10 50,20 T100,20 T150,20 T200,20"
                            stroke="url(#waveGradient)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        >
                            <animate
                                attributeName="d"
                                dur="2s"
                                repeatCount="indefinite"
                                values="M0,20 Q25,10 50,20 T100,20 T150,20 T200,20; M0,20 Q25,30 50,20 T100,20 T150,20 T200,20; M0,20 Q25,10 50,20 T100,20 T150,20 T200,20"
                                keyTimes="0;0.5;1"
                                calcMode="spline"
                            />
                        </path>
                    </svg>
                </div>
            )}

            {/* Frequency Bars */}
            <div className="flex items-end justify-center gap-1 h-12 relative z-10">
                {Array.from({ length: bars }).map((_, i) => {
                    const delay = i * 0.03;
                    const colorIndex = i / bars;
                    
                    return (
                        <motion.div
                            key={i}
                            className="w-2 rounded-full"
                            style={{
                                background: colorIndex < 0.4 
                                    ? 'linear-gradient(to top, #22c55e, #4ade80)'
                                    : colorIndex < 0.7
                                        ? 'linear-gradient(to top, #eab308, #facc15)'
                                        : 'linear-gradient(to top, #ef4444, #f87171)',
                                height: barHeight,
                            }}
                            transition={{
                                duration: 0.08,
                                delay,
                                ease: 'easeOut',
                            }}
                        />
                    );
                })}
            </div>

            {/* Level Indicator */}
            <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-100 text-[10px] px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Ses Seviyesi: {Math.round(level * 100)}%
            </motion.div>

            {/* Visual feedback for good/bad levels */}
            <motion.div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[11px] font-medium"
                animate={{ 
                    opacity: level > 0.3 ? 1 : 0.5,
                    color: level > 0.6 ? '#ef4444' : level > 0.2 ? '#eab308' : '#22c55e'
                }}
            >
                {level > 0.6 ? '🔴 Çok Yüksek' : level > 0.2 ? '🟡 İyi' : '🟢 Düşük'}
            </motion.div>
        </div>
    );
}
