// app/page.tsx — mevcut içeriği tamamen değiştir
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="text-center text-white">
        <div className="text-8xl mb-6">🐼</div>
        <h1 className="text-5xl font-extrabold mb-3">Konuşma Oyunu</h1>
        <p className="text-xl opacity-90 mb-8">Panda ile kelimeleri keşfedelim! 🎤</p>
        <Link
          href="/oyunlar/ses-tekrari"
          className="inline-block bg-white text-purple-600 text-2xl font-extrabold rounded-full px-10 py-4 shadow-lg hover:scale-105 transition"
        >
          ▶ Oyna!
        </Link>
      </div>
    </main>
  );
}