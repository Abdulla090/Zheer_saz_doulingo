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
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";
import { Fire, Heart } from "@/constants/icons";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo } from "react";
import {
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

function StarRating({ filled }: { filled: number }) {
  return (
    <View style={styles.starsRow}>
      {[0, 1, 2].map((i) => (
        <Text
          key={i}
          style={[styles.star, i >= filled && styles.starEmpty]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

export function PhingoLearnHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useI18n();
  const streakDays = useProgressStore((s) => s.streakDays);
  const dailyXp = useProgressStore((s) => s.dailyXp);
  const dailyGoalXp = useProgressStore((s) => s.dailyGoalXp);
  const { width } = useWindowDimensions();
  const horizontalPad = 20;
  const cardWidth = width - horizontalPad * 2;

  const quests = useMemo<QuestDef[]>(
    () => [
      {
        id: "xp",
        title: t("home.questXp"),
        progress: 8 / 20,
        progressLabel: "8 / 20",
        renderIcon: () => <QuestZapFlat size={40} />,
      },
      {
        id: "listen",
        title: t("home.questListen"),
        progress: 0,
        progressLabel: "0 / 1",
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
    [t],
  );

  const onContinue = useCallback(() => {
    router.push("/dashboard?mode=normal");
  }, [router]);

  const onLessonPress = useCallback(() => {
    router.push("/lesson");
  }, [router]);

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
            <View style={styles.statItem}>
              <Heart width={24} height={24} />
              <Text style={styles.statHeart}>5</Text>
            </View>
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

        <HomeLiquidLessonTile
          onPress={onLessonPress}
          style={styles.cardSpacer}
        >
          <View style={styles.lessonTextCol}>
            <Text style={styles.lessonLabel}>{t("home.lessonLabel")}</Text>
            <Text style={styles.lessonTitle}>{t("home.lessonTitle")}</Text>
            <StarRating filled={2} />
          </View>
          <CoffeeCupFlat width={84} height={84} />
        </HomeLiquidLessonTile>

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
  statHeart: {
    fontSize: 17,
    fontWeight: "700",
    color: C.red,
    fontFamily: "DINNextRoundedBold",
  },
  cardSpacer: {
    marginTop: 16,
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
