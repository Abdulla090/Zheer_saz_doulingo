import React from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

/* ─── Color Themes (Blue → Orange → Indigo) ─── */
const SLIDE_COLORS = [
  // Slide 1 (Profile): Bold sky blue
  ["#0066FF", "#0099FF", "#38B6FF", "#7DD3FC", "#D2EDFF", "#F0F9FF", "#FFFFFF"],
  // Slide 2 (Language): Emerald green
  ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5", "#ECFDF5", "#FFFFFF"],
  // Slide 3 (Level): Purple
  ["#6B21A8", "#9333EA", "#A855F7", "#D8B4FE", "#F3E8FF", "#FAF5FF", "#FFFFFF"],
  // Slide 4 (Goal): Purple
  ["#6B21A8", "#9333EA", "#A855F7", "#D8B4FE", "#F3E8FF", "#FAF5FF", "#FFFFFF"],
  // Slide 5 (Generating): Purple
  ["#6B21A8", "#9333EA", "#A855F7", "#D8B4FE", "#F3E8FF", "#FAF5FF", "#FFFFFF"],
] as const;

const LOCATIONS = [0, 0.15, 0.3, 0.45, 0.62, 0.82, 1] as const;

/**
 * Full-screen gradient background with smooth crossfade morph
 * between 3 slides, texture overlays, and centered logo.
 *
 * Receives a Reanimated SharedValue<number> for the horizontal
 * scroll offset so the color transition is continuous, not stepped.
 */
export function OnboardingSkiaBg({
  scrollX,
}: {
  scrollX: SharedValue<number>;
  slideIndex?: number;
}) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {/* 3 stacked gradient layers — opacity driven by scrollX */}
      {SLIDE_COLORS.map((colors, i) => (
        <AnimatedGradientLayer
          key={i}
          colors={colors}
          index={i}
          scrollX={scrollX}
          screenWidth={width}
        />
      ))}

      {/* Subtle texture overlays for depth (not flat) */}
      <View style={styles.textureWrap} pointerEvents="none">
        {/* Radial light spot at top-right for depth */}
        <LinearGradient
          colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0)"] as any}
          start={{ x: 0.75, y: 0 }}
          end={{ x: 0.25, y: 0.6 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Very subtle bottom vignette */}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.03)"] as any}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
}

/* ─── Animated Gradient Layer ─── */
function AnimatedGradientLayer({
  colors,
  index,
  scrollX,
  screenWidth,
}: {
  colors: readonly string[];
  index: number;
  scrollX: SharedValue<number>;
  screenWidth: number;
}) {
  const animStyle = useAnimatedStyle(() => {
    const x = scrollX?.value ?? 0;
    // Each slide is at position index * screenWidth
    // Full opacity at its own position, fade out to neighbors
    const opacity = interpolate(
      x,
      [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animStyle]}>
      <LinearGradient
        colors={colors as any}
        locations={LOCATIONS as any}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  textureWrap: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  logoWrap: {
    position: "absolute",
    top: "12%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 55,
    resizeMode: "contain",
    opacity: 0.92,
  },
});
