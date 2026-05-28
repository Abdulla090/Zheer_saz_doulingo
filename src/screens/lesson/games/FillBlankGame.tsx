/**
 * FillBlankGame — Premium light lesson UI.
 */

import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { FillBlankQuestion } from "@/data/lesson-content";
import { ltrText, rtlBlock } from "./game-text";
import { GameFooter, GameHeader, GameRoot } from "./GameAnimatedShell";
import { L } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightSurfaceCard,
  LightWordTile,
  mapOptionState,
} from "./lesson-light-primitives";

type Props = {
  question: FillBlankQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

export default function FillBlankGame({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const pick = (word: string) => {
    if (revealed) return;
    setSelected(word);
  };

  const check = () => {
    if (!selected || revealed) return;
    setRevealed(true);
    const ok = selected === question.correctAnswer;

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 36 }),
        withTiming(8, { duration: 36 }),
        withTiming(0, { duration: 40, easing: Easing.out(Easing.quad) }),
      );
    }

    if (!firedRef.current) {
      firedRef.current = true;
      onAnswer(ok);
    }
  };

  const getState = (w: string) => {
    if (!revealed) return w === selected ? "selected" : "idle";
    if (w === selected) {
      return w === question.correctAnswer ? "correct" : "wrong";
    }
    if (
      w === question.correctAnswer &&
      selected !== question.correctAnswer
    ) {
      return "showCorrect";
    }
    return "idle";
  };

  const blankBorder =
    revealed && selected
      ? selected === question.correctAnswer
        ? L.green
        : L.red
      : selected
        ? L.blue
        : L.slotDash;

  return (
    <GameRoot style={s.root}>
      <GameHeader>
        <LightGameHeading
          title="Fill in the blank"
          subtitle="Pick the word that completes the sentence."
        />
      </GameHeader>

      <Text style={[s.hint, rtlBlock]}>{question.kurdishHint}</Text>

      <Animated.View style={shakeStyle}>
        <LightSurfaceCard>
          <View style={s.sentenceRow}>
            {question.sentenceParts[0] ? (
              <Text style={s.sentenceText}>{question.sentenceParts[0]} </Text>
            ) : null}
            <View style={[s.blank, { borderColor: blankBorder }]}>
              <Text style={s.blankText}>{selected || "____"}</Text>
            </View>
            {question.sentenceParts[1] ? (
              <Text style={s.sentenceText}> {question.sentenceParts[1]}</Text>
            ) : null}
          </View>
        </LightSurfaceCard>
      </Animated.View>

      <View style={s.chipsWrap}>
        {question.options.map((w) => (
          <LightWordTile
            key={w}
            label={w}
            state={mapOptionState(getState(w))}
            onPress={() => pick(w)}
            disabled={revealed}
          />
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <GameFooter>
        <LightCheckButton
          onPress={check}
          disabled={!selected || revealed}
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
    paddingBottom: 12,
    gap: 16,
  },
  hint: {
    fontSize: 18,
    fontWeight: "700",
    color: L.navy,
    fontFamily: "DINNextRoundedBold",
    ...rtlBlock,
  },
  sentenceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  sentenceText: {
    fontSize: 19,
    fontWeight: "700",
    color: L.navy,
    lineHeight: 28,
    fontFamily: "DINNextRoundedBold",
    ...ltrText,
  },
  blank: {
    minWidth: 88,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: L.bgSoft,
  },
  blankText: {
    fontSize: 17,
    fontWeight: "800",
    color: L.navy,
    fontFamily: "DINNextRoundedBold",
    ...ltrText,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
});
