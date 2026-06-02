/**
 * SentenceBuilderGame — Premium light UI ("Order the words").
 */

import { useI18n } from "@/hooks/useI18n";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { SentenceBuilderQuestion } from "@/data/lesson-content";
import { L } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightHintButton,
  LightQuestionPrompt,
  LightWordTile,
  type LightTileState,
} from "./lesson-light-primitives";
import {
  GameFooter,
  GameHeader,
  GameRoot,
} from "./GameAnimatedShell";

type Props = {
  question: SentenceBuilderQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

type Placed = { word: string; id: string; bankIndex: number };
type FBState = "idle" | "correct" | "wrong";

export default function SentenceBuilderGame({ question, onAnswer }: Props) {
  const { t } = useI18n();
  const [sentence, setSentence] = useState<Placed[]>([]);
  const [usedBank, setUsedBank] = useState(() =>
    question.wordBank.map(() => false),
  );
  const [fb, setFb] = useState<FBState>("idle");
  const slotN = useRef(0);
  const completedRef = useRef(false);
  const wrongSentRef = useRef(false);
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const slotCount = question.correctWords.length;

  const addWord = (bankIndex: number) => {
    if (fb === "wrong") setFb("idle");
    if (fb === "correct") return;
    if (usedBank[bankIndex]) return;
    if (sentence.length >= slotCount) return;
    const w = question.wordBank[bankIndex];
    const id = `s${slotN.current++}`;
    setUsedBank((prev) => {
      const next = [...prev];
      next[bankIndex] = true;
      return next;
    });
    setSentence((p) => [...p, { word: w, id, bankIndex }]);
  };

  const removeFromSlot = (index: number) => {
    if (fb === "correct") return;
    if (fb === "wrong") setFb("idle");
    const placed = sentence[index];
    if (!placed) return;
    setUsedBank((prev) => {
      const next = [...prev];
      next[placed.bankIndex] = false;
      return next;
    });
    setSentence((p) => p.filter((_, i) => i !== index));
  };

  const check = () => {
    if (!sentence.length || fb !== "idle") return;
    const placed = sentence.map((p) => p.word);
    const ok =
      placed.join(" ").toLowerCase() ===
      question.correctWords.join(" ").toLowerCase();
    setFb(ok ? "correct" : "wrong");

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 36 }),
        withTiming(8, { duration: 36 }),
        withTiming(-4, { duration: 30 }),
        withTiming(4, { duration: 30 }),
        withTiming(0, { duration: 40, easing: Easing.out(Easing.quad) }),
      );
      if (!wrongSentRef.current) {
        wrongSentRef.current = true;
        onAnswer(false);
      }
    } else if (!completedRef.current) {
      completedRef.current = true;
      onAnswer(true);
    }
  };

  const slotTileState = (index: number): LightTileState => {
    if (index >= sentence.length) return "ghost";
    if (fb === "correct") return "correct";
    if (fb === "wrong") return "wrong";
    return "pending";
  };

  const canCheck = sentence.length > 0 && fb !== "correct";

  return (
    <GameRoot style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <GameHeader>
          <LightGameHeading
            title={t("lessons.orderWords")}
            subtitle={t("lessons.orderWordsSub")}
          />
        </GameHeader>

        <LightQuestionPrompt
          label={t("lessons.questionLabel")}
          forceKurdishFont
        >
          {question.kurdishSentence}
        </LightQuestionPrompt>

        <Animated.View style={[s.slotsWrap, shakeStyle]}>
          <View style={s.slotsRow}>
            {Array.from({ length: slotCount }).map((_, i) => {
              const placed = sentence[i];
              if (placed) {
                return (
                  <LightWordTile
                    key={placed.id}
                    label={placed.word}
                    state={slotTileState(i)}
                    onPress={() => removeFromSlot(i)}
                  />
                );
              }
              return (
                <View key={`slot-${i}`} style={s.emptySlot}>
                  <Text style={s.emptySlotText}> </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        <View style={s.bank}>
          {question.wordBank.map((w, i) => {
            const taken = usedBank[i];
            return (
              <View key={`bank-${i}`} style={s.bankCell}>
                {taken ? <View style={s.bankPlaceholder} pointerEvents="none" /> : null}
                <View
                  style={taken ? s.bankTileHidden : undefined}
                  pointerEvents={taken ? "none" : "auto"}
                >
                  <LightWordTile
                    label={w}
                    state="idle"
                    onPress={() => addWord(i)}
                    disabled={taken || fb !== "idle"}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <GameFooter delay={200}>
        <View style={s.footerWrap}>
          <LightHintButton />
          <View style={{ height: 12 }} />
          <LightCheckButton
            label={t("lessons.check")}
            onPress={check}
            disabled={!canCheck}
          />
        </View>
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 18,
  },
  footerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: L.bg,
    borderTopWidth: 1,
    borderTopColor: L.border,
  },
  bank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    paddingTop: 4,
  },
  bankCell: {
    position: "relative",
  },
  bankTileHidden: {
    opacity: 0,
  },
  bankPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
  },
  slotsWrap: {
    paddingVertical: 6,
  },
  slotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  emptySlot: {
    minWidth: 72,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
  },
  emptySlotText: {
    opacity: 0,
  },
});
