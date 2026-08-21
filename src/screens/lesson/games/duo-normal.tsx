/**
 * duo-normal.tsx — the normal-path lesson design.
 *
 * Scope: `mode=normal` only, light + dark. The street and kids paths keep their
 * existing look and never reach this file — `lesson-light-primitives` decides.
 *
 * Motion notes (why things are built the way they are):
 *
 *   • Tiles press by compressing their own bottom rim. The face travels down by
 *     exactly the depth the rim loses, so the top edge never moves — the tile
 *     reads as a physical key, not a shrinking rectangle. Scale is deliberately
 *     NOT used here; scaling a bordered box visibly thins its border.
 *   • Every colour change runs through one `interpolateColor` driven by a single
 *     shared `stateIndex`, so background/border/text stay in lockstep and can
 *     never tear mid-transition.
 *   • Springs are critically damped everywhere except the correct-answer pop,
 *     which gets one small overshoot. Bounce on failure feels like a toy; bounce
 *     on success feels like a reward.
 *   • All animated properties are transform/opacity or colours, which stay on
 *     the UI thread. Layout-affecting values are never animated in a loop.
 */

import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";

import { AppText } from "../../../components/ui/AppText";
import { TwinoMascot, type TwinoPose } from "../../../components/mascot/TwinoMascot";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useLocaleStore } from "../../../stores/useLocaleStore";
import { useTTS } from "../../../hooks/use-tts";
import { getLanguageDirection } from "../../../i18n/direction";
import { LayoutDirectionProvider, useLayoutDirection } from "../../../i18n/layout-direction";
import { PRIMARY_ACTION } from "../../../constants/primary-action";
import { Duo, DuoMotion, FastWordMotion, LightType } from "./lesson-light-design";

/**
 * RTL note (Kurdish Sorani is the primary audience)
 * ─────────────────────────────────────────────────
 * `useLocaleStore` calls `I18nManager.forceRTL(true)` for RTL UI languages, so
 * on native the layout engine already mirrors `flexDirection: "row"`, `row-gap`
 * order, and `start`/`end` insets for us. Manually applying `row-reverse` here
 * would flip a second time and land back in LTR order — so this file uses plain
 * `row` everywhere and only mirrors things the engine cannot know about:
 * physical `left`/`right` offsets (the bubble tail) and glyph mirroring.
 *
 * On web there is no forceRTL, so direction comes from `document.documentElement.dir`
 * (set in `app/_layout.tsx`), which mirrors flex rows natively in CSS. Both
 * platforms therefore want the same markup.
 */

/* ────────────────────────────────────────────────────────────────────
 * Route gate
 * ──────────────────────────────────────────────────────────────────── */

/**
 * True only on the normal learning path.
 *
 * `LessonScreen` resolves an absent `mode` param to "street", so this checks for
 * the explicit value rather than treating undefined as normal. Street and kids
 * must keep their existing design, so every primitive that can render either
 * look gates on this.
 */
export function useIsNormalPath(): boolean {
  const params = useLocalSearchParams();
  const raw = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  return raw === "normal";
}

/* ────────────────────────────────────────────────────────────────────
 * Theme resolution
 * ──────────────────────────────────────────────────────────────────── */

export type DuoTheme = ReturnType<typeof useDuoTheme>;

/**
 * One place that answers "what colour is X right now". Dark mode is a tuned
 * variant of the same design — same shapes, same depth, darker surfaces — so
 * every component below reads from here instead of branching on `isDark`.
 */
