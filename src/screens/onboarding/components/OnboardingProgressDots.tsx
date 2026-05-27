import { HomePalette } from "@/components/ui/ios-liquid-home";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Motion } from "@/screens/lesson/games/game-design";

const C = HomePalette;

export function OnboardingProgressDots({
  total,
  index,
}: {
  total: number;
  index: number;
}) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {Array.from({ length: total }, (_, i) => (
        <Dot key={i} active={i === index} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const style = useAnimatedStyle(() => ({
    width: withSpring(active ? 28 : 8, Motion.soft),
    opacity: withSpring(active ? 1 : 0.35, Motion.soft),
  }));

  return (
    <Animated.View
      style={[styles.dot, style, active && styles.dotActive]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: C.track,
  },
  dotActive: {
    backgroundColor: C.blue,
  },
});
