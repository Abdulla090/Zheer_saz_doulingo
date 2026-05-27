/**
 * ConversationPickGame — Premium light lesson UI.
 */

import { AppText } from "@/components/ui/AppText";
import { useI18n } from "@/hooks/useI18n";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ConversationPickQuestion } from "@/data/lesson-content";
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
  LightSurfaceCard,
  mapOptionState,
} from "./lesson-light-primitives";

type Props = {
  question: ConversationPickQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
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
    const ok = selected === question.correctAnswer;
    if (!firedRef.current) {
      firedRef.current = true;
      onAnswer(ok, question.explanation);
    }
  };

  const getState = (opt: string) => {
    if (!revealed) return opt === selected ? "selected" : "idle";
    if (opt === selected) {
      return opt === question.correctAnswer ? "correct" : "wrong";
    }
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
          <LightGameHeading
            title={t("lessons.conversation")}
            subtitle={t("lessons.conversationSub")}
          />
        </GameHeader>

        <LightSurfaceCard style={s.situationCard}>
          <Text style={s.situationLabel}>{t("lessons.situation")}</Text>
          <AppText style={s.situationText} forceKurdishFont>
            {question.situation}
          </AppText>
        </LightSurfaceCard>

        <LightSurfaceCard>
          <Text style={s.theyLabel}>{t("lessons.theySay")}</Text>
          <AppText style={s.theyText} forceKurdishFont>
            {question.theyAsk}
          </AppText>
        </LightSurfaceCard>

        <Text style={s.chooseLabel}>{t("lessons.chooseResponse")}</Text>

        <View style={s.options}>
          {question.options.map((opt, i) => (
            <GameOption key={opt} index={i} baseDelay={120}>
              <LightOptionRow
                label={opt}
                state={mapOptionState(getState(opt))}
                onPress={() => pick(opt)}
                disabled={revealed}
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
  situationCard: { gap: 6 },
  situationLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: L.grayLight,
    letterSpacing: 0.6,
    fontFamily: "DINNextRoundedBold",
  },
  situationText: {
    fontSize: 17,
    fontWeight: "700",
    color: L.navy,
    lineHeight: 24,
    fontFamily: "DINNextRoundedBold",
  },
  theyLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: L.grayLight,
    letterSpacing: 0.6,
    fontFamily: "DINNextRoundedBold",
    marginBottom: 6,
  },
  theyText: {
    fontSize: 17,
    fontWeight: "700",
    color: L.navy,
    lineHeight: 24,
    fontFamily: "DINNextRoundedBold",
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
