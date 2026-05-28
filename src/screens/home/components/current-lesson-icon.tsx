import React, { useEffect } from "react";
import { View } from "react-native";
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
  children?: React.ReactNode;
  IconComponent?: React.ComponentType<any>;
  color?: string;
  width?: number;
  height?: number;
  active?: boolean;
};

export const CurrentLessonIcon = ({
  children,
  IconComponent,
  color = "#FFFFFF",
  width = 24,
  height = 24,
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

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={bounceStyle}>
      {children ? (
        children
      ) : IconComponent ? (
        <View style={{ width, height, alignItems: "center", justifyContent: "center" }}>
          <IconComponent
            fill={color}
            stroke={color}
            strokeWidth={1}
            width={width}
            height={height}
          />
        </View>
      ) : null}
    </Animated.View>
  );
};
