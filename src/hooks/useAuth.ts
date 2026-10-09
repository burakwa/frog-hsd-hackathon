// hooks/useAuth.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (!error && data) {
                setProfile(data as UserProfile);
            }
        } catch {
            // Profile might not exist yet
        }
    }, [supabase]);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }) => {
            const sessionUser = data.session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) {
                fetchProfile(sessionUser.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) {
                fetchProfile(sessionUser.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase, fetchProfile]);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { user: data.user, error };
    }, [supabase]);

    const signUpWithEmail = useCallback(async (email: string, password: string, meta?: object) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: meta },
        });
        return { user: data.user, error };
    }, [supabase]);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    }, [supabase]);

    const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
        if (!user) return { error: new Error('No user') };
        
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();
        
        if (!error && data) {
            setProfile(data as UserProfile);
        }
        return { data: data as UserProfile, error };
    }, [supabase, user]);

    return { 
        user, 
        profile, 
        loading, 
        signInWithEmail, 
        signUpWithEmail, 
        signOut,
        updateProfile,
    };
}