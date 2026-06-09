/**
 * Web: stream mic as 16 kHz PCM + play 24 kHz PCM from Gemini Live.
 */

import { GEMINI_LIVE_INPUT_RATE, GEMINI_LIVE_OUTPUT_RATE } from "../constants/gemini";

export type MicStreamHandle = {
  stop: () => void;
};

function resample(
  input: Float32Array,
  inputRate: number,
  outputRate: number,
): Float32Array {
  if (inputRate === outputRate) return input;
  const ratio = inputRate / outputRate;
  const length = Math.max(1, Math.round(input.length / ratio));
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const pos = i * ratio;
    const lo = Math.floor(pos);
    const hi = Math.min(lo + 1, input.length - 1);
    const frac = pos - lo;
    out[i] = input[lo] * (1 - frac) + input[hi] * frac;
  }
  return out;
}

function floatTo16BitPcmBase64(samples: Float32Array): string {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

export class LivePcmPlayer {
  private ctx: AudioContext | null = null;
  private nextTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];

  private ensureContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      this.ctx = new AudioContext({ sampleRate: GEMINI_LIVE_OUTPUT_RATE });
      this.nextTime = this.ctx.currentTime;
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  enqueueBase64Pcm(base64: string) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const int16 = new Int16Array(bytes.buffer);
    const floats = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      floats[i] = (int16[i] ?? 0) / 0x8000;
    }

    const buffer = ctx.createBuffer(1, floats.length, GEMINI_LIVE_OUTPUT_RATE);
    buffer.copyToChannel(floats, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const startAt = Math.max(ctx.currentTime, this.nextTime);
    source.start(startAt);
    this.nextTime = startAt + buffer.duration;

    this.activeSources.push(source);
    source.onended = () => {
      this.activeSources = this.activeSources.filter((s) => s !== source);
    };
  }

  stop() {
    for (const source of this.activeSources) {
      try {
        source.stop();
      } catch {
        /* noop */
      }
    }
    this.activeSources = [];
    if (this.ctx) {
      this.nextTime = this.ctx.currentTime;
    }
  }

  destroy() {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
  }

  get playing() {
    return this.activeSources.length > 0;
  }
}

export async function startMicPcmStream(
  onChunk: (pcmBase64: string) => void,
): Promise<MicStreamHandle> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone is not available.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
    },
  });

  const ctx = new AudioContext();
  const source = ctx.createMediaStreamSource(stream);
  const inputRate = ctx.sampleRate;

  // ScriptProcessor is widely supported; buffer 4096 samples
  const processor = ctx.createScriptProcessor(4096, 1, 1);
  processor.onaudioprocess = (event) => {
    const input = event.inputBuffer.getChannelData(0);
    const copy = new Float32Array(input.length);
    copy.set(input);
    const resampled = resample(copy, inputRate, GEMINI_LIVE_INPUT_RATE);
    onChunk(floatTo16BitPcmBase64(resampled));
  };

  source.connect(processor);
  processor.connect(ctx.destination);

  return {
    stop: () => {
      processor.disconnect();
      source.disconnect();
      stream.getTracks().forEach((t) => t.stop());
      void ctx.close();
    },
  };
}

export function isLiveAudioSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof WebSocket !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}
