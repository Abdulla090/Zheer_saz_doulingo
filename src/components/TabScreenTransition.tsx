 
import { useTabTransition } from "../context/TabTransitionContext";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
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

      const offset = width * 0.22 * direction;
      translateX.value = offset;
      opacity.value = 1;

      const runAnimation = () => {
        if (Platform.OS === "web") {
          translateX.value = withTiming(0, {
            duration: 320,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          opacity.value = withTiming(1, {
            duration: 220,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
        } else {
          translateX.value = withSpring(0, {
            damping: 34,
            stiffness: 320,
            mass: 0.72,
            overshootClamping: true,
          });
          opacity.value = withSpring(1, {
            damping: 34,
            stiffness: 320,
            mass: 0.72,
            overshootClamping: true,
          });
        }
      };

      if (Platform.OS === "web") {
        const raf = requestAnimationFrame(runAnimation);
        return () => cancelAnimationFrame(raf);
      } else {
        const timer = setTimeout(runAnimation, 16);
        return () => clearTimeout(timer);
      }
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
    backgroundColor: "transparent",
  },
});
