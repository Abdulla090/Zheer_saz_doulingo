import { AppText } from "@/components/ui/AppText";
import { HomeLiquidCard } from "@/components/ui/ios-liquid-home";
import { useI18n } from "@/hooks/useI18n";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  unitNumber: number;
  lessonNumber: number;
};

/** Header chip — current unit & lesson (1-based). */
export function LessonUnitLessonChip({ unitNumber, lessonNumber }: Props) {
  const { t, isKu } = useI18n();

  return (
    <HomeLiquidCard contentStyle={[styles.inner, { flexDirection: isKu ? "row-reverse" : "row" }]} radius={14}>
      <View accessibilityLabel={`Unit ${unitNumber}, lesson ${lessonNumber}`} style={{ alignItems: "center" }}>
        <AppText style={styles.caption} forceLatinFont latinRole="medium">
          {t("path.unitShort")}
        </AppText>
        <AppText style={styles.value} forceLatinFont latinRole="bold">
          {unitNumber}
        </AppText>
      </View>
      <View style={styles.divider} />
      <View style={{ alignItems: "center" }}>
        <AppText style={styles.caption} forceLatinFont latinRole="medium">
          {t("path.lessonShort")}
        </AppText>
        <AppText style={styles.value} forceLatinFont latinRole="bold">
          {lessonNumber}
        </AppText>
      </View>
    </HomeLiquidCard>
  );
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 9,
    gap: 7,
  },
  caption: {
    fontSize: 7,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1A2B48",
    lineHeight: 16,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(26,43,72,0.1)",
  },
});
