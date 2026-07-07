import React, { useCallback, useRef, useState, useEffect } from "react";
import { Platform, View } from "react-native";

import { resetGsapEnterBlocks, runGsapStagger } from "./gsap-stagger";
import { ScreenOpeningProvider } from "./ScreenOpeningContext";
import type { ScreenOpeningVariant } from "./opening-themes";

type Props = {
  variant: ScreenOpeningVariant;
  children: React.ReactNode;
};

/**
 * Opening sequence on every platform:
 * GSAP stagger on web / Reanimated stagger on native, without the color reveal veil.
 * Runs exactly once when the component mounts.
 */
export function ScreenOpeningShell({ variant, children }: Props) {
  const [playKey, setPlayKey] = useState(0);
  const contentRef = useRef<View>(null);

  const runContentEntrance = useCallback(() => {
    if (Platform.OS === "web") {
      runGsapStagger(contentRef.current);
    }
  }, []);

  useEffect(() => {
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
  }, [runContentEntrance]);

  return (
    <ScreenOpeningProvider playKey={playKey} variant={variant}>
      <View style={{ flex: 1 }}>
        <View ref={contentRef} style={{ flex: 1 }}>
          {children}
        </View>
      </View>
    </ScreenOpeningProvider>
  );
}
