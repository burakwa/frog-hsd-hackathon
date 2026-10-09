// app/(auth)/giris/page.tsx — Retro Giriş Ekranı
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, User, ArrowRight, Play } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Character from '@/components/game/Character';

export default function GirisPage() {
    const router = useRouter();
    const { signInWithEmail } = useAuth();
    const [tab, setTab] = useState<'child' | 'parent'>('child');
    const [childName, setChildName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<'kurbaga' | 'panda' | 'tavsan'>('kurbaga');

    // Parent credentials
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChildSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = childName.trim() || 'KAHRAMAN KURBAĞA';
        if (typeof window !== 'undefined') {
            localStorage.setItem('frog_player_name', name);
            localStorage.setItem('frog_player_avatar', selectedAvatar);
        }
        router.push('/panel');
    };

    const handleParentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error: authErr } = await signInWithEmail(email, password);
        setLoading(false);
        if (authErr) {
            setError('E-posta veya şifre hatalı. Lütfen tekrar dene!');
        } else {
            router.push('/panel');
        }
    };

    return (
        <main className="min-h-dvh bg-slate-950 flex items-center justify-center pt-2 md:pt-4 px-4 md:px-6 pb-4 scanlines select-none relative overflow-x-hidden">
            <div className="retro-scene absolute inset-0 pointer-events-none z-0 opacity-40" aria-hidden="true" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pixel-box max-w-md w-full my-3 shrink-0 sm:my-0 relative z-10 p-6 md:p-8 rounded-2xl bg-slate-900 border-yellow-400 shadow-2xl"
            >
                {/* Header with Mascot on Lilypad */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                        <Character mood={tab === 'child' ? 'excited' : 'happy'} size={72} showLilypad={true} />
                    </div>
                    <h1 className="font-pixel text-lg md:text-xl text-yellow-300 drop-shadow">
                        {tab === 'child' ? 'OYUNA GİRİŞ YAP 🎮' : 'VELİ / UZMAN GİRİŞİ 👨‍👩‍👧'}
                    </h1>
                    <p className="font-arcade text-xs text-slate-400 mt-1">
                        {tab === 'child' ? 'Karakterini seç ve maceraya katıl!' : 'Gelişim raporları ve detaylı analizler'}
                    </p>
                </div>

                {/* Retro Arcade Mode Tabs */}
                <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border-2 border-slate-700">
                    <button
                        type="button"
                        onClick={() => { setTab('child'); setError(''); }}
                        className={`flex-1 py-2 rounded-lg font-pixel text-[10px] transition-all flex items-center justify-center gap-1.5 ${
                            tab === 'child'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <span>🧒</span>
                        <span>ÇOCUK</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { setTab('parent'); setError(''); }}
                        className={`flex-1 py-2 rounded-lg font-pixel text-[10px] transition-all flex items-center justify-center gap-1.5 ${
                            tab === 'parent'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <span>👨‍👩‍👧</span>
                        <span>VELİ</span>
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {tab === 'child' ? (
                        <motion.form
                            key="child"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            onSubmit={handleChildSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="font-pixel text-[10px] text-cyan-300 mb-1.5 block">
                                    OYUNCU ADI (PLAYER NAME)
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        className="input-field pl-10 text-sm font-bold"
                                        type="text"
                                        placeholder="Örn: Ali veya Zeynep"
                                        value={childName}
                                        onChange={e => setChildName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-pixel text-[10px] text-cyan-300 mb-1.5 block">
                                    MASKOTUNU SEÇ
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'kurbaga', name: 'KURBAĞA', emoji: '🐸' },
                                        { id: 'panda', name: 'PANDA', emoji: '🐼' },
                                        { id: 'tavsan', name: 'TAVŞAN', emoji: '🐰' },
                                    ].map(mascot => (
                                        <button
                                            type="button"
                                            key={mascot.id}
                                            onClick={() => setSelectedAvatar(mascot.id as any)}
                                            className={`p-3 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${
                                                selectedAvatar === mascot.id
                                                    ? 'border-yellow-400 bg-slate-800 scale-102 shadow-md'
                                                    : 'border-slate-700 bg-slate-950/60 hover:border-slate-500'
                                            }`}
                                        >
                                            <span className="text-3xl" aria-hidden="true">{mascot.emoji}</span>
                                            <span className="font-pixel text-[9px] text-slate-200 mt-1">{mascot.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="pixel-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 w-full mt-2 py-3.5 text-xs flex items-center justify-center gap-2"
                            >
                                <Play size={14} className="fill-slate-950" />
                                <span>OYUNA BAŞLA (START)</span>
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="parent"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onSubmit={handleParentSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="font-pixel text-[10px] text-cyan-300 mb-1 block">E-POSTA</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        className="input-field pl-9 text-sm"
                                        type="email"
                                        placeholder="ornek@mail.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-pixel text-[10px] text-cyan-300 mb-1 block">ŞİFRE</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        className="input-field pl-9 pr-10 text-sm"
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 bg-red-950 border border-red-500 text-red-300 rounded-lg p-2.5 text-xs font-arcade">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="pixel-btn bg-indigo-600 hover:bg-indigo-500 text-white w-full mt-2 py-3.5 text-xs"
                            >
                                {loading ? 'GİRİŞ YAPILIYOR...' : 'VELİ PANELİNE GİRİŞ'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Footer links */}
                <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs font-arcade text-slate-400 flex flex-col gap-2">
                    <p>
                        Hesabın yok mu?{' '}
                        <Link href="/kayit" className="text-yellow-400 hover:text-yellow-300 font-pixel text-[10px] underline ml-1">
                            KAYIT OL
                        </Link>
                    </p>
                    <Link href="/" className="font-pixel text-[9px] text-slate-500 hover:text-slate-300 mt-1">
                        ← ANA SAYFAYA DÖN
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
