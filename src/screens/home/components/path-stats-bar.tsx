import {
  AppAwardIcon,
  AppBookIcon,
  AppFireIcon,
  AppTargetIcon,
} from "../../../components/icons/AppHugeIcons";
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

type StatItem = {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
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
  const compact = width < 370;
  const iconSize = compact ? 29 : 33;

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
        value: totalXp.toLocaleString(),
        icon: <AppAwardIcon size={iconSize} duotone={false} strokeWidth={2.65} />,
      },
      {
        key: "streak",
        label: t("games.dayStreak"),
        value: streakDays.toLocaleString(),
        icon: <AppFireIcon size={iconSize} duotone={false} strokeWidth={2.65} />,
      },
      {
        key: "goal",
        label: t("home.dailyGoal"),
        value: `${dailyXp}/${dailyGoalXp}`,
        icon: <AppTargetIcon size={iconSize} duotone={false} strokeWidth={2.65} />,
      },
      {
        key: "lessons",
        label: t("home.lessonsComplete"),
        value: completedLessons.toLocaleString(),
        icon: <AppBookIcon size={iconSize} duotone={false} strokeWidth={2.65} />,
      },
    ],
    [completedLessons, dailyGoalXp, dailyXp, iconSize, streakDays, t, totalXp],
  );

  const styles = useMemo(
    () => createStyles(colors, isDark, compact),
    [colors, compact, isDark],
  );

  if (Platform.OS === "web" && isDesktopWebWidth(width)) {
    return null;
  }

  return (
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
          {item.icon}
          <AppText
            style={styles.value}
            forceLatinFont
            latinRole="bold"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: any, isDark: boolean, compact: boolean) {
  return StyleSheet.create({
    row: {
      alignSelf: "center",
      width: "100%",
      maxWidth: 640,
      minHeight: compact ? 62 : 68,
      alignItems: "center",
      paddingHorizontal: 16,
      marginBottom: 10,
    },
    item: {
      flex: 1,
      minWidth: 0,
      minHeight: compact ? 50 : 54,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: compact ? 3 : 6,
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
      fontSize: compact ? 14 : 16,
      lineHeight: 20,
      fontWeight: "800",
      fontVariant: ["tabular-nums"],
      letterSpacing: -0.25,
    },
  });
}
