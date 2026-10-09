// hooks/useProgress.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { GameSession, Badge } from '@/types';
import { useAuth } from './useAuth';
import { starsToLevel } from '@/lib/utils/helpers';

const INITIAL_BADGES: Badge[] = [
    { id: 'first_word', ad: 'İlk Kelime', aciklama: 'İlk konuşma egzersizini başarıyla tamamladın!', emoji: '🌱', kazanildi: true, tarih: 'Bugün' },
    { id: 'star_collector', ad: 'Yıldız Avcısı', aciklama: '15 yıldız toplamayı başardın!', emoji: '⭐', kazanildi: false },
    { id: 'frog_master', ad: 'Kurbağa Dostu', aciklama: 'Tüm oyunları en az bir kez oynadın!', emoji: '🐸', kazanildi: false },
    { id: 'streak_3', ad: 'Ateşli Seri', aciklama: '3 gün üst üste pratik yaptın!', emoji: '🔥', kazanildi: false },
    { id: 'perfect_pitch', ad: 'Kusursuz Ses', aciklama: 'Bir oyunda %100 doğruluk skoru aldın!', emoji: '👑', kazanildi: false },
    { id: 'story_teller', ad: 'Masal Anlatıcısı', aciklama: 'Bir hikayeyi baştan sona tamamladın!', emoji: '📖', kazanildi: false },
];

export function useProgress() {
    const { user, profile } = useAuth();
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [level, setLevel] = useState(1);
    const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    // Load from localStorage first (for instant UI)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const localStars = localStorage.getItem('frog_total_stars');
            if (localStars) {
                setTotalStars(Number(localStars));
                setLevel(starsToLevel(Number(localStars)));
            }
            const localSessions = localStorage.getItem('frog_game_sessions');
            if (localSessions) {
                try {
                    setSessions(JSON.parse(localSessions));
                } catch {
                    // ignore parse error
                }
            }
        }
    }, []);

    // Load from Supabase if user is authenticated
    const loadFromSupabase = useCallback(async () => {
        if (!user) {
            // Guest user - use profile from localStorage or defaults
            if (profile) {
                setTotalStars(profile.toplam_yildiz || 0);
                setLevel(profile.seviye || 1);
            }
            return;
        }
        
        setLoading(true);
        
        try {
            // 1. Get profile data (authoritative source for stars & level)
            if (profile) {
                setTotalStars(profile.toplam_yildiz || 0);
                setLevel(profile.seviye || 1);
            }

            // 2. Get game sessions
            const { data: sessionsData, error } = await supabase
                .from('game_sessions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (!error && sessionsData) {
                setSessions(sessionsData as GameSession[]);
                
                // Sync to localStorage for offline support
                if (typeof window !== 'undefined') {
                    localStorage.setItem('frog_game_sessions', JSON.stringify(sessionsData));
                }
            }

            // 3. Get badges from DB
            const { data: badgesData } = await supabase
                .from('badges')
                .select('*')
                .eq('user_id', user.id);

            if (badgesData) {
                const mergedBadges = INITIAL_BADGES.map(badge => {
                    const dbBadge = badgesData.find(b => b.badge_id === badge.id);
                    return dbBadge ? {
                        ...badge,
                        kazanildi: dbBadge.kazanildi,
                        tarih: dbBadge.kazanildigi_tarih ? new Date(dbBadge.kazanildigi_tarih).toLocaleDateString('tr-TR') : badge.tarih,
                    } : badge;
                });
                setBadges(mergedBadges);
            }
        } catch {
            // Supabase not configured or network error - fallback to profile/localStorage
        } finally {
            setLoading(false);
        }
    }, [user, profile, supabase]);

    useEffect(() => {
        loadFromSupabase();
    }, [loadFromSupabase]);

    const addStars = useCallback((count: number) => {
        setTotalStars(prev => {
            const next = prev + count;
            if (typeof window !== 'undefined') {
                localStorage.setItem('frog_total_stars', String(next));
            }
            return next;
        });
        setLevel(prev => starsToLevel(prev + count)); // fallback for local
    }, []);

    const recordSession = useCallback(async (
        oyun: 'ses-tekrari' | 'hece-avi' | 'cumle-soyle' | 'sesli-masal',
        skor: number,
        yildiz: number,
        sure_saniye: number = 30
    ) => {
        const newSession: GameSession = {
            id: String(Date.now()),
            user_id: user?.id || 'local-player',
            oyun,
            skor,
            yildiz,
            sure_saniye,
            created_at: new Date().toISOString(),
        };

        setSessions(prev => {
            const updated = [newSession, ...prev];
            if (typeof window !== 'undefined') {
                localStorage.setItem('frog_game_sessions', JSON.stringify(updated.slice(0, 50)));
            }
            return updated;
        });

        // Local optimistic update
        setTotalStars(prev => prev + yildiz);
        setLevel(starsToLevel(totalStars + yildiz));

        // Check badges locally
        setBadges(prev =>
            prev.map(b => {
                if (b.id === 'star_collector' && (totalStars + yildiz >= 15)) {
                    return { ...b, kazanildi: true, tarih: 'Bugün' };
                }
                if (b.id === 'perfect_pitch' && skor >= 95) {
                    return { ...b, kazanildi: true, tarih: 'Bugün' };
                }
                if (b.id === 'story_teller' && oyun === 'sesli-masal') {
                    return { ...b, kazanildi: true, tarih: 'Bugün' };
                }
                return b;
            })
        );

        // Save to Supabase if authenticated
        if (user) {
            try {
                await supabase.from('game_sessions').insert({
                    user_id: user.id,
                    oyun,
                    skor,
                    yildiz,
                    sure_saniye,
                });

                // Call DB function to update stars & level atomically
                await supabase.rpc('update_user_progress', {
                    user_uuid: user.id,
                    new_stars: yildiz,
                });

                // Refresh profile to get new values
                await supabase.auth.refreshSession();

                // Check and award badges in database
                const badgeChecks = [
                    { badge_id: 'first_word', condition: true },
                    { badge_id: 'star_collector', condition: totalStars + yildiz >= 15 },
                    { badge_id: 'perfect_pitch', condition: skor >= 95 },
                    { badge_id: 'story_teller', condition: oyun === 'sesli-masal' },
                ];

                for (const check of badgeChecks) {
                    if (check.condition) {
                        await supabase
                            .from('badges')
                            .upsert({
                                user_id: user.id,
                                badge_id: check.badge_id,
                                kazanildi: true,
                                kazanildigi_tarih: new Date().toISOString(),
                            }, {
                                onConflict: 'user_id,badge_id',
                            });
                    }
                }
            } catch {
                // Ignore DB errors for local development
            }
        }
    }, [user, supabase, totalStars]);

    const saveSession = useCallback(async (session: Omit<GameSession, 'id' | 'created_at' | 'user_id'>) => {
        await recordSession(session.oyun, session.skor, session.yildiz, session.sure_saniye);
    }, [recordSession]);

    return {
        sessions,
        totalStars,
        level,
        badges,
        loading,
        addStars,
        recordSession,
        saveSession,
        refresh: loadFromSupabase,
    };
}