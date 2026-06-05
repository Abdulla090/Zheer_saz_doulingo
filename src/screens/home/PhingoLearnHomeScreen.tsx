import { PremiumPressable } from "@/components/PremiumPressable";
import { PingoMascot } from "@/components/mascot/PingoMascot";
import {
  QuestHeadphonesFlat,
  QuestTargetFlat,
  QuestZapFlat,
} from "@/components/icons/HomeDashboardIcons";
import {
  HomeLiquidButton,
  HomeMeshBackground,
  HomePalette,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import { ThinProgressBar } from "@/components/ui/ThinProgressBar";
import { useI18n } from "@/hooks/useI18n";
import type { I18nKey } from "@/i18n";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import {
  buildLessonRouteForMode,
  buildLessonRouteFromMeta,
  getCurrentLessonMeta,
} from "@/utils/lesson-navigation";
import { getPathProgressSummary } from "@/utils/path-progress";
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";
import { syncHomeWidget } from "@/services/home-widget-sync";
import { Fire } from "@/constants/icons";
import { hapticImpact, hapticSelection } from "@/utils/haptics";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tabBarScrollPadding } from "@/constants/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import {
  buildHomeDailyQuests,
  type HomeQuestId,
} from "@/screens/home/home-daily-quests";

const C = HomePalette;

const QUEST_TITLE_KEYS: Record<HomeQuestId, I18nKey> = {
  dailyXp: "home.questXp",
  lessonToday: "home.questLessonToday",
  practiceToday: "home.questPracticeToday",
};

type QuestDef = {
  id: HomeQuestId;
  title: string;
  progress: number;
  progressLabel: string;
  done: boolean;
  renderIcon: () => React.ReactNode;
};

function DiamondIcon({ size = 10 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Path d="M5 0L10 5L5 10L0 5L5 0Z" fill={C.navy} />
    </Svg>
  );
}

function questIcon(id: HomeQuestId, size = 36) {
  switch (id) {
    case "dailyXp":
      return <QuestZapFlat size={size} />;
    case "lessonToday":
      return <QuestHeadphonesFlat size={size} />;
    case "practiceToday":
      return <QuestTargetFlat size={size} />;
  }
}

const PathProgressRow = memo(function PathProgressRow({
  label,
  completed,
  total,
  progress,
  fillColor,
}: {
  label: string;
  completed: number;
  total: number;
  progress: number;
  fillColor: string;
}) {
  const { t } = useI18n();
  return (
    <View style={styles.pathStripRow}>
      <View style={styles.pathStripHead}>
        <Text style={styles.pathStripLabel}>{label}</Text>
        <Text style={styles.pathStripCount}>
          {completed}/{total} {t("home.lessonsComplete")}
        </Text>
      </View>
      <ThinProgressBar
        progress={progress}
        fillColor={fillColor}
        trackColor={C.track}
        height={6}
      />
    </View>
  );
});

