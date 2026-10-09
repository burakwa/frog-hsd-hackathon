// components/game/Character.tsx — 🐸 Retro 2D Frog & Mascot Sprites
'use client';
import { useState, useEffect } from 'react';
import type { MascotMood } from '@/types';

interface Props {
    mood?: MascotMood;
    size?: number;
    avatar?: 'kurbaga' | 'panda' | 'tavsan';
    showLilypad?: boolean;
}

export default function Character({
    mood = 'happy',
    size = 120,
    avatar,
    showLilypad = false,
}: Props) {
    const [currentAvatar, setCurrentAvatar] = useState<'kurbaga' | 'panda' | 'tavsan'>('kurbaga');

    useEffect(() => {
        if (avatar) {
            setCurrentAvatar(avatar);
        } else if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('frog_player_avatar') as 'kurbaga' | 'panda' | 'tavsan' | null;
            if (stored) {
                setCurrentAvatar(stored);
            }
        }
    }, [avatar]);

    const animClass =
        mood === 'speaking' ? 'frog-speaking' :
        mood === 'excited' ? 'frog-happy' :
        mood === 'sad' ? 'opacity-70 scale-95' :
        'frog-idle';

    if (currentAvatar === 'kurbaga') {
        return (
            <div
                className="select-none relative inline-flex flex-col items-center justify-center"
                style={{ width: size, height: showLilypad ? size * 1.1 : size }}
                role="img"
                aria-label={`Retro Kurbağa - ${mood}`}
            >
                <div
                    className={`relative z-10 flex items-center justify-center transition-transform duration-200 ${animClass}`}
                    style={{ width: size, height: size * 0.8, fontSize: size * 0.66 }}
                >
                    🐸
                </div>

                {showLilypad && (
                    <span
                        aria-hidden="true"
                        className="relative -mt-3 h-3 rounded-[50%] border-2 border-emerald-300 bg-emerald-500 shadow-[0_3px_0_#064e3b]"
                        style={{ width: size * 0.82 }}
                    />
                )}
            </div>
        );
    }

    // Fallbacks for Panda and Rabbit
    const fallbackEmoji = currentAvatar === 'panda' ? '🐼' : '🐰';
    return (
        <div
            className={`select-none relative inline-flex flex-col items-center justify-center ${animClass}`}
            style={{ width: size, height: size, cursor: 'default' }}
            role="img"
            aria-label={`${currentAvatar} - ${mood}`}
        >
            <span style={{ fontSize: size * 0.85, lineHeight: 1 }} className="drop-shadow-sm">
                {fallbackEmoji}
            </span>
        </div>
    );
}
