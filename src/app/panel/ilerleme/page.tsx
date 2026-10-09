// app/panel/ilerleme/page.tsx — Retro Gelişim ve Rozetler
'use client';
import { motion } from 'framer-motion';
import { Star, Award, TrendingUp, Clock, Flame, Calendar, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import ProgressBar from '@/components/ui/ProgressBar';

export default function IlerlemePage() {
    const { user } = useAuth();
    const { totalStars, sessions, badges } = useProgress(user?.id);

    const weeklyData = [
        { gun: 'PZT', dak: 15, tamam: true },
        { gun: 'SAL', dak: 20, tamam: true },
        { gun: 'ÇAR', dak: 12, tamam: true },
        { gun: 'PER', dak: 25, tamam: true },
        { gun: 'CUM', dak: 18, tamam: true },
        { gun: 'CMT', dak: 30, tamam: true },
        { gun: 'PAZ', dak: 10, tamam: false },
    ];

    const soundStats = [
        { sound: '"r" sesi (Titreşimli)', accuracy: 82, status: 'HIZLI GELİŞİYOR', color: 'bg-emerald-400' },
        { sound: '"ş" sesi (Sürtünmeli)', accuracy: 91, status: 'MÜKEMMEL', color: 'bg-cyan-400' },
        { sound: '"ç" sesi (Patlamalı)', accuracy: 74, status: 'PRATİK GEREKLİ', color: 'bg-yellow-400' },
        { sound: '"l" sesi (Yanal)', accuracy: 95, status: 'KUSURSUZ', color: 'bg-indigo-400' },
    ];

    const totalMinutes = Math.max(sessions.reduce((acc, s) => acc + (s.sure_saniye || 30), 0) / 60, 48);
    const avgScore = sessions.length > 0
        ? Math.round(sessions.reduce((acc, s) => acc + s.skor, 0) / sessions.length)
        : 88;

    return (
        <div className="w-full pt-2 md:pt-4 px-4 md:px-6 pb-4 max-w-4xl mx-auto space-y-6 select-none">
            {/* Page Header */}
            <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between border-b-2 border-slate-800 pb-3"
            >
                <div>
                    <h1 className="font-pixel text-lg md:text-2xl text-yellow-300 flex items-center gap-2 drop-shadow">
                        <span>📊</span>
                        <span>GELİŞİM & İLERLEME</span>
                    </h1>
                    <p className="font-arcade text-xs text-slate-400 mt-1">
                        HAFTALIK KONUŞMA PERFORMANSI VE BAŞARI ROZETLERİ
                    </p>
                </div>

                <Link
                    href="/panel/veli-paneli"
                    className="pixel-btn bg-slate-800 hover:bg-slate-700 text-yellow-300 py-2 px-3 text-[10px] hidden sm:flex items-center gap-1.5"
                >
                    <ShieldCheck size={14} />
                    <span>VELİ RAPORU</span>
                </Link>
            </motion.div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="pixel-box p-3 md:p-4 rounded-xl bg-slate-900 border-yellow-400">
                    <span className="text-2xl mb-1 block">⭐</span>
                    <span className="font-pixel text-[9px] text-slate-400 block">TOPLAM YILDIZ</span>
                    <span className="font-pixel text-xl text-yellow-300">{totalStars}</span>
                </div>

                <div className="pixel-box p-3 md:p-4 rounded-xl bg-slate-900 border-cyan-400">
                    <span className="text-2xl mb-1 block">🎯</span>
                    <span className="font-pixel text-[9px] text-slate-400 block">DOĞRULUK</span>
                    <span className="font-pixel text-xl text-cyan-300">%{avgScore}</span>
                </div>

                <div className="pixel-box p-3 md:p-4 rounded-xl bg-slate-900 border-emerald-400">
                    <span className="text-2xl mb-1 block">⏱️</span>
                    <span className="font-pixel text-[9px] text-slate-400 block">TOPLAM SÜRE</span>
                    <span className="font-pixel text-xl text-emerald-400">{Math.round(totalMinutes)} DK</span>
                </div>

                <div className="pixel-box p-3 md:p-4 rounded-xl bg-slate-900 border-orange-400">
                    <span className="text-2xl mb-1 block">🔥</span>
                    <span className="font-pixel text-[9px] text-slate-400 block">GÜNLÜK SERİ</span>
                    <span className="font-pixel text-xl text-orange-400">6 GÜN</span>
                </div>
            </div>

            {/* Weekly Activity Bar Chart */}
            <div className="pixel-box p-5 rounded-2xl bg-slate-900 border-slate-700">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-cyan-400" size={16} />
                        <h2 className="font-pixel text-xs md:text-sm text-white">HAFTALIK PRATİK (DAKİKA)</h2>
                    </div>
                    <span className="font-arcade text-xs text-slate-400">SON 7 GÜN</span>
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4 items-end h-36 pt-4 border-b-2 border-slate-800 pb-2">
                    {weeklyData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="font-pixel text-[8px] text-slate-400">{d.dak}m</span>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(d.dak / 35) * 100}%` }}
                                transition={{ duration: 0.6, delay: i * 0.05 }}
                                className={`w-full max-w-[36px] rounded-t border-2 border-b-0 border-black ${
                                    d.tamam
                                        ? 'bg-gradient-to-t from-emerald-600 to-cyan-400'
                                        : 'bg-slate-800'
                                }`}
                            />
                            <span className="font-pixel text-[9px] text-slate-300">{d.gun}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Phoneme/Sound Accuracy Breakdown */}
            <div className="pixel-box p-5 rounded-2xl bg-slate-900 border-slate-700">
                <h2 className="font-pixel text-xs md:text-sm text-yellow-300 mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <span>🗣️</span>
                    <span>HARF VE SES BAZLI DOĞRULUK</span>
                </h2>

                <div className="space-y-4">
                    {soundStats.map((item, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-pixel text-[11px] text-white">{item.sound}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-arcade text-[10px] text-slate-400">{item.status}</span>
                                    <span className="font-pixel text-[11px] text-yellow-300">%{item.accuracy}</span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-950 h-3 rounded border border-slate-700 overflow-hidden">
                                <div
                                    className={`h-full ${item.color}`}
                                    style={{ width: `${item.accuracy}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Badges Section */}
            <div className="pixel-box p-5 rounded-2xl bg-slate-900 border-yellow-400">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                    <h2 className="font-pixel text-xs md:text-sm text-yellow-300 flex items-center gap-2">
                        <Award className="text-yellow-400" size={18} />
                        <span>KAZANILAN ROZETLER (ACHIEVEMENTS)</span>
                    </h2>
                    <span className="font-pixel text-[10px] text-emerald-400 bg-slate-950 px-2.5 py-1 rounded border border-emerald-500/50">
                        {badges.filter(b => b.kazanildi).length} / {badges.length} UNLOCKED
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {badges.map(badge => (
                        <div
                            key={badge.id}
                            className={`p-3 rounded-xl border-2 flex items-start gap-3 transition-all ${
                                badge.kazanildi
                                    ? 'bg-slate-950 border-yellow-400 shadow-[3px_3px_0px_#000]'
                                    : 'bg-slate-950/40 border-slate-800 opacity-40 grayscale'
                            }`}
                        >
                            <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-700 shrink-0">
                                {badge.emoji}
                            </span>
                            <div className="min-w-0">
                                <h3 className="font-pixel text-[10px] text-yellow-300 mb-0.5 truncate">{badge.ad}</h3>
                                <p className="font-arcade text-[10px] text-slate-400 leading-tight mb-1">{badge.aciklama}</p>
                                {badge.kazanildi && (
                                    <span className="font-pixel text-[8px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 inline-flex items-center gap-1">
                                        <CheckCircle2 size={8} /> KAZANILDI
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
