import { crossShadow } from "@/utils/shadows";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

export type OnboardingHeroVariant =
  | "welcome"
  | "paths"
  | "practice"
  | "progress"
  | "ready";

const LOGO = require("../../../../assets/images/logo-glow.png");
const APP_ICON = require("../../../../assets/images/icon.png");

const C = {
  blue: "#208AEF",
  blueDeep: "#0A5DC2",
  violet: "#5B4FD6",
  green: "#58CC02",
  gold: "#FFB020",
  navy: "#0F172A",
  slate: "#64748B",
  white: "#FFFFFF",
};

export function OnboardingHero({ variant }: { variant: OnboardingHeroVariant }) {
  const { width } = useWindowDimensions();
  const heroH = Math.min(240, Math.max(168, width * 0.52));

  return (
    <View style={[styles.wrap, { height: heroH }]}>
      <View style={styles.ambientGlow} />
      {variant === "welcome" ? <WelcomeHero width={width} /> : null}
      {variant === "paths" ? <PathsHero /> : null}
      {variant === "practice" ? <PracticeHero /> : null}
      {variant === "progress" ? <ProgressHero /> : null}
      {variant === "ready" ? <ReadyHero width={width} /> : null}
    </View>
  );
}

function WelcomeHero({ width }: { width: number }) {
  const size = Math.min(200, width * 0.52);
  return (
    <PremiumFrame
      width={size}
      height={size * 0.72}
      colors={["#E8F2FF", "#FFFFFF"]}
      accent={C.blue}
    >
      <Image source={LOGO} contentFit="contain" style={{ width: size * 0.78, height: size * 0.5 }} />
      <View style={styles.badgeRow}>
        <Pill label="AI Teacher" tint={C.violet} />
        <Pill label="Speaking" tint={C.blue} />
      </View>
    </PremiumFrame>
  );
}

function ReadyHero({ width }: { width: number }) {
  const size = Math.min(120, width * 0.28);
  return (
    <PremiumFrame
      width={size + 48}
      height={size + 48}
      colors={["#ECFDF5", "#FFFFFF"]}
      accent={C.green}
      round
    >
      <Image source={APP_ICON} contentFit="cover" style={{ width: size, height: size, borderRadius: size * 0.22 }} />
      <View style={styles.readyCheck}>
        <Text style={styles.readyCheckMark}>✓</Text>
      </View>
    </PremiumFrame>
  );
}

function PathsHero() {
  return (
    <View style={styles.dualRow}>
      <PathCard
        title="Kurdish"
        subtitle="Street path"
        colors={["#2B59F3", "#0A84FF"]}
      />
      <PathCard
        title="English"
        subtitle="Classic path"
        colors={["#3D9E00", "#58CC02"]}
      />
    </View>
  );
}

function PracticeHero() {
  const items = [
    { label: "Role play", color: C.violet },
    { label: "Word games", color: C.blue },
    { label: "Speaking", color: C.green },
  ];
  return (
    <PremiumFrame width={280} height={140} colors={["#F8FAFF", "#FFFFFF"]} accent={C.blue}>
      <View style={styles.practiceStack}>
        {items.map((item) => (
          <View key={item.label} style={styles.practiceRow}>
            <View style={[styles.practiceDot, { backgroundColor: item.color }]} />
            <Text style={styles.practiceLabel}>{item.label}</Text>
            <View style={styles.practiceLine} />
          </View>
        ))}
      </View>
    </PremiumFrame>
  );
}

function ProgressHero() {
  return (
    <View style={styles.dualRow}>
      <StatTile value="15" unit="XP / day" gradient={["#FFF8E6", "#FFFFFF"]} accent={C.gold} />
      <StatTile value="2" unit="Paths" gradient={["#EEF4FF", "#FFFFFF"]} accent={C.blue} />
    </View>
  );
}

function PremiumFrame({
  children,
  width,
  height,
  colors,
  accent,
  round,
}: {
  children: React.ReactNode;
  width: number;
  height: number;
  colors: [string, string];
  accent: string;
  round?: boolean;
}) {
  return (
    <View
      style={[
        styles.frame,
        {
          width,
          height,
          borderRadius: round ? 999 : 28,
          borderColor: `${accent}22`,
        },
        crossShadow({ color: accent, offsetY: 14, blur: 32, opacity: 0.14, elevation: 10 }),
      ]}
    >
      <LinearGradient colors={colors} style={[StyleSheet.absoluteFill, { borderRadius: round ? 999 : 28 }]} />
      <View style={styles.frameSheen} pointerEvents="none" />
      {children}
    </View>
  );
}

function PathCard({
  title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle: string;
  colors: [string, string];
}) {
  return (
    <View style={[styles.pathCard, crossShadow({ color: colors[0], offsetY: 10, blur: 24, opacity: 0.2, elevation: 6 })]}>
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      <Text style={styles.pathTitle}>{title}</Text>
      <Text style={styles.pathSub}>{subtitle}</Text>
    </View>
  );
}

function StatTile({
  value,
  unit,
  gradient,
  accent,
}: {
  value: string;
  unit: string;
  gradient: [string, string];
  accent: string;
}) {
  return (
    <View style={[styles.statTile, { borderColor: `${accent}33` }]}>
      <LinearGradient colors={gradient} style={StyleSheet.absoluteFill} />
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
    </View>
  );
}

function Pill({ label, tint }: { label: string; tint: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: `${tint}14`, borderColor: `${tint}33` }]}>
      <Text style={[styles.pillText, { color: tint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  ambientGlow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(32, 138, 239, 0.08)",
  },
  frame: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  frameSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "42%",
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DINNextRoundedBold",
  },
  readyCheck: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  readyCheckMark: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  dualRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  pathCard: {
    width: 132,
    height: 120,
    borderRadius: 22,
    padding: 16,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  pathTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.3,
  },
  pathSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
    fontFamily: "DINNextRoundedMedium",
  },
  practiceStack: {
    width: "100%",
    gap: 14,
    paddingHorizontal: 8,
  },
  practiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  practiceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  practiceLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    width: 100,
  },
  practiceLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#E8EDF2",
  },
  statTile: {
    width: 128,
    height: 112,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  statValue: {
    fontSize: 36,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  statUnit: {
    fontSize: 13,
    fontWeight: "600",
    color: C.slate,
    marginTop: 4,
    fontFamily: "DINNextRoundedMedium",
  },
});
