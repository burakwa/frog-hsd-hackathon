// hooks/useAuth.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, [supabase]);

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
    }, [supabase]);

    return { user, loading, signInWithEmail, signUpWithEmail, signOut };
}
