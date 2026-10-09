// components/game/Character.tsx — 🐸/🐼/🐰 2D Animated Mascot
'use client';
import { useState, useEffect } from 'react';
import type { MascotMood } from '@/types';

interface Props {
    mood?: MascotMood;
    size?: number;
    avatar?: 'kurbaga' | 'panda' | 'tavsan';
}

const mascotEmoji: Record<string, string> = {
    kurbaga: '🐸',
    panda: '🐼',
    tavsan: '🐰',
};

export default function Character({ mood = 'happy', size = 120, avatar }: Props) {
    const [currentAvatar, setCurrentAvatar] = useState<'kurbaga' | 'panda' | 'tavsan'>('kurbaga');

    useEffect(() => {
        if (avatar) {
            setCurrentAvatar(avatar);
        } else if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('frog_player_avatar') as 'kurbaga' | 'panda' | 'tavsan' | null;
            if (stored && mascotEmoji[stored]) {
                setCurrentAvatar(stored);
            }
        }
    }, [avatar]);

    const animClass =
        mood === 'speaking' ? 'frog-speaking' :
            mood === 'excited' ? 'frog-happy' :
                mood === 'sad' ? '' :
                    'frog-idle';

    const eyeExpression =
        mood === 'sad' ? '😢' :
            mood === 'thinking' ? '🤔' :
                mood === 'excited' ? '✨' :
                    mood === 'speaking' ? '🗣️' :
                        '';

    const baseEmoji = mascotEmoji[currentAvatar] || '🐸';

    return (
        <div
            className={`select-none relative inline-flex flex-col items-center justify-center ${animClass}`}
            style={{ width: size, height: size, cursor: 'default' }}
            role="img"
            aria-label={`${currentAvatar} maskot - ${mood}`}
        >
            <span style={{ fontSize: size * 0.85, lineHeight: 1 }} className="drop-shadow-sm">
                {baseEmoji}
            </span>
            {eyeExpression && (
                <span
                    className="absolute -top-1 -right-1 animate-bounce"
                    style={{ fontSize: size * 0.3 }}
                >
                    {eyeExpression}
                </span>
            )}
        </div>
    );
}
