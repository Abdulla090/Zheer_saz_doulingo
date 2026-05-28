import {
  ChestFlat,
  CoffeeCupFlat,
  DolphinFlat,
} from "@/components/icons/HomeDashboardIcons";
import {
  AiTeacherGameIcon,
  OrderWordsGameIcon,
  PairWordsGameIcon,
  RolePlayGameIcon,
} from "@/components/icons/GameHubIcons";
import { HomeLiquidCard, HomePalette } from "@/components/ui/ios-liquid-home";
import { Motion } from "@/screens/lesson/games/game-design";
import { crossShadow } from "@/utils/shadows";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const C = HomePalette;

export type OnboardingSceneVariant =
  | "welcome"
  | "paths"
  | "practice"
  | "progress"
  | "ready";

function FloatLayer({
  children,
  delay = 0,
  offsetY = 0,
  offsetX = 0,
  depth = 1,
}: {
  children: React.ReactNode;
  delay?: number;
  offsetY?: number;
  offsetX?: number;
  depth?: number;
}) {
  const drift = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      drift.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2400 + delay, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 2400 + delay, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    }, delay);
    return () => clearTimeout(t);
  }, [delay, drift]);

  const style = useAnimatedStyle(() => {
    const y = drift.value * (4 + depth * 2) + offsetY;
    const x = drift.value * (depth * 1.2) + offsetX;
    const scale = 1 - depth * 0.04;
    return {
      transform: [
        { perspective: 900 },
        { translateX: x },
        { translateY: y },
        { rotateZ: `${depth * -2}deg` },
        { scale },
      ],
    };
  });

  return <Animated.View style={style}>{children}</Animated.View>;
}

