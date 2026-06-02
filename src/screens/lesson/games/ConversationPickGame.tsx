/**

 * ConversationPickGame — Premium light lesson UI.

 */



import { useI18n } from "@/hooks/useI18n";

import React, { useRef, useState } from "react";

import { ScrollView, StyleSheet, Text, View } from "react-native";



import { ConversationPickQuestion } from "@/data/lesson-content";

import type { AnswerTier } from "@/utils/answer-tier";

import { tierLabelKey, tierPasses } from "@/utils/answer-tier";

import {

  GameFooter,

  GameHeader,

  GameOption,

  GameRoot,

} from "./GameAnimatedShell";

import { L } from "./lesson-light-design";

import {

  LightCheckButton,

  LightGameHeading,

  LightOptionRow,

  LightDialogueCard,

  LightQuestionPrompt,

  mapOptionState,

} from "./lesson-light-primitives";



type Props = {

  question: ConversationPickQuestion;

  onAnswer: (correct: boolean, explanation?: string, tier?: AnswerTier) => void;

};



export default function ConversationPickGame({ question, onAnswer }: Props) {

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

    const tier = question.optionTiers[selected] ?? "bad";

    if (!firedRef.current) {

      firedRef.current = true;

      onAnswer(tierPasses(tier), question.explanation, tier);

    }

  };



  const getState = (opt: string) => {
    if (!revealed) return opt === selected ? "selected" : "idle";
    return question.optionTiers[opt] ?? "bad";
  };

  const getTierLabel = (opt: string) => {
    if (!revealed) return undefined;
    const tier = question.optionTiers[opt] ?? "bad";
    return t(tierLabelKey(tier));
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

            subtitle={t("lessons.conversationSub")}

          />

        </GameHeader>



        <LightQuestionPrompt label={t("lessons.situation")} forceKurdishFont>

          {question.situation}

        </LightQuestionPrompt>



        <LightDialogueCard label={t("lessons.theySay")}>

          {question.theyAsk}

        </LightDialogueCard>



        <Text style={s.chooseLabel}>{t("lessons.chooseResponse")}</Text>



        <View style={s.options}>

          {question.options.map((opt, i) => (

            <GameOption key={opt} index={i} baseDelay={120}>

              <LightOptionRow
                label={opt}
                tierLabel={getTierLabel(opt)}
                state={mapOptionState(getState(opt))}
                onPress={() => pick(opt)}
                disabled={revealed}
                forceLatinFont
              />

            </GameOption>

          ))}

        </View>

      </ScrollView>



      <GameFooter>

        <View style={s.checkWrap}>

          <LightCheckButton

            label={t("lessons.check")}

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

    paddingTop: 8,

    paddingBottom: 100,

    gap: 14,

  },

  chooseLabel: {

    fontSize: 15,

    fontWeight: "700",

    color: L.gray,

    fontFamily: "DINNextRoundedBold",

    marginTop: 4,

  },

  options: { gap: 10 },

  checkWrap: {

    paddingHorizontal: 20,

    paddingBottom: 12,

    paddingTop: 8,

    backgroundColor: L.bg,

    borderTopWidth: 1,

    borderTopColor: L.border,

  },

});


