/* eslint-disable */
/**
 * ListenBuildGame — Duolingo-style audio sentence builder ("Tap what you hear").
 *
 * The audio counterpart to SentenceBuilderGame:
 * - Pure listening prompt with Headset Mascot, standard speed audio & turtle/slow replay
 * - Built on @jamsch/react-native-duo-drag-drop powered by React Native Gesture Handler
 *   and React Native Reanimated.
 * - 60fps interactive drag-and-drop word placement & live gap reordering
 * - Instant tap-to-place and tap-to-return
 * - Duolingo 3D depth word tiles (Light & Dark theme)
 * - Notebook-style ruled answer rails
 * - Word bank placeholders for lifted words
 * - RTL layout support for Kurdish & Arabic
 * - Real-time word speech via TTS on placement
 * - Tactile haptic feedback
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import DuoDragDrop, {
  type DuoAnimatedStyleWorklet,
  type DuoDragDropRef,
} from "@jamsch/react-native-duo-drag-drop";

import { TwinoMascot } from "../../../components/mascot/TwinoMascot";
import { AppText } from "../../../components/ui/AppText";
import type { ListenBuildQuestion, LessonPathMode } from "../../../data/types";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { getLanguageDirection } from "../../../i18n/direction";
import { useWordSpeech } from "./use-word-speech";
import {
  LightCheckButton,
  LightGameHeading,
  LightWordTile,
  type LightTileState,
} from "./lesson-light-primitives";
import {
  GameFooter,
  GameHeader,
  GameRoot,
} from "./GameAnimatedShell";
import { Duo, DuoMotion, L } from "./lesson-light-design";

type Props = {
  question: ListenBuildQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
};

type FBState = "idle" | "correct" | "wrong";

const TILE_HEIGHT = 48;
const TILE_GAP = 8;
const LINE_HEIGHT = 62;
const BANK_OFFSET_Y = 24;
const NATIVE_PHYSICAL_LAYOUT =
  Platform.OS === "web" ? undefined : ({ direction: "ltr" } as const);
const SLOW_RATE = 0.45;

function getSeededShuffle(words: string[], seedStr: string): string[] {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = seedStr.charCodeAt(i) + ((seed << 5) - seed);
  }
  const a = [...words];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SpeakerGlyph({ color, size = 32 }: { color: string; size?: number }) {
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

function TurtleGlyph({ color, size = 32 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.5 15.5h13a5.5 5.5 0 00-5.5-5.5H9a5.5 5.5 0 00-5.5 5.5z"
        fill={color}
      />
      <Path d="M17 12.6c.9-.5 2-.3 2.6.5.5.8.3 1.9-.6 2.4" fill={color} />
      <Path d="M6 16.4l-.7 1.8M13.6 16.4l.7 1.8" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path
        d="M17.6 13.2h1.9M17.6 15h1.4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function AudioButton({
  onPress,
  slow,
  disabled,
  label,
  isPlaying,
  isDark,
  colors,
}: {
  onPress: () => void;
  slow?: boolean;
  disabled?: boolean;
  label: string;
  isPlaying?: boolean;
  isDark?: boolean;
  colors?: any;
}) {
  const scale = useSharedValue(1);
  const pulseWave = useSharedValue(0);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulseRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulseWave.value, [0, 1], [0.95, 1.35]) }],
    opacity: interpolate(pulseWave.value, [0, 0.4, 1], [0, 0.45, 0]),
  }));

  useEffect(() => {
    if (isPlaying) {
      pulseWave.value = withRepeat(
        withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      );
    } else {
      pulseWave.value = withTiming(0, { duration: 150 });
    }
  }, [isPlaying, pulseWave]);

  useEffect(() => () => {
    cancelAnimation(scale);
    cancelAnimation(pulseWave);
  }, [scale, pulseWave]);

  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withSequence(
          withTiming(1.12, { duration: 90, easing: Easing.out(Easing.quad) }),
          withSpring(1, DuoMotion.pop),
        );
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      style={({ pressed }) => [
        s.audioBtn,
        {
          backgroundColor: isDark ? (colors?.surfaceRaised ?? "#1E293B") : Duo.snow,
          borderColor: isDark ? (colors?.border ?? "#334155") : Duo.border,
          borderBottomColor: isDark ? (colors?.border ?? "#334155") : Duo.borderDark,
          transform: [{ translateY: pressed ? 2 : 0 }],
          borderBottomWidth: pressed ? 2 : 4,
        },
        slow && s.audioBtnSlow,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          s.audioPulseRing,
          { borderColor: slow ? "#F59E0B" : Duo.accent },
          pulseRingStyle,
        ]}
      />
      <Animated.View style={anim}>
        {slow ? (
          <TurtleGlyph color="#F59E0B" size={32} />
        ) : (
          <SpeakerGlyph color={Duo.accent} size={34} />
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function ListenBuildGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isNormal = pathMode === "normal" || !pathMode;
  const targetDirection = getLanguageDirection(question.targetLanguage);
  const isRtl = targetDirection === "rtl";

  const speechLanguage = question.targetLanguage ?? "en";
  const { speak, speakWord, stop, speaking } = useWordSpeech(speechLanguage);

  const fullSentence = useMemo(
    () => (question.sentence?.trim() || question.correctWords.join(" ")),
    [question.sentence, question.correctWords],
  );

  const shuffledWordBank = useMemo(() => {
    const seed = question.sentence || question.correctWords.join(" ");
    return getSeededShuffle(question.wordBank, seed);
  }, [question.wordBank, question.sentence, question.correctWords]);

  const duoRef = useRef<DuoDragDropRef>(null);
  const [answeredWords, setAnsweredWords] = useState<string[]>([]);
  const [answeredIndices, setAnsweredIndices] = useState<Set<number>>(new Set());
  const [fb, setFb] = useState<FBState>("idle");
  const [activeSpeechMode, setActiveSpeechMode] = useState<"normal" | "slow" | null>(null);
  const [audioGivenUp, setAudioGivenUp] = useState(false);

  const wrongShakeX = useSharedValue(0);
  const wrongShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: wrongShakeX.value }],
  }));

  const completedRef = useRef(false);
  const wrongSentRef = useRef(false);

  const playAudio = useCallback(
    (slow?: boolean) => {
      setActiveSpeechMode(slow ? "slow" : "normal");
      speak(fullSentence, speechLanguage, undefined, {
        provider: "device",
        ...(slow ? { rate: SLOW_RATE } : {}),
        onDone: () => setActiveSpeechMode(null),
      });
    },
    [fullSentence, speak, speechLanguage],
  );

  useEffect(() => {
    void stop();
    setAnsweredWords([]);
    setAnsweredIndices(new Set());
    setFb("idle");
    setAudioGivenUp(false);
    wrongSentRef.current = false;
    completedRef.current = false;
    playAudio(false);
  }, [question, playAudio, stop]);

  useEffect(() => () => {
    void stop();
  }, [stop]);

  const handleDrop = useCallback(
    (event: { index: number; destination: "answered" | "bank"; position: number }) => {
      if (fb === "wrong") setFb("idle");

      const word = shuffledWordBank[event.index];

      if (event.destination === "answered") {
        if (word) {
          speakWord(word, `listen-word-${event.index}`);
        }
        if (Platform.OS !== "web") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        if (Platform.OS !== "web") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }

      if (duoRef.current) {
        const currentAnswered = duoRef.current.getAnsweredWords();
        setAnsweredWords([...currentAnswered]);
        const offsets = duoRef.current.getOffsets();
        const nextIndices = new Set<number>();
        offsets.forEach((ord, idx) => {
          if (ord !== -1) nextIndices.add(idx);
        });
        setAnsweredIndices(nextIndices);
      }
    },
    [fb, shuffledWordBank, speakWord],
  );

  const handleWordTap = useCallback(
    (index: number) => {
      if (fb !== "idle") return;
      if (!duoRef.current) return;

      const offsets = duoRef.current.getOffsets();
      const currentOrder = offsets[index];
      const nextOffsets = [...offsets];
      let destination: "answered" | "bank";
      let position: number;

      if (currentOrder === -1) {
        const placedCount = offsets.filter((o) => o !== -1).length;
        nextOffsets[index] = placedCount;
        destination = "answered";
        position = placedCount;
      } else {
        nextOffsets[index] = -1;
        const remaining = nextOffsets
          .map((o, idx) => ({ order: o, idx }))
          .filter((x) => x.order !== -1)
          .sort((a, b) => a.order - b.order);
        remaining.forEach((item, newOrd) => {
          nextOffsets[item.idx] = newOrd;
        });
        destination = "bank";
        position = -1;
      }

      duoRef.current.setOffsets(nextOffsets);
      handleDrop({ index, destination, position });
    },
    [fb, handleDrop],
  );

  const check = () => {
    const currentWords =
      duoRef.current?.getAnsweredWords()?.length
        ? duoRef.current.getAnsweredWords()
        : answeredWords;

    if (!currentWords.length || fb !== "idle") return;

    const userSentence = currentWords.join(" ").trim().toLowerCase();
    const expectedSentence = question.correctWords.join(" ").trim().toLowerCase();
    const ok = userSentence === expectedSentence;

    setFb(ok ? "correct" : "wrong");

    if (!ok) {
      wrongShakeX.value = withSequence(
        withTiming(-2, { duration: 20 }),
        withTiming(2, { duration: 20 }),
        withTiming(-1, { duration: 20 }),
        withTiming(1, { duration: 20 }),
        withTiming(0, { duration: 20, easing: Easing.out(Easing.quad) }),
      );
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      if (!wrongSentRef.current) {
        wrongSentRef.current = true;
        onAnswer(false);
      }
    } else if (!completedRef.current) {
      completedRef.current = true;
      speakWord(fullSentence, "listen-builder-success");
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onAnswer(true);
    }
  };

  const canCheck = answeredWords.length > 0 && fb === "idle";
  const railColor = isDark ? colors.border : Duo.rail;
  const bubbleFace = isDark ? colors.surfaceRaised : Duo.surface;
  const bubbleBorder = isDark ? colors.border : Duo.border;

  const animatedStyleWorklet: DuoAnimatedStyleWorklet = useCallback(
    (style, isGestureActive) => {
      "worklet";
      if (isGestureActive) {
        return {
          ...style,
          zIndex: 999,
          transform: [
            ...(style.transform || []),
            { scale: 1.05 },
            { translateY: 2 },
          ],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.22,
          shadowRadius: 6,
          elevation: 8,
        };
      }
      return style;
    },
    [],
  );

  const renderWord = useCallback(
    (word: string, index: number) => {
      const isAnswered = answeredIndices.has(index);
      let tileState: LightTileState = "idle";
      if (isAnswered) {
        if (fb === "correct") tileState = "correct";
        else if (fb === "wrong") tileState = "wrong";
        else tileState = "pending";
      }

      return (
        <View
          style={[s.wordTileCell, NATIVE_PHYSICAL_LAYOUT && s.nativeWordTileCell]}
          collapsable={false}
          pointerEvents={Platform.OS === "web" ? "auto" : "none"}
        >
          <LightWordTile
            label={word}
            state={tileState}
            languageCode={question.targetLanguage}
            isKids={pathMode === "kids"}
            duoDepthStyle="subtle"
            disabled={fb !== "idle"}
            onPress={() => handleWordTap(index)}
            fitLabel
            fitLabelLines={1}
            labelLines={1}
            style={isNormal ? s.duoWordTile : s.wordTile}
          />
        </View>
      );
    },
    [answeredIndices, fb, handleWordTap, isNormal, pathMode, question.targetLanguage],
  );

  const renderLines = useCallback(
    ({ numLines, containerHeight, lineHeight }: { numLines: number; containerHeight: number; lineHeight: number }) => {
      const count = Math.max(2, numLines);
      return (
        <View style={[s.duoAnswerArea, { height: containerHeight }]} pointerEvents="none">
          {Array.from({ length: count }).map((_, idx) => (
            <View
              key={`rail-${idx}`}
              style={[
                s.duoRail,
                {
                  top: (idx + 1) * lineHeight - 6,
                  backgroundColor: railColor,
                },
              ]}
            />
          ))}
        </View>
      );
    },
    [railColor],
  );

  const renderPlaceholder = useCallback(
    ({ style }: { style: { position: "absolute"; height: number; top: number; left: number; width: number } }) => (
      <View
        style={[
          s.bankPlaceholder,
          style,
          Platform.OS === "web" && {
            left: style.left - TILE_GAP,
            width: style.width + TILE_GAP * 2,
          },
          {
            backgroundColor: isDark ? colors.surface : L.bgSoft,
            borderColor: isDark ? colors.border : L.slotDash,
          },
        ]}
      />
    ),
    [colors, isDark],
  );

  return (
    <GameRoot style={{ flex: 1 }}>
      <View style={s.root}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <GameHeader>
            <LightGameHeading
              title={t("lessons.listenBuild") || "Listen and build the sentence"}
            />
          </GameHeader>

          <View style={s.exerciseArea}>
            {/* Audio prompt card: Normal speed + Turtle slow speed + Headset Twino mascot */}
            <View style={s.promptRow}>
              <View style={s.bubbleWrap}>
                <View
                  style={[
                    s.bubble,
                    { backgroundColor: bubbleFace, borderColor: bubbleBorder },
                  ]}
                >
                  <AudioButton
                    onPress={() => playAudio(false)}
                    label={t("lessons.listenLabel") || "Listen"}
                    isPlaying={speaking && activeSpeechMode === "normal"}
                    isDark={isDark}
                    colors={colors}
                  />
                  <View style={[s.audioSplit, { backgroundColor: bubbleBorder }]} />
                  <AudioButton
                    onPress={() => playAudio(true)}
                    slow
                    label={t("lessons.listenSlow") || "Listen slowly"}
                    isPlaying={speaking && activeSpeechMode === "slow"}
                    isDark={isDark}
                    colors={colors}
                  />
                </View>
              </View>

              <View style={s.mascotCol}>
                <TwinoMascot size={112} pose="headset" />
              </View>
            </View>

            <Animated.View style={[s.duoContainer, NATIVE_PHYSICAL_LAYOUT, wrongShakeStyle]}>
              <DuoDragDrop
                key={`listen-build-${fullSentence}-${shuffledWordBank.join("-")}`}
                ref={duoRef}
                words={shuffledWordBank}
                wordHeight={TILE_HEIGHT}
                wordGap={TILE_GAP}
                lineHeight={LINE_HEIGHT}
                wordBankOffsetY={BANK_OFFSET_Y}
                rtl={isRtl}
                gesturesDisabled={fb !== "idle"}
                animatedStyleWorklet={animatedStyleWorklet}
                renderWord={renderWord}
                renderLines={renderLines}
                renderPlaceholder={renderPlaceholder}
                onDrop={handleDrop}
                extraData={{
                  fb,
                  answeredCount: answeredWords.length,
                  answeredIndices: Array.from(answeredIndices).join(","),
                }}
              />
            </Animated.View>

            {/* Can't listen now escape hatch */}
            {fb === "idle" && (
              <Pressable
                testID="cant-listen-btn"
                onPress={() => setAudioGivenUp(true)}
                accessibilityRole="button"
                accessibilityLabel={t("lessons.cantListenNow") || "Can't listen now"}
                style={s.cantListenWrap}
              >
                <AppText style={[s.cantListen, { color: colors.mutedForeground }]}>
                  {audioGivenUp ? fullSentence : (t("lessons.cantListenNow") || "Can't listen now")}
                </AppText>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </View>

      <GameFooter delay={200}>
        <View
          style={[
            s.footerWrap,
            { backgroundColor: colors.background, borderTopColor: colors.border },
            pathMode === "kids" && { backgroundColor: "transparent", borderTopWidth: 0 },
            isNormal && s.footerWrapDuo,
          ]}
        >
          <LightCheckButton
            label={t("lessons.check")}
            onPress={check}
            disabled={!canCheck}
            variant={pathMode === "kids" ? "kids" : "default"}
          />
        </View>
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  exerciseArea: {
    flex: 1,
    minHeight: 400,
  },
  promptRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  bubbleWrap: {
    flex: 1,
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    gap: 12,
  },
  audioSplit: {
    width: 2,
    height: 36,
    borderRadius: 1,
    opacity: 0.5,
  },
  audioBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Duo.snow,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: Duo.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  audioBtnSlow: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Duo.snow,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: Duo.border,
  },
  audioPulseRing: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 22,
    borderWidth: 2.5,
  },
  mascotCol: {
    alignItems: "center",
    justifyContent: "center",
  },
  duoContainer: {
    flex: 1,
    marginTop: 12,
    minHeight: 320,
  },
  duoAnswerArea: {
    width: "100%",
    position: "relative",
  },
  duoRail: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  wordTileCell: {
    height: TILE_HEIGHT,
    justifyContent: "center",
  },
  nativeWordTileCell: {
    marginHorizontal: TILE_GAP,
    marginBottom: TILE_GAP * 2,
  },
  duoWordTile: {
    height: TILE_HEIGHT,
    minHeight: TILE_HEIGHT,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  wordTile: {
    minHeight: 42,
    maxWidth: 156,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bankPlaceholder: {
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  cantListenWrap: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  cantListen: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Rabar_044",
    textAlign: "center",
  },
  footerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: L.bg,
    borderTopWidth: 1,
    borderTopColor: L.border,
  },
  footerWrapDuo: {
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
});
