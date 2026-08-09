import React, { useEffect } from "react";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { G } from "react-native-svg";

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

const CROUCH_MS = 180;
const RISE_MS = 400;
/** Long enough to register as hang time, short enough not to stall the loop. */
const HANG_MS = 150;

/** Apex is nearest the viewer; the crouch is pressed into the surface. */
const LIFT_SCALE = 1.06;
const CROUCH_SCALE = 0.97;

/** Widest gap the shadow opens up at the apex. */
const SHADOW_LIFT = 6;
/** The shadow tracks the icon's scale, but only partly, so the two separate. */
const SHADOW_SCALE_FOLLOW = 0.35;

const FALL_SPRING = {
  duration: 560,
  dampingRatio: 0.7,
  mass: 4,
  overshootClamping: false,
  energyThreshold: 6e-9,
  velocity: 0,
  reduceMotion: ReduceMotion.System,
} as const;

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
        // Load up: ease *in*, so the crouch settles rather than snapping.
        withTiming(MOVE_DOWN_Y, {
          duration: CROUCH_MS,
          easing: Easing.in(Easing.quad),
        }),
        // Leap: ease *out*, so it arrives at the apex already slowing down.
        withTiming(
          MOVE_UP_Y,
          { duration: RISE_MS, easing: Easing.out(Easing.cubic) },
          (finished) => {
            if (finished) {
              // Spun at the top of the arc. A five-point star is identical
              // after 72 degrees, so each loop closes without a visible jump.
              rotate.value = withSpring(rotate.value + 72, FALL_SPRING);
            }
          },
        ),
        withDelay(HANG_MS, withSpring(0, FALL_SPRING)),
      ),
      -1,
      false,
    );
  }, [rotate, translateY]);

  const cx = width / 2;
  const cy = height / 2;

  const animatedProps = useAnimatedProps(() => {
    const scale = interpolate(
      translateY.value,
      [MOVE_UP_Y, 0, MOVE_DOWN_Y],
      [LIFT_SCALE, 1, CROUCH_SCALE],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateX: cx },
        { translateY: cy + translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale },
        { translateX: -cx },
        { translateY: -cy },
      ],
    };
  });

  const shadowAnimatedProps = useAnimatedProps(() => {
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
        { translateX: cx },
        { translateY: cy + translateY.value + extraSpace },
        { rotate: `${rotate.value}deg` },
        { scale: 1 + (iconScale - 1) * SHADOW_SCALE_FOLLOW },
        { translateX: -cx },
        { translateY: -cy },
      ],
    };
  });

  return (
    <G>
      {/*
       * The cast shadow doubles this icon's cost: a second copy of the artwork
       * and a second animated group pushing transforms into native on every
       * frame, forever, since the arc never stops. It is pure depth cueing, so
       * older hardware gets the jumping icon without it.
       */}
      {FX_ALLOW_DECORATION ? (
        <AnimatedGroup animatedProps={shadowAnimatedProps}>
          <IconComponent
            fill="rgba(0, 0, 0, 0.3)"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth={1}
            width={width}
            height={height}
          />
        </AnimatedGroup>
      ) : null}

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