const InlineLinkRow = memo(function InlineLinkRow({
  hint,
  title,
  onPress,
  isLast,
}: {
  hint: string;
  title: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <PremiumPressable
      onPress={() => {
        hapticImpact(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={[styles.linkRow, !isLast && styles.linkRowBorder]}
      accessibilityRole="button"
      pressScale={0.98}
    >
      <View style={styles.linkRowCopy}>
        <Text style={styles.linkRowHint}>{hint}</Text>
        <Text style={styles.linkRowTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>
      <Text style={styles.linkRowChevron}>›</Text>
    </PremiumPressable>
  );
});

const QuestRow = memo(function QuestRow({
  title,
  progress,
  progressLabel,
  renderIcon,
  done,
  isLast,
  onPress,
}: QuestDef & { isLast?: boolean; onPress: () => void }) {
  return (
    <PremiumPressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.questRow, !isLast && styles.questRowBorder]}
      pressScale={0.98}
    >
      <View style={styles.questLeft}>
        {renderIcon()}
        <View style={styles.questTextCol}>
          <Text style={styles.questTitle}>{title}</Text>
          <Text style={styles.questProgressLabel}>{progressLabel}</Text>
          <ThinProgressBar
            progress={progress}
            fillColor={done ? "#58CC02" : C.blue}
            trackColor={C.track}
            height={5}
            style={styles.questBar}
          />
        </View>
      </View>
      {done ? (
        <Text style={styles.questDoneMark} accessibilityLabel="Done">
          ✓
        </Text>
      ) : null}
    </PremiumPressable>
  );
});

export function PhingoLearnHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, locale } = useI18n();
  const streakDays = useProgressStore((s) => s.streakDays);
  const dailyXp = useProgressStore((s) => s.dailyXp);
  const dailyGoalXp = useProgressStore((s) => s.dailyGoalXp);
  const totalXp = useProgressStore((s) => s.totalXp);
  const streetNext = useProgressStore((s) => s.nextLessonPathIndex);
  const normalNext = useProgressStore((s) => s.normalNextLessonPathIndex);
  const kidsNext = useProgressStore((s) => s.kidsNextLessonPathIndex);
  const lastActivity = useProgressStore((s) => s.lastActivity);
  const pathMode = useSettingsStore((s) => s.pathMode);

  const pathSummary = useMemo(
    () => getPathProgressSummary(streetNext, normalNext, kidsNext),
    [streetNext, normalNext, kidsNext],
  );

  const nextLessonMeta = useMemo(
    () => getCurrentLessonMeta(pathMode, streetNext, normalNext, locale, kidsNext),
    [pathMode, streetNext, normalNext, locale, kidsNext],
  );

  useEffect(() => {
    void syncHomeWidget();
  }, [streetNext, normalNext, kidsNext, lastActivity, dailyXp, streakDays]);

  const quests = useMemo<QuestDef[]>(() => {
    const rows = buildHomeDailyQuests({ dailyXp, dailyGoalXp, lastActivity });
    return rows.map((row) => ({
      id: row.id,
      title: t(QUEST_TITLE_KEYS[row.id]),
      progress: row.progress,
      progressLabel: row.progressLabel,
      done: row.done,
      renderIcon: () => questIcon(row.id),
    }));
  }, [dailyGoalXp, dailyXp, lastActivity, t]);

  const onOpenPath = useCallback(() => {
    hapticSelection();
    router.push({
      pathname: "/dashboard",
      params: { mode: pathMode },
    });
  }, [pathMode, router]);

  const onStartLesson = useCallback(() => {
    hapticSelection();
    const meta = getCurrentLessonMeta(
      pathMode,
      streetNext,
      normalNext,
      locale,
      kidsNext,
    );
    const route = meta
      ? buildLessonRouteFromMeta(meta)
      : buildLessonRouteForMode(pathMode, streetNext, normalNext, kidsNext);
    if (route) {
      router.push(route);
      return;
    }
    onOpenPath();
  }, [
    kidsNext,
    locale,
    normalNext,
    onOpenPath,
    pathMode,
    router,
    streetNext,
  ]);

  const onOpenGames = useCallback(() => {
    hapticSelection();
    router.push("/feed");
  }, [router]);

  const onOpenQuests = useCallback(() => {
    hapticSelection();
    router.push("/quest");
  }, [router]);

  const onRecentPress = useCallback(() => {
    if (!lastActivity) return;
    hapticSelection();
    if (lastActivity.kind === "lesson") {
      const route = buildLessonRouteForMode(
        lastActivity.mode,
        streetNext,
        normalNext,
        kidsNext,
      );
      if (route) router.push(route);
      return;
    }
    const id = lastActivity.gameId;
    if (id === "roleplay") {
      router.push("/roleplay");
      return;
    }
    if (id === "ai-teacher") {
      router.push("/ai-teacher");
      return;
    }
    router.push("/feed");
  }, [lastActivity, normalNext, kidsNext, router, streetNext]);

  const lessonCaption = nextLessonMeta
    ? `${t("home.nextLesson")} · ${nextLessonMeta.lessonNumber} — ${nextLessonMeta.sectionTitle}`
    : t("home.tapToContinue");

  const recentTitle =
    lastActivity?.kind === "game"
      ? lastActivity.label
      : lastActivity?.kind === "lesson"
        ? lastActivity.label
        : null;
  const recentHint =
    lastActivity?.kind === "game"
      ? t("games.title")
      : lastActivity?.kind === "lesson"
        ? t("home.nextLesson")
        : null;

  const linkRows: { key: string; hint: string; title: string; onPress: () => void }[] =
    [];
  if (recentTitle && recentHint) {
    linkRows.push({
      key: "recent",
      hint: recentHint,
      title: recentTitle,
      onPress: onRecentPress,
    });
  }
  linkRows.push({
    key: "games",
    hint: t("games.subtitle"),
    title: t("games.title"),
    onPress: onOpenGames,
  });

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: tabBarScrollPadding(insets.bottom),
          paddingHorizontal: 20,
        }}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>PINGO</Text>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Fire width={24} height={24} />
              <Text style={styles.statFire}>{Math.max(streakDays, 0)}</Text>
            </View>
            <View style={styles.statItem}>
              <DiamondIcon size={12} />
              <Text style={styles.statXp}>{Math.max(totalXp, 0)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroStrip}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>{t("home.greeting")}</Text>
            <Text style={styles.heroSub}>{t("home.subtitle")}</Text>
          </View>
          <View style={[styles.heroMascot, { transform: [{ scaleX: -1 }] }]}>
            <PingoMascot size={88} pose="wave" />
          </View>
        </View>

        <HomeLiquidButton
          label={t("home.continue")}
          onPress={onStartLesson}
          style={styles.continueBtn}
        />
        <Text style={styles.lessonCaption} numberOfLines={2}>
          {lessonCaption}
        </Text>

        <View style={styles.stripBlock}>
          <Text style={styles.sectionLabel}>{t("home.dailyGoal")}</Text>
          <View style={styles.dailyStrip}>
            <DiamondIcon size={11} />
            <Text style={styles.dailyXpText}>
              {dailyXp} / {dailyGoalXp} XP
            </Text>
          </View>
          <ThinProgressBar
            progress={dailyGoalXp > 0 ? dailyXp / dailyGoalXp : 0}
            fillColor={C.blue}
            trackColor={C.track}
            height={8}
            style={styles.dailyBar}
          />
        </View>

        <View style={styles.divider} />

        <Pressable
          onPress={onOpenPath}
          accessibilityRole="button"
          accessibilityLabel={t("home.viewPath")}
        >
          <View style={styles.stripBlock}>
            <View style={styles.pathSectionHead}>
              <Text style={styles.sectionLabel}>{t("home.pathProgress")}</Text>
              <Text style={styles.pathLink}>{t("home.viewPath")} ›</Text>
            </View>
            <PathProgressRow
              label={t("home.streetPath")}
              completed={pathSummary.streetCompleted}
              total={pathSummary.streetTotal}
              progress={pathSummary.streetPercent}
              fillColor={C.blue}
            />
            <PathProgressRow
              label={t("home.normalPath")}
              completed={pathSummary.normalCompleted}
              total={pathSummary.normalTotal}
              progress={pathSummary.normalPercent}
              fillColor="#58CC02"
            />
          </View>
        </Pressable>

        {linkRows.length > 0 ? (
          <>
            <View style={styles.divider} />
            <View style={styles.linkList}>
              {linkRows.map((row, i) => (
                <InlineLinkRow
                  key={row.key}
                  hint={row.hint}
                  title={row.title}
                  onPress={row.onPress}
                  isLast={i === linkRows.length - 1}
                />
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.questsHeaderRow}>
          <Text style={styles.sectionLabel}>{t("home.todaysQuests")}</Text>
          <Pressable
            onPress={onOpenQuests}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t("home.viewAllQuests")}
          >
            <Text style={styles.questsLink}>{t("home.viewAllQuests")}</Text>
          </Pressable>
        </View>
        <View style={styles.questList}>
          {quests.map((q, i) => (
            <QuestRow
              key={q.id}
              {...q}
              isLast={i === quests.length - 1}
              onPress={onOpenQuests}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.meshBottom,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  logo: {
    ...HomeType.logo,
    color: C.blue,
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statFire: {
    fontSize: 17,
    fontWeight: "700",
    color: C.orange,
    fontFamily: "DINNextRoundedBold",
  },
  statXp: {
    fontSize: 17,
    fontWeight: "700",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
  },
  heroStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  heroMascot: {
    width: 88,
    flexShrink: 0,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    ...HomeType.heading,
    color: C.navy,
    fontSize: 26,
  },
  heroSub: {
    ...HomeType.body,
    color: C.gray,
    lineHeight: 21,
  },
  continueBtn: {
    marginTop: 16,
  },
  lessonCaption: {
    ...HomeType.caption,
    color: C.gray,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 8,
    lineHeight: 18,
  },
  stripBlock: {
    marginTop: 22,
    gap: 10,
  },
  sectionLabel: {
    ...HomeType.section,
    color: C.navy,
    marginBottom: 0,
  },
  dailyStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dailyXpText: {
    fontSize: 15,
    fontWeight: "600",
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
  },
  dailyBar: {
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginTop: 22,
  },
  pathSectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  pathLink: {
    fontSize: 14,
    fontWeight: "700",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
  },
  pathStripRow: {
    gap: 6,
    marginTop: 10,
  },
  pathStripHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  pathStripLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    flex: 1,
  },
  pathStripCount: {
    ...HomeType.caption,
    color: C.grayLight,
  },
  linkList: {
    marginTop: 4,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  linkRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  linkRowCopy: {
    flex: 1,
    gap: 3,
  },
  linkRowHint: {
    ...HomeType.caption,
    color: C.grayLight,
  },
  linkRowTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  linkRowChevron: {
    fontSize: 26,
    fontWeight: "300",
    color: C.blue,
  },
  questsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 4,
  },
  questsLink: {
    fontSize: 14,
    fontWeight: "700",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
  },
  questList: {
    marginTop: 4,
  },
  questRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    gap: 10,
  },
  questRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  questLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  questTextCol: {
    flex: 1,
    gap: 2,
  },
  questTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  questProgressLabel: {
    ...HomeType.caption,
    color: C.grayLight,
  },
  questBar: {
    marginTop: 4,
  },
  questDoneMark: {
    fontSize: 20,
    fontWeight: "800",
    color: "#58CC02",
    width: 28,
    textAlign: "center",
  },
});
