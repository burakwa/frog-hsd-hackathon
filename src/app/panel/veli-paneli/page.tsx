// app/panel/veli-paneli/page.tsx — Parent/Therapist Report (Bright Design)
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Printer, Star, FileText, Brain, AlertTriangle, Lightbulb, Download, TrendingUp, Target, Award, Sparkles, X, Loader2, CheckCircle2, Clock, Heart, BookOpen, Dumbbell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import Character from '@/components/game/Character';
import { useAIAnalysis, useAIProgressReport } from '@/hooks/useAIAnalysis';

export default function VeliPaneliPage() {
    const { user, profile } = useAuth();
    const { sessions, totalStars, badges } = useProgress();
    const { generate: generateAIReport, generating: aiGenerating, report: aiReport } = useAIProgressReport();

    const [showAIReport, setShowAIReport] = useState(false);

    const articulationData = [
        {
            sound: '/r/ Sesi (Rotasizm)',
            category: 'Titreşimli Sesletim',
            accuracy: 78,
            status: 'Gelişiyor',
            detectedErrors: 'Kelime başında /y/ ile yer değiştirme (örn: "arı" → "ayı")',
            recommendation: 'Ayna karşısında dil ucunu damağa değdirerek motor titreşim çalışmaları yapın.',
            color: 'yellow',
        },
        {
            sound: '/ş/ Sesi (Sigmatizm)',
            category: 'Sürtünmeli Sesletim',
            accuracy: 92,
            status: 'Başarılı',
            detectedErrors: 'Hafif /s/ kayması, çoğunlukla doğru telaffuz',
            recommendation: 'Mevcut başarı korunuyor. Cümle içinde kullanım pekiştirilebilir.',
            color: 'green',
        },
        {
            sound: '/ç/ Sesi (Affrikat)',
            category: 'Patlamalı Sesletim',
            accuracy: 72,
            status: 'Öncelikli',
            detectedErrors: '/t/ veya /s/ ile karışma eğilimi',
            recommendation: 'Dudak yuvarlama ve patlama egzersizleriyle hece bazlı pratik önerilir.',
            color: 'purple',
        },
        {
            sound: '/k/ - /t/ Ayrımı (Önleştirme)',
            category: 'Damak / Diş Ayrımı',
            accuracy: 88,
            status: 'İyi Düzeyde',
            detectedErrors: 'Genel olarak ayırt ediliyor, nadir önleştirme',
            recommendation: 'Özellikle arka damak hissi için su ile gargara oyunu oynanabilir.',
            color: 'blue',
        },
    ];

    const homeTips = [
        {
            title: 'Ayna Karşısında Taklit',
            desc: 'Çocuğunuzla ayna karşısına geçin. Dilini burnuna, çenesine ve yanaklarına değdirmesini isteyerek dil kaslarını güçlendirin.',
            icon: '🪞',
        },
        {
            title: 'Üfleme ve Nefes Oyunu',
            desc: 'Pipetle pamuk yuvarlama, köpük üfleme gibi oyunlar sesleri doğru basmak için diyafram ve nefes kontrolü kazandırır.',
            icon: '🫧',
        },
        {
            title: 'Pozitif Model Olma',
            desc: 'Hatalı söylediğinde "yanlış söyledin" demek yerine, doğru kelimeyi doğal akışta siz tekrar ederek model olun.',
            icon: '👨‍👩‍👧',
        },
    ];

    const colorClasses = {
        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', bar: 'bg-green-500', statusBg: 'bg-green-100', statusText: 'text-green-700', icon: '✅' },
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', bar: 'bg-blue-500', statusBg: 'bg-blue-100', statusText: 'text-blue-700', icon: '📈' },
        yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', bar: 'bg-yellow-500', statusBg: 'bg-yellow-100', statusText: 'text-yellow-700', icon: '⚠️' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-500', statusBg: 'bg-purple-100', statusText: 'text-purple-700', icon: '🎯' },
    };

    const handlePrint = () => {
        window.print();
    };

    const displayName = profile?.ad || user?.user_metadata?.ad || user?.email?.split('@')[0] || 'KAHRAMAN';
    const avgScore = sessions.length > 0
        ? Math.round(sessions.reduce((a, s) => a + s.skor, 0) / sessions.length)
        : 0;
    const totalMinutes = Math.round(sessions.reduce((a, s) => a + (s.sure_saniye || 30), 0) / 60);
    const currentLevel = Math.floor(totalStars / 10) + 1;

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
                        <img src="/assets/logo.png" alt="FrogFriends" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                        <h1 className="font-fun text-2xl md:text-3xl text-gray-800">Veli & Terapist Raporu</h1>
                        <p className="text-gray-500 text-sm">Konuşma gelişimi detay analizi ve ev önerileri</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={async () => {
                            await generateAIReport({
                                childName: displayName,
                                totalStars,
                                level: currentLevel,
                                sessions,
                                soundAccuracy: articulationData.map(a => ({ sound: a.sound, accuracy: a.accuracy, status: a.status })),
                                badges: badges.map(b => ({ ad: b.ad, kazanildi: b.kazanildi }))
                            });
                            if (aiReport) setShowAIReport(true);
                        }}
                        disabled={aiGenerating}
                        className="btn btn-accent"
                    >
                        {aiGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Oluşturuluyor...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                AI Raporu Oluştur
                            </>
                        )}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="btn btn-secondary"
                    >
                        <Printer className="w-4 h-4" />
                        Yazdır / PDF
                    </button>
                </div>
            </motion.div>

            {/* Child Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card card-elevated p-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-green-100/50 rounded-full blur-3xl" />
                <div className="relative flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-4 border-green-200 shadow-xl p-2 flex items-center justify-center">
                            <Character mood="happy" size={80} showLilypad={true} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 border-3 border-white text-white font-fun text-xs px-3 py-1 rounded-full shadow-lg">
                            LVL {currentLevel}
                        </div>
                    </div>
                    <div className="relative flex-1 text-center sm:text-left space-y-2">
                        <p className="font-rounded text-sm text-green-700">ÖĞRENCİ</p>
                        <h2 className="font-fun text-2xl md:text-3xl text-green-800">{displayName.toUpperCase()}</h2>
                        <p className="text-gray-500">
                            {user?.email ? 'Kayıtlı Kullanıcı' : 'Yerel Profil'} • Seviye {currentLevel}
                        </p>
                    </div>
                </div>
                <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatMini label="Toplam Yıldız" value={totalStars} icon={<Star className="w-5 h-5" />} color="yellow" />
                    <StatMini label="Ortalama Doğruluk" value={`%${avgScore || '--'}`} icon={<Brain className="w-5 h-5" />} color="blue" />
                    <StatMini label="Tamamlanan Seans" value={sessions.length} icon={<FileText className="w-5 h-5" />} color="green" />
                    <StatMini label="Toplam Pratik" value={`${totalMinutes} dk`} icon={<Clock className="w-5 h-5" />} color="purple" />
                </div>
            </motion.div>

            {/* Articulation Analysis */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card card-elevated p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <h2 className="font-fun text-lg text-gray-800">Artikülasyon ve Fonetik Analiz</h2>
                    </div>
                    <span className="badge bg-purple-100 text-purple-700 text-xs">Web Speech API + Levenshtein</span>
                </div>
                <div className="space-y-4">
                    {articulationData.map((item, idx) => {
                        const colors = colorClasses[item.color as keyof typeof colorClasses];
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className={`p-5 rounded-xl ${colors.bg} border ${colors.border} hover:shadow-card transition-shadow`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <span className="font-fun text-base text-gray-800">{item.sound}</span>
                                        <span className="font-rounded text-sm text-gray-500 ml-2">({item.category})</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`badge ${colors.statusBg} ${colors.statusText}`}>{colors.icon} {item.status}</span>
                                        <span className="font-fun text-xl {colors.text}">{item.accuracy}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.accuracy}%` }}
                                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                        className={`h-full rounded-full ${colors.bar}`}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-xl ${colors.statusBg} border ${colors.border}`}>
                                        <div className="font-fun text-xs text-gray-500 mb-1 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Tespit Edilen Eğilim
                                        </div>
                                        <p className="text-sm text-gray-700">{item.detectedErrors}</p>
                                    </div>
                                    <div className={`p-4 rounded-xl ${colors.statusBg} border ${colors.border}`}>
                                        <div className="font-fun text-xs text-gray-500 mb-1 flex items-center gap-1">
                                            <Lightbulb className="w-3 h-3" />
                                            Uzman Tavsiyesi
                                        </div>
                                        <p className="text-sm text-gray-700">{item.recommendation}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Home Exercises */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card card-elevated p-6"
            >
                <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h2 className="font-fun text-lg text-gray-800">Evde Uygulanabilecek Oyunlar</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {homeTips.map((tip, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="card p-5 text-center hover:shadow-card transition-shadow group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform">
                                {tip.icon}
                            </div>
                            <h3 className="font-fun text-base text-gray-800 mb-2">{tip.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{tip.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* AI Report History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card card-elevated p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <h2 className="font-fun text-lg text-gray-800">AI Gelişim Raporları</h2>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-fun text-base text-gray-800">Son AI Raporu</h3>
                            <span className="badge bg-green-100 text-green-700">Hazır</span>
                        </div>
                        <button
                            onClick={() => aiReport && setShowAIReport(true)}
                            disabled={!aiReport}
                            className="btn btn-primary w-full"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {aiReport ? 'Raporu Görüntüle' : 'AI Raporu Oluştur'}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Print Footer Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-gray-400 py-4 border-t border-gray-100"
            >
                <p>Bu rapor FrogFriends platformu tarafından otomatik oluşturulmuştur.</p>
                <p className="mt-1">Yazdır butonu ile PDF olarak kaydedebilirsiniz.</p>
            </motion.div>

            {/* AI Report Modal */}
            <AnimatePresence>
                {showAIReport && aiReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowAIReport(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="card card-elevated p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-fun text-xl text-gray-800">AI Gelişim Raporu</h2>
                                        <p className="text-sm text-gray-500">{displayName} • {new Date().toLocaleDateString('tr-TR')}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAIReport(false)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                                {/* Summary */}
                                {aiReport.summary && (
                                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            <span className="font-fun text-sm text-green-800">Genel Değerlendirme</span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{aiReport.summary}</p>
                                    </div>
                                )}

                                {/* Strengths */}
                                {aiReport.strengths && aiReport.strengths.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="font-fun text-sm text-gray-800">Güçlü Yönler</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {aiReport.strengths.map((strength: string, i: number) => (
                                                <div key={i} className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{strength}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Improvements */}
                                {aiReport.improvements && aiReport.improvements.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Target className="w-4 h-4 text-orange-500" />
                                            <span className="font-fun text-sm text-gray-800">Gelişim Alanları</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {aiReport.improvements.map((improvement: string, i: number) => (
                                                <div key={i} className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-2">
                                                    <Target className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{improvement}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Weekly Plan */}
                                {aiReport.weeklyPlan && aiReport.weeklyPlan.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <BookOpen className="w-4 h-4 text-blue-500" />
                                            <span className="font-fun text-sm text-gray-800">Haftalık Plan</span>
                                        </div>
                                        <div className="space-y-2">
                                            {aiReport.weeklyPlan.map((plan: string, i: number) => (
                                                <div key={i} className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-fun text-xs text-blue-700">{i + 1}</span>
                                                    <span className="text-sm text-gray-700">{plan}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={() => setShowAIReport(false)}
                                        className="btn btn-secondary"
                                    >
                                        Kapat
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Print Footer Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-gray-400 py-4 border-t border-gray-100"
            >
                <p>Bu rapor FrogFriends platformu tarafından otomatik oluşturulmuştur.</p>
                <p className="mt-1">Yazdır butonu ile PDF olarak kaydedebilirsiniz.</p>
            </motion.div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    .no-print { display: none !important; }
                    .card { box-shadow: none !important; border: 1px solid #e5e7eb !important; break-inside: avoid; }
                    body { background: white !important; }
                    main { padding: 0 !important; }
                    button { display: none !important; }
                    .fixed { display: none !important; }
                }
            `}</style>
        </div>
    );
}

function StatMini({ label, value, icon, color }: { 
    label: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: 'green' | 'blue' | 'yellow' | 'purple';
}) {
    const colors = {
        green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
        yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', iconBg: 'bg-yellow-100' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100' },
    }[color];

    return (
        <div className={`p-4 rounded-xl ${colors.bg} text-center hover:shadow-card transition-shadow`}>
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.iconBg} mb-2`}>
                {icon}
            </div>
            <p className="font-fun text-xl text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );
}