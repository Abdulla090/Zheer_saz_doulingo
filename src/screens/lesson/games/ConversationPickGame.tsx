/**
 * ConversationPickGame — iOS 26 Liquid Glass redesign.
 *
 * Flow: tap response → CHECK to confirm → reveal pause → continue.
 */

import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Icon3DMessage, Icon3DTarget } from "@/components/icons/Icon3D";
import { ConversationPickQuestion } from "@/data/lesson-content";
import { Type, iOS } from "./game-design";
import {
    LiquidCard,
    LiquidEyebrow,
    LiquidOption,
    LiquidPill,
    LiquidPrimaryButton,
    OptionState,
} from "./liquid-primitives";

type Props = {
  question: ConversationPickQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

const REVEAL_DELAY_MS = 0;

export default function ConversationPickGame({ question, onAnswer }: Props) {
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
    const ok = selected === question.correctAnswer;
    if (!firedRef.current) {
      firedRef.current = true;
      onAnswer(ok, question.explanation);
    }
  };

  const getState = (opt: string): OptionState => {
    if (!revealed) return opt === selected ? "selected" : "idle";
    if (opt === selected) return opt === question.correctAnswer ? "correct" : "wrong";
    if (opt === question.correctAnswer && selected !== question.correctAnswer) return "showCorrect";
    return "idle";
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.root}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(260)}>
          <LiquidEyebrow>Conversation</LiquidEyebrow>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(60).springify().damping(20).stiffness(180)}
          style={s.situationRow}
        >
          <LiquidPill tint="dark" height={36} paddingHorizontal={14}>
            <Icon3DTarget size={14} />
            <Text style={s.situationText} numberOfLines={2}>
              {question.situation}
            </Text>
          </LiquidPill>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(140).springify().damping(20).stiffness(160)}
          style={s.bubbleRow}
        >
          <View style={s.avatar}>
            <Icon3DMessage size={26} />
          </View>
          <View style={{ flex: 1 }}>
            <LiquidCard style={s.bubble}>
              <Text style={s.bubbleLabel}>THEY SAY</Text>
              <Text style={s.bubbleText}>{question.theyAsk}</Text>
            </LiquidCard>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(240)}>
          <LiquidEyebrow>Choose the best response</LiquidEyebrow>
        </Animated.View>

        <View style={s.options}>
          {question.options.map((opt, i) => (
            <Animated.View
              key={opt}
              entering={FadeInDown.delay(300 + i * 70).springify().damping(18).stiffness(180)}
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
      </ScrollView>

      {/* CHECK button (sticky bottom) */}
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
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 16,
  },
  situationRow: {
    flexDirection: "row",
  },
  situationText: {
    ...Type.caption,
    color: "#FFFFFF",
    flexShrink: 1,
    writingDirection: "rtl",
    textAlign: "right",
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: iOS.systemBlue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    marginTop: 6,
  },
  bubble: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    borderTopLeftRadius: 8,
  },
  bubbleLabel: {
    ...Type.eyebrow,
    color: iOS.systemBlue,
    marginBottom: 4,
  },
  bubbleText: {
    ...Type.title,
    color: "#0F172A",
  },
  options: {
    gap: 12,
  },
  checkWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
});
