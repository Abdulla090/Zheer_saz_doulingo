import { AppText } from "../../../components/ui/AppText";
import type { LessonPathMode } from "../../../data/lesson-content";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import {
  useCurrentProgress,
  useProgressStore,
} from "../../../stores/useProgressStore";
import React, { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { isDesktopWebWidth } from "../../../constants/web-layout";
import { Battery, Fire, Flag, Gem } from "../../../constants/icons";

type StatItem = {
  key: string;
  label: string;
  shortLabel: string;
  value: string;
  accent: string;
  Icon: React.ComponentType<{ width?: number; height?: number; color?: string; fill?: string }>;
};

export function PathStatsBar({ pathMode }: { pathMode: LessonPathMode }) {
  const { width } = useWindowDimensions();
  const { t, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const totalXp = useProgressStore((state) => state.totalXp);
  const dailyXp = useProgressStore((state) => state.dailyXp);
  const dailyGoalXp = useProgressStore((state) => state.dailyGoalXp);
  const streakDays = useProgressStore((state) => state.streakDays);
  const currentProgress = useCurrentProgress();
  const isRtl = isKu || isAr;
  const mobileWeb = Platform.OS === "web" && width < 768;
  const compact = width < 370 || mobileWeb;

  const completedLessons =
    pathMode === "normal"
      ? currentProgress.normalNextLessonPathIndex
      : pathMode === "kids"
        ? currentProgress.kidsNextLessonPathIndex
        : currentProgress.nextLessonPathIndex;

  const items = useMemo<StatItem[]>(
    () => [
      {
        key: "xp",
        label: t("games.xpEarned"),
        shortLabel: "XP",
        value: totalXp.toLocaleString(),
        accent: "#FF9600",
        Icon: Gem,
      },
      {
        key: "streak",
        label: t("games.dayStreak"),
        shortLabel: isKu ? "ڕۆژ" : isAr ? "يوم" : "Streak",
        value: streakDays.toLocaleString(),
        accent: "#A5A7AA",
        Icon: Fire,
      },
      {
        key: "goal",
        label: t("home.dailyGoal"),
        shortLabel: isKu ? "ئامانج" : isAr ? "هدف" : "Goal",
        value: `${dailyXp}/${dailyGoalXp}`,
        accent: "#E97BBE",
        Icon: Battery,
      },
      {
        key: "lessons",
        label: t("home.lessonsComplete"),
        shortLabel: isKu ? "وانە" : isAr ? "درس" : "Lessons",
        value: completedLessons.toLocaleString(),
        accent: "#F05B57",
        Icon: Flag,
      },
    ],
    [completedLessons, dailyGoalXp, dailyXp, isAr, isKu, streakDays, t, totalXp],
  );

  const styles = useMemo(
    () => createStyles(colors, isDark, compact, mobileWeb),
    [colors, compact, isDark, mobileWeb],
  );

  if (Platform.OS === "web" && isDesktopWebWidth(width)) {
    return null;
  }

  return (
    <View style={styles.shell}>
      <View
        style={[styles.row, { flexDirection: isRtl ? "row-reverse" : "row" }]}
        accessibilityRole="summary"
      >
        {items.map((item, index) => (
          <View
            key={item.key}
            style={[
              styles.item,
              index > 0 && styles.divider,
              isRtl && index > 0 && styles.dividerRtl,
            ]}
            accessibilityLabel={`${item.label}: ${item.value}`}
          >
            {React.createElement(item.Icon, {
              width: compact ? 20 : 23,
              height: compact ? 20 : 23,
              color: item.accent,
              fill: item.accent,
            })}
            <AppText
              style={[styles.value, { color: item.accent }]}
              forceKurdishFont={isKu}
              forceLatinFont={!isRtl}
              latinRole="bold"
              numberOfLines={1}
            >
              {item.value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function createStyles(
  colors: any,
  isDark: boolean,
  compact: boolean,
  mobileWeb: boolean,
) {
  return StyleSheet.create({
    shell: {
      alignSelf: "center",
      width: "100%",
      maxWidth: 640,
    },
    row: {
      alignSelf: "center",
      width: "100%",
      minHeight: mobileWeb ? 46 : compact ? 52 : 56,
      alignItems: "center",
      paddingHorizontal: mobileWeb ? 10 : 14,
      marginBottom: mobileWeb ? 4 : 6,
    },
    item: {
      flex: 1,
      minWidth: 0,
      minHeight: mobileWeb ? 38 : compact ? 42 : 46,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: compact ? 3 : 5,
      paddingHorizontal: compact ? 2 : 6,
    },
    divider: {
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderLeftColor: isDark ? "rgba(255,255,255,0.10)" : colors.border,
    },
    dividerRtl: {
      borderLeftWidth: 0,
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: isDark ? "rgba(255,255,255,0.10)" : colors.border,
    },
    value: {
      minWidth: 0,
      flexShrink: 1,
      color: colors.foreground,
      fontSize: mobileWeb ? 12 : compact ? 12 : 14,
      lineHeight: mobileWeb ? 16 : 18,
      fontWeight: "800",
      fontVariant: ["tabular-nums"],
      letterSpacing: -0.25,
    },
  });
}
