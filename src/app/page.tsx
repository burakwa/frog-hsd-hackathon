// app/page.tsx — Bright, Child-Friendly Landing Page
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Sparkles, Star, Mic, Bug, MessageCircle, BookOpen } from 'lucide-react';
import Character from '@/components/game/Character';

export default function LandingPage() {
    return (
        <main className="page-wrapper bg-pattern-dots relative overflow-x-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Floating decorative shapes */}
                <div className="absolute top-10 left-5 w-20 h-20 bg-green-100/50 rounded-full blur-3xl animate-float-gentle" />
                <div className="absolute top-20 right-10 w-24 h-24 bg-blue-100/50 rounded-full blur-3xl animate-float-gentle-reverse" />
                <div className="absolute bottom-20 left-10 w-16 h-16 bg-yellow-100/50 rounded-full blur-3xl animate-float-gentle" style={{animationDelay: '1s'}} />
                <div className="absolute bottom-30 right-20 w-20 h-20 bg-pink-100/50 rounded-full blur-3xl animate-float-gentle-reverse" style={{animationDelay: '1.5s'}} />
                <div className="absolute top-1/2 left-5 w-12 h-12 bg-purple-100/50 rounded-full blur-3xl animate-float-gentle" style={{animationDelay: '0.5s'}} />
                <div className="absolute top-1/3 right-5 w-16 h-16 bg-green-100/30 rounded-full blur-3xl animate-float-gentle-reverse" style={{animationDelay: '2s'}} />
            </div>

            {/* Top Navigation */}
            <header className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/assets/logo.png" alt="FrogFriends" className="w-10 h-10 object-contain" />
                    <span className="font-fun text-xl text-gray-800">FROG<span className="text-green-600">FRIENDS</span></span>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/giris" className="font-rounded text-gray-600 hover:text-green-600 transition-colors text-sm">Giriş</Link>
                    <Link href="/kayit" className="btn btn-primary btn-small">Kayıt Ol</Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 md:py-16">
                <div className="max-w-5xl w-full">
                    <div className="text-center mb-12">
                        {/* Floating fly decorations */}
                        <div className="absolute -top-8 -left-8 w-16 h-16 animate-float-gentle pointer-events-none" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" className="w-full h-full opacity-60"><path d="M12 2v20M2 12h20"/></svg>
                        </div>
                        <div className="absolute -top-6 -right-6 w-16 h-16 animate-float-gentle-reverse pointer-events-none" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" className="w-full h-full opacity-60"><path d="M12 2v20M2 12h20"/></svg>
                        </div>

                        {/* Main Logo */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
                            className="inline-flex flex-col items-center gap-3 mb-6"
                        >
                            <div className="relative">
                                <Character mood="happy" size={100} showLilypad={true} />
                                {/* Sparkle decorations */}
                                <div className="absolute -top-2 -right-2 w-8 h-8 animate-bounce-subtle" aria-hidden="true">
                                    <Star className="w-full h-full text-yellow-400" />
                                </div>
                                <div className="absolute -top-4 left-1/2 w-6 h-6 animate-bounce-subtle" style={{animationDelay: '0.3s'}} aria-hidden="true">
                                    <Star className="w-full h-full text-pink-400" />
                                </div>
                            </div>
                            <h1 className="font-fun text-4xl md:text-6xl lg:text-7xl text-gray-800 leading-tight">
                                FROG<span className="text-gradient">FRIENDS</span>
                            </h1>
                        </motion.div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="font-rounded text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                        >
                            Konuşmayı öğrenmek artık bir oyun! 🎮 Kurbağamızla birlikte eğlenerek doğru telaffuz edin, yıldız kazanın ve maceralara atılın.
                        </motion.p>
                    </div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
                    >
                        <FeatureCard
                            icon={<Mic className="w-6 h-6" />}
                            title="Ses Tekrarı"
                            desc="Kelimeleri dinle, söyle ve puan kazan"
                            color="green"
                            delay={0}
                        />
                        <FeatureCard
                            icon={<Bug className="w-6 h-6" />}
                            title="Hece Avı"
                            desc="Sinekleri yakala, heceleri öğren"
                            color="blue"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<MessageCircle className="w-6 h-6" />}
                            title="Cümle Söyle"
                            desc="Eksik kelimeleri bul, cümleleri tamamla"
                            color="yellow"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<BookOpen className="w-6 h-6" />}
                            title="Sesli Masal"
                            desc="Masalları oku, dinle ve keyifle öğren"
                            color="purple"
                            delay={0.3}
                        />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <Link href="/giris">
                            <button className="btn btn-primary btn-large w-full sm:w-auto group">
                                <Play className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                <span>Oyuna Başla</span>
                            </button>
                        </Link>
                        <Link href="/kayit">
                            <button className="btn btn-primary btn-large w-full sm:w-auto group">
                                <Sparkles className="w-5 h-5" />
                                <span>Ücretsiz Kayıt Ol</span>
                            </button>
                        </Link>
                    </motion.div>

                    {/* Guest Play Link */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        className="text-center text-gray-500 font-rounded"
                    >
                        <Link href="/panel" className="text-green-600 hover:text-green-700 underline underline-offset-2 font-semibold">
                            → Misafir Olarak Oyna
                        </Link>
                    </motion.p>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                        className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mt-12 pt-8 border-t border-gray-100"
                    >
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>Ücretsiz</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500" />
                            <span>Güvenli</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <span>Çocuk Dostu</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-purple-500" />
                            <span>Reklamsız</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
                <p>© 2026 FrogFriends - Çocuklar için Konuşma Öğrenme Platformu</p>
                <p className="mt-1">Tasarım: Sevgi ve Dikkatle Yapıldı 💚</p>
            </footer>
        </main>
    );
}

function FeatureCard({ icon, title, desc, color, delay }: { 
    icon: React.ReactNode; 
    title: string; 
    desc: string; 
    color: 'green' | 'blue' | 'yellow' | 'purple';
    delay: number;
}) {
    const colorClasses = {
        green: 'card-colored-green',
        blue: 'card-colored-blue',
        yellow: 'card-colored-yellow',
        purple: 'card-colored-purple',
    };
    
    const iconBg = {
        green: 'bg-green-200',
        blue: 'bg-blue-200',
        yellow: 'bg-yellow-200',
        purple: 'bg-purple-200',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + delay, duration: 0.5 }}
            className={`card ${colorClasses[color]} p-5 text-center group hover:scale-[1.02] transition-transform`}
        >
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${iconBg[color]} mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="font-fun text-lg text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}