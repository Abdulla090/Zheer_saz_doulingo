import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useOnboardingGradient, useOnboardingTheme } from "./onboarding-theme";

/** CSS/Reanimated counterpart of the native Skia treatment. */
export function OnboardingSkiaBg({ scrollX }: {
  scrollX: SharedValue<number>;
}) {
  const stops = useOnboardingGradient();
  const theme = useOnboardingTheme();
  const reduceMotion = useReducedMotion();
  const reveal = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    cancelAnimation(reveal);
    reveal.value = reduceMotion ? 1 : withTiming(1, { duration: 560 });
    return () => cancelAnimation(reveal);
  }, [reduceMotion, reveal]);

  const revealStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ scale: 0.88 + reveal.value * 0.12 }],
  }));
  const glowOneStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.sin(scrollX.value / 340) * 54 },
      { translateY: Math.cos(scrollX.value / 420) * 24 },
    ],
  }));
  const glowTwoStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(scrollX.value / 380) * -44 },
      { translateY: Math.sin(scrollX.value / 360) * 28 },
    ],
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, revealStyle]}>
        <LinearGradient
          colors={stops}
          locations={[0, 0.58, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          style={[styles.glow, styles.glowOne, { backgroundColor: theme.glowPrimary }, glowOneStyle]}
        />
        <Animated.View
          style={[styles.glow, styles.glowTwo, { backgroundColor: theme.glowSecondary }, glowTwoStyle]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    filter: "blur(68px)",
  },
  glowOne: {
    left: -160,
    top: -100,
  },
  glowTwo: {
    right: -150,
    bottom: -120,
  },
});
