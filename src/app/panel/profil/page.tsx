// app/panel/profil/page.tsx — Profile Settings with DiceBear Avatar
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Settings, Volume2, Star, Save, CheckCircle2, Image, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import Character, { AvatarPicker } from '@/components/game/Character';
import { starsToLevel } from '@/lib/utils/helpers';
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
    const { user, profile, updateProfile, signOut } = useAuth();
    const { totalStars, badges } = useProgress();
    const router = useRouter();

    const [nickname, setNickname] = useState('');
    const [avatarSeed, setAvatarSeed] = useState<string>('frog-friend');
    const [age, setAge] = useState(6);
    const [speechRate, setSpeechRate] = useState<'slow' | 'normal' | 'fast'>('normal');
    const [savedMsg, setSavedMsg] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Load from profile first, then localStorage
        if (profile?.ad) {
            setNickname(profile.ad);
        } else if (typeof window !== 'undefined') {
            const storedName = localStorage.getItem('frog_player_name');
            if (storedName) setNickname(storedName);
        }

        if (profile?.avatar) {
            setAvatarSeed(profile.avatar);
        } else if (typeof window !== 'undefined') {
            const storedAvatar = localStorage.getItem('frog_player_avatar_seed');
            if (storedAvatar) setAvatarSeed(storedAvatar);
        }

        if (profile?.yas) {
            setAge(profile.yas);
        }
    }, [profile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSavedMsg(false);

        // Save to localStorage immediately
        if (typeof window !== 'undefined') {
            localStorage.setItem('frog_player_name', nickname);
            localStorage.setItem('frog_player_avatar_seed', avatarSeed);
        }

        // Save to Supabase if authenticated
        if (user) {
            try {
                await updateProfile({
                    ad: nickname,
                    avatar: avatarSeed, // Store DiceBear seed
                    yas: age,
                });
            } catch {
                // Ignore error, localStorage saved
            }
        }

        setSavedMsg(true);
        setSaving(false);
        setTimeout(() => setSavedMsg(false), 3000);
    };

    const handleLogout = async () => {
        await signOut();
        // Redirect to home page (before login)
        router.push('/');
    };

    const level = starsToLevel(totalStars);
    const progress = (totalStars % 10) * 10;
    const displayName = nickname || profile?.ad || user?.user_metadata?.ad || user?.email?.split('@')[0] || 'KAHRAMAN';

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="font-fun text-2xl md:text-3xl text-gray-800 flex items-center gap-2">
                        <User className="w-6 h-6 text-green-600" />
                        Profil
                    </h1>
                    <p className="text-gray-500 mt-1">Karakterini ve ayarlarını özelleştir</p>
                </div>
            </motion.div>

            {/* Profile Hero Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card card-elevated p-6 md:p-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-green-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl" />

                <div className="relative flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar with DiceBear */}
                    <div className="relative shrink-0">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border-4 border-green-200 shadow-xl p-3 flex items-center justify-center">
                            <Character mood="excited" size={100} showLilypad={true} avatar={avatarSeed} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 border-3 border-white text-white font-fun text-xs px-3 py-1 rounded-full shadow-lg">
                            LVL {level}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="relative flex-1 text-center sm:text-left space-y-3">
                        <h2 className="font-fun text-2xl md:text-3xl text-gray-800">{displayName.toUpperCase()}</h2>
                        <p className="text-gray-500">
                            {user?.email ? 'Kayıtlı Kullanıcı' : 'Yerel Profil'} • {age} Yaşında
                        </p>

                        {/* Level Progress */}
                        <div className="max-w-md mx-auto sm:mx-0">
                            <div className="flex justify-between font-rounded text-sm text-gray-500 mb-2">
                                <span>Seviye {level} İlerlemesi</span>
                                <span className="text-yellow-600 font-fun">{totalStars} / {level * 10} ★</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Settings Form */}
            <motion.form
                onSubmit={handleSave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card card-elevated p-6 space-y-6"
            >
                <h3 className="font-fun text-lg text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Settings className="w-5 h-5 text-green-600" />
                    Profil Bilgileri
                </h3>

                {/* Nickname & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="font-rounded text-sm text-gray-700 mb-2 block">Oyuncu Adı</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            className="input"
                            placeholder="Adını yaz..."
                            required
                        />
                    </div>

                    <div>
                        <label className="font-rounded text-sm text-gray-700 mb-2 block">Yaş</label>
                        <select
                            value={age}
                            onChange={e => setAge(Number(e.target.value))}
                            className="input cursor-pointer"
                        >
                            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(a => (
                                <option key={a} value={a}>{a} Yaşında</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* DiceBear Avatar Picker */}
                <div>
                    <label className="font-rounded text-sm text-gray-700 mb-3 block flex items-center gap-2">
                        <Image className="w-4 h-4 text-green-600" />
                        Profil Resmi (DiceBear)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">Bottts stilinde yeşil temalı karakter oluştur</p>
                    <AvatarPicker
                        onSelect={setAvatarSeed}
                        currentSeed={avatarSeed}
                        size={100}
                        style="bottts"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        Seçili: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{avatarSeed}</code>
                    </p>
                </div>

                {/* Speech Rate */}
                <div>
                    <label className="font-rounded text-sm text-gray-700 mb-3 block flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-blue-500" />
                        Rehber Ses Hızı
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'slow', label: '🐢 Yavaş', desc: 'Daha anlaşılır' },
                            { id: 'normal', label: '🚶 Normal', desc: 'Dengeli' },
                            { id: 'fast', label: '🐇 Hızlı', desc: 'Hızlı tempo' },
                        ].map(rate => (
                            <button
                                type="button"
                                key={rate.id}
                                onClick={() => setSpeechRate(rate.id as any)}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all text-center ${
                                    speechRate === rate.id
                                        ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-lg'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:shadow-md'
                                }`}
                            >
                                <span className="font-rounded text-sm">{rate.label}</span>
                                <span className="text-xs text-gray-500">{rate.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Account Actions */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-fun text-sm text-green-800">Profil Resmini Oluştur</p>
                                <p className="text-xs text-green-600">DiceBear API ile benzersiz avatar</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAvatarSeed(
                                ['happy', 'green', 'jumpy', 'smart', 'kind', 'brave', 'calm', 'bright'][
                                    Math.floor(Math.random() * 8)
                                ] + '-' + 
                                ['frog', 'toad', 'leaf', 'pond', 'reed', 'lily', 'moss', 'fern'][
                                    Math.floor(Math.random() * 8)
                                ] + '-' + Math.floor(Math.random() * 1000)
                            )}
                            className="btn btn-secondary text-sm"
                        >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Rastgele Oluştur
                        </button>
                    </div>

                    {user && (
                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full btn btn-ghost text-red-600 hover:bg-red-50 border-red-100"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Çıkış Yap
                            </button>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`font-rounded text-sm transition-opacity ${savedMsg ? 'text-green-600 opacity-100' : 'opacity-0'}`}>
                        <CheckCircle2 className="w-4 h-4 inline mr-1" /> Ayarlar kaydedildi!
                    </span>
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="btn btn-primary group"
                    >
                        <Save className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}