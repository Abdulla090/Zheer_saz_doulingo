import React, { useEffect } from "react";
import { Platform, View, type ViewProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { useScreenOpeningPlayKey } from "./ScreenOpeningContext";

const STAGGER_MS = 72;
const ENTER_MS = 680;

type Props = ViewProps & {
  children: React.ReactNode;
  index?: number;
};

/**
 * Web: GSAP stagger via data attribute.
 * iOS / Android: Reanimated stagger with the same timing curve, replayed each tab focus.
 */
function AnimatedEnterBlock({
  children,
  index = 0,
  playKey,
  style,
  ...rest
}: Props & { playKey: number }) {
  const delay = index * STAGGER_MS;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(36);
  const scale = useSharedValue(0.96);

  useEffect(() => {
    if (Platform.OS === "web") return;

    opacity.value = 0;
    translateY.value = 36;
    scale.value = 0.96;

    const timing = { duration: ENTER_MS, easing: Easing.out(Easing.cubic) };

    opacity.value = withDelay(delay, withTiming(1, timing));
    translateY.value = withDelay(delay, withTiming(0, timing));
    scale.value = withDelay(delay, withTiming(1, timing));
  }, [playKey, delay, opacity, scale, translateY]);

  const nativeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  if (Platform.OS === "web") {
    return (
      <View
        {...rest}
        {...({ "data-skia-gsap-enter": "" } as object)}
        data-enter-index={index}
        style={[{ opacity: 0 }, style]}
      >
        {children}
      </View>
    );
  }

  return (
    <Animated.View
      {...rest}
      style={[{ backgroundColor: "transparent" }, style, nativeStyle]}
      renderToHardwareTextureAndroid={Platform.OS === "android"}
    >
      {children}
    </Animated.View>
  );
}

export function GsapEnterBlock(props: Props) {
  const playKey = useScreenOpeningPlayKey();

  // Tab screens intentionally omit ScreenOpeningShell. Render them immediately
  // instead of allocating three shared values per section or hiding web content.
  if (playKey === null) {
    const { children, index: _index, style, ...rest } = props;
    return (
      <View {...rest} style={style}>
        {children}
      </View>
    );
  }

  return <AnimatedEnterBlock {...props} playKey={playKey} />;
}
