import {
  AppAwardIcon,
  AppBookIcon,
  AppFireIcon,
  AppTargetIcon,
} from "../../../components/icons/AppHugeIcons";
import { AppText } from "../../../components/ui/AppText";
import { TwinoBrandMark } from "../../../components/branding/twino-brand-mark";
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
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Wallet02Icon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";

import { isDesktopWebWidth } from "../../../constants/web-layout";
import { useCreditBalance } from "../../../hooks/useCreditBalance";

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
  const { balance: creditBalance } = useCreditBalance();
  const isRtl = isKu || isAr;
  const mobileWeb = Platform.OS === "web" && width < 768;
  const compact = width < 370 || mobileWeb;
  const iconSize = mobileWeb ? 22 : compact ? 26 : 29;

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
        icon: (
          <AppAwardIcon size={iconSize} duotone={false} strokeWidth={2.65} />
        ),
      },
      {
        key: "streak",
        label: t("games.dayStreak"),
        value: streakDays.toLocaleString(),
        icon: (
          <AppFireIcon size={iconSize} duotone={false} strokeWidth={2.65} />
        ),
      },
      {
        key: "goal",
        label: t("home.dailyGoal"),
        value: `${dailyXp}/${dailyGoalXp}`,
        icon: (
          <AppTargetIcon size={iconSize} duotone={false} strokeWidth={2.65} />
        ),
      },
      {
        key: "lessons",
        label: t("home.lessonsComplete"),
        value: completedLessons.toLocaleString(),
        icon: (
          <AppBookIcon size={iconSize} duotone={false} strokeWidth={2.65} />
        ),
      },
    ],
    [completedLessons, dailyGoalXp, dailyXp, iconSize, streakDays, t, totalXp],
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
        style={[
          styles.brandRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <TwinoBrandMark size={34} showName nameSize={20} style={styles.brand} />
        <Pressable
          onPress={() => router.push("/subscription")}
          accessibilityRole="button"
          accessibilityLabel={
            creditBalance === null
              ? "View TWINO credit packs"
              : `TWINO credits: ${creditBalance}. View credit packs`
          }
          style={({ pressed }) => [
            styles.creditBadge,
            pressed && styles.creditBadgePressed,
          ]}
        >
          <HugeiconsIcon
            icon={Wallet02Icon}
            size={17}
            color="#168BD2"
            strokeWidth={2.5}
          />
          <AppText
            style={styles.creditValue}
            forceLatinFont
            latinRole="bold"
            numberOfLines={1}
          >
            Packs
          </AppText>
        </Pressable>
      </View>
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
    brandRow: {
      minHeight: 38,
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: mobileWeb ? 12 : 18,
      marginBottom: mobileWeb ? 2 : 4,
    },
    brand: {
      flexShrink: 1,
    },
    creditBadge: {
      minHeight: 34,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderWidth: 1,
      borderColor: isDark ? "rgba(69,180,240,0.3)" : "#CDEBFA",
      borderRadius: 11,
      backgroundColor: isDark ? "rgba(22,139,210,0.12)" : "#EFF9FE",
      paddingHorizontal: 10,
    },
    creditValue: {
      color: isDark ? "#75CCFA" : "#0E6FA9",
      fontSize: 12.5,
      lineHeight: 16,
      fontVariant: ["tabular-nums"],
    },
    creditBadgePressed: {
      opacity: 0.72,
      transform: [{ scale: 0.97 }],
    },
    row: {
      alignSelf: "center",
      width: "100%",
      minHeight: mobileWeb ? 48 : compact ? 54 : 60,
      alignItems: "center",
      paddingHorizontal: mobileWeb ? 10 : 14,
      marginBottom: mobileWeb ? 4 : 6,
    },
    item: {
      flex: 1,
      minWidth: 0,
      minHeight: mobileWeb ? 40 : compact ? 44 : 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: mobileWeb ? 2 : compact ? 3 : 5,
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
      fontSize: mobileWeb ? 12 : compact ? 13 : 14,
      lineHeight: mobileWeb ? 16 : 18,
      fontWeight: "800",
      fontVariant: ["tabular-nums"],
      letterSpacing: -0.25,
    },
  });
}
