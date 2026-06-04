/**
 * Native: play Gemini Live PCM chunks via WAV data URIs.
 */

import { createAudioPlayer, setAudioModeAsync, requestRecordingPermissionsAsync, AudioModule } from "expo-audio";
import { GEMINI_LIVE_OUTPUT_RATE } from "@/constants/gemini";

export type MicStreamHandle = {
  stop: () => void;
};

function decodeBase64(b64: string): Uint8Array {
  if (typeof globalThis.atob === "function") {
    const binary = globalThis.atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  throw new Error("Base64 decode unavailable.");
}

function encodeBase64(bytes: Uint8Array): string {
  if (typeof globalThis.btoa === "function") {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    return globalThis.btoa(binary);
  }
  throw new Error("Base64 encode unavailable.");
}

function pcmBase64ToWavBase64(pcmBase64: string, sampleRate: number): string {
  const pcmBytes = decodeBase64(pcmBase64);
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
  private queue: string[] = [];
  private playing = false;
  private player: ReturnType<typeof createAudioPlayer> | null = null;
  private destroyed = false;

  enqueueBase64Pcm(base64: string) {
    if (this.destroyed) return;
    this.queue.push(base64);
    void this.drain();
  }

  private async drain() {
    if (this.playing || this.destroyed || this.queue.length === 0) return;
    this.playing = true;

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });

    while (this.queue.length > 0 && !this.destroyed) {
      const chunk = this.queue.shift()!;
      try {
        const wavB64 = pcmBase64ToWavBase64(chunk, GEMINI_LIVE_OUTPUT_RATE);
        const uri = `data:audio/wav;base64,${wavB64}`;
        this.player?.remove();
        this.player = createAudioPlayer(uri);
        this.player.play();

        const samples = decodeBase64(chunk).length / 2;
        const durationMs = Math.max(300, (samples / GEMINI_LIVE_OUTPUT_RATE) * 1000);
        await new Promise((r) => setTimeout(r, durationMs + 80));
      } catch {
        /* skip chunk */
      }
    }

    this.playing = false;
  }

  stop() {
    this.queue = [];
    try {
      this.player?.pause();
    } catch {
      /* noop */
    }
    this.playing = false;
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    try {
      this.player?.remove();
    } catch {
      /* noop */
    }
    this.player = null;
  }

  get isPlaying() {
    return this.playing;
  }
}

export async function startMicPcmStream(
  onData: (base64: string) => void
): Promise<MicStreamHandle> {
  const perm = await requestRecordingPermissionsAsync();
  if (!perm.granted) {
    throw new Error("Microphone permission denied.");
  }

  await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });

  const stream = new AudioModule.AudioStream({
    sampleRate: 16000,
    channels: 1,
    encoding: "int16",
  });

  const subscription = stream.addListener("audioStreamBuffer", (event) => {
    const bytes = new Uint8Array(event.data);
    const b64 = encodeBase64(bytes);
    onData(b64);
  });

  await stream.start();

  return {
    stop: () => {
      try {
        stream.stop();
      } catch {
        /* ignore */
      }
      subscription.remove();
    },
  };
}

export function isLiveAudioSupported(): boolean {
  return true;
}
