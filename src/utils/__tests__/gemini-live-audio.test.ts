import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
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

    jest.advanceTimersByTime(30);
    await flushPromises();
    emitStatus({
      playing: false,
      didJustFinish: true,
      currentIndex: 0,
      trackCount: 1,
      currentTime: 1,
      duration: 1,
    });
    jest.advanceTimersByTime(150);
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
    jest.advanceTimersByTime(100);

    expect(states).toEqual([true, false]);
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
    jest.advanceTimersByTime(150);
    expect(states).toEqual([true]);

    player.resume();
    jest.advanceTimersByTime(100);
    expect(states).toEqual([true, false]);
    player.destroy();
  });
});
