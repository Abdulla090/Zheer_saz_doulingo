import { PremiumPressable } from "../../components/PremiumPressable";
import { crossShadow } from "../../utils/shadows";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View, ScrollView, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FireIcon,
} from "@hugeicons/core-free-icons";
import Svg, { Circle } from "react-native-svg";
import { useRouter } from "expo-router";

import { AppText } from "../../components/ui/AppText";
import { getMascot, getMascotDisplayName } from "../../constants/mascots";
import { Colors } from "../../constants/theme";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";

const GAMES = [
  {
    key: "voice-tutor",
    titleKey: "games.voiceTutorTitle",
    subKey: "games.voiceTutorSub",
    tileBackground: "#DDE9F8",
    accentColor: "#3B82F6",
    image: require("../../../assets/images/games/ui/voice-tutor.png"),
    href: "/voice-tutor" as const,
  },
  {
    key: "reading-practice",
    titleKey: "games.paragraphSpeechTitle",
    subKey: "games.paragraphSpeechSub",
    tileBackground: "#EEE8DA",
    accentColor: "#FF9D32",
    image: require("../../../assets/images/games/ui/reading-practice.png"),
    href: "/reading-practice" as const,
  },
  {
    key: "podcast",
    titleKey: "games.podcastTitle",
    subKey: "games.podcastSub",
    tileBackground: "#DCEFED",
    accentColor: "#22BFAE",
    image: require("../../../assets/images/games/ui/podcast.png"),
    href: "/podcast" as const,
  },
  {
    key: "slang",
    titleKey: "games.slangTitle",
    subKey: "games.slangSub",
    tileBackground: "#F1E4EA",
    accentColor: "#F06A92",
    image: require("../../../assets/images/games/ui/slang-dictionary.png"),
    href: "/slang" as const,
  },
  {
    key: "roleplay",
    titleKey: "games.rolePlayTitle",
    subKey: "games.rolePlaySub",
    tileBackground: "#E7E0F4",
    accentColor: "#8061F2",
    image: require("../../../assets/images/games/ui/roleplay.png"),
    href: "/roleplay" as const,
  },
  {
    key: "ai-teacher",
    titleKey: "games.teacherTitle",
    subKey: "games.teacherSub",
    tileBackground: "#DCECF8",
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
  languageCode,
  foregroundColor,
  trackColor,
}: {
  progress: number;
  level: number;
  label: string;
  compact: boolean;
  languageCode: string;
  foregroundColor: string;
  trackColor: string;
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
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={foregroundColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - clamped)}
        />
      </Svg>
      <View style={styles.ringCopy}>
        <AppText
          style={[styles.ringLabel, compact && styles.ringLabelCompact, { color: foregroundColor }]}
          languageCode={languageCode}
          latinRole="bold"
        >
          {label}
        </AppText>
        <AppText style={[styles.ringValue, compact && styles.ringValueCompact, { color: foregroundColor }]} forceLatinFont latinRole="bold">{level}</AppText>
      </View>
    </View>
  );
}

