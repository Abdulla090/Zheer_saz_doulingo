import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useThemeColors } from "../../../hooks/useThemeColors";
import { ScreenOpeningProvider } from "./ScreenOpeningContext";
import { SkiaRevealOverlay } from "./SkiaRevealOverlay";
import { resetGsapEnterBlocks, runGsapStagger } from "./gsap-stagger";
import type { ScreenOpeningVariant } from "./opening-themes";

type Props = {
  variant: ScreenOpeningVariant;
  children: React.ReactNode;
  /** Unique screen identifier */
  screenKey?: string;
  /** Whether animation runs only on the first visit of the session (default false) */
  firstTimeOnly?: boolean;
};

// In-memory registry of visited screens during the session
const visitedScreens = new Set<string>();

const BEZIER_CURVE = Easing.bezier(0.16, 1, 0.3, 1);
const ENTRANCE_DURATION = 640;

/**
 * ScreenOpeningShell — universal hardware-accelerated entrance.
 *
 * Runs instantly on mount across Web, iOS, and Android without delay queues
 * or layout flash. Features glowing Skia radial light orbs bloom and smooth
 * content glide (GSAP stagger on Web, Reanimated on Native).
 */
export function ScreenOpeningShell({
  variant,
  children,
  screenKey,
  firstTimeOnly = false,
}: Props) {
  const { colors } = useThemeColors();
  const effectiveKey = screenKey ?? variant;
  const isFirstTime = !visitedScreens.has(effectiveKey);
  const shouldAnimate = firstTimeOnly ? isFirstTime : true;

  const [playKey, setPlayKey] = useState(shouldAnimate ? 1 : 0);
  const contentRef = useRef<View>(null);

  const opacity = useSharedValue(shouldAnimate ? 0 : 1);
  const translateY = useSharedValue(shouldAnimate ? 32 : 0);
  const scale = useSharedValue(shouldAnimate ? 0.97 : 1);

  useEffect(() => {
    if (!shouldAnimate) return;

    visitedScreens.add(effectiveKey);
    setPlayKey((k) => k + 1);

    if (Platform.OS === "web") {
      runGsapStagger(contentRef.current);
      return () => {
        resetGsapEnterBlocks(contentRef.current);
      };
    }

    opacity.value = 0;
    translateY.value = 32;
    scale.value = 0.97;

    const timing = {
      duration: ENTRANCE_DURATION,
      easing: BEZIER_CURVE,
    };

    opacity.value = withTiming(1, timing);
    translateY.value = withTiming(0, timing);
    scale.value = withTiming(1, timing);
  }, [effectiveKey, opacity, scale, shouldAnimate, translateY]);

  const nativeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <ScreenOpeningProvider playKey={playKey} variant={variant}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View
          ref={contentRef as any}
          style={[
            styles.content,
            Platform.OS !== "web" && shouldAnimate && nativeAnimatedStyle,
          ]}
          renderToHardwareTextureAndroid={Platform.OS === "android"}
        >
          {children}
        </Animated.View>
        {shouldAnimate ? (
          <SkiaRevealOverlay variant={variant} playKey={playKey} />
        ) : null}
      </View>
    </ScreenOpeningProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
});
