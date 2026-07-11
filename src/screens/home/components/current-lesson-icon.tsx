import React, { useEffect } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { G } from "react-native-svg";

type CurrentLessonIconProps = {
  IconComponent: React.ComponentType<any>;
  color: string;
  width: number;
  height: number;
};

const MOVE_DOWN_Y = 5;
const MOVE_UP_Y = -8;
const AnimatedGroup = Animated.createAnimatedComponent(G);

export const CurrentLessonIcon = ({
  IconComponent,
  color,
  width,
  height,
}: CurrentLessonIconProps) => {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(MOVE_DOWN_Y, { duration: 200 }),
        withTiming(MOVE_UP_Y, { duration: 500 }, (finished) => {
          if (finished) {
            rotate.value = withSpring(rotate.value + 72, {
              duration: 550,
              dampingRatio: 1,
              mass: 4,
              overshootClamping: false,
              energyThreshold: 6e-9,
              velocity: 0,
              reduceMotion: ReduceMotion.System,
            });
          }
        }),
        withSpring(0, {
          duration: 550,
          dampingRatio: 0.7,
          mass: 4,
          overshootClamping: false,
          energyThreshold: 6e-9,
          velocity: 0,
          reduceMotion: ReduceMotion.System,
        }),
      ),
      -1,
      false,
    );
  }, [rotate, translateY]);

  const cx = width / 2;
  const cy = height / 2;

  const animatedProps = useAnimatedProps(() => ({
    transform: [
      { translateX: cx },
      { translateY: cy + translateY.value },
      { rotate: `${rotate.value}deg` },
      { translateX: -cx },
      { translateY: -cy },
    ],
  }));

  const shadowAnimatedProps = useAnimatedProps(() => {
    const extraSpace = interpolate(
      translateY.value,
      [MOVE_UP_Y, 0, -MOVE_DOWN_Y],
      [4, 0, 4],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateX: cx },
        { translateY: cy + translateY.value + extraSpace },
        { rotate: `${rotate.value}deg` },
        { translateX: -cx },
        { translateY: -cy },
      ],
    };
  });

  return (
    <G>
      <AnimatedGroup animatedProps={shadowAnimatedProps}>
        <IconComponent
          fill="rgba(0, 0, 0, 0.3)"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={1}
          width={width}
          height={height}
        />
      </AnimatedGroup>

      <AnimatedGroup animatedProps={animatedProps}>
        <IconComponent
          fill={color}
          stroke={color}
          strokeWidth={1}
          width={width}
          height={height}
        />
      </AnimatedGroup>
    </G>
  );
};
