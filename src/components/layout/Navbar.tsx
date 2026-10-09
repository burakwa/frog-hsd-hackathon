// components/layout/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Gamepad2, TrendingUp, User, LogOut, Star, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
    { href: '/panel', icon: Home, label: 'Ana Sayfa' },
    { href: '/panel/oyunlar', icon: Gamepad2, label: 'Oyunlar' },
    { href: '/panel/ilerleme', icon: TrendingUp, label: 'İlerleme' },
    { href: '/panel/profil', icon: User, label: 'Profil' },
    { href: '/panel/veli-paneli', icon: ShieldCheck, label: 'Veli' },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut, user } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-purple-100 shadow-lg z-40 p-6">
                <Link href="/panel" className="flex items-center gap-3 mb-8">
                    <span className="text-4xl">🐸</span>
                    <div>
                        <p className="text-lg font-black text-purple-700">Konuşma</p>
                        <p className="text-sm font-bold text-purple-400">Oyunu</p>
                    </div>
                </Link>

                {/* User chip */}
                {user && (
                    <div className="flex items-center gap-2 bg-purple-50 rounded-2xl px-3 py-2 mb-6">
                        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-sm">
                            🐸
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-purple-700 truncate">
                                {user.email?.split('@')[0] ?? 'Oyuncu'}
                            </p>
                            <p className="text-xs text-purple-400 flex items-center gap-1">
                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                Süper Oyuncu
                            </p>
                        </div>
                    </div>
                )}

                <nav className="flex-1 flex flex-col gap-2">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const active = pathname.startsWith(href) && (href !== '/panel' || pathname === '/panel');
                        return (
                            <Link key={href} href={href}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors ${
                                        active
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                            : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700'
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span>{label}</span>
                                    {active && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="ml-auto w-2 h-2 bg-white rounded-full"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 font-bold transition-colors mt-4"
                >
                    <LogOut size={18} />
                    <span>Çıkış Yap</span>
                </button>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-purple-100 z-40 flex justify-around py-2 px-4 safe-area-inset-bottom">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname.startsWith(href) && (href !== '/panel' || pathname === '/panel');
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center gap-0.5 px-2 py-1"
                        >
                            <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-purple-100' : ''}`}>
                                <Icon
                                    size={22}
                                    className={active ? 'text-purple-600' : 'text-gray-400'}
                                />
                            </div>
                            <span className={`text-xs font-bold ${active ? 'text-purple-600' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
