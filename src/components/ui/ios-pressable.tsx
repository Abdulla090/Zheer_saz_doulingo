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
  /** Set to true in heavy virtualized lists to bypass Reanimated shared value allocation */
  inList?: boolean;
};

/** Current iOS compression and release motion without overriding semantic colors. */
export const IOSPressable = forwardRef<View, IOSPressableProps>(
  function IOSPressable(
    {
      activeOpacity = IOS_BUTTON_PRESS_OPACITY,
      pressScale = IOS_BUTTON_PRESS_SCALE,
      inList = false,
      disabled,
      onPressIn,
      onPressOut,
      style,
      ...props
    },
    ref,
  ) {
    if (inList) {
      return (
        <Pressable
          ref={ref}
          {...props}
          disabled={disabled}
          /*
           * Forward the press callbacks explicitly. They are destructured out of
           * `props` above (so this branch can skip Reanimated), which silently
           * dropped them: any `inList` consumer running its own press animation
           * off onPressIn/onPressOut got no events at all. The path nodes were
           * built exactly that way, so their 3D press travel never ran.
           */
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={(state) => {
            const baseStyle = typeof style === "function" ? style(state) : style;
            return [
              baseStyle,
              { borderCurve: "continuous" as const },
              state.pressed && { opacity: activeOpacity },
            ];
          }}
        />
      );
    }
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
