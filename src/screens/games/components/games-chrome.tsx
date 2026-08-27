/**
 * Shared chrome for the five practice screens.
 *
 * Reading Practice, Podcasts, Slang, Role Play and AI Teacher previously each
 * hand-rolled their own header, card, segmented control and primary button.
 * The result was four different back buttons (transparent / `colors.muted` /
 * `warmBg` / `surfaceRaised`+border), three separately-coded segmented controls
 * that were visually near-identical, and four primary CTAs with different
 * heights and radii.
 *
 * Everything here reads its values from `games-theme.ts`. Nothing here is used
 * by the live AI tutor (`/voice-tutor`), which keeps its own identity.
 *
 * ── Layout contract ──────────────────────────────────────────────────────
 *
 * Every practice screen is the same vertical arrangement, which is what makes
 * them feel like one product even before colour is considered:
 *
 *   GamesGlassHeader     sticky, translucent, back + title (+ optional action)
 *   GamesIntroCard       hue chip · eyebrow · title · blurb        ← identity
 *   …configuration…      GamesSegmented / GamesOptionRow
 *   GamesPrimaryButton   the one coral commit action
 *
 * Recognition over recall: the back affordance, the title and the commit button
 * are in the same place on all five, so muscle memory transfers between them.
 */

import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "../../../components/animations";
import { AppText } from "../../../components/ui/AppText";
import { PRIMARY_ACTION } from "../../../constants/primary-action";
import { isDesktopWebWidth } from "../../../constants/web-layout";
import { useI18n } from "../../../hooks/useI18n";
import { IS_ANDROID } from "../../../utils/native-perf";
import { crossShadow } from "../../../utils/shadows";
import {
  GamesMotion,
  GamesType,
  useGameHue,
  useGamesMetrics,
  useGamesTheme,
  gamesLift,
  withAlpha,
  type GameModeKey,
  type GamesMetrics,
  type GamesTheme,
} from "../games-theme";

/* ═══════════════════════════════════════════════════════════════════
 * Shared hook — every practice screen calls this once.
 * ═══════════════════════════════════════════════════════════════════ */

export function useGamesChrome(mode: GameModeKey) {
  const theme = useGamesTheme();
  const hue = useGameHue(mode);
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === "web" && isDesktopWebWidth(width);
  const metrics = useGamesMetrics(width < 380, isWide);
  const { t, locale, isKu, isAr } = useI18n();
  const isRtl = isKu || locale === "ar";

  return { theme, hue, metrics, isWide, isRtl, t, locale, isKu, isAr };
}

/* ═══════════════════════════════════════════════════════════════════
 * Sticky glass header
 *
 * Translucent + blurred so content scrolling underneath stays partly visible:
 * the page reads as one continuous surface that the chrome floats over, rather
 * than two stacked boxes. The hairline only appears once you have scrolled,
 * so a resting screen has no arbitrary line across it.
 *
 * The title is 17pt while the on-card page title is 24pt — chrome deliberately
 * ranks below content in the visual hierarchy.
 * ═══════════════════════════════════════════════════════════════════ */

export function GamesGlassHeader({
  title,
  onBack,
  right,
  scrolled = true,
  titleLanguageCode,
}: {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
  /** Show the bottom hairline. Pass a scroll-driven boolean to hide it at rest. */
  scrolled?: boolean;
  titleLanguageCode?: string;
}) {
  const theme = useGamesTheme();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && isDesktopWebWidth(width);
  const metrics = useGamesMetrics(false, isDesktop);
  const insets = useSafeAreaInsets();
  const { isKu, locale } = useI18n();
  const isRtl = isKu || locale === "ar";
  const styles = useChromeStyles();

  return (
    <View
      style={[
        styles.headerWrap,
        {
          paddingTop: insets.top,
          backgroundColor: IS_ANDROID ? theme.canvas : theme.headerScrim,
          borderBottomColor: scrolled ? theme.headerBorder : "transparent",
        },
      ]}
    >
      {!IS_ANDROID && Platform.OS !== "web" && (
        <BlurView
          intensity={theme.isDark ? 40 : 28}
          tint={theme.isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}
      {Platform.OS === "web" && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backdropFilter: "blur(18px) saturate(150%)",
              WebkitBackdropFilter: "blur(18px) saturate(150%)",
            } as ViewStyle,
          ]}
          pointerEvents="none"
        />
      )}

      <View
        style={[
          styles.headerRow,
          {
            height: metrics.headerHeight,
            maxWidth: isDesktop ? 960 : "100%",
            width: "100%",
            alignSelf: "center",
            paddingHorizontal: isDesktop ? 32 : 14,
          },
        ]}
      >
        <GamesIconButton
          icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon}
          onPress={onBack}
          accessibilityLabel="Back"
        />
        <AppText
          numberOfLines={1}
          languageCode={titleLanguageCode}
          style={[GamesType.header, styles.headerTitle, { color: theme.ink }]}
        >
          {title}
        </AppText>
        <View style={styles.headerRight}>{right}</View>
      </View>
    </View>
  );
}

