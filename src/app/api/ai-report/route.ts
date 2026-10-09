// app/api/ai-report/route.ts - AI Progress Report Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateProgressReport } from '@/lib/ai/openrouter';

// Lazy initialization of Supabase client
function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
        return null;
    }
    
    return createClient(url, key);
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        if (!data.childName) {
            return NextResponse.json(
                { error: 'childName gerekli' },
                { status: 400 }
            );
        }

        // Get user from auth header
        const authHeader = request.headers.get('authorization');
        let userId = data.userId;
        
        const supabase = getSupabaseClient();
        
        if (authHeader && supabase) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user } } = await supabase.auth.getUser(token);
            if (user) userId = user.id;
        }

        const reportString = await generateProgressReport(data);
        
        // Parse the JSON report
        let reportData;
        try {
            reportData = typeof reportString === 'string' ? JSON.parse(reportString) : reportString;
        } catch {
            reportData = { summary: reportString, strengths: [], improvements: [], weeklyPlan: [] };
        }

        // Save to Supabase if user is authenticated and client available
        if (userId && supabase) {
            try {
                await supabase.from('ai_reports').insert({
                    user_id: userId,
                    child_name: data.childName,
                    report_data: reportData,
                    summary: reportData.summary,
                    strengths: reportData.strengths || [],
                    improvements: reportData.improvements || [],
                    weekly_plan: reportData.weeklyPlan || [],
                    model_used: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-5-lightning'
                });
            } catch (dbError) {
                console.error('Failed to save AI report to DB:', dbError);
                // Don't fail the request, just log
            }
        }

        return NextResponse.json({ 
            report: reportData,
            saved: !!userId
        });
    } catch (error) {
        console.error('AI Report API error:', error);
        return NextResponse.json(
            { error: 'Rapor oluşturma hatası' },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch saved reports
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authorization gerekli' },
                { status: 401 }
            );
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Supabase yapılandırılmamış' },
                { status: 503 }
            );
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        
        if (!user) {
            return NextResponse.json(
                { error: 'Geçersiz token' },
                { status: 401 }
            );
        }

        const { data: reports, error } = await supabase
            .from('ai_reports')
            .select('*')
            .eq('user_id', user.id)
            .order('generated_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        return NextResponse.json({ reports: reports || [] });
    } catch (error) {
        console.error('Fetch AI reports error:', error);
        return NextResponse.json(
            { error: 'Raporlar alınamadı' },
            { status: 500 }
        );
    }
}