// app/kayit/page.tsx — Register Page with DiceBear Avatar
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Character, { AvatarPicker } from '@/components/game/Character';

export default function KayitPage() {
    const router = useRouter();
    const { signUpWithEmail } = useAuth();
    
    const [step, setStep] = useState<1 | 2>(1);
    const [form, setForm] = useState({ 
        ad: '', 
        email: '', 
        password: '', 
        confirm: '' 
    });
    const [avatarSeed, setAvatarSeed] = useState<string>('happy-frog-123');
    const [avatarStyle, setAvatarStyle] = useState<'bottts' | 'shapes' | 'avataaars' | 'personas'>('bottts');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (field: string, value: string) => {
        setForm(f => ({ ...f, [field]: value }));
        if (field === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 6) strength += 25;
        if (pwd.length >= 10) strength += 25;
        if (/[A-Z]/.test(pwd)) strength += 25;
        if (/[0-9]/.test(pwd)) strength += 25;
        setPasswordStrength(Math.min(strength, 100));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.ad.trim()) {
            setError('Lütfen adınızı girin!');
            return;
        }
        if (!form.email.includes('@')) {
            setError('Geçerli bir e-posta adresi girin!');
            return;
        }
        if (form.password.length < 6) {
            setError('Şifre en az 6 karakter olmalı!');
            return;
        }
        if (form.password !== form.confirm) {
            setError('Şifreler eşleşmiyor!');
            return;
        }

        setLoading(true);
        const { error: authErr } = await signUpWithEmail(form.email, form.password, { 
            ad: form.ad,
            avatar: avatarSeed 
        });
        setLoading(false);

        if (authErr) {
            setError('Kayıt olunamadı: ' + authErr.message);
        } else {
            setSuccess('Hesabın oluşturuldu! E-postanı kontrol et ve doğrula. Sonra panele yönlendirileceksin...');
            setTimeout(() => router.push('/panel'), 2000);
        }
    };

    const handleRandomAvatar = () => {
        const adjectives = ['happy', 'green', 'jumpy', 'smart', 'kind', 'brave', 'calm', 'bright'];
        const nouns = ['frog', 'toad', 'leaf', 'pond', 'reed', 'lily', 'moss', 'fern'];
        const newSeed = 
            adjectives[Math.floor(Math.random() * adjectives.length)] + '-' + 
            nouns[Math.floor(Math.random() * nouns.length)] + '-' + 
            Math.floor(Math.random() * 1000);
        setAvatarSeed(newSeed);
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
                <div className="card card-elevated p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                {/* Step Indicator */}
                                <div className="flex gap-2 mb-6">
                                    <div className="flex-1 h-2 bg-green-500 rounded-full" />
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full" />
                                </div>

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
                                            <input
                                                className="input pl-10"
                                                type="text"
                                                placeholder="Adınızı yazın"
                                                value={form.ad}
                                                onChange={e => handleChange('ad', e.target.value)}
                                                required
                                                autoComplete="name"
                                                autoFocus
                                            />
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="font-rounded text-sm text-gray-700 mb-2 block">E-Posta</label>
                                        <div className="relative">
                                            <input
                                                className="input pl-10"
                                                type="email"
                                                placeholder="ornek@mail.com"
                                                value={form.email}
                                                onChange={e => handleChange('email', e.target.value)}
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
                                                placeholder="En az 6 karakter"
                                                value={form.password}
                                                onChange={e => handleChange('password', e.target.value)}
                                                required
                                                autoComplete="new-password"
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
                                        {form.password && (
                                            <div className="mt-2">
                                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full transition-all duration-300"
                                                        style={{ width: `${passwordStrength}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 text-right">
                                                    {passwordStrength < 25 ? 'Zayıf' : passwordStrength < 50 ? 'Orta' : passwordStrength < 75 ? 'Güçlü' : 'Çok Güçlü'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="font-rounded text-sm text-gray-700 mb-2 block">Şifre Tekrar</label>
                                        <div className="relative">
                                            <input
                                                className="input pl-10 pr-12"
                                                type={showPass ? 'text' : 'password'}
                                                placeholder="Şifrenizi tekrar yazın"
                                                value={form.confirm}
                                                onChange={e => handleChange('confirm', e.target.value)}
                                                required
                                                autoComplete="new-password"
                                            />
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="btn btn-primary w-full py-4 group"
                                    >
                                        <Sparkles className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        <span>Devam Et →</span>
                                    </button>
                                </form>
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {/* Step Indicator */}
                                <div className="flex gap-2 mb-6">
                                    <div className="flex-1 h-2 bg-green-500 rounded-full" />
                                    <div className="flex-1 h-2 bg-green-500 rounded-full" />
                                </div>

                                <div className="text-center mb-8">
                                    <h1 className="font-fun text-2xl md:text-3xl text-gray-800 mb-2">Maskotun Seç 🐸</h1>
                                    <p className="text-gray-600">Seninle maceralara atılacak karakterini belirle</p>
                                </div>

                                {/* Current Preview */}
                                <div className="text-center mb-6">
                                    <Character 
                                        mood="excited" 
                                        size={100} 
                                        showLilypad={true} 
                                        avatar={avatarSeed}
                                        style={avatarStyle}
                                    />
                                    <p className="text-xs text-gray-400 mt-2 font-mono">{avatarSeed}</p>
                                </div>

                                {/* Style Selector */}
                                <div className="mb-4">
                                    <label className="font-rounded text-sm text-gray-700 mb-2 block">Karakter Stili</label>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {[
                                            { id: 'bottts', label: '🤖 Bottts' },
                                            { id: 'shapes', label: '🔷 Şekiller' },
                                            { id: 'avataaars', label: '👤 Avataaars' },
                                            { id: 'personas', label: '👤 Personas' },
                                        ].map(style => (
                                            <button
                                                key={style.id}
                                                type="button"
                                                onClick={() => setAvatarStyle(style.id as any)}
                                                className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-sm transition-all whitespace-nowrap ${
                                                    avatarStyle === style.id
                                                        ? 'border-green-500 bg-green-50 text-green-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-green-300'
                                                }`}
                                            >
                                                {style.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Avatar Grid */}
                                <div className="mb-4">
                                    <AvatarPicker
                                        onSelect={setAvatarSeed}
                                        currentSeed={avatarSeed}
                                        size={100}
                                        style={avatarStyle}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRandomAvatar}
                                    className="btn btn-secondary w-full mb-4"
                                >
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    Rastgele Yeni Avatar Oluştur
                                </button>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-rounded mb-4"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-rounded mb-4"
                                    >
                                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{success}</span>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="btn btn-primary w-full py-4 group"
                                >
                                    {loading ? 'Hesap Oluşturuluyor...' : 'Hesabı Oluştur ve Başla'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="btn btn-ghost w-full py-3 mt-3 text-sm"
                                >
                                    ← Geri Dön
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                        <Shield className="w-3 h-3 text-green-500" />
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