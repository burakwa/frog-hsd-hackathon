// components/game/Character.tsx — Cute Frog & Mascot Sprites
'use client';
import { useState, useEffect } from 'react';
import type { MascotMood } from '@/types';

interface Props {
    mood?: MascotMood;
    size?: number;
    avatar?: 'kurbaga' | 'panda' | 'tavsan';
    showLilypad?: boolean;
}

const frogImages = {
    happy: '/assets/frog1.png',
    speaking: '/assets/frog2.png',
    excited: '/assets/frog3.png',
    sad: '/assets/frog1.png',
    thinking: '/assets/frog2.png',
};

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

    const getFrogSrc = (m: MascotMood) => {
        return frogImages[m as keyof typeof frogImages] || frogImages.happy;
    };

    const animClass =
        mood === 'speaking' ? 'animate-float-gentle-reverse' :
        mood === 'excited' ? 'animate-bounce-subtle' :
        mood === 'sad' ? 'opacity-70 scale-95' :
        'animate-float-gentle';

    if (currentAvatar === 'kurbaga') {
        return (
            <div
                className={`select-none relative inline-flex flex-col items-center justify-center ${animClass}`}
                style={{ width: size, height: showLilypad ? size * 1.15 : size }}
                role="img"
                aria-label={`Kurbağa - ${mood}`}
            >
                <div
                    className="relative z-10 flex items-center justify-center transition-transform duration-200"
                    style={{ width: size, height: size * 0.85 }}
                >
                    <img
                        src={getFrogSrc(mood)}
                        alt={`Kurbağa - ${mood}`}
                        className="w-full h-full object-contain drop-shadow-lg"
                        style={{ filter: mood === 'sad' ? 'grayscale(0.5) brightness(0.8)' : 'none' }}
                    />
                </div>

                {showLilypad && (
                    <img
                        src="/assets/nilufer.png"
                        alt="Nilüfer yaprağı"
                        className="relative -mt-3 w-[85%] h-auto object-contain drop-shadow-md animate-float-gentle"
                        aria-hidden="true"
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