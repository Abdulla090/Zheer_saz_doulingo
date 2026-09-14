 
/**
 * SentenceBuilderGame — Duolingo-style sentence builder ("Order the words").
 *
 * Built on @jamsch/react-native-duo-drag-drop powered by React Native Gesture Handler
 * and React Native Reanimated. Supports:
 * - 60fps interactive drag-and-drop word placement & live gap reordering
 * - Instant tap-to-place and tap-to-return
 * - Duolingo 3D depth word tiles (Light & Dark theme)
 * - Notebook-style ruled answer rails
 * - Word bank placeholders for lifted words
 * - RTL layout support for Kurdish & Arabic
 * - Real-time word speech via TTS on placement
 * - Full sentence speech on completion
 * - Tactile haptic feedback
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import DuoDragDrop, {
  type DuoAnimatedStyleWorklet,
  type DuoDragDropRef,
} from "@jamsch/react-native-duo-drag-drop";

import { SentenceBuilderQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { getLanguageDirection } from "../../../i18n/direction";
import { useWordSpeech } from "./use-word-speech";
import {
  LightCheckButton,
  LightGameHeading,
  LightQuestionPrompt,
  LightWordTile,
  type LightTileState,
} from "./lesson-light-primitives";
import {
  GameFooter,
  GameHeader,
  GameRoot,
} from "./GameAnimatedShell";
import { Duo, L } from "./lesson-light-design";

type Props = {
  question: SentenceBuilderQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
};

type FBState = "idle" | "correct" | "wrong";

const TILE_HEIGHT = 48;
const TILE_GAP = 8;
const LINE_HEIGHT = 62;
const BANK_OFFSET_Y = 24;

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

export default function SentenceBuilderGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isNormal = pathMode === "normal" || !pathMode;
  const targetDirection = getLanguageDirection(question.targetLanguage);
  const isRtl = targetDirection === "rtl";
  const { speakWord, stop } = useWordSpeech(question.targetLanguage);

  const fullSentence = useMemo(
    () => question.correctWords.join(" "),
    [question.correctWords],
  );

  const shuffledWordBank = useMemo(() => {
    const seed = question.kurdishSentence || question.correctWords.join(" ");
    return getSeededShuffle(question.wordBank, seed);
  }, [question.wordBank, question.kurdishSentence, question.correctWords]);

  const duoRef = useRef<DuoDragDropRef>(null);
  const [answeredWords, setAnsweredWords] = useState<string[]>([]);
  const [answeredIndices, setAnsweredIndices] = useState<Set<number>>(new Set());
  const [fb, setFb] = useState<FBState>("idle");

  const wrongShakeX = useSharedValue(0);
  const wrongShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: wrongShakeX.value }],
  }));

  const completedRef = useRef(false);
  const wrongSentRef = useRef(false);

  useEffect(() => {
    void stop();
    setAnsweredWords([]);
    setAnsweredIndices(new Set());
    setFb("idle");
    wrongSentRef.current = false;
    completedRef.current = false;
  }, [question, stop]);

  useEffect(() => () => {
    void stop();
  }, [stop]);

  const handleDrop = useCallback(
    (event: { index: number; destination: "answered" | "bank"; position: number }) => {
      if (fb === "wrong") setFb("idle");

      const word = shuffledWordBank[event.index];

      if (event.destination === "answered") {
        if (word) {
          speakWord(word, `builder-word-${event.index}`);
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
      speakWord(fullSentence, "builder-sentence");
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onAnswer(true);
    }
  };

  const canCheck = answeredWords.length > 0 && fb === "idle";
  const railColor = isDark ? colors.border : Duo.rail;

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
          style={s.wordTileCell}
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
          {
            left: style.left - TILE_GAP,
            width: style.width + TILE_GAP * 2,
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
            <LightGameHeading title={t("lessons.orderWords")} />
          </GameHeader>

          <View style={s.exerciseArea}>
            <LightQuestionPrompt
              label={t("lessons.orderWords")}
              forceKurdishFont
              contentLanguageCode={question.sourceLanguage}
              speechText={fullSentence}
              speechLanguageCode={question.targetLanguage ?? "en"}
              variant={pathMode === "kids" ? "kids" : "default"}
            >
              {question.kurdishSentence}
            </LightQuestionPrompt>

            <Animated.View style={[s.duoContainer, wrongShakeStyle]}>
              <DuoDragDrop
                key={`sentence-builder-${question.kurdishSentence}-${shuffledWordBank.join("-")}`}
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
