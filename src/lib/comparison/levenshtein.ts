// lib/comparison/levenshtein.ts

/**
 * Ağırlıklı Levenshtein mesafesi.
 * soundsSimilar ses çifti yarım hata sayılır.
 */
import { soundsSimilar } from './phonemeMap';

export function weightedLevenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const subCost = a[i - 1] === b[j - 1] ? 0
                : soundsSimilar(a[i - 1], b[j - 1]) ? 0.5 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,       // silme
                dp[i][j - 1] + 1,       // ekleme
                dp[i - 1][j - 1] + subCost  // değiştir / eşleştir
            );
        }
    }
    return dp[m][n];
}
