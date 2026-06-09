/**
 * Shared motion presets for lesson games — smooth Expo / Reanimated entrances.
 */
import {
  CSS_ENTER_MS,
  CSS_STAGGER_MS,
  enterFade,
  enterFadeDown,
  enterFadeUp,
  enterStagger,
  layoutSmooth,
  pressTiming,
  releaseTiming,
} from "../../../components/animations/motion";
import { Easing, FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";

export {
  CSS_ENTER_MS,
  CSS_STAGGER_MS,
  enterFade,
  enterFadeDown,
  enterFadeUp,
  enterStagger,
  layoutSmooth,
  pressTiming,
  releaseTiming,
};

const smoothOut = Easing.out(Easing.cubic);

/** Whole game screen swap between questions */
export const enterGame = FadeIn.duration(240).easing(smoothOut);
export const exitGame = FadeOut.duration(180).easing(Easing.in(Easing.quad));

/** Header / eyebrow block */
export const enterHeader = (delay = 0) =>
  enterFadeDown(delay).duration(220);

/** Primary card (question, target phrase, sentence) */
export const enterCard = (delay = 60) =>
  enterFadeDown(delay).duration(260);

/** Answer option / chip row item */
export const enterOption = (index: number, baseDelay = 120) =>
  enterStagger(index, baseDelay).duration(240);

/** Footer CTA (CHECK, mic area) */
export const enterFooter = (delay = 280) =>
  enterFadeUp(delay).duration(260);

/** Feedback pop (transcript, result chip) */
export const enterPop = () => ZoomIn.duration(220).easing(smoothOut);

/** Status / hint line */
export const enterHint = (delay = 100) =>
  enterFade(delay).duration(200);
