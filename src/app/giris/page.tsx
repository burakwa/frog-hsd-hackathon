'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, User, ArrowRight } from 'lucide-react';
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
        const name = childName.trim() || 'Minik Kurbağa';
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
        <main className="bg-app min-h-screen flex items-center justify-center p-6">
            {/* Background glowing orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-200 rounded-full opacity-30 blur-3xl" />
            </div>

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="card max-w-md w-full relative z-10 shadow-2xl border border-purple-100"
            >
                {/* Header with Mascot */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-2">
                        <Character mood={tab === 'child' ? 'excited' : 'happy'} size={76} />
                    </div>
                    <h1 className="text-2xl font-black text-purple-900 tracking-tight">
                        {tab === 'child' ? 'Oyuna Başla! 🎮' : 'Veli & Uzman Girişi 👨‍👩‍👧'}
                    </h1>
                    <p className="text-gray-500 text-sm font-semibold">
                        {tab === 'child' ? 'Karakterini seç ve eğlenceye katıl' : 'Gelişim raporları ve ayarları yönet'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-purple-100 p-1.5 rounded-2xl mb-6">
                    <button
                        type="button"
                        onClick={() => { setTab('child'); setError(''); }}
                        className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                            tab === 'child'
                                ? 'bg-white text-purple-700 shadow-md shadow-purple-200/50'
                                : 'text-purple-600/70 hover:text-purple-900'
                        }`}
                    >
                        <span>🧒</span>
                        <span>Çocuk Girişi</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { setTab('parent'); setError(''); }}
                        className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                            tab === 'parent'
                                ? 'bg-white text-purple-700 shadow-md shadow-purple-200/50'
                                : 'text-purple-600/70 hover:text-purple-900'
                        }`}
                    >
                        <span>👨‍👩‍👧</span>
                        <span>Veli / Uzman</span>
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {tab === 'child' ? (
                        <motion.form
                            key="child"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            onSubmit={handleChildSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1.5 block">
                                    Adın veya Takma Adın
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                                    <input
                                        className="input-field pl-10"
                                        type="text"
                                        placeholder="Örn: Ali veya Zeynep"
                                        value={childName}
                                        onChange={e => setChildName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1.5 block">
                                    Oyun Maskotunu Seç
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'kurbaga', name: 'Kurbağa', emoji: '🐸' },
                                        { id: 'panda', name: 'Panda', emoji: '🐼' },
                                        { id: 'tavsan', name: 'Tavşan', emoji: '🐰' },
                                    ].map(mascot => (
                                        <button
                                            type="button"
                                            key={mascot.id}
                                            onClick={() => setSelectedAvatar(mascot.id as any)}
                                            className={`p-3 rounded-2xl flex flex-col items-center gap-1 border-2 transition-all ${
                                                selectedAvatar === mascot.id
                                                    ? 'border-purple-600 bg-purple-50 scale-105 shadow-sm'
                                                    : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                        >
                                            <span className="text-3xl">{mascot.emoji}</span>
                                            <span className="text-xs font-black text-gray-700">{mascot.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn-primary w-full mt-2 py-3.5 text-base flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} />
                                <span>Maceraya Başla!</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="parent"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            onSubmit={handleParentSubmit}
                            className="flex flex-col gap-4"
                        >
                            {/* Email */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1 block">E-posta</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="input-field pl-9"
                                        type="email"
                                        placeholder="ornek@mail.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1 block">Şifre</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="input-field pl-9 pr-10"
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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl p-3 text-sm font-semibold">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-2 py-3.5 text-base"
                            >
                                {loading ? 'Giriş yapılıyor...' : 'Veli Paneline Giriş Yap'}
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Footer links */}
                <div className="mt-6 pt-4 border-t border-purple-50 text-center text-sm font-semibold text-gray-500 flex flex-col gap-2">
                    <p>
                        Hesabın yok mu?{' '}
                        <Link href="/kayit" className="text-purple-600 hover:text-purple-800 font-bold underline">
                            Ücretsiz Kayıt Ol
                        </Link>
                    </p>
                    <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
