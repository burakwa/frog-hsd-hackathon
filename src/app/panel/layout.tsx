// app/panel/layout.tsx
import Navbar from '@/components/layout/Navbar';
import type { ReactNode } from 'react';

export default function PanelLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 scanlines">
            <Navbar />
            {/* Desktop: offset for sidebar */}
            <div className="panel-main-content md:ml-64">
                {children}
            </div>
        </div>
    );
}
