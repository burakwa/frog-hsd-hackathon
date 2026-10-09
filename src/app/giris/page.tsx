// app/giris/page.tsx — Bright Login Page
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, User, Play } from 'lucide-react';
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
        <main className="page-wrapper min-h-screen flex items-center justify-center px-4 py-12 relative overflow-x-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 bg-green-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-100/30 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Card */}
                <div className="card card-elevated p-6 md:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Character mood={tab === 'child' ? 'excited' : 'happy'} size={80} showLilypad={true} />
                        </div>
                        <h1 className="font-fun text-2xl md:text-3xl text-gray-800 mb-2">
                            {tab === 'child' ? 'Oyuna Giriş 🎮' : 'Veli / Uzman Girişi 👨‍👩‍👧'}
                        </h1>
                        <p className="text-gray-600">
                            {tab === 'child' ? 'Karakterini seç ve maceraya katıl!' : 'Gelişim raporları ve detaylı analizler'}
                        </p>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => { setTab('child'); setError(''); }}
                            className={`flex-1 py-3 rounded-lg font-rounded text-sm transition-all ${
                                tab === 'child'
                                    ? 'bg-white text-green-700 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span>🧒</span>
                                <span>Çocuk</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setTab('parent'); setError(''); }}
                            className={`flex-1 py-3 rounded-lg font-rounded text-sm transition-all ${
                                tab === 'parent'
                                    ? 'bg-white text-purple-700 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span>👨‍👩‍👧</span>
                                <span>Veli</span>
                            </span>
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {tab === 'child' ? (
                            <motion.form
                                key="child"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleChildSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="font-rounded text-sm text-gray-700 mb-2 block">Oyuncu Adı</label>
                                    <div className="relative">
                                        <input
                                            className="input pl-10"
                                            type="text"
                                            placeholder="Örn: Ali veya Zeynep"
                                            value={childName}
                                            onChange={e => setChildName(e.target.value)}
                                            autoComplete="name"
                                        />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-rounded text-sm text-gray-700 mb-2 block">Maskotun Seç</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'kurbaga', name: 'KURBAĞA', emoji: '🐸' },
                                            { id: 'panda', name: 'PANDA', emoji: '🐼' },
                                            { id: 'tavsan', name: 'TAVŞAN', emoji: '🐰' },
                                        ].map(mascot => (
                                            <button
                                                type="button"
                                                key={mascot.id}
                                                onClick={() => setSelectedAvatar(mascot.id as any)}
                                                className={`p-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${
                                                    selectedAvatar === mascot.id
                                                        ? 'border-green-400 bg-green-50 scale-102 shadow-lg'
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                            >
                                                <span className="text-4xl" aria-hidden="true">{mascot.emoji}</span>
                                                <span className="font-rounded text-xs text-gray-600">{mascot.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full py-4 group"
                                >
                                    <Play className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    <span>Oyuna Başla</span>
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="parent"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleParentSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="font-rounded text-sm text-gray-700 mb-2 block">E-Posta</label>
                                    <div className="relative">
                                        <input
                                            className="input pl-10"
                                            type="email"
                                            placeholder="ornek@mail.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                        />
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-rounded text-sm text-gray-700 mb-2 block">Şifre</label>
                                    <div className="relative">
                                        <input
                                            className="input pl-10 pr-12"
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            autoComplete="current-password"
                                        />
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(p => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-rounded"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full py-4"
                                >
                                    {loading ? 'Giriş Yapılıyor...' : 'Veli Paneline Giriş'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Footer links */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500 space-y-2">
                        <p>
                            Hesabın yok mu?{' '}
                            <Link href="/kayit" className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-2">
                                Kayıt Ol
                            </Link>
                        </p>
                        <Link href="/" className="text-gray-400 hover:text-gray-600 font-rounded">
                            ← Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-green-500" />
                        Güvenli
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Çocuk Dostu
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Reklamsız
                    </span>
                </div>
            </motion.div>
        </main>
    );
}