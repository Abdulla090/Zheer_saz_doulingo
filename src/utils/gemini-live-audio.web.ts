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

export class LivePcmPlayer {
  private pendingBytes = new Uint8Array(0);
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;
  private audioCtx: AudioContext | null = null;
  private scheduledSources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;
  private playing = false;
  private destroyed = false;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;

  // ~85 ms at 24 kHz/16-bit mono. Small enough for low latency, large enough to avoid tiny-buffer overhead.
  private static BUFFER_THRESHOLD = 4_096;
  private static FLUSH_DELAY_MS = 24;
  private static START_LEAD_SECONDS = 0.035;

  constructor(private onPlayingStateChange?: (isPlaying: boolean) => void) {}

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
    this.flushTimeout = null;
    if (this.destroyed || this.pendingBytes.length === 0) return;

    try {
      const evenLength = this.pendingBytes.length - (this.pendingBytes.length % 2);
      if (evenLength <= 0) return;

      const pcmBytes = this.pendingBytes.slice(0, evenLength);
      this.pendingBytes = this.pendingBytes.slice(evenLength);
      void this.schedulePcm(pcmBytes);
    } catch (e) {
      console.warn("LivePcmPlayer (Web): schedule failed", e);
    }
  }

  private getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: GEMINI_LIVE_OUTPUT_RATE });
    }
    return this.audioCtx;
  }

  private async schedulePcm(pcmBytes: Uint8Array) {
    if (this.destroyed || pcmBytes.length < 2) return;

    const audioCtx = this.getAudioContext();
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    const sampleCount = Math.floor(pcmBytes.length / 2);
    const audioBuffer = audioCtx.createBuffer(1, sampleCount, GEMINI_LIVE_OUTPUT_RATE);
    const channel = audioBuffer.getChannelData(0);
    const view = new DataView(pcmBytes.buffer, pcmBytes.byteOffset, pcmBytes.byteLength);

    for (let i = 0; i < sampleCount; i++) {
      channel[i] = view.getInt16(i * 2, true) / 32768;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    const startAt = Math.max(now + LivePcmPlayer.START_LEAD_SECONDS, this.nextStartTime);
    this.nextStartTime = startAt + audioBuffer.duration;

    this.scheduledSources.add(source);
    source.onended = () => {
      this.scheduledSources.delete(source);
      this.updateIdleState();
    };

    if (!this.playing) {
      this.playing = true;
      this.onPlayingStateChange?.(true);
    }

    source.start(startAt);
    this.updateIdleState();
  }

  private updateIdleState() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    const audioCtx = this.audioCtx;
    if (!audioCtx || this.destroyed) return;

    const delayMs = Math.max(0, (this.nextStartTime - audioCtx.currentTime) * 1000) + 40;
    this.idleTimer = setTimeout(() => {
      if (this.destroyed) return;
      if (this.scheduledSources.size === 0 && this.pendingBytes.length === 0 && !this.flushTimeout) {
        this.playing = false;
        this.onPlayingStateChange?.(false);
      }
    }, delayMs);
  }

  stop() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
    this.pendingBytes = new Uint8Array(0);
    this.nextStartTime = this.audioCtx?.currentTime ?? 0;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    try {
      for (const source of this.scheduledSources) {
        try {
          source.stop();
        } catch {}
      }
    } catch {}
    this.scheduledSources.clear();
    const wasPlaying = this.playing;
    this.playing = false;
    if (wasPlaying) {
      this.onPlayingStateChange?.(false);
    }
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    try {
      void this.audioCtx?.close();
    } catch {}
    this.audioCtx = null;
  }

  get isPlaying() {
    return this.playing || this.scheduledSources.size > 0 || this.pendingBytes.length > 0 || this.flushTimeout !== null;
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
    
    // Calculate RMS to filter background noise
    let sum = 0;
    for (let i = 0; i < inputData.length; i++) {
      sum += inputData[i] * inputData[i];
    }
    const rms = Math.sqrt(sum / inputData.length);
    
    // Threshold of 0.004 filters quiet room noise
    if (rms < 0.004) {
      return;
    }

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
