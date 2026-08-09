/* eslint-disable */
/**

 * ConversationPickGame — Premium light lesson UI.

 */



import { useI18n } from "../../../hooks/useI18n";

import React, { useRef, useState } from "react";

import { ScrollView, StyleSheet, View } from "react-native";
import { AppText } from "../../../components/ui/AppText";
import { useThemeColors } from "../../../hooks/useThemeColors";



import { ConversationPickQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";

import type { AnswerTier } from "../../../utils/answer-tier";

import { tierLabelKey, tierPasses } from "../../../utils/answer-tier";

import {

  GameFooter,

  GameHeader,

  GameOption,

  GameRoot,
} from "./GameAnimatedShell";

import { Duo } from "./lesson-light-design";

import {

  LightCheckButton,

  LightGameHeading,

  LightOptionRow,

  LightDialogueCard,

  LightQuestionPrompt,

  mapOptionState,

} from "./lesson-light-primitives";

import { useWordSpeech } from "./use-word-speech";



type Props = {

  question: ConversationPickQuestion;

  onAnswer: (correct: boolean | "skip", explanation?: string, tier?: AnswerTier) => void;

  pathMode?: LessonPathMode;

};



export default function ConversationPickGame({ question, onAnswer, pathMode }: Props) {

  const { t } = useI18n();
  const { colors } = useThemeColors();

  const [selected, setSelected] = useState<string | null>(null);

  const [revealed, setRevealed] = useState(false);

  const firedRef = useRef(false);

  const { speakWord } = useWordSpeech(question.targetLanguage);

  React.useEffect(() => {
    setSelected(null);
    setRevealed(false);
    firedRef.current = false;
  }, [question]);

  const pick = (opt: string) => {

    if (revealed) return;

    setSelected(opt);

    // The replies are target-language lines, so hearing the one you chose is
    // how you judge whether it sounds right.
    speakWord(opt, `conversation-pick-${opt}`);

  };



  const check = () => {

    if (!selected || revealed) return;

    setRevealed(true);

    const tier = question.optionTiers[selected] ?? "terrible";

    if (!firedRef.current) {

      firedRef.current = true;

      onAnswer(tierPasses(tier), question.explanation, tier);

    }

  };



  const getState = (opt: string) => {
    if (!revealed) return opt === selected ? "selected" : "idle";
    const tier = question.optionTiers[opt] ?? "terrible";
    // Reveal only the correct answer. The other replies stay neutral: they are
    // alternatives, not a wall of red errors competing with the teaching cue.
    if (tier === "great") return "great";
    return "idle";
  };

  const getTierLabel = (opt: string) => {
    if (!revealed) return undefined;
    const tier = question.optionTiers[opt] ?? "terrible";
    return tier === "great" ? t(tierLabelKey(tier)) : undefined;
  };



  return (

    <GameRoot style={{ flex: 1 }}>

      <ScrollView

        style={{ flex: 1 }}

        contentContainerStyle={s.root}

        showsVerticalScrollIndicator={false}

      >

        <GameHeader>

          <LightGameHeading

            title={t("lessons.conversation")}

          />

        </GameHeader>



        <LightQuestionPrompt
          label={t("lessons.situation")}
          forceKurdishFont
          contentLanguageCode={question.sourceLanguage}
          speechText={question.theyAsk}
          speechLanguageCode={question.targetLanguage ?? "en"}
          variant={pathMode === "kids" ? "kids" : "default"}
        >

          {question.situation}

        </LightQuestionPrompt>



        <LightDialogueCard
          label={t("lessons.theySay")}
          contentLanguageCode={question.targetLanguage}
        >

          {question.theyAsk}

        </LightDialogueCard>



        <View style={s.options}>

          {question.options.map((opt, i) => (

            <GameOption key={opt} index={i} baseDelay={120}>

              <LightOptionRow
                label={opt}
                tierLabel={getTierLabel(opt)}
                state={mapOptionState(getState(opt))}
                onPress={() => pick(opt)}
                disabled={revealed}
                languageCode={question.targetLanguage}
                isKids={pathMode === "kids"}
              />

            </GameOption>

          ))}

        </View>

      </ScrollView>



      <GameFooter>
        <View style={[
          s.checkWrap,
          { backgroundColor: colors.background, borderTopColor: colors.border },
          pathMode === "kids" && { backgroundColor: "transparent", borderTopWidth: 0 },
          pathMode === "normal" && s.checkWrapDuo,
        ]}>
          <LightCheckButton
            label={t("lessons.check")}
            onPress={check}
            disabled={!selected || revealed}
            variant={pathMode === "kids" ? "kids" : "default"}
          />
        </View>
      </GameFooter>

    </GameRoot>

  );

}



const s = StyleSheet.create({

  root: {

    paddingHorizontal: 20,

    paddingTop: 12,

    paddingBottom: 100,

    gap: 24,

  },

  chooseLabel: {

    fontSize: 15,

    fontWeight: "700",

    color: Duo.hare,

    fontFamily: "DINNextRoundedBold",

    marginTop: 4,

  },

  options: { gap: 12 },

  checkWrap: {

    paddingHorizontal: 20,

    paddingBottom: 12,

    paddingTop: 8,

    backgroundColor: Duo.surface,

    borderTopWidth: 1,

    borderTopColor: Duo.border,

  },

  checkWrapDuo: {
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },

});
