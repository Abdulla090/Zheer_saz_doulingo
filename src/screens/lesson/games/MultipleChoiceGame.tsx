/* eslint-disable */
/**
 * MultipleChoiceGame — Premium light lesson UI.
 */

import { useI18n } from "../../../hooks/useI18n";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { MultipleChoiceQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
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
  LightQuestionPrompt,
  mapOptionState,
} from "./lesson-light-primitives";

type Props = {
  question: MultipleChoiceQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
  questionIndex?: number;
  totalQuestions?: number;
};

export default function MultipleChoiceGame({ question, onAnswer, pathMode, questionIndex, totalQuestions }: Props) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);

  React.useEffect(() => {
    setSelected(null);
    setRevealed(false);
    firedRef.current = false;
  }, [question]);

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

  const shuffledOptions = React.useMemo(() => {
    const opts = [...question.options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [question.options]);

  const isKuPrompt = question.promptLang === "ku";
  const kidsBadgeText = pathMode === "kids" && questionIndex !== undefined && totalQuestions !== undefined
    ? `EXERCISE ${questionIndex + 1} OF ${totalQuestions}`
    : undefined;

  return (
    <GameRoot style={s.root}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GameHeader>
          <LightGameHeading
            title={t("lessons.chooseAnswer")}
            badge={kidsBadgeText}
          />
        </GameHeader>

        <LightQuestionPrompt
          label={t("lessons.questionLabel")}
          forceKurdishFont={isKuPrompt}
          contentLanguageCode={question.promptLang || question.sourceLanguage}
          variant={pathMode === "kids" ? "kids" : "default"}
        >
          {question.prompt}
        </LightQuestionPrompt>

        <View style={s.options}>
          {shuffledOptions.map((opt, i) => (
            <GameOption key={opt} index={i}>
              <LightOptionRow
                label={opt}
                state={mapOptionState(getState(opt))}
                onPress={() => pick(opt)}
                disabled={revealed}
                isKids={pathMode === "kids"}
                languageCode={question.targetLanguage}
              />
            </GameOption>
          ))}
        </View>
      </ScrollView>

      <GameFooter style={s.footer}>
        <LightCheckButton
          label={t("lessons.check")}
          onPress={check}
          disabled={!selected || revealed}
          variant={pathMode === "kids" ? "kids" : "default"}
        />
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  options: { gap: 14 },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
});
