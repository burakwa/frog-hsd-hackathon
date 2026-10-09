// app/api/analiz/route.ts
import { NextResponse } from 'next/server';
import { analyze } from '@/lib/comparison/analyze';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { expected, spoken } = body;

        if (typeof expected !== 'string' || typeof spoken !== 'string') {
            return NextResponse.json(
                { error: 'expected ve spoken dizgeleri zorunludur' },
                { status: 400 }
            );
        }

        const result = analyze(expected, spoken);
        let stars = 1;
        if (result.score >= 90) stars = 3;
        else if (result.score >= 65) stars = 2;

        return NextResponse.json({
            success: true,
            ...result,
            stars,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Analiz sırasında hata oluştu';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
