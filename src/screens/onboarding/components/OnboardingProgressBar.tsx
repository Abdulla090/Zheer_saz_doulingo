import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ONBOARDING_DESIGN } from "./onboarding-design";

/**
 * Onboarding progress.
 *
 * This was nine discrete dots. Nine is past the point where a reader counts
 * segments — it reads as clutter, and on a 360dp screen the inter-dot gaps
 * consumed more width than the dots themselves. A single track carrying a
 * proportional fill answers the only question the user actually has ("how much
 * is left?") in one glance, and it scales to any step count.
 *
 * The fill springs rather than cuts, so advancing a step feels continuous with
 * the slide transition instead of snapping ahead of it.
 */
export function OnboardingProgressBar({
  total,
  index,
}: {
  total: number;
  index: number;
}) {
  const safeTotal = Math.max(1, total);
  const ratio = Math.min(1, Math.max(0, (index + 1) / safeTotal));

  const progress = useSharedValue(ratio);

  React.useEffect(() => {
    progress.value = withSpring(ratio, {
      damping: 24,
      stiffness: 180,
      mass: 0.6,
      overshootClamping: true,
    });
  }, [progress, ratio]);

  React.useEffect(() => () => cancelAnimation(progress), [progress]);

  const fill = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: safeTotal,
        now: Math.min(index + 1, safeTotal),
      }}
    >
      <Animated.View style={[styles.fill, fill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(85,75,65,0.12)",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: ONBOARDING_DESIGN.accent,
    minWidth: 10,
  },
});
