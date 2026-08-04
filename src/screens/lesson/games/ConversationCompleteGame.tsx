/**
 * ConversationCompleteGame — "complete the conversation".
 *
 * The other speaker's line sits in a chat bubble; the learner's own reply bubble
 * is empty until they pick an option. Reading as a two-turn chat is the whole
 * point of the exercise, so the reply bubble is always rendered — an empty
 * bubble with a rail is what poses the question.
 *
 * Related but different: `ConversationPickGame` grades every option on a tier
 * (great/good/bad) against a described situation. This one is plain right/wrong.
 */

import React, { useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { VolumeHighIcon } from "@hugeicons/core-free-icons";

import { AppText } from "../../../components/ui/AppText";
import { TwinoMascot } from "../../../components/mascot/TwinoMascot";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useTTS } from "../../../hooks/use-tts";
import { useLocaleStore } from "../../../stores/useLocaleStore";
import { getLanguageDirection } from "../../../i18n/direction";
import type {
  ConversationCompleteQuestion,
  LessonPathMode,
} from "../../../data/lesson-content";
import { GameFooter, GameHeader, GameOption, GameRoot } from "./GameAnimatedShell";
import { Duo, DuoMotion } from "./lesson-light-design";
import { RAIL_H, RAIL_RADIUS } from "./duo-answer-rails";
import { useDuoTheme } from "./duo-normal";
import {
  LightCheckButton,
  LightGameHeading,
  LightOptionRow,
  mapOptionState,
} from "./lesson-light-primitives";

type Props = {
  question: ConversationCompleteQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
};

