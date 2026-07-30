import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";

import { ONBOARDING_DESIGN } from "./onboarding-design";

export function OnboardingSkiaBg({
  scrollX: _scrollX,
}: {
  scrollX: SharedValue<number>;
  slideIndex?: number;
}) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[ONBOARDING_DESIGN.paper, ONBOARDING_DESIGN.canvas, "#F4EFE8"]}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.lavenderWash} />
      <View style={styles.paperLight} />
    </View>
  );
}

const styles = StyleSheet.create({
  lavenderWash: {
    position: "absolute",
    width: "78%",
    height: "62%",
    right: "-22%",
    top: "28%",
    borderRadius: 999,
    backgroundColor: "rgba(222,214,234,0.56)",
    transform: [{ rotate: "-17deg" }],
  },
  paperLight: {
    position: "absolute",
    width: "72%",
    height: "38%",
    left: "-24%",
    top: "5%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.42)",
    transform: [{ rotate: "14deg" }],
  },
});
