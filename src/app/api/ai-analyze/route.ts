// app/api/ai-analyze/route.ts - AI Speech Analysis Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeechWithAI, AIAnalysisRequest, AIAnalysisResponse } from '@/lib/ai/openrouter';

export async function POST(request: NextRequest) {
    try {
        const body: AIAnalysisRequest = await request.json();
        
        // Validation
        if (!body.targetWord || !body.spokenWord) {
            return NextResponse.json(
                { error: 'targetWord ve spokenWord gerekli' },
                { status: 400 }
            );
        }

        const result = await analyzeSpeechWithAI(body);
        return NextResponse.json(result);
    } catch (error) {
        console.error('AI Analyze API error:', error);
        return NextResponse.json(
            { error: 'AI analiz hatası' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ 
        message: 'AI Speech Analysis API', 
        model: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-5-lightning',
        status: 'ready'
    });
}