export function useDuoTheme() {
  const { colors, isDark } = useThemeColors();

  return React.useMemo(() => {
    if (!isDark) {
      return {
        isDark,
        canvas: Duo.canvas,
        text: Duo.eel,
        textMuted: Duo.hare,
        rail: Duo.rail,
        railActive: Duo.railActive,

        tileFace: Duo.surface,
        tileBorder: Duo.border,
        tileRim: Duo.borderDark,
        tileText: Duo.eel,

        selFace: Duo.blueBg,
        selBorder: Duo.blueBorder,
        selRim: Duo.blueBorder,
        selText: Duo.blueDark,

        okFace: Duo.greenBg,
        okBorder: Duo.greenBorder,
        okRim: Duo.greenBorder,
        okText: Duo.greenText,

        badFace: Duo.redBg,
        badBorder: Duo.redBorder,
        badRim: Duo.redBorder,
        badText: Duo.redText,

        ghost: "#E5E5E5",
        bubble: Duo.surface,
        bubbleBorder: Duo.border,

        panelOk: Duo.greenBg,
        panelBad: Duo.redBg,
        panelOkBorder: Duo.greenBorder,
        panelBadBorder: Duo.redBorder,
        panelOkText: Duo.greenText,
        panelBadText: Duo.redText,

        ctaOk: Duo.green,
        ctaOkRim: Duo.greenDark,
        ctaBad: Duo.red,
        ctaBadRim: Duo.redDark,

        disabledFace: Duo.border,
        disabledText: Duo.swan,
        progressTrack: Duo.border,
        progressFill: Duo.accent,
        heart: Duo.heart,
        heartSpent: Duo.heartSpent,
        close: Duo.swan,
      };
    }

    return {
      isDark,
      canvas: colors.background,
      text: colors.foreground,
      textMuted: colors.mutedForeground,
      rail: colors.border,
      railActive: Duo.accent,

      tileFace: colors.surfaceRaised,
      tileBorder: colors.border,
      tileRim: colors.border,
      tileText: colors.foreground,

      selFace: "rgba(255,107,74,0.20)",
      selBorder: "#FF8A70",
      selRim: Duo.accentDark,
      selText: "#FFB9A9",

      okFace: "rgba(88,204,2,0.20)",
      okBorder: "#5FCF12",
      okRim: "#3E8F0B",
      okText: "#A9EE72",

      badFace: "rgba(255,75,75,0.20)",
      badBorder: "#F86464",
      badRim: "#B23434",
      badText: "#FFB2B2",

      ghost: colors.muted,
      bubble: colors.surfaceRaised,
      bubbleBorder: colors.border,

      panelOk: "#162B1A",
      panelBad: "#311818",
      panelOkBorder: "#234A29",
      panelBadBorder: "#522424",
      panelOkText: "#58CC02",
      panelBadText: "#FF4B4B",

      ctaOk: Duo.green,
      ctaOkRim: "#3E8F0B",
      ctaBad: Duo.red,
      ctaBadRim: "#B23434",

      disabledFace: colors.muted,
      disabledText: colors.mutedForeground,
      progressTrack: colors.muted,
      progressFill: Duo.accent,
      heart: Duo.heart,
      heartSpent: colors.muted,
      close: colors.mutedForeground,
    };
  }, [colors, isDark]);
}

/* ────────────────────────────────────────────────────────────────────
 * Header — bare ✕, pill progress, discrete hearts
 * ──────────────────────────────────────────────────────────────────── */

function HeartShape({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 21.35C6.4 17.6 2 14.1 2 9.9 2 6.6 4.5 4.2 7.6 4.2c1.9 0 3.5 1 4.4 2.4.9-1.4 2.5-2.4 4.4-2.4 3.1 0 5.6 2.4 5.6 5.7 0 4.2-4.4 7.7-10 11.45z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * A heart that animates the moment it is spent: one sharp squeeze, then the
 * orange fill cross-dissolves to grey. Two stacked shapes with an opacity
 * cross-fade — animating an SVG `fill` directly is not worklet-safe.
 */
function DuoHeart({ filled, size = 27 }: { filled: boolean; size?: number }) {
  const theme = useDuoTheme();
  const fill = useSharedValue(filled ? 1 : 0);
  const squeeze = useSharedValue(1);
  const mounted = React.useRef(false);

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fill.value = filled ? 1 : 0;
      return;
    }
    if (!filled) {
      // Spent: pop out, then drain the colour.
      squeeze.value = withSequence(
        withTiming(1.28, { duration: 110, easing: Easing.out(Easing.quad) }),
        withSpring(1, DuoMotion.release),
      );
      fill.value = withDelay(70, withTiming(0, { duration: 220 }));
    } else {
      squeeze.value = withSequence(
        withTiming(1.18, { duration: 130, easing: Easing.out(Easing.quad) }),
        withSpring(1, DuoMotion.pop),
      );
      fill.value = withTiming(1, { duration: 180 });
    }
  }, [filled, fill, squeeze]);

  React.useEffect(
    () => () => {
      cancelAnimation(fill);
      cancelAnimation(squeeze);
    },
    [fill, squeeze],
  );

  const wrap = useAnimatedStyle(() => ({
    transform: [{ scale: squeeze.value }],
  }));
  const front = useAnimatedStyle(() => ({ opacity: fill.value }));

  return (
    <Animated.View style={[{ width: size, height: size }, wrap]}>
      <HeartShape size={size} color={theme.heartSpent} />
      <Animated.View style={[StyleSheet.absoluteFill, front]}>
        <HeartShape size={size} color={theme.heart} />
      </Animated.View>
    </Animated.View>
  );
}

function CloseX({ onPress, color }: { onPress: () => void; color: string }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") void Haptics.selectionAsync();
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.85, DuoMotion.press);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, DuoMotion.release);
        }}
        hitSlop={14}
        accessibilityRole="button"
        style={s.closeHit}
      >
        <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 6L6 18M6 6l12 12"
            stroke={color}
            strokeWidth={2.6}
            strokeLinecap="round"
          />
        </Svg>
      </Pressable>
    </Animated.View>
  );
}

