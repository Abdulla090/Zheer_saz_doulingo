import { PremiumPressable } from "../../components/PremiumPressable";
import { crossShadow } from "../../utils/shadows";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View, ScrollView, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  FireIcon,
} from "@hugeicons/core-free-icons";
import Svg, { Circle } from "react-native-svg";
import { useRouter } from "expo-router";

import { AppText } from "../../components/ui/AppText";
import { Colors } from "../../constants/theme";
import { useI18n } from "../../hooks/useI18n";
import { useProgressStore } from "../../stores/useProgressStore";

const GAMES = [
  {
    key: "voice-tutor",
    titleKey: "games.voiceTutorTitle",
    subKey: "games.voiceTutorSub",
    imageBackground: "#EDF4FF",
    tileBackground: "rgba(59, 130, 246, 0.075)",
    accentColor: "#3B82F6",
    image: require("../../../assets/images/games/ui/voice-tutor.png"),
    href: "/voice-tutor" as const,
  },
  {
    key: "reading-practice",
    titleKey: "games.paragraphSpeechTitle",
    subKey: "games.paragraphSpeechSub",
    imageBackground: "#FFF6E5",
    tileBackground: "rgba(245, 158, 11, 0.075)",
    accentColor: "#FF9D32",
    image: require("../../../assets/images/games/ui/reading-practice.png"),
    href: "/reading-practice" as const,
  },
  {
    key: "podcast",
    titleKey: "games.podcastTitle",
    subKey: "games.podcastSub",
    imageBackground: "#EAFBF5",
    tileBackground: "rgba(16, 185, 129, 0.07)",
    accentColor: "#22BFAE",
    image: require("../../../assets/images/games/ui/podcast.png"),
    href: "/podcast" as const,
  },
  {
    key: "slang",
    titleKey: "games.slangTitle",
    subKey: "games.slangSub",
    imageBackground: "#FFF0EA",
    tileBackground: "rgba(255, 107, 74, 0.07)",
    accentColor: "#F06A92",
    image: require("../../../assets/images/games/ui/slang-dictionary.png"),
    href: "/slang" as const,
  },
  {
    key: "roleplay",
    titleKey: "games.rolePlayTitle",
    subKey: "games.rolePlaySub",
    imageBackground: "#F3EEFF",
    tileBackground: "rgba(123, 66, 230, 0.065)",
    accentColor: "#8061F2",
    image: require("../../../assets/images/games/ui/roleplay.png"),
    href: "/roleplay" as const,
  },
  {
    key: "ai-teacher",
    titleKey: "games.teacherTitle",
    subKey: "games.teacherSub",
    imageBackground: "#EDF7FF",
    tileBackground: "rgba(14, 165, 233, 0.07)",
    accentColor: "#3487EE",
    image: require("../../../assets/images/games/ui/ai-teacher.png"),
    href: "/ai-teacher" as const,
  },
] as const;

function ProgressRing({
  progress,
  level,
  label,
  compact,
}: {
  progress: number;
  level: number;
  label: string;
  compact: boolean;
}) {
  const size = compact ? 76 : 96;
  const center = size / 2;
  const radius = compact ? 30 : 38;
  const strokeWidth = compact ? 7 : 8;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.ringWrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} rotation={-90}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - clamped)}
        />
      </Svg>
      <View style={styles.ringCopy}>
        <AppText style={[styles.ringLabel, compact && styles.ringLabelCompact]} forceLatinFont latinRole="bold">{label}</AppText>
        <AppText style={[styles.ringValue, compact && styles.ringValueCompact]} forceLatinFont latinRole="bold">{level}</AppText>
      </View>
    </View>
  );
}

