import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";

import { ONBOARDING_DESIGN } from "./onboarding-design";

/** Web counterpart of the native canvas — the same flat gradient, no washes. */
export function OnboardingSkiaBg({
  scrollX: _scrollX,
}: {
  scrollX: SharedValue<number>;
}) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[ONBOARDING_DESIGN.paper, ONBOARDING_DESIGN.canvas, "#F4EFE8"]}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
