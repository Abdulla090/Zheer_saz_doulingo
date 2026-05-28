/**
 * ConversationPickGame — iOS 26 Liquid Glass redesign.
 */

import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Icon3DMessage } from "@/components/icons/Icon3D";
import { ConversationPickQuestion } from "@/data/lesson-content";
import { GameSpace, Type, iOS } from "./game-design";
import { ltrText } from "./game-text";
import {
  GameCard,
  GameOption,
  GameRoot,
} from "./GameAnimatedShell";
import { GameScreenLayout } from "./GameScreenLayout";
import {
  LiquidCard,
  LiquidEyebrow,
  LiquidOption,
  LiquidPrimaryButton,
  OptionState,
} from "./liquid-primitives";

type Props = {
  question: ConversationPickQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

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
    return "idle";
  };

  return (
    <GameRoot style={{ flex: 1 }}>
      <GameScreenLayout
        header={<LiquidEyebrow>Reply</LiquidEyebrow>}
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
        <GameCard delay={60}>
          <View style={s.bubbleRow}>
            <View style={s.avatar}>
              <Icon3DMessage size={22} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <LiquidCard style={s.bubble} radius={16}>
                <Text style={s.bubbleText} numberOfLines={3}>{question.theyAsk}</Text>
              </LiquidCard>
            </View>
          </View>
        </GameCard>

        <View style={s.options}>
          {question.options.map((opt, i) => (
            <GameOption key={opt} index={i} baseDelay={100}>
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
      </GameScreenLayout>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  body: {
    gap: GameSpace.gap,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: iOS.systemBlue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    marginTop: 2,
    flexShrink: 0,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopLeftRadius: 6,
  },
  bubbleText: {
    ...Type.body,
    fontSize: 16,
    lineHeight: 22,
    color: "#0F172A",
    ...ltrText,
  },
  options: {
    gap: 8,
    flexShrink: 1,
  },
});
