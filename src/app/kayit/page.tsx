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
            setSuccess('Hesabın oluşturuldu! E-postanı kontrol et veya hemen oyna.');
            setTimeout(() => router.push('/panel'), 2000);
        }
    };

    return (
        <main className="bg-app min-h-screen flex items-center justify-center p-6">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-green-100 rounded-full opacity-40 blur-3xl" />
            </div>

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="card max-w-sm w-full relative z-10"
            >
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-2">
                        <Character mood="excited" size={70} />
                    </div>
                    <h1 className="text-2xl font-black text-purple-800">Maceraya Katıl!</h1>
                    <p className="text-gray-500 text-sm font-semibold">Ücretsiz hesap oluştur</p>
                </div>

                {success ? (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl p-4 font-bold text-sm">
                        <CheckCircle size={20} />
                        {success}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Name */}
                        <div>
                            <label className="text-sm font-bold text-gray-600 mb-1 block">Adın</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input className="input-field pl-9" placeholder="Minik Kahraman" value={form.ad}
                                    onChange={e => handleChange('ad', e.target.value)} required />
                            </div>
                        </div>
                        {/* Email */}
                        <div>
                            <label className="text-sm font-bold text-gray-600 mb-1 block">E-posta</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input className="input-field pl-9" type="email" placeholder="ornek@mail.com"
                                    value={form.email} onChange={e => handleChange('email', e.target.value)} required autoComplete="email" />
                            </div>
                        </div>
                        {/* Password */}
                        <div>
                            <label className="text-sm font-bold text-gray-600 mb-1 block">Şifre</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input className="input-field pl-9 pr-10" type={showPass ? 'text' : 'password'}
                                    placeholder="En az 6 karakter" value={form.password}
                                    onChange={e => handleChange('password', e.target.value)} required autoComplete="new-password" />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        {/* Confirm */}
                        <div>
                            <label className="text-sm font-bold text-gray-600 mb-1 block">Şifre Tekrar</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input className="input-field pl-9" type="password" placeholder="••••••••"
                                    value={form.confirm} onChange={e => handleChange('confirm', e.target.value)}
                                    required autoComplete="new-password" />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl p-3 text-sm font-semibold">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.96 }}
                            className="btn-primary w-full py-3 text-base justify-center mt-1">
                            {loading ? '⏳ Kaydediliyor…' : '✨ Hesap Oluştur'}
                        </motion.button>
                    </form>
                )}

                <div className="text-center mt-5">
                    <p className="text-sm text-gray-500 font-semibold">
                        Zaten hesabın var mı?{' '}
                        <Link href="/giris" className="text-purple-600 font-bold hover:underline">Giriş Yap</Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
