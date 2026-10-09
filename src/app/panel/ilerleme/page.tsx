// app/panel/ilerleme/page.tsx — Progress & Achievements (Bright Design)
'use client';
import { motion } from 'framer-motion';
import { Star, Award, TrendingUp, Clock, Flame, Calendar, CheckCircle2, ShieldCheck, BarChart2, Brain, Target } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';

export default function IlerlemePage() {
    const { user } = useAuth();
    const { totalStars, sessions, badges } = useProgress();

    // Weekly activity data
    const weeklyData = [
        { gun: 'Pzt', dak: 15, tamam: true },
        { gun: 'Sal', dak: 20, tamam: true },
        { gun: 'Çar', dak: 12, tamam: true },
        { gun: 'Per', dak: 25, tamam: true },
        { gun: 'Cum', dak: 18, tamam: true },
        { gun: 'Cmt', dak: 30, tamam: true },
        { gun: 'Paz', dak: 10, tamam: false },
    ];

    // Sound accuracy data
    const soundStats = [
        { sound: '"r" sesi (Titreşimli)', accuracy: 82, status: 'Hızlı Gelişiyor', color: 'green' },
        { sound: '"ş" sesi (Sürtünmeli)', accuracy: 91, status: 'Mükemmel', color: 'blue' },
        { sound: '"ç" sesi (Patlamalı)', accuracy: 74, status: 'Pratik Gerekli', color: 'yellow' },
        { sound: '"l" sesi (Yanal)', accuracy: 95, status: 'Kusursuz', color: 'purple' },
    ];

    const totalMinutes = Math.max(sessions.reduce((acc, s) => acc + (s.sure_saniye || 30), 0) / 60, 0);
    const avgScore = sessions.length > 0
        ? Math.round(sessions.reduce((acc, s) => acc + s.skor, 0) / sessions.length)
        : 0;

    const colorClasses = {
        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', iconBg: 'bg-green-100', bar: 'bg-green-500', statusBg: 'bg-green-100' },
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100', bar: 'bg-blue-500', statusBg: 'bg-blue-100' },
        yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', iconBg: 'bg-yellow-100', bar: 'bg-yellow-500', statusBg: 'bg-yellow-100' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconBg: 'bg-purple-100', bar: 'bg-purple-500', statusBg: 'bg-purple-100' },
    };

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="font-fun text-2xl md:text-3xl text-gray-800 flex items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-green-600" />
                        Gelişim & İlerleme
                    </h1>
                    <p className="text-gray-500 mt-1">Haftalık konuşma performansı ve başarı rozetlerin</p>
                </div>
                <Link
                    href="/panel/veli-paneli"
                    className="btn btn-secondary btn-small hidden sm:inline-flex"
                >
                    <ShieldCheck className="w-4 h-4" />
                    Veli Raporu
                </Link>
            </motion.div>

            {/* Quick Metrics Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <StatCard
                    icon={<Star className="w-6 h-6" />}
                    value={totalStars}
                    label="Toplam Yıldız"
                    color="yellow"
                />
                <StatCard
                    icon={<Target className="w-6 h-6" />}
                    value={`%${avgScore || '--'}`}
                    label="Doğruluk"
                    color="blue"
                />
                <StatCard
                    icon={<Clock className="w-6 h-6" />}
                    value={`${Math.round(totalMinutes)} dk`}
                    label="Toplam Süre"
                    color="green"
                />
                <StatCard
                    icon={<Flame className="w-6 h-6" />}
                    value={`${Math.min(sessions.length, 7)} gün`}
                    label="Seri"
                    color="purple"
                />
            </motion.div>

            {/* Weekly Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card card-elevated p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <h2 className="font-fun text-lg text-gray-800">Haftalık Pratik</h2>
                    </div>
                    <span className="text-sm text-gray-500">Son 7 Gün</span>
                </div>

                <div className="grid grid-cols-7 gap-3 items-end h-40 pt-2">
                    {weeklyData.map((d, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max((d.dak / 35) * 100, 5)}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="flex flex-col items-center gap-2 h-full justify-end"
                        >
                            <span className="text-xs font-rounded text-gray-500">{d.dak}dk</span>
                            <div className={`w-full rounded-t ${d.tamam ? 'bg-gradient-to-t from-green-500 to-emerald-400' : 'bg-gray-200'}`} />
                            <span className="text-xs font-rounded text-gray-500 capitalize">{d.gun.toLowerCase()}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Sound Accuracy Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card card-elevated p-6"
            >
                <div className="flex items-center gap-2 mb-6">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h2 className="font-fun text-lg text-gray-800">Ses Bazlı Doğruluk</h2>
                </div>

                <div className="space-y-4">
                    {soundStats.map((item, i) => {
                        const colors = colorClasses[item.color as keyof typeof colorClasses];
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-rounded text-sm text-gray-700">{item.sound}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`badge ${colors.statusBg.replace('bg-', '')} ${colors.text}`}>{item.status}</span>
                                        <span className="font-fun text-lg {colors.text}">{item.accuracy}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.accuracy}%` }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                        className={`h-full rounded-full ${colors.bar}`}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Badges Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card card-elevated p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <h2 className="font-fun text-lg text-gray-800">Rozetler</h2>
                    </div>
                    <span className="badge bg-yellow-100 text-yellow-700">
                        {badges.filter(b => b.kazanildi).length} / {badges.length} Kazandı
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map(badge => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className={`card p-4 flex items-start gap-4 transition-all ${badge.kazanildi ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 opacity-60 grayscale'}`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${badge.kazanildi ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                                <span className="text-2xl">{badge.emoji}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-fun text-sm text-gray-800 mb-1">{badge.ad}</h3>
                                <p className="text-gray-600 text-sm mb-2">{badge.aciklama}</p>
                                {badge.kazanildi && (
                                    <span className="badge bg-green-100 text-green-700 text-xs">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Kazanıldı {badge.tarih ? `(${badge.tarih})` : ''}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ icon, value, label, color }: { 
    icon: React.ReactNode; 
    value: string | number; 
    label: string; 
    color: 'green' | 'blue' | 'yellow' | 'purple';
}) {
    const colors = {
        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', iconBg: 'bg-green-100' },
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100' },
        yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', iconBg: 'bg-yellow-100' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconBg: 'bg-purple-100' },
    }[color];

    return (
        <div className={`card p-5 text-center border-l-4 ${colors.border} ${colors.bg}`}>
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.iconBg} mb-3`}>
                {icon}
            </div>
            <p className="font-fun text-2xl md:text-3xl text-gray-800 mb-1">{value}</p>
            <p className="text-gray-500 font-rounded text-sm">{label}</p>
        </div>
    );
}