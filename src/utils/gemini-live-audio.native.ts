/**
 * Native: play Gemini Live PCM chunks via WAV data URIs.
 */

import { createAudioPlayer, setAudioModeAsync, requestRecordingPermissionsAsync, AudioModule } from "expo-audio";
import { PermissionsAndroid, Platform } from "react-native";
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
  private wavQueue: { uri: string; durationMs: number }[] = [];
  private playing = false;
  private player: ReturnType<typeof createAudioPlayer> | null = null;
  private destroyed = false;

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
      console.warn("LivePcmPlayer: decode failed", e);
      return;
    }

    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    // Buffer ~0.8s of audio: 24000 Hz * 2 bytes/sample * 0.8s = 38400 bytes
    if (this.pendingBytes.length >= 38400) {
      this.flushBuffer();
    } else {
      this.flushTimeout = setTimeout(() => {
        this.flushBuffer();
      }, 150);
    }
  }

  private flushBuffer() {
    if (this.destroyed || this.pendingBytes.length === 0) return;

    try {
      const pcmBytes = this.pendingBytes;
      this.pendingBytes = new Uint8Array(0);

      const wavB64 = pcmBytesToWavBase64(pcmBytes, GEMINI_LIVE_OUTPUT_RATE);
      const uri = `data:audio/wav;base64,${wavB64}`;

      const samples = pcmBytes.length / 2;
      const durationMs = (samples / GEMINI_LIVE_OUTPUT_RATE) * 1000;

      this.wavQueue.push({ uri, durationMs });
      void this.drain();
    } catch (e) {
      console.warn("LivePcmPlayer: flush failed", e);
    }
  }

  private async drain() {
    if (this.playing || this.destroyed || this.wavQueue.length === 0) return;
    this.playing = true;

    try {
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    } catch (e) {
      console.warn("LivePcmPlayer: setAudioModeAsync failed", e);
    }

    while (this.wavQueue.length > 0 && !this.destroyed) {
      const item = this.wavQueue.shift()!;
      try {
        this.player?.remove();
        this.player = createAudioPlayer(item.uri);
        this.player.play();

        // Overlap play time slightly to prevent stutters, min 200ms
        const playTime = Math.max(200, item.durationMs - (Platform.OS === "android" ? 15 : 5));
        await new Promise((r) => setTimeout(r, playTime));
      } catch (err) {
        console.warn("LivePcmPlayer: play chunk failed", err);
      }
    }

    this.playing = false;
  }

  stop() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
    this.pendingBytes = new Uint8Array(0);
    this.wavQueue = [];
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
  let perm = await requestRecordingPermissionsAsync();

  if (!perm.granted && Platform.OS === "android") {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "Phingo English needs access to your microphone to talk to the AI Tutor.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        perm = { granted: true, status: "granted" as any, canAskAgain: true, expires: "never" } as any;
      }
    } catch (err) {
      console.warn("PermissionsAndroid failed", err);
    }
  }

  if (!perm.granted) {
    throw new Error("Microphone permission required.");
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
