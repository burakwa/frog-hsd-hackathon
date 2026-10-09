// lib/speech/recognition.ts
/**
 * Web Speech Recognition wrapper (tr-TR destekli)
 */

export interface SpeechRecognitionOptions {
    lang?: string;
    interimResults?: boolean;
    continuous?: boolean;
    onResult?: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
}

export function isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export function createSpeechRecognizer(options: SpeechRecognitionOptions = {}) {
    if (!isSpeechRecognitionSupported()) return null;

    const win = window as any;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    const recognizer = new SpeechRec();

    recognizer.lang = options.lang || 'tr-TR';
    recognizer.interimResults = options.interimResults ?? true;
    recognizer.continuous = options.continuous ?? false;
    recognizer.maxAlternatives = 1;

    recognizer.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = 0; i < event.results.length; i++) {
            const t = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                final += t;
            } else {
                interim += t;
            }
        }

        const cleanFinal = final.trim();
        const cleanTotal = (final + interim).trim();

        if (cleanFinal) {
            options.onResult?.(cleanFinal, true);
        } else if (cleanTotal) {
            options.onResult?.(cleanTotal, false);
        }
    };

    recognizer.onerror = (e: any) => {
        let msg = 'Bir sorun oluştu: ' + e.error;
        if (e.error === 'not-allowed') {
            msg = 'Mikrofon izni gerekli! 🔒';
        } else if (e.error === 'no-speech') {
            msg = 'Ses duyamadım, tekrar dener misin? 🎤';
        }
        options.onError?.(msg);
    };

    recognizer.onend = () => {
        options.onEnd?.();
    };

    return recognizer;
}
