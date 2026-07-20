/* eslint-disable */
/**
 * Native: play Gemini Live PCM chunks via WAV data URIs.
 */

import { createAudioPlaylist, setAudioModeAsync, requestRecordingPermissionsAsync, AudioModule } from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
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
  private playlist: ReturnType<typeof createAudioPlaylist> | null = null;
  private statusListener: { remove: () => void } | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private generatedFiles: string[] = [];
  private playing = false;
  private playRequested = false;
  private destroyed = false;
  private audioModeSet = false;

  constructor(
    private onPlayingStateChange?: (isPlaying: boolean) => void,
    private onPlaybackError?: (message: string) => void,
  ) {}

  /**
   * Buffer threshold: ~0.33s of 24kHz 16-bit mono PCM.
   * Larger buffers reduce the stop-start feel from very small audio fragments.
   */
  private static BUFFER_THRESHOLD = 16_384;

  /**
   * Flush delay: how long to wait for more data before flushing a partial buffer.
   * Shorter = lower latency for the first audible tutor response.
   */
  private static FLUSH_DELAY_MS = 28;

  private reportPlaybackError(message: string, error?: unknown) {
    console.warn(message, error);
    this.onPlaybackError?.(message);
  }

  private ensurePlaylist(initialSource?: string) {
    if (this.playlist) return this.playlist;

    this.playlist = createAudioPlaylist({
      sources: initialSource ? [{ uri: initialSource }] : [],
      updateInterval: 50,
      loop: "none",
    });

    this.statusListener = this.playlist.addListener("playlistStatusUpdate", (status: any) => {
      if (this.destroyed) return;

      if (status.error) {
        const message =
          typeof status.error?.message === "string"
            ? status.error.message
            : "Live tutor audio playback failed.";
        this.playRequested = false;
        this.reportPlaybackError(message);
        return;
      }

      if (this.playRequested && status.isLoaded && !status.playing) {
        this.playRequested = false;
        try {
          this.playlist?.play();
        } catch (error) {
          this.reportPlaybackError(
            "Live tutor audio could not start.",
            error,
          );
        }
        return;
      }

      if (status.playing) {
        if (!this.playing) {
          this.playing = true;
          this.onPlayingStateChange?.(true);
        }
        if (this.idleTimer) {
          clearTimeout(this.idleTimer);
          this.idleTimer = null;
        }
        return;
      }

      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
      }
      this.idleTimer = setTimeout(() => {
        if (this.destroyed) return;
        if (!this.playlist?.playing && this.pendingBytes.length === 0 && !this.flushTimeout) {
          if (this.playing) {
            this.playing = false;
            this.onPlayingStateChange?.(false);
          }
        }
      }, 120);
    });

    return this.playlist;
  }

  private requestPlayback() {
    const playlist = this.playlist;
    if (!playlist || playlist.playing) {
      this.playRequested = false;
      return;
    }

    if (!playlist.isLoaded) {
      this.playRequested = true;
      return;
    }

    this.playRequested = false;
    try {
      playlist.play();
    } catch (error) {
      this.reportPlaybackError("Live tutor audio could not start.", error);
    }
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
    } catch (e) {
      console.warn("LivePcmPlayer: decode failed", e);
      return;
    }

    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    if (this.pendingBytes.length >= LivePcmPlayer.BUFFER_THRESHOLD) {
      void this.flushBuffer();
    } else {
      this.flushTimeout = setTimeout(() => {
        void this.flushBuffer();
      }, LivePcmPlayer.FLUSH_DELAY_MS);
    }
  }

  private async flushBuffer() {
    this.flushTimeout = null;
    if (this.destroyed || this.pendingBytes.length === 0) return;

    try {
      const pcmBytes = this.pendingBytes;
      this.pendingBytes = new Uint8Array(0);

      await this.ensureAudioMode();

      const wavB64 = pcmBytesToWavBase64(pcmBytes, GEMINI_LIVE_OUTPUT_RATE);
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) {
        throw new Error("Audio cache directory unavailable.");
      }
      const uri = `${cacheDir}gemini-live-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.wav`;
      await FileSystem.writeAsStringAsync(uri, wavB64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      this.generatedFiles.push(uri);
      const existingPlaylist = this.playlist;
      const playlist = this.ensurePlaylist(
        existingPlaylist ? undefined : uri,
      );

      if (existingPlaylist) {
        const appendedIndex = playlist.trackCount;
        const queueWasActive = playlist.playing || playlist.isBuffering;
        // The native Android bridge expects the record form even though the
        // public AudioSource type also permits a bare string.
        playlist.add({ uri });
        if (!queueWasActive) {
          playlist.skipTo(appendedIndex);
        }
      }
      this.requestPlayback();
    } catch (e) {
      this.reportPlaybackError("Live tutor audio could not be prepared.", e);
    }
  }

  private async ensureAudioMode() {
    if (this.audioModeSet) return;
    try {
      await setAudioModeAsync({
        allowsRecording: true,
        interruptionMode: "doNotMix",
        playsInSilentMode: true,
        shouldRouteThroughEarpiece: false,
      });
      this.audioModeSet = true;
    } catch (e) {
      this.reportPlaybackError("Live tutor audio mode could not start.", e);
    }
  }

  async stop() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
    this.pendingBytes = new Uint8Array(0);
    this.playRequested = false;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    try {
      this.playlist?.pause();
    } catch {
      /* noop */
    }
    try {
      this.playlist?.clear();
    } catch {
      /* noop */
    }
    for (const uri of this.generatedFiles) {
      try {
        if (uri.startsWith("file://")) {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        }
      } catch {
        /* noop */
      }
    }
    this.generatedFiles = [];
    const wasPlaying = this.playing;
    this.playing = false;
    if (wasPlaying) {
      this.onPlayingStateChange?.(false);
    }
  }

  destroy() {
    this.destroyed = true;
    void this.stop();
    try {
      this.statusListener?.remove();
    } catch {
      /* noop */
    }
    this.statusListener = null;
    try {
      this.playlist?.destroy();
    } catch {
      /* noop */
    }
    this.playlist = null;
    this.generatedFiles = [];
  }

  get isPlaying() {
    return this.playing || this.pendingBytes.length > 0 || this.flushTimeout !== null || Boolean(this.playlist?.playing);
  }
}

export async function startMicPcmStream(
  onData: (base64: string) => void,
  options: { sampleRate?: number; filterSilence?: boolean } = {},
): Promise<MicStreamHandle> {
  const sampleRate = options.sampleRate ?? 16_000;
  const filterSilence = options.filterSilence ?? true;
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

  await setAudioModeAsync({
    allowsRecording: true,
    interruptionMode: "doNotMix",
    playsInSilentMode: true,
    shouldRouteThroughEarpiece: false,
  });

  if (!AudioModule?.AudioStream) {
    throw new Error("Live audio streaming is not supported in Expo Go. Please use a development build.");
  }

  const stream = new AudioModule.AudioStream({
    sampleRate,
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
    if (filterSilence && rms < 0.004) {
      return;
    }

    const b64 = encodeBase64(bytes);
    onData(b64);
  });

  try {
    await stream.start();
  } catch (err) {
    subscription.remove();
    throw new Error("Could not start live audio input stream: " + (err instanceof Error ? err.message : String(err)));
  }

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
