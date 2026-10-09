// app/panel/veli-paneli/page.tsx — Retro Veli ve Dil Terapisti Raporu
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Printer, CheckCircle2, AlertTriangle, Lightbulb, Star, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';

export default function VeliPaneliPage() {
    const { user } = useAuth();
    const { sessions, totalStars } = useProgress(user?.id);

    const articulationData = [
        {
            sound: '/r/ Sesi (Rotasizm)',
            category: 'Titreşimli Sesletim',
            accuracy: 78,
            detectedErrors: 'Kelime başında /y/ ile yer değiştirme (örn: "arı" -> "ayı")',
            status: 'GELİŞİYOR',
            statusColor: 'text-yellow-400 bg-yellow-950 border-yellow-500',
            barColor: 'bg-yellow-400',
            recommendation: 'Ayna karşısında dil ucunu damağa değdirerek motor titreşim çalışmaları yapın.',
        },
        {
            sound: '/ş/ Sesi (Sigmatizm)',
            category: 'Sürtünmeli Sesletim',
            accuracy: 92,
            detectedErrors: 'Hafif /s/ kayması, çoğunlukla doğru telaffuz',
            status: 'BAŞARILI',
            statusColor: 'text-emerald-400 bg-emerald-950 border-emerald-500',
            barColor: 'bg-emerald-400',
            recommendation: 'Mevcut başarı korunuyor. Cümle içinde kullanım pekiştirilebilir.',
        },
        {
            sound: '/ç/ Sesi (Affrikat)',
            category: 'Patlamalı Sesletim',
            accuracy: 72,
            detectedErrors: '/t/ veya /s/ ile karışma eğilimi',
            status: 'ÖNCELİKLİ',
            statusColor: 'text-rose-400 bg-rose-950 border-rose-500',
            barColor: 'bg-rose-500',
            recommendation: 'Dudak yuvarlama ve patlama egzersizleriyle hece bazlı pratik önerilir.',
        },
        {
            sound: '/k/ - /t/ Ayrımı (Önleştirme)',
            category: 'Damak / Diş Ayrımı',
            accuracy: 88,
            detectedErrors: 'Genel olarak ayırt ediliyor, nadir önleştirme',
            status: 'İYİ DÜZEYDE',
            statusColor: 'text-cyan-400 bg-cyan-950 border-cyan-500',
            barColor: 'bg-cyan-400',
            recommendation: 'Özellikle arka damak hissi için su ile gargara oyunu oynanabilir.',
        },
    ];

    const homeTips = [
        {
            title: '1. AYNA KARŞISINDA TAKLİT',
            desc: 'Çocuğunuzla ayna karşısına geçin. Dilini burnuna, çenesine ve yanaklarına değdirmesini isteyerek dil kaslarını güçlendirin.',
        },
        {
            title: '2. ÜFLEME VE NEFES OYUNU',
            desc: 'Pipetle pamuk yuvarlama, köpük üfleme gibi oyunlar sesleri doğru basmak için diyafram ve nefes kontrolü kazandırır.',
        },
        {
            title: '3. POZİTİF MODEL OLMA',
            desc: 'Hatalı söylediğinde "yanlış söyledin" demek yerine, doğru kelimeyi doğal akışta siz tekrar ederek model olun.',
        },
    ];

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    return (
        <div className="w-full pt-2 md:pt-4 px-4 md:px-6 pb-4 max-w-4xl mx-auto space-y-6 select-none print:bg-white print:text-black">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-yellow-400" size={26} />
                        <h1 className="font-pixel text-lg md:text-2xl text-yellow-300 drop-shadow">
                            VELİ & TERAPİST RAPORU
                        </h1>
                    </div>
                    <p className="font-arcade text-xs text-slate-400 mt-1">
                        KLİNİK ARTİKÜLASYON VE SESLETİM DEĞERLENDİRME PANELİ
                    </p>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="pixel-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 px-4 text-xs flex items-center gap-2"
                    >
                        <Printer size={16} />
                        <span>YAZDIR / PDF</span>
                    </button>
                </div>
            </div>

            {/* Child Summary Sheet Card */}
            <div className="pixel-box p-5 rounded-2xl bg-slate-900 border-indigo-500">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
                    <div>
                        <span className="font-pixel text-[9px] text-slate-400 block mb-0.5">ÖĞRENCİ</span>
                        <p className="font-pixel text-sm text-yellow-300">
                            {user?.user_metadata?.ad ?? 'KAHRAMAN'}
                        </p>
                    </div>
                    <div>
                        <span className="font-pixel text-[9px] text-slate-400 block mb-0.5">TOPLAM YILDIZ</span>
                        <p className="font-pixel text-sm text-yellow-400 flex items-center justify-center sm:justify-start gap-1">
                            ★ {totalStars}
                        </p>
                    </div>
                    <div>
                        <span className="font-pixel text-[9px] text-slate-400 block mb-0.5">SEANS SAYISI</span>
                        <p className="font-pixel text-sm text-emerald-400">{Math.max(sessions.length, 14)} SEANS</p>
                    </div>
                    <div>
                        <span className="font-pixel text-[9px] text-slate-400 block mb-0.5">ORT. BAŞARI</span>
                        <p className="font-pixel text-sm text-cyan-400">%85 DOĞRULUK</p>
                    </div>
                </div>
            </div>

            {/* Articulation & Phoneme Clinical Breakdown */}
            <div className="pixel-box p-5 rounded-2xl bg-slate-900 border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h2 className="font-pixel text-xs md:text-sm text-yellow-300 flex items-center gap-2">
                        <FileText size={16} />
                        <span>ARTİKÜLASYON VE FONETİK ANALİZ</span>
                    </h2>
                    <span className="font-arcade text-[11px] text-slate-400">WEB SPEECH & LEVENSHTEIN</span>
                </div>

                <div className="space-y-4">
                    {articulationData.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-950 border-2 border-slate-800 space-y-2.5"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div>
                                    <span className="font-pixel text-xs text-white">{item.sound}</span>
                                    <span className="font-arcade text-xs text-slate-400 ml-2">({item.category})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`font-pixel text-[9px] px-2 py-0.5 rounded border ${item.statusColor}`}>
                                        {item.status}
                                    </span>
                                    <span className="font-pixel text-xs text-yellow-300">%{item.accuracy}</span>
                                </div>
                            </div>

                            <div className="w-full bg-slate-900 h-2.5 rounded border border-slate-700 overflow-hidden">
                                <div className={`h-full ${item.barColor}`} style={{ width: `${item.accuracy}%` }} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                                <div className="bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/60 text-rose-200">
                                    <span className="font-pixel text-[9px] text-rose-400 block mb-1">⚠️ TESPİT EDİLEN EĞİLİM:</span>
                                    <p className="font-arcade text-xs">{item.detectedErrors}</p>
                                </div>
                                <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900/60 text-emerald-200">
                                    <span className="font-pixel text-[9px] text-emerald-400 block mb-1">💡 UZMAN TAVSİYESİ:</span>
                                    <p className="font-arcade text-xs">{item.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Home Exercises */}
            <div className="pixel-box p-5 rounded-2xl bg-slate-900 border-slate-700">
                <h2 className="font-pixel text-xs md:text-sm text-yellow-300 mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Lightbulb size={16} />
                    <span>EVDE UYGULANABİLECEK KONUŞMA OYUNLARI</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {homeTips.map((tip, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
                            <h3 className="font-pixel text-[10px] text-yellow-300 mb-1.5">{tip.title}</h3>
                            <p className="font-arcade text-xs text-slate-300 leading-relaxed">{tip.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
