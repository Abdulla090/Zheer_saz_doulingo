/**
 * PressableScale — Reanimated v4 scale feedback (UI-thread, no spring bounce).
 */

import { LiquidGlassSurface } from "../LiquidGlassSurface";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { hapticImpact } from "../../utils/haptics";
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
  accessibilityRole?: string;
  accessibilityLabel?: string;
};

function fireHaptic(style: Haptics.ImpactFeedbackStyle) {
  hapticImpact(style);
}

function extractLayoutStyles(style: any) {
  if (!style) return undefined;
  const flat = StyleSheet.flatten(style);
  const layout: any = {};
  if (flat.flex !== undefined) layout.flex = flat.flex;
  if (flat.flexGrow !== undefined) layout.flexGrow = flat.flexGrow;
  if (flat.flexShrink !== undefined) layout.flexShrink = flat.flexShrink;
  if (flat.flexBasis !== undefined) layout.flexBasis = flat.flexBasis;
  if (flat.width !== undefined) layout.width = flat.width;
  if (flat.height !== undefined) layout.height = flat.height;
  if (flat.margin !== undefined) layout.margin = flat.margin;
  if (flat.marginHorizontal !== undefined) layout.marginHorizontal = flat.marginHorizontal;
  if (flat.marginVertical !== undefined) layout.marginVertical = flat.marginVertical;
  if (flat.marginTop !== undefined) layout.marginTop = flat.marginTop;
  if (flat.marginBottom !== undefined) layout.marginBottom = flat.marginBottom;
  if (flat.marginLeft !== undefined) layout.marginLeft = flat.marginLeft;
  if (flat.marginRight !== undefined) layout.marginRight = flat.marginRight;
  if (flat.position !== undefined) layout.position = flat.position;
  if (flat.top !== undefined) layout.top = flat.top;
  if (flat.bottom !== undefined) layout.bottom = flat.bottom;
  if (flat.left !== undefined) layout.left = flat.left;
  if (flat.right !== undefined) layout.right = flat.right;
  if (flat.alignSelf !== undefined) layout.alignSelf = flat.alignSelf;
  return layout;
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
  accessibilityRole,
  accessibilityLabel,
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const layoutStyle = React.useMemo(() => extractLayoutStyles(style), [style]);

  const animatedShell = (
    <Animated.View
      style={[
        glass ? undefined : style,
        { width: "100%" },
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
      accessibilityRole={accessibilityRole as any}
      accessibilityLabel={accessibilityLabel}
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
      style={[
        layoutStyle,
        disabled ? { opacity: 0.5 } : undefined
      ]}
    >
      {animatedShell}
    </Pressable>
  );
}