export default function ConversationCompleteGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const { colors, isDark } = useThemeColors();
  const theme = useDuoTheme();
  const { speak, stop } = useTTS();
  const uiLanguage = useLocaleStore((st) => st.selectedUiLanguage);

  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);

  const language = question.targetLanguage ?? "en";
  const rtlContent = getLanguageDirection(language) === "rtl";
  const isKids = pathMode === "kids";

  const shake = useSharedValue(0);
  const speakerPulse = useSharedValue(1);

  React.useEffect(() => {
    void stop();
    setSelected(null);
    setRevealed(false);
    firedRef.current = false;
  }, [question, stop]);

  React.useEffect(
    () => () => {
      void stop();
      cancelAnimation(shake);
      cancelAnimation(speakerPulse);
    },
    [shake, speakerPulse, stop],
  );

  const speakPrompt = React.useCallback(() => {
    if (Platform.OS !== "web") void Haptics.selectionAsync();
    speakerPulse.value = withSequence(
      withTiming(1.2, { duration: 120, easing: Easing.out(Easing.quad) }),
      withSpring(1, DuoMotion.pop),
    );
    void speak(question.theyAsk, language, undefined, { provider: "device" });
  }, [language, question.theyAsk, speak, speakerPulse]);

  /* Play the other speaker's line once on arrival, as a real conversation would. */
  React.useEffect(() => {
    void speak(question.theyAsk, language, `convo-${question.theyAsk}`, {
      provider: "device",
    });
  }, [question.theyAsk, language, speak]);

  const check = () => {
    if (!selected || revealed) return;
    setRevealed(true);
    const correct = selected === question.correctAnswer;
    if (!correct) {
      shake.value = withSequence(
        withTiming(-8, { duration: 52 }),
        withTiming(8, { duration: 60 }),
        withTiming(-4, { duration: 52 }),
        withTiming(0, { duration: 44, easing: Easing.out(Easing.quad) }),
      );
    }
    if (!firedRef.current) {
      firedRef.current = true;
      onAnswer(correct, question.explanation);
    }
  };

  const getState = (opt: string) => {
    if (!revealed) return opt === selected ? "selected" : "idle";
    if (opt === selected) return opt === question.correctAnswer ? "correct" : "wrong";
    return "idle";
  };

  const replyShake = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));
  const speakerAnim = useAnimatedStyle(() => ({
    transform: [{ scale: speakerPulse.value }],
  }));

  const replyBorder = !revealed
    ? selected
      ? theme.selBorder
      : theme.rail
    : selected === question.correctAnswer
      ? theme.okBorder
      : theme.badBorder;

  return (
    <GameRoot style={s.root}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GameHeader>
          <LightGameHeading title={t("lessons.completeConversation")} />
        </GameHeader>

        {/* Their turn: mascot + tappable bubble that replays the line. */}
        <View style={[s.turn, rtlContent && s.turnRtl]}>
          <TwinoMascot size={68} pose="wave" />
          <Pressable
            onPress={speakPrompt}
            accessibilityRole="button"
            accessibilityLabel={`${t("lessons.listenLabel")}: ${question.theyAsk}`}
            style={[
              s.bubble,
              s.theirBubble,
              {
                backgroundColor: isDark ? colors.surfaceRaised : Duo.snow,
                borderColor: isDark ? colors.border : Duo.border,
              },
            ]}
          >
            <Animated.View style={speakerAnim}>
              <HugeiconsIcon
                icon={VolumeHighIcon}
                size={22}
                color={Duo.accent}
                strokeWidth={2.4}
              />
            </Animated.View>
            <AppText
              languageCode={language}
              align="start"
              style={[s.bubbleText, { color: colors.foreground, flex: 1 }]}
            >
              {question.theyAsk}
            </AppText>
          </Pressable>
        </View>

        {/* Your turn: empty until answered. The rail is the question. */}
        <Animated.View style={[s.turn, s.myTurn, rtlContent && s.myTurnRtl, replyShake]}>
          <Animated.View
            style={[
              s.bubble,
              s.myBubble,
              {
                backgroundColor: isDark ? colors.muted : Duo.bgSoft,
                borderColor: replyBorder,
              },
            ]}
          >
            {selected ? (
              <AppText
                languageCode={language}
                align="start"
                style={[s.bubbleText, { color: colors.foreground }]}
              >
                {selected}
              </AppText>
            ) : (
              <View style={[s.replyRail, { backgroundColor: theme.rail }]} />
            )}
          </Animated.View>
          {/* Colours come from the theme: the raw Duo.accent* tokens are
              light-mode only and would paint a bright cream disc in dark mode. */}
          <View
            style={[
              s.avatar,
              { backgroundColor: theme.selFace, borderColor: theme.selBorder },
            ]}
          >
            <AppText
              languageCode={uiLanguage}
              style={[s.avatarText, { color: isDark ? theme.selText : Duo.accentText }]}
            >
              {t("lessons.youLabel")}
            </AppText>
          </View>
        </Animated.View>

        <View style={s.options}>
          {question.options.map((opt, i) => (
            <GameOption key={opt} index={i}>
              <LightOptionRow
                label={opt}
                state={mapOptionState(getState(opt))}
                onPress={() => {
                  if (revealed) return;
                  setSelected(opt);
                }}
                disabled={revealed}
                isKids={isKids}
                languageCode={language}
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
          variant={isKids ? "kids" : "default"}
        />
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  /*
   * Chat rows are explicitly `row` / `row-reverse` rather than relying on the
   * engine: which side a turn sits on follows the *content* language (English
   * replies read left-to-right) and must not flip with the Kurdish UI.
   */
  turn: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  turnRtl: {
    flexDirection: "row-reverse",
  },
  myTurn: {
    justifyContent: "flex-end",
    marginTop: 4,
  },
  myTurnRtl: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
  },
  bubble: {
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  theirBubble: {
    flex: 1,
    minHeight: 64,
  },
  myBubble: {
    minWidth: 150,
    minHeight: 64,
    maxWidth: "78%",
    justifyContent: "center",
  },
  bubbleText: {
    fontSize: 19,
    lineHeight: 27,
    fontWeight: "600",
    fontFamily: "DINNextRoundedMedium",
  },
  replyRail: {
    height: RAIL_H,
    width: 96,
    borderRadius: RAIL_RADIUS,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  options: { gap: 12, marginTop: 8 },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
});