/**
 * 44×44 neutral round control. One treatment for every icon button in the set —
 * back, close, settings, volume. Neutral on purpose: coral is reserved for the
 * one commit action per screen, so a back button that was coral would compete
 * with it (Von Restorff — an accent only reads as special while it is rare).
 */
export function GamesIconButton({
  icon,
  onPress,
  accessibilityLabel,
  active = false,
  disabled = false,
  size,
  style,
}: {
  icon: unknown;
  onPress: () => void;
  accessibilityLabel?: string;
  /** Toggle state — fills with the accent wash. */
  active?: boolean;
  disabled?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);
  const dim = size ?? metrics.tapMin;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active, disabled }}
      style={[
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: active ? theme.accentWash : theme.surfaceSunken,
          borderWidth: 1,
          borderColor: active ? theme.accentBorder : theme.border,
        },
        style,
      ]}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="none" />
      <HugeiconsIcon
        icon={icon as never}
        size={Math.round(dim * 0.45)}
        color={active ? theme.accentInk : theme.ink}
        strokeWidth={2}
      />
    </PressableScale>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * Page shell — flat scrolling canvas under the glass header
 * ═══════════════════════════════════════════════════════════════════ */

export function GamesScreenShell({
  children,
  header,
  footer,
  contentStyle,
  scrollRef,
  onScroll,
  scrollEnabled = true,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  /** Pinned action area. Gets its own safe-area padding and a fade-out mask. */
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  scrollRef?: React.RefObject<ScrollView | null>;
  onScroll?: React.ComponentProps<typeof ScrollView>["onScroll"];
  scrollEnabled?: boolean;
}) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === "web" && isDesktopWebWidth(width);

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      {header}
      <ScrollView
        ref={scrollRef}
        scrollEnabled={scrollEnabled}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          {
            paddingHorizontal: metrics.gutter,
            paddingTop: metrics.sectionGap,
            paddingBottom: (footer ? 24 : insets.bottom + 32) + 24,
            gap: metrics.sectionGap,
            width: "100%",
            maxWidth: isWide ? metrics.maxWidth : undefined,
            alignSelf: "center",
          },
          contentStyle,
        ]}
      >
        {children}
      </ScrollView>
      {footer ? (
        <View
          style={{
            paddingHorizontal: metrics.gutter,
            paddingBottom: insets.bottom + 12,
            paddingTop: 10,
            backgroundColor: theme.canvas,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            width: "100%",
            maxWidth: isWide ? metrics.maxWidth : undefined,
            alignSelf: "center",
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * Card — the single container primitive
 * ═══════════════════════════════════════════════════════════════════ */

export function GamesCard({
  children,
  style,
  padded = true,
  raised = false,
  flat = false,
  selected = false,
  onPress,
  entering,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  raised?: boolean;
  /** Quiet grouped-row surface for dense lists; carries no card elevation. */
  flat?: boolean;
  selected?: boolean;
  onPress?: () => void;
  entering?: React.ComponentProps<typeof Animated.View>["entering"];
}) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);

  const shell: StyleProp<ViewStyle> = [
    {
      backgroundColor: flat
        ? theme.surfaceSunken
        : raised
          ? theme.surfaceRaised
          : theme.surface,
      borderRadius: metrics.radiusCard,
      borderWidth: selected ? metrics.selectBorderWidth : 1,
      borderColor: selected
        ? theme.accentBorder
        : flat
          ? "transparent"
          : theme.border,
      padding: padded ? 16 : 0,
      // Selection swaps 1px→2px, so pull the padding in by the difference to
      // keep the content from shifting when a card becomes selected.
      ...(selected ? { padding: padded ? 15 : 0 } : null),
      overflow: "hidden",
    },
    flat ? null : gamesLift(theme, raised ? "raised" : "card"),
    style,
  ];

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={shell} accessibilityRole="button">
        {children}
      </PressableScale>
    );
  }

  return (
    <Animated.View entering={entering} style={shell}>
      {children}
    </Animated.View>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * Intro card — where the per-mode hue lives
 *
 * This is the *only* place the mode hue appears, plus the eyebrow. Contained
 * that way it functions as a label ("you are in Podcasts") rather than as a
 * theme, which is what lets all five screens stay one brand while still being
 * individually identifiable at a glance.
 * ═══════════════════════════════════════════════════════════════════ */

export function GamesIntroCard({
  mode,
  icon,
  eyebrow,
  title,
  blurb,
  children,
  languageCode,
}: {
  mode: GameModeKey;
  icon: unknown;
  eyebrow: string;
  title: string;
  blurb?: string;
  children?: React.ReactNode;
  languageCode?: string;
}) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);
  const hue = useGameHue(mode);
  return (
    <GamesCard entering={FadeInDown.duration(GamesMotion.enterMs)}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: metrics.iconChipSize,
            height: metrics.iconChipSize,
            borderRadius: metrics.radiusChip,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: hue.wash,
            borderWidth: 1,
            borderColor: hue.border,
          }}
        >
          <HugeiconsIcon
            icon={icon as never}
            size={metrics.iconGlyph}
            color={hue.ink}
            strokeWidth={2}
          />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <AppText
            style={[GamesType.eyebrow, { color: hue.ink }]}
            languageCode={languageCode}
            numberOfLines={1}
          >
            {eyebrow}
          </AppText>
          <AppText
            style={[GamesType.title, { color: theme.ink }]}
            languageCode={languageCode}
          >
            {title}
          </AppText>
        </View>
      </View>
      {blurb ? (
        <AppText
          style={[GamesType.body, { color: theme.mutedInk, marginTop: 10 }]}
          languageCode={languageCode}
        >
          {blurb}
        </AppText>
      ) : null}
      {children}
    </GamesCard>
  );
}

