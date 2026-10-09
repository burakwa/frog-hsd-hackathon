// lib/ai/openrouter.ts - OpenRouter AI Client for Speech Therapy Analysis
'use server';

export interface AIAnalysisRequest {
    targetWord: string;
    spokenWord: string;
    score: number;
    errors: Array<{
        expected: string;
        spoken: string;
        position: number;
        tip: string;
    }>;
    context?: 'word' | 'sentence' | 'story';
    childAge?: number;
}

export interface DetailedPhonemeError {
    position: number;
    expectedPhoneme: string;
    spokenPhoneme: string;
    description: string;
    articulationTip: string;
}

export interface AIAnalysisResponse {
    feedback: string;
    encouragement: string;
    specificTips: string[];
    phonemeFocus: string[];
    severity: 'low' | 'medium' | 'high';
    nextSteps: string[];
    detailedErrors?: DetailedPhonemeError[];
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-5-lightning';
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

export async function analyzeSpeechWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    if (!OPENROUTER_API_KEY) {
        console.warn('OpenRouter API key not configured, returning fallback');
        return getFallbackAnalysis(request);
    }

    const prompt = buildSpeechTherapyPrompt(request);

    try {
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                'X-Title': 'FrogFriends Speech Therapy',
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: `Sen FrogFriends'in uzman konuşma terapistisisin. Çocuklara (3-12 yaş) hitap ediyorsun. 
Türkçe fonetik yapısını, yaygın artikülasyon bozukluklarını (rotasizm, sigmatizm, lambdasizm vb.) biliyorsun.
Yanıtların: Empatik, oyun temelli, anlaşılır, eylem odaklı olmalı. JSON formatında ver.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 800,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenRouter API error:', error);
            return getFallbackAnalysis(request);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
            return getFallbackAnalysis(request);
        }

        return JSON.parse(content) as AIAnalysisResponse;
    } catch (error) {
        console.error('AI Analysis error:', error);
        return getFallbackAnalysis(request);
    }
}

function buildSpeechTherapyPrompt(request: AIAnalysisRequest): string {
    const { targetWord, spokenWord, score, errors, context = 'word', childAge = 6 } = request;
    
    const isCorrect = score >= 85;
    const errorDetails = errors.length > 0 
        ? errors.map(e => `"${e.expected}" yerine "${e.spoken}" (pozisyon: ${e.position}, ${e.tip})`).join(', ')
        : 'Belirgin hata yok';

    return `Çocuk (${childAge} yaş) "${targetWord}" kelimesini söylemeye çalıştı.
Söylediği: "${spokenWord}"
Benzerlik skoru: %${Math.round(score)}
Tespit edilen hatalar: ${errorDetails}
Bağlam: ${context === 'word' ? 'Tek kelime tekrarı' : context === 'sentence' ? 'Cümle içinde' : 'Hikaye okuma'}

${isCorrect ? 'Kelime doğru söylendi.' : 'Kelime yanlış söylendi.'}

JSON formatında yanıt ver:
{
  "feedback": "Çocuğa hitap eden, ödüllendirici veya düzeltici geri bildirim (max 2 cümle)",
  "encouragement": "Motivasyon artırıcı mesaj (max 1 cümle)",
  "specificTips": ["Evde yapılabilecek 2-3 pratik önerisi"],
  "phonemeFocus": ["Odaklanılması gereken sesler (IPA formatında: /r/, /ʃ/ vb.)"],
  "severity": "low|medium|high",
  "nextSteps": ["Bir sonraki adım önerileri"],
  "detailedErrors": [
    {
      "position": 0,
      "expectedPhoneme": "/r/",
      "spokenPhoneme": "/l/",
      "description": "\"r\" sesi yerine \"l\" sesi duyuldu",
      "articulationTip": "Dilinin ucunu biraz daha arkaya çekip titreştir"
    }
  ]
}`;
}

function getFallbackAnalysis(request: AIAnalysisRequest): AIAnalysisResponse {
    const { targetWord, spokenWord, score, errors } = request;
    const isCorrect = score >= 85;
    
    if (isCorrect) {
        return {
            feedback: `Harika! "${targetWord}" kelimesini mükemmel söyledin! 🌟`,
            encouragement: 'Bu harika bir ilerleme!',
            specificTips: [
                'Bu kelimeyi gün içinde 3 kez daha tekrarlayın',
                'Farklı cümlelerde kullanarak pekiştirin'
            ],
            phonemeFocus: [],
            severity: 'low',
            nextSteps: ['Sonraki kelimeye geç', 'Aynı kategoride yeni kelimeler dene'],
            detailedErrors: []
        };
    }

    // Basit hata analizi
    const firstError = errors[0];
    const phonemeFocus = firstError ? [firstError.expected] : [];

    const detailedErrors = errors.slice(0, 3).map(e => ({
        position: e.position,
        expectedPhoneme: `/${e.expected}/`,
        spokenPhoneme: e.spoken === '-' ? '⌀' : `/${e.spoken}/`,
        description: `"${e.expected}" sesi yerine "${e.spoken === '-' ? 'hiçbir ses' : e.spoken}" duyuldu`,
        articulationTip: e.tip
    }));

    return {
        feedback: `"${targetWord}" kelimesinde küçük bir hata var. Doğrusu: "${targetWord}", sen "${spokenWord}" dedin.`,
        encouragement: 'Endırma, pratikle mükemmel olacaksın! 💪',
        specificTips: [
            `Ayna karşısında "${targetWord}" kelimesini 5 kez tekrar et`,
            `Dilini ${firstError ? firstError.tip : 'doğru pozisyona'} getirmeye odaklan`,
            'Ses çıkarken ağızını biraz daha aç'
        ],
        phonemeFocus,
        severity: score >= 60 ? 'low' : score >= 40 ? 'medium' : 'high',
        nextSteps: [
            'Bu kelimeyi 3 kez daha dene',
            'Ses tanıma çalışıp tekrar kaydet'
        ],
        detailedErrors
    };
}

export async function generateProgressReport(data: {
    childName: string;
    totalStars: number;
    level: number;
    sessions: Array<{ oyun: string; skor: number; yildiz: number; created_at: string }>;
    soundAccuracy: Array<{ sound: string; accuracy: number; status: string }>;
    badges: Array<{ ad: string; kazanildi: boolean }>;
}): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        return getFallbackReport(data);
    }

    const prompt = `Çocuk: ${data.childName}, Seviye: ${data.level}, Toplam Yıldız: ${data.totalStars}
Oynanan oyunlar: ${data.sessions.length}
Ses doğrulukları: ${data.soundAccuracy.map(s => `${s.sound}: %${s.accuracy}`).join(', ')}
Kazanılan rozetler: ${data.badges.filter(b => b.kazanildi).map(b => b.ad).join(', ') || 'Henüz yok'}

Ebeveyn/terapist için: 1 paragraf özet, 3 madde güçlü yön, 3 madde geliştirme alanı, 1 haftalık öneri. JSON formatında.`;

    try {
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: [
                    { role: 'system', content: 'Sen bir konuşma terapisti rapor uzmanısın. Türkçe, profesyonel ama anlaşılır dilde rapor yaz.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 600,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) return getFallbackReport(data);
        
        const result = await response.json();
        return result.choices?.[0]?.message?.content || getFallbackReport(data);
    } catch {
        return getFallbackReport(data);
    }
}

function getFallbackReport(data: any): string {
    return JSON.stringify({
        summary: `${data.childName}, ${data.sessions.length} seans tamamlayarak seviye ${data.level}'e ulaştı. Toplam ${data.totalStars} yıldız kazandı.`,
        strengths: [
            'Düzenli pratik alışkanlığı geliştirildi',
            'Motivasyon yüksek, oyunlar keyifle oynanıyor',
            'Temel seslerde ilerleme kaydediliyor'
        ],
        improvements: [
            'Zorlu seslerde (/r/, /ʃ/, /ç/) daha fazla pratik gerekli',
            'Cümle içinde akıcılık artırılmalı',
            'Günlük tekrar süresi uzatılabilir'
        ],
        weeklyPlan: [
            'Günlük 10-15 dk ses tekrarı',
            'Haftada 3 kez hece avı oyunu',
            'Akşamları 1 masal okuma'
        ]
    }, null, 2);
}