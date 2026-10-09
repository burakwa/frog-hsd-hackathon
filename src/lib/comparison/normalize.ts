// lib/comparison/normalize.ts
export function normalize(text: string): string {
    return text
        .toLocaleLowerCase('tr-TR') // ⚠️ .toLowerCase() DEĞİL! Türkçe I/ı sorunu var
        .replace(/[.,!?;:'"()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}