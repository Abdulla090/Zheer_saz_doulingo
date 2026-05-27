import { PressableScale } from "@/components/animations";
import {
  ChestFlat,
  CoffeeCupFlat,
  DolphinFlat,
  QuestHeadphonesFlat,
  QuestTargetFlat,
  QuestZapFlat,
} from "@/components/icons/HomeDashboardIcons";
import { FlatCard } from "@/components/ui/FlatCard";
import { ThinProgressBar } from "@/components/ui/ThinProgressBar";
import { Fire, Heart } from "@/constants/icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
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

/** Reference palette — flat Phingo home */
const C = {
  bg: "#FFFFFF",
  blue: "#2B59F3",
  navy: "#1A2B48",
  gray: "#6B7280",
  grayLight: "#9CA3AF",
  track: "#E8EDF2",
  orange: "#FF9600",
  red: "#FF4B4B",
  gold: "#FFC800",
  divider: "#EEF2F6",
  xpBorder: "#BFDBFE",
  xpBg: "#EFF6FF",
};

type QuestDef = {
  id: string;
  title: string;
  progress: number;
  progressLabel?: string;
  renderIcon: () => React.ReactNode;
};

const QUESTS: QuestDef[] = [
  {
    id: "xp",
    title: "Earn 20 XP",
    progress: 8 / 20,
    progressLabel: "8 / 20",
    renderIcon: () => <QuestZapFlat size={40} />,
  },
  {
    id: "listen",
    title: "Do a listening lesson",
    progress: 0,
    progressLabel: "0 / 1",
    renderIcon: () => <QuestHeadphonesFlat size={40} />,
  },
  {
    id: "score",
    title: "Score 80% or higher",
    progress: 0,
    progressLabel: "0 / 1",
    renderIcon: () => <QuestTargetFlat size={40} />,
  },
];

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
      <View style={styles.xpBadge}>
        <Text style={styles.xpBadgeText}>XP</Text>
      </View>
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
  const { width } = useWindowDimensions();
  const horizontalPad = 20;
  const cardWidth = width - horizontalPad * 2;

  const onContinue = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/dashboard?mode=normal");
  }, [router]);

  const onLessonPress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/lesson");
  }, [router]);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
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
              <Text style={styles.statFire}>12</Text>
            </View>
            <View style={styles.statItem}>
              <Heart width={24} height={24} />
              <Text style={styles.statHeart}>5</Text>
            </View>
          </View>
        </View>

        <FlatCard style={styles.cardSpacer} contentStyle={styles.heroInner}>
          <View style={styles.heroRow}>
            <DolphinFlat width={72} height={72} />
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Hi there!</Text>
              <Text style={styles.heroSub}>Let's learn Kurdish (Sorani)</Text>
              <Pressable
                onPress={onContinue}
                style={({ pressed }) => [
                  styles.continueBtn,
                  pressed && styles.continueBtnPressed,
                ]}
              >
                <Text style={styles.continueLabel}>CONTINUE</Text>
              </Pressable>
            </View>
          </View>
        </FlatCard>

        <FlatCard style={styles.cardSpacer} contentStyle={styles.dailyInner}>
          <Text style={styles.cardHeading}>Daily goal</Text>
          <View style={styles.dailyRow}>
            <View style={styles.dailyCopy}>
              <View style={styles.dailyXpRow}>
                <DiamondIcon />
                <Text style={styles.dailyXp}>8 / 15 XP</Text>
              </View>
              <ThinProgressBar
                progress={8 / 15}
                fillColor={C.blue}
                trackColor={C.track}
                height={8}
                style={{ marginTop: 10, maxWidth: cardWidth * 0.55 }}
              />
            </View>
            <ChestFlat width={64} height={64} />
          </View>
        </FlatCard>

        <Pressable
          onPress={onLessonPress}
          style={({ pressed }) => [
            styles.lessonCard,
            styles.cardSpacer,
            pressed && { opacity: 0.92 },
          ]}
        >
          <View style={styles.lessonTextCol}>
            <Text style={styles.lessonLabel}>Lesson 5</Text>
            <Text style={styles.lessonTitle}>At the Café</Text>
            <StarRating filled={2} />
          </View>
          <CoffeeCupFlat width={84} height={84} />
        </Pressable>

        <Text style={styles.questsSectionTitle}>Today's quests</Text>
        <FlatCard contentStyle={styles.questsInner}>
          {QUESTS.map((q, i) => (
            <QuestRow key={q.id} {...q} isLast={i === QUESTS.length - 1} />
          ))}
        </FlatCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: C.blue,
    letterSpacing: -0.8,
    fontFamily: "DINNextRoundedBold",
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
    fontSize: 22,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  heroSub: {
    fontSize: 15,
    fontWeight: "500",
    color: C.gray,
    lineHeight: 21,
    fontFamily: "DINNextRoundedRegular",
    marginTop: 2,
  },
  continueBtn: {
    marginTop: 14,
    backgroundColor: C.blue,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueBtnPressed: {
    opacity: 0.88,
  },
  continueLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
    fontFamily: "DINNextRoundedBold",
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
    fontSize: 18,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  dailyXp: {
    fontSize: 16,
    fontWeight: "600",
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
  },
  lessonCard: {
    backgroundColor: C.blue,
    borderRadius: 28,
    padding: 20,
    minHeight: 124,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lessonTextCol: {
    flex: 1,
    gap: 2,
  },
  lessonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    fontFamily: "DINNextRoundedMedium",
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
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
    color: "rgba(255,255,255,0.35)",
  },
  questsSectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
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
  },
  questProgressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.grayLight,
    fontFamily: "DINNextRoundedMedium",
  },
  questBar: {
    marginTop: 4,
    maxWidth: "100%",
  },
  xpBadge: {
    minWidth: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: C.xpBorder,
    backgroundColor: C.xpBg,
    alignItems: "center",
    justifyContent: "center",
  },
  xpBadgeText: {
    color: C.blue,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
});
