/**
 * MultipleChoiceGame — Premium light lesson UI.
 */

import { AppText } from "@/components/ui/AppText";
import { useI18n } from "@/hooks/useI18n";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { MultipleChoiceQuestion } from "@/data/lesson-content";
import {
  GameFooter,
  GameHeader,
  GameOption,
  GameRoot,
} from "./GameAnimatedShell";
import {
  LightCheckButton,
  LightGameHeading,
  LightOptionRow,
  LightSurfaceCard,
  mapOptionState,
} from "./lesson-light-primitives";
import { L } from "./lesson-light-design";

type Props = {
  question: MultipleChoiceQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

export default function MultipleChoiceGame({ question, onAnswer }: Props) {
  const { t } = useI18n();
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

  const getState = (opt: string) => {
    if (!revealed) return opt === selected ? "selected" : "idle";
    if (opt === selected) {
      return opt === question.correctAnswer ? "correct" : "wrong";
    }
    return "idle";
  };

  const isKuPrompt = question.promptLang === "ku";

  return (
    <GameRoot style={s.root}>
      <GameHeader>
        <LightGameHeading
          title={t("lessons.chooseAnswer")}
          subtitle={t("lessons.chooseAnswerSub")}
        />
      </GameHeader>

      <LightSurfaceCard>
        <AppText
          style={s.prompt}
          forceKurdishFont={isKuPrompt}
        >
          {question.prompt}
        </AppText>
      </LightSurfaceCard>

      <View style={s.options}>
        {question.options.map((opt, i) => (
          <GameOption key={opt} index={i}>
            <LightOptionRow
              label={opt}
              state={mapOptionState(getState(opt))}
              onPress={() => pick(opt)}
              disabled={revealed}
            />
          </GameOption>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <GameFooter>
        <LightCheckButton
          label={t("lessons.check")}
          onPress={check}
          disabled={!selected || revealed}
        />
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 16,
  },
  prompt: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    color: L.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.3,
  },
  options: { gap: 10 },
});
