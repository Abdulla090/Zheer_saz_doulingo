import {
  BlurMask,
  Canvas,
  Circle,
  Fill,
  LinearGradient,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import {
  cancelAnimation,
  Easing,
  type SharedValue,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useOnboardingGradient, useOnboardingTheme } from "./onboarding-theme";

/**
 * Onboarding canvas background.
 *
 * A seek-safe GPU background: the first frame opens with a soft iris, then two
 * restrained blurred glows track the pager. All values stay on the UI thread;
 * React does not re-render while the user drags. Reduced Motion skips the iris
 * and keeps the canvas fully legible from frame one.
 */
export function OnboardingSkiaBg({ scrollX }: {
  scrollX: SharedValue<number>;
}) {
  const { width, height } = useWindowDimensions();
  const stops = useOnboardingGradient();
  const theme = useOnboardingTheme();
  const reduceMotion = useReducedMotion();
  const reveal = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    cancelAnimation(reveal);
    reveal.value = reduceMotion
      ? 1
      : withTiming(1, {
          duration: 680,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
    return () => cancelAnimation(reveal);
  }, [reduceMotion, reveal]);

  const page = useDerivedValue(() => scrollX.value / Math.max(1, width));
  const revealRadius = useDerivedValue(
    () => Math.hypot(width, height) * reveal.value,
  );
  const glowOneX = useDerivedValue(
    () => width * (0.14 + 0.16 * Math.sin(page.value * 1.45)),
  );
  const glowOneY = useDerivedValue(
    () => height * (0.18 + 0.08 * Math.cos(page.value * 1.2)),
  );
  const glowTwoX = useDerivedValue(
    () => width * (0.86 - 0.12 * Math.cos(page.value * 1.1)),
  );
  const glowTwoY = useDerivedValue(
    () => height * (0.72 + 0.09 * Math.sin(page.value * 1.35)),
  );

  return (
    <Canvas pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Fill color={theme.isDark ? "#080D12" : "#E9E5DB"} />
      <Circle cx={width / 2} cy={height * 0.44} r={revealRadius}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={stops as unknown as string[]}
        />
      </Circle>
      <Circle
        cx={glowOneX}
        cy={glowOneY}
        r={Math.max(width, height) * 0.22}
        color={theme.glowPrimary}
        opacity={reveal}
      >
        <BlurMask blur={58} style="normal" />
      </Circle>
      <Circle
        cx={glowTwoX}
        cy={glowTwoY}
        r={Math.max(width, height) * 0.2}
        color={theme.glowSecondary}
        opacity={reveal}
      >
        <BlurMask blur={68} style="normal" />
      </Circle>
    </Canvas>
  );
}
