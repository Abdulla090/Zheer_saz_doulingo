import {
  ChestFlat,
  CoffeeCupFlat,
  DolphinFlat,
  QuestHeadphonesFlat,
  QuestTargetFlat,
  QuestZapFlat,
} from "@/components/icons/HomeDashboardIcons";
import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeLiquidLessonTile,
  HomeLiquidXpChip,
  HomeMeshBackground,
  HomePalette,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import { ThinProgressBar } from "@/components/ui/ThinProgressBar";
import { useI18n } from "@/hooks/useI18n";
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
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const C = HomePalette;

type QuestDef = {
  id: string;
  title: string;
  progress: number;
  progressLabel?: string;
  renderIcon: () => React.ReactNode;
};

function DiamondIcon({ size = 10 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Path d="M5 0L10 5L5 10L0 5L5 0Z" fill={C.navy} />
    </Svg>
  );
}

const QuestRow = memo(function QuestRow({
  title,
  progress,
  progressLabel,
  renderIcon,
  isLast,
}: QuestDef & { isLast?: boolean }) {
  return (
    <View style={[styles.questRow, !isLast && styles.questRowBorder]}>
      <View style={styles.questLeft}>
        {renderIcon()}
        <View style={styles.questTextCol}>
          <Text style={styles.questTitle}>{title}</Text>
          {progressLabel ? (
            <Text style={styles.questProgressLabel}>{progressLabel}</Text>
          ) : null}
          <ThinProgressBar
            progress={progress}
            fillColor={C.blue}
            trackColor={C.track}
            height={6}
            style={styles.questBar}
          />
        </View>
      </View>
      <HomeLiquidXpChip />
    </View>
  );
});

