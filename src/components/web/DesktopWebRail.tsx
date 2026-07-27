import { HugeiconsIcon } from "@hugeicons/react-native";
import { Wallet02Icon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {
  AppAwardIcon,
  AppFireIcon,
  AppTargetIcon,
} from "../icons/AppHugeIcons";
import {
  QuestHeadphonesFlat,
  QuestTargetFlat,
  QuestZapFlat,
} from "../icons/HomeDashboardIcons";
import { PremiumPressable } from "../PremiumPressable";
import { AppText } from "../ui/AppText";
import { WEB_DESKTOP_RAIL_WIDTH } from "../../constants/web-layout";
import { PRIMARY_ACTION } from "../../constants/primary-action";
import type { I18nKey } from "../../i18n";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  buildHomeDailyQuests,
  type HomeQuestId,
} from "../../screens/home/home-daily-quests";
import { useProgressStore } from "../../stores/useProgressStore";

const QUEST_TITLE_KEYS: Record<HomeQuestId, I18nKey> = {
  dailyXp: "home.questXp",
  lessonToday: "home.questLessonToday",
  practiceToday: "home.questPracticeToday",
};

function questIcon(id: HomeQuestId) {
  if (id === "dailyXp") return <QuestZapFlat size={34} />;
  if (id === "lessonToday") return <QuestTargetFlat size={34} />;
  return <QuestHeadphonesFlat size={34} />;
}

