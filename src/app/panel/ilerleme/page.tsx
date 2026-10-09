// app/panel/ilerleme/page.tsx — İlerleme Grafikleri ve Rozetler
'use client';
import { motion } from 'framer-motion';
import { Star, Award, TrendingUp, Clock, Flame, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import ProgressBar from '@/components/ui/ProgressBar';
import Character from '@/components/game/Character';

export default function IlerlemePage() {
    const { user } = useAuth();
    const { totalStars, sessions, badges } = useProgress(user?.id);

    // Mock weekly activity if sessions are sparse
    const weeklyData = [
        { gun: 'Pzt', dak: 15, tamam: true },
        { gun: 'Sal', dak: 20, tamam: true },
        { gun: 'Çar', dak: 12, tamam: true },
        { gun: 'Per', dak: 25, tamam: true },
        { gun: 'Cum', dak: 18, tamam: true },
        { gun: 'Cmt', dak: 30, tamam: true },
        { gun: 'Paz', dak: 10, tamam: false },
    ];

    const soundStats = [
        { sound: '"r" sesi (Titreşimli)', accuracy: 82, status: 'Hızlı Gelişiyor', color: 'bg-emerald-500' },
        { sound: '"ş" sesi (Sürtünmeli)', accuracy: 91, status: 'Harika', color: 'bg-purple-500' },
        { sound: '"ç" sesi (Patlamalı)', accuracy: 74, status: 'Pratik Gerekli', color: 'bg-amber-500' },
        { sound: '"l" sesi (Yanal)', accuracy: 95, status: 'Kusursuz', color: 'bg-indigo-500' },
    ];

    const totalMinutes = Math.max(sessions.reduce((acc, s) => acc + (s.sure_saniye || 30), 0) / 60, 48);
    const avgScore = sessions.length > 0
        ? Math.round(sessions.reduce((acc, s) => acc + s.skor, 0) / sessions.length)
        : 88;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-black text-purple-900 flex items-center gap-2">
                        <TrendingUp className="text-purple-600" />
                        <span>Gelişim & İlerleme</span>
                    </h1>
                    <p className="text-gray-500 font-semibold text-sm">
                        Haftalık konuşma terapisi performansı ve kazanılan başarılar
                    </p>
                </div>

                <Link
                    href="/panel/veli-paneli"
                    className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2.5 rounded-2xl transition-all"
                >
                    <span>Detaylı Veli Raporu</span>
                    <ChevronRight size={16} />
                </Link>
            </motion.div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div whileHover={{ y: -2 }} className="card-glass flex flex-col p-4">
                    <span className="text-2xl mb-1">⭐</span>
                    <span className="text-xs font-bold text-gray-500">Toplam Yıldız</span>
                    <span className="text-2xl font-black text-amber-500">{totalStars}</span>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} className="card-glass flex flex-col p-4">
                    <span className="text-2xl mb-1">🎯</span>
                    <span className="text-xs font-bold text-gray-500">Ortalama Başarı</span>
                    <span className="text-2xl font-black text-purple-600">%{avgScore}</span>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} className="card-glass flex flex-col p-4">
                    <span className="text-2xl mb-1">⏱️</span>
                    <span className="text-xs font-bold text-gray-500">Toplam Pratik</span>
                    <span className="text-2xl font-black text-emerald-600">{Math.round(totalMinutes)} dk</span>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} className="card-glass flex flex-col p-4">
                    <span className="text-2xl mb-1">🔥</span>
                    <span className="text-xs font-bold text-gray-500">Günlük Seri</span>
                    <span className="text-2xl font-black text-orange-500">6 Gün</span>
                </motion.div>
            </div>

            {/* Weekly Activity Bar Chart */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-purple-600" size={20} />
                        <h2 className="text-lg font-black text-purple-900">Haftalık Egzersiz Süresi (Dakika)</h2>
                    </div>
                    <span className="text-xs font-bold text-gray-400">Son 7 Gün</span>
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4 items-end h-40 pt-4 border-b border-gray-100 pb-2">
                    {weeklyData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                            <span className="text-[11px] font-bold text-gray-500">{d.dak} dk</span>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(d.dak / 35) * 100}%` }}
                                transition={{ duration: 0.6, delay: i * 0.05 }}
                                className={`w-full max-w-[42px] rounded-2xl ${
                                    d.tamam
                                        ? 'bg-gradient-to-t from-purple-600 to-indigo-400 shadow-md shadow-purple-200'
                                        : 'bg-purple-100'
                                }`}
                            />
                            <span className="text-xs font-bold text-gray-700">{d.gun}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Phoneme/Sound Accuracy Breakdown */}
            <div className="card p-6">
                <h2 className="text-lg font-black text-purple-900 mb-4 flex items-center gap-2">
                    <span>🗣️</span>
                    <span>Ses ve Harf Bazlı Doğruluk</span>
                </h2>

                <div className="space-y-4">
                    {soundStats.map((item, i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-purple-900">{item.sound}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 font-semibold">{item.status}</span>
                                    <span className="text-purple-700 font-black">%{item.accuracy}</span>
                                </div>
                            </div>
                            <ProgressBar
                                value={item.accuracy}
                                colorClass={item.color}
                                showPercent={false}
                                height="h-3"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Badges Section */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-purple-900 flex items-center gap-2">
                        <Award className="text-amber-500" size={22} />
                        <span>Kazanılan Başarı Rozetleri</span>
                    </h2>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        {badges.filter(b => b.kazanildi).length} / {badges.length} Kazanıldı
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {badges.map(badge => (
                        <motion.div
                            key={badge.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-3xl border-2 flex items-start gap-3 transition-all ${
                                badge.kazanildi
                                    ? 'bg-amber-50/60 border-amber-200 shadow-sm'
                                    : 'bg-gray-50 border-gray-200 opacity-60 grayscale'
                            }`}
                        >
                            <span className="text-3xl p-2 bg-white rounded-2xl shadow-sm shrink-0">
                                {badge.emoji}
                            </span>
                            <div>
                                <h3 className="font-black text-sm text-gray-900 mb-0.5">{badge.ad}</h3>
                                <p className="text-xs text-gray-500 leading-tight mb-2">{badge.aciklama}</p>
                                {badge.kazanildi && (
                                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Kazanıldı
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
