import React, { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import { AppText } from "../../../components/ui/AppText";
import type { MultipleChoiceQuestion } from "../../../data/types";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { getLanguageDirection } from "../../../i18n/direction";
import { DirectionBoundary } from "../../../i18n/layout-direction";
import { hapticSelection } from "../../../utils/haptics";
import { GameFooter, GameRoot } from "./GameAnimatedShell";
import { LightCheckButton, LightGameHeading } from "./lesson-light-primitives";
import { useWordSpeech } from "./use-word-speech";
import { hintSelection, type WordRescuePuzzle } from "./word-rescue";

type Props = {
  question: MultipleChoiceQuestion;
  puzzle: WordRescuePuzzle;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
};

export default function WordRescueGame({ question, puzzle, onAnswer }: Props) {
  const { t, locale } = useI18n();
  const { colors } = useThemeColors();
  const [selected, setSelected] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const fired = useRef(false);
  const selectedRef = useRef<number[]>([]);
  const { speakWord, canSpeak } = useWordSpeech(question.targetLanguage);
  const language = question.targetLanguage ?? "en";
  const answer = selected.map(id => puzzle.tiles.find(tile => tile.id === id)!.letter).join("");
  const correct = answer === puzzle.letters.join("");
  const complete = selected.length === puzzle.letters.length;

  const update = (next: number[]) => {
    if (fired.current) return;
    selectedRef.current = next;
    setSelected(next);
    hapticSelection();
  };
  const pick = (id: number) => {
    const current = selectedRef.current;
    if (current.includes(id) || current.length >= puzzle.letters.length) return;
    update([...current, id]);
  };
  const check = () => {
    if (fired.current || selectedRef.current.length !== puzzle.letters.length) return;
    fired.current = true;
    setRevealed(true);
    const isCorrect = selectedRef.current.map(id => puzzle.tiles.find(tile => tile.id === id)!.letter).join("") === puzzle.letters.join("");
    onAnswer(isCorrect);
    if (isCorrect) speakWord(question.correctAnswer, "word-rescue-answer");
  };

  return (
    <GameRoot>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <LightGameHeading title={t("lessons.wordRescueTitle")} />
          <AppText languageCode={locale} style={[styles.instructions, { color: colors.mutedForeground }]}>
            {t("lessons.wordRescueInstruction")}
          </AppText>
        </View>
        <View style={[styles.prompt, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
          <AppText languageCode={question.promptLang || question.sourceLanguage} align="center" style={styles.promptText}>
            {question.prompt}
          </AppText>
        </View>
        <DirectionBoundary direction={getLanguageDirection(language)} style={styles.puzzle}>
          <AppText languageCode={language} align="center" style={styles.sentence}>
            {puzzle.before}{revealed ? puzzle.word : "＿".repeat(Math.min(puzzle.letters.length, 5))}{puzzle.after}
          </AppText>
          <View style={[styles.answer, { borderColor: revealed ? (correct ? colors.success : colors.error) : colors.border }]}>
            <AppText
              accessibilityLabel={t("lessons.wordRescueAnswer")}
              accessibilityLiveRegion="polite"
              languageCode={language} align="center"
              style={[styles.answerText, { color: revealed ? (correct ? colors.success : colors.error) : colors.foreground }]}
            >
              {answer || "…"}
            </AppText>
            <AppText languageCode="en" align="center" style={[styles.count, { color: colors.mutedForeground }]}>
              {selected.length} / {puzzle.letters.length}
            </AppText>
          </View>
        </DirectionBoundary>
        <DirectionBoundary direction={getLanguageDirection(language)} style={styles.bank}>
          {puzzle.tiles.map(tile => (
            <LetterTile key={tile.id} letter={tile.letter} language={language}
              disabled={revealed || selected.includes(tile.id) || complete}
              used={selected.includes(tile.id)} onPress={() => pick(tile.id)} />
          ))}
        </DirectionBoundary>
        <View style={styles.tools}>
          <Pressable accessibilityRole="button" disabled={revealed || !selected.length}
            accessibilityState={{ disabled: revealed || !selected.length }}
            onPress={() => update(selectedRef.current.slice(0, -1))}
            style={[styles.tool, { opacity: revealed || !selected.length ? 0.4 : 1 }]}>
            <AppText languageCode={locale} style={{ color: colors.primary }}>{t("lessons.wordRescueUndo")}</AppText>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={revealed || (complete && correct)}
            accessibilityState={{ disabled: revealed || (complete && correct) }}
            onPress={() => update(hintSelection(puzzle, selectedRef.current))}
            style={[styles.tool, { opacity: revealed || (complete && correct) ? 0.4 : 1 }]}>
            <AppText languageCode={locale} style={{ color: colors.primary }}>{t("lessons.wordRescueHint")}</AppText>
          </Pressable>
          {canSpeak ? (
            <Pressable accessibilityRole="button" onPress={() => speakWord(question.correctAnswer, "word-rescue-listen")} style={styles.tool}>
              <AppText languageCode={locale} style={{ color: colors.primary }}>{t("lessons.wordRescueListen")}</AppText>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
      <GameFooter style={styles.footer}>
        <LightCheckButton label={t("lessons.check")} onPress={check} disabled={!complete || revealed} />
      </GameFooter>
    </GameRoot>
  );
}

function LetterTile({ letter, language, disabled, used, onPress }: {
  letter: string; language: string; disabled: boolean; used: boolean; onPress: () => void;
}) {
  const { colors } = useThemeColors();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const motion = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const press = (value: number) => scale.set(reducedMotion ? 1 : withSpring(value, { duration: 150, dampingRatio: 1 }));
  return (
    <Animated.View style={motion}>
      <Pressable accessibilityRole="button" accessibilityLabel={letter}
        accessibilityState={{ disabled, selected: used }} disabled={disabled}
        onPressIn={() => press(0.96)} onPressOut={() => press(1)} onPress={onPress}
        style={[styles.tile, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, opacity: used ? 0.22 : 1 }]}>
        <AppText languageCode={language} align="center" latinRole="bold" style={styles.letter}>{letter}</AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, width: "100%", maxWidth: 680, alignSelf: "center", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, gap: 20 },
  heading: { gap: 8 },
  instructions: { fontSize: 15, lineHeight: 22 },
  prompt: { padding: 16, borderRadius: 16, borderCurve: "continuous", borderWidth: 1 },
  promptText: { fontSize: 19, lineHeight: 29 },
  puzzle: { gap: 16, width: "100%" },
  sentence: { fontSize: 23, lineHeight: 34 },
  answer: { minHeight: 86, padding: 12, borderBottomWidth: 2, justifyContent: "center", gap: 4 },
  answerText: { fontSize: 30, lineHeight: 42 },
  count: { fontSize: 12, fontVariant: ["tabular-nums"] },
  bank: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, width: "100%" },
  tile: { minWidth: 48, minHeight: 56, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderBottomWidth: 3, borderRadius: 12, borderCurve: "continuous", alignItems: "center", justifyContent: "center" },
  letter: { fontSize: 23, lineHeight: 32 },
  tools: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  tool: { minHeight: 48, paddingHorizontal: 12, justifyContent: "center" },
  footer: { paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
});
