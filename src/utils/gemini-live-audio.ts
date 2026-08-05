/* eslint-disable */
/**
 * Native: play Gemini Live PCM chunks via WAV data URIs.
 */

import {
  createAudioPlaylist,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
  AudioModule,
} from "expo-audio";
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

/** 16-bit mono silence, rounded to a whole sample. */
function silenceBytes(milliseconds: number): Uint8Array {
  const samples = Math.round((GEMINI_LIVE_OUTPUT_RATE * milliseconds) / 1000);
  return new Uint8Array(samples * 2);
}

export class LivePcmPlayer {
  private pendingBytes = new Uint8Array(0);
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;
  private playlist: ReturnType<typeof createAudioPlaylist> | null = null;
  private statusListener: { remove: () => void } | null = null;
  private watchdog: ReturnType<typeof setInterval> | null = null;
  private generatedFiles: string[] = [];
  private playing = false;
  private destroyed = false;
  private audioModeSet = false;
  private turnComplete = true;
  private queueDrained = true;
  private paused = false;
  private pendingWrites = 0;
  private writeChain: Promise<void> = Promise.resolve();
  private generation = 0;
  private queuedAudioBytes = 0;
  private playbackStarted = false;
  private drainCandidateSince = 0;
  private receivedFirstChunk = false;

  constructor(
    private onPlayingStateChange?: (isPlaying: boolean) => void,
    private onPlaybackError?: (message: string) => void,
  ) {}

  async prepare() {
    if (this.destroyed) return;
    await this.ensureAudioMode();
  }

  /**
   * Keep native playback away from tiny WAV boundaries. Gemini emits many
   * small PCM messages; opening one native source for each message clips the
   * first/last samples and lets Android fall behind between tracks.
   * 48000 bytes is ~1.0s of 24 kHz 16-bit mono audio, so a multi-sentence
   * reply becomes a handful of tracks instead of dozens.
   */
  private static BUFFER_THRESHOLD = 48_000;

  /**
   * Do not start until roughly 1.5s of audio is ready, unless the server has
   * already completed the turn. This gives the native playlist enough runway
   * that normal network jitter cannot drain it mid-sentence.
   */
  private static START_BUFFER_THRESHOLD = 72_000;

  /**
   * Flush delay: how long to wait for more data before flushing a partial buffer.
   * Shorter = lower latency for the first audible tutor response.
   */
  private static FLUSH_DELAY_MS = 160;

  /**
   * The watchdog reads live native properties (not cached status events) to
   * recover from playlist underruns. Android stops emitting periodic status
   * updates while playback is stopped, so event-driven recovery cannot be
   * trusted to restart a queue that ran dry mid-turn.
   */
  private static WATCHDOG_INTERVAL_MS = 100;

  private static DRAIN_CONFIRMATION_MS = 220;

  /**
   * Silence padding around each turn. Switching the native audio route from
   * mic capture to playback swallows the first few milliseconds, and ExoPlayer
   * can clip the tail of the final track — pad both edges so only silence is
   * ever lost, never speech.
   */
  private static LEAD_IN_SILENCE_MS = 140;

  private static TAIL_SILENCE_MS = 180;

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

    this.statusListener = this.playlist.addListener(
      "playlistStatusUpdate",
      (status: any) => {
        if (this.destroyed) return;

        if (status?.error) {
          const message =
            typeof status.error?.message === "string"
              ? status.error.message
              : "Live tutor audio playback failed.";
          this.reportPlaybackError(message);
          return;
        }

        if (status?.playing) {
          this.drainCandidateSince = 0;
          this.markQueueActive();
        }
      },
    );

