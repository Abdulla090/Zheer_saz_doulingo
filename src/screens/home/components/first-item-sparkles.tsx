import React from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

type SparkleConfig = {
  left: number;
  top: number;
  size: number;
  offset: number;
  dx: number;
  dy: number;
  path: string;
};

const SPARKLE_COLOR = "#FFE8A6";
const CYCLE_MS = 1450;
const SPARKLES: SparkleConfig[] = [
  {
    left: 42,
    top: 10,
    size: 16,
    offset: 0.0,
    dx: 5,
    dy: -4,
    path: "M8 1.2L9.8 5.4L14 7.2L9.8 9L8 13.2L6.2 9L2 7.2L6.2 5.4Z",
  },
  {
    left: 16,
    top: 24,
    size: 12,
    offset: 0.17,
    dx: -5,
    dy: 3,
    path: "M6 0.9L7.3 4L10.4 5.3L7.3 6.6L6 9.7L4.7 6.6L1.6 5.3L4.7 4Z",
  },
  {
    left: 54,
    top: 42,
    size: 14,
    offset: 0.33,
    dx: 4,
    dy: -5,
    path: "M7 1L8.5 4.7L12.2 6.2L8.5 7.7L7 11.4L5.5 7.7L1.8 6.2L5.5 4.7Z",
  },
  {
    left: 10,
    top: 52,
    size: 10,
    offset: 0.5,
    dx: 4,
    dy: -3,
    path: "M5 0.7L6.1 3.2L8.6 4.3L6.1 5.4L5 7.9L3.9 5.4L1.4 4.3L3.9 3.2Z",
  },
  {
    left: 31,
    top: 58,
    size: 11,
    offset: 0.67,
    dx: -4,
    dy: 4,
    path: "M5.5 0.8L6.7 3.6L9.5 4.8L6.7 6L5.5 8.8L4.3 6L1.5 4.8L4.3 3.6Z",
  },
  {
    left: 62,
    top: 26,
    size: 9,
    offset: 0.83,
    dx: 3,
    dy: -4,
    path: "M4.5 0.6L5.5 2.9L7.8 3.9L5.5 4.9L4.5 7.2L3.5 4.9L1.2 3.9L3.5 2.9Z",
  },
];

const SparkleSprite = ({
  progress,
  config,
}: {
  progress: SharedValue<number>;
  config: SparkleConfig;
}) => {
  const style = useAnimatedStyle(() => {
    const phase = (progress.value + config.offset) % 1;
    const scale = interpolate(phase, [0, 0.36, 0.72, 1], [0.2, 1.1, 0.22, 0.22]);
    const opacity = interpolate(phase, [0, 0.12, 0.56, 0.74, 1], [0, 0.95, 0.45, 0, 0]);
    const translateX = interpolate(phase, [0, 0.72, 0.86, 1], [0, 0, config.dx, config.dx]);
    const translateY = interpolate(phase, [0, 0.72, 0.86, 1], [0, 0, config.dy, config.dy]);
    return {
      opacity,
      transform: [{ scale }, { translateX }, { translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: config.left,
          top: config.top,
          width: config.size,
          height: config.size,
        },
        style,
      ]}
    >
      <Svg width={config.size} height={config.size}>
        <Path d={config.path} fill={SPARKLE_COLOR} />
      </Svg>
    </Animated.View>
  );
};

export const FirstItemSparkles = ({ size }: { size: number }) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: CYCLE_MS, easing: Easing.inOut(Easing.quad) }),
      -1,
      false,
    );
  }, [progress]);

  return (
    <View
      style={{
        pointerEvents: "none" as any,
        position: "absolute",
        left: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        zIndex: 3,
      }}
    >
      {SPARKLES.map((sparkle) => (
        <SparkleSprite
          key={`${sparkle.left}-${sparkle.top}-${sparkle.size}`}
          progress={progress}
          config={sparkle}
        />
      ))}
    </View>
  );
};