export function DuoLessonHeader({
  progressFillStyle,
  hearts,
  maxHearts = 5,
  onBack,
  step,
}: {
  progressFillStyle: StyleProp<ViewStyle>;
  hearts: number;
  maxHearts?: number;
  onBack: () => void;
  /** Question index — bumping it pulses the bar so progress is felt, not just seen. */
  step?: number;
}) {
  const theme = useDuoTheme();

  const pulse = useSharedValue(0);
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pulse.value = withSequence(
      withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) }),
    );
  }, [step, pulse]);

  React.useEffect(() => () => cancelAnimation(pulse), [pulse]);

  const trackPulse = useAnimatedStyle(() => ({
    transform: [{ scaleY: interpolate(pulse.value, [0, 1], [1, 1.14]) }],
  }));
  const sheen = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0, 0.55]),
  }));

  return (
    <View style={s.header}>
      <CloseX onPress={onBack} color={theme.close} />

      <Animated.View
        style={[
          s.progressTrack,
          { backgroundColor: theme.progressTrack },
          trackPulse,
        ]}
      >
        <Animated.View
          style={[
            s.progressFill,
            { backgroundColor: theme.progressFill },
            progressFillStyle,
          ]}
        >
          {/* Duolingo's fill carries a soft highlight along its top edge. */}
          <View style={s.progressGloss} pointerEvents="none" />
          <Animated.View style={[s.progressSheen, sheen]} pointerEvents="none" />
        </Animated.View>
      </Animated.View>

      <View style={s.heartsRow}>
        {Array.from({ length: maxHearts }).map((_, i) => (
          <DuoHeart key={i} filled={i < hearts} />
        ))}
      </View>
    </View>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Heading
 * ──────────────────────────────────────────────────────────────────── */

export function DuoHeading({ title }: { title: string }) {
  const theme = useDuoTheme();
  const uiLanguage = useLocaleStore((st) => st.selectedUiLanguage);

  return (
    <View style={s.headingWrap}>
      <AppText
        languageCode={uiLanguage}
        align="start"
        fullWidth
        style={[LightType.title, { color: theme.text }]}
      >
        {title}
      </AppText>
    </View>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Prompt — mascot + speech bubble with an inline speaker
 * ──────────────────────────────────────────────────────────────────── */

function SpeakerGlyph({ color, size = 30 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 9v6h4l5 4V5L8 9H4z" fill={color} />
      <Path
        d="M16.5 8.5a4.5 4.5 0 010 7M19 6a8 8 0 010 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Prompt type scale.
 *
 * The bubble shares its row with the mascot, so the label column is only ~190dp
 * on a 412dp phone. At a fixed 21px that ran even short greetings onto three
 * lines. Widening the column (see `promptRow`) is the substantive fix; this is
 * the backstop for genuinely long strings.
 *
 * Rule: hold the display size unless shrinking actually removes a line. Short
 * prompts therefore all render at exactly `MAX` — uniform type across questions,
 * rather than a size that jitters per string, which reads as its own kind of
 * sloppiness. Only long strings step down, and only as far as buys a line.
 *
 * Width is estimated, not measured: `onTextLayout` would need a second render
 * pass and a visible reflow. `CHAR_W` is an average advance as a fraction of the
 * em, set slightly generous so the estimate errs toward the smaller size.
 * Measured against all 2705 prompt strings in `src/data`, this leaves ~47% on
 * one line and ~85% within two at 412dp.
 */
const PROMPT_FONT = { MAX: 21, MIN: 16, CHAR_W: 0.55 } as const;

/**
 * Box-model constants shared by `fitPromptFontSize`'s width estimate and the
 * styles below. Keep the two in sync — if `s.bubble` padding changes, change
 * `BUBBLE_PAD` with it or the type scale silently drifts.
 *
 * `GAME_ROOT_PAD` is the inset the *caller* applies. It varies (16 on the match
 * games, 20 on most, 24 on reading), so this takes the common 20 — the estimate
 * only needs to be close, and guessing high yields a smaller font, which wraps
 * less rather than more.
 */
const GAME_ROOT_PAD = 20;
const PROMPT_GAP = 6;
const BUBBLE_BORDER = 2;
const BUBBLE_PAD = 16;
const BUBBLE_GAP = 12;
const SPEAKER_SIZE = 30;

function fitPromptFontSize(length: number, width: number): number {
  const { MAX, MIN, CHAR_W } = PROMPT_FONT;
  if (!length || width <= 0) return MAX;

  const linesAt = (size: number) => Math.ceil((length * CHAR_W * size) / width);

  let best: number = MAX;
  let bestLines = linesAt(MAX);
  for (let size = MAX - 1; size >= MIN; size--) {
    const n = linesAt(size);
    if (n < bestLines) {
      bestLines = n;
      best = size;
    }
  }
  return best;
}

/**
 * The bubble is one large press target — tapping anywhere replays the audio,
 * matching Duolingo. The speaker pulses on tap so the tap is acknowledged even
 * when TTS takes a moment to start.
 */
export function DuoPrompt({
  children,
  speechText,
  speechLanguageCode,
  contentLanguageCode,
  pose = "wave",
}: {
  children: string;
  speechText?: string;
  speechLanguageCode?: string;
  contentLanguageCode?: string;
  pose?: TwinoPose;
}) {
  const theme = useDuoTheme();
  const { t } = useI18n();
  const { speak } = useTTS();
  const { width } = useWindowDimensions();
  const uiLanguage = useLocaleStore((st) => st.selectedUiLanguage);
  const language = contentLanguageCode ?? uiLanguage;
  // Layout mirrors on the *UI* language; the bubble's own text direction is
  // handled by AppText from the content language, which may differ.
  const uiRtl = getLanguageDirection(uiLanguage) === "rtl";
  const rtlText = getLanguageDirection(language) === "rtl";

  const mascotSize = width < 360 ? 82 : width < 400 ? 90 : 98;

  /*
   * Width actually available to the label, so the type scale can be chosen
   * before first paint (no measure → re-render flash). Mirrors the box model
   * below: game root padding, the row gap, the bubble's border + padding, and
   * the speaker column.
   */
  const textWidth = Math.max(
    120,
    width - 2 * GAME_ROOT_PAD - mascotSize - PROMPT_GAP - 2 * (BUBBLE_BORDER + BUBBLE_PAD) - SPEAKER_SIZE - BUBBLE_GAP,
  );
  const fontSize = fitPromptFontSize(children.trim().length, textWidth);

  const speakerScale = useSharedValue(1);
  const bubbleScale = useSharedValue(1);

  const handleSpeak = React.useCallback(() => {
    if (Platform.OS !== "web") void Haptics.selectionAsync();
    speakerScale.value = withSequence(
      withTiming(1.22, { duration: 120, easing: Easing.out(Easing.quad) }),
      withSpring(1, DuoMotion.pop),
    );
    speak(speechText ?? children, speechLanguageCode ?? language, undefined, {
      provider: "device",
    });
  }, [children, language, speak, speakerScale, speechLanguageCode, speechText]);

  React.useEffect(
    () => () => {
      cancelAnimation(speakerScale);
      cancelAnimation(bubbleScale);
    },
    [bubbleScale, speakerScale],
  );

  const speakerAnim = useAnimatedStyle(() => ({
    transform: [{ scale: speakerScale.value }],
  }));
  const bubbleAnim = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
  }));

  return (
    <View style={s.promptRow}>
      <View style={{ width: mascotSize, alignItems: "center" }}>
        <TwinoMascot size={mascotSize} pose={pose} />
        <View style={s.mascotShadow} />
      </View>

      <Animated.View style={[s.bubbleWrap, bubbleAnim]}>
        <Pressable
          onPress={handleSpeak}
          onPressIn={() => {
            bubbleScale.value = withSpring(0.985, DuoMotion.press);
          }}
          onPressOut={() => {
            bubbleScale.value = withSpring(1, DuoMotion.release);
          }}
          accessibilityRole="button"
          accessibilityLabel={`${t("lessons.listenLabel")}: ${speechText ?? children}`}
          style={[
            s.bubble,
            /*
             * The speaker always sits on the physical LEFT edge of the bubble,
             * as it does in Duolingo's Arabic/Hebrew builds. Under an RTL UI the
             * layout engine mirrors `row`, which would push it to the right, so
             * `row-reverse` is applied to mirror it back. This is a physical
             * placement decision, not a reading-order one — the label text keeps
             * its own direction via AppText.
             */
            uiRtl && s.bubbleRtl,
            { backgroundColor: theme.bubble, borderColor: theme.bubbleBorder },
          ]}
        >
          <Animated.View style={[s.bubbleSpeaker, speakerAnim]}>
            <SpeakerGlyph color={Duo.accent} size={SPEAKER_SIZE} />
          </Animated.View>
          <AppText
            languageCode={language}
            align="start"
            style={[
              s.bubbleText,
              { color: theme.text, fontSize, lineHeight: Math.round(fontSize * 1.42) },
              rtlText && { writingDirection: "rtl" },
            ]}
          >
            {children}
          </AppText>
        </Pressable>

        {/*
          Tail — a rotated square whose two visible edges inherit the border.
          Physical `left`/`right` and `transform` are the two things RTL layout
          does NOT mirror for us, so the side and rotation are chosen explicitly
          from the UI direction to keep the tail pointing at the mascot.
        */}
        <View
          style={[
            s.bubbleTail,
            uiRtl ? s.bubbleTailRtl : s.bubbleTailLtr,
            { backgroundColor: theme.bubble, borderColor: theme.bubbleBorder },
          ]}
          pointerEvents="none"
        />
      </Animated.View>
    </View>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Word tile
 * ──────────────────────────────────────────────────────────────────── */

export type DuoTileState = "idle" | "selected" | "correct" | "wrong" | "ghost";

const RIM = 4;
const RIM_PRESSED = 2;
const SUBTLE_RIM = 3;
const SUBTLE_RIM_PRESSED = 1.5;

/**
 * The core interactive element. Everything about its feel lives here:
 *
 *   press   → the default rim compresses 4px→2px while the face drops 2px
 *             (compact word builders can request the quieter 3px→1.5px edge)
 *   correct → single spring overshoot as the green fills in
 *   wrong   → damped horizontal shake, amplitude decaying 8→5→2
 *
 * `ghost` is the grey slug left in the word bank after a word is lifted out.
 */
export function DuoTile({
  label,
  tierLabel,
  state = "idle",
  onPress,
  activateOnPressIn = false,
  disabled,
  languageCode,
  style,
  align = "center",
  fontSize,
  numberOfLines,
  depthStyle = "default",
  /** Fires the wrong-answer shake from a parent (used on submit). */
  shakeSignal,
}: {
  label: string;
  tierLabel?: string;
  state?: DuoTileState;
  onPress?: () => void;
  activateOnPressIn?: boolean;
  disabled?: boolean;
  languageCode?: string;
  style?: StyleProp<ViewStyle>;
  align?: "center" | "start";
  fontSize?: number;
  numberOfLines?: number;
  /** A quieter key edge for compact word-building tiles. */
  depthStyle?: "default" | "subtle";
  shakeSignal?: number;
}) {
  const theme = useDuoTheme();
  const targetLanguage = useLocaleStore((st) => st.selectedTargetLanguage);
  const uiLanguage = useLocaleStore((st) => st.selectedUiLanguage);
  const ambientDirection = useLayoutDirection();
  const lang = languageCode ?? targetLanguage;
  const restingRim = depthStyle === "subtle" ? SUBTLE_RIM : RIM;
  const pressedRim = depthStyle === "subtle" ? SUBTLE_RIM_PRESSED : RIM_PRESSED;

  const stateColors = React.useMemo<Record<DuoTileState, { face: string; border: string; rim: string }>>(() => ({
    idle: { face: theme.tileFace, border: theme.tileBorder, rim: theme.tileRim },
    selected: { face: theme.selFace, border: theme.selBorder, rim: theme.selRim },
    correct: { face: theme.okFace, border: theme.okBorder, rim: theme.okRim },
    wrong: { face: theme.badFace, border: theme.badBorder, rim: theme.badRim },
    ghost: { face: theme.ghost, border: theme.ghost, rim: theme.ghost },
  }), [theme]);

  const targetColors = stateColors[state] ?? stateColors.idle;
  const fromFace = useSharedValue(targetColors.face);
  const toFace = useSharedValue(targetColors.face);
  const fromBorder = useSharedValue(targetColors.border);
  const toBorder = useSharedValue(targetColors.border);
  const fromRim = useSharedValue(targetColors.rim);
  const toRim = useSharedValue(targetColors.rim);
  const colorProgress = useSharedValue(1);

  const depth = useSharedValue(restingRim);
  const drop = useSharedValue(0);
  const pop = useSharedValue(1);
  const shakeX = useSharedValue(0);
  const prevState = React.useRef<DuoTileState>(state);
  const activatedOnPressInRef = React.useRef(false);

  React.useEffect(() => {
    if (state !== prevState.current) {
      fromFace.value = toFace.value;
      toFace.value = targetColors.face;
      fromBorder.value = toBorder.value;
      toBorder.value = targetColors.border;
      fromRim.value = toRim.value;
      toRim.value = targetColors.rim;
      colorProgress.value = 0;
      colorProgress.value = withTiming(1, {
        duration: activateOnPressIn ? FastWordMotion.colorMs : DuoMotion.colorMs,
      });

      if (state === "correct") {
        pop.value = withSequence(
          withTiming(1.05, { duration: 130, easing: Easing.out(Easing.quad) }),
          withSpring(1, DuoMotion.pop),
        );
      } else if (state === "wrong") {
        shakeX.value = withSequence(
          withTiming(-8, { duration: 52 }),
          withTiming(8, { duration: 62 }),
          withTiming(-5, { duration: 58 }),
          withTiming(5, { duration: 54 }),
          withTiming(-2, { duration: 46 }),
          withTiming(0, { duration: 44, easing: Easing.out(Easing.quad) }),
        );
      }
      prevState.current = state;
    }
  }, [activateOnPressIn, pop, shakeX, state, targetColors, fromFace, toFace, fromBorder, toBorder, fromRim, toRim, colorProgress]);

  React.useEffect(() => {
    if (!shakeSignal) return;
    shakeX.value = withSequence(
      withTiming(-8, { duration: 52 }),
      withTiming(8, { duration: 62 }),
      withTiming(-5, { duration: 58 }),
      withTiming(5, { duration: 54 }),
      withTiming(-2, { duration: 46 }),
      withTiming(0, { duration: 44, easing: Easing.out(Easing.quad) }),
    );
  }, [shakeSignal, shakeX]);

  React.useEffect(
    () => () => {
      cancelAnimation(colorProgress);
      cancelAnimation(depth);
      cancelAnimation(drop);
      cancelAnimation(pop);
      cancelAnimation(shakeX);
    },
    [colorProgress, depth, drop, pop, shakeX],
  );

  const labelColorsMap: Record<DuoTileState, string> = React.useMemo(() => ({
    idle: theme.tileText,
    selected: theme.selText,
    correct: theme.okText,
    wrong: theme.badText,
    ghost: "transparent",
  }), [theme]);
  const labelColor = labelColorsMap[state] ?? theme.tileText;

  const boxAnim = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorProgress.value, [0, 1], [fromFace.value, toFace.value]),
    borderColor: interpolateColor(colorProgress.value, [0, 1], [fromBorder.value, toBorder.value]),
    borderBottomColor: interpolateColor(colorProgress.value, [0, 1], [fromRim.value, toRim.value]),
    borderBottomWidth: depth.value,
    transform: [
      { translateX: shakeX.value },
      { translateY: drop.value },
      { scale: pop.value },
    ],
  }));

  const interactive = !!onPress && !disabled && state !== "ghost";

  /*
   * `alignItems: flex-start` is mirrored to the right edge by the layout engine
   * under an RTL UI, so an LTR answer tile in a Kurdish lesson would align its
   * label right. Pinning the tile's own direction keeps `flex-start` meaning
   * "left" for LTR content; RTL content is left to inherit the app direction.
   *
   * The provider has to travel with the style — `AppText` pre-encodes its
   * physical edge against the ambient layout direction, so a boundary that
   * mirrors the box without publishing itself puts the label back on the wrong
   * side. See `i18n/layout-direction`.
   */
  const tileDirection = getLanguageDirection(lang);
  const ltrBoundary =
    Platform.OS !== "web" && tileDirection === "ltr"
      ? ({ direction: "ltr" } as const)
      : undefined;

  const body = (
    <LayoutDirectionProvider value={ltrBoundary ? "ltr" : ambientDirection}>
      <Animated.View
        style={[
          s.tile,
          depthStyle === "subtle" && s.tileSubtle,
          align === "start" && s.tileStart,
          ltrBoundary,
          style,
          boxAnim,
        ]}
      >
        {/*
          The ghost slug keeps its label mounted — that is what holds the slot
          at the exact width of the word taken out of it, so the bank never
          reflows mid-solve — but the text is hidden, because a still-readable
          word reads as a tile that was never picked up.
        */}
        {tierLabel ? (
          <View style={[s.tileTierRow, state === "ghost" && { opacity: 0 }]}>
            <AppText
              languageCode={lang}
              align="start"
              style={[LightType.tile, s.tileFlexLabel, { color: labelColor }]}
            >
              {label}
            </AppText>
            <AppText
              languageCode={uiLanguage}
              style={[s.tierBadge, { color: labelColor }]}
            >
              {tierLabel}
            </AppText>
          </View>
        ) : (
          <AppText
            languageCode={lang}
            align={align}
            fullWidth={align === "start"}
            numberOfLines={numberOfLines}
            style={[
              LightType.tile,
              fontSize !== undefined && { fontSize, lineHeight: fontSize + 7 },
              { color: labelColor },
              state === "ghost" && { opacity: 0 },
            ]}
          >
            {label}
          </AppText>
        )}
      </Animated.View>
    </LayoutDirectionProvider>
  );

  if (!interactive) return body;

  return (
    <Pressable
      onPress={() => {
        if (activatedOnPressInRef.current) {
          activatedOnPressInRef.current = false;
          return;
        }
        if (Platform.OS !== "web") void Haptics.selectionAsync();
        onPress!();
      }}
      onPressIn={() => {
        activatedOnPressInRef.current = false;
        const pressMotion = activateOnPressIn ? FastWordMotion.press : DuoMotion.press;
        depth.value = withSpring(pressedRim, pressMotion);
        drop.value = withSpring(restingRim - pressedRim, pressMotion);
        if (activateOnPressIn) {
          activatedOnPressInRef.current = true;
          if (Platform.OS !== "web") void Haptics.selectionAsync();
          onPress!();
        }
      }}
      onPressOut={() => {
        const releaseMotion = activateOnPressIn
          ? FastWordMotion.release
          : DuoMotion.release;
        depth.value = withSpring(restingRim, releaseMotion);
        drop.value = withSpring(0, releaseMotion);
      }}
      disabled={disabled}
    >
      {body}
    </Pressable>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Underline rails — the answer area words land on
 * ──────────────────────────────────────────────────────────────────── */

export function DuoRail({ style }: { style?: StyleProp<ViewStyle> }) {
  const theme = useDuoTheme();
  return <View style={[s.rail, { backgroundColor: theme.rail }, style]} />;
}

/* ────────────────────────────────────────────────────────────────────
 * Check button — keeps the app's coral primary action
 * ──────────────────────────────────────────────────────────────────── */

export function DuoCheckButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useDuoTheme();
  const enabled = useSharedValue(disabled ? 0 : 1);
  const depth = useSharedValue(RIM);
  const drop = useSharedValue(0);

  React.useEffect(() => {
    enabled.value = withTiming(disabled ? 0 : 1, { duration: 190 });
  }, [disabled, enabled]);

  React.useEffect(
    () => () => {
      cancelAnimation(enabled);
      cancelAnimation(depth);
      cancelAnimation(drop);
    },
    [depth, drop, enabled],
  );

  const box = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      enabled.value,
      [0, 1],
      [theme.disabledFace, PRIMARY_ACTION.face],
    ),
    borderBottomColor: interpolateColor(
      enabled.value,
      [0, 1],
      [theme.disabledFace, PRIMARY_ACTION.rim],
    ),
    borderBottomWidth: depth.value,
    transform: [{ translateY: drop.value }],
  }));

  /* Resolved in JS — see the note in DuoTile about AppText flattening styles. */
  const labelColor = disabled ? theme.disabledText : "#FFFFFF";

  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        if (Platform.OS !== "web") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPress();
      }}
      onPressIn={() => {
        if (disabled) return;
        depth.value = withSpring(RIM_PRESSED, DuoMotion.press);
        drop.value = withSpring(RIM - RIM_PRESSED, DuoMotion.press);
      }}
      onPressOut={() => {
        depth.value = withSpring(RIM, DuoMotion.release);
        drop.value = withSpring(0, DuoMotion.release);
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
    >
      <Animated.View style={[s.cta, box]}>
        <AppText
          style={[s.ctaLabel, { color: labelColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          forceLatinFont
          latinRole="bold"
        >
          {label.toUpperCase()}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Feedback panel
 * ──────────────────────────────────────────────────────────────────── */

function ShareGlyph({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 16V4m0 0L8 8m4-4l4 4"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function FlagGlyph({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 21V5m0 0h9l-1.6 3.2L15 11.4H6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ResultBadge({ ok, color }: { ok: boolean; color: string }) {
  const scale = useSharedValue(0.4);
  const spin = useSharedValue(-25);

  React.useEffect(() => {
    scale.value = withSpring(1, DuoMotion.pop);
    spin.value = withSpring(0, DuoMotion.pop);
  }, [scale, spin]);

  React.useEffect(
    () => () => {
      cancelAnimation(scale);
      cancelAnimation(spin);
    },
    [scale, spin],
  );

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${spin.value}deg` }],
  }));

  return (
    <Animated.View style={anim}>
      <Svg width={34} height={34} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={11} fill={color} />
        {ok ? (
          <Path
            d="M7.4 12.4l3 3 6.2-6.4"
            stroke="#FFFFFF"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <Path
            d="M8.4 8.4l7.2 7.2M15.6 8.4l-7.2 7.2"
            stroke="#FFFFFF"
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
          />
        )}
      </Svg>
    </Animated.View>
  );
}

/**
 * Full-bleed result panel. Content staggers in behind the sheet's own slide so
 * the panel reads as one object arriving, not four elements appearing at once.
 */
export function DuoFeedbackPanel({
  correct,
  title,
  subtitle,
  correctAnswer,
  buttonLabel,
  onContinue,
  bottomInset = 0,
}: {
  correct: boolean;
  title: string;
  subtitle?: string;
  correctAnswer?: string;
  buttonLabel?: string;
  onContinue: () => void;
  bottomInset?: number;
}) {
  const theme = useDuoTheme();
  const { t } = useI18n();
  const uiLanguage = useLocaleStore((st) => st.selectedUiLanguage);

  const accent = correct ? theme.panelOkText : theme.panelBadText;
  const bg = correct ? theme.panelOk : theme.panelBad;
  const ctaFace = correct ? theme.ctaOk : theme.ctaBad;
  const ctaRim = correct ? theme.ctaOkRim : theme.ctaBadRim;
  const label = buttonLabel ?? (correct ? t("common.continue") : t("lessons.gotIt"));

  const rowIn = useSharedValue(0);
  const ctaIn = useSharedValue(0);
  const depth = useSharedValue(RIM);
  const drop = useSharedValue(0);

  React.useEffect(() => {
    rowIn.value = withDelay(60, withTiming(1, { duration: 240, easing: Easing.out(Easing.cubic) }));
    ctaIn.value = withDelay(130, withTiming(1, { duration: 240, easing: Easing.out(Easing.cubic) }));
  }, [ctaIn, rowIn]);

  React.useEffect(
    () => () => {
      cancelAnimation(rowIn);
      cancelAnimation(ctaIn);
      cancelAnimation(depth);
      cancelAnimation(drop);
    },
    [ctaIn, depth, drop, rowIn],
  );

  const rowAnim = useAnimatedStyle(() => ({
    opacity: rowIn.value,
    transform: [{ translateY: interpolate(rowIn.value, [0, 1], [10, 0]) }],
  }));
  const ctaWrapAnim = useAnimatedStyle(() => ({
    opacity: ctaIn.value,
    transform: [{ translateY: interpolate(ctaIn.value, [0, 1], [14, 0]) }],
  }));
  const ctaAnim = useAnimatedStyle(() => ({
    borderBottomWidth: depth.value,
    transform: [{ translateY: drop.value }],
  }));

  const borderColor = correct ? theme.panelOkBorder : theme.panelBadBorder;

  return (
    <View
      style={[
        s.panel,
        {
          backgroundColor: bg,
          borderTopColor: borderColor,
          paddingBottom: 18 + bottomInset,
        },
      ]}
    >
      <Animated.View style={[s.panelTop, rowAnim]}>
        <View style={s.panelTitleRow}>
          <TwinoMascot size={56} pose={correct ? "correct" : "wrong"} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <ResultBadge ok={correct} color={accent} />
              <AppText
                languageCode={uiLanguage}
                style={[s.panelTitle, { color: accent }]}
              >
                {title}
              </AppText>
            </View>
          </View>
        </View>

        <View style={s.panelIcons}>
          <ShareGlyph color={accent} />
          <FlagGlyph color={accent} />
        </View>
      </Animated.View>

      {!correct && correctAnswer ? (
        <Animated.View style={[s.answerBlock, rowAnim]}>
          <AppText
            languageCode={uiLanguage}
            align="start"
            fullWidth
            style={[s.answerLabel, { color: accent }]}
          >
            {t("lessons.correctAnswerLabel")}
          </AppText>
          <AppText align="start" fullWidth style={[s.answerText, { color: accent }]}>
            {correctAnswer}
          </AppText>
        </Animated.View>
      ) : subtitle ? (
        <Animated.View style={[s.answerBlock, rowAnim]}>
          <AppText
            languageCode={uiLanguage}
            align="start"
            fullWidth
            style={[s.answerText, { color: accent }]}
          >
            {subtitle}
          </AppText>
        </Animated.View>
      ) : null}

      <Animated.View style={ctaWrapAnim}>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            onContinue();
          }}
          onPressIn={() => {
            depth.value = withSpring(RIM_PRESSED, DuoMotion.press);
            drop.value = withSpring(RIM - RIM_PRESSED, DuoMotion.press);
          }}
          onPressOut={() => {
            depth.value = withSpring(RIM, DuoMotion.release);
            drop.value = withSpring(0, DuoMotion.release);
          }}
          accessibilityRole="button"
        >
          <Animated.View
            style={[
              s.cta,
              s.panelCta,
              { backgroundColor: ctaFace, borderBottomColor: ctaRim },
              ctaAnim,
            ]}
          >
            <AppText
              style={s.ctaLabelOn}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              forceLatinFont
              latinRole="bold"
            >
              {label.toUpperCase()}
            </AppText>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────────────────── */

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
  },
  closeHit: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    flex: 1,
    height: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    minWidth: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  progressGloss: {
    position: "absolute",
    top: 3,
    left: 8,
    right: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.42)",
  },
  progressSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  heartsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  headingWrap: {
    /* See `promptRow` — the game root owns horizontal inset. */
    paddingTop: 2,
    paddingBottom: 16,
  },

  promptRow: {
    flexDirection: "row",
    alignItems: "center",
    /*
     * No horizontal padding: every game that renders a prompt already insets
     * its root by 16–20. Padding here too starved the bubble of ~32dp and was
     * the main reason short phrases wrapped onto three lines.
     */
    gap: PROMPT_GAP,
  },
  mascotShadow: {
    width: 52,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.07)",
    marginTop: -4,
  },
  bubbleWrap: { flex: 1, minWidth: 0 },
  bubble: {
    borderWidth: BUBBLE_BORDER,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: BUBBLE_PAD,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: BUBBLE_GAP,
    minHeight: 84,
  },
  bubbleRtl: {
    flexDirection: "row-reverse",
  },
  bubbleSpeaker: { marginTop: 1 },
  bubbleText: {
    flex: 1,
    fontSize: 21,
    lineHeight: 31,
    fontWeight: "600",
    fontFamily: "Rabar_044",
  },
  bubbleTail: {
    position: "absolute",
    top: 38,
    width: 15,
    height: 15,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  bubbleTailLtr: {
    left: -8,
    transform: [{ rotate: "45deg" }],
  },
  bubbleTailRtl: {
    right: -8,
    transform: [{ rotate: "225deg" }],
  },

  tile: {
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 15,
    borderWidth: 2,
    borderBottomWidth: RIM,
    alignItems: "center",
    justifyContent: "center",
  },
  tileSubtle: {
    borderWidth: 1,
  },
  tileStart: {
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tileTierRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  tileFlexLabel: { flex: 1 },
  tierBadge: {
    fontSize: 14,
    fontWeight: "800",
    fontFamily: "Rabar_044",
    flexShrink: 0,
  },

  rail: {
    height: 2,
    width: "100%",
    borderRadius: 1,
  },
  blank: {
    height: 3,
    borderRadius: 2,
  },

  cta: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: RIM,
  },
  ctaLabel: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
    fontFamily: "Rabar_044",
  },
  ctaLabelOn: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: "#FFFFFF",
    fontFamily: "Rabar_044",
  },

  panel: {
    paddingTop: 18,
    paddingHorizontal: 18,
    gap: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 24,
  },
  panelTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  panelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    fontFamily: "Rabar_044",
    flexShrink: 1,
  },
  panelIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  answerBlock: { gap: 3, marginTop: -4 },
  answerLabel: {
    fontSize: 19,
    fontWeight: "800",
    fontFamily: "Rabar_044",
  },
  answerText: {
    fontSize: 19,
    fontWeight: "600",
    lineHeight: 26,
    fontFamily: "Rabar_044",
  },
  panelCta: { marginTop: 2 },
});
