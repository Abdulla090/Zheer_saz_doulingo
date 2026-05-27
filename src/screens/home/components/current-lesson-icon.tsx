import React, { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type CurrentLessonIconProps = {
  children: React.ReactNode;
  active?: boolean;
};

/** Bounce wrapper — animates a View, not SVG groups (Android-safe). */
export const CurrentLessonIcon = ({
  children,
  active = true,
}: CurrentLessonIconProps) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      cancelAnimation(translateY);
      translateY.value = 0;
      return;
    }

    translateY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    return () => cancelAnimation(translateY);
  }, [active, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};
