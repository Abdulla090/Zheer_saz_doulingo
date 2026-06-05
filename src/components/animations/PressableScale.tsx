/**
 * PressableScale — Reanimated v4 CSS transition press (UI-thread, no spring bounce).
 * @see animating-react-native-expo skill — CSS transitions for state-driven style changes.
 */

import { LiquidGlassSurface } from "@/components/LiquidGlassSurface";
import React, { useState } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { hapticImpact } from "@/utils/haptics";
import * as Haptics from "expo-haptics";
import { cssPressStyle, cssReleaseStyle } from "./motion";

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
  const [pressed, setPressed] = useState(false);

  const animatedShell = (
    <Animated.View
      style={[
        glass ? undefined : style,
        {
          transform: [{ scale: pressed ? scaleDown : 1 }],
          ...(pressed ? cssPressStyle : cssReleaseStyle),
        },
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
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
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
