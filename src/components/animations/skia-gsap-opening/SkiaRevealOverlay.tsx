import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { OPENING_THEMES, type ScreenOpeningVariant } from "./opening-themes";

type Props = {
  variant: ScreenOpeningVariant;
  playKey: number;
  onComplete?: () => void;
};

/** Web reveal — Reanimated orbs + gradient (avoids Skia/Metro web resolution issues). */
export function SkiaRevealOverlay({ variant, playKey, onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const theme = OPENING_THEMES[variant];
  const maxDim = Math.max(width, height, 1);

  const veilOpacity = useSharedValue(1);
  const orb1Scale = useSharedValue(0.12);
  const orb2Scale = useSharedValue(0.08);
  const orb3Scale = useSharedValue(0.1);

  const finish = useMemo(() => () => onComplete?.(), [onComplete]);

  useEffect(() => {
    veilOpacity.value = 1;
    orb1Scale.value = 0.12;
    orb2Scale.value = 0.08;
    orb3Scale.value = 0.1;

    orb1Scale.value = withTiming(1.4, {
      duration: 760,
      easing: Easing.out(Easing.cubic),
    });
    orb2Scale.value = withDelay(
      80,
      withTiming(1.55, { duration: 820, easing: Easing.out(Easing.cubic) }),
    );
    orb3Scale.value = withDelay(
      140,
      withTiming(1.28, { duration: 740, easing: Easing.out(Easing.cubic) }),
    );

    veilOpacity.value = withDelay(
      380,
      withTiming(
        0,
        { duration: 560, easing: Easing.out(Easing.quad) },
        (done) => {
          if (done) runOnJS(finish)();
        },
      ),
    );
  }, [playKey, finish, veilOpacity, orb1Scale, orb2Scale, orb3Scale]);

  const originX = width * theme.origin.x;
  const originY = height * theme.origin.y;

  const veilStyle = useAnimatedStyle(() => ({ opacity: veilOpacity.value }));

  const orb1Style = useAnimatedStyle(() => ({
    opacity: veilOpacity.value * 0.55,
    transform: [{ scale: orb1Scale.value }],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    opacity: veilOpacity.value * 0.5,
    transform: [{ scale: orb2Scale.value }],
  }));

  const orb3Style = useAnimatedStyle(() => ({
    opacity: veilOpacity.value * 0.45,
    transform: [{ scale: orb3Scale.value }],
  }));

  const orbSize = maxDim * 0.36;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, veilStyle]} pointerEvents="none">
      <LinearGradient
        colors={theme.veilGradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View
        style={[
          styles.orb,
          orb1Style,
          {
            width: orbSize,
            height: orbSize,
            borderRadius: orbSize / 2,
            backgroundColor: theme.orbA,
            left: originX + width * 0.06 - orbSize / 2,
            top: originY - height * 0.04 - orbSize / 2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          orb2Style,
          {
            width: orbSize * 0.85,
            height: orbSize * 0.85,
            borderRadius: (orbSize * 0.85) / 2,
            backgroundColor: theme.orbB,
            right: width * 0.1 - (orbSize * 0.85) / 2,
            top: originY + height * 0.1 - (orbSize * 0.85) / 2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          orb3Style,
          {
            width: orbSize * 0.7,
            height: orbSize * 0.7,
            borderRadius: (orbSize * 0.7) / 2,
            backgroundColor: theme.orbC,
            left: originX - (orbSize * 0.7) / 2,
            top: originY + height * 0.26 - (orbSize * 0.7) / 2,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 20,
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
  },
});
