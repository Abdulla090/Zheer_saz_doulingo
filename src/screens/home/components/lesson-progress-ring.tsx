 
import React, { useEffect, useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { FX_ALLOW_DECORATION } from "../../../utils/native-perf";

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
  progressSegments = 0,
  activeColor = "#B87BEF",
  inactiveColor = "#E1E1E1",
  animatePulse = true,
}: LessonProgressRingProps) => {
  const pulse = useSharedValue(1);
  const clampedProgress = Math.max(0, Math.min(progressSegments, segments));

  /*
   * The ring geometry only depends on its dimensions, so the arc strings are
   * built once per size rather than on every render. This sits on the current
   * lesson inside a scrolling list, where it otherwise re-derives five arcs —
   * trig and string building — each time the row re-renders.
   */
  const arcs = useMemo(() => {
    const center = size / 2;
    const radius = center - strokeWidth / 2 - 2;
    const segmentAngle = 360 / segments;
    const gapAngle = 18;
    const arcSweep = segmentAngle - gapAngle;
    return Array.from({ length: segments }, (_, idx) => {
      const startAngle = idx * segmentAngle + gapAngle / 2;
      return describeArc(
        center,
        center,
        radius,
        startAngle,
        startAngle + arcSweep,
      );
    });
  }, [segments, size, strokeWidth]);

  /*
   * The pulse never stops, so on older hardware it is a permanent tenant on the
   * UI thread — and the frame budget it eats is the same budget the scroll
   * needs. The ring still renders and still shows progress; it just holds still.
   */
  const shouldPulse = animatePulse && FX_ALLOW_DECORATION;

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  useEffect(() => {
    if (!shouldPulse) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(withTiming(1.08, { duration: 900 }), -1, true);
  }, [shouldPulse, pulse]);

  return (
    <Animated.View style={pulseStyle}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((d, idx) => (
          <Path
            key={`ring-segment-${idx}`}
            d={d}
            stroke={idx < clampedProgress ? activeColor : inactiveColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </Svg>
    </Animated.View>
  );
};
