import { KidsGameImage } from "../../../components/kids/KidsGameImage";
import { useI18n } from "../../../hooks/useI18n";
import React, { useRef, useState, useMemo, useCallback } from "react";
import { ScrollView, StyleSheet, View, Platform, Pressable } from "react-native";
import Animated, {
  FadeInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ImageMultipleChoiceQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import {
  GameFooter,
  GameHeader,
  GameRoot,
} from "./GameAnimatedShell";
import {
  LightCheckButton,
  LightGameHeading,
  LightWordTile,
} from "./lesson-light-primitives";
import { useWordSpeech } from "./use-word-speech";
import { Duo } from "./lesson-light-design";
import { AppText } from "../../../components/ui/AppText";
import { HomeLiquidButton } from "../../../components/ui/ios-liquid-home";
import { useThemeColors } from "../../../hooks/useThemeColors";

type Props = {
  question: ImageMultipleChoiceQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
  questionIndex?: number;
  totalQuestions?: number;
};

function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ImageMultipleChoiceGame({
  question,
  onAnswer,
  pathMode,
  questionIndex,
  totalQuestions,
}: Props) {
  const { colors, isDark } = useThemeColors();
  const { t } = useI18n();
  const { speakWord } = useWordSpeech(question.targetLanguage);
  const isNormal = pathMode === "normal";
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);

  React.useEffect(() => {
    setSelected(null);
    setRevealed(false);
    firedRef.current = false;
  }, [question]);

  const pick = useCallback((opt: string) => {
    if (revealed) return;
    if (Platform.OS !== "web") void Haptics.selectionAsync();
    setSelected(opt);
    speakWord(opt, `image-mc-option-${opt}`);
  }, [revealed, speakWord]);

  const check = useCallback(() => {
    if (!selected || revealed) return;
    setRevealed(true);
    const correct = selected === question.correctAnswer;

    if (correct) {
      if (Platform.OS !== "web") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      if (Platform.OS !== "web") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Call onAnswer — LessonScreen's feedback sheet handles the transition
    if (!firedRef.current) {
      firedRef.current = true;
      onAnswer(correct);
    }
  }, [selected, revealed, question.correctAnswer, onAnswer]);

  const getState = useCallback((opt: string) => {
    if (!revealed) return opt === selected ? "selected" : "idle";
    if (opt === question.correctAnswer) return "correct"; // Always show correct answer
    if (opt === selected) return "wrong"; // Show wrong if selected and not correct
    return "idle";
  }, [revealed, selected, question.correctAnswer]);

  const handleListen = useCallback(() => {
    speakWord(question.correctAnswer, question.correctAnswer);
  }, [speakWord, question.correctAnswer]);

  // Seeded shuffle — stable across re-renders
  const shuffledOptions = useMemo(() => {
    // Generate a deterministic seed from the options content
    let seed = 0;
    for (const opt of question.options) {
      for (let i = 0; i < opt.length; i++) {
        seed = opt.charCodeAt(i) + ((seed << 5) - seed);
      }
    }
    return shuffleSeeded(question.options, seed);
  }, [question.options]);

  const kidsBadgeText =
    questionIndex !== undefined && totalQuestions !== undefined
      ? t("lessons.exerciseBadgeText")
          .replace("{current}", String(questionIndex + 1))
          .replace("{total}", String(totalQuestions))
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
            title={t("lessons.imageChoiceTitle")}
            badge={kidsBadgeText}
          />
        </GameHeader>

        <Animated.View
          entering={FadeInUp.duration(400).springify()}
          style={[
            s.imageCard,
            // Normal path shows the illustration bare — no frame, wider crop.
            isNormal
              ? s.imageCardFlush
              : { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
          ]}
        >
          <KidsGameImage
            source={question.image}
            style={s.heroImage}
            recyclingKey={question.correctAnswer}
          />
        </Animated.View>

        <View style={s.optionsGrid}>
          {shuffledOptions.map((opt) => {
            const tileState = getState(opt);
            return (
              <View key={opt} style={s.optionCell}>
                <LightWordTile
                  label={opt}
                  state={tileState}
                  onPress={() => pick(opt)}
                  disabled={revealed}
                  isKids={pathMode === "kids"}
                  fontSize={18}
                  centerLabel
                  fitLabel={!isNormal}
                  fitLabelLines={3}
                  languageCode={question.targetLanguage}
                  style={s.choiceTile}
                />
              </View>
            );
          })}
        </View>

        <View style={s.listenBtnContainer}>
          {(pathMode === "kids" || isDark) && !isNormal ? (
            <HomeLiquidButton
              label={t("lessons.listenLabel")}
              color="#8B5CF6"
              onPress={handleListen}
            />
          ) : (
            <Pressable
              onPress={handleListen}
              style={({ pressed }) => [
                s.duoListenBtn,
                pressed && s.duoListenBtnPressed,
              ]}
            >
              <AppText style={s.duoListenBtnText} forceLatinFont latinRole="bold">
                {t("lessons.listenLabel").toUpperCase()}
              </AppText>
            </Pressable>
          )}
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
    paddingTop: 12,
    paddingBottom: 24,
    gap: 24,
  },
  imageCard: {
    alignSelf: "center",
    backgroundColor: Duo.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Duo.border,
    borderBottomWidth: 4,
    borderBottomColor: Duo.borderDark,
    marginVertical: 10,
    width: 220,
    height: 180,
  },
  imageCardFlush: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    width: "100%",
    height: 210,
    marginVertical: 4,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    width: "100%",
  },
  optionCell: {
    width: "45%",
    minWidth: 90,
  },
  choiceTile: {
    width: "100%",
    height: 64,
    borderRadius: 12,
  },
  listenBtnContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  duoListenBtn: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: Duo.accent,
    borderBottomWidth: 4,
    borderBottomColor: Duo.accentDark,
    alignItems: "center",
    justifyContent: "center",
  },
  duoListenBtnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  duoListenBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
});
