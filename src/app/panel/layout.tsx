// app/panel/layout.tsx
import Navbar from '@/components/layout/Navbar';
import type { ReactNode } from 'react';

export default function PanelLayout({ children }: { children: ReactNode }) {
    return (
        <div className="page-wrapper bg-pattern-dots min-h-screen">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-green-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-100/20 rounded-full blur-3xl" />
            </div>
            <Navbar />
            <main className="main-content relative z-10 container-main">
                {children}
            </main>
        </div>
    );
}