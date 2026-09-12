import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { FX_ALLOW_DECORATION } from "../../../utils/native-perf";

type CurrentLessonIconProps = {
  IconComponent: React.ComponentType<any>;
  color: string;
  width: number;
  height: number;
};

/*
 * A thrown-object arc rather than a bob: crouch, leap, hang, fall.
 *
 * The hang is the part that sells it. Anything thrown spends most of its time
 * near the top — it decelerates into the apex, floats, then accelerates away —
 * so a symmetric up-and-down reads as a mechanical oscillation instead of a
 * jump. The rise eases out into the apex, `HANG_MS` holds it there, and the
 * fall is a spring so it lands with some weight rather than at constant speed.
 *
 * Depth comes from two things moving apart: the icon scales up as it rises, as
 * if coming toward the viewer, while its cast shadow drops further behind it.
 * Neither is large on its own — together they are what makes a flat SVG look
 * like it left the surface.
 */
const MOVE_DOWN_Y = 5;
const MOVE_UP_Y = -8;

// Thrown-object flight timing: crouch -> leap -> hang -> soft landing
const CROUCH_MS = 180;
const RISE_MS = 400;
/** Long enough to register as hang time, short enough not to stall the loop. */
const HANG_MS = 150;
const FALL_MS = 560;

/** Apex is nearest the viewer; the crouch is pressed into the surface. */
const LIFT_SCALE = 1.06;
const CROUCH_SCALE = 0.97;

/** Widest gap the shadow opens up at the apex. */
const SHADOW_LIFT = 6;
/** The shadow tracks the icon's scale, but only partly, so the two separate. */
const SHADOW_SCALE_FOLLOW = 0.35;

export const CurrentLessonIcon = ({
  IconComponent,
  color,
  width,
  height,
}: CurrentLessonIconProps) => {
  const reduceMotion = useReducedMotion();
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      translateY.value = 0;
      rotate.value = 0;
      return;
    }

    // 1. Vertical thrown-object arc: crouch -> leap -> hang -> physical landing bounce
    translateY.value = withRepeat(
      withSequence(
        // Load up: ease *in*, so the crouch settles rather than snapping.
        withTiming(MOVE_DOWN_Y, {
          duration: CROUCH_MS,
          easing: Easing.in(Easing.quad),
        }),
        // Leap: ease *out*, so it arrives at the apex already slowing down.
        withTiming(MOVE_UP_Y, {
          duration: RISE_MS,
          easing: Easing.out(Easing.cubic),
        }),
        // Hang & Fall: hold at apex, then soft spring-like overshoot landing to 0
        withDelay(
          HANG_MS,
          withTiming(0, {
            duration: FALL_MS,
            easing: Easing.bezier(0.34, 1.3, 0.64, 1),
          }),
        ),
      ),
      -1,
      false,
    );

    // 2. Synchronized spin: waits for crouch, spins 72 degrees through flight, resets seamlessly.
    // A 5-pointed star is identical at 72 degrees, so 72deg and 0deg are visually equivalent.
    // Driving this independently eliminates UI-thread callback bridge crossing and NaN calculations.
    rotate.value = withRepeat(
      withSequence(
        withDelay(
          CROUCH_MS,
          withTiming(72, {
            duration: RISE_MS + HANG_MS + FALL_MS,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        ),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
    };
  }, [reduceMotion, rotate, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [MOVE_UP_Y, 0, MOVE_DOWN_Y],
      [LIFT_SCALE, 1, CROUCH_SCALE],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale },
      ],
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    /*
     * Monotonic in the icon's height: the gap is widest at the apex and closes
     * to nothing at the crouch, where the icon is pressed into the surface.
     */
    const extraSpace = interpolate(
      translateY.value,
      [MOVE_UP_Y, MOVE_DOWN_Y],
      [SHADOW_LIFT, 0],
      Extrapolation.CLAMP,
    );
    const iconScale = interpolate(
      translateY.value,
      [MOVE_UP_Y, 0, MOVE_DOWN_Y],
      [LIFT_SCALE, 1, CROUCH_SCALE],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateY: translateY.value + extraSpace },
        { rotate: `${rotate.value}deg` },
        { scale: 1 + (iconScale - 1) * SHADOW_SCALE_FOLLOW },
      ],
    };
  });

  return (
    <View style={{ width, height, alignItems: "center", justifyContent: "center" }}>
      {FX_ALLOW_DECORATION ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { alignItems: "center", justifyContent: "center" },
            shadowAnimatedStyle,
          ]}
        >
          <IconComponent
            color="rgba(0, 0, 0, 0.3)"
            fill="rgba(0, 0, 0, 0.3)"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth={1}
            width={width}
            height={height}
          />
        </Animated.View>
      ) : null}

      <Animated.View
        style={[
          { width, height, alignItems: "center", justifyContent: "center" },
          animatedStyle,
        ]}
      >
        <IconComponent
          color={color}
          fill={color}
          stroke={color}
          strokeWidth={1}
          width={width}
          height={height}
        />
      </Animated.View>
    </View>
  );
};
