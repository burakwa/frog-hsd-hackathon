// hooks/useProgress.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { GameSession, Badge } from '@/types';

const INITIAL_BADGES: Badge[] = [
    { id: 'first_word', ad: 'İlk Kelime', aciklama: 'İlk konuşma egzersizini başarıyla tamamladın!', emoji: '🌱', kazanildi: true, tarih: 'Bugün' },
    { id: 'star_collector', ad: 'Yıldız Avcısı', aciklama: '15 yıldız toplamayı başardın!', emoji: '⭐', kazanildi: false },
    { id: 'frog_master', ad: 'Kurbağa Dostu', aciklama: 'Tüm oyunları en az bir kez oynadın!', emoji: '🐸', kazanildi: false },
    { id: 'streak_3', ad: 'Ateşli Seri', aciklama: '3 gün üst üste pratik yaptın!', emoji: '🔥', kazanildi: false },
    { id: 'perfect_pitch', ad: 'Kusursuz Ses', aciklama: 'Bir oyunda %100 doğruluk skoru aldın!', emoji: '👑', kazanildi: false },
    { id: 'story_teller', ad: 'Masal Anlatıcısı', aciklama: 'Bir hikayeyi baştan sona tamamladın!', emoji: '📖', kazanildi: false },
];

export function useProgress(userId?: string) {
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [totalStars, setTotalStars] = useState(12);
    const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const loadProgress = useCallback(async () => {
        setLoading(true);

        // 1. Load from localStorage if present
        if (typeof window !== 'undefined') {
            const localStars = localStorage.getItem('frog_total_stars');
            if (localStars) {
                setTotalStars(Number(localStars));
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

        // 2. If authenticated Supabase user, fetch from DB
        if (userId) {
            try {
                const { data } = await supabase
                    .from('game_sessions')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (data && data.length > 0) {
                    setSessions(data as GameSession[]);
                    const stars = (data as GameSession[]).reduce((sum, s) => sum + (s.yildiz ?? 0), 0);
                    setTotalStars(stars);
                }
            } catch {
                // Supabase table or network fallback
            }
        }

        setLoading(false);
    }, [userId, supabase]);

    const addStars = useCallback((count: number) => {
        setTotalStars(prev => {
            const next = prev + count;
            if (typeof window !== 'undefined') {
                localStorage.setItem('frog_total_stars', String(next));
            }
            return next;
        });
    }, []);

    const recordSession = useCallback(async (
        oyun: 'ses-tekrari' | 'hece-avi' | 'cumle-soyle' | 'sesli-masal',
        skor: number,
        yildiz: number,
        sure_saniye: number = 30
    ) => {
        const newSession: GameSession = {
            id: String(Date.now()),
            user_id: userId || 'local-player',
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

        // Check badges
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

        if (userId) {
            try {
                await supabase.from('game_sessions').insert({
                    user_id: userId,
                    oyun,
                    skor,
                    yildiz,
                    sure_saniye,
                });
            } catch {
                // Ignore DB insertion error for local development
            }
        }
    }, [userId, supabase, totalStars]);

    const saveSession = useCallback(async (session: Omit<GameSession, 'id' | 'created_at' | 'user_id'>) => {
        await recordSession(session.oyun, session.skor, session.yildiz, session.sure_saniye);
    }, [recordSession]);

    useEffect(() => {
        loadProgress();
    }, [loadProgress]);

    return {
        sessions,
        totalStars,
        badges,
        loading,
        addStars,
        recordSession,
        saveSession,
        loadProgress,
    };
}
