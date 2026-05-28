import { HomeLiquidCard, HomePalette } from "@/components/ui/ios-liquid-home";
import { crossShadow } from "@/utils/shadows";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

const C = HomePalette;

export type WidgetPreviewKind = "streak" | "daily" | "lesson" | "progress";

export function WidgetPreviewCard({
  kind,
  title,
  subtitle,
  streak = 7,
  dailyXp = 8,
  dailyGoalXp = 15,
  nextTitle = "Lesson 3",
  streetPct = 42,
  normalPct = 18,
}: {
  kind: WidgetPreviewKind;
  title: string;
  subtitle: string;
  streak?: number;
  dailyXp?: number;
  dailyGoalXp?: number;
  nextTitle?: string;
  streetPct?: number;
  normalPct?: number;
}) {
  return (
    <HomeLiquidCard
      contentStyle={styles.card}
      style={crossShadow({
        color: C.blue,
        offsetY: 8,
        blur: 20,
        opacity: 0.1,
        elevation: 4,
      })}
    >
      <View style={styles.previewFrame}>{renderArt(kind, { streak, dailyXp, dailyGoalXp, nextTitle, streetPct, normalPct })}</View>
      <Text style={styles.previewTitle}>{title}</Text>
      <Text style={styles.previewSub}>{subtitle}</Text>
    </HomeLiquidCard>
  );
}

function renderArt(
  kind: WidgetPreviewKind,
  d: {
    streak: number;
    dailyXp: number;
    dailyGoalXp: number;
    nextTitle: string;
    streetPct: number;
    normalPct: number;
  },
) {
  switch (kind) {
    case "streak":
      return <StreakArt streak={d.streak} dailyPct={Math.round((d.dailyXp / d.dailyGoalXp) * 100)} />;
    case "daily":
      return <DailyArt dailyXp={d.dailyXp} dailyGoalXp={d.dailyGoalXp} streak={d.streak} />;
    case "lesson":
      return <LessonArt title={d.nextTitle} />;
    case "progress":
      return <ProgressArt streetPct={d.streetPct} normalPct={d.normalPct} />;
  }
}

function StreakArt({ streak, dailyPct }: { streak: number; dailyPct: number }) {
  return (
    <View style={styles.artRoot}>
      <LinearGradient colors={["#FFF8E6", "#F4F7FF"]} style={StyleSheet.absoluteFill} />
      <Svg width={120} height={48} viewBox="0 0 120 48" style={styles.flame}>
        <Path
          d="M60 4c-8 14-18 18-18 28a18 18 0 1036 0c0-10-10-14-18-28z"
          fill="#FFB020"
        />
        <Path d="M60 22c-4 6-8 8-8 12a8 8 0 1016 0c0-4-4-6-8-12z" fill="#FF9600" />
      </Svg>
      <Text style={styles.artBig}>{streak}</Text>
      <Text style={styles.artLabel}>day streak · {dailyPct}% XP</Text>
    </View>
  );
}

function DailyArt({
  dailyXp,
  dailyGoalXp,
  streak,
}: {
  dailyXp: number;
  dailyGoalXp: number;
  streak: number;
}) {
  const pct = Math.round((dailyXp / dailyGoalXp) * 100);
  return (
    <View style={styles.artRoot}>
      <LinearGradient colors={["#E8F0FE", "#FFFFFF"]} style={StyleSheet.absoluteFill} />
      <Svg width={56} height={56} viewBox="0 0 56 56">
        <Circle cx={28} cy={28} r={22} stroke="#E8EDF2" strokeWidth={6} fill="none" />
        <Circle
          cx={28}
          cy={28}
          r={22}
          stroke="#2B59F3"
          strokeWidth={6}
          fill="none"
          strokeDasharray={`${(pct / 100) * 138} 138`}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
        />
        <Path
          d="M28 14l3 8h8l-6.5 5 2.5 8-7-4.5-7 4.5 2.5-8-6.5-5h8l3-8z"
          fill="#FFB020"
        />
      </Svg>
      <Text style={styles.artMid}>
        {dailyXp}/{dailyGoalXp} XP
      </Text>
      <Text style={styles.artLabel}>{streak} day streak</Text>
    </View>
  );
}

function LessonArt({ title }: { title: string }) {
  return (
    <View style={[styles.artRoot, styles.lessonArt]}>
      <LinearGradient colors={["#2B59F3", "#0A84FF"]} style={StyleSheet.absoluteFill} />
      <Svg width={40} height={40} viewBox="0 0 40 40">
        <Rect x={6} y={8} width={28} height={22} rx={4} fill="rgba(255,255,255,0.95)" />
        <Path d="M12 14h16M12 18h12M12 22h14" stroke="#2B59F3" strokeWidth={2} strokeLinecap="round" />
      </Svg>
      <Text style={styles.artLessonTitle}>{title}</Text>
      <Text style={styles.artLessonSub}>Tap to continue</Text>
    </View>
  );
}

function ProgressArt({ streetPct, normalPct }: { streetPct: number; normalPct: number }) {
  return (
    <View style={styles.artRoot}>
      <LinearGradient colors={["#F4F7FF", "#FFFFFF"]} style={StyleSheet.absoluteFill} />
      <Bar label="Kurdish" pct={streetPct} color={C.blue} />
      <Bar label="English" pct={normalPct} color="#58CC02" />
    </View>
  );
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barPct}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    gap: 10,
  },
  previewFrame: {
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.divider,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  previewSub: {
    fontSize: 13,
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
    lineHeight: 18,
  },
  artRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 4,
  },
  lessonArt: {
    gap: 6,
  },
  flame: {
    position: "absolute",
    top: 8,
    opacity: 0.9,
  },
  artBig: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFB020",
    fontFamily: "DINNextRoundedBold",
    marginTop: 28,
  },
  artMid: {
    fontSize: 18,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  artLabel: {
    fontSize: 11,
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
  },
  artLessonTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
  },
  artLessonSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.88)",
    fontFamily: "DINNextRoundedMedium",
  },
  barRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  barLabel: {
    width: 52,
    fontSize: 11,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.track,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  barPct: {
    width: 32,
    fontSize: 11,
    fontWeight: "700",
    color: C.gray,
    textAlign: "right",
    fontFamily: "DINNextRoundedBold",
  },
});
