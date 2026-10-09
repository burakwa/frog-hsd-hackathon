// components/game/Character.tsx — Fixed DiceBear API with Green Theme
'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import type { MascotMood } from '@/types';

interface Props {
    mood?: MascotMood;
    size?: number;
    avatar?: string; // DiceBear seed
    showLilypad?: boolean;
    style?: 'bottts' | 'shapes' | 'avataaars' | 'personas' | 'initials' | 'fun-emoji';
    onClick?: () => void;
}

// Green color palette for DiceBear (hex without #)
const GREEN_PALETTE = [
    '16a34a', // green-600
    '15803d', // green-700
    '22c55e', // green-500
    '4ade80', // green-400
    '86efac', // green-300
    '14532d', // green-900
    '166534', // green-800
];

const MOOD_CLASSES: Record<MascotMood, string> = {
    happy: 'animate-float-gentle',
    speaking: 'animate-float-gentle-reverse',
    excited: 'animate-bounce-subtle',
    sad: 'opacity-70 scale-95',
    thinking: 'animate-float-gentle',
};

// Fallback local images for when DiceBear fails
const FROG_IMAGES = {
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
    style = 'bottts',
    onClick,
}: Props) {
    const [seed, setSeed] = useState<string>('frog-friend');
    const [useFallback, setUseFallback] = useState(false);
    const isInitialMount = useRef(true);

    // Use avatar prop directly, fallback to localStorage, then default
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const newSeed = avatar || (typeof window !== 'undefined' ? localStorage.getItem('frog_player_avatar_seed') : null) || 'frog-friend';
        setSeed(newSeed);
        setUseFallback(false);
    }, [avatar]);

    // Build DiceBear URL - using correct API format
    const avatarUrl = useMemo(() => {
        const baseUrl = 'https://api.dicebear.com/9.x';
        const params = new URLSearchParams({
            seed,
            size: String(size),
        });

        // Style-specific parameters
        if (style === 'bottts') {
            params.set('eyes', 'happy,happy2,happy3');
            params.set('mouth', 'smile,laugh');
            params.set('colors', GREEN_PALETTE.join(','));
            params.set('backgroundColor', 'dcfce7,bbf7d0,86efac');
        } else if (style === 'shapes') {
            params.set('color', GREEN_PALETTE.join(','));
            params.set('backgroundColor', 'dcfce7,bbf7d0,86efac');
        } else if (style === 'avataaars') {
            params.set('skinColor', 'light,yellow');
            params.set('hairColor', 'green,emerald,brown');
            params.set('eyes', 'default,happy,wink');
            params.set('mouth', 'default,smile,tongue');
            params.set('accessories', 'none');
            params.set('clothesColor', 'green,emerald,teal,blue');
            params.set('backgroundColor', 'dcfce7,bbf7d0,86efac');
        } else if (style === 'personas') {
            params.set('skinColor', 'light,yellow');
            params.set('hairColor', 'green,emerald');
            params.set('eyes', 'default,happy,wink');
            params.set('mouth', 'default,smile,tongue');
            params.set('accessories', 'none');
            params.set('backgroundColor', 'dcfce7,bbf7d0,86efac');
        }

        return `${baseUrl}/${style}/svg?${params.toString()}`;
    }, [seed, size, style]);

    const animClass = MOOD_CLASSES[mood] || 'animate-float-gentle';
    const frogSrc = FROG_IMAGES[mood as keyof typeof FROG_IMAGES] || FROG_IMAGES.happy;

    const handleImageError = () => {
        setUseFallback(true);
    };

    return (
        <div
            className={`select-none relative inline-flex flex-col items-center justify-center ${animClass} ${onClick ? 'cursor-pointer' : ''}`}
            style={{ width: size, height: showLilypad ? size * 1.15 : size }}
            role="img"
            aria-label={`Karakter - ${mood}`}
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
            tabIndex={onClick ? 0 : undefined}
        >
            {/* Avatar with fallback */}
            <div
                className="relative z-10 flex items-center justify-center transition-transform duration-200"
                style={{ width: size, height: size * 0.85 }}
            >
                {!useFallback ? (
                    <img
                        src={avatarUrl}
                        alt={`Karakter - ${mood}`}
                        className="w-full h-full object-contain drop-shadow-lg"
                        style={{ filter: mood === 'sad' ? 'grayscale(0.5) brightness(0.8)' : 'none' }}
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <img
                        src={frogSrc}
                        alt={`Kurbağa - ${mood}`}
                        className="w-full h-full object-contain drop-shadow-lg"
                        style={{ filter: mood === 'sad' ? 'grayscale(0.5) brightness(0.8)' : 'none' }}
                    />
                )}
            </div>

            {/* Lilypad - SVG */}
            {showLilypad && (
                <div className="relative -mt-3 w-[85%] h-auto animate-float-gentle" aria-hidden="true">
                    <svg
                        viewBox="0 0 100 40"
                        className="w-full h-auto text-green-400 drop-shadow-md"
                        fill="currentColor"
                    >
                        <path d="M50 35 Q20 20 10 5 Q30 15 50 5 Q70 15 90 5 Q80 20 50 35 Z" fillOpacity="0.9" />
                        <path d="M50 30 Q25 18 15 6 Q35 12 50 4 Q65 12 85 6 Q75 18 50 30 Z" fill="white" fillOpacity="0.3" />
                    </svg>
                </div>
            )}
        </div>
    );
}