/** Section label above a group. Neutral — grouping is Gestalt's job, not colour's. */
export function GamesSectionLabel({
  children,
  languageCode,
  style,
}: {
  children: React.ReactNode;
  languageCode?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useGamesTheme();
  return (
    <AppText
      languageCode={languageCode}
      style={[GamesType.eyebrow, { color: theme.faintInk }, style as never]}
    >
      {children}
    </AppText>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * Segmented control
 *
 * Replaces podcast's `levelSelector`, ai-teacher's `modeRow` and reading's
 * `optionRow` — three implementations of the same control.
 *
 * Choices are always visible rather than hidden behind a picker: with 2–4
 * options that is fewer decisions and no memory load (Hick's law stays cheap
 * at this width), and the selected item is marked by a filled coral pill, which
 * is the same "selected = coral" rule used by every other selectable thing.
 * ═══════════════════════════════════════════════════════════════════ */

/**
 * Digit-only labels render with DIN, never with the localized face. Sorani and
 * Arabic UI fonts here ship no Arabic-Indic digit glyphs, so "130" localized to
 * "١٣٠" came out as a row of dots.
 */
function isNumericLabel(label: string) {
  return /^[\d\s.,:%+\-/]+$/.test(label);
}

export function GamesSegmented<T extends string>({
  options,
  value,
  onChange,
  languageCode,
  style,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  languageCode?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          backgroundColor: theme.surfaceSunken,
          borderRadius: metrics.radiusControl,
          padding: 4,
          gap: 4,
          borderWidth: 1,
          borderColor: theme.border,
        },
        style,
      ]}
      accessibilityRole="tablist"
    >
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{
              flex: 1,
              minWidth: 0,
              height: metrics.segmentHeight - 8,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 4,
              borderRadius: metrics.radiusControl - 4,
              backgroundColor: on ? theme.accent : "transparent",
            }}
          >
            <AppText
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              languageCode={isNumericLabel(opt.label) ? "en" : languageCode}
              forceLatinFont={isNumericLabel(opt.label)}
              style={[
                GamesType.caption,
                {
                  color: on ? theme.onAccent : theme.mutedInk,
                  textAlign: "center",
                  flexShrink: 1,
                },
              ]}
            >
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Full-width selectable row — for option lists too long or too wordy for a
 * segmented control. Same "border colour marks selection" rule as onboarding.
 */
export function GamesOptionRow({
  label,
  sublabel,
  selected,
  onPress,
  leading,
  trailing,
  languageCode,
}: {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  languageCode?: string;
}) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        minHeight: metrics.rowMinHeight,
        borderRadius: metrics.radiusControl,
        borderWidth: metrics.selectBorderWidth,
        borderColor: selected ? theme.accentBorder : theme.border,
        backgroundColor: selected ? theme.accentWash : theme.surface,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      {leading}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText
          languageCode={languageCode}
          style={[
            GamesType.section,
            { fontSize: 16, color: selected ? theme.accentInk : theme.ink },
          ]}
        >
          {label}
        </AppText>
        {sublabel ? (
          <AppText
            languageCode={languageCode}
            style={[GamesType.caption, { color: theme.mutedInk }]}
          >
            {sublabel}
          </AppText>
        ) : null}
      </View>
      {trailing}
    </PressableScale>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * Primary / secondary action
 *
 * One commit button per screen, same height, radius, rim and colour as the
 * login and onboarding CTAs. The bottom rim (`PRIMARY_ACTION.rim`) is a
 * physical affordance cue — it reads as a raised key edge, so it looks pressable
 * before any interaction happens.
 * ═══════════════════════════════════════════════════════════════════ */

export function GamesPrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  languageCode,
  style,
  tone = "accent",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: unknown;
  languageCode?: string;
  style?: StyleProp<ViewStyle>;
  /** `danger` is for stop/end actions only — never for a normal commit. */
  tone?: "accent" | "danger";
}) {
  const theme = useGamesTheme();
  const off = disabled || loading;
  const face = tone === "danger" ? theme.danger : PRIMARY_ACTION.face;
  const rim = tone === "danger" ? "#B91C1C" : PRIMARY_ACTION.rim;

  return (
    <PressableScale
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityState={{ disabled: off, busy: loading }}
      style={[
        {
          height: PRIMARY_ACTION.height,
          borderRadius: PRIMARY_ACTION.radius,
          backgroundColor: off ? PRIMARY_ACTION.disabledFace : face,
          borderBottomWidth: PRIMARY_ACTION.rimWidth,
          borderBottomColor: off ? PRIMARY_ACTION.disabledRim : rim,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        },
        style,
      ]}
    >
      {icon ? (
        <HugeiconsIcon
          icon={icon as never}
          size={19}
          color={off ? PRIMARY_ACTION.disabledText : "#FFFFFF"}
          strokeWidth={2.2}
        />
      ) : null}
      {/* One line, always. RTL labels were measured a few points wide and wrapped
          inside a fixed-height 52pt button, pushing the second line out of view. */}
      <AppText
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        languageCode={languageCode}
        style={[
          GamesType.section,
          {
            fontSize: 16,
            color: off ? PRIMARY_ACTION.disabledText : theme.onAccent,
            textAlign: "center",
            flexShrink: 1,
          },
        ]}
      >
        {label}
      </AppText>
    </PressableScale>
  );
}