export function GamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t, locale, isKu } = useI18n();
  const { dailyXp, dailyGoalXp, streakDays, totalXp } = useProgressStore();
  const isRtl = isKu || locale === "ar";
  const compact = width < 430;

  const dailyGoal = Math.max(1, dailyGoalXp || 15);
  const dailyProgress = Math.min(1, Math.max(0, (dailyXp || 0) / dailyGoal));
  const level = Math.max(1, Math.floor((totalXp || 0) / 300) + 1);
  const levelXp = Math.max(0, (totalXp || 0) % 300);
  const levelProgress = levelXp / 300;
  const completedDaily = Math.min(3, Math.round(dailyProgress * 3));

  const stylesForScreen = useMemo(() => createStyles(compact), [compact]);

  return (
    <View
      {...(Platform.OS === "web" ? ({ dir: "ltr" } as any) : {})}
      style={[
        stylesForScreen.root,
        Platform.OS !== "web" && ({ direction: "ltr" } as const),
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          stylesForScreen.scrollContent,
          { paddingTop: insets.top + (compact ? 6 : 12), paddingBottom: insets.bottom + 112 },
        ]}
      >
        <View style={stylesForScreen.content}>
           <View style={[stylesForScreen.hero, isRtl && stylesForScreen.heroRtl]}>
             <View style={[stylesForScreen.heroCopy, isRtl && stylesForScreen.heroCopyRtl]}>
              <AppText style={stylesForScreen.heroTitle} forceKurdishFont={isRtl}>
                {t("games.screenTitle")}
              </AppText>
            </View>
            <Image
              source={require("../../../assets/images/mascots/mascot-02.webp")}
              style={[stylesForScreen.heroMascot, isRtl && stylesForScreen.heroMascotRtl]}
              contentFit="contain"
            />
          </View>

          <LinearGradient
            colors={["#7545E8", "#9A69F4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[stylesForScreen.progressBanner, isRtl && stylesForScreen.rowReverse]}
          >
            <ProgressRing progress={levelProgress} level={level} label={t("games.level")} compact={compact} />
             <View style={[stylesForScreen.progressCopy, isRtl && stylesForScreen.progressCopyRtl]}>
              <AppText style={stylesForScreen.progressEyebrow} forceKurdishFont={isRtl}>
                {t("games.xpProgress")}
              </AppText>
              <AppText style={stylesForScreen.progressValue} forceLatinFont latinRole="bold">
                {levelXp} / 300 <AppText style={stylesForScreen.progressUnit} forceLatinFont latinRole="bold">XP</AppText>
              </AppText>
              <View style={[stylesForScreen.progressTrack, isRtl && stylesForScreen.progressTrackRtl]}>
                <View style={[stylesForScreen.progressFill, { width: `${levelProgress * 100}%` }]} />
              </View>
            </View>
            <Image
              source={require("../../../assets/images/games/ui/chest.png")}
               style={[stylesForScreen.chestImage, isRtl && stylesForScreen.chestImageRtl]}
              contentFit="contain"
            />
          </LinearGradient>

          <View style={[stylesForScreen.dailyCard, isRtl && stylesForScreen.rowReverse]}>
            <View style={stylesForScreen.dailyIcon}>
              <HugeiconsIcon icon={Calendar03Icon} size={compact ? 23 : 28} color="#7B42E6" strokeWidth={2.2} />
            </View>
             <View style={[stylesForScreen.dailyCopy, isRtl && stylesForScreen.dailyCopyRtl]}>
              <AppText style={stylesForScreen.dailyTitle} forceKurdishFont={isRtl}>
                {t("games.dailyChallenge")}
              </AppText>
              <AppText style={stylesForScreen.dailySubtitle} forceKurdishFont={isRtl} numberOfLines={compact ? 2 : undefined}>
                {t("games.dailyChallengeSub")}
              </AppText>
            </View>
            <Image
              source={require("../../../assets/images/games/ui/gift.png")}
              style={[stylesForScreen.giftImage, isRtl && stylesForScreen.giftImageRtl]}
              contentFit="contain"
            />
            <View style={[stylesForScreen.dailyBottom, isRtl && stylesForScreen.rowReverse]}>
              <View style={[stylesForScreen.stepRow, isRtl && stylesForScreen.rowReverse]}>
                {[0, 1, 2].map((step) => (
                  <React.Fragment key={step}>
                    <View style={[stylesForScreen.stepDot, step < completedDaily && stylesForScreen.stepDotDone]}>
                      {step < completedDaily ? <AppText style={stylesForScreen.stepCheck} forceLatinFont>✓</AppText> : null}
                    </View>
                    {step < 2 ? <View style={stylesForScreen.stepLine} /> : null}
                  </React.Fragment>
                ))}
              </View>
              <PremiumPressable
                onPress={() => router.push("/voice-tutor")}
                style={stylesForScreen.goButton}
                pressScale={0.95}
              >
                <AppText style={stylesForScreen.goText} forceKurdishFont={isRtl}>{t("games.go")}</AppText>
              </PremiumPressable>
            </View>
          </View>

          <View style={[stylesForScreen.sectionHeader, isRtl && stylesForScreen.rowReverse]}>
            <AppText style={stylesForScreen.sectionTitle} forceKurdishFont={isRtl}>{t("games.sectionExperiences")}</AppText>
            <AppText style={stylesForScreen.seeAll} forceKurdishFont={isRtl} onPress={() => router.push("/path")}>
              {t("games.seeAll")} <AppText style={stylesForScreen.seeAllArrow} forceLatinFont>›</AppText>
            </AppText>
          </View>

          <View style={[stylesForScreen.gameGrid, isRtl && stylesForScreen.gameGridRtl]}>
            {GAMES.map((game) => (
              <PremiumPressable
                key={game.key}
                onPress={() => router.push(game.href as any)}
                containerStyle={stylesForScreen.gameTileContainer}
                style={[
                  stylesForScreen.gameTile,
                  { backgroundColor: game.tileBackground },
                  isRtl && stylesForScreen.gameTileRtl,
                ]}
                pressScale={0.96}
              >
                <View style={[
                  stylesForScreen.tileWash,
                  { backgroundColor: game.imageBackground },
                  isRtl && stylesForScreen.tileWashRtl,
                ]} />
                <View style={[stylesForScreen.tileImageWell, { backgroundColor: game.imageBackground }]}>
                  <Image
                    source={game.image}
                    style={stylesForScreen.tileImage}
                    contentFit="contain"
                  />
                </View>
                <View style={[
                  stylesForScreen.tileCopy,
                  isRtl && stylesForScreen.tileCopyRtl,
                ]}>
                  <AppText
                    style={[stylesForScreen.tileTitle, isRtl && stylesForScreen.tileTitleRtl]}
                    forceKurdishFont={isRtl}
                  >
                    {t(game.titleKey)}
                  </AppText>
                  <AppText
                    style={[stylesForScreen.tileSubtitle, isRtl && stylesForScreen.tileSubtitleRtl]}
                    forceKurdishFont={isRtl}
                    numberOfLines={2}
                  >
                    {t(game.subKey)}
                  </AppText>
                </View>
                <View style={[
                  stylesForScreen.tileArrow,
                  { backgroundColor: game.accentColor },
                  isRtl && stylesForScreen.tileArrowRtl,
                ]}>
                  <HugeiconsIcon
                    icon={isRtl ? ArrowLeft01Icon : ArrowRight01Icon}
                    size={compact ? 16 : 19}
                    color="#FFFFFF"
                    strokeWidth={2.4}
                  />
                </View>
              </PremiumPressable>
            ))}
          </View>

          <View style={[stylesForScreen.streakCard, isRtl && stylesForScreen.rowReverse]}>
            <HugeiconsIcon icon={FireIcon} size={32} color="#FF7A2F" strokeWidth={2.3} />
             <View style={[stylesForScreen.streakCopy, isRtl && stylesForScreen.streakCopyRtl]}>
              <View style={[stylesForScreen.streakHeading, isRtl && stylesForScreen.rowReverse]}>
                <AppText style={stylesForScreen.streakDays} forceLatinFont latinRole="bold">{streakDays || 0}</AppText>
                <AppText style={stylesForScreen.streakLabel} forceKurdishFont={isRtl}>{t("games.dayStreak")}</AppText>
              </View>
              <AppText style={stylesForScreen.streakSub} forceKurdishFont={isRtl}>{t("games.keepStreak")}</AppText>
            </View>
             <View style={[stylesForScreen.streakBars, isRtl && stylesForScreen.streakBarsRtl]}>
              {[0, 1, 2, 3, 4].map((bar) => (
                <View key={bar} style={[stylesForScreen.streakBar, bar < Math.min(5, streakDays || 0) && stylesForScreen.streakBarDone]} />
              ))}
            </View>
            <Image
              source={require("../../../assets/images/games/ui/chest.png")}
               style={[stylesForScreen.streakChest, isRtl && stylesForScreen.streakChestRtl]}
              contentFit="contain"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrap: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCopy: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 16,
  },
  ringValue: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 31,
  },
  ringLabelCompact: {
    fontSize: 10,
    lineHeight: 13,
  },
  ringValueCompact: {
    fontSize: 22,
    lineHeight: 25,
  },
});

