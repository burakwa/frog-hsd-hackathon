// app/kayit/page.tsx — Bright Register Page
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Character from '@/components/game/Character';

export default function KayitPage() {
    const router = useRouter();
    const { signUpWithEmail } = useAuth();
    const [form, setForm] = useState({ ad: '', email: '', password: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string) =>
        setForm(f => ({ ...f, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
            setError('Şifreler eşleşmiyor!');
            return;
        }
        if (form.password.length < 6) {
            setError('Şifre en az 6 karakter olmalı!');
            return;
        }
        setLoading(true);
        const { error: authErr } = await signUpWithEmail(form.email, form.password, { ad: form.ad });
        setLoading(false);
        if (authErr) {
            setError('Kayıt olunamadı: ' + authErr.message);
        } else {
            setSuccess('Hesabın oluşturuldu! Panele yönlendiriliyorsun...');
            setTimeout(() => router.push('/panel'), 1500);
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
                className="relative z-10 w-full max-w-sm"
            >
                <div className="card card-elevated p-6 md:p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Character mood="excited" size={80} showLilypad={true} />
                        </div>
                        <h1 className="font-fun text-2xl md:text-3xl text-gray-800 mb-2">Yeni Oyuncu Kaydı 🎮</h1>
                        <p className="text-gray-600">FrogFriends ailesine katıl ve maceraya başla!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="font-rounded text-sm text-gray-700 mb-2 block">Ad Soyad</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    className="input pl-12"
                                    type="text"
                                    placeholder="Adınızı yazın"
                                    value={form.ad}
                                    onChange={e => handleChange('ad', e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-rounded text-sm text-gray-700 mb-2 block">E-Posta</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    className="input pl-12"
                                    type="email"
                                    placeholder="ornek@mail.com"
                                    value={form.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-rounded text-sm text-gray-700 mb-2 block">Şifre</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    className="input pl-12 pr-12"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="En az 6 karakter"
                                    value={form.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="font-rounded text-sm text-gray-700 mb-2 block">Şifre Tekrar</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    className="input pl-12 pr-12"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Şifrenizi tekrar yazın"
                                    value={form.confirm}
                                    onChange={e => handleChange('confirm', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
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

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-rounded"
                            >
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{success}</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-4"
                        >
                            {loading ? 'Kayıt Olunuyor...' : 'Hesap Oluştur'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                        <p>
                            Zaten hesabın var mı?{' '}
                            <Link href="/giris" className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-2">
                                Giriş Yap
                            </Link>
                        </p>
                        <Link href="/" className="block mt-2 text-gray-400 hover:text-gray-600 font-rounded">
                            ← Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
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