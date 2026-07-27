/**
 * PressableScale — Reanimated v4 scale feedback (UI-thread, no spring bounce).
 */

import { LiquidGlassSurface } from "../LiquidGlassSurface";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { hapticImpact } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import {
  CSS_PRESS_MS,
  IOS_BUTTON_PRESS_OPACITY,
  IOS_BUTTON_PRESS_SCALE,
  IOS_BUTTON_PRESS_Y,
  IOS_BUTTON_RELEASE_SPRING,
} from "./motion";

export type PressableScaleProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  delayLongPress?: number;
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
  hitSlop?: React.ComponentProps<typeof Pressable>["hitSlop"];
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
  if (flat.marginHorizontal !== undefined)
    layout.marginHorizontal = flat.marginHorizontal;
  if (flat.marginVertical !== undefined)
    layout.marginVertical = flat.marginVertical;
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
  onPressIn,
  onPressOut,
  delayLongPress,
  style,
  scaleDown = IOS_BUTTON_PRESS_SCALE,
  haptic = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  disabled = false,
  glass = false,
  glassRadius = 16,
  accessibilityRole,
  accessibilityLabel,
  hitSlop,
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const layoutStyle = React.useMemo(() => extractLayoutStyles(style), [style]);

  const animatedShell = (
    <Animated.View
      style={[
        glass ? undefined : style,
        { width: "100%", borderCurve: "continuous" },
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
      hitSlop={hitSlop}
      onPressIn={() => {
        onPressIn?.();
        if (reduceMotion) {
          opacity.value = IOS_BUTTON_PRESS_OPACITY;
          return;
        }
        scale.value = withTiming(scaleDown, { duration: CSS_PRESS_MS });
        opacity.value = withTiming(IOS_BUTTON_PRESS_OPACITY, {
          duration: CSS_PRESS_MS,
        });
        translateY.value = withTiming(IOS_BUTTON_PRESS_Y, {
          duration: CSS_PRESS_MS,
        });
      }}
      onPressOut={() => {
        onPressOut?.();
        if (reduceMotion) {
          opacity.value = 1;
          return;
        }
        scale.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
        opacity.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
        translateY.value = withSpring(0, IOS_BUTTON_RELEASE_SPRING);
      }}
      onPress={() => {
        if (haptic) fireHaptic(hapticStyle);
        onPress?.();
      }}
      onLongPress={() => {
        if (haptic) fireHaptic(hapticStyle);
        onLongPress?.();
      }}
      delayLongPress={delayLongPress}
      style={[layoutStyle, disabled ? { opacity: 0.5 } : undefined]}
    >
      {animatedShell}
    </Pressable>
  );
}
