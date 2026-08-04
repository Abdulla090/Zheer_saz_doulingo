import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FireIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

import { CreditPacksButton } from "../../components/CreditPacksButton";
import { PremiumPressable } from "../../components/PremiumPressable";
import { AppText } from "../../components/ui/AppText";
import { DirectionBoundary } from "../../i18n/layout-direction";
import { getMascot } from "../../constants/mascots";
import { Colors } from "../../constants/theme";
import { isDesktopWebWidth } from "../../constants/web-layout";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { crossShadow } from "../../utils/shadows";

const GAMES = [
  {
    key: "voice-tutor",
    titleKey: "games.voiceTutorTitle",
    subKey: "games.voiceTutorSub",
    href: "/voice-tutor" as const,
  },
  {
    key: "reading-practice",
    titleKey: "games.paragraphSpeechTitle",
    subKey: "games.paragraphSpeechSub",
    href: "/reading-practice" as const,
  },
  {
    key: "podcast",
    titleKey: "games.podcastTitle",
    subKey: "games.podcastSub",
    href: "/podcast" as const,
  },
  {
    key: "slang",
    titleKey: "games.slangTitle",
    subKey: "games.slangSub",
    href: "/slang" as const,
  },
  {
    key: "roleplay",
    titleKey: "games.rolePlayTitle",
    subKey: "games.rolePlaySub",
    href: "/roleplay" as const,
  },
  {
    key: "ai-teacher",
    titleKey: "games.teacherTitle",
    subKey: "games.teacherSub",
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
          style={[
            styles.ringLabel,
            compact && styles.ringLabelCompact,
            { color: foregroundColor },
          ]}
          languageCode={languageCode}
          latinRole="bold"
        >
          {label}
        </AppText>
        <AppText
          style={[
            styles.ringValue,
            compact && styles.ringValueCompact,
            { color: foregroundColor },
          ]}
          forceLatinFont
          latinRole="bold"
        >
          {level}
        </AppText>
      </View>
    </View>
  );
}

