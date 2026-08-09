import {
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  BookOpen01Icon,
  BubbleChatIcon,
  FireIcon,
  HeadphonesIcon,
  Idea01Icon,
  MaskTheater01Icon,
  Mortarboard02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { CreditPacksButton } from "../../components/CreditPacksButton";
import { PremiumPressable } from "../../components/PremiumPressable";
import { AppText } from "../../components/ui/AppText";
import { getMascot } from "../../constants/mascots";
import { Colors } from "../../constants/theme";
import { isDesktopWebWidth } from "../../constants/web-layout";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { DirectionBoundary } from "../../i18n/layout-direction";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { crossShadow } from "../../utils/shadows";
import { resolveGameHue, type GameModeKey } from "./games-theme";

const XP_PER_LEVEL = 300;

function withAlpha(hex: string, alpha: number) {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * The five secondary modes. Voice tutor is deliberately absent — it is the
 * featured card above the grid, so listing it here too would offer the same
 * destination twice on one screen.
 *
 * Each entry's `mode` key is the one the destination screen registers in
 * `GAME_MODE_HUES`. The tile glyph and its chevron therefore render in exactly
 * the hue the learner is about to land on, so the grid cell reads as a preview
 * of the screen behind it rather than as decoration. Nothing else on the card
 * carries the hue: the screen's own accent stays the mascot colour.
 *
 * No blurb key: the cards show a glyph and a title. The per-card descriptions
 * were the bulk of this screen's copy, and the `games.*Blurb` strings stay in
 * the locale files because each destination screen still uses its own.
 */
const MODES = [
  {
    key: "reading-practice",
    mode: "reading-practice" as GameModeKey,
    titleKey: "games.paragraphSpeechTitle",
    href: "/reading-practice" as const,
    icon: BookOpen01Icon,
  },
  {
    key: "podcast",
    mode: "podcast" as GameModeKey,
    titleKey: "games.podcastTitle",
    href: "/podcast" as const,
    icon: HeadphonesIcon,
  },
  {
    key: "slang",
    mode: "slang" as GameModeKey,
    titleKey: "games.slangTitle",
    href: "/slang" as const,
    icon: BubbleChatIcon,
  },
  {
    key: "roleplay",
    mode: "roleplay" as GameModeKey,
    titleKey: "games.rolePlayTitle",
    href: "/roleplay" as const,
    icon: MaskTheater01Icon,
  },
  {
    key: "ai-teacher",
    mode: "ai-teacher" as GameModeKey,
    titleKey: "games.teacherTitle",
    href: "/ai-teacher" as const,
    icon: Mortarboard02Icon,
  },
] as const;

/**
 * Level dial for the stats card: the number, with its tier beneath it.
 *
 * The `-90deg` start rotation lives on the `<Svg>` while the RTL mirror lives
 * on a wrapper `<View>`. `scaleX` is a native-only Svg prop and leaks straight
 * through to the DOM on web, so it has to be a style transform instead.
 */
function LevelRing({
  size,
  progress,
  level,
  tierLabel,
  languageCode,
  accent,
  trackColor,
  labelColor,
  isRtl,
}: {
  size: number;
  progress: number;
  level: number;
  tierLabel: string;
  languageCode: string;
  accent: string;
  trackColor: string;
  labelColor: string;
  isRtl: boolean;
}) {
  const center = size / 2;
  const strokeWidth = size >= 92 ? 9 : 8;
  const radius = center - strokeWidth / 2 - 1;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={[ringStyles.wrap, { width: size, height: size }]}>
      <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          rotation={-90}
        >
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
            stroke={accent}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - clamped)}
          />
        </Svg>
      </View>
      <View style={ringStyles.copy}>
        {/* The dial is self-evidently a level: the "Level" eyebrow above the
            number was a third line of type inside a 96pt circle. */}
        <AppText
          style={[
            ringStyles.value,
            {
              color: accent,
              fontSize: size >= 92 ? 34 : 29,
              lineHeight: size >= 92 ? 38 : 33,
            },
          ]}
          forceLatinFont
          latinRole="bold"
        >
          {level}
        </AppText>
        <AppText
          style={[ringStyles.tier, { color: labelColor }]}
          languageCode={languageCode}
          numberOfLines={1}
        >
          {tierLabel}
        </AppText>
      </View>
    </View>
  );
}

