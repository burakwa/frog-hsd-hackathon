// components/layout/Navbar.tsx — Retro Arcade Navigation
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, TrendingUp, User, ShieldCheck } from 'lucide-react';
import Sidebar from './Sidebar';

const navItems = [
    { href: '/panel', icon: Home, label: 'ANA SAYFA' },
    { href: '/panel/oyunlar', icon: Gamepad2, label: 'OYUNLAR' },
    { href: '/panel/ilerleme', icon: TrendingUp, label: 'İLERLEME' },
    { href: '/panel/profil', icon: User, label: 'PROFİL' },
    { href: '/panel/veli-paneli', icon: ShieldCheck, label: 'VELİ' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop: Dedicated Retro Sidebar */}
            <Sidebar />

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav md:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 border-t-3 border-slate-800 z-40 flex justify-around pt-2 px-2 select-none">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || (href !== '/panel' && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center gap-1 px-2 py-1"
                        >
                            <div className={`p-2 rounded-lg border-2 transition-all ${
                                active
                                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}>
                                <Icon size={18} />
                            </div>
                            <span className={`font-pixel text-[8px] tracking-tight ${
                                active ? 'text-yellow-300 font-bold' : 'text-slate-400'
                            }`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
