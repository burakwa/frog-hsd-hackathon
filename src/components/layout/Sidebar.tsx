// components/layout/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Gamepad2, TrendingUp, User, ShieldCheck, LogOut, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
    { href: '/panel', icon: Home, label: 'Ana Sayfa' },
    { href: '/panel/oyunlar', icon: Gamepad2, label: 'Oyunlar' },
    { href: '/panel/ilerleme', icon: TrendingUp, label: 'İlerleme' },
    { href: '/panel/profil', icon: User, label: 'Profil' },
    { href: '/panel/veli-paneli', icon: ShieldCheck, label: 'Veli / Uzman Paneli' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut, user } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-purple-100 shadow-lg z-40 p-6">
            <Link href="/panel" className="flex items-center gap-3 mb-8">
                <span className="text-4xl animate-bounce">🐸</span>
                <div>
                    <p className="text-xl font-black text-purple-700 tracking-tight">Konuşma Oyunu</p>
                    <p className="text-xs font-bold text-purple-400">2D Terapi & Oyun</p>
                </div>
            </Link>

            {/* User chip */}
            {user && (
                <div className="flex items-center gap-2 bg-purple-50 rounded-2xl px-3 py-2.5 mb-6">
                    <div className="w-9 h-9 bg-purple-200 rounded-full flex items-center justify-center text-base shadow-sm">
                        🐸
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-purple-800 truncate">
                            {user.email?.split('@')[0] ?? 'Küçük Yıldız'}
                        </p>
                        <p className="text-[11px] text-purple-500 font-semibold flex items-center gap-1">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            Seviye 1 Kahraman
                        </p>
                    </div>
                </div>
            )}

            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || (href !== '/panel' && pathname.startsWith(href));
                    return (
                        <Link key={href} href={href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                                    active
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200'
                                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="text-sm">{label}</span>
                                {active && (
                                    <div className="ml-auto w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors mt-auto"
            >
                <LogOut size={20} />
                <span className="text-sm">Çıkış Yap</span>
            </button>
        </aside>
    );
}
