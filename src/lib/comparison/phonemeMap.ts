// lib/comparison/phonemeMap.ts
// Türkçe'de çocukların (ve tanımanın) karıştırdığı sesler
const similarSounds: Record<string, string[]> = {
    b: ['p'], p: ['b'],
    d: ['t'], t: ['d'],
    g: ['k'], k: ['g'],
    v: ['f'], f: ['v'],
    c: ['ç'], ç: ['c'],
    ş: ['s'], s: ['ş'],
    z: ['s'],
    r: ['l'], l: ['r'],
    j: ['ş'],
};

export function soundsSimilar(a: string, b: string): boolean {
    return similarSounds[a]?.includes(b) ?? false;
}