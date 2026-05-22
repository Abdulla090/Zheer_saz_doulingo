/**
 * AnimatedCard — A Reanimated-powered card with entrance animation and optional blur.
 * Provides staggered fade-in-up animations that feel organic and premium.
 */

import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, { FadeInUp, FadeInDown, FadeInLeft, FadeInRight } from "react-native-reanimated";

type AnimatedCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Delay index for staggered entrance (each increment = 80ms) */
  index?: number;
  /** Base delay in ms before animation starts */
  delay?: number;
  /** Animation entrance direction */
  direction?: "up" | "down" | "left" | "right";
  /** Distance in pixels for slide animation */
  distance?: number;
};

export function AnimatedCard({
  children,
  style,
  index = 0,
  delay = 0,
  direction = "up",
}: AnimatedCardProps) {
  const totalDelay = delay + index * 80;
  
  const entering = (() => {
    switch (direction) {
      case "up":
        return FadeInDown.delay(totalDelay).springify().damping(18).stiffness(120).mass(0.9);
      case "down":
        return FadeInUp.delay(totalDelay).springify().damping(18).stiffness(120).mass(0.9);
      case "left":
        return FadeInRight.delay(totalDelay).springify().damping(18).stiffness(120).mass(0.9);
      case "right":
        return FadeInLeft.delay(totalDelay).springify().damping(18).stiffness(120).mass(0.9);
    }
  })();

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