/* No waveform asset ships with the app, so the featured card draws its own. */
function WaveformGlyph({ size, color }: { size: number; color: string }) {
  const bars = [0.4, 0.66, 1, 0.66, 0.4];
  const barWidth = size * 0.1;
  const gap = size * 0.075;
  const span = bars.length * barWidth + (bars.length - 1) * gap;
  const startX = (size - span) / 2;
  const maxHeight = size * 0.6;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {bars.map((scale, i) => {
        const barHeight = maxHeight * scale;
        return (
          <Rect
            key={i}
            x={startX + i * (barWidth + gap)}
            y={(size - barHeight) / 2}
            width={barWidth}
            height={barHeight}
            rx={barWidth / 2}
            fill={color}
          />
        );
      })}
    </Svg>
  );
}

/* Soft crest along the bottom of the tip card. */
function TipWave({ color }: { color: string }) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 200 44"
      preserveAspectRatio="none"
    >
      <Path
        d="M0 24 C 26 4, 52 40, 84 22 S 140 0, 200 18 L 200 44 L 0 44 Z"
        fill={color}
      />
    </Svg>
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
  const compact = width < 380;
  const isDesktopWeb = Platform.OS === "web" && isDesktopWebWidth(width);
  const selectedMascot = getMascot(selectedMascotId);
  const palette = selectedMascot.progressPalette;

  /*
   * The mascot's `fill` is tuned to sit on its own pastel card, and a couple of
   * them are near-black (buzzwell's `#2F2B33`) which disappears against a dark
   * canvas. `ringTrack` is the same hue held at a mid lightness, so it stays
   * legible on both surfaces.
   */
  const accent = isDark ? palette.ringTrack : palette.fill;
  const accentSoft = withAlpha(accent, isDark ? 0.18 : 0.12);
  const accentLine = withAlpha(accent, isDark ? 0.32 : 0.22);

  const level = Math.max(1, Math.floor((totalXp || 0) / XP_PER_LEVEL) + 1);
  const levelXp = Math.max(0, (totalXp || 0) % XP_PER_LEVEL);
  const levelProgress = levelXp / XP_PER_LEVEL;
  const tierLabel =
    level >= 10
      ? t("games.tierAdvanced")
      : level >= 4
        ? t("games.tierIntermediate")
        : t("games.tierBeginner");

  /*
   * The reference has no streak slot, but the streak is live user data and
   * dropping it silently would lose it. The sixth grid cell carries it instead:
   * once a streak exists the tip card reports it, and before then it is exactly
   * the "Learning tip" card from the reference.
   */
  const hasStreak = (streakDays || 0) > 0;
  const tipTitle = hasStreak
    ? t("games.streakDaysTitle", { count: streakDays })
    : t("games.learningTip");
  const tipBody = hasStreak
    ? t("games.streakTipBody")
    : t("games.learningTipBody");
  const tipTint = hasStreak ? "#F97316" : "#22C55E";

  const styles = useMemo(
    () => createStyles(compact, colors, isDesktopWeb),
    [colors, compact, isDesktopWeb],
  );

  const ringSize = isDesktopWeb ? 104 : compact ? 84 : 96;
  const forwardIcon = isRtl ? ArrowLeft02Icon : ArrowRight02Icon;
  const chevronIcon = isRtl ? ArrowLeft01Icon : ArrowRight01Icon;

  return (
    <DirectionBoundary direction="ltr" style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + (isDesktopWeb ? 20 : compact ? 6 : 12),
            paddingBottom: insets.bottom + (isDesktopWeb ? 48 : 112),
          },
        ]}
      >
        <View style={styles.content}>
          {/* Header — title block on the lead edge, AI pill trailing. */}
          <View style={[styles.header, isRtl && styles.rowReverse]}>
            <View style={[styles.headerCopy, isRtl && styles.headerCopyRtl]}>
              <AppText
                style={styles.headerTitle}
                languageCode={locale}
                align="start"
                forceKurdishFont={isRtl}
                fullWidth
              >
                {t("games.screenTitle")}
              </AppText>
            </View>

            <View style={[styles.headerActions, isRtl && styles.rowReverse]}>
              <View
                style={[
                  styles.aiPill,
                  isRtl && styles.rowReverse,
                  { backgroundColor: accentSoft, borderColor: accentLine },
                ]}
              >
                <HugeiconsIcon
                  icon={Mortarboard02Icon}
                  size={13}
                  color={accent}
                  strokeWidth={2.2}
                />
                <AppText
                  style={[styles.aiPillText, { color: accent }]}
                  languageCode={locale}
                  forceKurdishFont={isRtl}
                  numberOfLines={1}
                >
                  {t("games.aiTutorPill")}
                </AppText>
              </View>
              <CreditPacksButton />
            </View>
          </View>

          {/*
           * Stats card: level dial, a hairline divider, the daily XP block, and
           * the mascot standing in for the reference's 3D trophy. The reference
           * uses a rendered star illustration the app does not ship; the mascot
           * the learner picked during onboarding is the closer equivalent and
           * keeps the card personal.
           */}
          <View
            style={[
              styles.statsCard,
              isRtl && styles.rowReverse,
              {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.border,
                ...crossShadow({
                  color: isDark ? "#000000" : palette.shadow,
                  offsetY: 10,
                  blur: 24,
                  opacity: isDark ? 0.32 : 0.14,
                }),
              },
            ]}
          >
            <LevelRing
              size={ringSize}
              progress={levelProgress}
              level={level}
              tierLabel={tierLabel}
              languageCode={locale}
              accent={accent}
              trackColor={isDark ? "rgba(255,255,255,0.09)" : colors.muted}
              labelColor={colors.mutedForeground}
              isRtl={isRtl}
            />

            <View
              style={[styles.statsDivider, { backgroundColor: colors.border }]}
            />

            <DirectionBoundary
              direction={isRtl ? "rtl" : "ltr"}
              style={styles.statsCopy}
            >
              {/* The "Daily progress" label and the "N XP to level N+1"
                  sentence both restated what the number and bar already show,
                  so the block leads with the figure itself. */}
              <View style={[styles.statsXpRow, isRtl && styles.rowReverse]}>
                <AppText
                  style={[styles.statsXpValue, { color: accent }]}
                  forceLatinFont
                  latinRole="bold"
                >
                  {levelXp}
                </AppText>
                <AppText
                  style={styles.statsXpTotal}
                  forceLatinFont
                  latinRole="bold"
                  numberOfLines={1}
                >
                  {`/ ${XP_PER_LEVEL} XP`}
                </AppText>
              </View>

              <View
                style={[
                  styles.xpTrack,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.09)"
                      : colors.muted,
                  },
                ]}
              >
                <View
                  style={[
                    styles.xpFill,
                    {
                      width: `${Math.max(4, levelProgress * 100)}%`,
                      backgroundColor: accent,
                    },
                    isRtl && styles.xpFillRtl,
                  ]}
                />
              </View>
            </DirectionBoundary>

            <Image
              source={selectedMascot.source}
              style={styles.statsMascot}
              contentFit="contain"
              transition={180}
              accessibilityIgnoresInvertColors
            />
          </View>

          {/* Section label */}
          <View style={[styles.sectionLabel, isRtl && styles.rowReverse]}>
            <HugeiconsIcon
              icon={BookOpen01Icon}
              size={15}
              color={accent}
              strokeWidth={2.2}
            />
            <AppText
              style={[styles.sectionLabelText, { color: accent }]}
              languageCode={locale}
              forceKurdishFont={isRtl}
              numberOfLines={1}
            >
              {t("games.recommendedForYou")}
            </AppText>
          </View>

          {/* Featured — the live voice tutor gets the full width. */}
          <PremiumPressable
            onPress={() => router.push("/voice-tutor" as never)}
            containerStyle={styles.featuredContainer}
            style={[
              styles.featuredCard,
              isRtl && styles.rowReverse,
              {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.border,
                ...crossShadow({
                  color: isDark ? "#000000" : palette.shadow,
                  offsetY: 8,
                  blur: 20,
                  opacity: isDark ? 0.3 : 0.12,
                }),
              },
            ]}
            pressScale={0.985}
          >
            {/* Glassy squircle: blurred colour blobs behind the waveform. */}
            <View
              style={[
                styles.featuredGlyph,
                { backgroundColor: accentSoft, borderColor: accentLine },
              ]}
            >
              <View
                style={[
                  styles.glyphBlob,
                  styles.glyphBlobTop,
                  { backgroundColor: withAlpha(accent, isDark ? 0.3 : 0.24) },
                ]}
              />
              <View
                style={[
                  styles.glyphBlob,
                  styles.glyphBlobBottom,
                  { backgroundColor: withAlpha("#22C55E", isDark ? 0.26 : 0.2) },
                ]}
              />
              <WaveformGlyph size={compact ? 40 : 46} color={accent} />
            </View>

            <DirectionBoundary
              direction={isRtl ? "rtl" : "ltr"}
              style={styles.featuredCopy}
            >
              <View
                style={[
                  styles.featuredPill,
                  isRtl && styles.rowReverse,
                  { backgroundColor: accentSoft },
                ]}
              >
                <HugeiconsIcon
                  icon={HeadphonesIcon}
                  size={11}
                  color={accent}
                  strokeWidth={2.3}
                />
                <AppText
                  style={[styles.featuredPillText, { color: accent }]}
                  languageCode={locale}
                  forceKurdishFont={isRtl}
                  numberOfLines={1}
                >
                  {t("games.featuredToday")}
                </AppText>
              </View>

              <AppText
                style={styles.featuredTitle}
                languageCode={locale}
                align="start"
                forceKurdishFont={isRtl}
                fullWidth
                numberOfLines={1}
              >
                {t("games.voiceTutorTitle")}
              </AppText>
              {/* One line, not two: the hero already reads as the headline
                  action from the pill, the waveform, and the arrow. */}
              <AppText
                style={styles.featuredBlurb}
                languageCode={locale}
                align="start"
                forceKurdishFont={isRtl}
                fullWidth
                numberOfLines={1}
              >
                {t("games.voiceTutorBlurb")}
              </AppText>
            </DirectionBoundary>

            <View
              style={[styles.featuredAction, { backgroundColor: accent }]}
              /* Decorative: the whole card is already the button. */
              pointerEvents="none"
            >
              <HugeiconsIcon
                icon={forwardIcon}
                size={20}
                color={isDark ? "#0B0B0F" : "#FFFFFF"}
                strokeWidth={2.6}
              />
            </View>
          </PremiumPressable>

          {/* Two-column grid: five modes + the tip / streak cell. */}
          <View style={styles.grid}>
            {MODES.map((mode) => {
              /* `ink` rather than the raw hue: violet and sky at full
                 saturation fall under 3:1 against the dark canvas, so the
                 registry keeps a lightened variant for that case. */
              const hue = resolveGameHue(mode.mode, isDark);
              return (
              <PremiumPressable
                key={mode.key}
                onPress={() => router.push(mode.href as never)}
                containerStyle={styles.gridCellContainer}
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                pressScale={0.97}
              >
                <View style={[styles.gridHead, isRtl && styles.rowReverse]}>
                  <View
                    style={[
                      styles.gridGlyph,
                      { backgroundColor: hue.wash, borderWidth: 1, borderColor: hue.border },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={mode.icon}
                      size={compact ? 26 : 30}
                      color={hue.ink}
                      strokeWidth={2.1}
                    />
                  </View>
                </View>

                {/* Icon and title carry the card. The blurb underneath each of
                    the five modes was the bulk of the screen's copy and said
                    little the title did not. */}
                <DirectionBoundary
                  direction={isRtl ? "rtl" : "ltr"}
                  style={styles.gridCopy}
                >
                  <AppText
                    style={styles.gridTitle}
                    languageCode={locale}
                    align="start"
                    forceKurdishFont={isRtl}
                    fullWidth
                    numberOfLines={2}
                  >
                    {t(mode.titleKey)}
                  </AppText>
                </DirectionBoundary>

                <View
                  style={[
                    styles.gridArrowRow,
                    isRtl && styles.gridArrowRowRtl,
                  ]}
                >
                  <HugeiconsIcon
                    icon={chevronIcon}
                    size={16}
                    color={hue.ink}
                    strokeWidth={2.4}
                  />
                </View>
              </PremiumPressable>
              );
            })}

            {/* Sixth cell — static, so it is a plain View rather than a press target. */}
            <View style={styles.gridCellContainer}>
              <View
                style={[
                  styles.gridCard,
                  styles.tipCard,
                  {
                    backgroundColor: colors.muted,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.gridHead, isRtl && styles.rowReverse]}>
                  <View
                    style={[
                      styles.tipChip,
                      isRtl && styles.rowReverse,
                      { backgroundColor: withAlpha(tipTint, isDark ? 0.2 : 0.12) },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={hasStreak ? FireIcon : Idea01Icon}
                      size={13}
                      color={tipTint}
                      strokeWidth={2.2}
                    />
                    <AppText
                      style={[styles.tipChipText, { color: tipTint }]}
                      languageCode={locale}
                      forceKurdishFont={isRtl}
                      numberOfLines={1}
                    >
                      {tipTitle}
                    </AppText>
                  </View>
                </View>

                <DirectionBoundary
                  direction={isRtl ? "rtl" : "ltr"}
                  style={styles.tipCopy}
                >
                  <AppText
                    style={styles.tipBody}
                    languageCode={locale}
                    align="start"
                    forceKurdishFont={isRtl}
                    fullWidth
                    numberOfLines={2}
                  >
                    {tipBody}
                  </AppText>
                </DirectionBoundary>

                <View style={styles.tipWave} pointerEvents="none">
                  <TipWave color={withAlpha(tipTint, isDark ? 0.16 : 0.1)} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </DirectionBoundary>
  );
}

const ringStyles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  copy: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontWeight: "900",
    fontFamily: "DINNextRoundedBold",
  },
  tier: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: "700",
    opacity: 0.9,
  },
});

