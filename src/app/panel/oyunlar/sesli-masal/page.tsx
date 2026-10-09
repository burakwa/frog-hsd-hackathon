// app/panel/oyunlar/sesli-masal/page.tsx — Sesli Masal Oyunu
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Play } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
            {/* Top Navigation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <Link
                    href="/panel/oyunlar"
                    className="btn btn-ghost btn-small"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Geri
                </Link>

                {/* Story Selector */}
                <div className="flex gap-2 overflow-x-auto py-2">
                    {stories.map((s, idx) => (
                        <button
                            key={s.id}
                            onClick={() => setStoryIndex(idx)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-rounded text-sm whitespace-nowrap transition-all ${
                                storyIndex === idx
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-100'
                            }`}
                        >
                            <span className="text-lg">{s.emoji}</span>
                            <span>{s.baslik}</span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Story Book Card */}
            <motion.div
                key={currentStory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card card-elevated p-6 md:p-8 relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                                <span className="text-2xl">{currentStory.emoji}</span>
                            </div>
                            <div>
                                <h1 className="font-fun text-xl md:text-2xl text-gray-800">{currentStory.baslik}</h1>
                                <p className="text-gray-500 text-sm">Cümle {sentenceIndex + 1} / {sentences.length}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleReadAll}
                            className="btn btn-secondary"
                        >
                            <Volume2 className="w-4 h-4" />
                            Tümünü Dinle
                        </button>
                    </div>

                    {/* Sentences List */}
                    <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto pr-2">
                        {sentences.map((sent, idx) => {
                            const isActive = idx === sentenceIndex;
                            const isDone = readSentences.includes(idx);
                            return (
                                <motion.div
                                    key={idx}
                                    onClick={() => setSentenceIndex(idx)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                        isActive
                                            ? 'bg-green-50 border-green-300 shadow-lg'
                                            : isDone
                                            ? 'bg-green-50 border-green-200 text-green-700'
                                            : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-fun text-xs mt-0.5 ${
                                            isActive ? 'bg-green-500 text-white' :
                                            isDone ? 'bg-green-500 text-white' :
                                            'bg-gray-100 text-gray-400'
                                        }">
                                            {isDone ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                            ) : (
                                                idx + 1
                                            )}
                                        </div>
                                        <p className={`flex-1 text-sm md:text-base leading-relaxed ${
                                            isActive ? 'font-semibold text-gray-900' :
                                            isDone ? 'text-green-700' :
                                            'text-gray-600'
                                        }`}>
                                            {sent}
                                        </p>
                                        {isDone && (
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                            onClick={handlePrevSentence}
                            disabled={sentenceIndex === 0}
                            className="btn btn-ghost disabled:opacity-30"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Önceki
                        </button>

                        <button
                            onClick={handleReadActive}
                            className="btn btn-primary"
                        >
                            <Volume2 className="w-4 h-4" />
                            {isSpeaking ? 'Durdur' : 'Bu Cümleyi Dinle'}
                        </button>

                        <button
                            onClick={handleNextSentence}
                            className="btn btn-secondary"
                        >
                            Sonraki
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Read Along Practice */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card card-colored-green p-6"
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <Character mood={isListening ? 'speaking' : 'happy'} size={70} showLilypad={true} />
                    <p className="font-fun text-lg text-green-800">Cümleyi Yüksek Sesle Sen Oku! 📖</p>

                    <div className="w-full max-w-md">
                        <SpeechVisualizer isActive={isListening} level={level} bars={9} />
                    </div>

                    <MicrophoneButton
                        isListening={isListening}
                        onToggle={handleToggleMic}
                        size={64}
                    />

                    {transcript && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-white/50 border border-green-200 rounded-xl text-center"
                        >
                            <span className="font-mono text-green-800">"{transcript}"</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>

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
        </div>
    );
}