import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import type { OnboardingTheme } from "./onboarding-theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Step progress as a ring, sitting beside the back arrow.
 *
 * This replaces the full-width bar that used to live above the Continue button.
 * The bar was a second position indicator competing with the button for the
 * bottom of the page, and it stretched edge-to-edge to communicate a value that
 * changes by one ninth at a time. A 34px ring in the top bar reads at a glance,
 * costs no vertical space, and puts "where am I" next to "go back" — the two
 * questions a user asks at the same moment.
 *
 * ── Two implementation notes, both learned the hard way ────────────────────
 *
 * The rotation and the RTL mirror are applied as *style transforms on a wrapper
 * View*, never as props on `<Svg>`. `scaleX` / `rotation` are react-native-svg
 * *native* props; on web the library renders a real DOM `<svg>` and forwards
 * unrecognised props straight through, so React logs "React does not recognize
 * the `scaleX` prop on a DOM element". A style transform compiles to a CSS
 * transform on web and a native transform on iOS/Android, so it is correct
 * everywhere.
 *
 * The sweep is animated via `useAnimatedProps` rather than by re-rendering with
 * a new `strokeDashoffset`, so advancing a step does not re-render the whole
 * top bar mid-transition.
 */
export function OnboardingProgressRing({
  current,
  total,
  theme,
  isRtl,
  size = 34,
}: {
  current: number;
  total: number;
  theme: OnboardingTheme;
  isRtl: boolean;
  size?: number;
}) {
  const safeTotal = Math.max(1, total);
  const ratio = Math.min(1, Math.max(0, current / safeTotal));

  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(ratio);

  React.useEffect(() => {
    progress.value = withTiming(ratio, {
      duration: 420,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  }, [progress, ratio]);

  React.useEffect(() => () => cancelAnimation(progress), [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: safeTotal, now: Math.min(current, safeTotal) }}
      style={[styles.wrap, { width: size, height: size }]}
    >
      <View
        style={{
          transform: [{ rotate: "-90deg" }, { scaleX: isRtl ? -1 : 1 }],
        }}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.ringTrack}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.accent}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            animatedProps={animatedProps}
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
