// lib/comparison/analyze.ts
// (levenshtein'ı ayrı dosyaya çıkarmadık — ağırlıklı versiyonu zaten burada)
import { normalize } from './normalize';
import { soundsSimilar } from './phonemeMap';

export interface PronunciationError {
    expected: string;  // olması gereken harf
    spoken: string;    // duyulan harf ('-' = hiç söylenmedi)
    position: number;  // kelimedeki konum
    tip: string;       // çocuğa gösterilecek ipucu
}

export interface AnalysisResult {
    score: number; // 0-100
    errors: PronunciationError[];
    isPerfect: boolean;
}

const tips: Record<string, string> = {
    r: '"r" sesini dilinin ucunu hafifçe titreterek söyle',
    l: '"l" derken dilini üst dişlerinin arkasına koy',
    s: '"s" sesini dişlerinin arasından ince bir çizgi gibi çıkar',
    ş: '"ş" derken dudaklarını yuvarla ve üfle',
    ç: '"ç" sesi bir "t" ile başlar gibi çıkar',
    c: '"c" sesi gırtlakta titreşir',
};

interface Op { cost: number; expected?: string; spoken?: string; pos: number; }

// Ağırlıklı hizalama: benzer sesler yarım hata sayılır (b↔p gibi)
function align(expected: string, spoken: string): Op[] {
    const m = expected.length, n = spoken.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(1e9));
    dp[0][0] = 0;

    const subCost = (a: string, b: string) =>
        a === b ? 0 : soundsSimilar(a, b) ? 0.5 : 1;

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i > 0) dp[i][j] = Math.min(dp[i][j], dp[i - 1][j] + 1);
            if (j > 0) dp[i][j] = Math.min(dp[i][j], dp[i][j - 1] + 1);
            if (i > 0 && j > 0)
                dp[i][j] = Math.min(dp[i][j], dp[i - 1][j - 1] + subCost(expected[i - 1], spoken[j - 1]));
        }
    }

    // Geri izleme → hangi harf nerede hatalı?
    const ops: Op[] = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + subCost(expected[i - 1], spoken[j - 1])) {
            const c = subCost(expected[i - 1], spoken[j - 1]);
            if (c > 0) ops.push({ cost: c, expected: expected[i - 1], spoken: spoken[j - 1], pos: i - 1 });
            i--; j--;
        } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
            ops.push({ cost: 1, expected: expected[i - 1], spoken: '-', pos: i - 1 });
            i--;
        } else {
            ops.push({ cost: 1, spoken: spoken[j - 1], pos: i }); // fazladan ses
            j--;
        }
    }
    return ops.reverse();
}

export function analyze(expectedText: string, spokenText: string): AnalysisResult {
    const expected = normalize(expectedText);
    const spoken = normalize(spokenText);

    if (!spoken) {
        return {
            score: 0, isPerfect: false,
            errors: [{ expected: expectedText, spoken: '-', position: 0, tip: 'Seni duyamadım, tekrar söyler misin? 🎤' }],
        };
    }
    if (expected === spoken) return { score: 100, errors: [], isPerfect: true };

    const ops = align(expected, spoken);
    const penalty = ops.reduce((sum, op) => sum + op.cost, 0);
    const score = Math.max(0, Math.round(100 * (1 - penalty / Math.max(expected.length, 1))));

    const errors: PronunciationError[] = ops
        .filter(op => op.expected && op.expected !== op.spoken)
        .map(op => ({
            expected: op.expected!,
            spoken: op.spoken ?? '-',
            position: op.pos,
            tip: tips[op.expected!] ?? `"${op.expected}" sesini biraz daha net söyle`,
        }));

    return { score, errors, isPerfect: false };
}