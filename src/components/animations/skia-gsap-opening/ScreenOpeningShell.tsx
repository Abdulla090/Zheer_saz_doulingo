import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";

import { resetGsapEnterBlocks, runGsapStagger } from "./gsap-stagger";
import { ScreenOpeningProvider } from "./ScreenOpeningContext";
import type { ScreenOpeningVariant } from "./opening-themes";

type Props = {
  variant: ScreenOpeningVariant;
  children: React.ReactNode;
  /** Unique screen identifier for first-time session tracking */
  screenKey?: string;
  /** Whether animation runs only on the first visit of the session (default true) */
  firstTimeOnly?: boolean;
};

// In-memory registry of visited screens during the session
const visitedScreens = new Set<string>();

/**
 * ScreenOpeningShell — lightweight content-stagger entrance.
 *
 * On the first visit per session: GSAP stagger (web) / Reanimated stagger (native).
 * On subsequent visits: renders children instantly with no animation overhead.
 *
 * The heavy Skia/gradient veil overlay is intentionally NOT used here — it blocks
 * content on data-heavy screens and causes a blank white flash.
 */
export function ScreenOpeningShell({
  variant,
  children,
  screenKey,
  firstTimeOnly = true,
}: Props) {
  const effectiveKey = screenKey ?? variant;
  const isFirstTime = !visitedScreens.has(effectiveKey);
  const shouldAnimate = firstTimeOnly ? isFirstTime : true;

  const [playKey, setPlayKey] = useState(shouldAnimate ? 1 : 0);
  const contentRef = useRef<View>(null);

  const runContentEntrance = useCallback(() => {
    if (Platform.OS === "web") {
      runGsapStagger(contentRef.current);
    }
  }, []);

  useEffect(() => {
    if (shouldAnimate) {
      visitedScreens.add(effectiveKey);
      setPlayKey((k) => k + 1);

      let animationFrame: number | undefined;
      const contentNode = contentRef.current;

      if (Platform.OS === "web") {
        resetGsapEnterBlocks(contentNode);
        animationFrame = requestAnimationFrame(runContentEntrance);
      }

      return () => {
        if (Platform.OS === "web") {
          if (animationFrame !== undefined) {
            cancelAnimationFrame(animationFrame);
          }
          resetGsapEnterBlocks(contentNode);
        }
      };
    }
  }, [effectiveKey, runContentEntrance, shouldAnimate]);

  return (
    <ScreenOpeningProvider playKey={playKey} variant={variant}>
      <View ref={contentRef} style={{ flex: 1 }}>
        {children}
      </View>
    </ScreenOpeningProvider>
  );
}
