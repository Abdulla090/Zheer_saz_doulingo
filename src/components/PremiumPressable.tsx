/* eslint-disable react-hooks/immutability -- Reanimated SharedValue writes in press handlers */
import { Motion } from "@/screens/lesson/games/game-design";
import React from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** 0.96 default — physical press without overshoot */
  pressScale?: number;
};

/** Spring press feedback for custom controls (tabs, rows, chips). No haptic. */
export function PremiumPressable({
  children,
  style,
  pressScale = 0.96,
  onPressIn,
  onPressOut,
  android_ripple,
  ...rest
}: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        {...rest}
        onPressIn={(e) => {
          scale.value = withSpring(pressScale, Motion.soft);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withSpring(1, Motion.soft);
          onPressOut?.(e);
        }}
        android_ripple={
          android_ripple ?? { color: "rgba(43, 89, 243, 0.12)", borderless: false }
        }
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
