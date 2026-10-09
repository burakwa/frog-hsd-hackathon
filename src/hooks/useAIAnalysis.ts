// hooks/useAIAnalysis.ts - Frontend hook for AI speech analysis
'use client';
import { useState, useCallback } from 'react';
import type { AIAnalysisRequest, AIAnalysisResponse } from '@/lib/ai/openrouter';

export function useAIAnalysis() {
    const [analyzing, setAnalyzing] = useState(false);
    const [lastResult, setLastResult] = useState<AIAnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const analyze = useCallback(async (request: AIAnalysisRequest): Promise<AIAnalysisResponse | null> => {
        setAnalyzing(true);
        setError(null);
        
        try {
            const response = await fetch('/api/ai-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error('AI analiz başarısız');
            }

            const result = await response.json();
            setLastResult(result);
            return result;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
            setError(msg);
            console.error('AI Analysis error:', err);
            return null;
        } finally {
            setAnalyzing(false);
        }
    }, []);

    const clear = useCallback(() => {
        setLastResult(null);
        setError(null);
    }, []);

    return { analyze, analyzing, lastResult, error, clear };
}

export function useAIProgressReport() {
    const [generating, setGenerating] = useState(false);
    const [report, setReport] = useState<any>(null);
    const [saved, setSaved] = useState(false);

    const generate = useCallback(async (data: {
        childName: string;
        totalStars: number;
        level: number;
        sessions: any[];
        soundAccuracy: any[];
        badges: any[];
    }) => {
        setGenerating(true);
        setSaved(false);
        try {
            // Get auth token from Supabase
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch('/api/ai-report', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Rapor oluşturulamadı');
            }

            const result = await response.json();
            setReport(result.report);
            setSaved(result.saved);
        } catch (err) {
            console.error('Report generation error:', err);
        } finally {
            setGenerating(false);
        }
    }, []);

    return { generate, generating, report, saved };
}