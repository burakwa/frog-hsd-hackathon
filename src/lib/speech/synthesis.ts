// lib/speech/synthesis.ts
/**
 * Web Speech API SpeechSynthesis motoru (tr-TR destekli)
 */

export class SpeechEngine {
    private isSpeaking = false;

    speak(
        text: string,
        options: {
            rate?: number;
            pitch?: number;
            onStart?: () => void;
            onEnd?: () => void;
            onError?: (err: any) => void;
        } = {}
    ): void {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = options.rate ?? 0.85; // Çocuklar için anlaşılır tempo
        utterance.pitch = options.pitch ?? 1.1; // Dost canlısı ton

        const voices = window.speechSynthesis.getVoices();
        const trVoice = voices.find(v => v.lang.replace('_', '-').toLowerCase().startsWith('tr'));
        if (trVoice) {
            utterance.voice = trVoice;
        }

        utterance.onstart = () => {
            this.isSpeaking = true;
            options.onStart?.();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            options.onEnd?.();
        };

        utterance.onerror = (e) => {
            this.isSpeaking = false;
            options.onError?.(e);
        };

        window.speechSynthesis.speak(utterance);
    }

    stop(): void {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            this.isSpeaking = false;
        }
    }

    getSpeakingStatus(): boolean {
        return typeof window !== 'undefined' && window.speechSynthesis?.speaking ? true : this.isSpeaking;
    }
}

export const speechEngine = new SpeechEngine();