    return this.playlist;
  }

  private ensureWatchdog() {
    if (this.watchdog || this.destroyed) return;
    this.watchdog = setInterval(() => {
      this.tick();
    }, LivePcmPlayer.WATCHDOG_INTERVAL_MS);
  }

  private clearWatchdog() {
    if (this.watchdog) {
      clearInterval(this.watchdog);
      this.watchdog = null;
    }
  }

  /** Playback may only begin once there is a runway, or once the turn ended. */
  private canStartPlayback(): boolean {
    return (
      this.turnComplete ||
      this.queuedAudioBytes >= LivePcmPlayer.START_BUFFER_THRESHOLD
    );
  }

  /**
   * Poll live playlist properties and repair stalls. ExoPlayer normally
   * auto-advances, but when the queue runs dry it parks in STATE_ENDED and
   * later-appended tracks are never reached without an explicit skip.
   */
  private tick() {
    if (this.destroyed || this.paused) return;

    const playlist = this.playlist;
    if (!playlist) {
      this.considerDrain();
      return;
    }

    let trackCount = 0;
    let currentIndex = 0;
    let playing = false;
    let isBuffering = false;
    let duration = 0;
    let currentTime = 0;
    try {
      trackCount = playlist.trackCount;
      currentIndex = playlist.currentIndex;
      playing = playlist.playing;
      isBuffering = playlist.isBuffering;
      duration = playlist.duration;
      currentTime = playlist.currentTime;
    } catch {
      return;
    }

    if (trackCount === 0) {
      this.considerDrain();
      return;
    }

    if (playing || isBuffering) {
      this.drainCandidateSince = 0;
      return;
    }

    if (!this.playbackStarted && !this.canStartPlayback()) return;

    const trackFinished = duration > 0 && currentTime >= duration - 0.05;
    const hasUnplayedTracks = currentIndex < trackCount - 1;

    if (hasUnplayedTracks) {
      this.drainCandidateSince = 0;
      this.playbackStarted = true;
      try {
        // Only advance when the current track truly reached its end, so a
        // track that is merely still loading is never skipped past.
        if (trackFinished) playlist.skipTo(currentIndex + 1);
        playlist.play();
      } catch (error) {
        this.reportPlaybackError("Live tutor audio could not continue.", error);
      }
      return;
    }

    if (!trackFinished) {
      // Sitting on the last track without having reached its end: either it is
      // still loading or playback was never kicked off. Both want play().
      this.drainCandidateSince = 0;
      this.playbackStarted = true;
      try {
        playlist.play();
      } catch (error) {
        this.reportPlaybackError("Live tutor audio could not start.", error);
      }
      return;
    }

    this.considerDrain();
  }

  /**
   * The turn is only finished when the server closed it, every byte has been
   * written to disk, and the final track has actually played to its end.
   */
  private considerDrain() {
    if (
      !this.turnComplete ||
      this.pendingWrites > 0 ||
      this.pendingBytes.length > 0 ||
      this.flushTimeout
    ) {
      this.drainCandidateSince = 0;
      return;
    }

    if (this.drainCandidateSince === 0) {
      this.drainCandidateSince = Date.now();
      return;
    }

    if (
      Date.now() - this.drainCandidateSince >=
      LivePcmPlayer.DRAIN_CONFIRMATION_MS
    ) {
      this.finishQueue();
    }
  }

  private requestPlayback() {
    if (this.destroyed || this.paused) return;
    const playlist = this.playlist;
    if (!playlist) return;

    this.ensureWatchdog();

    let alreadyPlaying = false;
    try {
      alreadyPlaying = playlist.playing;
    } catch {
      return;
    }
    if (alreadyPlaying || !this.canStartPlayback()) return;

    this.playbackStarted = true;
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

      if (this.queueDrained) {
        this.resetCompletedTurn();
      }

      // Pad the very start of a turn so an audio-route switch cannot eat the
      // tutor's first syllable.
      const leadIn =
        this.receivedFirstChunk
          ? null
          : silenceBytes(LivePcmPlayer.LEAD_IN_SILENCE_MS);
      this.receivedFirstChunk = true;
      const leadInLength = leadIn?.length ?? 0;

      const merged = new Uint8Array(
        this.pendingBytes.length + leadInLength + newBytes.length,
      );
      merged.set(this.pendingBytes, 0);
      if (leadIn) merged.set(leadIn, this.pendingBytes.length);
      merged.set(newBytes, this.pendingBytes.length + leadInLength);
      this.pendingBytes = merged;
      this.turnComplete = false;
      this.drainCandidateSince = 0;
      this.markQueueActive();
      this.ensureWatchdog();
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

  private flushBuffer(finalizePartial = false): Promise<void> {
    this.flushTimeout = null;
    if (this.destroyed || this.pendingBytes.length === 0) {
      return this.writeChain;
    }

    // PCM is 16-bit. Keep an odd trailing byte attached to the next server
    // fragment; only pad it on the final flush so no response tail is lost.
    let evenLength = this.pendingBytes.length - (this.pendingBytes.length % 2);
    if (evenLength === 0) {
      if (!finalizePartial) return this.writeChain;
      const padded = new Uint8Array(2);
      padded[0] = this.pendingBytes[0] ?? 0;
      this.pendingBytes = padded;
      evenLength = 2;
    } else if (finalizePartial && evenLength < this.pendingBytes.length) {
      const padded = new Uint8Array(evenLength + 2);
      padded.set(this.pendingBytes.subarray(0, evenLength));
      padded[evenLength] = this.pendingBytes[evenLength] ?? 0;
      this.pendingBytes = padded;
      evenLength += 2;
    }

    const pcmBytes = this.pendingBytes.slice(0, evenLength);
    this.pendingBytes = this.pendingBytes.slice(evenLength);
    const generation = this.generation;
    this.pendingWrites += 1;

    const write = this.writeChain
      .then(() => this.appendBuffer(pcmBytes, generation))
      .catch((error) => {
        this.reportPlaybackError(
          "Live tutor audio could not be prepared.",
          error,
        );
      })
      .finally(() => {
        this.pendingWrites = Math.max(0, this.pendingWrites - 1);
      });

    this.writeChain = write;
    return write;
  }

  private async appendBuffer(pcmBytes: Uint8Array, generation: number) {
    try {
      await this.ensureAudioMode();
      if (this.destroyed || generation !== this.generation) return;

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
      if (this.destroyed || generation !== this.generation) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        return;
      }
      this.generatedFiles.push(uri);
      this.queuedAudioBytes += pcmBytes.length;
      const existingPlaylist = this.playlist;
      const playlist = this.ensurePlaylist(existingPlaylist ? undefined : uri);

      if (existingPlaylist) {
        // The native Android bridge expects the record form even though the
        // public AudioSource type also permits a bare string.
        playlist.add({ uri });
        // No skipTo() here. ExoPlayer auto-advances while it is still playing,
        // and if the queue had already run dry the watchdog detects the parked
        // player from live properties and advances it. Guessing from a cached
        // status event is what previously dropped the rest of the turn.
      }
      this.requestPlayback();
      this.ensureWatchdog();
    } catch (error) {
      throw error;
    }
  }

  private markQueueActive() {
    this.queueDrained = false;
    this.drainCandidateSince = 0;
    if (!this.playing) {
      this.playing = true;
      this.onPlayingStateChange?.(true);
    }
  }

  private resetCompletedTurn() {
    this.queuedAudioBytes = 0;
    this.playbackStarted = false;
    this.drainCandidateSince = 0;
    // Reset first-chunk flag so the next turn gets leading silence again.
    this.receivedFirstChunk = false;
    try {
      this.playlist?.clear();
    } catch {
      /* noop */
    }
    const completedFiles = this.generatedFiles;
    this.generatedFiles = [];
    for (const uri of completedFiles) {
      if (uri.startsWith("file://")) {
        void FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {
          /* noop */
        });
      }
    }
  }

  private finishQueue() {
    if (this.queueDrained) return;
    this.queueDrained = true;
    this.drainCandidateSince = 0;
    this.clearWatchdog();
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

    // Append trailing silence so the closing word is never clipped by the
    // native end-of-stream transition. Only do so for a turn that produced
    // audio, otherwise an empty turn would create a stray silent track.
    if (this.receivedFirstChunk) {
      const tail = silenceBytes(LivePcmPlayer.TAIL_SILENCE_MS);
      const padded = new Uint8Array(this.pendingBytes.length + tail.length);
      padded.set(this.pendingBytes, 0);
      padded.set(tail, this.pendingBytes.length);
      this.pendingBytes = padded;
    }

    if (this.pendingBytes.length > 0) {
      await this.flushBuffer(true);
    } else {
      await this.writeChain;
    }
    if (this.destroyed) return;

    // The last buffer may have been written while turnComplete was still
    // false, so the normal append path intentionally did not start it.
    this.requestPlayback();

    if (!this.playlist) {
      this.finishQueue();
      return;
    }
    // Drain is confirmed by the watchdog once the final track truly ends.
    this.ensureWatchdog();
  }

  pause() {
    if (this.destroyed || this.paused) return;
    this.paused = true;
    this.drainCandidateSince = 0;
    try {
      this.playlist?.pause();
    } catch {
      /* noop */
    }
  }

  resume() {
    if (this.destroyed || !this.paused) return;
    this.paused = false;
    this.drainCandidateSince = 0;
    if (!this.queueDrained) {
      this.markQueueActive();
      this.requestPlayback();
    }
    this.ensureWatchdog();
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
    this.generation += 1;
    this.turnComplete = true;
    this.queueDrained = true;
    this.paused = false;
    this.clearWatchdog();
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
    this.pendingBytes = new Uint8Array(0);
    this.queuedAudioBytes = 0;
    this.playbackStarted = false;
    this.drainCandidateSince = 0;
    this.receivedFirstChunk = false;
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
    this.clearWatchdog();
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
    return !this.queueDrained;
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
          message:
            "Twino English needs access to your microphone to talk to the AI Tutor.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
          buttonNeutralText: "Ask Me Later", // fallback for some RN versions
          buttonNegativeText: "Cancel",
          buttonPositiveText: "OK",
        } as any,
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        perm = {
          granted: true,
          status: "granted" as any,
          canAskAgain: true,
          expires: "never",
        } as any;
      }
    } catch (err) {
      console.warn("PermissionsAndroid failed", err);
    }
  }

  if (!perm.granted) {
    throw new Error(
      perm.canAskAgain === false
        ? "Microphone access is blocked. Enable it for Twino in Android Settings."
        : "Microphone permission is required to speak with the tutor.",
    );
  }

  await setAudioModeAsync({
    allowsRecording: true,
    interruptionMode: "doNotMix",
    playsInSilentMode: true,
    shouldRouteThroughEarpiece: false,
  });

  if (!AudioModule?.AudioStream) {
    throw new Error(
      "Live audio streaming is not supported in Expo Go. Please use a development build.",
    );
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
    throw new Error(
      "Could not start live audio input stream: " +
        (err instanceof Error ? err.message : String(err)),
    );
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
