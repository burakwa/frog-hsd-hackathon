// lib/data/exercises.ts
export interface Exercise {
    id: number;
    metin: string;
    emoji: string;
    kategori: string;
    zorluk: 1 | 2 | 3;
    options?: string[]; // Fallback manuel seçim için
}

export const exercises: Exercise[] = [
    { id: 1, metin: 'top', emoji: '⚽', kategori: 'oyuncak', zorluk: 1, options: ['top', 'tap', 'kop', 'ton'] },
    { id: 2, metin: 'elma', emoji: '🍎', kategori: 'meyve', zorluk: 1, options: ['elma', 'alma', 'elba', 'emla'] },
    { id: 3, metin: 'arı', emoji: '🐝', kategori: 'hayvan', zorluk: 1, options: ['arı', 'ari', 'ayı', 'uru'] }, // r sesi
    { id: 4, metin: 'balık', emoji: '🐟', kategori: 'hayvan', zorluk: 1, options: ['balık', 'balik', 'palık', 'baluk'] },
    { id: 5, metin: 'kuş', emoji: '🐦', kategori: 'hayvan', zorluk: 1, options: ['kuş', 'kus', 'guş', 'küş'] }, // ş sesi
    { id: 6, metin: 'kirpi', emoji: '🦔', kategori: 'hayvan', zorluk: 2, options: ['kirpi', 'kırpi', 'girpi', 'kirbi'] }, // r sesi
    { id: 7, metin: 'şemsiye', emoji: '☂️', kategori: 'eşya', zorluk: 2, options: ['şemsiye', 'semsiye', 'şemsie', 'çemsiye'] }, // ş sesi
    { id: 8, metin: 'çilek', emoji: '🍓', kategori: 'meyve', zorluk: 2, options: ['çilek', 'cilek', 'silek', 'çileğ'] }, // ç sesi
    { id: 9, metin: 'köprü', emoji: '🌉', kategori: 'eşya', zorluk: 2, options: ['köprü', 'kopru', 'göprü', 'köpru'] }, // r/ö sesi
    { id: 10, metin: 'gökkuşağı', emoji: '🌈', kategori: 'doğa', zorluk: 3, options: ['gökkuşağı', 'gokkusagi', 'göküşağı', 'kokkuşağı'] }, // ğ/ş sesi
];