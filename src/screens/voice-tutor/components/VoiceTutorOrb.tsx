/**
 * @deprecated Prefer MicCaptureOrb + PingoMascot on VoiceTutorScreen.
 * Brand-colored pulse orb (no dark-mode AI sphere).
 */

import { HomePalette } from "../../../components/ui/ios-liquid-home";
import { crossShadow } from "../../../utils/shadows";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { LiveTutorStatus } from "../../../hooks/use-gemini-live-tutor";

const C = HomePalette;

type Props = {
  status: LiveTutorStatus;
  speaking: boolean;
  listening: boolean;
  size?: number;
};

export function VoiceTutorOrb({ status, speaking, listening, size = 120 }: Props) {
  const r = size / 2;
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);
  const coreScale = useSharedValue(1);
  const isThinking = status === "connecting";

  useEffect(() => {
    cancelAnimation(ringScale);
    cancelAnimation(ringOpacity);
    cancelAnimation(coreScale);

    if (speaking || listening) {
      coreScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 480, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.97, { duration: 480, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      );
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.55, { duration: 1600, easing: Easing.out(Easing.quad) }),
        ),
        -1,
        false,
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.35, { duration: 0 }),
          withTiming(0, { duration: 1600, easing: Easing.out(Easing.quad) }),
        ),
        -1,
        false,
      );
    } else if (isThinking) {
      coreScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 900 }),
          withTiming(0.98, { duration: 900 }),
        ),
        -1,
        true,
      );
    } else {
      coreScale.value = withSpring(1, { damping: 14, stiffness: 120 });
      ringOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [coreScale, isThinking, listening, ringOpacity, ringScale, speaking]);

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coreScale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <View style={[styles.wrap, { width: size + 48, height: size + 48 }]}>
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: r },
          ringStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.core,
          {
            width: size,
            height: size,
            borderRadius: r,
            backgroundColor: C.blue,
          },
          crossShadow({
            color: C.blue,
            offsetY: 8,
            blur: 20,
            opacity: 0.28,
            elevation: 8,
          }),
          coreStyle,
        ]}
      >
        <View style={styles.sheen} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(43, 89, 243, 0.35)",
    backgroundColor: "transparent",
  },
  core: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    overflow: "hidden",
  },
  sheen: {
    position: "absolute",
    top: "8%",
    left: "12%",
    width: "55%",
    height: "32%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
});
