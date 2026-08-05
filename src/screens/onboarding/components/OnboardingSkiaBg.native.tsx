import { Canvas, Fill, LinearGradient, vec } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import type { SharedValue } from "react-native-reanimated";

import { ONBOARDING_DESIGN } from "./onboarding-design";

/**
 * Onboarding canvas background.
 *
 * Previously this morphed three organic shapes and a blur-masked glow across
 * the viewport as the user paged, synced to scroll offset. Five animated
 * properties firing on every scroll frame for a background that sat behind
 * content the user was reading.
 *
 * Now it is a single static gradient — no shape morphs, no glow repositioning,
 * no scroll coupling. Simpler to render, and the slides remain the subject.
 */
export function OnboardingSkiaBg({
  scrollX: _scrollX,
}: {
  scrollX: SharedValue<number>;
}) {
  const { width, height } = useWindowDimensions();

  return (
    <Canvas pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={[ONBOARDING_DESIGN.paper, ONBOARDING_DESIGN.canvas, "#F3EEE7"]}
        />
      </Fill>
    </Canvas>
  );
}