export function PhingoLearnHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useI18n();
  const streakDays = useProgressStore((s) => s.streakDays);
  const dailyXp = useProgressStore((s) => s.dailyXp);
  const dailyGoalXp = useProgressStore((s) => s.dailyGoalXp);
  const streetNext = useProgressStore((s) => s.nextLessonPathIndex);
  const normalNext = useProgressStore((s) => s.normalNextLessonPathIndex);
  const lastActivity = useProgressStore((s) => s.lastActivity);
  const pathMode = useSettingsStore((s) => s.pathMode);
  const { width } = useWindowDimensions();

  const pathSummary = useMemo(
    () => getPathProgressSummary(streetNext, normalNext),
    [streetNext, normalNext],
  );

  const nextLessonMeta = useMemo(
    () => getCurrentLessonMeta(pathMode, streetNext, normalNext),
    [pathMode, streetNext, normalNext],
  );

  useEffect(() => {
    void syncHomeWidget();
  }, [streetNext, normalNext, lastActivity, dailyXp, streakDays]);
  const horizontalPad = 20;
  const cardWidth = width - horizontalPad * 2;

  const quests = useMemo<QuestDef[]>(
    () => [
      {
        id: "xp",
        title: t("home.questXp"),
        progress: dailyGoalXp > 0 ? Math.min(1, dailyXp / dailyGoalXp) : 0,
        progressLabel: `${dailyXp} / ${dailyGoalXp} XP`,
        renderIcon: () => <QuestZapFlat size={40} />,
      },
      {
        id: "listen",
        title: t("home.questListen"),
        progress: lastActivity?.kind === "lesson" ? 1 : 0,
        progressLabel: lastActivity?.kind === "lesson" ? "1 / 1" : "0 / 1",
        renderIcon: () => <QuestHeadphonesFlat size={40} />,
      },
      {
        id: "score",
        title: t("home.questScore"),
        progress: 0,
        progressLabel: "0 / 1",
        renderIcon: () => <QuestTargetFlat size={40} />,
      },
    ],
    [t, dailyXp, dailyGoalXp, lastActivity],
  );

  const onContinue = useCallback(() => {
    router.push({
      pathname: "/dashboard",
      params: { mode: pathMode },
    });
  }, [pathMode, router]);

  const onLessonPress = useCallback(() => {
    const route = nextLessonMeta
      ? buildLessonRouteFromMeta(nextLessonMeta)
      : buildLessonRouteForMode(pathMode, streetNext, normalNext);
    if (route) router.push(route);
  }, [nextLessonMeta, normalNext, pathMode, router, streetNext]);

  const onRecentPress = useCallback(() => {
    if (!lastActivity) return;
    if (lastActivity.kind === "lesson") {
      const route = buildLessonRouteForMode(
        lastActivity.mode,
        streetNext,
        normalNext,
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
  }, [lastActivity, normalNext, router, streetNext]);

  const lessonLabel = nextLessonMeta
    ? `${t("home.nextLesson")} · ${nextLessonMeta.lessonNumber}`
    : t("home.nextLesson");
  const lessonTitle = nextLessonMeta?.sectionTitle ?? t("home.tapToContinue");

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

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 96,
          paddingHorizontal: horizontalPad,
        }}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Phingo</Text>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Fire width={24} height={24} />
              <Text style={styles.statFire}>{Math.max(streakDays, 0)}</Text>
            </View>
            <Pressable
              onPress={() => router.push("/feed")}
              accessibilityRole="button"
              accessibilityLabel={t("games.title")}
              style={styles.gamesChip}
            >
              <Text style={styles.gamesChipText}>{t("tabs.games")}</Text>
            </Pressable>
          </View>
        </View>

        <HomeLiquidCard
          style={styles.cardSpacer}
          contentStyle={styles.heroInner}
          interactive
        >
          <View style={styles.heroRow}>
            <DolphinFlat width={72} height={72} />
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>{t("home.greeting")}</Text>
              <Text style={styles.heroSub}>{t("home.subtitle")}</Text>
              <HomeLiquidButton label={t("home.continue")} onPress={onContinue} />
            </View>
          </View>
        </HomeLiquidCard>

        <HomeLiquidCard style={styles.cardSpacer} contentStyle={styles.dailyInner}>
          <Text style={styles.cardHeading}>{t("home.dailyGoal")}</Text>
          <View style={styles.dailyRow}>
            <View style={styles.dailyCopy}>
              <View style={styles.dailyXpRow}>
                <DiamondIcon />
                <Text style={styles.dailyXp}>
                  {dailyXp} / {dailyGoalXp} XP
                </Text>
              </View>
              <ThinProgressBar
                progress={dailyGoalXp > 0 ? dailyXp / dailyGoalXp : 0}
                fillColor={C.blue}
                trackColor={C.track}
                height={8}
                style={{ marginTop: 10, maxWidth: cardWidth * 0.55 }}
              />
            </View>
            <ChestFlat width={64} height={64} />
          </View>
        </HomeLiquidCard>

        <HomeLiquidCard style={styles.cardSpacer} contentStyle={styles.pathProgressInner}>
          <Text style={styles.cardHeading}>{t("home.pathProgress")}</Text>
          <View style={styles.pathRow}>
            <Text style={styles.pathLabel}>{t("home.streetPath")}</Text>
            <Text style={styles.pathPct}>
              {pathSummary.streetCompleted}/{pathSummary.streetTotal}{" "}
              {t("home.lessonsComplete")}
            </Text>
          </View>
          <ThinProgressBar
            progress={pathSummary.streetPercent}
            fillColor={C.blue}
            trackColor={C.track}
            height={8}
            style={styles.pathBar}
          />
          <View style={[styles.pathRow, styles.pathRowSpaced]}>
            <Text style={styles.pathLabel}>{t("home.normalPath")}</Text>
            <Text style={styles.pathPct}>
              {pathSummary.normalCompleted}/{pathSummary.normalTotal}{" "}
              {t("home.lessonsComplete")}
            </Text>
          </View>
          <ThinProgressBar
            progress={pathSummary.normalPercent}
            fillColor="#58CC02"
            trackColor={C.track}
            height={8}
            style={styles.pathBar}
          />
        </HomeLiquidCard>

        <Pressable
          onPress={() => router.push("/widgets")}
          accessibilityRole="button"
          accessibilityLabel={t("widgets.homePromo")}
        >
          <HomeLiquidCard
            interactive
            style={styles.cardSpacer}
            contentStyle={styles.widgetPromoInner}
          >
            <View style={styles.widgetPromoCopy}>
              <Text style={styles.widgetPromoTitle}>{t("widgets.homePromo")}</Text>
              <Text style={styles.widgetPromoSub}>{t("widgets.homePromoSub")}</Text>
            </View>
            <Text style={styles.widgetPromoChevron}>›</Text>
          </HomeLiquidCard>
        </Pressable>

        <Text style={styles.sectionLabel}>{t("home.upNext")}</Text>
        <HomeLiquidLessonTile
          onPress={onLessonPress}
          style={styles.cardSpacerTight}
        >
          <View style={styles.lessonTextCol}>
            <Text style={styles.lessonLabel}>{lessonLabel}</Text>
            <Text style={styles.lessonTitle} numberOfLines={2}>
              {lessonTitle}
            </Text>
            <Text style={styles.lessonTapHint}>{t("home.tapToContinue")}</Text>
          </View>
          <CoffeeCupFlat width={84} height={84} />
        </HomeLiquidLessonTile>

        {recentTitle ? (
          <>
            <Text style={styles.sectionLabel}>{t("home.recentActivity")}</Text>
            <Pressable onPress={onRecentPress} accessibilityRole="button">
              <HomeLiquidCard
                interactive
                style={styles.cardSpacerTight}
                contentStyle={styles.recentInner}
              >
                <View style={styles.recentCopy}>
                  <Text style={styles.recentHint}>{recentHint}</Text>
                  <Text style={styles.recentTitle} numberOfLines={2}>
                    {recentTitle}
                  </Text>
                </View>
                <Text style={styles.recentChevron}>›</Text>
              </HomeLiquidCard>
            </Pressable>
          </>
        ) : null}

        <Text style={styles.questsSectionTitle}>{t("home.todaysQuests")}</Text>
        <HomeLiquidCard contentStyle={styles.questsInner}>
          {quests.map((q, i) => (
            <QuestRow key={q.id} {...q} isLast={i === quests.length - 1} />
          ))}
        </HomeLiquidCard>
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
    marginBottom: 4,
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
  gamesChip: {
    backgroundColor: C.blue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  gamesChipText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: 0.5,
  },
  cardSpacer: {
    marginTop: 16,
  },
  cardSpacerTight: {
    marginTop: 10,
  },
  sectionLabel: {
    ...HomeType.section,
    color: C.navy,
    marginTop: 20,
    marginBottom: 8,
  },
  pathProgressInner: {
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  pathRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 8,
  },
  pathRowSpaced: {
    marginTop: 14,
  },
  pathLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    flex: 1,
  },
  pathPct: {
    ...HomeType.caption,
    color: C.grayLight,
    textAlign: "right",
  },
  pathBar: {
    marginTop: 6,
  },
  lessonTapHint: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.78)",
    fontFamily: "DINNextRoundedMedium",
    marginTop: 8,
  },
  recentInner: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  recentCopy: {
    flex: 1,
    gap: 4,
  },
  recentHint: {
    ...HomeType.caption,
    color: C.grayLight,
  },
  recentTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.2,
  },
  recentChevron: {
    fontSize: 28,
    fontWeight: "300",
    color: C.blue,
    marginLeft: 8,
  },
  heroInner: {
    padding: 18,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  heroCopy: {
    flex: 1,
    gap: 2,
  },
  heroTitle: {
    ...HomeType.heading,
    color: C.navy,
  },
  heroSub: {
    ...HomeType.body,
    color: C.gray,
    marginTop: 2,
  },
  dailyInner: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  dailyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dailyCopy: {
    flex: 1,
    paddingRight: 8,
  },
  dailyXpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardHeading: {
    ...HomeType.section,
    color: C.navy,
  },
  dailyXp: {
    fontSize: 16,
    fontWeight: "600",
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
  },
  widgetPromoInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  widgetPromoCopy: {
    flex: 1,
    gap: 4,
  },
  widgetPromoTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  widgetPromoSub: {
    fontSize: 13,
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
    lineHeight: 18,
  },
  widgetPromoChevron: {
    fontSize: 28,
    fontWeight: "300",
    color: C.blue,
  },
  lessonTextCol: {
    flex: 1,
    gap: 2,
  },
  lessonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.92)",
    fontFamily: "DINNextRoundedMedium",
    letterSpacing: -0.1,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.5,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 10,
  },
  star: {
    fontSize: 20,
    color: C.gold,
  },
  starEmpty: {
    color: "rgba(255,255,255,0.38)",
  },
  questsSectionTitle: {
    ...HomeType.section,
    color: C.navy,
    marginTop: 24,
    marginBottom: 12,
  },
  questsInner: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  questRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
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
    fontSize: 16,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.2,
  },
  questProgressLabel: {
    ...HomeType.caption,
    color: C.grayLight,
  },
  questBar: {
    marginTop: 4,
    maxWidth: "100%",
  },
});
