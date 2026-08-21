import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import * as FileSystem from "expo-file-system/legacy";
import { LivePcmPlayer } from "../gemini-live-audio";

let mockStatusListener: ((status: Record<string, unknown>) => void) | null =
  null;

const mockPlaylist = {
  playing: false,
  isLoaded: true,
  isBuffering: false,
  currentIndex: 0,
  trackCount: 0,
  currentTime: 0,
  duration: 0,
  play: jest.fn(() => {
    mockPlaylist.playing = true;
  }),
  pause: jest.fn(() => {
    mockPlaylist.playing = false;
  }),
  clear: jest.fn(() => {
    mockPlaylist.playing = false;
    mockPlaylist.currentIndex = 0;
    mockPlaylist.trackCount = 0;
  }),
  add: jest.fn(() => {
    mockPlaylist.trackCount += 1;
  }),
  skipTo: jest.fn((index: number) => {
    mockPlaylist.currentIndex = index;
  }),
  destroy: jest.fn(),
  addListener: jest.fn(
    (_event: string, listener: (status: Record<string, unknown>) => void) => {
      mockStatusListener = listener;
      return { remove: jest.fn() };
    },
  ),
};

jest.mock("expo-audio", () => ({
  createAudioPlaylist: jest.fn(({ sources = [] }) => {
    mockPlaylist.trackCount = sources.length;
    return mockPlaylist;
  }),
  setAudioModeAsync: jest.fn(async () => undefined),
  requestRecordingPermissionsAsync: jest.fn(),
  AudioModule: {},
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///cache/",
  EncodingType: { Base64: "base64" },
  writeAsStringAsync: jest.fn(async () => undefined),
  deleteAsync: jest.fn(async () => undefined),
}));

function emitStatus(overrides: Record<string, unknown>) {
  const status = {
    playing: false,
    isLoaded: true,
    isBuffering: false,
    currentIndex: mockPlaylist.currentIndex,
    trackCount: mockPlaylist.trackCount,
    currentTime: 0,
    duration: 1,
    didJustFinish: false,
    ...overrides,
  };
  Object.assign(mockPlaylist, status);
  mockStatusListener?.(status);
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

function pcmBase64(bytes: number | number[]): string {
  const values =
    typeof bytes === "number" ? new Uint8Array(bytes) : Uint8Array.from(bytes);
  let binary = "";
  for (const value of values) binary += String.fromCharCode(value);
  return globalThis.btoa(binary);
}

function decodeBase64(value: string): Uint8Array {
  const binary = globalThis.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

describe("LivePcmPlayer turn draining", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockStatusListener = null;
    Object.assign(mockPlaylist, {
      playing: false,
      isLoaded: true,
      isBuffering: false,
      currentIndex: 0,
      trackCount: 0,
      currentTime: 0,
      duration: 0,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not report idle between chunks before the Gemini turn completes", async () => {
    const states: boolean[] = [];
    const player = new LivePcmPlayer((isPlaying) => states.push(isPlaying));

    player.enqueueBase64Pcm("AAAA");
    expect(states).toEqual([true]);

    jest.advanceTimersByTime(200);
    await flushPromises();
    emitStatus({
      playing: false,
      didJustFinish: true,
      currentIndex: 0,
      trackCount: 1,
      currentTime: 1,
      duration: 1,
    });
    jest.advanceTimersByTime(200);
    expect(states).toEqual([true]);

    player.enqueueBase64Pcm("AAAA");
    await player.finishTurn();
    emitStatus({
      playing: false,
      didJustFinish: true,
      currentIndex: 1,
      trackCount: 2,
      currentTime: 1,
      duration: 1,
    });
    jest.advanceTimersByTime(200);

    expect(states).toEqual([true, false]);
    player.destroy();
  });

  it("prebuffers the opening instead of starting a tiny native source", async () => {
    const player = new LivePcmPlayer();

    player.enqueueBase64Pcm(pcmBase64(32_768));
    await flushPromises();

    expect(mockPlaylist.play).not.toHaveBeenCalled();

    await player.finishTurn();

    expect(mockPlaylist.play).toHaveBeenCalledTimes(1);
    player.destroy();
  });

  it("keeps the first and final PCM bytes in the turn WAV", async () => {
    const player = new LivePcmPlayer();

    player.enqueueBase64Pcm(pcmBase64([0x01, 0x02]));
    player.enqueueBase64Pcm(pcmBase64([0x7d, 0x7e]));
    await player.finishTurn();

    const writeAsStringAsync = FileSystem.writeAsStringAsync as unknown as jest.Mock;
    const wavBase64 = writeAsStringAsync.mock.calls[0]?.[1] as string;
    const wav = decodeBase64(wavBase64);

    const pcm = wav.slice(44);
    const leadInBytes = 24_000 * 2 * 0.14;
    expect(Array.from(pcm.slice(leadInBytes, leadInBytes + 4))).toEqual([
      0x01,
      0x02,
      0x7d,
      0x7e,
    ]);
    player.destroy();
  });

  it("keeps a completed queue paused until playback is resumed", async () => {
    const states: boolean[] = [];
    const player = new LivePcmPlayer((isPlaying) => states.push(isPlaying));

    player.enqueueBase64Pcm("AAAA");
    player.pause();
    await player.finishTurn();
    emitStatus({
      playing: false,
      didJustFinish: true,
      currentIndex: 0,
      trackCount: 1,
      currentTime: 1,
      duration: 1,
    });
    jest.advanceTimersByTime(200);
    expect(states).toEqual([true]);

    player.resume();
    jest.advanceTimersByTime(200);
    expect(states).toEqual([true, false]);
    player.destroy();
  });

  it("does not skip the opening source while the playlist is still loading", async () => {
    const player = new LivePcmPlayer();
    mockPlaylist.isLoaded = false;

    player.enqueueBase64Pcm("AAAA");
    jest.advanceTimersByTime(200);
    await flushPromises();

    player.enqueueBase64Pcm("AAAA");
    await player.finishTurn();

    expect(mockPlaylist.trackCount).toBe(2);
    expect(mockPlaylist.skipTo).not.toHaveBeenCalled();
    player.destroy();
  });

  it("invalidates a completed-track status when a final source is appended", async () => {
    const states: boolean[] = [];
    const player = new LivePcmPlayer((isPlaying) => states.push(isPlaying));

    player.enqueueBase64Pcm("AAAA");
    jest.advanceTimersByTime(200);
    await flushPromises();
    emitStatus({
      playing: false,
      didJustFinish: true,
      currentIndex: 0,
      trackCount: 1,
      currentTime: 1,
      duration: 1,
    });

    player.enqueueBase64Pcm("AAAA");
    await player.finishTurn();
    jest.advanceTimersByTime(150);

    expect(mockPlaylist.skipTo).toHaveBeenCalledWith(1);
    expect(states).toEqual([true]);

    emitStatus({
      playing: false,
      didJustFinish: true,
      currentIndex: 1,
      trackCount: 2,
      currentTime: 1,
      duration: 1,
    });
    jest.advanceTimersByTime(200);
    expect(states).toEqual([true, false]);
    player.destroy();
  });
});
