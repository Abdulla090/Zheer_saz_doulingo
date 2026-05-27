import React, { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { G } from "react-native-svg";

type CurrentLessonIconProps = {
  IconComponent: React.ComponentType<any>;
  color: string;
  width: number;
  height: number;
  active?: boolean;
};

const AnimatedGroup = Animated.createAnimatedComponent(G);

export const CurrentLessonIcon = ({
  IconComponent,
  color,
  width,
  height,
  active = true,
}: CurrentLessonIconProps) => {
  const translateY = useSharedValue(0);
  const cx = width / 2;
  const cy = height / 2;

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

  const animatedProps = useAnimatedProps(() => ({
    transform: [
      { translateX: cx },
      { translateY: cy + translateY.value },
      { translateX: -cx },
      { translateY: -cy },
    ],
  }));

  return (
    <AnimatedGroup animatedProps={animatedProps}>
      <IconComponent
        fill={color}
        stroke={color}
        strokeWidth={1}
        width={width}
        height={height}
      />
    </AnimatedGroup>
  );
};
