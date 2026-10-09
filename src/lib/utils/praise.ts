// lib/utils/praise.ts

const praises = [
    'Süpersin! 🌟',
    'Harikasın! 🎉',
    'Çok güzel söyledin! 👏',
    'Mükemmel! 🏆',
    'Bravo, şampiyon! 🥇',
    'Aferin sana! ⭐',
    'Çok iyiydi! 🚀',
    'Tam isabet! 🎯',
    'Muhteşemsin! 🌈',
    'Harika iş! ✨',
];

const encouragements = [
    'Neredeyse oldu! Bir kez daha dene! 💪',
    'Çok yaklaştın, hadi yeniden! 🎯',
    'Biraz daha, başarabilirsin! ✨',
    'Devam et, pes etme! 🌟',
    'Bu sefer daha dikkatli dene! 👂',
    'Güzel çaba! Bir kez daha söyle! 🎤',
];

const motivations = [
    'Bugün çok iyi çalışıyorsun! 🌟',
    'Her seferinde daha iyileşiyorsun! 📈',
    'Harika bir ilerleme! 🚀',
    'Devam et, gerçek bir kahraman oluyorsun! 🦸',
];

export function randomPraise(): string {
    return praises[Math.floor(Math.random() * praises.length)];
}

export function randomEncouragement(): string {
    return encouragements[Math.floor(Math.random() * encouragements.length)];
}

export function randomMotivation(): string {
    return motivations[Math.floor(Math.random() * motivations.length)];
}