/** Low-emphasis action — neutral so it never competes with the primary. */
export function GamesSecondaryButton({
  label,
  onPress,
  icon,
  languageCode,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: unknown;
  languageCode?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useGamesTheme();

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={[
        {
          height: PRIMARY_ACTION.height,
          borderRadius: PRIMARY_ACTION.radius,
          backgroundColor: theme.surfaceSunken,
          borderWidth: 1,
          borderColor: theme.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        },
        style,
      ]}
    >
      {icon ? (
        <HugeiconsIcon
          icon={icon as never}
          size={18}
          color={theme.ink}
          strokeWidth={2}
        />
      ) : null}
      <AppText
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        languageCode={languageCode}
        style={[
          GamesType.section,
          { fontSize: 15, color: theme.ink, textAlign: "center", flexShrink: 1 },
        ]}
      >
        {label}
      </AppText>
    </PressableScale>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * Feedback primitives
 * ═══════════════════════════════════════════════════════════════════ */

/** Progress bar. Accent-filled, neutral track, no gradient. */
export function GamesProgressBar({
  value,
  height = 6,
  style,
}: {
  /** 0…1 */
  value: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useGamesTheme();
  const pct = Math.max(0, Math.min(1, value)) * 100;

  return (
    <View
      style={[
        {
          height,
          borderRadius: height / 2,
          backgroundColor: theme.track,
          overflow: "hidden",
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(pct), min: 0, max: 100 }}
    >
      <View
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: height / 2,
          backgroundColor: theme.accent,
        }}
      />
    </View>
  );
}

/**
 * Result metric tile. Number first at display size, label beneath — the number
 * is what the user came for, so it gets the visual weight.
 */
export function GamesStatTile({
  value,
  label,
  tone = "neutral",
  languageCode,
  style,
}: {
  value: string;
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
  languageCode?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);

  const ink =
    tone === "success"
      ? theme.successInk
      : tone === "warning"
        ? theme.warningInk
        : tone === "danger"
          ? theme.dangerInk
          : tone === "accent"
            ? theme.accentInk
            : theme.ink;

  return (
    <View
      style={[
        {
          flex: 1,
          minWidth: 96,
          borderRadius: metrics.radiusControl,
          backgroundColor: theme.surfaceSunken,
          borderWidth: 1,
          borderColor: theme.border,
          paddingVertical: 14,
          paddingHorizontal: 12,
          alignItems: "center",
          gap: 4,
        },
        style,
      ]}
    >
      <AppText style={[GamesType.display, { fontSize: 26, color: ink }]}>
        {value}
      </AppText>
      <AppText
        numberOfLines={1}
        languageCode={languageCode}
        style={[GamesType.eyebrow, { color: theme.faintInk }]}
      >
        {label}
      </AppText>
    </View>
  );
}

/** Small status pill. Semantic tones only. */
export function GamesBadge({
  label,
  tone = "neutral",
  languageCode,
  style,
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
  languageCode?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useGamesTheme();

  const map = {
    neutral: [theme.surfaceSunken, theme.mutedInk, theme.border],
    success: [theme.successWash, theme.successInk, withAlpha(theme.success, 0.3)],
    warning: [theme.warningWash, theme.warningInk, withAlpha(theme.warning, 0.3)],
    danger: [theme.dangerWash, theme.dangerInk, withAlpha(theme.danger, 0.3)],
    accent: [theme.accentWash, theme.accentInk, theme.accentBorder],
  } as const;
  const [bg, fg, bd] = map[tone];

  return (
    <View
      style={[
        {
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 999,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: bd,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <AppText
        languageCode={languageCode}
        style={[GamesType.caption, { fontSize: 12, color: fg }]}
      >
        {label}
      </AppText>
    </View>
  );
}

/**
 * Empty / error / loading state. One component so a failure looks the same on
 * every screen — an inconsistent error state is where trust leaks fastest.
 */
export function GamesStateBlock({
  icon,
  title,
  body,
  tone = "neutral",
  action,
  languageCode,
}: {
  icon?: unknown;
  title: string;
  body?: string;
  tone?: "neutral" | "danger";
  action?: React.ReactNode;
  languageCode?: string;
}) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);
  const isDanger = tone === "danger";

  return (
    <Animated.View
      entering={FadeIn.duration(GamesMotion.enterMs)}
      style={{
        alignItems: "center",
        gap: 10,
        paddingVertical: 28,
        paddingHorizontal: 20,
      }}
    >
      {icon ? (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: metrics.radiusControl,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDanger ? theme.dangerWash : theme.surfaceSunken,
            borderWidth: 1,
            borderColor: isDanger
              ? withAlpha(theme.danger, 0.3)
              : theme.border,
          }}
        >
          <HugeiconsIcon
            icon={icon as never}
            size={26}
            color={isDanger ? theme.dangerInk : theme.mutedInk}
            strokeWidth={2}
          />
        </View>
      ) : null}
      <AppText
        languageCode={languageCode}
        style={[
          GamesType.section,
          { color: isDanger ? theme.dangerInk : theme.ink, textAlign: "center" },
        ]}
      >
        {title}
      </AppText>
      {body ? (
        <AppText
          languageCode={languageCode}
          style={[
            GamesType.body,
            { color: theme.mutedInk, textAlign: "center", maxWidth: 320 },
          ]}
        >
          {body}
        </AppText>
      ) : null}
      {action}
    </Animated.View>
  );
}

/**
 * Vertical fade that masks content scrolling under a pinned control area.
 * Theme-aware — the old reading-practice version hardcoded `#F8FAFC`, so it
 * showed a pale smear across the dark canvas.
 */
export function GamesScrollFade({
  position = "bottom",
  height = 48,
  style,
}: {
  position?: "top" | "bottom";
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useGamesTheme();
  const solid = theme.canvas;
  const clear = withAlpha(theme.canvas, 0);
  const colors =
    position === "bottom"
      ? ([clear, withAlpha(theme.canvas, 0.82), solid] as const)
      : ([solid, withAlpha(theme.canvas, 0.82), clear] as const);

  return (
    <LinearGradient
      colors={colors as unknown as readonly [string, string, string]}
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          height,
          [position]: 0,
        } as ViewStyle,
        style,
      ]}
      pointerEvents="none"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════ */

function useChromeStyles() {
  return useMemo(
    () =>
      StyleSheet.create({
        headerWrap: {
          borderBottomWidth: StyleSheet.hairlineWidth,
          zIndex: 10,
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          gap: 10,
        },
        headerTitle: {
          flex: 1,
          textAlign: "center",
        },
        headerRight: {
          minWidth: 44,
          alignItems: "flex-end",
        },
      }),
    [],
  );
}

export { crossShadow };
export type { GamesTheme, GamesMetrics };
