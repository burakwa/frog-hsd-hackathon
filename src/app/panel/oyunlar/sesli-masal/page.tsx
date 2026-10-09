// app/panel/oyunlar/sesli-masal/page.tsx — 4. Oyun: Sesli Masal (Retro Hikaye Modu)
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import PraiseOverlay from '@/components/game/PraiseOverlay';
import Character from '@/components/game/Character';
import MicrophoneButton from '@/components/speech/MicrophoneButton';
import SpeechVisualizer from '@/components/speech/SpeechVisualizer';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useMicrophone } from '@/hooks/useMicrophone';
import { useProgress } from '@/hooks/useProgress';
import { stories } from '@/lib/data/stories';
import { analyze } from '@/lib/comparison/analyze';

export default function SesliMasalPage() {
    const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();
    const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();
    const { level, start: startMic, stop: stopMic } = useMicrophone();
    const { addStars, recordSession } = useProgress();

    const [storyIndex, setStoryIndex] = useState(0);
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [showPraise, setShowPraise] = useState(false);
    const [stars, setStars] = useState(3);
    const [readSentences, setReadSentences] = useState<number[]>([]);

    const currentStory = stories[storyIndex];
    const sentences = currentStory.metin
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(Boolean);

    useEffect(() => {
        setSentenceIndex(0);
        setReadSentences([]);
        setShowPraise(false);
        stopSpeaking();
    }, [storyIndex]);

    const activeSentence = sentences[sentenceIndex] || sentences[0];

    const handleReadActive = () => {
        if (isSpeaking) {
            stopSpeaking();
        } else {
            speak(activeSentence);
        }
    };

    const handleReadAll = () => {
        if (isSpeaking) {
            stopSpeaking();
        } else {
            speak(currentStory.metin);
        }
    };

    const handleToggleMic = async () => {
        if (isListening) {
            stopListening();
            stopMic();
        } else {
            await startMic();
            startListening();
        }
    };

    // Analyze spoken speech
    useEffect(() => {
        if (!transcript || isListening) return;

        const result = analyze(activeSentence.toLowerCase(), transcript.toLowerCase());
        if (result.score >= 50 || transcript.length > 5) {
            if (!readSentences.includes(sentenceIndex)) {
                setReadSentences(prev => [...prev, sentenceIndex]);
            }
            if (sentenceIndex + 1 < sentences.length) {
                setSentenceIndex(i => i + 1);
            } else {
                const earned = 3;
                setStars(earned);
                setShowPraise(true);
                addStars(earned);
                recordSession('sesli-masal', 100, earned, 90);
            }
        }
    }, [transcript, isListening]);

    const handleNextSentence = () => {
        if (sentenceIndex + 1 < sentences.length) {
            setSentenceIndex(i => i + 1);
        } else {
            setStars(3);
            setShowPraise(true);
            addStars(3);
            recordSession('sesli-masal', 100, 3, 60);
        }
    };

    const handlePrevSentence = () => {
        if (sentenceIndex > 0) {
            setSentenceIndex(i => i - 1);
        }
    };

    return (
        <main className="w-full min-h-screen bg-slate-950 pt-2 md:pt-4 px-4 md:px-6 pb-4 flex flex-col max-w-4xl mx-auto select-none">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-4 border-b-2 border-slate-800 pb-3">
                <Link
                    href="/panel/oyunlar"
                    className="pixel-btn bg-slate-800 hover:bg-slate-700 text-cyan-400 py-2 px-3 text-xs flex items-center gap-1.5"
                >
                    <ArrowLeft size={14} />
                    <span>GERİ</span>
                </Link>

                {/* Story Selector Pills */}
                <div className="flex gap-1.5 overflow-x-auto py-1">
                    {stories.map((s, idx) => (
                        <button
                            key={s.id}
                            onClick={() => setStoryIndex(idx)}
                            className={`font-pixel text-[9px] px-2.5 py-1.5 rounded-lg border-2 transition-all whitespace-nowrap ${
                                storyIndex === idx
                                    ? 'bg-yellow-400 text-slate-950 border-yellow-300 font-bold shadow-sm'
                                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                        >
                            {s.emoji} {s.baslik.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Retro 16-Bit RPG Story Book Card */}
            <motion.div
                key={currentStory.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative pixel-box bg-slate-900 border-yellow-400 p-5 md:p-6 rounded-2xl mb-4 overflow-hidden"
            >
                <div className="retro-lake-scene absolute inset-0 pointer-events-none z-0 opacity-30" aria-hidden="true" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{currentStory.emoji}</span>
                            <div>
                                <h1 className="font-pixel text-base md:text-lg text-yellow-300">
                                    {currentStory.baslik.toUpperCase()}
                                </h1>
                                <p className="font-arcade text-[11px] text-slate-400">
                                    CÜMLE {sentenceIndex + 1} / {sentences.length}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleReadAll}
                            className="pixel-btn bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-3 text-[10px] flex items-center gap-1.5"
                        >
                            <Volume2 size={14} />
                            <span>TÜMÜNÜ DİNLE</span>
                        </button>
                    </div>

                    {/* Story Sentences Display with Karaoke Highlight */}
                    <div className="space-y-2.5 mb-5 max-h-[300px] overflow-y-auto pr-1">
                        {sentences.map((sent, idx) => {
                            const isActive = idx === sentenceIndex;
                            const isDone = readSentences.includes(idx);
                            return (
                                <motion.div
                                    key={idx}
                                    onClick={() => setSentenceIndex(idx)}
                                    className={`p-3.5 rounded-xl cursor-pointer transition-all border-2 ${
                                        isActive
                                            ? 'bg-slate-800 border-yellow-400 shadow-[3px_3px_0px_#000]'
                                            : isDone
                                            ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 text-slate-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-2.5">
                                        <span className="font-pixel text-[10px] text-yellow-400 mt-0.5">
                                            {idx + 1}.
                                        </span>
                                        <p
                                            className={`flex-1 text-sm md:text-base leading-relaxed ${
                                                isActive
                                                    ? 'font-bold text-yellow-200'
                                                    : isDone
                                                    ? 'text-emerald-200'
                                                    : 'text-slate-300'
                                            }`}
                                        >
                                            {sent}
                                        </p>
                                        {isDone && (
                                            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Sentence Audio & Progress Controls */}
                    <div className="flex items-center justify-between pt-3 border-t-2 border-slate-800">
                        <button
                            onClick={handlePrevSentence}
                            disabled={sentenceIndex === 0}
                            className="pixel-btn bg-slate-800 text-slate-300 py-2 px-3 text-[10px] disabled:opacity-30"
                        >
                            <ChevronLeft size={14} />
                            <span>ÖNCEKİ</span>
                        </button>

                        <button
                            onClick={handleReadActive}
                            className="pixel-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2 px-4 text-[10px] flex items-center gap-1.5"
                        >
                            <Volume2 size={14} />
                            <span>{isSpeaking ? 'DURDUR' : 'BU CÜMLEYİ DİNLE'}</span>
                        </button>

                        <button
                            onClick={handleNextSentence}
                            className="pixel-btn bg-slate-800 text-slate-300 py-2 px-3 text-[10px]"
                        >
                            <span>SONRAKİ</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Read Along Voice Practice HUD */}
            <div className="pixel-box p-4 rounded-xl flex flex-col items-center gap-3">
                <Character mood={isListening ? 'speaking' : 'happy'} size={56} showLilypad={true} />
                <p className="font-pixel text-[10px] text-slate-400 text-center">
                    CÜMLEYİ YÜKSEK SESLE SEN OKU!
                </p>

                <SpeechVisualizer isActive={isListening} level={level} bars={9} />

                <MicrophoneButton
                    isListening={isListening}
                    onToggle={handleToggleMic}
                    size={64}
                />

                {transcript && (
                    <div className="bg-slate-900 border border-yellow-400 text-yellow-300 font-pixel text-[11px] px-3.5 py-2 rounded-lg">
                        &quot;{transcript}&quot;
                    </div>
                )}
            </div>

            <PraiseOverlay
                isOpen={showPraise}
                stars={stars}
                score={100}
                message="MASAL BAŞARIYLA TAMAMLANDI! 📖✨"
                onNext={() => {
                    setShowPraise(false);
                    setStoryIndex(i => (i + 1) % stories.length);
                }}
                onRetry={() => {
                    setShowPraise(false);
                    setSentenceIndex(0);
                    setReadSentences([]);
                }}
            />
        </main>
    );
}
