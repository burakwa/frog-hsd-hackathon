// lib/utils/helpers.ts

/** Rastgele bir dizi elemanı döndür */
export function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/** Diziyi karıştır (Fisher-Yates) */
export function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/** Saniyeyi mm:ss formatına çevir */
export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Skoru 0-100 arasında sıkıştır */
export function clampScore(score: number): number {
    return Math.min(100, Math.max(0, Math.round(score)));
}

/** Yıldız say: skor >= 90 → 3, >= 70 → 2, diğer → 1 */
export function scoreToStars(score: number): 1 | 2 | 3 {
    if (score >= 90) return 3;
    if (score >= 70) return 2;
    return 1;
}

/** Fallback seviye hesapla (offline/localStorage için) */
export function starsToLevel(totalStars: number): number {
    return Math.floor(totalStars / 10) + 1;
}

/** Tarih formatlama */
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
