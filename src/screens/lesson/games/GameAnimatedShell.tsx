import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import {
  enterCard,
  enterFooter,
  enterHeader,
  enterHint,
  enterOption,
  enterPop,
} from "./game-motion";

type Props = { children: React.ReactNode; style?: StyleProp<ViewStyle> };

export function GameRoot({ children, style }: Props) {
  return <Animated.View style={[{ flex: 1 }, style]}>{children}</Animated.View>;
}

export function GameHeader({ children }: Props) {
  return (
    <Animated.View entering={enterHeader(0)}>
      {children}
    </Animated.View>
  );
}

export function GameHint({ children, delay = 100 }: Props & { delay?: number }) {
  return (
    <Animated.View entering={enterHint(delay)}>
      {children}
    </Animated.View>
  );
}

export function GameCard({ children, style, delay = 60 }: Props & { delay?: number }) {
  return (
    <Animated.View entering={enterCard(delay)} style={style}>
      {children}
    </Animated.View>
  );
}

export function GameOption({ index, children, baseDelay = 120 }: Props & { index: number; baseDelay?: number }) {
  return (
    <Animated.View entering={enterOption(index, baseDelay)}>
      {children}
    </Animated.View>
  );
}

export function GameFooter({ children, delay = 280 }: Props & { delay?: number }) {
  return (
    <Animated.View entering={enterFooter(delay)}>
      {children}
    </Animated.View>
  );
}

export function GamePopIn({ children }: Props) {
  return (
    <Animated.View entering={enterPop()}>
      {children}
    </Animated.View>
  );
}
