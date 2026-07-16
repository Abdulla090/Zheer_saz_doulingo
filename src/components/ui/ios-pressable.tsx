import React, { forwardRef } from "react";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  CSS_PRESS_MS,
  IOS_BUTTON_PRESS_OPACITY,
  IOS_BUTTON_PRESS_SCALE,
  IOS_BUTTON_PRESS_Y,
  IOS_BUTTON_RELEASE_SPRING,
} from "../animations/motion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type IOSPressableProps = PressableProps & {
  /** Compatibility with TouchableOpacity while migrating older controls. */
  activeOpacity?: number;
  pressScale?: number;
};

/** Current iOS compression and release motion without overriding semantic colors. */
export const IOSPressable = forwardRef<View, IOSPressableProps>(
  function IOSPressable(
    {
      activeOpacity = IOS_BUTTON_PRESS_OPACITY,
      pressScale = IOS_BUTTON_PRESS_SCALE,
      disabled,
      onPressIn,
      onPressOut,
      style,
      ...props
    },
    ref,
  ) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const translateY = useSharedValue(0);
    const reduceMotion = useReducedMotion();

    const opacityStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));
    const transformStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    }));

    const resolvedStyle =
      typeof style === "function"
        ? (state: Parameters<typeof style>[0]) => {
            const baseStyle = style(state);
            const hasOwnTransform = Boolean(StyleSheet.flatten(baseStyle)?.transform);
            return [
              baseStyle,
              { borderCurve: "continuous" as const },
              opacityStyle,
              hasOwnTransform ? undefined : transformStyle,
            ];
          }
        : [
            style,
            { borderCurve: "continuous" as const },
            opacityStyle,
            StyleSheet.flatten(style)?.transform ? undefined : transformStyle,
          ];

    return (
      <AnimatedPressable
        ref={ref}
        {...props}
        disabled={disabled}
        onPressIn={(event) => {
          if (reduceMotion) {
            opacity.value = activeOpacity;
          } else {
            scale.value = withTiming(pressScale, { duration: CSS_PRESS_MS });
            opacity.value = withTiming(activeOpacity, { duration: CSS_PRESS_MS });
            translateY.value = withTiming(IOS_BUTTON_PRESS_Y, {
              duration: CSS_PRESS_MS,
            });
          }
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          if (reduceMotion) {
            opacity.value = 1;
          } else {
            scale.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
            opacity.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
            translateY.value = withSpring(0, IOS_BUTTON_RELEASE_SPRING);
          }
          onPressOut?.(event);
        }}
        style={resolvedStyle as PressableProps["style"]}
      />
    );
  },
);
