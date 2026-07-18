/**
 * useContentPackStore — tracks activation state for Street & Kids content packs.
 *
 * All curriculum data ships with the app. Normal English is always active;
 * Street and Kids are copied from the bundled registry into the local cache
 * when a learner adds either path.
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
    sizeLabel: "Offline",
    unitCount: 12,
    lessonCount: 120,
    accentColor: "#1CB0F6",
    accentColorLight: "#E0F4FE",
  },
  {
    id: "kids",
    titleKey: "Kids English",
    descriptionKey: "Fun interactive lessons with games, animals & colors for children",
    sizeLabel: "Offline",
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

  /** Check if a learning path mode is active or always available. */
  isAvailable: (mode: LessonPathMode) => boolean;

  /** Get status for a specific pack. */
  getStatus: (pack: PackId) => PackStatus;

  /** Get activation progress (0..1) for a specific pack. */
  getProgress: (pack: PackId) => number;

  /** Add a bundled path to the learner's active paths. */
  startDownload: (pack: PackId) => void;

  /** Cancel an in-progress activation (kept for API compatibility). */
  cancelDownload: (pack: PackId) => void;

  /** Remove an active path (resets its legacy persisted status). */
  removePack: (pack: PackId) => void;
}

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

    // Legacy persisted status names are retained so existing installs migrate
    // without losing which bundled paths the learner activated.
    const current = get()[statusKey];
    if (current === "downloaded" || current === "downloading") return;

    // Cache only the curriculum already shipped inside the application.
    try {
      const curriculumData = getBundledUnits(pack);
      appStorage.setItemSync(`${CACHE_PREFIX}${pack}`, JSON.stringify(curriculumData));
    } catch (err) {
      console.error("Failed to activate bundled curriculum:", err);
      set({ [statusKey]: "error" as PackStatus } as any);
      return;
    }

    set({
      [statusKey]: "downloaded" as PackStatus,
      [progressKey]: 1,
    } as any);
    persistState(get());
  },

  cancelDownload: (pack: PackId) => {
    const statusKey = pack === "street" ? "streetStatus" : "kidsStatus";
    const progressKey = pack === "street" ? "streetProgress" : "kidsProgress";

    set({
      [statusKey]: "not_downloaded" as PackStatus,
      [progressKey]: 0,
    } as any);
  },

  removePack: (pack: PackId) => {
    const statusKey = pack === "street" ? "streetStatus" : "kidsStatus";
    const progressKey = pack === "street" ? "streetProgress" : "kidsProgress";

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
