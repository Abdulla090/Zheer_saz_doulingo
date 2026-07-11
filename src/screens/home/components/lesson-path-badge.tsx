import { AppText } from "../../../components/ui/AppText";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  unitNumber: number;
  lessonNumber: number;
  nodeSize: number;
  muted?: boolean;
  plain?: boolean;
};

/** Compact unit + lesson numbers on path nodes (1-based). */
export function LessonPathBadge({
  unitNumber,
  lessonNumber,
  nodeSize,
  muted = false,
  plain = false,
}: Props) {
  const compact = nodeSize < 70;
  const fontSize = compact ? 8 : 9;
  const padH = compact ? 5 : 6;

  return (
    <View
      style={[
        styles.wrap,
        {
          bottom: compact ? -2 : 0,
          opacity: muted ? 0.72 : 1,
        },
      ]}
      pointerEvents="none"
      accessibilityLabel={`Unit ${unitNumber}, lesson ${lessonNumber}`}
    >
      <View
        style={[
          styles.pill,
          plain ? styles.pillPlain : { paddingHorizontal: padH },
        ]}
      >
        <AppText
          style={[styles.unit, { fontSize }]}
          forceLatinFont
          latinRole="bold"
        >
          {unitNumber}
        </AppText>
        <View style={styles.dot} />
        <AppText
          style={[styles.lesson, { fontSize }]}
          forceLatinFont
          latinRole="bold"
        >
          {lessonNumber}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 4,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: "rgba(26,43,72,0.12)",
  },
  pillPlain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
  },
  unit: {
    color: "#0F172A",
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#94A3B8",
  },
  lesson: {
    color: "#334155",
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
});
