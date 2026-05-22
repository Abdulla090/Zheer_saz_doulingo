/**
 * StaggeredList — Wraps children in staggered entrance animations using Reanimated.
 * Each child animates in with a slight delay, creating an organic cascade effect.
 */

import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { StyleProp, ViewStyle } from "react-native";

type StaggeredListProps = {
  children: React.ReactNode;
  /** Base delay before first item starts animating */
  baseDelay?: number;
  /** Delay between each item */
  stagger?: number;
  /** Slide distance (currently unused by FadeInDown preset, but kept for interface compatibility) */
  distance?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
};

export function StaggeredList({
  children,
  baseDelay = 100,
  stagger = 60,
  distance = 20,
  style,
}: StaggeredListProps) {
  const items = React.Children.toArray(children);

  return (
    <>
      {items.map((child, i) => (
        <Animated.View
          key={i}
          entering={FadeInDown.delay(baseDelay + i * stagger).springify().damping(20).stiffness(140)}
          style={style}
        >
          {child}
        </Animated.View>
      ))}
    </>
  );
}
