/* eslint-disable */
/**
 * Native: play Gemini Live PCM chunks via WAV data URIs.
 */

import { createAudioPlayer, setAudioModeAsync, requestRecordingPermissionsAsync, AudioModule } from "expo-audio";
import { PermissionsAndroid, Platform } from "react-native";
import { GEMINI_LIVE_OUTPUT_RATE } from "../constants/gemini";

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
  private wavQueue: string[] = []; // data URIs
  private playing = false;
  private destroyed = false;
  private audioModeSet = false;

  // Double-buffered player pool: while playerA plays, playerB preloads
  private playerA: ReturnType<typeof createAudioPlayer> | null = null;
  private playerB: ReturnType<typeof createAudioPlayer> | null = null;
  private activeSlot: "A" | "B" = "A";
  private listenerSub: { remove: () => void } | null = null;

  /**
   * Buffer threshold: ~0.5s of 24kHz 16-bit mono PCM = 24000 samples/s * 2 bytes * 0.5s = 24000 bytes.
   * Larger buffers → fewer player swaps → smoother playback.
   */
  private static BUFFER_THRESHOLD = 24_000;

  /**
   * Flush delay: how long to wait for more data before flushing a partial buffer.
   * Shorter = lower latency for the very first chunk. Longer = fewer tiny chunks.
   */
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
      console.warn("LivePcmPlayer: decode failed", e);
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
      const pcmBytes = this.pendingBytes;
      this.pendingBytes = new Uint8Array(0);

      const wavB64 = pcmBytesToWavBase64(pcmBytes, GEMINI_LIVE_OUTPUT_RATE);
      const uri = `data:audio/wav;base64,${wavB64}`;

      this.wavQueue.push(uri);
      void this.drain();
    } catch (e) {
      console.warn("LivePcmPlayer: flush failed", e);
    }
  }

  private async ensureAudioMode() {
    if (this.audioModeSet) return;
    try {
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      this.audioModeSet = true;
    } catch (e) {
      console.warn("LivePcmPlayer: setAudioModeAsync failed", e);
    }
  }

  private getActivePlayer(): ReturnType<typeof createAudioPlayer> {
    if (this.activeSlot === "A") {
      if (!this.playerA) this.playerA = createAudioPlayer("");
      return this.playerA;
    } else {
      if (!this.playerB) this.playerB = createAudioPlayer("");
      return this.playerB;
    }
  }

  private swapSlot() {
    this.activeSlot = this.activeSlot === "A" ? "B" : "A";
  }

  private async drain() {
    if (this.playing || this.destroyed || this.wavQueue.length === 0) return;
    this.playing = true;

    await this.ensureAudioMode();

    while (this.wavQueue.length > 0 && !this.destroyed) {
      const uri = this.wavQueue.shift()!;
      try {
        await this.playOneChunk(uri);
      } catch (err) {
        console.warn("LivePcmPlayer: play chunk failed", err);
      }
    }

    this.playing = false;

    // Check if more data arrived while we were playing
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

      const player = this.getActivePlayer();

      // Clean up previous listener
      if (this.listenerSub) {
        this.listenerSub.remove();
        this.listenerSub = null;
      }

      let resolved = false;
      const finish = () => {
        if (resolved) return;
        resolved = true;
        if (this.listenerSub) {
          this.listenerSub.remove();
          this.listenerSub = null;
        }
        this.swapSlot();
        resolve();
      };

      // Listen for playback completion via expo-audio event
      this.listenerSub = player.addListener("playbackStatusUpdate", (status: any) => {
        if (status.didJustFinish || (status.currentTime > 0 && !status.playing && !status.isBuffering)) {
          finish();
        }
      });

      try {
        player.replace(uri);
        player.play();
      } catch {
        // If replace fails, recreate the player
        try {
          if (this.activeSlot === "A") {
            this.playerA?.remove();
            this.playerA = createAudioPlayer(uri);
            this.playerA.play();

            if (this.listenerSub) this.listenerSub.remove();
            this.listenerSub = this.playerA.addListener("playbackStatusUpdate", (status: any) => {
              if (status.didJustFinish || (status.currentTime > 0 && !status.playing && !status.isBuffering)) {
                finish();
              }
            });
          } else {
            this.playerB?.remove();
            this.playerB = createAudioPlayer(uri);
            this.playerB.play();

            if (this.listenerSub) this.listenerSub.remove();
            this.listenerSub = this.playerB.addListener("playbackStatusUpdate", (status: any) => {
              if (status.didJustFinish || (status.currentTime > 0 && !status.playing && !status.isBuffering)) {
                finish();
              }
            });
          }
        } catch (innerErr) {
          console.warn("LivePcmPlayer: recreate failed", innerErr);
          finish();
        }
      }

      // Safety timeout: if playback event never fires, resolve after generous duration
      // This prevents the queue from permanently stalling
      setTimeout(() => {
        if (!resolved) {
          console.warn("LivePcmPlayer: safety timeout triggered for chunk");
          finish();
        }
      }, 8000);
    });
  }

  stop() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
    this.pendingBytes = new Uint8Array(0);
    this.wavQueue = [];
    if (this.listenerSub) {
      this.listenerSub.remove();
      this.listenerSub = null;
    }
    try {
      this.playerA?.pause();
    } catch {
      /* noop */
    }
    try {
      this.playerB?.pause();
    } catch {
      /* noop */
    }
    this.playing = false;
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    try {
      this.playerA?.remove();
    } catch {
      /* noop */
    }
    try {
      this.playerB?.remove();
    } catch {
      /* noop */
    }
    this.playerA = null;
    this.playerB = null;
  }

  get isPlaying() {
    return this.playing || this.wavQueue.length > 0 || this.pendingBytes.length > 0 || this.flushTimeout !== null;
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
          message: "Twino English needs access to your microphone to talk to the AI Tutor.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
          buttonNeutralText: "Ask Me Later", // fallback for some RN versions
          buttonNegativeText: "Cancel",
          buttonPositiveText: "OK"
        } as any
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

    // Calculate RMS to filter ambient background noise and quiet spillover
    let sum = 0;
    const samples = bytes.length / 2;
    for (let i = 0; i < samples; i++) {
      const byte1 = bytes[i * 2] || 0;
      const byte2 = bytes[i * 2 + 1] || 0;
      let val = (byte2 << 8) | byte1;
      if (val & 0x8000) val |= ~0xffff; // Convert to signed 16-bit
      const norm = val / 32768;
      sum += norm * norm;
    }
    const rms = Math.sqrt(sum / samples);

    // Threshold of 0.004 filters silent rooms and low echoes
    if (rms < 0.004) {
      return;
    }

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
