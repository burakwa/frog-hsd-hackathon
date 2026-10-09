// app/panel/profil/page.tsx — Retro Profil ve Maskot Ayarları
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Settings, Volume2, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import Character from '@/components/game/Character';
import { starsToLevel } from '@/lib/utils/helpers';

export default function ProfilPage() {
    const { user } = useAuth();
    const { totalStars, badges } = useProgress(user?.id);

    const [nickname, setNickname] = useState('KAHRAMAN KURBAĞA');
    const [selectedAvatar, setSelectedAvatar] = useState<'kurbaga' | 'panda' | 'tavsan'>('kurbaga');
    const [age, setAge] = useState(6);
    const [speechRate, setSpeechRate] = useState<'slow' | 'normal' | 'fast'>('normal');
    const [savedMsg, setSavedMsg] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedName = localStorage.getItem('frog_player_name');
            if (storedName) setNickname(storedName);
            const storedAvatar = localStorage.getItem('frog_player_avatar');
            if (storedAvatar) setSelectedAvatar(storedAvatar as any);
        }
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof window !== 'undefined') {
            localStorage.setItem('frog_player_name', nickname);
            localStorage.setItem('frog_player_avatar', selectedAvatar);
        }
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2000);
    };

    const level = starsToLevel(totalStars);
    const progress = (totalStars % 10) * 10;

    return (
        <div className="w-full pt-2 md:pt-4 px-4 md:px-6 pb-4 max-w-3xl mx-auto space-y-6 select-none">
            <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between border-b-2 border-slate-800 pb-3"
            >
                <div>
                    <h1 className="font-pixel text-lg md:text-2xl text-yellow-300 flex items-center gap-2 drop-shadow">
                        <span>👤</span>
                        <span>OYUNCU PROFİLİ</span>
                    </h1>
                    <p className="font-arcade text-xs text-slate-400 mt-1">
                        KARAKTERİNİ VE OYUN AYARLARINI ÖZELLEŞTİR
                    </p>
                </div>
            </motion.div>

            {/* Profile Avatar & Level Hero */}
            <div className="pixel-box p-6 rounded-2xl bg-slate-900 border-indigo-500 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-slate-950 border-3 border-yellow-400 flex items-center justify-center shadow-lg p-2">
                        <Character mood="excited" size={60} showLilypad={true} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 border-2 border-black text-slate-950 font-pixel text-[10px] px-2 py-0.5 rounded shadow">
                        LVL {level}
                    </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                    <h2 className="font-pixel text-xl text-yellow-300">{nickname.toUpperCase()}</h2>
                    <p className="font-arcade text-xs text-slate-400">
                        {user?.email ?? 'YEREL ÇOCUK PROFİLİ'} • {age} YAŞINDA
                    </p>

                    <div className="max-w-md pt-2">
                        <div className="flex justify-between font-pixel text-[10px] text-slate-400 mb-1">
                            <span>LEVEL {level} PROGRESS</span>
                            <span className="text-yellow-400">{totalStars} / {level * 10} ★</span>
                        </div>
                        <div className="w-full bg-slate-950 h-3.5 rounded border border-slate-700 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Settings Form */}
            <form onSubmit={handleSave} className="pixel-box p-6 rounded-2xl bg-slate-900 border-slate-700 space-y-6">
                <h3 className="font-pixel text-xs md:text-sm text-yellow-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Settings size={16} />
                    <span>PROFİL BİLGİLERİ VE SEÇİMLER</span>
                </h3>

                {/* Nickname & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="font-pixel text-[10px] text-cyan-300 mb-1.5 block">OYUNCU İSMİ</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            className="input-field text-sm"
                            placeholder="Adını yaz..."
                        />
                    </div>

                    <div>
                        <label className="font-pixel text-[10px] text-cyan-300 mb-1.5 block">YAŞ</label>
                        <select
                            value={age}
                            onChange={e => setAge(Number(e.target.value))}
                            className="input-field text-sm cursor-pointer"
                        >
                            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(a => (
                                <option key={a} value={a} className="bg-slate-900 text-white">
                                    {a} Yaşında
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mascot Selection */}
                <div>
                    <label className="font-pixel text-[10px] text-cyan-300 mb-2 block">FAVORİ MASKOT</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'kurbaga', name: 'KURBAĞA', emoji: '🐸' },
                            { id: 'panda', name: 'PANDA', emoji: '🐼' },
                            { id: 'tavsan', name: 'TAVŞAN', emoji: '🐰' },
                        ].map(av => (
                            <button
                                type="button"
                                key={av.id}
                                onClick={() => setSelectedAvatar(av.id as any)}
                                className={`p-4 rounded-xl border-3 flex flex-col items-center gap-2 transition-all ${
                                    selectedAvatar === av.id
                                        ? 'border-yellow-400 bg-slate-800 shadow-[4px_4px_0px_#000] scale-102'
                                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                                }`}
                            >
                                <span className="text-3xl" aria-hidden="true">{av.emoji}</span>
                                <span className="font-pixel text-[10px] text-white mt-1">{av.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Speech rate */}
                <div>
                    <label className="font-pixel text-[10px] text-cyan-300 mb-2 flex items-center gap-1.5">
                        <Volume2 size={14} />
                        <span>REHBER SES HIZI</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'slow', label: '🐢 YAVAŞ' },
                            { id: 'normal', label: '🚶 NORMAL' },
                            { id: 'fast', label: '🐇 HIZLI' },
                        ].map(rate => (
                            <button
                                type="button"
                                key={rate.id}
                                onClick={() => setSpeechRate(rate.id as any)}
                                className={`p-3 rounded-lg border-2 font-pixel text-[10px] transition-all ${
                                    speechRate === rate.id
                                        ? 'border-emerald-400 bg-emerald-950 text-emerald-300'
                                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                                }`}
                            >
                                {rate.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="font-pixel text-[10px] text-emerald-400">
                        {savedMsg ? '✓ AYARLAR KAYDEDİLDİ!' : ''}
                    </span>
                    <button type="submit" className="pixel-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 px-6 text-xs">
                        KAYDET
                    </button>
                </div>
            </form>
        </div>
    );
}
