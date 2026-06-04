import { appStorage } from "@/lib/app-storage";
import {
  createEmptyLesson,
  getBundledUnits,
} from "@/data/content-registry";
import type { LessonBank, LessonPathMode, UnitBank } from "@/data/types";
import { deepClone } from "@/utils/deep-clone";
import { create } from "zustand";

const STORAGE_KEY = "phingo.admin.content";

type ContentOverrides = {
  street: UnitBank[] | null;
  normal: UnitBank[] | null;
  kids: UnitBank[] | null;
};

interface ContentAdminState {
  ready: boolean;
  overrides: ContentOverrides;
  hasOverride: (mode: LessonPathMode) => boolean;
  ensureEditable: (mode: LessonPathMode) => UnitBank[];
  setUnits: (mode: LessonPathMode, units: UnitBank[]) => void;
  resetToBundled: (mode: LessonPathMode) => void;
  resetAll: () => void;
  exportJson: (mode: LessonPathMode) => string;
  importJson: (mode: LessonPathMode, json: string) => { ok: true } | { ok: false; error: string };
  addUnit: (mode: LessonPathMode) => void;
  removeUnit: (mode: LessonPathMode, unitIndex: number) => void;
  duplicateUnit: (mode: LessonPathMode, unitIndex: number) => void;
  moveUnit: (mode: LessonPathMode, unitIndex: number, direction: -1 | 1) => void;
  addLesson: (mode: LessonPathMode, unitIndex: number) => void;
  removeLesson: (mode: LessonPathMode, unitIndex: number, lessonIndex: number) => void;
  duplicateLesson: (mode: LessonPathMode, unitIndex: number, lessonIndex: number) => void;
  moveLesson: (
    mode: LessonPathMode,
    unitIndex: number,
    lessonIndex: number,
    direction: -1 | 1,
  ) => void;
  updateLesson: (
    mode: LessonPathMode,
    unitIndex: number,
    lessonIndex: number,
    lesson: LessonBank,
  ) => void;
}

function persist(overrides: ContentOverrides) {
  appStorage.setItem(STORAGE_KEY, JSON.stringify({ overrides })).catch(() => {});
}

function cloneBundled(mode: LessonPathMode): UnitBank[] {
  return deepClone(getBundledUnits(mode));
}

export const useContentAdminStore = create<ContentAdminState>((set, get) => ({
  ready: false,
  overrides: { street: null, normal: null, kids: null },

  hasOverride: (mode) => get().overrides[mode] !== null,

  ensureEditable: (mode) => {
    const current = get().overrides[mode];
    if (current) return current;
    const cloned = cloneBundled(mode);
    const overrides = { ...get().overrides, [mode]: cloned };
    set({ overrides });
    persist(overrides);
    return cloned;
  },

  setUnits: (mode, units) => {
    const overrides = { ...get().overrides, [mode]: deepClone(units) };
    set({ overrides });
    persist(overrides);
  },

  resetToBundled: (mode) => {
    const overrides = { ...get().overrides, [mode]: null };
    set({ overrides });
    persist(overrides);
  },

  resetAll: () => {
    const overrides = { street: null, normal: null, kids: null };
    set({ overrides });
    persist(overrides);
  },

  exportJson: (mode) => {
    const units = get().overrides[mode] ?? getBundledUnits(mode);
    return JSON.stringify(units, null, 2);
  },

  importJson: (mode, json) => {
    try {
      const parsed = JSON.parse(json) as UnitBank[];
      if (!Array.isArray(parsed)) {
        return { ok: false, error: "JSON must be an array of units." };
      }
      get().setUnits(mode, parsed);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Invalid JSON",
      };
    }
  },

  addUnit: (mode) => {
    const units = deepClone(get().ensureEditable(mode));
    units.push([createEmptyLesson()]);
    get().setUnits(mode, units);
  },

  removeUnit: (mode, unitIndex) => {
    const units = deepClone(get().ensureEditable(mode));
    if (units.length <= 1) return;
    units.splice(unitIndex, 1);
    get().setUnits(mode, units);
  },

  duplicateUnit: (mode, unitIndex) => {
    const units = deepClone(get().ensureEditable(mode));
    const source = units[unitIndex];
    if (!source) return;
    units.splice(unitIndex + 1, 0, deepClone(source));
    get().setUnits(mode, units);
  },

  moveUnit: (mode, unitIndex, direction) => {
    const units = deepClone(get().ensureEditable(mode));
    const nextIndex = unitIndex + direction;
    if (nextIndex < 0 || nextIndex >= units.length) return;
    [units[unitIndex], units[nextIndex]] = [units[nextIndex], units[unitIndex]];
    get().setUnits(mode, units);
  },

  addLesson: (mode, unitIndex) => {
    const units = deepClone(get().ensureEditable(mode));
    const unit = units[unitIndex];
    if (!unit) return;
    unit.push(createEmptyLesson());
    get().setUnits(mode, units);
  },

  removeLesson: (mode, unitIndex, lessonIndex) => {
    const units = deepClone(get().ensureEditable(mode));
    const unit = units[unitIndex];
    if (!unit || unit.length <= 1) return;
    unit.splice(lessonIndex, 1);
    get().setUnits(mode, units);
  },

  duplicateLesson: (mode, unitIndex, lessonIndex) => {
    const units = deepClone(get().ensureEditable(mode));
    const unit = units[unitIndex];
    const source = unit?.[lessonIndex];
    if (!source) return;
    unit.splice(lessonIndex + 1, 0, deepClone(source));
    get().setUnits(mode, units);
  },

  moveLesson: (mode, unitIndex, lessonIndex, direction) => {
    const units = deepClone(get().ensureEditable(mode));
    const unit = units[unitIndex];
    const nextIndex = lessonIndex + direction;
    if (!unit || nextIndex < 0 || nextIndex >= unit.length) return;
    [unit[lessonIndex], unit[nextIndex]] = [unit[nextIndex], unit[lessonIndex]];
    get().setUnits(mode, units);
  },

  updateLesson: (mode, unitIndex, lessonIndex, lesson) => {
    const units = deepClone(get().ensureEditable(mode));
    const unit = units[unitIndex];
    if (!unit) return;
    unit[lessonIndex] = deepClone(lesson);
    get().setUnits(mode, units);
  },
}));

async function hydrateContentAdmin() {
  try {
    const raw = await appStorage.getItem(STORAGE_KEY);
    if (!raw) {
      useContentAdminStore.setState({ ready: true });
      return;
    }
    const parsed = JSON.parse(raw) as { overrides?: ContentOverrides };
    useContentAdminStore.setState({
      overrides: {
        street: parsed.overrides?.street ?? null,
        normal: parsed.overrides?.normal ?? null,
        kids: parsed.overrides?.kids ?? null,
      },
      ready: true,
    });
  } catch {
    useContentAdminStore.setState({ ready: true });
  }
}

void hydrateContentAdmin();
