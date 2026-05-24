/**
 * MultipleChoiceGame — iOS 26 Liquid Glass redesign.
 *
 * Flow:
 *   1. Tap option → option turns blue (selected, can change mind)
 *   2. Tap CHECK → reveal correct (green) / wrong (red, also highlight correct)
 *   3. Auto-continue after a delay long enough to read the answer
 */

import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { MultipleChoiceQuestion } from "@/data/lesson-content";
import { crossTextShadow } from "@/utils/shadows";
import { Type, iOS } from "./game-design";
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

const REVEAL_DELAY_MS = 0;

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
    // Fire immediately — the LessonScreen feedback sheet handles the pause
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

  return (
    <View style={s.root}>
      {/* Eyebrow */}
      <Animated.View entering={FadeInDown.duration(260)} style={s.eyebrowRow}>
        <LiquidEyebrow>Multiple Choice</LiquidEyebrow>
      </Animated.View>

      {/* Question card */}
      <Animated.View
        entering={FadeInUp.delay(80).springify().damping(20).stiffness(140)}
      >
        <LiquidCard
          style={[
            s.questionCard,
            question.promptLang === "ku"
              ? { paddingLeft: 92, paddingRight: 22 }
              : { paddingRight: 92 },
          ]}
        >
          <Text
            style={[
              s.questionText,
              question.promptLang === "ku" && s.questionTextRTL,
              crossTextShadow({ color: "rgba(0,0,0,0.04)", offsetY: 1, blur: 1 }),
            ]}
          >
            {question.prompt}
          </Text>

          <View
            style={[
              s.mascotWrap,
              question.promptLang === "ku" ? s.mascotWrapLeft : s.mascotWrapRight,
            ]}
            pointerEvents="none"
          >
            <Image
              source={{
                uri: "https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/WN31PESNqnk/components/Pf9EJxsRI9K.png",
              }}
              style={s.mascotImg}
              contentFit="contain"
            />
          </View>
        </LiquidCard>
      </Animated.View>

      {/* Options */}
      <View style={s.options}>
        {question.options.map((opt, i) => (
          <Animated.View
            key={opt}
            entering={FadeInDown.delay(160 + i * 60).springify().damping(18).stiffness(180)}
          >
            <LiquidOption
              text={opt}
              state={getState(opt)}
              onPress={() => pick(opt)}
              disabled={revealed}
              index={i}
            />
          </Animated.View>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      {/* CHECK button */}
      <View style={s.checkWrap}>
        <LiquidPrimaryButton
          label="CHECK"
          color={iOS.systemGreen}
          onPress={check}
          disabled={!selected || revealed}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 18,
  },
  eyebrowRow: {
    paddingLeft: 4,
  },
  questionCard: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 26,
    minHeight: 110,
    justifyContent: "center",
  },
  questionText: {
    ...Type.display,
    color: "#0F172A",
  },
  questionTextRTL: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  mascotWrap: {
    position: "absolute",
    top: -32,
    width: 120,
    height: 120,
  },
  mascotWrapRight: {
    right: -12,
  },
  mascotWrapLeft: {
    left: -12,
    transform: [{ scaleX: -1 }],
  },
  mascotImg: {
    width: "100%",
    height: "100%",
  },
  options: {
    gap: 12,
  },
  checkWrap: {
    paddingTop: 8,
  },
});
