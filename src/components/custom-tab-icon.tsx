import React, { useEffect } from "react";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type SvgIconProps = {
  width?: number;
  height?: number;
  opacity?: number;
};

type CustomTabIconProps = {
  focused: boolean;
  Icon: React.ComponentType<SvgIconProps>;
};

export function CustomTabIcon({ focused, Icon }: CustomTabIconProps) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (focused) {
      scale.value = withSequence(
        withTiming(0.85, {
          duration: 100,
        }),
        withSpring(1, {
          duration: 500,
          dampingRatio: 0.6,
          mass: 1,
          overshootClamping: false,
          energyThreshold: 6e-9,
          velocity: 0,
          reduceMotion: ReduceMotion.System,
        }),
      );
    }
  }, [focused]);
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  return (
    <Animated.View
      className={`p-2 rounded-lg items-center justify-center ${focused ? "bg-[#DDF4FF] border-[2] border-[#63C9F9]" : ""}`}
      style={[iconStyle]}
    >
      <Icon width={26} height={26} opacity={1} />
    </Animated.View>
  );
}
