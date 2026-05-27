/**
 * SentenceBuilderGame — Premium light UI ("Order the words").
 */

import { useI18n } from "@/hooks/useI18n";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { SentenceBuilderQuestion } from "@/data/lesson-content";
import { L, LightMotion } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightHintButton,
  LightPromptCard,
  LightWordTile,
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

type Placed = { word: string; id: string };
type FBState = "idle" | "correct" | "wrong";

export default function SentenceBuilderGame({ question, onAnswer }: Props) {
  const { t } = useI18n();
  const [sentence, setSentence] = useState<Placed[]>([]);
  const [fb, setFb] = useState<FBState>("idle");
  const slotN = useRef(0);
  const firedRef = useRef(false);
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const englishHint = question.correctWords.join(" ");
  const slotCount = question.correctWords.length;

  const supply: Record<string, number> = {};
  for (const w of question.wordBank) supply[w] = (supply[w] || 0) + 1;
  const used: Record<string, number> = {};
  for (const p of sentence) used[p.word] = (used[p.word] || 0) + 1;

  const bankUsed = (() => {
    const rem = { ...used };
    return question.wordBank.map((w) => {
      if ((rem[w] || 0) > 0) {
        rem[w]--;
        return true;
      }
      return false;
    });
  })();

  const addWord = (w: string) => {
    if (fb !== "idle") return;
    if ((used[w] || 0) >= (supply[w] || 0)) return;
    if (sentence.length >= slotCount) return;
    const id = `s${slotN.current++}`;
    setSentence((p) => [...p, { word: w, id }]);
  };

  const removeFromSlot = (index: number) => {
    if (fb !== "idle") return;
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
      setTimeout(() => {
        setFb("idle");
      }, 1100);
    } else if (!firedRef.current) {
      firedRef.current = true;
      onAnswer(true);
    }
  };

  const slotTileState = (index: number): "idle" | "selected" | "correct" | "wrong" | "ghost" => {
    if (index >= sentence.length) return "ghost";
    if (fb === "correct") return "correct";
    if (fb === "wrong") return "wrong";
    return "selected";
  };

  const canCheck = sentence.length > 0 && fb === "idle";

  return (
    <GameRoot style={s.root}>
      <GameHeader>
        <LightGameHeading
          title={t("lessons.orderWords")}
          subtitle={t("lessons.orderWordsSub")}
        />
      </GameHeader>

      <LightPromptCard
        kurdish={question.kurdishSentence}
        english={englishHint}
      />

      <View style={s.bank}>
        {question.wordBank.map((w, i) => (
          <LightWordTile
            key={`${w}-${i}`}
            label={w}
            state={bankUsed[i] ? "ghost" : "idle"}
            onPress={() => addWord(w)}
            disabled={bankUsed[i] || fb !== "idle"}
          />
        ))}
      </View>

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

      <View style={{ flex: 1, minHeight: 8 }} />

      <GameFooter delay={200}>
        <LightHintButton />
        <View style={{ height: 12 }} />
        <LightCheckButton
          label={t("lessons.check")}
          onPress={check}
          disabled={!canCheck}
        />
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 18,
  },
  bank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  slotsWrap: {
    paddingVertical: 4,
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
