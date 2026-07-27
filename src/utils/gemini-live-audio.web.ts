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
  private turnComplete = true;
  private queueDrained = true;
  private paused = false;
  private pendingSchedules = 0;
  private scheduleChain: Promise<void> = Promise.resolve();
  private generation = 0;

  // ~85 ms at 24 kHz/16-bit mono. Small enough for low latency, large enough to avoid tiny-buffer overhead.
  private static BUFFER_THRESHOLD = 4_096;
  private static FLUSH_DELAY_MS = 24;
  private static START_LEAD_SECONDS = 0.035;

  constructor(
    private onPlayingStateChange?: (isPlaying: boolean) => void,
    private onPlaybackError?: (message: string) => void,
  ) {}

  async prepare() {
    if (this.destroyed) return;
    const audioCtx = this.getAudioContext();
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
  }

  private reportPlaybackError(message: string, error?: unknown) {
    console.warn(message, error);
    this.onPlaybackError?.(message);
  }

  enqueueBase64Pcm(base64: string) {
    if (this.destroyed) return;

    try {
      const newBytes = decodeBase64(base64);
      if (newBytes.length === 0) return;

      const merged = new Uint8Array(this.pendingBytes.length + newBytes.length);
      merged.set(this.pendingBytes, 0);
      merged.set(newBytes, this.pendingBytes.length);
      this.pendingBytes = merged;
      this.turnComplete = false;
      this.markQueueActive();
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
      const evenLength =
        this.pendingBytes.length - (this.pendingBytes.length % 2);
      if (evenLength <= 0) return;

      const pcmBytes = this.pendingBytes.slice(0, evenLength);
      this.pendingBytes = this.pendingBytes.slice(evenLength);
      const generation = this.generation;
      this.pendingSchedules += 1;
      const scheduled = this.scheduleChain
        .then(() => this.schedulePcm(pcmBytes, generation))
        .catch((error) => {
          this.reportPlaybackError("Live tutor audio playback failed.", error);
        })
        .finally(() => {
          this.pendingSchedules = Math.max(0, this.pendingSchedules - 1);
          this.updateIdleState();
        });
      this.scheduleChain = scheduled;
    } catch (e) {
      this.reportPlaybackError("Live tutor audio playback failed.", e);
    }
  }

  private getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass({
        sampleRate: GEMINI_LIVE_OUTPUT_RATE,
      });
    }
    return this.audioCtx;
  }

  private async schedulePcm(pcmBytes: Uint8Array, generation: number) {
    if (this.destroyed || pcmBytes.length < 2) return;

    const audioCtx = this.getAudioContext();
    if (audioCtx.state === "suspended" && !this.paused) {
      await audioCtx.resume();
    }
    if (this.destroyed || generation !== this.generation) return;

    const sampleCount = Math.floor(pcmBytes.length / 2);
    const audioBuffer = audioCtx.createBuffer(
      1,
      sampleCount,
      GEMINI_LIVE_OUTPUT_RATE,
    );
    const channel = audioBuffer.getChannelData(0);
    const view = new DataView(
      pcmBytes.buffer,
      pcmBytes.byteOffset,
      pcmBytes.byteLength,
    );

    for (let i = 0; i < sampleCount; i++) {
      channel[i] = view.getInt16(i * 2, true) / 32768;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    const startAt = Math.max(
      now + LivePcmPlayer.START_LEAD_SECONDS,
      this.nextStartTime,
    );
    this.nextStartTime = startAt + audioBuffer.duration;

    this.scheduledSources.add(source);
    source.onended = () => {
      this.scheduledSources.delete(source);
      this.updateIdleState();
    };

    this.markQueueActive();

    source.start(startAt);
    this.updateIdleState();
  }

  private updateIdleState() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    const audioCtx = this.audioCtx;
    if (
      !audioCtx ||
      this.destroyed ||
      this.paused ||
      !this.turnComplete ||
      this.pendingSchedules > 0 ||
      this.pendingBytes.length > 0 ||
      this.flushTimeout
    ) {
      return;
    }

    const delayMs =
      Math.max(0, (this.nextStartTime - audioCtx.currentTime) * 1000) + 40;
    this.idleTimer = setTimeout(() => {
      if (
        !this.destroyed &&
        !this.paused &&
        this.turnComplete &&
        this.pendingSchedules === 0 &&
        this.scheduledSources.size === 0 &&
        this.pendingBytes.length === 0 &&
        !this.flushTimeout
      ) {
        this.finishQueue();
      }
    }, delayMs);
  }

  private markQueueActive() {
    this.queueDrained = false;
    if (!this.playing) {
      this.playing = true;
      this.onPlayingStateChange?.(true);
    }
  }

  private finishQueue() {
    if (this.queueDrained) return;
    this.queueDrained = true;
    if (this.playing) {
      this.playing = false;
      this.onPlayingStateChange?.(false);
    }
  }

  async finishTurn() {
    if (this.destroyed) return;
    this.turnComplete = true;
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
    if (this.pendingBytes.length > 0) {
      this.flushBuffer();
    }
    await this.scheduleChain;
    this.updateIdleState();
  }

  pause() {
    if (this.destroyed || this.paused) return;
    this.paused = true;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    void this.audioCtx?.suspend();
  }

  resume() {
    if (this.destroyed || !this.paused) return;
    this.paused = false;
    if (!this.queueDrained) this.markQueueActive();
    void this.audioCtx?.resume().then(() => this.updateIdleState());
  }

  stop() {
    this.generation += 1;
    this.turnComplete = true;
    this.queueDrained = true;
    this.paused = false;
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
    return !this.queueDrained;
  }
}

export async function startMicPcmStream(
  onData: (base64: string) => void,
  options: { sampleRate?: number; filterSilence?: boolean } = {},
): Promise<MicStreamHandle> {
  const sampleRate = options.sampleRate ?? 16_000;
  const filterSilence = options.filterSilence ?? true;
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    throw new Error("Microphone is not supported in this browser.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioContextClass({ sampleRate });
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
    if (filterSilence && rms < 0.004) {
      return;
    }

    // Convert Float32Array to 16-bit signed PCM
    const buffer = new ArrayBuffer(inputData.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < inputData.length; i++) {
      const s = Math.max(-1, Math.min(1, inputData[i]!));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
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
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  );
}
