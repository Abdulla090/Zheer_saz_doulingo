/**
 * useContentPackStore — tracks download state for Street & Kids content packs.
 *
 * Normal English is always available.  Street and Kids are "downloadable"
 * (simulated — all data is bundled, but we gate access behind a persisted flag
 * for a modern app-store-style UX).
 */

import type { LessonPathMode } from "../data/types";
import { appStorage } from "../lib/app-storage";
import { getBundledUnits } from "../data/content-registry";
import { create } from "zustand";

const STORAGE_KEY = "twino.content-packs";
const CACHE_PREFIX = "twino.curriculum.cache.";

export type PackId = "street" | "kids";
export type PackStatus = "not_downloaded" | "downloading" | "downloaded" | "error";

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

// Active XHR requests to track and cancel downloads
const downloadXHRs: Partial<Record<PackId, XMLHttpRequest>> = {};

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
    const validStatuses: PackStatus[] = ["not_downloaded", "downloading", "downloaded", "error"];
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

    // 1. Immediately cache the local curriculum units from shipped content
    try {
      const curriculumData = getBundledUnits(pack);
      appStorage.setItemSync(`${CACHE_PREFIX}${pack}`, JSON.stringify(curriculumData));
    } catch (err) {
      console.error("Failed to write downloaded curriculum to cache:", err);
      set({ [statusKey]: "error" as PackStatus } as any);
      return;
    }

    // 2. Immediately persist the downloaded state to storage disk so it is unlocked/saved permanently
    const diskState = {
      ...get(),
      [statusKey]: "downloaded" as PackStatus,
      [progressKey]: 1,
    };
    persistState(diskState);

    // 3. Set memory Zustand state to downloading to trigger the visual progress bar UX signal
    set({ [statusKey]: "downloading", [progressKey]: 0 } as any);

    // Cancel any existing request
    if (downloadXHRs[pack]) {
      downloadXHRs[pack]?.abort();
      delete downloadXHRs[pack];
    }

    const xhr = new XMLHttpRequest();
    downloadXHRs[pack] = xhr;

    // 4. Run Cloudflare download speed test purely as a UX signal for network progress
    const bytes = pack === "street" ? 25000000 : 15000000;
    xhr.open("GET", `https://speed.cloudflare.com/__down?bytes=${bytes}&nocache=${Date.now()}`, true);

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = event.loaded / event.total;
        set({ [progressKey]: progress } as any);
      }
    };

    xhr.onload = () => {
      delete downloadXHRs[pack];
      set({
        [statusKey]: "downloaded" as PackStatus,
        [progressKey]: 1,
      } as any);
      persistState(get());
    };

    xhr.onerror = () => {
      delete downloadXHRs[pack];
      // Even if speed test fails/no network, transition Zustand state to downloaded
      set({
        [statusKey]: "downloaded" as PackStatus,
        [progressKey]: 1,
      } as any);
      persistState(get());
    };

    xhr.send();
  },

  cancelDownload: (pack: PackId) => {
    const statusKey = pack === "street" ? "streetStatus" : "kidsStatus";
    const progressKey = pack === "street" ? "streetProgress" : "kidsProgress";

    if (downloadXHRs[pack]) {
      downloadXHRs[pack]?.abort();
      delete downloadXHRs[pack];
    }

    set({
      [statusKey]: "not_downloaded" as PackStatus,
      [progressKey]: 0,
    } as any);
  },

  removePack: (pack: PackId) => {
    const statusKey = pack === "street" ? "streetStatus" : "kidsStatus";
    const progressKey = pack === "street" ? "streetProgress" : "kidsProgress";

    if (downloadXHRs[pack]) {
      downloadXHRs[pack]?.abort();
      delete downloadXHRs[pack];
    }

    try {
      appStorage.removeItemSync(`${CACHE_PREFIX}${pack}`);
    } catch {
      /* noop */
    }

    set({
      [statusKey]: "not_downloaded" as PackStatus,
      [progressKey]: 0,
    } as any);
    persistState(get());
  },
}));
