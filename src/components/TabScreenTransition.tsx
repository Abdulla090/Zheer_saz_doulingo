/* eslint-disable react-hooks/immutability */
import { useTabTransition } from "@/context/TabTransitionContext";
import { Motion } from "@/screens/lesson/games/game-design";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  children: React.ReactNode;
};

/**
 * Horizontal enter transition aligned with tab bar position (left/center/right).
 */
export function TabScreenTransition({ children }: Props) {
  const { width } = useWindowDimensions();
  const { consumeDirection } = useTabTransition();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      const direction = consumeDirection();
      if (direction === 0) {
        translateX.value = 0;
        opacity.value = 1;
        return;
      }

      const offset = Math.min(width * 0.28, 120) * direction;
      translateX.value = offset;
      opacity.value = 0.92;
      translateX.value = withSpring(0, Motion.soft);
      opacity.value = withSpring(1, Motion.soft);
    }, [consumeDirection, opacity, translateX, width]),
  );

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.fill, animStyle]}>{children}</Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