function createStyles(compact: boolean) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "#F8F7FD",
    },
    scrollContent: {
      alignItems: "center",
    },
    content: {
      width: "100%",
      maxWidth: 720,
      paddingHorizontal: compact ? 16 : 24,
    },
    rowReverse: {
      flexDirection: "row-reverse",
    },
    hero: {
      minHeight: compact ? 188 : 262,
      position: "relative",
      justifyContent: "flex-start",
      paddingTop: compact ? 10 : 18,
    },
    heroRtl: {
      alignItems: "flex-end",
    },
    heroCopy: {
      width: compact ? "56%" : "58%",
      zIndex: 2,
    },
    heroCopyRtl: {
      alignItems: "flex-end",
    },
    heroTitle: {
      color: "#101A3A",
      fontSize: compact ? 40 : 56,
      lineHeight: compact ? 47 : 64,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    heroMascot: {
      position: "absolute",
      right: compact ? -10 : -8,
      bottom: compact ? -2 : -4,
      width: compact ? 132 : 282,
      height: compact ? 132 : 282,
      zIndex: 1,
    },
    heroMascotRtl: {
      right: "auto",
      left: compact ? -10 : -8,
      transform: [{ scaleX: -1 }],
    },
    progressBanner: {
      minHeight: compact ? 116 : 168,
      borderRadius: compact ? 24 : 28,
      paddingHorizontal: compact ? 14 : 22,
      paddingVertical: compact ? 12 : 18,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
      ...crossShadow({ color: "#7041DC", offsetY: 10, blur: 22, opacity: 0.2 }),
    },
    progressCopy: {
      flex: 1,
      minWidth: 0,
      marginLeft: compact ? 8 : 20,
      zIndex: 2,
    },
    progressCopyRtl: {
      marginLeft: 0,
      marginRight: compact ? 8 : 20,
      alignItems: "flex-end",
    },
    progressEyebrow: {
      color: "rgba(255,255,255,0.9)",
      fontSize: compact ? 12 : 14,
      lineHeight: compact ? 15 : 18,
      fontWeight: "700",
    },
    progressValue: {
      color: "#FFFFFF",
      fontSize: compact ? 21 : 31,
      lineHeight: compact ? 27 : 39,
      marginTop: compact ? 2 : 4,
    },
    progressUnit: {
      fontSize: compact ? 15 : 23,
    },
    progressTrack: {
      height: compact ? 8 : 11,
      borderRadius: 6,
      backgroundColor: "rgba(55,32,151,0.5)",
      overflow: "hidden",
      marginTop: compact ? 8 : 12,
      width: compact ? "46%" : "78%",
    },
    progressTrackRtl: {
      alignSelf: "flex-end",
    },
    progressFill: {
      height: "100%",
      borderRadius: 6,
      backgroundColor: "#FFD46A",
    },
    chestImage: {
      position: "absolute",
      right: compact ? 4 : 8,
      bottom: compact ? 2 : -4,
      width: compact ? 82 : 142,
      height: compact ? 82 : 142,
      zIndex: 1,
    },
    chestImageRtl: {
      right: "auto",
      left: compact ? 4 : 8,
    },
    dailyCard: {
      minHeight: compact ? 238 : 268,
      backgroundColor: "#FFFEFF",
      borderRadius: compact ? 30 : 34,
      marginTop: compact ? 18 : 28,
      paddingHorizontal: compact ? 18 : 26,
      paddingTop: compact ? 22 : 30,
      paddingBottom: compact ? 20 : 22,
      position: "relative",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#EEE8FA",
      ...crossShadow({ color: "#6674A9", offsetY: 10, blur: 26, opacity: 0.11 }),
    },
    dailyIcon: {
      width: compact ? 56 : 66,
      height: compact ? 56 : 66,
      borderRadius: compact ? 18 : 20,
      backgroundColor: "#F4EEFF",
      alignItems: "center",
      justifyContent: "center",
    },
    dailyCopy: {
      position: "absolute",
      left: compact ? 78 : 106,
      right: compact ? 80 : 152,
      top: compact ? 25 : 36,
      minHeight: compact ? 78 : 92,
    },
    dailyCopyRtl: {
      left: compact ? 80 : 152,
      right: compact ? 78 : 106,
      alignItems: "flex-end",
    },
    dailyTitle: {
      color: "#7A42E6",
      fontSize: compact ? 16 : 21,
      lineHeight: compact ? 20 : 28,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    dailySubtitle: {
      color: "#141E3D",
      fontSize: compact ? 13 : 18,
      lineHeight: compact ? 18 : 26,
      marginTop: compact ? 4 : 8,
      maxWidth: 280,
    },
    giftImage: {
      position: "absolute",
      width: compact ? 88 : 118,
      height: compact ? 88 : 118,
      right: compact ? 8 : 20,
      bottom: compact ? 82 : 76,
    },
    giftImageRtl: {
      right: "auto",
      left: compact ? 8 : 20,
    },
    dailyBottom: {
      position: "absolute",
      left: compact ? 14 : 24,
      right: compact ? 14 : 24,
      bottom: compact ? 18 : 22,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: compact ? 10 : 0,
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
      flex: compact ? 1 : undefined,
    },
    stepDot: {
      width: compact ? 24 : 28,
      height: compact ? 24 : 28,
      borderRadius: compact ? 12 : 14,
      borderWidth: 2,
      borderColor: "#E1D6FA",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
    },
    stepDotDone: {
      backgroundColor: "#7B42E6",
      borderColor: "#7B42E6",
    },
    stepCheck: {
      color: "#FFFFFF",
      fontSize: 17,
      lineHeight: 19,
    },
    stepLine: {
      width: compact ? undefined : 54,
      flex: compact ? 1 : undefined,
      height: 4,
      borderRadius: 2,
      backgroundColor: "#D9C9FA",
      marginHorizontal: compact ? 4 : 6,
    },
    goButton: {
      minWidth: compact ? 66 : 86,
      height: compact ? 40 : 52,
      paddingHorizontal: compact ? 12 : 18,
      borderRadius: compact ? 20 : 26,
      backgroundColor: "#FCFBFF",
      alignItems: "center",
      justifyContent: "center",
      ...crossShadow({ color: "#8A77C8", offsetY: 4, blur: 12, opacity: 0.12 }),
    },
    goText: {
      color: "#7B42E6",
      fontSize: compact ? 16 : 20,
      lineHeight: compact ? 20 : 24,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: compact ? 30 : 36,
      marginBottom: compact ? 14 : 18,
      paddingHorizontal: 2,
    },
    sectionTitle: {
      color: "#111B3D",
      fontSize: compact ? 22 : 26,
      lineHeight: compact ? 27 : 32,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    seeAll: {
      color: Colors.light.primary,
      fontSize: compact ? 14 : 16,
      lineHeight: compact ? 20 : 22,
      fontWeight: "800",
    },
    seeAllArrow: {
      color: Colors.light.primary,
      fontSize: compact ? 22 : 25,
      lineHeight: 20,
    },
    gameGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "flex-start",
    },
    gameGridRtl: {
      flexDirection: "row-reverse",
    },
    gameTileContainer: {
      width: "50%",
      padding: compact ? 5 : 7,
    },
    gameTile: {
      width: "100%",
      height: compact ? 190 : 238,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      paddingHorizontal: compact ? 12 : 18,
      paddingVertical: compact ? 12 : 18,
      borderRadius: compact ? 22 : 28,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: "rgba(148, 163, 184, 0.10)",
      overflow: "hidden",
      ...crossShadow({ color: "#64748B", offsetY: 5, blur: 14, opacity: 0.06 }),
    },
    gameTileRtl: {
      alignItems: "flex-end",
    },
    tileWash: {
      position: "absolute",
      width: compact ? 150 : 210,
      height: compact ? 104 : 140,
      borderRadius: 999,
      right: compact ? -54 : -70,
      bottom: compact ? -48 : -58,
      opacity: 0.58,
    },
    tileWashRtl: {
      right: "auto",
      left: compact ? -54 : -70,
    },
    tileImageWell: {
      width: compact ? 72 : 100,
      height: compact ? 72 : 100,
      borderRadius: compact ? 20 : 26,
      alignItems: "center",
      justifyContent: "center",
      borderCurve: "continuous",
      zIndex: 1,
    },
    tileImage: {
      width: compact ? 66 : 92,
      height: compact ? 66 : 92,
    },
    tileCopy: {
      width: "100%",
      alignItems: "flex-start",
      marginTop: compact ? 9 : 12,
      zIndex: 1,
    },
    tileCopyRtl: {
      alignItems: "flex-end",
    },
    tileTitle: {
      color: Colors.light.foreground,
      fontSize: compact ? 14 : 17,
      lineHeight: compact ? 18 : 22,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
      textAlign: "left",
    },
    tileTitleRtl: {
      width: "100%",
      textAlign: "right",
      writingDirection: "rtl",
    },
    tileSubtitle: {
      color: Colors.light.mutedForeground,
      fontSize: compact ? 10 : 12,
      lineHeight: compact ? 14 : 17,
      marginTop: compact ? 4 : 6,
      paddingRight: compact ? 22 : 32,
      textAlign: "left",
    },
    tileSubtitleRtl: {
      width: "100%",
      paddingRight: 0,
      paddingLeft: compact ? 22 : 32,
      textAlign: "right",
      writingDirection: "rtl",
    },
    tileArrow: {
      position: "absolute",
      right: compact ? 11 : 16,
      bottom: compact ? 11 : 16,
      width: compact ? 30 : 38,
      height: compact ? 30 : 38,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },
    tileArrowRtl: {
      right: "auto",
      left: compact ? 11 : 16,
    },
    streakCard: {
      minHeight: compact ? 142 : 158,
      marginTop: compact ? 34 : 40,
      paddingHorizontal: compact ? 18 : 24,
      paddingVertical: compact ? 22 : 26,
      borderRadius: compact ? 30 : 34,
      backgroundColor: "#FFFFFF",
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#EEE8FA",
      ...crossShadow({ color: "#6674A9", offsetY: 10, blur: 24, opacity: 0.1 }),
    },
    streakCopy: {
      marginLeft: 12,
      flex: 1,
      minWidth: 0,
    },
    streakCopyRtl: {
      marginLeft: 0,
      marginRight: 12,
      alignItems: "flex-end",
    },
    streakHeading: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 9,
    },
    streakDays: {
      color: "#FF7A2F",
      fontSize: 28,
      lineHeight: 32,
    },
    streakLabel: {
      color: "#111B3D",
      fontSize: 16,
      lineHeight: 21,
      fontWeight: "800",
    },
    streakSub: {
      color: "#8790A2",
      fontSize: 13,
      lineHeight: 18,
      marginTop: 4,
    },
    streakBars: {
      position: "absolute",
      right: compact ? 88 : 112,
      bottom: compact ? 24 : 28,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    streakBarsRtl: {
      flexDirection: "row-reverse",
      right: "auto",
      left: compact ? 88 : 112,
    },
    streakBar: {
      width: compact ? 20 : 26,
      height: 10,
      borderRadius: 5,
      backgroundColor: "#EEF0F8",
    },
    streakBarDone: {
      backgroundColor: "#FFB42C",
    },
    streakChest: {
      position: "absolute",
      right: compact ? 4 : 10,
      bottom: compact ? 5 : 8,
      width: compact ? 82 : 94,
      height: compact ? 82 : 94,
    },
    streakChestRtl: {
      right: "auto",
      left: compact ? 4 : 10,
    },
  });
}
