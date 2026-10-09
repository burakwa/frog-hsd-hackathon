// hooks/useSpeechSynthesis.ts
'use client';
import { useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const speak = useCallback((text: string, rate = 0.85) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'tr-TR';
        u.rate = rate;   // çocuklar için yavaş
        u.pitch = 1.1;   // biraz tiz, dostane ses

        const voices = window.speechSynthesis.getVoices();
        const trVoice = voices.find(v => v.lang.replace('_', '-').toLowerCase().startsWith('tr'));
        if (trVoice) u.voice = trVoice;

        // Chrome garbage collection referansını koru
        utteranceRef.current = u;

        window.speechSynthesis.speak(u);
    }, []);

    return { speak };
}