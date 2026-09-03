import { Platform } from "react-native";

export const IS_IOS = Platform.OS === "ios";
export const IS_ANDROID = Platform.OS === "android";
export const IS_NATIVE = IS_IOS || IS_ANDROID;
export const IS_WEB = Platform.OS === "web";

/* ────────────────────────────────────────────────────────────────────
 * Device tier
 *
 * Resolved once at module load — OS version cannot change while the app
 * runs, so re-deriving it per render would be pure waste.
 *
 * The cut-offs are proxies for GPU/CPU capability, not for API features:
 *
 *   Android ≤ 9 (API 28) — overwhelmingly 2–4 GB RAM, weak fill rate. Overlapping
 *     translucency and large blurs cost real frames here. API 28 also predates
 *     the RenderNode improvements that make layered alpha cheap.
 *   iOS ≤ 13 — A9–A11 era. Capable, but running the current OS on old silicon,
 *     usually on a small screen where heavy decoration reads as noise anyway.
 *
 * `Platform.Version` is the API level (number) on Android and a version string
 * on iOS, so each branch parses its own shape.
 * ──────────────────────────────────────────────────────────────────── */

function resolveAndroidApiLevel(): number {
  const v = Platform.Version;
  return typeof v === "number" ? v : Number.parseInt(String(v), 10) || 0;
}

function resolveIosMajor(): number {
  const v = Platform.Version;
  return Number.parseInt(String(v).split(".")[0] ?? "", 10) || 0;
}

export const ANDROID_API_LEVEL = IS_ANDROID ? resolveAndroidApiLevel() : 0;
export const IOS_MAJOR_VERSION = IS_IOS ? resolveIosMajor() : 0;

/** Older hardware: shed decoration, keep layout and colour identical. */
export const IS_LOW_END_DEVICE =
  (IS_ANDROID && ANDROID_API_LEVEL > 0 && ANDROID_API_LEVEL <= 28) ||
  (IS_IOS && IOS_MAJOR_VERSION > 0 && IOS_MAJOR_VERSION <= 13);

/** Modern hardware: the full treatment is affordable. */
export const IS_HIGH_END_DEVICE = IS_NATIVE && !IS_LOW_END_DEVICE;

/* ────────────────────────────────────────────────────────────────────
 * Path list — existing flags
 * ──────────────────────────────────────────────────────────────────── */

/** Android release builds struggle with clip + SVG in virtualized lists, but with fixed heights it works great on all platforms. */
export const PATH_LIST_REMOVE_CLIPPED = true;

/** Path nodes: skip SVG gradient defs on Android (url(#id) often fails in APK). */
export const PATH_NODE_SIMPLE_SHINE = IS_ANDROID;

/** Skip expensive native elevation shadow pass in path list for Android. */
export const PATH_SKIP_NODE_SHADOW = IS_ANDROID;

/** Enable rasterization layer for complex node components on native. */
export const PATH_RASTERIZE_NODES = IS_NATIVE;

/* ────────────────────────────────────────────────────────────────────
 * Effect budget
 *
 * Read these instead of branching on Platform at call sites — one place to
 * retune when real device numbers come in.
 * ──────────────────────────────────────────────────────────────────── */

/**
 * Real gaussian blur (BlurView / glass surfaces). The single most expensive
 * effect in the app: it samples the whole area beneath itself every frame.
 * Off for low-end entirely.
 */
export const FX_ALLOW_BLUR = IS_HIGH_END_DEVICE;

/** Multi-stop gradients. Cheap once, costly when many overlap in a scroller. */
export const FX_ALLOW_GRADIENTS = !IS_LOW_END_DEVICE;

/**
 * Soft elevation shadows. Android composites these on the CPU per frame in
 * lists, which is why they were already disabled there.
 */
export const FX_ALLOW_SOFT_SHADOWS = !IS_LOW_END_DEVICE && !IS_ANDROID;

/** Purely decorative extras — sparkles, shine sweeps, ambient orbs. */
export const FX_ALLOW_DECORATION = !IS_LOW_END_DEVICE;

/* ────────────────────────────────────────────────────────────────────
 * Virtualization budget for the path list
 *
 * Old devices win more from a small render window than from any single effect:
 * fewer mounted nodes means less to measure, composite, and retain.
 * ──────────────────────────────────────────────────────────────────── */

export const PATH_LIST_TUNING = IS_LOW_END_DEVICE
  ? {
      initialNumToRender: 5,
      maxToRenderPerBatch: 4,
      windowSize: 3,
      updateCellsBatchingPeriod: 80,
    }
  : {
      initialNumToRender: 10,
      maxToRenderPerBatch: 8,
      windowSize: 5,
      updateCellsBatchingPeriod: 50,
    };

/*
 * The normal path keeps a tighter window than the other paths. Each of its rows
 * carries a full react-native-svg tree (the street and kids rows are plain
 * Views), so every extra viewport of mounted rows is several more SVG mounts
 * paid during a fling — the dominant scroll cost on that screen. With exact
 * `getItemLayout` a smaller window costs nothing visually; rows render at the
 * same offsets either way.
 */
export const NORMAL_PATH_LIST_TUNING = IS_LOW_END_DEVICE
  ? PATH_LIST_TUNING
  : {
      ...PATH_LIST_TUNING,
      windowSize: 4,
    };
