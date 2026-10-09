// app/panel/profil/page.tsx — Profil ve Maskot Ayarları
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Settings, Volume2, Sparkles, Check, Star, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import Character from '@/components/game/Character';
import ProgressBar from '@/components/ui/ProgressBar';
import { starsToLevel } from '@/lib/utils/helpers';

export default function ProfilPage() {
    const { user, signOut } = useAuth();
    const { totalStars, badges } = useProgress(user?.id);

    const [nickname, setNickname] = useState('Minik Kurbağa');
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
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
            <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-black text-purple-900 flex items-center gap-2">
                        <User className="text-purple-600" />
                        <span>Oyuncu Profili</span>
                    </h1>
                    <p className="text-gray-500 font-semibold text-sm">
                        Karakterini özelleştir ve gelişim ayarlarını yap
                    </p>
                </div>
            </motion.div>

            {/* Profile Avatar & Level Hero */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass flex flex-col sm:flex-row items-center gap-6 p-6"
            >
                <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-200 to-indigo-100 flex items-center justify-center shadow-inner border-4 border-white">
                        <Character mood="excited" size={88} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 text-purple-900 font-black text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Star size={12} className="fill-purple-900" />
                        <span>Sv. {level}</span>
                    </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                    <h2 className="text-2xl font-black text-purple-950">{nickname}</h2>
                    <p className="text-sm text-gray-500 font-bold">
                        {user?.email ?? 'Yerel Çocuk Profili'} • {age} Yaşında
                    </p>

                    <div className="max-w-md pt-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                            <span>Seviye {level} İlerlemesi</span>
                            <span className="text-purple-700 font-black">{totalStars} / {level * 10} Yıldız</span>
                        </div>
                        <ProgressBar value={progress} colorClass="bg-purple-600" height="h-3" />
                    </div>
                </div>
            </motion.div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSave} className="card p-6 space-y-6">
                <h3 className="text-lg font-black text-purple-900 flex items-center gap-2">
                    <Settings size={20} className="text-purple-600" />
                    <span>Profil Bilgileri & Karakter</span>
                </h3>

                {/* Nickname & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">İsim / Takma Ad</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            className="input-field"
                            placeholder="Adını yaz..."
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Yaş</label>
                        <select
                            value={age}
                            onChange={e => setAge(Number(e.target.value))}
                            className="input-field cursor-pointer"
                        >
                            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(a => (
                                <option key={a} value={a}>
                                    {a} Yaşında
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Avatar Selection */}
                <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Favori Maskot</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'kurbaga', name: 'Kurbağa Zıpzıp', emoji: '🐸' },
                            { id: 'panda', name: 'Panda Pofuduk', emoji: '🐼' },
                            { id: 'tavsan', name: 'Tavşan Pamuk', emoji: '🐰' },
                        ].map(av => (
                            <button
                                type="button"
                                key={av.id}
                                onClick={() => setSelectedAvatar(av.id as any)}
                                className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${
                                    selectedAvatar === av.id
                                        ? 'border-purple-600 bg-purple-50 shadow-md scale-102'
                                        : 'border-gray-200 hover:border-purple-200 bg-white'
                                }`}
                            >
                                <span className="text-4xl">{av.emoji}</span>
                                <span className="text-xs font-black text-gray-800">{av.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Therapy Audio Preferences */}
                <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Volume2 size={16} className="text-purple-600" />
                        <span>Sesli Rehber Hızı</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'slow', label: '🐢 Yavaş (Öğrenme modu)' },
                            { id: 'normal', label: '🚶 Normal' },
                            { id: 'fast', label: '🐇 Hızlı' },
                        ].map(rate => (
                            <button
                                type="button"
                                key={rate.id}
                                onClick={() => setSpeechRate(rate.id as any)}
                                className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all ${
                                    speechRate === rate.id
                                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                                        : 'border-gray-200 text-gray-600 hover:border-purple-200'
                                }`}
                            >
                                {rate.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-bold text-emerald-600">
                        {savedMsg ? '✓ Ayarlar kaydedildi!' : ''}
                    </span>
                    <button type="submit" className="btn-primary py-2.5 px-6 text-sm">
                        Kaydet ve Güncelle
                    </button>
                </div>
            </form>

            {/* Badges Collection in Profile */}
            <div className="card p-6">
                <h3 className="text-lg font-black text-purple-900 mb-4 flex items-center gap-2">
                    <Award size={20} className="text-amber-500" />
                    <span>Koleksiyon Rozetleri</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {badges.map(b => (
                        <div
                            key={b.id}
                            className={`p-3 rounded-2xl border flex items-center gap-3 ${
                                b.kazanildi ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
                            }`}
                        >
                            <span className="text-2xl">{b.emoji}</span>
                            <div className="min-w-0">
                                <p className="text-xs font-black text-gray-900 truncate">{b.ad}</p>
                                <p className="text-[10px] text-gray-500 truncate">{b.kazanildi ? 'Kazanıldı' : 'Kilitli'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
