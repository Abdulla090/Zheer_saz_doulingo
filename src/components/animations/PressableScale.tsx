/**
 * PressableScale — Spring-based press animation using RN Pressable + Reanimated.
 * Avoids GestureDetector so it works reliably inside tab bars, lists, and release APKs.
 */

import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ReduceMotion,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleDown?: number;
  haptic?: boolean;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  disabled?: boolean;
};

const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
  reduceMotion: ReduceMotion.System,
};

function fireHaptic(style: Haptics.ImpactFeedbackStyle) {
  void Haptics.impactAsync(style).catch(() => {});
}

export function PressableScale({
  children,
  onPress,
  onLongPress,
  style,
  scaleDown = 0.95,
  haptic = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  disabled = false,
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(scaleDown, springConfig);
        opacity.value = withSpring(0.9, springConfig);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springConfig);
        opacity.value = withSpring(1, springConfig);
      }}
      onPress={() => {
        if (haptic) fireHaptic(hapticStyle);
        onPress?.();
      }}
      onLongPress={() => {
        if (haptic) fireHaptic(hapticStyle);
        onLongPress?.();
      }}
      style={[style, animatedStyle, disabled && { opacity: 0.5 }]}
    >
      {children}
    </AnimatedPressable>
  );
}
