import { GEMINI_LIVE_OUTPUT_RATE } from "../constants/gemini";

export type MicStreamHandle = {
  stop: () => void;
};

function decodeBase64(b64: string): Uint8Array {
  const binary = window.atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return window.btoa(binary);
}

function pcmBytesToWavBase64(pcmBytes: Uint8Array, sampleRate: number): string {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const dataSize = pcmBytes.length;

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  const wav = new Uint8Array(44 + dataSize);
  wav.set(new Uint8Array(header), 0);
  wav.set(pcmBytes, 44);
  return encodeBase64(wav);
}

export class LivePcmPlayer {
  private pendingBytes = new Uint8Array(0);
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;
  private wavQueue: string[] = [];
  private playing = false;
  private destroyed = false;
  private currentAudio: HTMLAudioElement | null = null;

  private static BUFFER_THRESHOLD = 24_000;
  private static FLUSH_DELAY_MS = 80;

  enqueueBase64Pcm(base64: string) {
    if (this.destroyed) return;

    try {
      const newBytes = decodeBase64(base64);
      if (newBytes.length === 0) return;

      const merged = new Uint8Array(this.pendingBytes.length + newBytes.length);
      merged.set(this.pendingBytes, 0);
      merged.set(newBytes, this.pendingBytes.length);
      this.pendingBytes = merged;
    } catch (e) {
      console.warn("LivePcmPlayer (Web): decode failed", e);
      return;
    }

    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    if (this.pendingBytes.length >= LivePcmPlayer.BUFFER_THRESHOLD) {
      this.flushBuffer();
    } else {
      this.flushTimeout = setTimeout(() => {
        this.flushBuffer();
      }, LivePcmPlayer.FLUSH_DELAY_MS);
    }
  }

  private flushBuffer() {
    if (this.destroyed || this.pendingBytes.length === 0) return;

    try {
      const pcmBytes = this.pendingBytes;
      this.pendingBytes = new Uint8Array(0);

      const wavB64 = pcmBytesToWavBase64(pcmBytes, GEMINI_LIVE_OUTPUT_RATE);
      const uri = `data:audio/wav;base64,${wavB64}`;

      this.wavQueue.push(uri);
      void this.drain();
    } catch (e) {
      console.warn("LivePcmPlayer (Web): flush failed", e);
    }
  }

  private async drain() {
    if (this.playing || this.destroyed || this.wavQueue.length === 0) return;
    this.playing = true;

    while (this.wavQueue.length > 0 && !this.destroyed) {
      const uri = this.wavQueue.shift()!;
      try {
        await this.playOneChunk(uri);
      } catch (err) {
        console.warn("LivePcmPlayer (Web): play chunk failed", err);
      }
    }

    this.playing = false;

    if (this.wavQueue.length > 0 && !this.destroyed) {
      void this.drain();
    }
  }

  private playOneChunk(uri: string): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.destroyed) {
        resolve();
        return;
      }

      const audio = new Audio(uri);
      this.currentAudio = audio;

      let resolved = false;
      const finish = () => {
        if (resolved) return;
        resolved = true;
        this.currentAudio = null;
        resolve();
      };

      audio.onended = finish;
      audio.onerror = finish;

      audio.play().catch((e) => {
        console.warn("LivePcmPlayer (Web): autoplay blocked or failed", e);
        finish();
      });

      // Safety timeout: WAV chunks are usually < 4s, resolve after 6s max
      setTimeout(() => {
        if (!resolved) {
          console.warn("LivePcmPlayer (Web): safety timeout triggered");
          finish();
        }
      }, 6000);
    });
  }

  stop() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
    this.pendingBytes = new Uint8Array(0);
    this.wavQueue = [];
    try {
      this.currentAudio?.pause();
    } catch {}
    this.currentAudio = null;
    this.playing = false;
  }

  destroy() {
    this.destroyed = true;
    this.stop();
  }

  get isPlaying() {
    return this.playing;
  }
}

export async function startMicPcmStream(
  onData: (base64: string) => void
): Promise<MicStreamHandle> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone is not supported in this browser.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioContextClass({ sampleRate: 16000 });
  const source = audioCtx.createMediaStreamSource(stream);
  
  // Use 2048 buffer size, 1 input channel, 1 output channel
  const processor = audioCtx.createScriptProcessor(2048, 1, 1);

  source.connect(processor);
  processor.connect(audioCtx.destination);

  processor.onaudioprocess = (e) => {
    const inputData = e.inputBuffer.getChannelData(0);
    
    // Convert Float32Array to 16-bit signed PCM
    const buffer = new ArrayBuffer(inputData.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < inputData.length; i++) {
      const s = Math.max(-1, Math.min(1, inputData[i]!));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    const bytes = new Uint8Array(buffer);
    const b64 = encodeBase64(bytes);
    onData(b64);
  };

  return {
    stop: () => {
      try {
        processor.disconnect();
        source.disconnect();
        stream.getTracks().forEach((track) => track.stop());
        void audioCtx.close();
      } catch (err) {
        console.warn("startMicPcmStream (Web) stop failed:", err);
      }
    },
  };
}

export function isLiveAudioSupported(): boolean {
  return typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia;
}
