/**
 * ConversationPickGame — iOS 26 Liquid Glass redesign.
 */

import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Icon3DMessage, Icon3DTarget } from "@/components/icons/Icon3D";
import { ConversationPickQuestion } from "@/data/lesson-content";
import { Type, iOS } from "./game-design";
import { ltrText, rtlBlock } from "./game-text";
import {
  GameCard,
  GameFooter,
  GameHeader,
  GameHint,
  GameOption,
  GameRoot,
} from "./GameAnimatedShell";
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
    <GameRoot style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.root}
        showsVerticalScrollIndicator={false}
      >
        <GameHeader>
          <LiquidEyebrow hint="Pick the most natural reply">Conversation</LiquidEyebrow>
        </GameHeader>

        <GameCard delay={80}>
        <View style={s.situationRow}>
          <LiquidPill tint="dark" height={36} paddingHorizontal={14} style={{ flex: 1 }}>
            <Icon3DTarget size={14} />
            <Text style={s.situationText} numberOfLines={3}>
              {question.situation}
            </Text>
          </LiquidPill>
        </View>

        <View style={s.bubbleRow}>
          <View style={s.avatar}>
            <Icon3DMessage size={26} />
          </View>
          <View style={{ flex: 1 }}>
            <LiquidCard style={s.bubble}>
              <Text style={s.bubbleLabel}>THEY SAY</Text>
              <Text style={s.bubbleText}>{question.theyAsk}</Text>
            </LiquidCard>
          </View>
        </View>
        </GameCard>

        <GameHint delay={140}>
          <LiquidEyebrow>Choose the best response</LiquidEyebrow>
        </GameHint>

        <View style={s.options}>
          {question.options.map((opt, i) => (
            <GameOption key={opt} index={i} baseDelay={160}>
            <LiquidOption
              key={opt}
              text={opt}
              state={getState(opt)}
              onPress={() => pick(opt)}
              disabled={revealed}
              index={i}
            />
            </GameOption>
          ))}
        </View>
      </ScrollView>

      <GameFooter>
      <View style={s.checkWrap}>
        <LiquidPrimaryButton
          label="CHECK"
          color={iOS.systemGreen}
          onPress={check}
          disabled={!selected || revealed}
        />
      </View>
      </GameFooter>
    </GameRoot>
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
    flex: 1,
    flexShrink: 1,
    ...rtlBlock,
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
    ...ltrText,
  },
  bubbleText: {
    ...Type.title,
    color: "#0F172A",
    ...ltrText,
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
