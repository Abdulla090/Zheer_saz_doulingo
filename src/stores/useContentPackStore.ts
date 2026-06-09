/**
 * useContentPackStore — tracks download state for Street & Kids content packs.
 *
 * Normal English is always available.  Street and Kids are "downloadable"
 * (simulated — all data is bundled, but we gate access behind a persisted flag
 * for a modern app-store-style UX).
 */

import type { LessonPathMode } from "../data/types";
import { appStorage } from "../lib/app-storage";
import { create } from "zustand";

const STORAGE_KEY = "phingo.content-packs";

export type PackId = "street" | "kids";
export type PackStatus = "not_downloaded" | "downloading" | "downloaded";

export interface ContentPackMeta {
  id: PackId;
  titleKey: string;
  descriptionKey: string;
  sizeLabel: string;
  unitCount: number;
  lessonCount: number;
  accentColor: string;
  accentColorLight: string;
}

export const CONTENT_PACKS: ContentPackMeta[] = [
  {
    id: "street",
    titleKey: "Street English",
    descriptionKey: "Real-world conversations, slang & daily English for the streets",
    sizeLabel: "24 MB",
    unitCount: 12,
    lessonCount: 120,
    accentColor: "#1CB0F6",
    accentColorLight: "#E0F4FE",
  },
  {
    id: "kids",
    titleKey: "Kids English",
    descriptionKey: "Fun interactive lessons with games, animals & colors for children",
    sizeLabel: "18 MB",
    unitCount: 5,
    lessonCount: 50,
    accentColor: "#FF9600",
    accentColorLight: "#FFF3E0",
  },
];

interface ContentPackState {
  ready: boolean;
  streetStatus: PackStatus;
  kidsStatus: PackStatus;
  streetProgress: number;
  kidsProgress: number;

  /** Check if a learning path mode is available (downloaded or always-available). */
  isAvailable: (mode: LessonPathMode) => boolean;

  /** Get status for a specific pack. */
  getStatus: (pack: PackId) => PackStatus;

  /** Get download progress (0..1) for a specific pack. */
  getProgress: (pack: PackId) => number;

  /** Start the simulated download for a pack. */
  startDownload: (pack: PackId) => void;

  /** Cancel an in-progress download. */
  cancelDownload: (pack: PackId) => void;

  /** Remove a downloaded pack (resets to not_downloaded). */
  removePack: (pack: PackId) => void;
}

// Active download timer handles so we can cancel
const downloadTimers: Partial<Record<PackId, ReturnType<typeof setInterval>>> = {};

function persistState(state: ContentPackState) {
  const data = {
    streetStatus: state.streetStatus,
    kidsStatus: state.kidsStatus,
  };
  try {
    appStorage.setItemSync(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
}

const savedContentPacks = appStorage.getItemSync(STORAGE_KEY);
const initialPacks = (() => {
  const defaults = {
    streetStatus: "not_downloaded" as PackStatus,
    kidsStatus: "not_downloaded" as PackStatus,
    streetProgress: 0,
    kidsProgress: 0,
  };
  if (!savedContentPacks) return defaults;
  try {
    const parsed = JSON.parse(savedContentPacks) as Partial<{
      streetStatus: PackStatus;
      kidsStatus: PackStatus;
    }>;
    const validStatuses: PackStatus[] = ["not_downloaded", "downloading", "downloaded"];
    const streetStatus = validStatuses.includes(parsed.streetStatus as any)
      ? (parsed.streetStatus as PackStatus)
      : "not_downloaded";
    const kidsStatus = validStatuses.includes(parsed.kidsStatus as any)
      ? (parsed.kidsStatus as PackStatus)
      : "not_downloaded";
    return {
      streetStatus: streetStatus === "downloading" ? "not_downloaded" : streetStatus,
      kidsStatus: kidsStatus === "downloading" ? "not_downloaded" : kidsStatus,
      streetProgress: streetStatus === "downloaded" ? 1 : 0,
      kidsProgress: kidsStatus === "downloaded" ? 1 : 0,
    };
  } catch {
    return defaults;
  }
})();

export const useContentPackStore = create<ContentPackState>((set, get) => ({
  ready: true,
  ...initialPacks,

  isAvailable: (mode: LessonPathMode) => {
    if (mode === "normal") return true;
    const state = get();
    if (mode === "street") return state.streetStatus === "downloaded";
    if (mode === "kids") return state.kidsStatus === "downloaded";
    return false;
  },

  getStatus: (pack: PackId) => {
    const state = get();
    return pack === "street" ? state.streetStatus : state.kidsStatus;
  },

  getProgress: (pack: PackId) => {
    const state = get();
    return pack === "street" ? state.streetProgress : state.kidsProgress;
  },

  startDownload: (pack: PackId) => {
    const statusKey = pack === "street" ? "streetStatus" : "kidsStatus";
    const progressKey = pack === "street" ? "streetProgress" : "kidsProgress";

    // Already downloaded or downloading
    const current = get()[statusKey];
    if (current === "downloaded" || current === "downloading") return;

    set({ [statusKey]: "downloading", [progressKey]: 0 } as any);

    // Simulated download: increment progress over ~4 seconds
    const TOTAL_DURATION = 4000;
    const TICK_INTERVAL = 80;
    const TOTAL_TICKS = TOTAL_DURATION / TICK_INTERVAL;
    let tick = 0;

    // Clear any existing timer
    if (downloadTimers[pack]) {
      clearInterval(downloadTimers[pack]);
    }

    downloadTimers[pack] = setInterval(() => {
      tick++;
      const progress = Math.min(tick / TOTAL_TICKS, 1);

      // Add slight randomness to make it feel more natural
      const jitter = progress < 0.95 ? (Math.random() - 0.5) * 0.02 : 0;
      const displayProgress = Math.min(Math.max(progress + jitter, 0), 1);

      if (tick >= TOTAL_TICKS) {
        // Download complete
        clearInterval(downloadTimers[pack]!);
        delete downloadTimers[pack];
        set({
          [statusKey]: "downloaded" as PackStatus,
          [progressKey]: 1,
        } as any);
        persistState(get());
      } else {
        set({ [progressKey]: displayProgress } as any);
      }
    }, TICK_INTERVAL);
  },

  cancelDownload: (pack: PackId) => {
    const statusKey = pack === "street" ? "streetStatus" : "kidsStatus";
    const progressKey = pack === "street" ? "streetProgress" : "kidsProgress";

    if (downloadTimers[pack]) {
      clearInterval(downloadTimers[pack]);
      delete downloadTimers[pack];
    }

    set({
      [statusKey]: "not_downloaded" as PackStatus,
      [progressKey]: 0,
    } as any);
  },

  removePack: (pack: PackId) => {
    const statusKey = pack === "street" ? "streetStatus" : "kidsStatus";
    const progressKey = pack === "street" ? "streetProgress" : "kidsProgress";

    if (downloadTimers[pack]) {
      clearInterval(downloadTimers[pack]);
      delete downloadTimers[pack];
    }

    set({
      [statusKey]: "not_downloaded" as PackStatus,
      [progressKey]: 0,
    } as any);
    persistState(get());
  },
}));