export function DesktopWebRail() {
  const { t, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isRtl = isKu || isAr;
  const streakDays = useProgressStore((state) => state.streakDays);
  const totalXp = useProgressStore((state) => state.totalXp);
  const dailyXp = useProgressStore((state) => state.dailyXp);
  const dailyGoalXp = useProgressStore((state) => state.dailyGoalXp);
  const lastActivity = useProgressStore((state) => state.lastActivity);
  const quests = useMemo(
    () =>
      buildHomeDailyQuests({
        dailyXp,
        dailyGoalXp,
        lastActivity,
      }),
    [dailyGoalXp, dailyXp, lastActivity],
  );
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark],
  );

  return (
    <View style={styles.host} pointerEvents="box-none">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.stats,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={styles.stat}
            accessibilityLabel={`${t("games.dayStreak")}: ${streakDays}`}
          >
            <AppFireIcon size={28} duotone={false} strokeWidth={2.6} />
            <AppText style={styles.streakValue} forceLatinFont latinRole="bold">
              {Math.max(streakDays, 0)}
            </AppText>
          </View>
          <View
            style={styles.stat}
            accessibilityLabel={`${t("games.xpEarned")}: ${totalXp}`}
          >
            <AppAwardIcon size={28} duotone={false} strokeWidth={2.6} />
            <AppText style={styles.xpValue} forceLatinFont latinRole="bold">
              {Math.max(totalXp, 0).toLocaleString()}
            </AppText>
          </View>
          <View
            style={styles.stat}
            accessibilityLabel={`${t("home.dailyGoal")}: ${dailyXp}/${dailyGoalXp}`}
          >
            <AppTargetIcon size={28} duotone={false} strokeWidth={2.6} />
            <AppText style={styles.goalValue} forceLatinFont latinRole="bold">
              {Math.max(dailyXp, 0)}/{Math.max(dailyGoalXp, 1)}
            </AppText>
          </View>
        </View>

        <View style={styles.premiumPanel}>
            <View
              style={[
                styles.premiumTop,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <View
                style={[
                  styles.premiumCopy,
                  { alignItems: isRtl ? "flex-end" : "flex-start" },
                ]}
              >
                <AppText
                  style={[
                    styles.eyebrow,
                    { textAlign: isRtl ? "right" : "left" },
                  ]}
                  forceKurdishFont={isKu}
                  latinRole="bold"
                >
                  {isKu ? "کرێدیتی TWINO" : isAr ? "رصيد TWINO" : "TWINO CREDITS"}
                </AppText>
                <AppText
                  style={[
                    styles.panelTitle,
                    { textAlign: isRtl ? "right" : "left" },
                  ]}
                  forceKurdishFont={isKu}
                  latinRole="bold"
                >
                  {isKu
                    ? "کاتێک پێویستتە AI زیاتر بەکاربهێنە"
                    : isAr
                      ? "استخدم ميزات الذكاء الاصطناعي عند الحاجة"
                      : "Use AI when you need it"}
                </AppText>
                <AppText
                  style={[
                    styles.panelBody,
                    { textAlign: isRtl ? "right" : "left" },
                  ]}
                  forceKurdishFont={isKu}
                >
                  {isKu
                    ? "کڕینی یەکجار · بێ بەشداریکردن"
                    : isAr
                      ? "شراء لمرة واحدة · بدون اشتراك"
                      : "One-time credit packs · no subscription"}
                </AppText>
              </View>
              <View style={styles.walletArt}>
                <HugeiconsIcon
                  icon={Wallet02Icon}
                  size={29}
                  color="#168BD2"
                  strokeWidth={2.5}
                />
              </View>
            </View>
            <PremiumPressable
              accessibilityRole="button"
              accessibilityLabel={
                isKu ? "پاکەتەکانی کرێدیت ببینە" : isAr ? "عرض حزم الرصيد" : "View credit packs"
              }
              onPress={() => router.push("/credits")}
              style={styles.primaryButton}
              containerStyle={styles.primaryButtonContainer}
            >
              <AppText
                style={styles.primaryButtonText}
                forceKurdishFont={isKu}
                latinRole="bold"
              >
                {isKu ? "پاکەتەکان ببینە" : isAr ? "عرض الحزم" : "View credit packs"}
              </AppText>
            </PremiumPressable>
          </View>

        <PremiumPressable
          accessibilityRole="button"
          accessibilityLabel={t("tabs.leaderboard")}
          onPress={() => router.push("/dashboard")}
          style={[
            styles.leagueRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.leagueCopy,
              { alignItems: isRtl ? "flex-end" : "flex-start" },
            ]}
          >
            <AppText
              style={styles.panelTitle}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {t("league.title")}
            </AppText>
            <AppText style={styles.panelBody} forceKurdishFont={isKu}>
              {t("league.daysLeft").replace("{count}", "5")}
            </AppText>
          </View>
          <AppText
            style={styles.inlineLink}
            forceKurdishFont={isKu}
            latinRole="bold"
          >
            {t("tabs.leaderboard")}
          </AppText>
        </PremiumPressable>

        <View style={styles.questsPanel}>
          <View
            style={[
              styles.panelHeader,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AppText
              style={styles.panelTitle}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {t("home.todaysQuests")}
            </AppText>
            <PremiumPressable
              accessibilityRole="button"
              accessibilityLabel={t("home.viewAllQuests")}
              onPress={() => router.push("/quest")}
              style={styles.linkButton}
              containerStyle={styles.linkButtonContainer}
            >
              <AppText
                style={styles.inlineLink}
                forceKurdishFont={isKu}
                latinRole="bold"
              >
                {t("home.viewAllQuests")}
              </AppText>
            </PremiumPressable>
          </View>

          <View style={styles.questList}>
            {quests.map((quest, index) => (
              <View
                key={quest.id}
                style={[
                  styles.questRow,
                  index > 0 && styles.questDivider,
                  { flexDirection: isRtl ? "row-reverse" : "row" },
                ]}
              >
                {questIcon(quest.id)}
                <View style={styles.questCopy}>
                  <AppText
                    style={[
                      styles.questTitle,
                      { textAlign: isRtl ? "right" : "left" },
                    ]}
                    forceKurdishFont={isKu}
                    latinRole="bold"
                    numberOfLines={2}
                  >
                    {t(QUEST_TITLE_KEYS[quest.id])}
                  </AppText>
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${Math.round(quest.progress * 100)}%` },
                        ]}
                      />
                    </View>
                    <AppText
                      style={styles.progressLabel}
                      forceLatinFont
                      latinRole="bold"
                    >
                      {quest.progressLabel}
                    </AppText>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    host: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: WEB_DESKTOP_RAIL_WIDTH,
      backgroundColor: colors.background,
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderLeftColor: colors.border,
      zIndex: 20,
    },
    content: {
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 32,
      gap: 18,
    },
    stats: {
      minHeight: 52,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 4,
    },
    stat: {
      minWidth: 72,
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
    },
    streakValue: {
      color: "#FF9600",
      fontSize: 15,
      fontVariant: ["tabular-nums"],
    },
    xpValue: {
      color: "#1CB0F6",
      fontSize: 15,
      fontVariant: ["tabular-nums"],
    },
    goalValue: {
      color: colors.success,
      fontSize: 15,
      fontVariant: ["tabular-nums"],
    },
    premiumPanel: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 22,
      borderCurve: "continuous",
      backgroundColor: colors.surface,
      padding: 18,
      gap: 16,
    },
    premiumTop: {
      minHeight: 110,
      alignItems: "center",
      gap: 8,
    },
    premiumCopy: {
      flex: 1,
      minWidth: 0,
      gap: 6,
    },
    eyebrow: {
      color: "#1CB0F6",
      fontSize: 12,
      lineHeight: 16,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    panelTitle: {
      color: colors.foreground,
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "800",
    },
    panelBody: {
      color: colors.mutedForeground,
      fontSize: 13,
      lineHeight: 18,
    },
    walletArt: {
      width: 72,
      height: 72,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 22,
      backgroundColor: isDark
        ? "rgba(22,139,210,0.14)"
        : "#EAF7FE",
    },
    primaryButtonContainer: {
      alignSelf: "stretch",
    },
    primaryButton: {
      height: PRIMARY_ACTION.height,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: PRIMARY_ACTION.radius,
      backgroundColor: PRIMARY_ACTION.face,
      borderBottomWidth: PRIMARY_ACTION.rimWidth,
      borderBottomColor: PRIMARY_ACTION.rim,
      paddingHorizontal: 16,
    },
    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    leagueRow: {
      minHeight: 76,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: 2,
    },
    leagueCopy: {
      flex: 1,
      minWidth: 0,
      gap: 3,
    },
    inlineLink: {
      color: "#1CB0F6",
      fontSize: 12,
      lineHeight: 16,
      textTransform: "uppercase",
      letterSpacing: 0.35,
    },
    questsPanel: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 22,
      borderCurve: "continuous",
      backgroundColor: colors.surface,
      padding: 18,
    },
    panelHeader: {
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 8,
    },
    linkButtonContainer: {
      alignSelf: "auto",
    },
    linkButton: {
      minHeight: 40,
      justifyContent: "center",
      paddingHorizontal: 4,
    },
    questList: {
      gap: 0,
    },
    questRow: {
      alignItems: "center",
      gap: 12,
      minHeight: 92,
      paddingVertical: 14,
    },
    questDivider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    questCopy: {
      flex: 1,
      minWidth: 0,
      gap: 8,
    },
    questTitle: {
      color: colors.foreground,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: "800",
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },
    progressTrack: {
      flex: 1,
      height: 10,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.12)"
        : colors.muted,
    },
    progressFill: {
      height: "100%",
      minWidth: 0,
      borderRadius: 999,
      backgroundColor: colors.success,
    },
    progressLabel: {
      minWidth: 38,
      color: colors.mutedForeground,
      fontSize: 11,
      textAlign: "right",
      fontVariant: ["tabular-nums"],
    },
  });
}
