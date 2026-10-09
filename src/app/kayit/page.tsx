// app/(auth)/kayit/page.tsx — Retro Kayıt Ekranı
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
        <main className="min-h-dvh bg-slate-950 flex items-center justify-center pt-2 md:pt-4 px-4 md:px-6 pb-4 scanlines select-none relative overflow-x-hidden">
            <div className="retro-scene absolute inset-0 pointer-events-none z-0 opacity-40" aria-hidden="true" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pixel-box max-w-sm w-full my-3 shrink-0 sm:my-0 relative z-10 p-6 md:p-8 rounded-2xl bg-slate-900 border-yellow-400 shadow-2xl"
            >
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                        <Character mood="excited" size={68} showLilypad={true} />
                    </div>
                    <h1 className="font-pixel text-lg md:text-xl text-yellow-300 drop-shadow">
                        YENİ OYUNCU KAYDI 🎮
                    </h1>
                    <p className="font-arcade text-xs text-slate-400 mt-1">
                        Ücretsiz hesabını aç ve maceraya başla!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <div>
                        <label className="font-pixel text-[10px] text-cyan-300 mb-1 block">ÇOCUĞUN ADI</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                className="input-field pl-9 text-sm"
                                type="text"
                                placeholder="Örn: Ali"
                                value={form.ad}
                                onChange={e => handleChange('ad', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-pixel text-[10px] text-cyan-300 mb-1 block">E-POSTA</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                className="input-field pl-9 text-sm"
                                type="email"
                                placeholder="veli@mail.com"
                                value={form.email}
                                onChange={e => handleChange('email', e.target.value)}
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
                                placeholder="En az 6 karakter"
                                value={form.password}
                                onChange={e => handleChange('password', e.target.value)}
                                required
                                autoComplete="new-password"
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

                    <div>
                        <label className="font-pixel text-[10px] text-cyan-300 mb-1 block">ŞİFRE TEKRARI</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                className="input-field pl-9 text-sm"
                                type={showPass ? 'text' : 'password'}
                                placeholder="Şifreni tekrar yaz"
                                value={form.confirm}
                                onChange={e => handleChange('confirm', e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-950 border border-red-500 text-red-300 rounded-lg p-2.5 text-xs font-arcade">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-lg p-2.5 text-xs font-arcade">
                            <CheckCircle size={16} />
                            <span>{success}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="pixel-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 w-full mt-2 py-3.5 text-xs"
                    >
                        {loading ? 'KAYDEDİLİYOR...' : 'KAYIT OL VE BAŞLA'}
                    </button>
                </form>

                <div className="mt-5 pt-3 border-t border-slate-800 text-center text-xs font-arcade text-slate-400">
                    Zaten hesabın var mı?{' '}
                    <Link href="/giris" className="text-yellow-400 hover:text-yellow-300 font-pixel text-[10px] underline ml-1">
                        GİRİŞ YAP
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
