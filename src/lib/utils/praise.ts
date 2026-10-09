// lib/utils/praise.ts

const praises = [
    'Harikasın! Süper söyledin! 🌟',
    'Çok güzel! Aferin sana! 👏',
    'Tebrikler! Harika bir telaffuz! 🎉',
    'Muhteşemsin! Tam bir şampiyon! 🏆',
    'Harika iş çıkardın! Çok iyiydi! 🚀',
    'Süpersin! Çok net ve doğru! ⭐',
];

const encouragements = [
    'Çok yaklaştın, bir kez daha dene! ✨',
    'Biraz daha gayret, başarabilirsin! 💪',
    'Tekrar deneyelim, haydi bir daha söyle! 🎯',
    'Neredeyse oldu! Bir kez daha dene! 🎈',
    'Harika çabalıyorsun, haydi bir daha! 🌈',
];

export function randomPraise(): string {
    const index = Math.floor(Math.random() * praises.length);
    return praises[index];
}

export function randomEncouragement(): string {
    const index = Math.floor(Math.random() * encouragements.length);
    return encouragements[index];
}
