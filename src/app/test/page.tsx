'use client';
import { useState, useRef } from 'react';

export default function Test() {
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const recRef = useRef<any>(null);

    const start = () => {
        const SR = window.speechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Bu tarayıcı desteklemiyor! Chrome/Edge kullan.'); return; }

        const rec = new SR();
        rec.lang = 'tr-TR';
        rec.interimResults = true;
        rec.continuous = false;

        rec.onresult = (e: any) => {
            const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
            setText(t);
        };
        rec.onend = () => setListening(false);
        recRef.current = rec;
        rec.start();
        setListening(true);
    };

    return (
        <div className="p-8">
            <button onClick={start} disabled={listening}
                className="bg-blue-500 text-white p-4 rounded-full">
                {listening ? '🔴 Dinliyorum...' : '🎤 Konuş'}
            </button>
            <p className="mt-4 text-xl">{text}</p>
        </div>
    );
}