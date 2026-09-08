import type { ScreenOpeningVariant } from "./opening-themes";

type Props = {
  variant?: ScreenOpeningVariant;
  playKey?: number;
  onComplete?: () => void;
};

/**
 * The corner orb overlay effect is disabled on native mobile to prevent
 * render-thread and texture buffer crashes on screen navigation.
 * The core SKIA-GSAP content animation itself (smooth scale, opacity, and stagger) is preserved.
 */
export function SkiaRevealOverlay(_props: Props) {
  return null;
}
