import {
  BlurMask,
  Canvas,
  Circle,
  Fill,
  Group,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import {
  Extrapolation,
  interpolate,
  useDerivedValue,
  type SharedValue,
} from "react-native-reanimated";

import { ONBOARDING_DESIGN } from "./onboarding-design";

export function OnboardingSkiaBg({
  scrollX,
}: {
  scrollX: SharedValue<number>;
  slideIndex?: number;
}) {
  const { width, height } = useWindowDimensions();

  const washes = useMemo(() => {
    const first = Skia.Path.Make();
    first.moveTo(width * 0.36, height * 0.24);
    first.cubicTo(width * 0.78, height * 0.14, width * 1.18, height * 0.28, width * 1.08, height * 0.63);
    first.cubicTo(width * 0.97, height * 0.9, width * 0.42, height * 0.92, width * 0.2, height * 0.66);
    first.close();

    const second = Skia.Path.Make();
    second.moveTo(width * 0.58, height * 0.18);
    second.cubicTo(width * 1.04, height * 0.2, width * 1.16, height * 0.64, width * 0.86, height * 0.92);
    second.cubicTo(width * 0.62, height * 1.04, width * 0.18, height * 0.76, width * 0.28, height * 0.48);
    second.close();

    const third = Skia.Path.Make();
    third.moveTo(width * 0.08, height * 0.7);
    third.cubicTo(width * 0.28, height * 0.42, width * 0.74, height * 0.3, width * 1.08, height * 0.38);
    third.lineTo(width * 1.08, height * 0.95);
    third.cubicTo(width * 0.56, height * 1.03, width * 0.12, height * 0.96, width * 0.08, height * 0.7);
    third.close();
    return [first, second, third];
  }, [height, width]);

  const page = useDerivedValue(() => Math.min(2, Math.max(0, scrollX.value / Math.max(width, 1))));
  const wash0 = useDerivedValue(() => interpolate(page.value, [0, 1], [0.7, 0.12], Extrapolation.CLAMP));
  const wash1 = useDerivedValue(() => interpolate(page.value, [0, 1, 2], [0.06, 0.72, 0.08], Extrapolation.CLAMP));
  const wash2 = useDerivedValue(() => interpolate(page.value, [1, 2], [0.08, 0.76], Extrapolation.CLAMP));
  const glowX = useDerivedValue(() => interpolate(page.value, [0, 1, 2], [width * 0.18, width * 0.84, width * 0.58]));
  const glowY = useDerivedValue(() => interpolate(page.value, [0, 1, 2], [height * 0.16, height * 0.42, height * 0.76]));

  return (
    <Canvas pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={[ONBOARDING_DESIGN.paper, ONBOARDING_DESIGN.canvas, "#F3EEE7"]}
        />
      </Fill>
      <Group>
        <Path path={washes[0]} color="#E4DDEA" opacity={wash0} />
        <Path path={washes[1]} color="#E8E1EE" opacity={wash1} />
        <Path path={washes[2]} color="#DED6E8" opacity={wash2} />
      </Group>
      <Circle cx={glowX} cy={glowY} r={Math.max(width, height) * 0.24} color="rgba(255,255,255,0.34)">
        <BlurMask blur={54} style="normal" />
      </Circle>
    </Canvas>
  );
}
