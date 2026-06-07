/**
 * Expo + Reanimated v4 motion presets.
 * @see https://docs.expo.dev/versions/latest/sdk/reanimated/
 * @see animating-react-native-expo skill — CSS transitions for state, withTiming for gestures.
 */

import {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  LinearTransition,
  type WithTimingConfig,
} from "react-native-reanimated";

/** Press in — 90ms (under 300ms Expo UI guideline) */
export const CSS_PRESS_MS = 90;
/** Release — 130ms */
export const CSS_RELEASE_MS = 130;
/** Screen/card entrance */
export const CSS_ENTER_MS = 180;
/** List stagger step */
export const CSS_STAGGER_MS = 35;

const enterEasing = Easing.out(Easing.cubic);

import { Platform } from "react-native";

/** Reanimated 4 CSS transition styles for transform press feedback */
export const cssPressStyle = Platform.OS === "web" ? {
  transitionProperty: "transform" as const,
  transitionDuration: CSS_PRESS_MS,
  transitionTimingFunction: "ease-out" as const,
} : {};

export const cssReleaseStyle = Platform.OS === "web" ? {
  transitionProperty: "transform" as const,
  transitionDuration: CSS_RELEASE_MS,
  transitionTimingFunction: "ease-out" as const,
} : {};

export const pressTiming: WithTimingConfig = {
  duration: CSS_PRESS_MS,
  easing: Easing.out(Easing.quad),
};

export const releaseTiming: WithTimingConfig = {
  duration: CSS_RELEASE_MS,
  easing: Easing.out(Easing.cubic),
};

export const enterFade = (delay = 0) =>
  FadeIn.delay(delay).duration(CSS_ENTER_MS).easing(enterEasing);

export const enterFadeDown = (delay = 0) =>
  FadeInDown.delay(delay).duration(CSS_ENTER_MS).easing(enterEasing);

export const enterFadeUp = (delay = 0) =>
  FadeInUp.delay(delay).duration(CSS_ENTER_MS).easing(enterEasing);

export const enterFadeLeft = (delay = 0) =>
  FadeInLeft.delay(delay).duration(CSS_ENTER_MS).easing(enterEasing);

export const enterFadeRight = (delay = 0) =>
  FadeInRight.delay(delay).duration(CSS_ENTER_MS).easing(enterEasing);

export const enterStagger = (index: number, baseDelay = 0) =>
  enterFadeDown(baseDelay + index * CSS_STAGGER_MS);

/** Smooth layout reflow — preferred over spring layout in lists */
export const layoutSmooth = LinearTransition.duration(160).easing(enterEasing);

/** Sentence builder — tiles morph into slots (spring layout + fly duration). */
export const layoutMorph = LinearTransition.springify()
  .damping(20)
  .stiffness(240);

export const TILE_FLY_MS = 340;

export const tileFlyTiming: WithTimingConfig = {
  duration: TILE_FLY_MS,
  easing: Easing.out(Easing.cubic),
};
