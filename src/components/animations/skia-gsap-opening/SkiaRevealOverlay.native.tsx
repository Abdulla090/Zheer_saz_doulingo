import {
  BlurMask,
  Canvas,
  Circle,
  Fill,
  Group,
  LinearGradient,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import {
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { OPENING_THEMES, type ScreenOpeningVariant } from "./opening-themes";

type Props = {
  variant: ScreenOpeningVariant;
  playKey: number;
  onComplete?: () => void;
};

export function SkiaRevealOverlay({ variant, playKey, onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const theme = OPENING_THEMES[variant];
  const maxDim = Math.max(width, height, 1);

  const veilOpacity = useSharedValue(1);
  const orb1Scale = useSharedValue(0.12);
  const orb2Scale = useSharedValue(0.08);
  const orb3Scale = useSharedValue(0.1);

  const finish = useMemo(() => () => onComplete?.(), [onComplete]);

  useEffect(() => {
    veilOpacity.value = 1;
    orb1Scale.value = 0.12;
    orb2Scale.value = 0.08;
    orb3Scale.value = 0.1;

    orb1Scale.value = withTiming(1.4, {
      duration: 760,
      easing: Easing.out(Easing.cubic),
    });
    orb2Scale.value = withDelay(
      80,
      withTiming(1.55, { duration: 820, easing: Easing.out(Easing.cubic) }),
    );
    orb3Scale.value = withDelay(
      140,
      withTiming(1.28, { duration: 740, easing: Easing.out(Easing.cubic) }),
    );

    veilOpacity.value = withDelay(
      380,
      withTiming(
        0,
        { duration: 560, easing: Easing.out(Easing.quad) },
        (done) => {
          if (done) runOnJS(finish)();
        },
      ),
    );
  }, [playKey, finish, veilOpacity, orb1Scale, orb2Scale, orb3Scale]);

  const originX = width * theme.origin.x;
  const originY = height * theme.origin.y;

  const orb1R = useDerivedValue(() => maxDim * 0.36 * orb1Scale.value);
  const orb2R = useDerivedValue(() => maxDim * 0.3 * orb2Scale.value);
  const orb3R = useDerivedValue(() => maxDim * 0.24 * orb3Scale.value);

  return (
    <Canvas style={[StyleSheet.absoluteFill, styles.overlay]} pointerEvents="none">
      <Fill opacity={veilOpacity}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={theme.veilGradient}
        />
      </Fill>

      <Group opacity={veilOpacity}>
        <Circle
          cx={originX + width * 0.06}
          cy={originY - height * 0.04}
          r={orb1R}
          color={theme.orbA}
        >
          <BlurMask blur={52} style="normal" />
        </Circle>
        <Circle
          cx={width - width * 0.1}
          cy={originY + height * 0.1}
          r={orb2R}
          color={theme.orbB}
        >
          <BlurMask blur={46} style="normal" />
        </Circle>
        <Circle
          cx={originX}
          cy={originY + height * 0.26}
          r={orb3R}
          color={theme.orbC}
        >
          <BlurMask blur={38} style="normal" />
        </Circle>
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 20,
  },
});
