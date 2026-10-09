// app/panel/layout.tsx
import Navbar from '@/components/layout/Navbar';
import type { ReactNode } from 'react';

export default function PanelLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-app">
            <Navbar />
            {/* Desktop: offset for sidebar */}
            <div className="md:ml-64 pb-24 md:pb-8">
                {children}
            </div>
        </div>
    );
}