function GlassPlate({
  children,
  tilt = -4,
  style,
}: {
  children: React.ReactNode;
  tilt?: number;
  style?: object;
}) {
  const plateStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: "10deg" },
      { rotateZ: `${tilt}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.plateWrap, plateStyle, style]}>
      <HomeLiquidCard contentStyle={styles.plateInner} radius={24}>
        {children}
      </HomeLiquidCard>
    </Animated.View>
  );
}

export function OnboardingHeroScene({
  variant,
  height = 260,
}: {
  variant: OnboardingSceneVariant;
  height?: number;
}) {
  const enter = useSharedValue(0);

  useEffect(() => {
    enter.value = 0;
    enter.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) });
  }, [variant, enter]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { scale: 0.88 + enter.value * 0.12 },
      { translateY: (1 - enter.value) * 24 },
    ],
  }));

  return (
    <Animated.View style={[styles.stage, { height, marginBottom: height < 220 ? 4 : 8 }, wrapStyle]}>
      <LinearGradient
        colors={["rgba(43,89,243,0.14)", "rgba(43,89,243,0)"]}
        style={[styles.glow, { width: height, height, borderRadius: height / 2, top: height * 0.07 }]}
        pointerEvents="none"
      />

      {variant === "welcome" && (
        <View style={styles.centerStack}>
          <FloatLayer depth={2} offsetY={-8}>
            <GlassPlate tilt={-6}>
              <View style={styles.welcomeCard}>
                <DolphinFlat width={120} height={120} />
              </View>
            </GlassPlate>
          </FloatLayer>
          <FloatLayer depth={0} offsetX={-72} offsetY={48} delay={120}>
            <View style={styles.chip}>
              <TextChip label="AI" color={C.blue} />
            </View>
          </FloatLayer>
          <FloatLayer depth={1} offsetX={78} offsetY={52} delay={200}>
            <View style={styles.chip}>
              <TextChip label="XP" color={C.gold} />
            </View>
          </FloatLayer>
        </View>
      )}

      {variant === "paths" && (
        <View style={styles.centerStack}>
          <FloatLayer depth={1} offsetX={-52} offsetY={-12}>
            <GlassPlate tilt={-8} style={styles.pathPlateLeft}>
              <CoffeeCupFlat width={64} height={64} />
            </GlassPlate>
          </FloatLayer>
          <FloatLayer depth={0} offsetY={8}>
            <GlassPlate tilt={4} style={styles.pathPlateMain}>
              <View style={styles.pathLabels}>
                <View style={[styles.pathBadge, { backgroundColor: C.blue }]}>
                  <DolphinFlat width={56} height={56} />
                </View>
              </View>
            </GlassPlate>
          </FloatLayer>
          <FloatLayer depth={2} offsetX={58} offsetY={20} delay={80}>
            <GlassPlate tilt={6} style={styles.pathPlateRight}>
              <View style={styles.globe}>
                <View style={styles.globeInner} />
              </View>
            </GlassPlate>
          </FloatLayer>
        </View>
      )}

      {variant === "practice" && (
        <View style={styles.centerStack}>
          <FloatLayer depth={2} offsetX={-64} offsetY={-20} delay={0}>
            <IconFloat>
              <OrderWordsGameIcon size={48} />
            </IconFloat>
          </FloatLayer>
          <FloatLayer depth={0} offsetY={0}>
            <IconFloat large>
              <RolePlayGameIcon size={64} />
            </IconFloat>
          </FloatLayer>
          <FloatLayer depth={1} offsetX={70} offsetY={-16} delay={140}>
            <IconFloat>
              <PairWordsGameIcon size={48} />
            </IconFloat>
          </FloatLayer>
          <FloatLayer depth={2} offsetX={-40} offsetY={72} delay={220}>
            <IconFloat>
              <AiTeacherGameIcon size={48} />
            </IconFloat>
          </FloatLayer>
        </View>
      )}

      {variant === "progress" && (
        <View style={styles.centerStack}>
          <FloatLayer depth={0}>
            <GlassPlate>
              <View style={styles.progressCard}>
                <ChestFlat width={72} height={72} />
                <View style={styles.streakPill}>
                  <View style={styles.streakDot} />
                </View>
              </View>
            </GlassPlate>
          </FloatLayer>
          <FloatLayer depth={1} offsetX={-80} offsetY={40} delay={100}>
            <MiniStat label="7" sub="days" color={C.orange} />
          </FloatLayer>
          <FloatLayer depth={1} offsetX={82} offsetY={44} delay={180}>
            <MiniStat label="15" sub="XP" color={C.blue} />
          </FloatLayer>
        </View>
      )}

      {variant === "ready" && (
        <View style={styles.centerStack}>
          <FloatLayer depth={0}>
            <View
              style={[
                styles.readyOrb,
                crossShadow({
                  color: C.blue,
                  offsetY: 16,
                  blur: 36,
                  opacity: 0.28,
                  elevation: 12,
                }),
              ]}
            >
              <LinearGradient
                colors={[C.blue, C.blueGlow]}
                style={StyleSheet.absoluteFill}
              />
              <DolphinFlat width={100} height={100} />
            </View>
          </FloatLayer>
        </View>
      )}
    </Animated.View>
  );
}

function TextChip({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.textChip, { borderColor: color }]}>
      <Text style={[styles.textChipLabel, { color }]}>{label}</Text>
    </View>
  );
}

function IconFloat({
  children,
  large,
}: {
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <View
      style={[
        styles.iconFloat,
        large && styles.iconFloatLarge,
        crossShadow({
          color: "#1A2B48",
          offsetY: 10,
          blur: 22,
          opacity: 0.12,
          elevation: 8,
        }),
      ]}
    >
      {children}
    </View>
  );
}

function MiniStat({
  label,
  sub,
  color,
}: {
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <HomeLiquidCard contentStyle={styles.miniStat} radius={16}>
      <Text style={[styles.miniStatValue, { color }]}>{label}</Text>
      <Text style={styles.miniStatSub}>{sub}</Text>
    </HomeLiquidCard>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
  },
  centerStack: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  plateWrap: {
    alignItems: "center",
  },
  plateInner: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
    minHeight: 120,
  },
  welcomeCard: {
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    padding: 4,
  },
  textChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  textChipLabel: {
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  pathPlateLeft: {
    transform: [{ scale: 0.88 }],
  },
  pathPlateMain: {
    zIndex: 2,
  },
  pathPlateRight: {
    transform: [{ scale: 0.88 }],
  },
  pathBadge: {
    borderRadius: 20,
    padding: 12,
  },
  pathLabels: {
    alignItems: "center",
  },
  globe: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  globeInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#58CC02",
  },
  iconFloat: {
    borderRadius: 18,
    padding: 6,
    backgroundColor: "rgba(255,255,255,0.96)",
  },
  iconFloatLarge: {
    borderRadius: 22,
    padding: 10,
  },
  progressCard: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  streakPill: {
    position: "absolute",
    top: -4,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.orange,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  streakDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFF",
  },
  miniStat: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 56,
    alignItems: "center",
  },
  miniStatValue: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  miniStatSub: {
    fontSize: 11,
    fontWeight: "600",
    color: C.grayLight,
    fontFamily: "DINNextRoundedMedium",
    marginTop: 2,
  },
  readyOrb: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.45)",
  },
});
