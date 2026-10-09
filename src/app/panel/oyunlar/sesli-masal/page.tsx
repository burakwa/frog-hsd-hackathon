// app/panel/oyunlar/sesli-masal/page.tsx — 4. Oyun: Sesli Hikaye Okuma
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Play, Pause, ChevronLeft, ChevronRight, Mic, CheckCircle2, BookOpen } from 'lucide-react';
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
    // Split story text into clean sentences
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

    // Analyze spoken speech against active sentence
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
                // Completed whole story!
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
        <main className="min-h-screen bg-game p-4 md:p-8 flex flex-col max-w-4xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/panel/oyunlar"
                    className="flex items-center gap-2 text-purple-700 font-bold bg-white/80 px-4 py-2 rounded-2xl shadow-sm hover:bg-white transition-all"
                >
                    <ArrowLeft size={18} />
                    <span>Oyunlar</span>
                </Link>

                {/* Story Selector Pills */}
                <div className="flex gap-1.5 overflow-x-auto py-1">
                    {stories.map((s, idx) => (
                        <button
                            key={s.id}
                            onClick={() => setStoryIndex(idx)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                                storyIndex === idx
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'bg-white/80 text-purple-700 hover:bg-white'
                            }`}
                        >
                            {s.emoji} {s.baslik}
                        </button>
                    ))}
                </div>
            </div>

            {/* Story Card */}
            <motion.div
                key={currentStory.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass mb-6 p-6 md:p-8 shadow-xl relative"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{currentStory.emoji}</span>
                        <div>
                            <h1 className="text-2xl font-black text-purple-900">{currentStory.baslik}</h1>
                            <p className="text-xs text-gray-400 font-bold">
                                Cümle {sentenceIndex + 1} / {sentences.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReadAll}
                            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                        >
                            <Volume2 size={16} />
                            <span>Tümünü Dinle</span>
                        </button>
                    </div>
                </div>

                {/* Story Sentences Display with Active Highlight */}
                <div className="space-y-3 mb-6">
                    {sentences.map((sent, idx) => {
                        const isActive = idx === sentenceIndex;
                        const isDone = readSentences.includes(idx);
                        return (
                            <motion.div
                                key={idx}
                                onClick={() => setSentenceIndex(idx)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                                    isActive
                                        ? 'bg-purple-50/90 border-purple-400 shadow-md shadow-purple-100 scale-[1.01]'
                                        : isDone
                                        ? 'bg-emerald-50/50 border-emerald-200 text-gray-700'
                                        : 'bg-white/50 border-transparent hover:bg-white text-gray-600'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="font-bold text-xs mt-1 w-5 text-purple-400">
                                        {idx + 1}.
                                    </span>
                                    <p
                                        className={`flex-1 text-base md:text-lg leading-relaxed ${
                                            isActive
                                                ? 'font-black text-purple-950'
                                                : isDone
                                                ? 'font-bold text-emerald-900'
                                                : 'font-semibold'
                                        }`}
                                    >
                                        {sent}
                                    </p>
                                    {isDone && (
                                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Sentence Audio & Progress Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                    <button
                        onClick={handlePrevSentence}
                        disabled={sentenceIndex === 0}
                        className="btn-secondary text-sm py-2 px-3 disabled:opacity-40"
                    >
                        <ChevronLeft size={18} />
                        <span>Önceki</span>
                    </button>

                    <button
                        onClick={handleReadActive}
                        className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2"
                    >
                        <Volume2 size={18} />
                        <span>{isSpeaking ? 'Durdur' : 'Bu Cümleyi Dinle'}</span>
                    </button>

                    <button
                        onClick={handleNextSentence}
                        className="btn-secondary text-sm py-2 px-3"
                    >
                        <span>Sonraki</span>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </motion.div>

            {/* Read Along Voice Practice */}
            <div className="card flex flex-col items-center gap-3 p-6 text-center">
                <Character mood={isListening ? 'speaking' : 'happy'} size={60} />
                <p className="text-sm font-bold text-gray-600">
                    Şimdi sırası gelen cümleyi yüksek sesle sen oku!
                </p>

                <SpeechVisualizer isActive={isListening} level={level} bars={9} />

                <MicrophoneButton
                    isListening={isListening}
                    onToggle={handleToggleMic}
                    size={64}
                />

                {transcript && (
                    <div className="bg-purple-50 text-purple-900 font-bold px-4 py-2 rounded-xl text-sm">
                        &quot;{transcript}&quot;
                    </div>
                )}
            </div>

            {/* Praise Overlay */}
            <PraiseOverlay
                isOpen={showPraise}
                stars={stars}
                score={100}
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
