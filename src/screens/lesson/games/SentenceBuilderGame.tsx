/**
 * SentenceBuilderGame — iOS 26 Liquid Glass redesign.
 */

import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { SentenceBuilderQuestion } from "@/data/lesson-content";
import { GameSpace, Motion, Radius, Type, iOS } from "./game-design";
import { rtlBlock } from "./game-text";
import { GameScreenLayout } from "./GameScreenLayout";
import {
  LiquidEyebrow,
  LiquidPrimaryButton,
  LiquidWordChip,
  OptionState,
} from "./liquid-primitives";

type Props = {
  question: SentenceBuilderQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};
type FBState = "idle" | "correct" | "wrong";

type Placed = { word: string; id: string };

export default function SentenceBuilderGame({ question, onAnswer }: Props) {
  const [sentence, setSentence] = useState<Placed[]>([]);
  const [fb, setFb] = useState<FBState>("idle");
  const slotN = useRef(0);
  const firedRef = useRef(false);

  const dropAnim = useSharedValue(0);
  const dropStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      dropAnim.value,
      [0, 1, 2],
      ["rgba(255,255,255,0.18)", "rgba(48,209,88,0.18)", "rgba(255,69,58,0.18)"],
    ),
    borderColor: interpolateColor(
      dropAnim.value,
      [0, 1, 2],
      ["rgba(255,255,255,0.45)", iOS.systemGreen, iOS.systemRed],
    ),
  }));

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const supply: Record<string, number> = {};
  for (const w of question.wordBank) supply[w] = (supply[w] || 0) + 1;
  const used: Record<string, number> = {};
  for (const p of sentence) used[p.word] = (used[p.word] || 0) + 1;
  const slotUsed: boolean[] = (() => {
    const rem = { ...used };
    return question.wordBank.map(w => {
      if ((rem[w] || 0) > 0) { rem[w]--; return true; }
      return false;
    });
  })();

  const addWord = (w: string) => {
    if (fb !== "idle") return;
    if ((used[w] || 0) >= (supply[w] || 0)) return;
    const id = `s${slotN.current++}`;
    setSentence(p => [...p, { word: w, id }]);
  };
  const removeWord = (id: string) => {
    if (fb !== "idle") return;
    setSentence(p => p.filter(x => x.id !== id));
  };

  const check = () => {
    if (!sentence.length || fb !== "idle") return;
    const placed = sentence.map(p => p.word);
    const ok = placed.join(" ").toLowerCase() === question.correctWords.join(" ").toLowerCase();
    setFb(ok ? "correct" : "wrong");
    dropAnim.value = withTiming(ok ? 1 : 2, { duration: Motion.colorMs, easing: Motion.ease });

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-9, { duration: 38 }),
        withTiming(9, { duration: 38 }),
        withTiming(-5, { duration: 32 }),
        withTiming(5, { duration: 32 }),
        withTiming(0, { duration: 44, easing: Easing.out(Easing.quad) }),
      );
      setTimeout(() => {
        setFb("idle");
        dropAnim.value = withTiming(0, { duration: Motion.colorMs });
      }, 1100);
    } else {
      if (!firedRef.current) { firedRef.current = true; onAnswer(true); }
    }
  };

  const canCheck = sentence.length > 0 && fb === "idle";

  const placedState: OptionState =
    fb === "correct" ? "correct"
    : fb === "wrong" ? "wrong"
    : "selected";

  return (
    <GameScreenLayout
      header={
        <>
          <LiquidEyebrow>Word order</LiquidEyebrow>
          <Text style={s.prompt} numberOfLines={3}>{question.kurdishSentence}</Text>
        </>
      }
      bodyStyle={s.body}
      footer={
        <LiquidPrimaryButton
          label="CHECK"
          color={iOS.systemGreen}
          onPress={check}
          disabled={!canCheck}
        />
      }
    >
      <Animated.View style={[shakeStyle, s.dropWrap]}>
        <Animated.View style={[s.drop, dropStyle]}>
          {sentence.length > 0 && (
            <View style={s.dropContent}>
              {sentence.map(p => (
                <LiquidWordChip
                  key={p.id}
                  label={p.word}
                  state={placedState}
                  onPress={() => removeWord(p.id)}
                  size="sm"
                />
              ))}
            </View>
          )}
        </Animated.View>
      </Animated.View>

      <View style={s.bank}>
        {question.wordBank.map((w, i) => {
          if (slotUsed[i]) {
            return <LiquidWordChip key={`${w}-${i}`} label={w} ghost size="sm" />;
          }
          return (
            <LiquidWordChip
              key={`${w}-${i}`}
              label={w}
              state="idle"
              onPress={() => addWord(w)}
              size="sm"
            />
          );
        })}
      </View>
    </GameScreenLayout>
  );
}

const s = StyleSheet.create({
  body: {
    gap: GameSpace.gap,
  },
  prompt: {
    ...Type.title,
    color: "#FFFFFF",
    marginTop: 4,
    ...rtlBlock,
  },
  dropWrap: {
    flexShrink: 1,
  },
  drop: {
    minHeight: 64,
    maxHeight: 120,
    borderRadius: Radius.md,
    borderWidth: 1.4,
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
  },
  dropContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    flexShrink: 0,
  },
});
