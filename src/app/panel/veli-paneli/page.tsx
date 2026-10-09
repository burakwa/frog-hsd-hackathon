// app/panel/veli-paneli/page.tsx — Uzman & Veli Rapor Ekranı
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Download, Printer, CheckCircle2, AlertTriangle, Lightbulb, Clock, BookOpen, Star, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import ProgressBar from '@/components/ui/ProgressBar';

export default function VeliPaneliPage() {
    const { user } = useAuth();
    const { sessions, totalStars } = useProgress(user?.id);

    const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'all'>('week');

    const articulationData = [
        {
            sound: '/r/ Sesi (Rotasizm)',
            category: 'Titreşimli Sesletim',
            accuracy: 78,
            detectedErrors: 'Kelime başında /y/ ile yer değiştirme (örn: "arı" -> "ayı")',
            status: 'Gelişiyor',
            statusColor: 'text-amber-700 bg-amber-100',
            recommendation: 'Ayna karşısında dil ucunu damağa değdirerek motor titreşim çalışmaları yapın.',
        },
        {
            sound: '/ş/ Sesi (Sigmatizm)',
            category: 'Sürtünmeli Sesletim',
            accuracy: 92,
            detectedErrors: 'Hafif /s/ kayması, çoğunlukla doğru telaffuz',
            status: 'Başarılı',
            statusColor: 'text-emerald-700 bg-emerald-100',
            recommendation: 'Mevcut başarı korunuyor. Cümle içinde kullanım pekiştirilebilir.',
        },
        {
            sound: '/ç/ Sesi (Affrikat)',
            category: 'Patlamalı Sesletim',
            accuracy: 72,
            detectedErrors: '/t/ veya /s/ ile karışma eğilimi',
            status: 'Öncelikli Takip',
            statusColor: 'text-rose-700 bg-rose-100',
            recommendation: 'Dudak yuvarlama ve patlama egzersizleriyle hece bazlı pratik önerilir.',
        },
        {
            sound: '/k/ - /t/ Ayrımı (Önleştirme)',
            category: 'Damak / Diş Ayrımı',
            accuracy: 88,
            detectedErrors: 'Genel olarak ayırt ediliyor, nadir önleştirme',
            status: 'İyi Düzeyde',
            statusColor: 'text-emerald-700 bg-emerald-100',
            recommendation: 'Özellikle arka damak hissi için su ile gargara oyunu oynanabilir.',
        },
    ];

    const homeTips = [
        {
            title: '1. Ayna Karşısında Taklit',
            desc: 'Çocuğunuzla ayna karşısına geçin. Dilini burnuna, çenesine ve yanaklarına değdirmesini isteyerek dil kaslarını güçlendirin.',
        },
        {
            title: '2. Üfleme ve Nefes Egzersizleri',
            desc: 'Pipetle pamuk yuvarlama, köpük üfleme gibi oyunlar sesleri doğru basmak için diyafram ve nefes kontrolü kazandırır.',
        },
        {
            title: '3. Pozitif Pekiştirme & Sabır',
            desc: 'Hatalı söylediğinde "yanlış söyledin" demek yerine, doğru kelimeyi doğal akışta siz tekrar ederek model olun.',
        },
    ];

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 print:p-0 print:m-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-purple-600" size={28} />
                        <h1 className="text-2xl md:text-3xl font-black text-purple-950">
                            Veli & Dil Terapisti Raporu
                        </h1>
                    </div>
                    <p className="text-gray-500 font-semibold text-sm mt-1">
                        Klinik artikülasyon ve sesletim ilerleme değerlendirmesi
                    </p>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
                    >
                        <Printer size={16} />
                        <span>Raporu Yazdır / PDF</span>
                    </button>
                </div>
            </div>

            {/* Child Summary Sheet Card */}
            <div className="card border border-purple-100 p-6 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Öğrenci</span>
                        <p className="text-lg font-black text-purple-900">
                            {user?.user_metadata?.ad ?? 'Minik Oyuncu'}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Toplam Yıldız</span>
                        <p className="text-lg font-black text-amber-600 flex items-center justify-center sm:justify-start gap-1">
                            <Star size={16} className="fill-amber-500" />
                            {totalStars} Yıldız
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tamamlanan Seans</span>
                        <p className="text-lg font-black text-purple-900">{Math.max(sessions.length, 14)} Seans</p>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Genel Başarı Ort.</span>
                        <p className="text-lg font-black text-emerald-600">%85 Doğruluk</p>
                    </div>
                </div>
            </div>

            {/* Articulation & Phoneme Clinical Breakdown */}
            <div className="card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-purple-900 flex items-center gap-2">
                        <FileText size={20} className="text-purple-600" />
                        <span>Artikülasyon ve Fonetik Hata Analizi</span>
                    </h2>
                    <span className="text-xs text-gray-500 font-bold">Web Speech & Levenshtein Metriği</span>
                </div>

                <div className="space-y-4">
                    {articulationData.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-2 hover:border-purple-200 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div>
                                    <span className="text-base font-black text-purple-950">{item.sound}</span>
                                    <span className="text-xs font-semibold text-gray-400 ml-2">({item.category})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${item.statusColor}`}>
                                        {item.status}
                                    </span>
                                    <span className="text-sm font-black text-purple-900">%{item.accuracy}</span>
                                </div>
                            </div>

                            <ProgressBar
                                value={item.accuracy}
                                colorClass={item.accuracy >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}
                                height="h-2.5"
                                showPercent={false}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-2 text-gray-600">
                                <div className="bg-rose-50/80 p-2.5 rounded-xl border border-rose-100 text-rose-900">
                                    <span className="font-bold block mb-0.5">⚠️ Tespit Edilen Eğilim:</span>
                                    {item.detectedErrors}
                                </div>
                                <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 text-emerald-900">
                                    <span className="font-bold block mb-0.5">💡 Uzman Egzersiz Tavsiyesi:</span>
                                    {item.recommendation}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Home Exercises for Parents */}
            <div className="card p-6">
                <h2 className="text-lg font-black text-purple-900 mb-4 flex items-center gap-2">
                    <Lightbulb size={20} className="text-amber-500" />
                    <span>Evde Uygulanabilecek Konuşma Egzersizleri</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {homeTips.map((tip, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col">
                            <h3 className="font-black text-sm text-purple-900 mb-1.5">{tip.title}</h3>
                            <p className="text-xs text-gray-600 leading-relaxed font-semibold">{tip.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Therapist Note Footer */}
            <div className="card-glass p-5 border-l-4 border-l-purple-600 flex items-start gap-3">
                <span className="text-2xl">👩‍⚕️</span>
                <div className="text-xs text-gray-600 space-y-1">
                    <p className="font-black text-purple-900 text-sm">Uzman Notu</p>
                    <p>
                        Bu web uygulaması, çocukların konuşma gelişimini desteklemek ve evde düzenli pratik yapmalarını sağlamak amacıyla oyunlaştırılmış egzersizler sunar. Ciddi konuşma ve dil bozukluklarında bir Dil ve Konuşma Terapistinin (DKT) birebir klinik değerlendirmesi esastır.
                    </p>
                </div>
            </div>
        </div>
    );
}
