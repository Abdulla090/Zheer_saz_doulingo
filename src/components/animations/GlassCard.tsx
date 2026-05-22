/**
 * GlassCard — Frosted glass card component using expo-blur.
 * Falls back gracefully to a semi-transparent background on web.
 * Provides the premium glassmorphism effect that defines modern UI.
 */

import React from "react";
import { StyleSheet, View, Platform, StyleProp, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

type GlassCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Blur intensity (0-100, default 40) */
  intensity?: number;
  /** Blur tint: 'light', 'dark', 'default' */
  tint?: "light" | "dark" | "default";
  /** Border radius */
  borderRadius?: number;
  /** Whether to show glass border */
  showBorder?: boolean;
};

export function GlassCard({
  children,
  style,
  intensity = 40,
  tint = "light",
  borderRadius = 24,
  showBorder = true,
}: GlassCardProps) {
  const borderStyle = showBorder ? {
    borderWidth: 1,
    borderColor: tint === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(255,255,255,0.35)",
  } : {};

  // Web fallback: CSS backdrop-filter
  if (Platform.OS === "web") {
    return (
      <View
        style={[
          styles.container,
          {
            borderRadius,
            backgroundColor: tint === "dark"
              ? "rgba(14, 17, 23, 0.7)"
              : "rgba(255, 255, 255, 0.55)",
            // @ts-ignore — web-only CSS property
            backdropFilter: `blur(${intensity / 2.5}px)`,
            // @ts-ignore — web-only CSS property
            WebkitBackdropFilter: `blur(${intensity / 2.5}px)`,
          },
          borderStyle,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderRadius, overflow: "hidden" }, borderStyle, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  content: {
    // Content sits on top of blur
    position: "relative",
    zIndex: 1,
  },
});
