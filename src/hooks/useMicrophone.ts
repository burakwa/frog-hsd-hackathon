// hooks/useMicrophone.ts
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioVisualizer } from '@/lib/speech/audioVisualizer';

export function useMicrophone() {
    const [level, setLevel] = useState(0);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const visualizerRef = useRef<AudioVisualizer | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startVisualization = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setHasPermission(true);

            const viz = new AudioVisualizer();
            await viz.init(stream);
            visualizerRef.current = viz;
            viz.startLoop(setLevel);
        } catch {
            setHasPermission(false);
        }
    }, []);

    const stopVisualization = useCallback(() => {
        visualizerRef.current?.stop();
        streamRef.current?.getTracks().forEach(t => t.stop());
        visualizerRef.current = null;
        streamRef.current = null;
        setLevel(0);
    }, []);

    useEffect(() => {
        return () => {
            visualizerRef.current?.stop();
            streamRef.current?.getTracks().forEach(t => t.stop());
        };
    }, []);

    return {
        level,
        hasPermission,
        startVisualization,
        stopVisualization,
        start: startVisualization,
        stop: stopVisualization,
    };
}
