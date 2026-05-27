/**
 * StaggeredList — Fast staggered fade-in (Reanimated v4, no spring).
 */

import React from "react";
import Animated from "react-native-reanimated";
import { StyleProp, ViewStyle } from "react-native";
import { enterFadeDown, layoutSmooth } from "./motion";

type StaggeredListProps = {
  children: React.ReactNode;
  baseDelay?: number;
  stagger?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
};

export function StaggeredList({
  children,
  baseDelay = 40,
  stagger = 35,
  style,
}: StaggeredListProps) {
  const items = React.Children.toArray(children);

  return (
    <>
      {items.map((child, i) => (
        <Animated.View
          key={i}
          entering={enterFadeDown(baseDelay + i * stagger)}
          layout={layoutSmooth}
          style={style}
        >
          {child}
        </Animated.View>
      ))}
    </>
  );
}
