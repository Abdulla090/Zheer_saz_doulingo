/**
 * FillBlankGame — iOS 26 Liquid Glass redesign.
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

import { FillBlankQuestion } from "@/data/lesson-content";
import { GameSpace, Motion, Radius, Type, iOS, Glass } from "./game-design";
import { ltrText, rtlBlock } from "./game-text";
import { GameScreenLayout } from "./GameScreenLayout";
import {
  LiquidCard,
  LiquidEyebrow,
  LiquidPrimaryButton,
  LiquidWordChip,
  OptionState,
} from "./liquid-primitives";

type Props = {
  question: FillBlankQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

export default function FillBlankGame({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const blankP = useSharedValue(0);
  const blankStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      blankP.value,
      [0, 1, 2, 3],
      [Glass.surfaceInner, "rgba(10,132,255,0.32)", iOS.systemGreen, iOS.systemRed],
    ),
    borderColor: interpolateColor(
      blankP.value,
      [0, 1, 2, 3],
      [Glass.border, iOS.systemBlue, iOS.systemGreen, iOS.systemRed],
    ),
  }));

  const blankTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      blankP.value,
      [0, 1, 2, 3],
      ["#94A3B8", iOS.blueDeep, "#FFFFFF", "#FFFFFF"],
    ) as any,
  }));

  const pick = (word: string) => {
    if (revealed) return;
    setSelected(word);
    blankP.value = withTiming(1, { duration: Motion.colorMs, easing: Motion.ease });
  };

  const check = () => {
    if (!selected || revealed) return;
    setRevealed(true);
    const ok = selected === question.correctAnswer;
    blankP.value = withTiming(ok ? 2 : 3, { duration: Motion.colorMs, easing: Motion.ease });

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-9, { duration: 38 }),
        withTiming(9, { duration: 38 }),
        withTiming(-5, { duration: 32 }),
        withTiming(5, { duration: 32 }),
        withTiming(0, { duration: 44, easing: Easing.out(Easing.quad) }),
      );
    }

    if (!firedRef.current) { firedRef.current = true; onAnswer(ok); }
  };

  const getState = (w: string): OptionState => {
    if (!revealed) return w === selected ? "selected" : "idle";
    if (w === selected) return w === question.correctAnswer ? "correct" : "wrong";
    return "idle";
  };

  return (
    <GameScreenLayout
      header={
        <>
          <LiquidEyebrow>Fill blank</LiquidEyebrow>
          <Text style={s.hint} numberOfLines={2}>{question.kurdishHint}</Text>
        </>
      }
      bodyStyle={s.body}
      footer={
        <LiquidPrimaryButton
          label="CHECK"
          color={iOS.systemGreen}
          onPress={check}
          disabled={!selected || revealed}
        />
      }
    >
      <Animated.View style={shakeStyle}>
        <LiquidCard style={s.sentenceCard} radius={Radius.lg}>
          <View style={s.sentenceRow}>
            {question.sentenceParts[0] ? (
              <Text style={s.sentenceText}>{question.sentenceParts[0]} </Text>
            ) : null}

            <Animated.View style={[s.blank, blankStyle]}>
              <Animated.Text style={[s.blankText, blankTextStyle]}>
                {selected || "___"}
              </Animated.Text>
            </Animated.View>

            {question.sentenceParts[1] ? (
              <Text style={s.sentenceText}> {question.sentenceParts[1]}</Text>
            ) : null}
          </View>
        </LiquidCard>
      </Animated.View>

      <View style={s.chipsWrap}>
        {question.options.map((w) => (
          <LiquidWordChip
            key={w}
            label={w}
            state={getState(w)}
            onPress={() => pick(w)}
            disabled={revealed}
            size="sm"
          />
        ))}
      </View>
    </GameScreenLayout>
  );
}

const s = StyleSheet.create({
  body: {
    gap: GameSpace.gap,
  },
  hint: {
    ...Type.title,
    color: "#FFFFFF",
    marginTop: 4,
    ...rtlBlock,
  },
  sentenceCard: {
    paddingHorizontal: GameSpace.cardPadH,
    paddingVertical: GameSpace.cardPadV,
    minHeight: 0,
    justifyContent: "center",
  },
  sentenceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  sentenceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 26,
    letterSpacing: -0.2,
    ...ltrText,
  },
  blank: {
    minWidth: 72,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderStyle: "dashed",
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  blankText: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
    ...ltrText,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
});
