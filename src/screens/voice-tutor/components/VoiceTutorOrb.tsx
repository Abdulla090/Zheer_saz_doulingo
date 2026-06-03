import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { type SharedValue,
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { LiveTutorStatus } from "@/hooks/use-gemini-live-tutor";

type Props = {
  status: LiveTutorStatus;
  speaking: boolean;
  listening: boolean;
  size?: number;
};

export function VoiceTutorOrb({ status, speaking, listening, size = 160 }: Props) {
  const r = size / 2;

  const ring1Scale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0);
  const ring2Scale = useSharedValue(1);
  const ring2Opacity = useSharedValue(0);
  const ring3Scale = useSharedValue(1);
  const ring3Opacity = useSharedValue(0);

  const coreScale = useSharedValue(1);
  const arcRot = useSharedValue(0);

  const isThinking = status === "connecting";

  useEffect(() => {
    cancelAnimation(ring1Scale); cancelAnimation(ring1Opacity);
    cancelAnimation(ring2Scale); cancelAnimation(ring2Opacity);
    cancelAnimation(ring3Scale); cancelAnimation(ring3Opacity);
    cancelAnimation(coreScale);
    cancelAnimation(arcRot);

    if (speaking) {
      // fast pulse core
      coreScale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 340, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.97, { duration: 340, easing: Easing.inOut(Easing.quad) }),
        ), -1, false,
      );
      // fast bright ripple rings
      const ripple = (
        scale: SharedValue<number>,
        opacity: SharedValue<number>,
        delay: number,
      ) => {
        setTimeout(() => {
          scale.value = withRepeat(
            withSequence(
              withTiming(1, { duration: 0 }),
              withTiming(1.75, { duration: 1400, easing: Easing.out(Easing.quad) }),
            ), -1, false,
          );
          opacity.value = withRepeat(
            withSequence(
              withTiming(0.5, { duration: 0 }),
              withTiming(0, { duration: 1400, easing: Easing.out(Easing.quad) }),
            ), -1, false,
          );
        }, delay);
      };
      ripple(ring1Scale, ring1Opacity, 0);
      ripple(ring2Scale, ring2Opacity, 450);
      ripple(ring3Scale, ring3Opacity, 900);

    } else if (listening) {
      // gentle slower pulse
      coreScale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 580, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.98, { duration: 580, easing: Easing.inOut(Easing.quad) }),
        ), -1, false,
      );
      const ripple = (
        scale: SharedValue<number>,
        opacity: SharedValue<number>,
        delay: number,
      ) => {
        setTimeout(() => {
          scale.value = withRepeat(
            withSequence(
              withTiming(1, { duration: 0 }),
              withTiming(1.6, { duration: 2000, easing: Easing.out(Easing.cubic) }),
            ), -1, false,
          );
          opacity.value = withRepeat(
            withSequence(
              withTiming(0.38, { duration: 0 }),
              withTiming(0, { duration: 2000, easing: Easing.out(Easing.cubic) }),
            ), -1, false,
          );
        }, delay);
      };
      ripple(ring1Scale, ring1Opacity, 0);
      ripple(ring2Scale, ring2Opacity, 650);
      ripple(ring3Scale, ring3Opacity, 1300);

    } else if (isThinking) {
      // slow breathing + spinning arc
      coreScale.value = withRepeat(
        withSequence(
          withTiming(1.035, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.975, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
        ), -1, false,
      );
      arcRot.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.linear }), -1, false,
      );
      // single slow ring
      ring1Scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.45, { duration: 2400, easing: Easing.out(Easing.quad) }),
        ), -1, false,
      );
      ring1Opacity.value = withRepeat(
        withSequence(
          withTiming(0.25, { duration: 0 }),
          withTiming(0, { duration: 2400, easing: Easing.out(Easing.quad) }),
        ), -1, false,
      );

    } else {
      // idle — snap back
      coreScale.value = withSpring(1, { damping: 14, stiffness: 120 });
      ring1Opacity.value = withTiming(0, { duration: 300 });
      ring2Opacity.value = withTiming(0, { duration: 300 });
      ring3Opacity.value = withTiming(0, { duration: 300 });
      arcRot.value = withTiming(0, { duration: 300 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speaking, listening, status]);

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coreScale.value }],
  }));
  const r1Style = useAnimatedStyle(() => ({
    opacity: ring1Opacity.value,
    transform: [{ scale: ring1Scale.value }],
  }));
  const r2Style = useAnimatedStyle(() => ({
    opacity: ring2Opacity.value,
    transform: [{ scale: ring2Scale.value }],
  }));
  const r3Style = useAnimatedStyle(() => ({
    opacity: ring3Opacity.value,
    transform: [{ scale: ring3Scale.value }],
  }));
  const arcStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arcRot.value * 360}deg` }],
  }));

  // ring border brightens when listening vs default
  const ringBorder = listening
    ? "rgba(248,250,252,0.35)"
    : speaking
      ? "rgba(248,250,252,0.45)"
      : "rgba(255,255,255,0.15)";

  const containerSize = size + 100;

  return (
    <View style={{ width: containerSize, height: containerSize, alignItems: "center", justifyContent: "center" }}>
      {/* ripple rings — border-only circles, NO fill, NO LinearGradient inside Animated.View */}
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: r, borderColor: ringBorder },
          r3Style,
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: r, borderColor: ringBorder },
          r2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: r, borderColor: ringBorder },
          r1Style,
        ]}
      />

      {/* thinking spinner — thin arc, white top edge */}
      {isThinking && (
        <Animated.View
          style={[
            styles.arc,
            { width: size + 14, height: size + 14, borderRadius: (size + 14) / 2 },
            arcStyle,
          ]}
        />
      )}

      {/* core sphere — gradient ONLY inside non-animated View so it stays circular */}
      <Animated.View
        style={[
          styles.coreWrap,
          {
            width: size,
            height: size,
            borderRadius: r,
            ...(Platform.OS === "ios"
              ? {
                  shadowColor: "#6B8FFF",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.55,
                  shadowRadius: 32,
                }
              : {}),
          },
          coreStyle,
        ]}
      >
        <LinearGradient
          colors={["#FFFFFF", "#D4DCFF", "#8AA4F8"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.coreGradient}
        >
          {/* upper specular highlight */}
          <View style={styles.specular} />
          {/* centre soft glow */}
          <View style={styles.glowDot} />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  arc: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "transparent",
    borderTopColor: "#FFFFFF",
  },
  coreWrap: {
    overflow: "hidden",
    elevation: 18,
  },
  coreGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  specular: {
    position: "absolute",
    top: "7%",
    left: "15%",
    width: "50%",
    height: "35%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.55)",
    transform: [{ rotate: "-15deg" }],
  },
  glowDot: {
    width: "32%",
    height: "32%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.20)",
  },
});
