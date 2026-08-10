import { AppText } from "../../../components/ui/AppText";
import { SUBSCRIPTION_URL } from "../../../constants/app-meta";
import { Image, type ImageSource } from "expo-image";
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

import { isDesktopWebWidth } from "../../../constants/web-layout";
import { useLocaleStore } from "../../../stores/useLocaleStore";
import { openHttpsUrl } from "../../../utils/safe-link";
import { LanguageFlag } from "../../onboarding/components/OnboardingFlag";

const DIAMOND_ICON = require("../../../../assets/images/path-stats/diamond.png");
const STREAK_ICON = require("../../../../assets/images/path-stats/streak.png");
const CHARGE_ICON = require("../../../../assets/images/path-stats/charge.png");

type StatItem = {
  key: string;
  label: string;
  shortLabel: string;
  value: string;
  accent: string;
  imageSource?: ImageSource;
  iconWidth?: number;
  iconHeight?: number;
  targetFlag?: boolean;
};

export function PathStatsBar({ pathMode }: { pathMode: LessonPathMode }) {
  const { width } = useWindowDimensions();
  const { t, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const totalXp = useProgressStore((state) => state.totalXp);
  const dailyXp = useProgressStore((state) => state.dailyXp);
  const dailyGoalXp = useProgressStore((state) => state.dailyGoalXp);
  const streakDays = useProgressStore((state) => state.streakDays);
  const targetLanguage = useLocaleStore((state) => state.selectedTargetLanguage);
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
        imageSource: DIAMOND_ICON,
        iconWidth: 20,
        iconHeight: 20,
      },
      {
        key: "streak",
        label: t("games.dayStreak"),
        shortLabel: isKu ? "ڕۆژ" : isAr ? "يوم" : "Streak",
        value: streakDays.toLocaleString(),
        accent: "#A5A7AA",
        imageSource: STREAK_ICON,
        iconWidth: 22,
        iconHeight: 22,
      },
      {
        key: "goal",
        label: t("home.dailyGoal"),
        shortLabel: isKu ? "ئامانج" : isAr ? "هدف" : "Goal",
        value: `${dailyXp}/${dailyGoalXp}`,
        accent: "#E97BBE",
        imageSource: CHARGE_ICON,
        iconWidth: 28,
        iconHeight: 21,
      },
      {
        key: "lessons",
        label: t("home.lessonsComplete"),
        shortLabel: isKu ? "وانە" : isAr ? "درس" : "Lessons",
        value: completedLessons.toLocaleString(),
        accent: "#F05B57",
        targetFlag: true,
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
        style={[
          styles.row,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
        accessibilityRole="summary"
      >
        {items.map((item, index) => {
          const ItemContainer = item.key === "xp" ? Pressable : View;
          return (
            <ItemContainer
              key={item.key}
              style={[styles.item, index > 0 && styles.divider]}
              accessibilityLabel={`${item.label}: ${item.value}`}
              {...(item.key === "xp"
                ? {
                    accessibilityRole: "button" as const,
                    onPress: () => void openHttpsUrl(SUBSCRIPTION_URL),
                  }
                : {})}
            >
              <AppText
                style={[styles.value, { color: item.accent }]}
                forceKurdishFont={isKu}
                forceLatinFont={!isRtl}
                latinRole="bold"
                numberOfLines={1}
              >
                {item.value}
              </AppText>
              {item.targetFlag ? (
                <LanguageFlag
                  code={targetLanguage}
                  borderColor={
                    isDark ? "rgba(255,255,255,0.18)" : colors.border
                  }
                  width={compact ? 23 : 25}
                />
              ) : item.imageSource ? (
                <Image
                  source={item.imageSource}
                  contentFit="contain"
                  transition={0}
                  style={{
                    width: compact
                      ? Math.max(14, (item.iconWidth ?? 20) - 1)
                      : item.iconWidth,
                    height: compact
                      ? Math.max(14, (item.iconHeight ?? 20) - 1)
                      : item.iconHeight,
                  }}
                />
              ) : null}
            </ItemContainer>
          );
        })}
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
      minHeight: mobileWeb ? 46 : compact ? 50 : 54,
      alignItems: "center",
      paddingHorizontal: mobileWeb ? 10 : 14,
      marginBottom: mobileWeb ? 4 : 6,
    },
    item: {
      flex: 1,
      minWidth: 0,
      minHeight: mobileWeb ? 38 : compact ? 40 : 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: compact ? 4 : 6,
      paddingHorizontal: compact ? 2 : 5,
    },
    divider: {
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderLeftColor: isDark ? "rgba(255,255,255,0.10)" : colors.border,
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
