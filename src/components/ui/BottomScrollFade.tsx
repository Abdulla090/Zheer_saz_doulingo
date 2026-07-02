import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "../../hooks/useThemeColors";

export function BottomScrollFade() {
  const { isDark } = useThemeColors();
  
  // Use RGB values to smoothly fade to transparent
  // Light mode: background is #FFFFFF -> 255, 255, 255
  // Dark mode: background is #0F172A -> 15, 23, 42
  const rgb = isDark ? "15, 23, 42" : "255, 255, 255";
  
  return (
    <View style={[styles.container, { pointerEvents: "none" }]}>
      <LinearGradient
        colors={[
          `rgba(${rgb}, 0)`,
          `rgba(${rgb}, 0.6)`,
          `rgba(${rgb}, 1)`,
        ]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 180 : 160, // Increased for a bigger fade space
    zIndex: 10,
  },
});
