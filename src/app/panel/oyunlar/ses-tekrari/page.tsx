// app/panel/oyunlar/ses-tekrari/page.tsx — 1. Oyun: Ses Tekrarı (Retro Arcade Modu)
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Trophy, Sparkles } from 'lucide-react';
import PraiseOverlay from '@/components/game/PraiseOverlay';
import MicrophoneButton from '@/components/speech/MicrophoneButton';
import SpeechVisualizer from '@/components/speech/SpeechVisualizer';
import PronunciationFeedback from '@/components/speech/PronunciationFeedback';
import Character from '@/components/game/Character';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useProgress } from '@/hooks/useProgress';
import { analyze } from '@/lib/comparison/analyze';
import { exercises } from '@/lib/data/exercises';
import { randomPraise, randomEncouragement } from '@/lib/utils/praise';
import { scoreToStars } from '@/lib/utils/helpers';
import type { AnalysisResult, MascotMood } from '@/types';

export default function SesTekrariGame() {
    const [mounted, setMounted] = useState(false);
    const [index, setIndex] = useState(0);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [stars, setStars] = useState(0);
    const [overlayMsg, setOverlayMsg] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);
    const [lastFinal, setLastFinal] = useState('');
    const [mascotMood, setMascotMood] = useState<MascotMood>('happy');

    const { transcript, finalTranscript, isListening, error, isSupported, start, stop, resetTranscript } = useSpeechRecognition();
    const { speak } = useSpeechSynthesis();
    const { addStars, recordSession } = useProgress();

    const ex = exercises[index % exercises.length];

    useEffect(() => { setMounted(true); }, []);

    // 8-bit sound
    const playChiptune = (freq: number, type: OscillatorType = 'square', duration: number = 0.2) => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch {
            // ignore WebAudio restrictions
        }
    };

    // Analyze speech
    useEffect(() => {
        const spoken = (finalTranscript || transcript).trim();
        if (isListening || !spoken || spoken === lastFinal) return;

        setLastFinal(spoken);
        setMascotMood('thinking');

        const r = analyze(ex.metin, spoken);
        setResult(r);
        const s = scoreToStars(r.score);
        setStars(s);

        if (s >= 2) {
            playChiptune(587, 'square', 0.15);
            setTimeout(() => playChiptune(880, 'triangle', 0.3), 100);

            const msg = randomPraise();
            setOverlayMsg(msg);
            setMascotMood('excited');
            addStars(s);
            recordSession('ses-tekrari', r.score, s, 30);
            setTimeout(() => speak(msg), 300);
            setTimeout(() => setShowOverlay(true), 600);
        } else {
            playChiptune(200, 'sawtooth', 0.25);
            setOverlayMsg(randomEncouragement());
            setMascotMood('sad');
        }
    }, [isListening, finalTranscript, transcript, lastFinal, ex.metin, speak]);

    useEffect(() => {
        if (isListening) setMascotMood('speaking');
    }, [isListening]);

    const reset = () => {
        stop(); resetTranscript();
        setResult(null); setStars(0); setLastFinal('');
        setShowOverlay(false); setMascotMood('happy');
    };

    const handleNext = () => {
        reset();
        setIndex(i => (i + 1) % exercises.length);
    };

    if (mounted && !isSupported) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="pixel-box p-6 text-center max-w-sm rounded-xl">
                    <p className="text-4xl mb-3">👾</p>
                    <h2 className="font-pixel text-yellow-400 text-sm mb-2">TARAYICI DESTEĞİ YOK</h2>
                    <p className="text-slate-400 text-xs font-arcade">Chrome veya Edge ile çalıştırın.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="w-full min-h-screen bg-slate-950 pt-2 md:pt-4 px-4 md:px-6 pb-4 flex flex-col max-w-3xl mx-auto select-none">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4 border-b-2 border-slate-800 pb-3">
                <Link href="/panel/oyunlar">
                    <button className="pixel-btn bg-slate-800 hover:bg-slate-700 text-cyan-400 py-2 px-3 text-xs flex items-center gap-1.5">
                        <ArrowLeft size={14} /> GERİ
                    </button>
                </Link>

                <div className="flex items-center gap-3">
                    <div className="font-pixel text-yellow-400 text-xs bg-slate-900 border-2 border-yellow-400/50 px-3 py-1.5 rounded-lg shadow-sm">
                        STAGE {index + 1} / {exercises.length}
                    </div>
                    <button
                        onClick={handleNext}
                        className="pixel-btn bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-3 text-xs"
                    >
                        SONRAKİ →
                    </button>
                </div>
            </div>

            {/* Retro Exercise Arena with Lake Background */}
            <div className="relative rounded-2xl border-4 border-slate-700 overflow-hidden shadow-2xl p-6 mb-4 flex flex-col items-center justify-center text-center bg-sky-950 min-h-[320px]">
                <div className="retro-lake-scene absolute inset-0 pointer-events-none z-0 opacity-60" aria-hidden="true" />

                {/* Flying Little Sprite */}
                <div className="absolute top-4 right-6 w-12 h-12 flex items-center justify-center text-2xl fly-animated pointer-events-none z-10" aria-hidden="true">
                    🪰
                </div>

                {/* Frog Mascot on Lilypad */}
                <div className="relative z-10 mb-2">
                    <Character mood={mascotMood} size={88} showLilypad={true} />
                </div>

                {/* Target Word Display */}
                <motion.div
                    key={ex.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 pixel-box bg-slate-900/90 p-4 rounded-2xl max-w-xs w-full flex flex-col items-center border-yellow-400"
                >
                    <span className="text-5xl mb-2">{ex.emoji}</span>
                    <h1 className="font-pixel text-2xl md:text-3xl text-yellow-300 tracking-wider mb-3">
                        {ex.metin.toUpperCase()}
                    </h1>

                    <button
                        onClick={() => { setMascotMood('speaking'); speak(ex.metin); }}
                        className="pixel-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2 px-4 text-xs flex items-center gap-2"
                    >
                        <Volume2 size={16} /> DİNLE
                    </button>
                </motion.div>
            </div>

            {/* Speech Recording Controls */}
            <div className="pixel-box p-4 rounded-xl flex flex-col items-center gap-3">
                {/* Spoken transcript HUD */}
                <div className="min-h-[28px] text-center font-pixel text-xs">
                    {isListening ? (
                        <span className="text-red-400 animate-pulse">● DİNLİYOR: &quot;{transcript || '...'}&quot;</span>
                    ) : transcript ? (
                        <span className="text-emerald-400">DUYULAN: &quot;{transcript}&quot;</span>
                    ) : (
                        <span className="text-slate-400">MİKROFONA BAS VE KELİMEYİ SÖYLE!</span>
                    )}
                </div>

                {/* Audio Visualizer */}
                <SpeechVisualizer isActive={isListening} />

                {/* Retro Mic Button */}
                <MicrophoneButton
                    isListening={isListening}
                    onToggle={() => isListening ? stop() : start()}
                    size="lg"
                />

                {/* Pronunciation Feedback */}
                {result && !showOverlay && result.score < 70 && (
                    <div className="w-full max-w-md">
                        <PronunciationFeedback
                            errors={result.errors}
                            score={result.score}
                            message={overlayMsg}
                            onRetry={reset}
                        />
                    </div>
                )}

                {error && (
                    <p className="text-center font-pixel text-red-400 text-[11px] mt-1">{error}</p>
                )}
            </div>

            {/* Praise Overlay */}
            <PraiseOverlay
                isOpen={showOverlay}
                stars={stars}
                message={overlayMsg}
                onNext={handleNext}
                onRetry={reset}
            />
        </main>
    );
}
