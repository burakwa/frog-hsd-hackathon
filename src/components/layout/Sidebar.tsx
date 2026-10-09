// components/layout/Sidebar.tsx — Retro Arcade Sidebar
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Gamepad2, TrendingUp, User, ShieldCheck, LogOut, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
    { href: '/panel', icon: Home, label: 'ANA SAYFA' },
    { href: '/panel/oyunlar', icon: Gamepad2, label: 'OYUNLAR' },
    { href: '/panel/ilerleme', icon: TrendingUp, label: 'İLERLEME' },
    { href: '/panel/profil', icon: User, label: 'PROFİL' },
    { href: '/panel/veli-paneli', icon: ShieldCheck, label: 'VELİ RAPORU' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { signOut, user } = useAuth();

    return (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-slate-950 border-r-4 border-slate-800 z-40 p-5 select-none scanlines">
            <Link href="/panel" className="mb-5 flex items-center gap-2 border-b-2 border-slate-800 pb-4">
                <span className="text-3xl" aria-hidden="true">🐸</span>
                <span className="font-pixel text-[11px] leading-relaxed text-yellow-300">
                    FROG<br /><span className="text-cyan-300">ARCADE</span>
                </span>
            </Link>

            {/* Retro Player Profile Banner */}
            {user && (
                <div className="pixel-box bg-slate-900 border-indigo-500 rounded-xl p-3 mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center text-3xl" aria-hidden="true">
                        🐸
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-pixel text-[10px] text-yellow-300 truncate">
                            {user.email?.split('@')[0]?.toUpperCase() ?? 'PLAYER 1'}
                        </p>
                        <p className="font-arcade text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                            <span>★</span> LEVEL 1 HERO
                        </p>
                    </div>
                </div>
            )}

            {/* Navigation links */}
            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || (href !== '/panel' && pathname.startsWith(href));
                    return (
                        <Link key={href} href={href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-pixel text-xs transition-all border-2 ${
                                    active
                                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-[3px_3px_0px_#000]'
                                        : 'text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-900 border-transparent hover:border-slate-700'
                                }`}
                            >
                                <Icon size={16} />
                                <span className="tracking-wide">{label}</span>
                                {active && (
                                    <div className="ml-auto w-2 h-2 bg-yellow-300 rounded-sm animate-pulse" />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out Button */}
            <button
                onClick={signOut}
                className="pixel-btn bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border-slate-700 hover:border-red-600 py-2.5 px-3 text-[11px] flex items-center gap-2 mt-auto"
            >
                <LogOut size={14} />
                <span>ÇIKIŞ YAP</span>
            </button>
        </aside>
    );
}
