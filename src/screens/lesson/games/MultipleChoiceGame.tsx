/**
 * MultipleChoiceGame — iOS 26 Liquid Glass redesign.
 */

import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { MultipleChoiceQuestion } from "@/data/lesson-content";
import { crossTextShadow } from "@/utils/shadows";
import { Radius, Type, iOS } from "./game-design";
import { rtlBlock } from "./game-text";
import {
  GameCard,
  GameFooter,
  GameHeader,
  GameOption,
  GameRoot,
} from "./GameAnimatedShell";
import {
  LiquidCard,
  LiquidEyebrow,
  LiquidOption,
  LiquidPrimaryButton,
  OptionState,
} from "./liquid-primitives";

type Props = {
  question: MultipleChoiceQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

export default function MultipleChoiceGame({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);

  const pick = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
  };

  const check = () => {
    if (!selected || revealed) return;
    setRevealed(true);
    const correct = selected === question.correctAnswer;
    if (!firedRef.current) {
      firedRef.current = true;
      onAnswer(correct);
    }
  };

  const getState = (opt: string): OptionState => {
    if (!revealed) return opt === selected ? "selected" : "idle";
    if (opt === selected) return opt === question.correctAnswer ? "correct" : "wrong";
    if (opt === question.correctAnswer && selected !== question.correctAnswer) {
      return "showCorrect";
    }
    return "idle";
  };

  const isKuPrompt = question.promptLang === "ku";

  return (
    <GameRoot style={s.root}>
      <GameHeader>
        <LiquidEyebrow hint="Select the best answer">Multiple Choice</LiquidEyebrow>
      </GameHeader>

      <GameCard>
        <LiquidCard style={s.questionCard} radius={Radius.xl}>
          <LinearGradient
            colors={["rgba(10,132,255,0.12)", "rgba(10,132,255,0)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={s.questionAccent}
            pointerEvents="none"
          />
          <Text
            style={[
              s.questionText,
              isKuPrompt && rtlBlock,
              crossTextShadow({ color: "rgba(0,0,0,0.03)", offsetY: 1, blur: 1 }),
            ]}
          >
            {question.prompt}
          </Text>
        </LiquidCard>
      </GameCard>

      <View style={s.options}>
        {question.options.map((opt, i) => (
          <GameOption key={opt} index={i}>
            <LiquidOption
              text={opt}
              state={getState(opt)}
              onPress={() => pick(opt)}
              disabled={revealed}
              index={i}
            />
          </GameOption>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <GameFooter>
        <LiquidPrimaryButton
          label="CHECK"
          color={iOS.systemGreen}
          onPress={check}
          disabled={!selected || revealed}
        />
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 12,
    gap: 20,
  },
  questionCard: {
    paddingHorizontal: 24,
    paddingVertical: 26,
    minHeight: 108,
    justifyContent: "center",
  },
  questionAccent: {
    position: "absolute",
    left: 0,
    top: 18,
    bottom: 18,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  questionText: {
    ...Type.display,
    fontSize: 24,
    lineHeight: 32,
    color: "#0F172A",
  },
  options: {
    gap: 10,
  },
});
