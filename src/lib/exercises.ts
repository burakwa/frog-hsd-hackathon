// lib/data/exercises.ts
export interface Exercise {
    id: number;
    metin: string;
    emoji: string;
    kategori: string;
    zorluk: 1 | 2 | 3;
}

export const exercises: Exercise[] = [
    { id: 1, metin: 'top', emoji: '⚽', kategori: 'oyuncak', zorluk: 1 },
    { id: 2, metin: 'elma', emoji: '🍎', kategori: 'meyve', zorluk: 1 },
    { id: 3, metin: 'arı', emoji: '🐝', kategori: 'hayvan', zorluk: 1 }, // r sesi
    { id: 4, metin: 'balık', emoji: '🐟', kategori: 'hayvan', zorluk: 1 },
    { id: 5, metin: 'kuş', emoji: '🐦', kategori: 'hayvan', zorluk: 1 }, // ş sesi
    { id: 6, metin: 'kirpi', emoji: '🦔', kategori: 'hayvan', zorluk: 2 }, // r sesi
    { id: 7, metin: 'şemsiye', emoji: '☂️', kategori: 'eşya', zorluk: 2 },
    { id: 8, metin: 'çilek', emoji: '🍓', kategori: 'meyve', zorluk: 2 }, // ç sesi
    { id: 9, metin: 'köprü', emoji: '🌉', kategori: 'eşya', zorluk: 2 }, // r sesi
    { id: 10, metin: 'gökkuşağı', emoji: '🌈', kategori: 'doğa', zorluk: 3 },
];