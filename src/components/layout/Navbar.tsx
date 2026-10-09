// components/layout/Navbar.tsx — Clean Navigation
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, TrendingUp, User, ShieldCheck, Menu, X, Star } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
    { href: '/panel', icon: Home, label: 'Ana Sayfa' },
    { href: '/panel/oyunlar', icon: Gamepad2, label: 'Oyunlar' },
    { href: '/panel/ilerleme', icon: TrendingUp, label: 'İlerleme' },
    { href: '/panel/profil', icon: User, label: 'Profil' },
    { href: '/panel/veli-paneli', icon: ShieldCheck, label: 'Veli Paneli' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        setMobileOpen(false);
    };

    return (
        <header className="relative z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0">
            <nav className="container-main mx-auto px-4" aria-label="Ana navigasyon">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/panel" className="flex items-center gap-2" aria-label="FrogFriends Ana Sayfa">
                        <img src="/assets/logo.png" alt="FrogFriends" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                        <span className="font-fun text-xl text-gray-800">FROG<span className="text-green-600">FRIENDS</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map(({ href, icon: Icon, label }) => {
                            const active = pathname === href || (href !== '/panel' && pathname.startsWith(href));
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-rounded text-sm transition-all ${
                                        active
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <Icon size={18} aria-hidden="true" />
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Menu / Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Stars display */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-xl">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="font-fun text-green-700">0</span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="btn btn-ghost btn-small text-red-600 hover:bg-red-50 border-red-200"
                                >
                                    Çıkış
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/giris" className="btn btn-ghost btn-small">Giriş Yap</Link>
                                <Link href="/kayit" className="btn btn-primary btn-small">Kayıt Ol</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                        aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <motion.div
                    id="mobile-menu"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
                >
                    <div className="py-4 space-y-2">
                        {navItems.map(({ href, icon: Icon, label }) => {
                            const active = pathname === href || (href !== '/panel' && pathname.startsWith(href));
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-rounded transition-all ${
                                        active
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon size={20} aria-hidden="true" />
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                        <div className="pt-4 border-t border-gray-100 space-y-2">
                            {user ? (
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-rounded text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Çıkış Yap</span>
                                </button>
                            ) : (
                                <>
                                    <Link href="/giris" onClick={() => setMobileOpen(false)} className="block">
                                        <button className="w-full btn btn-ghost justify-center">Giriş Yap</button>
                                    </Link>
                                    <Link href="/kayit" onClick={() => setMobileOpen(false)} className="block">
                                        <button className="w-full btn btn-primary">Kayıt Ol</button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </nav>
        </header>
    );
}