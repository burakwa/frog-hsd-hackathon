// hooks/useSpeechSynthesis.ts
'use client';
import { useState, useCallback } from 'react';
import { speechEngine } from '@/lib/speech/synthesis';

export function useSpeechSynthesis() {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback((text: string, rate = 0.85) => {
        speechEngine.speak(text, {
            rate,
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    }, []);

    const stop = useCallback(() => {
        speechEngine.stop();
        setIsSpeaking(false);
    }, []);

    return { speak, stop, isSpeaking };
}