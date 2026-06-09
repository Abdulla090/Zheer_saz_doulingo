import { PremiumPressable } from "../../components/PremiumPressable";
import { PingoMascot } from "../../components/mascot/PingoMascot";
import {
  QuestHeadphonesFlat,
  QuestTargetFlat,
  QuestZapFlat,
} from "../../components/icons/HomeDashboardIcons";
import {
  HomeLiquidButton,
  HomeMeshBackground,
  HomePalette,
  HomeType,
} from "../../components/ui/ios-liquid-home";
import { ThinProgressBar } from "../../components/ui/ThinProgressBar";
import { AppText } from "../../components/ui/AppText";
import { useI18n } from "../../hooks/useI18n";
import type { I18nKey } from "../../i18n";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useContentPackStore } from "../../stores/useContentPackStore";
import {
  buildLessonRouteForMode,
  buildLessonRouteFromMeta,
  getCurrentLessonMeta,
} from "../../utils/lesson-navigation";
import { getPathProgressSummary } from "../../utils/path-progress";
import { PATH_LIST_REMOVE_CLIPPED } from "../../utils/native-perf";
import { syncHomeWidget } from "../../services/home-widget-sync";
import { Fire } from "../../constants/icons";
import { hapticImpact, hapticSelection } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { tabBarScrollPadding } from "../../constants/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import {
  buildHomeDailyQuests,
  type HomeQuestId,
} from "./home-daily-quests";

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
  const { isKu } = useI18n();
  return (
    <View style={styles.pathStripRow}>
      <View style={[styles.pathStripHead, { flexDirection: isKu ? "row-reverse" : "row" }]}>
        <AppText style={[styles.pathStripLabel, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{label}</AppText>
        <AppText style={styles.pathStripCount} forceLatinFont latinRole="bold">
          {completed}/{total}
        </AppText>
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
  const { isKu } = useI18n();
  return (
    <PremiumPressable
      onPress={() => {
        hapticImpact(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={[styles.linkRow, !isLast && styles.linkRowBorder, { flexDirection: isKu ? "row-reverse" : "row" }]}
      accessibilityRole="button"
      pressScale={0.98}
    >
      <View style={[styles.linkRowCopy, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
        <AppText style={[styles.linkRowHint, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{hint}</AppText>
        <AppText style={[styles.linkRowTitle, { textAlign: isKu ? "right" : "left" }]} numberOfLines={2} forceKurdishFont={isKu}>
          {title}
        </AppText>
      </View>
      <AppText style={styles.linkRowChevron} forceLatinFont>{isKu ? "‹" : "›"}</AppText>
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
  const { isKu } = useI18n();
  return (
    <PremiumPressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.questRow, !isLast && styles.questRowBorder, { flexDirection: isKu ? "row-reverse" : "row" }]}
      pressScale={0.98}
    >
      <View style={[styles.questLeft, { flexDirection: isKu ? "row-reverse" : "row" }]}>
        {renderIcon()}
        <View style={[styles.questTextCol, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
          <AppText style={[styles.questTitle, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{title}</AppText>
          <AppText style={[styles.questProgressLabel, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{progressLabel}</AppText>
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
        <AppText style={styles.questDoneMark} accessibilityLabel="Done" forceLatinFont>
          ✓
        </AppText>
      ) : null}
    </PremiumPressable>
  );
});

export function PhingoLearnHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, locale, isKu } = useI18n();
  const streakDays = useProgressStore((s) => s.streakDays);
  const dailyXp = useProgressStore((s) => s.dailyXp);
  const dailyGoalXp = useProgressStore((s) => s.dailyGoalXp);
  const totalXp = useProgressStore((s) => s.totalXp);
  const streetNext = useProgressStore((s) => s.nextLessonPathIndex);
  const normalNext = useProgressStore((s) => s.normalNextLessonPathIndex);
  const kidsNext = useProgressStore((s) => s.kidsNextLessonPathIndex);
  const lastActivity = useProgressStore((s) => s.lastActivity);
  const pathMode = useSettingsStore((s) => s.pathMode);
  const streetStatus = useContentPackStore((s) => s.streetStatus);
  const kidsStatus = useContentPackStore((s) => s.kidsStatus);

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
        <View style={[styles.header, { flexDirection: isKu ? "row-reverse" : "row" }]}>
          <AppText style={styles.logo} forceLatinFont latinRole="bold">PINGO</AppText>
          <View style={[styles.headerStats, { flexDirection: isKu ? "row-reverse" : "row" }]}>
            <View style={[styles.statItem, { flexDirection: isKu ? "row-reverse" : "row" }]}>
              <Fire width={24} height={24} />
              <AppText style={styles.statFire} forceLatinFont latinRole="bold">{Math.max(streakDays, 0)}</AppText>
            </View>
            <View style={[styles.statItem, { flexDirection: isKu ? "row-reverse" : "row" }]}>
              <DiamondIcon size={12} />
              <AppText style={styles.statXp} forceLatinFont latinRole="bold">{Math.max(totalXp, 0)}</AppText>
            </View>
          </View>
        </View>

        <View style={[styles.heroStrip, { flexDirection: isKu ? "row-reverse" : "row" }]}>
          <View style={[styles.heroCopy, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
            <AppText style={[styles.heroTitle, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{t("home.greeting")}</AppText>
          </View>
          <View style={[styles.heroMascot, { transform: [{ scaleX: isKu ? 1 : -1 }] }]}>
            <PingoMascot size={80} pose="wave" />
          </View>
        </View>

        <HomeLiquidButton
          label={t("home.continue")}
          onPress={onStartLesson}
          style={styles.continueBtn}
        />
        <AppText style={[styles.lessonCaption, { textAlign: "center" }]} numberOfLines={2} forceKurdishFont={isKu}>
          {lessonCaption}
        </AppText>

        <View style={styles.dailySection}>
          <View style={[styles.dailyRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
            <View style={[styles.dailyLabelRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
              <DiamondIcon size={11} />
              <AppText style={styles.dailyXpText} forceLatinFont latinRole="bold">
                {dailyXp}/{dailyGoalXp} XP
              </AppText>
            </View>
          </View>
          <ThinProgressBar
            progress={dailyGoalXp > 0 ? dailyXp / dailyGoalXp : 0}
            fillColor={C.blue}
            trackColor={C.track}
            height={6}
          />
        </View>

        <View style={styles.divider} />

        <Pressable
          onPress={onOpenPath}
          accessibilityRole="button"
          accessibilityLabel={t("home.viewPath")}
        >
          <View style={styles.pathSection}>
            <View style={[styles.pathSectionHead, { flexDirection: isKu ? "row-reverse" : "row" }]}>
              <AppText style={[styles.sectionLabel, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{t("home.pathProgress")}</AppText>
              <AppText style={styles.pathLink} forceKurdishFont={isKu}>{isKu ? `‹ ${t("home.viewPath")}` : `${t("home.viewPath")} ›`}</AppText>
            </View>
            {streetStatus === "downloaded" ? (
              <PathProgressRow
                label={t("home.streetPath")}
                completed={pathSummary.streetCompleted}
                total={pathSummary.streetTotal}
                progress={pathSummary.streetPercent}
                fillColor={C.blue}
              />
            ) : (
              <View style={styles.pathStripRow}>
                <View style={[styles.pathStripHead, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                  <AppText style={[styles.pathStripLabel, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{t("home.streetPath")}</AppText>
                  <AppText style={[styles.pathStripCount, { color: "#1CB0F6" }]} forceLatinFont latinRole="bold">Download</AppText>
                </View>
                <ThinProgressBar
                  progress={0}
                  fillColor="#1CB0F6"
                  trackColor={C.track}
                  height={6}
                />
              </View>
            )}
            <PathProgressRow
              label={t("home.normalPath")}
              completed={pathSummary.normalCompleted}
              total={pathSummary.normalTotal}
              progress={pathSummary.normalPercent}
              fillColor="#58CC02"
            />
            {kidsStatus === "downloaded" ? (
              <PathProgressRow
                label="Kids English"
                completed={pathSummary.kidsCompleted}
                total={pathSummary.kidsTotal}
                progress={pathSummary.kidsPercent}
                fillColor="#FF9600"
              />
            ) : (
              <View style={styles.pathStripRow}>
                <View style={[styles.pathStripHead, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                  <AppText style={[styles.pathStripLabel, { textAlign: isKu ? "right" : "left" }]} forceLatinFont latinRole="bold">Kids English</AppText>
                  <AppText style={[styles.pathStripCount, { color: "#FF9600" }]} forceLatinFont latinRole="bold">Download</AppText>
                </View>
                <ThinProgressBar
                  progress={0}
                  fillColor="#FF9600"
                  trackColor={C.track}
                  height={6}
                />
              </View>
            )}
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

        <View style={[styles.questsHeaderRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
          <AppText style={[styles.sectionLabel, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{t("home.todaysQuests")}</AppText>
          <Pressable
            onPress={onOpenQuests}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t("home.viewAllQuests")}
          >
            <AppText style={styles.questsLink} forceKurdishFont={isKu}>{t("home.viewAllQuests")}</AppText>
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
    marginTop: 2,
  },
  heroMascot: {
    width: 80,
    flexShrink: 0,
  },
  heroCopy: {
    flex: 1,
    gap: 2,
  },
  heroTitle: {
    ...HomeType.heading,
    color: C.navy,
    fontSize: 24,
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
  sectionLabel: {
    ...HomeType.section,
    color: C.navy,
    marginBottom: 0,
  },
  dailySection: {
    marginTop: 18,
    gap: 6,
  },
  dailyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dailyLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dailyXpText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.gray,
    fontFamily: "DINNextRoundedBold",
  },
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginTop: 16,
  },
  pathSection: {
    marginTop: 16,
    gap: 8,
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
