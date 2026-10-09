// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Konuşma Oyunu 🐸 | Çocuklar için Konuşma Terapisi',
    description: 'Kurbağa ile birlikte eğlenirken doğru konuşmayı öğren! Tamamen ücretsiz, çocuklara özel konuşma terapisi oyunları.',
    keywords: 'konuşma terapisi, çocuk oyunu, ses tekrarı, hece, telaffuz',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="tr">
            <head>
                <meta name="theme-color" content="#7c3aed" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
