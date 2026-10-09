// components/game/ConfettiReward.tsx
'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Props {
    trigger: boolean;
    stars?: number; // 1-3 — daha fazla yıldız = daha güçlü patlama
}

export default function ConfettiReward({ trigger, stars = 2 }: Props) {
    useEffect(() => {
        if (!trigger) return;

        const count = stars === 3 ? 200 : stars === 2 ? 130 : 60;
        const spread = stars === 3 ? 100 : 80;

        confetti({
            particleCount: count,
            spread,
            origin: { y: 0.55 },
            colors: ['#a855f7', '#facc15', '#34d399', '#f472b6', '#60a5fa'],
        });

        if (stars === 3) {
            // İkinci patlama 0.3 saniye sonra
            setTimeout(() => {
                confetti({
                    particleCount: 80,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0, y: 0.6 },
                    colors: ['#a855f7', '#facc15', '#34d399'],
                });
                confetti({
                    particleCount: 80,
                    angle: 120,
                    spread: 60,
                    origin: { x: 1, y: 0.6 },
                    colors: ['#f472b6', '#60a5fa', '#fbbf24'],
                });
            }, 300);
        }
    }, [trigger, stars]);

    return null;
}
