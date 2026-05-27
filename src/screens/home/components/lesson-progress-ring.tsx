import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

type LessonProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  segments?: number;
  progressSegments?: number;
  activeColor?: string;
  inactiveColor?: string;
  animatePulse?: boolean;
};

const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angleDegrees: number,
) => {
  const radians = (angleDegrees - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
};

const describeArc = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

export const LessonProgressRing = ({
  size = 94,
  strokeWidth = 6,
  segments = 5,
  progressSegments = 2,
  activeColor = "#B87BEF",
  inactiveColor = "#E1E1E1",
  animatePulse = false,
}: LessonProgressRingProps) => {
  const pulse = useSharedValue(1);
  const clampedProgress = Math.max(0, Math.min(progressSegments, segments));
  const center = size / 2;
  const radius = center - strokeWidth / 2 - 2;
  const segmentAngle = 360 / segments;
  const gapAngle = 18;
  const arcSweep = segmentAngle - gapAngle;
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  useEffect(() => {
    if (!animatePulse) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(withTiming(1.08, { duration: 900 }), -1, true);
  }, [animatePulse, pulse]);

  return (
    <Animated.View style={pulseStyle}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: segments }).map((_, idx) => {
          const startAngle = idx * segmentAngle + gapAngle / 2;
          const endAngle = startAngle + arcSweep;
          return (
            <Path
              key={`ring-segment-${idx}`}
              d={describeArc(center, center, radius, startAngle, endAngle)}
              stroke={idx < clampedProgress ? activeColor : inactiveColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
};
