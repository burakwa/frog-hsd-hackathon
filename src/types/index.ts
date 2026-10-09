// types/index.ts

export type Difficulty = 1 | 2 | 3;

export interface Exercise {
    id: number;
    metin: string;
    emoji: string;
    kategori: string;
    zorluk: Difficulty;
}

export interface SentenceExercise {
    id: number;
    cumle: string;
    bosluk: string; // cevap
    ipucu: string;
    emoji: string;
    zorluk: Difficulty;
}

export interface StoryExercise {
    id: number;
    baslik: string;
    metin: string;
    emoji: string;
    zorluk: Difficulty;
}

export interface HeceExercise {
    id: number;
    hece: string;
    kelimeler: string[];
    emoji: string;
    zorluk: Difficulty;
}

export interface UserProfile {
    id: string;
    ad: string;
    yas: number;
    avatar: 'kurbaga' | 'panda' | 'tavsan';
    toplam_yildiz: number;
    seviye: number;
    created_at: string;
}

export interface GameSession {
    id: string;
    user_id: string;
    oyun: 'ses-tekrari' | 'hece-avi' | 'cumle-soyle' | 'sesli-masal';
    skor: number;
    yildiz: number;
    sure_saniye: number;
    created_at: string;
}

export interface Badge {
    id: string;
    ad: string;
    aciklama: string;
    emoji: string;
    kazanildi: boolean;
    tarih?: string;
}

export interface PronunciationError {
    expected: string;
    spoken: string;
    position: number;
    tip: string;
}

export interface AnalysisResult {
    score: number;
    errors: PronunciationError[];
    isPerfect: boolean;
}

export type MascotMood = 'happy' | 'speaking' | 'sad' | 'excited' | 'thinking';
export type GameId = 'ses-tekrari' | 'hece-avi' | 'cumle-soyle' | 'sesli-masal';
