import gsap from "gsap";
import { Platform } from "react-native";

const ENTER_SELECTOR = "[data-skia-gsap-enter]";

export function runGsapStagger(root: unknown, onComplete?: () => void) {
  if (Platform.OS !== "web" || typeof document === "undefined") {
    onComplete?.();
    return;
  }

  const element = root as HTMLElement | null;
  if (!element) {
    onComplete?.();
    return;
  }

  const blocks = element.querySelectorAll(ENTER_SELECTOR);
  const targets = blocks.length > 0 ? blocks : [element];

  gsap.killTweensOf(targets);

  gsap.fromTo(
    targets,
    { opacity: 0, y: 36, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.68,
      stagger: 0.085,
      ease: "power3.out",
      delay: 0.04,
      clearProps: "transform",
      onComplete,
    },
  );
}

export function resetGsapEnterBlocks(root: unknown) {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  const element = root as HTMLElement | null;
  if (!element) return;

  const blocks = element.querySelectorAll(ENTER_SELECTOR);
  const targets = blocks.length > 0 ? blocks : [element];
  gsap.set(targets, { opacity: 0, y: 36, scale: 0.96 });
}