export function GamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t, locale, isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const { streakDays, totalXp } = useProgressStore();
  const selectedMascotId = useSettingsStore((state) => state.selectedMascotId);
  const isRtl = isKu || locale === "ar";
  const compact = width < 600;
  const selectedMascot = getMascot(selectedMascotId);
  const selectedMascotName = getMascotDisplayName(selectedMascot, locale);
  const progressPalette = selectedMascot.progressPalette;

  const level = Math.max(1, Math.floor((totalXp || 0) / 300) + 1);
  const levelXp = Math.max(0, (totalXp || 0) % 300);
  const levelProgress = levelXp / 300;

  const stylesForScreen = useMemo(
    () => createStyles(compact, colors, isDark),
    [colors, compact, isDark],
  );

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
              source={selectedMascot.source}
              accessibilityLabel={
                locale === "ku"
                  ? `ماسکۆتی ${selectedMascotName}`
                  : `${selectedMascotName} mascot`
              }
              style={[
                stylesForScreen.heroMascot,
                selectedMascot.framed && stylesForScreen.heroMascotFramed,
                isRtl && stylesForScreen.heroMascotRtl,
              ]}
              contentFit="contain"
            />
          </View>

          <View
            style={[
              stylesForScreen.progressBanner,
              {
                backgroundColor: progressPalette.background,
                ...crossShadow({
                  color: progressPalette.shadow,
                  offsetY: 10,
                  blur: 22,
                  opacity: 0.2,
                }),
              },
              isRtl && stylesForScreen.rowReverse,
            ]}
          >
            <ProgressRing
              progress={levelProgress}
              level={level}
              label={t("games.level")}
              compact={compact}
              languageCode={locale}
              foregroundColor={progressPalette.foreground}
              trackColor={progressPalette.ringTrack}
            />
             <View style={[stylesForScreen.progressCopy, isRtl && stylesForScreen.progressCopyRtl]}>
              <AppText
                style={[stylesForScreen.progressEyebrow, { color: progressPalette.secondaryText }]}
                forceKurdishFont={isRtl}
              >
                {t("games.xpProgress")}
              </AppText>
              <AppText
                style={[stylesForScreen.progressValue, { color: progressPalette.foreground }]}
                forceLatinFont
                latinRole="bold"
              >
                {levelXp} / 300{" "}
                <AppText
                  style={[
                    stylesForScreen.progressUnit,
                    { color: progressPalette.foreground },
                  ]}
                  forceLatinFont
                  latinRole="bold"
                >
                  XP
                </AppText>
              </AppText>
              <View
                style={[
                  stylesForScreen.progressTrack,
                  { backgroundColor: progressPalette.track },
                  isRtl && stylesForScreen.progressTrackRtl,
                ]}
              >
                <View
                  style={[
                    stylesForScreen.progressFill,
                    {
                      width: `${levelProgress * 100}%`,
                      backgroundColor: progressPalette.fill,
                    },
                  ]}
                />
              </View>
            </View>
            <Image
              source={require("../../../assets/images/games/ui/chest.png")}
               style={[stylesForScreen.chestImage, isRtl && stylesForScreen.chestImageRtl]}
              contentFit="contain"
            />
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
                  { backgroundColor: isDark ? colors.surfaceRaised : game.tileBackground },
                  isRtl && stylesForScreen.gameTileRtl,
                ]}
                pressScale={0.96}
              >
                <Image
                  source={game.image}
                  style={stylesForScreen.tileImage}
                  contentFit="contain"
                />
                <View style={[
                  stylesForScreen.tileCopy,
                  isRtl && stylesForScreen.tileCopyRtl,
                ]}>
                  <AppText
                    style={[stylesForScreen.tileTitle, isRtl && stylesForScreen.tileTitleRtl]}
                    forceKurdishFont={isRtl}
                    numberOfLines={2}
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
    fontSize: 12,
    lineHeight: 16,
  },
  ringValue: {
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

function createStyles(
  compact: boolean,
  colors: (typeof Colors)["light"] | (typeof Colors)["dark"],
  isDark: boolean,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.foreground,
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
    heroMascotFramed: {
      borderRadius: compact ? 30 : 48,
      overflow: "hidden",
      backgroundColor: colors.muted,
    },
    progressBanner: {
      minHeight: compact ? 116 : 168,
      borderRadius: compact ? 24 : 28,
      paddingHorizontal: compact ? 14 : 22,
      paddingVertical: compact ? 12 : 18,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
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
      fontSize: compact ? 12 : 14,
      lineHeight: compact ? 15 : 18,
      fontWeight: "700",
    },
    progressValue: {
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
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: compact ? 30 : 36,
      marginBottom: compact ? 14 : 18,
      paddingHorizontal: 2,
    },
    sectionTitle: {
      color: colors.foreground,
      fontSize: compact ? 22 : 26,
      lineHeight: compact ? 27 : 32,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    seeAll: {
      color: colors.primary,
      fontSize: compact ? 14 : 16,
      lineHeight: compact ? 20 : 22,
      fontWeight: "800",
    },
    seeAllArrow: {
      color: colors.primary,
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
      minHeight: compact ? 196 : 238,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      paddingHorizontal: compact ? 13 : 18,
      paddingTop: compact ? 12 : 18,
      paddingBottom: compact ? 48 : 62,
      borderRadius: compact ? 22 : 28,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      ...crossShadow({ color: "#64748B", offsetY: 5, blur: 14, opacity: 0.06 }),
    },
    gameTileRtl: {
      alignItems: "flex-end",
    },
    tileImage: {
      width: compact ? 60 : 86,
      height: compact ? 60 : 86,
      alignSelf: "flex-end",
      zIndex: 1,
    },
    tileCopy: {
      width: "100%",
      alignItems: "flex-start",
      marginTop: compact ? 14 : 18,
      zIndex: 1,
    },
    tileCopyRtl: {
      alignItems: "flex-end",
    },
    tileTitle: {
      color: colors.foreground,
      fontSize: compact ? 17 : 21,
      lineHeight: compact ? 22 : 27,
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
      color: colors.mutedForeground,
      fontSize: compact ? 12 : 15,
      lineHeight: compact ? 17 : 21,
      marginTop: compact ? 4 : 6,
      paddingRight: compact ? 28 : 36,
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
      backgroundColor: colors.surface,
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.foreground,
      fontSize: 16,
      lineHeight: 21,
      fontWeight: "800",
    },
    streakSub: {
      color: colors.mutedForeground,
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
      backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "#EEF0F8",
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
