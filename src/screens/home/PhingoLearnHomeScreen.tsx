import { PressableScale } from "@/components/animations";
import { CoffeeCupIllustration } from "@/components/icons/HomeDashboardIcons";
import { Icon3DTarget, Icon3DZap } from "@/components/icons/Icon3D";
import { Card25D } from "@/components/ui/Card25D";
import { ThinProgressBar } from "@/components/ui/ThinProgressBar";
import { Chest, Fire, Heart, LessonHeadphone } from "@/constants/icons";
import { crossShadow } from "@/utils/shadows";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhingoMascot from "@/assets/images/svg/phingo charecter.svg";

const C = {
  bg: "#F0F6FC",
  ink: "#3C3C3C",
  inkSoft: "#777777",
  blue: "#1CB0F6",
  blueDark: "#1899D6",
  blueDeep: "#1480BA",
  orange: "#FF9600",
  red: "#FF4B4B",
  purple: "#CE82FF",
  track: "#E8EDF2",
  gold: "#FFC800",
};

const QUESTS: {
  id: string;
  title: string;
  progress: number;
  renderIcon: () => React.ReactNode;
}[] = [
  {
    id: "xp",
    title: "Earn 20 XP",
    progress: 8 / 20,
    renderIcon: () => <Icon3DZap size={28} />,
  },
  {
    id: "listen",
    title: "Do a listening lesson",
    progress: 0,
    renderIcon: () => (
      <View style={styles.questIconPurple}>
        <LessonHeadphone width={22} height={22} />
      </View>
    ),
  },
  {
    id: "score",
    title: "Score 80% or higher",
    progress: 0,
    renderIcon: () => <Icon3DTarget size={28} />,
  },
];

const QuestRow = memo(function QuestRow({
  title,
  progress,
  renderIcon,
  isLast,
}: {
  title: string;
  progress: number;
  renderIcon: () => React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.questRow, !isLast && styles.questRowBorder]}>
      <View style={styles.questLeft}>
        {renderIcon()}
        <View style={styles.questTextCol}>
          <Text style={styles.questTitle}>{title}</Text>
          <ThinProgressBar
            progress={progress}
            style={styles.questBar}
            height={7}
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
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: horizontalPad,
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Phingo</Text>
          <View style={styles.headerStats}>
            <View style={styles.statPill}>
              <Fire width={22} height={22} />
              <Text style={styles.statFire}>12</Text>
            </View>
            <View style={styles.statPill}>
              <Heart width={22} height={22} />
              <Text style={styles.statHeart}>5</Text>
            </View>
          </View>
        </View>

        {/* Hi there hero */}
        <Card25D
          style={{ marginTop: 16 }}
          faceStyle={styles.heroFace}
          edgeColor="#D8DEE6"
        >
          <View style={styles.heroRow}>
            <View style={styles.heroMascot}>
              <PhingoMascot width={72} height={72} />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Hi there!</Text>
              <Text style={styles.heroSub}>
                Let's learn Kurdish (Sorani)
              </Text>
              <PressableScale onPress={onContinue} scaleDown={0.97} haptic>
                <LinearGradient
                  colors={[C.blue, C.blueDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={[
                    styles.continueBtn,
                    crossShadow({
                      color: C.blueDark,
                      offsetY: 4,
                      blur: 0,
                      opacity: 1,
                      elevation: 0,
                    }),
                  ]}
                >
                  <Text style={styles.continueLabel}>CONTINUE</Text>
                </LinearGradient>
              </PressableScale>
            </View>
          </View>
        </Card25D>

        {/* Daily goal */}
        <Card25D
          style={{ marginTop: 14 }}
          faceStyle={styles.dailyFace}
          edgeColor="#D8DEE6"
        >
          <View style={styles.dailyRow}>
            <View style={styles.dailyCopy}>
              <Text style={styles.cardHeading}>Daily goal</Text>
              <Text style={styles.dailyXp}>8 / 15 XP</Text>
              <ThinProgressBar
                progress={8 / 15}
                style={{ marginTop: 10, maxWidth: cardWidth * 0.52 }}
              />
            </View>
            <View style={styles.chestWrap}>
              <Chest width={64} height={64} />
            </View>
          </View>
        </Card25D>

        {/* Featured lesson */}
        <PressableScale
          onPress={onLessonPress}
          scaleDown={0.98}
          style={{ marginTop: 14 }}
        >
          <LinearGradient
            colors={[C.blue, C.blueDark, C.blueDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.lessonCard,
              crossShadow({
                color: C.blueDeep,
                offsetY: 6,
                blur: 14,
                opacity: 0.28,
                elevation: 6,
              }),
            ]}
          >
            <View style={styles.lessonTextCol}>
              <Text style={styles.lessonLabel}>Lesson 5</Text>
              <Text style={styles.lessonTitle}>At the Café</Text>
              <StarRating filled={2} />
            </View>
            <CoffeeCupIllustration width={92} height={92} />
          </LinearGradient>
        </PressableScale>

        {/* Today's quests */}
        <Text style={styles.questsSectionTitle}>Today's quests</Text>
        <Card25D faceStyle={styles.questsCard} edgeColor="#D8DEE6">
          {QUESTS.map((q, i) => (
            <QuestRow
              key={q.id}
              title={q.title}
              progress={q.progress}
              renderIcon={q.renderIcon}
              isLast={i === QUESTS.length - 1}
            />
          ))}
        </Card25D>
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
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: C.blue,
    letterSpacing: -0.5,
    fontFamily: "DINNextRoundedBold",
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statFire: {
    fontSize: 16,
    fontWeight: "800",
    color: C.orange,
    fontFamily: "DINNextRoundedBold",
  },
  statHeart: {
    fontSize: 16,
    fontWeight: "800",
    color: C.red,
    fontFamily: "DINNextRoundedBold",
  },
  heroFace: {
    padding: 16,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroMascot: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.ink,
    fontFamily: "DINNextRoundedBold",
  },
  heroSub: {
    fontSize: 14,
    fontWeight: "600",
    color: C.inkSoft,
    lineHeight: 20,
    fontFamily: "DINNextRoundedMedium",
  },
  continueBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: C.blueDeep,
  },
  continueLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.8,
    fontFamily: "DINNextRoundedBold",
  },
  dailyFace: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  dailyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dailyCopy: {
    flex: 1,
    paddingRight: 8,
  },
  cardHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: C.ink,
    fontFamily: "DINNextRoundedBold",
  },
  dailyXp: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "700",
    color: C.inkSoft,
    fontFamily: "DINNextRoundedMedium",
  },
  chestWrap: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  lessonCard: {
    borderRadius: 24,
    padding: 20,
    minHeight: 128,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  lessonTextCol: {
    flex: 1,
    gap: 4,
  },
  lessonLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
    fontFamily: "DINNextRoundedMedium",
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  star: {
    fontSize: 22,
    color: C.gold,
  },
  starEmpty: {
    color: "rgba(255,255,255,0.35)",
  },
  questsSectionTitle: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "800",
    color: C.ink,
    fontFamily: "DINNextRoundedBold",
  },
  questsCard: {
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  questRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    gap: 10,
  },
  questRowBorder: {
    borderBottomWidth: 2,
    borderBottomColor: "#EEF2F6",
  },
  questLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  questTextCol: {
    flex: 1,
    gap: 6,
  },
  questTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.ink,
    fontFamily: "DINNextRoundedBold",
  },
  questBar: {
    maxWidth: "100%",
  },
  questIconPurple: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  xpBadge: {
    backgroundColor: C.blue,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: C.blueDeep,
  },
  xpBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
});
