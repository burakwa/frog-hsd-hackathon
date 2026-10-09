// lib/speech/audioVisualizer.ts

/**
 * Mikrofon ses seviyesini (0-1 arası) WebAudio API ile hesaplar.
 * useMicrophone hook'u tarafından kullanılır.
 */

export class AudioVisualizer {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private dataArray: Uint8Array | null = null;
    private animFrame: number | null = null;

    async init(stream: MediaStream): Promise<void> {
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.source = this.audioContext.createMediaStreamSource(stream);
        this.source.connect(this.analyser);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    getLevel(): number {
        if (!this.analyser || !this.dataArray) return 0;
        this.analyser.getByteFrequencyData(this.dataArray as any);
        const avg = this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;
        return avg / 255;
    }

    startLoop(callback: (level: number) => void): void {
        const loop = () => {
            callback(this.getLevel());
            this.animFrame = requestAnimationFrame(loop);
        };
        loop();
    }

    stop(): void {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.source?.disconnect();
        this.audioContext?.close();
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
    }
}
