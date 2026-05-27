/**
 * AnimatedCard — Fast fade entrance + LinearTransition layout (Reanimated v4).
 */

import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import {
  enterFadeDown,
  enterFadeLeft,
  enterFadeRight,
  enterFadeUp,
  layoutSmooth,
} from "./motion";

type AnimatedCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  index?: number;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
};

export function AnimatedCard({
  children,
  style,
  index = 0,
  delay = 0,
  direction = "up",
}: AnimatedCardProps) {
  const totalDelay = delay + index * 35;

  const entering = (() => {
    switch (direction) {
      case "up":
        return enterFadeDown(totalDelay);
      case "down":
        return enterFadeUp(totalDelay);
      case "left":
        return enterFadeRight(totalDelay);
      case "right":
        return enterFadeLeft(totalDelay);
    }
  })();

  return (
    <Animated.View entering={entering} layout={layoutSmooth} style={style}>
      {children}
    </Animated.View>
  );
}