// Export helper functions

export function getRandomAvatarSeed(): string {
    // Only works on client side - use in useEffect or event handlers
    if (typeof window === 'undefined') return 'frog-friend';
    const adjectives = ['happy', 'green', 'jumpy', 'smart', 'kind', 'brave', 'calm', 'bright'];
    const nouns = ['frog', 'toad', 'leaf', 'pond', 'reed', 'lily', 'moss', 'fern'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj}-${noun}-${Math.floor(Math.random() * 1000)}`;
}

export function AvatarPicker({ 
    onSelect, 
    currentSeed,
    size = 80,
    style = 'bottts'
}: { 
    onSelect: (seed: string) => void;
    currentSeed?: string;
    size?: number;
    style?: 'bottts' | 'shapes' | 'avataaars' | 'personas';
}) {
    const [seeds, setSeeds] = useState<string[]>([]);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const isInitialMount = useRef(true);

    // Regenerate seeds when style or size changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const generateSeeds = () => {
            const adjectives = ['happy', 'green', 'jumpy', 'smart', 'kind', 'brave', 'calm', 'bright'];
            const nouns = ['frog', 'toad', 'leaf', 'pond', 'reed', 'lily', 'moss', 'fern'];
            return Array.from({ length: 12 }, () => {
                const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
                const noun = nouns[Math.floor(Math.random() * nouns.length)];
                return `${adj}-${noun}-${Math.floor(Math.random() * 1000)}`;
            });
        };
        setSeeds(generateSeeds());
        setImageErrors(new Set());
    }, [style, size]);

    const handleImageError = (seed: string) => {
        setImageErrors(prev => new Set(prev).add(seed));
    };

    const buildAvatarUrl = (seed: string) => {
        const baseUrl = 'https://api.dicebear.com/9.x';
        const params = new URLSearchParams({
            seed,
            size: String(size),
        });

        // Style-specific parameters - using correct DiceBear 9.x API
        if (style === 'bottts') {
            params.set('eyes', 'happy,happy2,happy3');
            params.set('mouth', 'smile,laugh');
            params.set('colors', '16a34a,15803d,22c55e,4ade80,86efac,14532d,166534');
            params.set('backgroundColor', 'dcfce7,bbf7d0,86efac');
        } else if (style === 'shapes') {
            params.set('color', '16a34a,15803d,22c55e,4ade80,86efac,14532d,166534');
            params.set('backgroundColor', 'dcfce7,bbf7d0,86efac');
        } else if (style === 'avataaars') {
            // avataaars needs specific parameters that work
            params.set('skinColor', 'light,yellow');
            params.set('hairColor', 'green,emerald,brown');
            params.set('eyes', 'default,happy,wink');
            params.set('mouth', 'default,smile,tongue');
            params.set('accessories', 'none');
            params.set('clothesColor', 'green,emerald,teal,blue');
            params.set('backgroundColor', 'dcfce7,bbf7d0,86efac');
        } else if (style === 'personas') {
            // personas is a valid alternative to fun-emoji
            params.set('skinColor', 'light,yellow');
            params.set('hairColor', 'green,emerald');
            params.set('eyes', 'default,happy,wink');
            params.set('mouth', 'default,smile,tongue');
            params.set('accessories', 'none');
            params.set('backgroundColor', 'dcfce7,bbf7d0,86efac');
        }

        return `${baseUrl}/${style}/svg?${params.toString()}`;
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" role="group" aria-label="Avatar seçenekleri">
            {seeds.map((seed, i) => {
                const hasError = imageErrors.has(seed);
                const isSelected = currentSeed === seed;
                return (
                    <button
                        key={seed}
                        onClick={() => !hasError && onSelect(seed)}
                        disabled={hasError}
                        className={`relative p-2 rounded-xl border-3 transition-all ${
                            isSelected
                                ? 'border-green-500 bg-green-50 scale-105 shadow-lg ring-2 ring-green-200'
                                : hasError
                                    ? 'border-red-200 bg-red-50 opacity-50 cursor-not-allowed'
                                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                        }`}
                        aria-label={`Avatar ${i + 1}${hasError ? ' (yükleme hatası)' : ''}`}
                        aria-pressed={isSelected}
                    >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50">
                            {!hasError ? (
                                <img
                                    src={buildAvatarUrl(seed)}
                                    alt={`Avatar ${i + 1}`}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                    onError={() => handleImageError(seed)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">
                                    🐸
                                </div>
                            )}
                            {isSelected && !hasError && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                                    ✓
                                </div>
                            )}
                            {hasError && (
                                <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                                    <span className="text-xs text-red-500">⚠</span>
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}