function createStyles(
  compact: boolean,
  colors: (typeof Colors)["light"] | (typeof Colors)["dark"],
  isDesktopWeb: boolean,
) {
  const cardRadius = isDesktopWeb ? 22 : 20;

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
      maxWidth: isDesktopWeb ? 980 : 720,
      paddingHorizontal: isDesktopWeb ? 28 : compact ? 16 : 20,
    },
    rowReverse: {
      flexDirection: "row-reverse",
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
      paddingTop: isDesktopWeb ? 12 : compact ? 8 : 12,
      paddingBottom: isDesktopWeb ? 20 : 18,
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
      fontSize: isDesktopWeb ? 36 : compact ? 30 : 34,
      lineHeight: isDesktopWeb ? 44 : compact ? 37 : 42,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
      letterSpacing: -0.6,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexShrink: 1,
      paddingTop: 6,
    },
    aiPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      flexShrink: 1,
    },
    aiPillText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "800",
      flexShrink: 1,
    },

    statsCard: {
      borderRadius: isDesktopWeb ? 26 : 24,
      borderCurve: "continuous",
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: isDesktopWeb ? 20 : compact ? 12 : 16,
      paddingVertical: isDesktopWeb ? 20 : compact ? 14 : 18,
      flexDirection: "row",
      alignItems: "center",
      gap: isDesktopWeb ? 16 : compact ? 10 : 14,
      overflow: "hidden",
    },
    statsDivider: {
      width: StyleSheet.hairlineWidth,
      alignSelf: "stretch",
      marginVertical: 4,
      flexShrink: 0,
    },
    statsCopy: {
      flex: 1,
      minWidth: 0,
    },
    statsXpRow: {
      marginTop: 2,
      flexDirection: "row",
      alignItems: "baseline",
      gap: 5,
    },
    statsXpValue: {
      fontSize: isDesktopWeb ? 28 : compact ? 23 : 26,
      lineHeight: isDesktopWeb ? 34 : compact ? 28 : 31,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    statsXpTotal: {
      color: colors.mutedForeground,
      fontSize: isDesktopWeb ? 14 : compact ? 12.5 : 13.5,
      lineHeight: isDesktopWeb ? 20 : compact ? 17 : 19,
      fontWeight: "800",
    },
    xpTrack: {
      height: isDesktopWeb ? 9 : 8,
      borderRadius: 6,
      overflow: "hidden",
      marginTop: 8,
      width: "100%",
    },
    xpFill: {
      height: "100%",
      borderRadius: 6,
    },
    xpFillRtl: {
      alignSelf: "flex-end",
    },
    statsMascot: {
      width: isDesktopWeb ? 84 : compact ? 56 : 72,
      height: isDesktopWeb ? 84 : compact ? 56 : 72,
      flexShrink: 0,
    },

    sectionLabel: {
      marginTop: isDesktopWeb ? 28 : 22,
      marginBottom: 10,
      paddingHorizontal: 2,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    sectionLabelText: {
      fontSize: isDesktopWeb ? 13.5 : 12.5,
      lineHeight: isDesktopWeb ? 18 : 17,
      fontWeight: "800",
      letterSpacing: 0.2,
    },

    featuredContainer: {
      width: "100%",
    },
    featuredCard: {
      width: "100%",
      borderRadius: isDesktopWeb ? 24 : 22,
      borderCurve: "continuous",
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: isDesktopWeb ? 18 : compact ? 12 : 15,
      paddingVertical: isDesktopWeb ? 18 : compact ? 13 : 16,
      flexDirection: "row",
      alignItems: "center",
      gap: isDesktopWeb ? 16 : compact ? 11 : 14,
      overflow: "hidden",
    },
    featuredGlyph: {
      width: isDesktopWeb ? 86 : compact ? 68 : 78,
      height: isDesktopWeb ? 86 : compact ? 68 : 78,
      borderRadius: isDesktopWeb ? 26 : compact ? 21 : 24,
      borderCurve: "continuous",
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
    },
    glyphBlob: {
      position: "absolute",
      width: "78%",
      height: "78%",
      borderRadius: 999,
    },
    glyphBlobTop: {
      top: "-24%",
      left: "-18%",
    },
    glyphBlobBottom: {
      bottom: "-26%",
      right: "-20%",
    },
    featuredCopy: {
      flex: 1,
      minWidth: 0,
      alignItems: "flex-start",
    },
    featuredPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 3.5,
      paddingHorizontal: 8,
      borderRadius: 999,
    },
    featuredPillText: {
      fontSize: 10.5,
      lineHeight: 14,
      fontWeight: "800",
      letterSpacing: 0.2,
    },
    featuredTitle: {
      color: colors.foreground,
      marginTop: 6,
      fontSize: isDesktopWeb ? 21 : compact ? 17 : 19,
      lineHeight: isDesktopWeb ? 27 : compact ? 22 : 25,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    featuredBlurb: {
      color: colors.mutedForeground,
      marginTop: 2,
      fontSize: isDesktopWeb ? 13.5 : compact ? 12 : 13,
      lineHeight: isDesktopWeb ? 19 : compact ? 16 : 18,
      fontWeight: "600",
    },
    featuredAction: {
      width: isDesktopWeb ? 44 : 40,
      height: isDesktopWeb ? 44 : 40,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      flexShrink: 0,
    },

    grid: {
      marginTop: isDesktopWeb ? 14 : 12,
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -5,
    },
    gridCellContainer: {
      width: isDesktopWeb ? "33.3333%" : "50%",
      paddingHorizontal: 5,
      paddingBottom: 10,
    },
    gridCard: {
      width: "100%",
      minHeight: isDesktopWeb ? 132 : compact ? 114 : 122,
      borderRadius: cardRadius,
      borderCurve: "continuous",
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: isDesktopWeb ? 14 : compact ? 10 : 13,
      paddingVertical: isDesktopWeb ? 14 : compact ? 11 : 13,
      justifyContent: "space-between",
      overflow: "hidden",
    },
    /*
     * Holds one child — the mode glyph, or the tip card's chip. The row
     * direction is what lets `rowReverse` park that child on the trailing edge
     * in RTL, so it stays a row even with nothing to sit beside.
     */
    gridHead: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    /*
     * Grown from 38 to fill the room the blurb gave back — with the copy down
     * to a single title, the glyph is what the card is read by, so it carries
     * the weight the paragraph used to.
     */
    gridGlyph: {
      width: compact ? 44 : 50,
      height: compact ? 44 : 50,
      borderRadius: compact ? 15 : 17,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    gridCopy: {
      flex: 1,
      minWidth: 0,
      alignItems: "flex-start",
      marginTop: compact ? 8 : 9,
    },
    gridTitle: {
      color: colors.foreground,
      fontSize: isDesktopWeb ? 15.5 : compact ? 13.5 : 14.5,
      lineHeight: isDesktopWeb ? 20 : compact ? 18 : 19,
      fontWeight: "900",
      fontFamily: "DINNextRoundedBold",
    },
    gridArrowRow: {
      marginTop: 6,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    gridArrowRowRtl: {
      justifyContent: "flex-start",
    },

    tipCard: {
      justifyContent: "flex-start",
    },
    tipChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingVertical: 5,
      paddingHorizontal: 9,
      borderRadius: 999,
      flexShrink: 1,
    },
    tipChipText: {
      fontSize: 11,
      lineHeight: 15,
      fontWeight: "800",
    },
    tipCopy: {
      marginTop: 8,
      alignItems: "flex-start",
    },
    tipBody: {
      color: colors.foreground,
      fontSize: isDesktopWeb ? 13.5 : compact ? 12 : 13,
      lineHeight: isDesktopWeb ? 19 : compact ? 16.5 : 18,
      fontWeight: "700",
    },
    tipWave: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 34,
    },
  });
}
