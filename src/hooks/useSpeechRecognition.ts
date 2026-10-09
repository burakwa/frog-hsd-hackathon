// hooks/useSpeechRecognition.ts
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeechRecognition() {
    const [transcript, setTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);
    const recRef = useRef<any>(null);

    useEffect(() => {
        const supported =
            typeof window !== 'undefined' &&
            !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
        setIsSupported(supported);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setFinalTranscript('');
    }, []);

    const start = useCallback(() => {
        const win = typeof window !== 'undefined' ? (window as any) : null;
        const SR = win?.SpeechRecognition || win?.webkitSpeechRecognition;
        
        if (!SR) {
            setError('Bu tarayıcı ses tanımayı desteklemiyor. Lütfen Chrome, Edge veya Safari kullanın.');
            return;
        }

        // HTTPS kontrolü (localhost hariç)
        if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            setError('Ses tanıma için HTTPS gerekli. Yerel test için localhost kullanın.');
            return;
        }

        setError(null);
        setTranscript('');
        setFinalTranscript('');

        try {
            if (recRef.current) {
                try {
                    recRef.current.abort();
                } catch {
                    // Ignore abort error
                }
            }

            const rec = new SR();
            rec.lang = 'tr-TR';
            rec.interimResults = true;
            rec.continuous = false;
            rec.maxAlternatives = 1;

            rec.onresult = (e: any) => {
                let interim = '';
                let final = '';
                for (let i = 0; i < e.results.length; i++) {
                    const t = e.results[i][0].transcript;
                    if (e.results[i].isFinal) {
                        final += t;
                    } else {
                        interim += t;
                    }
                }
                const cleanFinal = final.trim();
                const cleanTotal = (final + interim).trim();

                if (cleanFinal) {
                    setFinalTranscript(cleanFinal);
                }
                setTranscript(cleanTotal);
            };

            rec.onerror = (e: any) => {
                let errorMessage = 'Bir sorun oluştu';
                if (e.error === 'not-allowed') {
                    errorMessage = 'Mikrofon izni gerekli! Tarayıcı adres çubuğundaki kilit ikonuna tıklayıp "İzin ver" seçin. 🔒';
                } else if (e.error === 'no-speech') {
                    errorMessage = 'Ses duyamadım, tekrar dener misin? 🎤';
                } else if (e.error === 'network') {
                    errorMessage = 'Ağ hatası: İnternet bağlantınızı kontrol edin. Production için HTTPS gereklidir.';
                } else if (e.error === 'service-not-allowed') {
                    errorMessage = 'Ses tanıma servisi kullanılamıyor. Chrome/Edge/Safari güncel sürüm kullanın.';
                } else if (e.error === 'aborted') {
                    errorMessage = 'Dinleme iptal edildi.';
                } else {
                    errorMessage = `Ses tanıma hatası: ${e.error}`;
                }
                setError(errorMessage);
                setIsListening(false);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            recRef.current = rec;
            rec.start();
            setIsListening(true);
        } catch (err: any) {
            setError('Mikrofon başlatılamadı: ' + (err?.message || err));
            setIsListening(false);
        }
    }, []);

    const stop = useCallback(() => {
        try {
            recRef.current?.stop();
        } catch {
            // Ignore stop error
        }
    }, []);

    useEffect(() => {
        return () => {
            try {
                recRef.current?.abort();
            } catch {
                // Ignore abort error
            }
        };
    }, []);

    return {
        transcript,
        finalTranscript,
        isListening,
        error,
        isSupported,
        start,
        stop,
        startListening: start,
        stopListening: stop,
        resetTranscript,
    };
}