export function GamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t, locale, isKu } = useI18n();
  const { colors } = useThemeColors();
  const { streakDays, totalXp } = useProgressStore();
  const selectedMascotId = useSettingsStore((state) => state.selectedMascotId);
  const isRtl = isKu || locale === "ar";
  const compact = width < 600;
  const isDesktopWeb = Platform.OS === "web" && isDesktopWebWidth(width);
  const selectedMascot = getMascot(selectedMascotId);
  const progressPalette = selectedMascot.progressPalette;

  const level = Math.max(1, Math.floor((totalXp || 0) / 300) + 1);
  const levelXp = Math.max(0, (totalXp || 0) % 300);
  const levelProgress = levelXp / 300;

  const stylesForScreen = useMemo(
    () => createStyles(compact, colors, isDesktopWeb),
    [colors, compact, isDesktopWeb],
  );

  return (
    <DirectionBoundary direction="ltr" style={stylesForScreen.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          stylesForScreen.scrollContent,
          {
            paddingTop: insets.top + (isDesktopWeb ? 20 : compact ? 6 : 12),
            paddingBottom: insets.bottom + (isDesktopWeb ? 48 : 112),
          },
        ]}
      >
        <View style={stylesForScreen.content}>
          <View
            style={[
              stylesForScreen.screenHeader,
              isRtl && stylesForScreen.rowReverse,
            ]}
          >
            <View
              style={[
                stylesForScreen.headerCopy,
                isRtl && stylesForScreen.headerCopyRtl,
              ]}
            >
              <AppText
                style={stylesForScreen.headerTitle}
                languageCode={locale}
                align="start"
                forceKurdishFont={isRtl}
                fullWidth
              >
                {t("games.screenTitle")}
              </AppText>
              <View
                style={[
                  stylesForScreen.headerRule,
                  { backgroundColor: colors.primary },
                ]}
              />
            </View>
            <CreditPacksButton
              style={isRtl && stylesForScreen.headerPacksButtonRtl}
            />
          </View>

          {/* The user's top XP/level widget is intentionally preserved. */}
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
            <View
              style={[
                stylesForScreen.progressCopy,
                isRtl && stylesForScreen.progressCopyRtl,
              ]}
            >
              <AppText
                style={[
                  stylesForScreen.progressEyebrow,
                  { color: progressPalette.secondaryText },
                ]}
                forceKurdishFont={isRtl}
              >
                {t("games.xpProgress")}
              </AppText>
              <AppText
                style={[
                  stylesForScreen.progressValue,
                  { color: progressPalette.foreground },
                ]}
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
              style={[
                stylesForScreen.chestImage,
                isRtl && stylesForScreen.chestImageRtl,
              ]}
              contentFit="contain"
            />
          </View>

          <AppText
            style={stylesForScreen.sectionTitle}
            languageCode={locale}
            align="start"
            forceKurdishFont={isRtl}
            fullWidth
          >
            {t("games.sectionExperiences")}
          </AppText>

          <View
            style={[
              stylesForScreen.gameList,
              isDesktopWeb && stylesForScreen.gameListDesktop,
              isRtl && isDesktopWeb && stylesForScreen.gameListDesktopRtl,
            ]}
          >
            {GAMES.map((game, index) => {
              const isLastRow = isDesktopWeb
                ? index >= GAMES.length - 2
                : index === GAMES.length - 1;

              return (
                <PremiumPressable
                  key={game.key}
                  onPress={() => router.push(game.href as never)}
                  containerStyle={stylesForScreen.gameRowContainer}
                  style={[
                    stylesForScreen.gameRow,
                    isRtl && stylesForScreen.rowReverse,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: isLastRow
                        ? 0
                        : StyleSheet.hairlineWidth,
                    },
                  ]}
                  pressScale={0.98}
                >
                  <View
                    style={[
                      stylesForScreen.gameIndex,
                      { backgroundColor: colors.muted },
                    ]}
                  >
                    <AppText
                      style={[
                        stylesForScreen.gameIndexText,
                        { color: colors.mutedForeground },
                      ]}
                      forceLatinFont
                      latinRole="bold"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </AppText>
                  </View>

                  <View
                    style={[
                      stylesForScreen.tileCopy,
                      isRtl && stylesForScreen.tileCopyRtl,
                    ]}
                  >
                    <AppText
                      style={stylesForScreen.tileTitle}
                      languageCode={locale}
                      align="start"
                      nativeAlign={
                        Platform.OS === "android" && isRtl ? "end" : "start"
                      }
                      forceKurdishFont={isRtl}
                      fullWidth
                      numberOfLines={2}
                    >
                      {t(game.titleKey)}
                    </AppText>
                    <AppText
                      style={stylesForScreen.tileSubtitle}
                      languageCode={locale}
                      align="start"
                      forceKurdishFont={isRtl}
                      fullWidth
                      numberOfLines={2}
                    >
                      {t(game.subKey)}
                    </AppText>
                  </View>

                  <View style={stylesForScreen.tileArrow}>
                    <HugeiconsIcon
                      icon={isRtl ? ArrowLeft01Icon : ArrowRight01Icon}
                      size={19}
                      color={colors.primary}
                      strokeWidth={2.2}
                    />
                  </View>
                </PremiumPressable>
              );
            })}
          </View>

          <View
            style={[
              stylesForScreen.streakStrip,
              isRtl && stylesForScreen.rowReverse,
              { borderTopColor: colors.border },
            ]}
          >
            <View
              style={[
                stylesForScreen.streakIcon,
                { backgroundColor: colors.muted },
              ]}
            >
              <HugeiconsIcon
                icon={FireIcon}
                size={23}
                color={colors.warning}
                strokeWidth={2.1}
              />
            </View>

            <View
              style={[
                stylesForScreen.streakCopy,
                isRtl && stylesForScreen.streakCopyRtl,
              ]}
            >
              <View
                style={[
                  stylesForScreen.streakHeading,
                  isRtl && stylesForScreen.rowReverse,
                ]}
              >
                <AppText
                  style={[
                    stylesForScreen.streakDays,
                    { color: colors.foreground },
                  ]}
                  forceLatinFont
                  latinRole="bold"
                >
                  {streakDays || 0}
                </AppText>
                <AppText
                  style={[
                    stylesForScreen.streakLabel,
                    { color: colors.foreground },
                  ]}
                  languageCode={locale}
                  forceKurdishFont={isRtl}
                >
                  {t("games.dayStreak")}
                </AppText>
              </View>
              <AppText
                style={[
                  stylesForScreen.streakSub,
                  { color: colors.mutedForeground },
                ]}
                languageCode={locale}
                align="start"
                forceKurdishFont={isRtl}
                fullWidth
              >
                {t("games.keepStreak")}
              </AppText>
              <View
                style={[
                  stylesForScreen.streakBars,
                  isRtl && stylesForScreen.rowReverse,
                ]}
              >
                {[0, 1, 2, 3, 4].map((bar) => (
                  <View
                    key={bar}
                    style={[
                      stylesForScreen.streakBar,
                      {
                        backgroundColor:
                          bar < Math.min(5, streakDays || 0)
                            ? colors.warning
                            : colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </DirectionBoundary>
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
  isDesktopWeb: boolean,
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
      maxWidth: isDesktopWeb ? 900 : 720,
      paddingHorizontal: isDesktopWeb ? 28 : compact ? 16 : 24,
    },
    rowReverse: {
      flexDirection: "row-reverse",
    },
    screenHeader: {
      minHeight: isDesktopWeb ? 104 : compact ? 92 : 124,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 18,
      paddingVertical: isDesktopWeb ? 16 : compact ? 10 : 18,
    },
    headerCopy: {
      flex: 1,
      minWidth: 0,
      alignItems: "flex-start",
    },
    headerCopyRtl: {
      alignItems: "flex-end",
    },
    headerTitle: {
      color: colors.foreground,
      fontSize: isDesktopWeb ? 42 : compact ? 38 : 50,
      lineHeight: isDesktopWeb ? 50 : compact ? 45 : 58,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    headerRule: {
      width: 42,
      height: 4,
      borderRadius: 2,
      marginTop: 7,
    },
    headerPacksButtonRtl: {
      alignSelf: "center",
    },

    // Preserved XP/level widget styles.
    progressBanner: {
      minHeight: isDesktopWeb ? 124 : compact ? 116 : 168,
      borderRadius: isDesktopWeb ? 22 : compact ? 24 : 28,
      paddingHorizontal: isDesktopWeb ? 18 : compact ? 14 : 22,
      paddingVertical: isDesktopWeb ? 14 : compact ? 12 : 18,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
    },
    progressCopy: {
      flex: 1,
      minWidth: 0,
      marginLeft: isDesktopWeb ? 16 : compact ? 8 : 20,
      zIndex: 2,
    },
    progressCopyRtl: {
      marginLeft: 0,
      marginRight: isDesktopWeb ? 16 : compact ? 8 : 20,
      alignItems: "flex-end",
    },
    progressEyebrow: {
      fontSize: isDesktopWeb ? 13 : compact ? 12 : 14,
      lineHeight: isDesktopWeb ? 17 : compact ? 15 : 18,
      fontWeight: "700",
    },
    progressValue: {
      fontSize: isDesktopWeb ? 25 : compact ? 21 : 31,
      lineHeight: isDesktopWeb ? 32 : compact ? 27 : 39,
      marginTop: isDesktopWeb ? 2 : compact ? 2 : 4,
    },
    progressUnit: {
      fontSize: isDesktopWeb ? 18 : compact ? 15 : 23,
    },
    progressTrack: {
      height: isDesktopWeb ? 9 : compact ? 8 : 11,
      borderRadius: 6,
      overflow: "hidden",
      marginTop: isDesktopWeb ? 9 : compact ? 8 : 12,
      width: isDesktopWeb ? "72%" : compact ? "46%" : "78%",
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
      right: isDesktopWeb ? 8 : compact ? 4 : 8,
      bottom: isDesktopWeb ? 0 : compact ? 2 : -4,
      width: isDesktopWeb ? 104 : compact ? 82 : 142,
      height: isDesktopWeb ? 104 : compact ? 82 : 142,
      zIndex: 1,
    },
    chestImageRtl: {
      right: "auto",
      left: isDesktopWeb ? 8 : compact ? 4 : 8,
    },

    sectionTitle: {
      color: colors.foreground,
      marginTop: isDesktopWeb ? 34 : compact ? 30 : 38,
      marginBottom: isDesktopWeb ? 15 : 12,
      paddingHorizontal: 2,
      fontSize: isDesktopWeb ? 24 : compact ? 21 : 25,
      lineHeight: isDesktopWeb ? 31 : compact ? 27 : 32,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    gameList: {
      width: "100%",
      paddingVertical: 4,
      borderRadius: 26,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    gameListDesktop: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    gameListDesktopRtl: {
      flexDirection: "row-reverse",
    },
    gameRowContainer: {
      width: isDesktopWeb ? "50%" : "100%",
      paddingHorizontal: isDesktopWeb ? 6 : 8,
    },
    gameRow: {
      width: "100%",
      minHeight: isDesktopWeb ? 104 : compact ? 88 : 100,
      paddingHorizontal: isDesktopWeb ? 12 : compact ? 8 : 12,
      paddingVertical: isDesktopWeb ? 12 : compact ? 9 : 12,
      borderRadius: 18,
      borderCurve: "continuous",
      flexDirection: "row",
      alignItems: "center",
      gap: isDesktopWeb ? 13 : compact ? 10 : 13,
    },
    gameIndex: {
      width: isDesktopWeb ? 68 : compact ? 58 : 66,
      height: isDesktopWeb ? 68 : compact ? 58 : 66,
      borderRadius: isDesktopWeb ? 20 : compact ? 17 : 19,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    gameIndexText: {
      fontSize: isDesktopWeb ? 15 : compact ? 13 : 14,
      lineHeight: isDesktopWeb ? 20 : compact ? 18 : 19,
      letterSpacing: 0.8,
    },
    tileCopy: {
      flex: 1,
      minWidth: 0,
      alignItems: "flex-start",
    },
    tileCopyRtl: {
      alignItems: "flex-end",
    },
    tileTitle: {
      color: colors.foreground,
      fontSize: isDesktopWeb ? 17 : compact ? 15 : 17,
      lineHeight: isDesktopWeb ? 22 : compact ? 20 : 23,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    tileSubtitle: {
      color: colors.mutedForeground,
      marginTop: 2,
      fontSize: isDesktopWeb ? 12 : compact ? 12 : 13,
      lineHeight: isDesktopWeb ? 17 : compact ? 17 : 18,
      fontWeight: "600",
    },
    tileArrow: {
      width: 36,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    streakStrip: {
      minHeight: 118,
      marginTop: isDesktopWeb ? 30 : 26,
      paddingHorizontal: 4,
      paddingVertical: 22,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    streakIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    streakCopy: {
      flex: 1,
      minWidth: 0,
      alignItems: "flex-start",
    },
    streakCopyRtl: {
      alignItems: "flex-end",
    },
    streakHeading: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 7,
    },
    streakDays: {
      fontSize: 22,
      lineHeight: 27,
    },
    streakLabel: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "800",
    },
    streakSub: {
      marginTop: 2,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "600",
    },
    streakBars: {
      marginTop: 12,
      flexDirection: "row",
      gap: 5,
    },
    streakBar: {
      width: compact ? 24 : 30,
      height: 5,
      borderRadius: 3,
    },
  });
}
