/**
 * PressableScale — Reanimated v4 scale feedback (UI-thread, no spring bounce).
 */

import { LiquidGlassSurface } from "@/components/LiquidGlassSurface";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { hapticImpact } from "@/utils/haptics";
import * as Haptics from "expo-haptics";
import { CSS_PRESS_MS, CSS_RELEASE_MS } from "./motion";

export type PressableScaleProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleDown?: number;
  haptic?: boolean;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  disabled?: boolean;
  /** Neutral buttons — liquid glass + iOS edge shading */
  glass?: boolean;
  glassRadius?: number;
};

function fireHaptic(style: Haptics.ImpactFeedbackStyle) {
  hapticImpact(style);
}

export function PressableScale({
  children,
  onPress,
  onLongPress,
  style,
  scaleDown = 0.96,
  haptic = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  disabled = false,
  glass = false,
  glassRadius = 16,
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedShell = (
    <Animated.View
      style={[
        glass ? undefined : style,
        animatedStyle,
      ]}
    >
      {glass ? (
        <LiquidGlassSurface borderRadius={glassRadius} style={style}>
          {children}
        </LiquidGlassSurface>
      ) : (
        children
      )}
    </Animated.View>
  );

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        scale.value = withTiming(scaleDown, { duration: CSS_PRESS_MS });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: CSS_RELEASE_MS });
      }}
      onPress={() => {
        if (haptic) fireHaptic(hapticStyle);
        onPress?.();
      }}
      onLongPress={() => {
        if (haptic) fireHaptic(hapticStyle);
        onLongPress?.();
      }}
      style={disabled ? { opacity: 0.5 } : undefined}
    >
      {animatedShell}
    </Pressable>
  );
}
