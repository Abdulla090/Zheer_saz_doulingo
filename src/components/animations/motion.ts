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
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";
import { Platform } from "react-native";

/** Press in — 90ms (under 300ms Expo UI guideline) */
export const CSS_PRESS_MS = 90;
/** Release — 130ms */
export const CSS_RELEASE_MS = 130;
/** Current iOS control response: restrained compression, fast release, no bounce. */
export const IOS_BUTTON_PRESS_SCALE = 0.975;
export const IOS_BUTTON_PRESS_OPACITY = 0.88;
export const IOS_BUTTON_PRESS_Y = 1;
export const IOS_BUTTON_RELEASE_SPRING: WithSpringConfig = {
  damping: 24,
  stiffness: 420,
  mass: 0.62,
  overshootClamping: true,
};
/** Screen/card entrance */
export const CSS_ENTER_MS = 180;
/** List stagger step */
export const CSS_STAGGER_MS = 35;

const enterEasing = Easing.out(Easing.cubic);

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

export const enterFade = (delay = 0) => {
  const animation = FadeIn.delay(delay).duration(CSS_ENTER_MS);
  return Platform.OS === "web" ? animation : animation.easing(enterEasing);
};

export const enterFadeDown = (delay = 0) => {
  const animation = FadeInDown.delay(delay).duration(CSS_ENTER_MS);
  return Platform.OS === "web" ? animation : animation.easing(enterEasing);
};

export const enterFadeUp = (delay = 0) => {
  const animation = FadeInUp.delay(delay).duration(CSS_ENTER_MS);
  return Platform.OS === "web" ? animation : animation.easing(enterEasing);
};

export const enterFadeLeft = (delay = 0) => {
  const animation = FadeInLeft.delay(delay).duration(CSS_ENTER_MS);
  return Platform.OS === "web" ? animation : animation.easing(enterEasing);
};

export const enterFadeRight = (delay = 0) => {
  const animation = FadeInRight.delay(delay).duration(CSS_ENTER_MS);
  return Platform.OS === "web" ? animation : animation.easing(enterEasing);
};

export const enterStagger = (index: number, baseDelay = 0) =>
  enterFadeDown(baseDelay + index * CSS_STAGGER_MS);

/** Smooth layout reflow — preferred over spring layout in lists */
export const layoutSmooth =
  Platform.OS === "web"
    ? LinearTransition.duration(160)
    : LinearTransition.duration(160).easing(enterEasing);

/** Sentence builder — tiles morph into slots (spring layout + fly duration). */
export const layoutMorph =
  Platform.OS === "web"
    ? LinearTransition.duration(180)
    : LinearTransition.springify().damping(20).stiffness(240);

export const TILE_FLY_MS = 340;

export const tileFlyTiming: WithTimingConfig = {
  duration: TILE_FLY_MS,
  easing: Easing.out(Easing.cubic),
};

/**
 * Direct-manipulation word games need a shorter hand-off than audio-led games.
 * The fast start makes the tile leave the finger immediately while the cubic
 * tail keeps the landing soft instead of snapping into place.
 */
export const WORD_TILE_MORPH_MS = 190;

export const wordTileMorphTiming: WithTimingConfig = {
  duration: WORD_TILE_MORPH_MS,
  easing: Easing.out(Easing.cubic),
};

/**
 * Sentence builder — word flying from the bank into the answer row.
 *
 * `Easing.out` spends almost the whole distance in its first frames, so at 145ms
 * the tile did not read as moving at all: it blinked out of the bank and settled
 * in the slot. An in-out curve leaves and arrives at zero velocity, which is what
 * makes the same short trip read as one continuous glide (the Duolingo feel).
 * Kept just under 210ms because the next tap is locked until the tile lands.
 */
export const SENTENCE_WORD_MORPH_MS = 200;

export const sentenceWordMorphTiming: WithTimingConfig = {
  duration: SENTENCE_WORD_MORPH_MS,
  easing: Easing.inOut(Easing.quad),
};
