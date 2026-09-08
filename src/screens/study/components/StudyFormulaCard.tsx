import { VolumeHighIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { PressableScale } from "../../../components/animations";
import { AppText } from "../../../components/ui/AppText";
import { useI18n } from "../../../hooks/useI18n";
import { useGamesTheme } from "../../games/games-theme";
import type { StudyQuizQuestion, StudyStep } from "../../../services/study-tutor-service";

export function StudyFormulaCard({
  formula,
  summary,
  steps,
  quickQuiz,
  onSpeakStep,
  speakingStepIndex,
}: {
  formula: string;
  summary: string;
  steps: StudyStep[];
  quickQuiz: StudyQuizQuestion;
  onSpeakStep: (text: string, index: number) => void;
  speakingStepIndex: number | null;
}) {
  const theme = useGamesTheme();
  const isDark = theme.isDark;
  const { isKu, isAr, locale } = useI18n();
  const isRtl = isKu || isAr;

  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const handleSelectOption = (index: number) => {
    void Haptics.selectionAsync();
    setSelectedQuizOption(index);
    setShowQuizResult(true);

    if (index === quickQuiz.correctIndex) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <View style={styles.container}>
      {/* Primary Scientific Formula Display */}
      {Boolean(formula) ? (
        <View
          style={[
            styles.formulaCard,
            {
              backgroundColor: isDark ? "#1E293B" : "#F8FAFC",
              borderColor: isDark ? "#334155" : "#E2E8F0",
            },
          ]}
        >
          <View style={styles.formulaBadgeRow}>
            <View style={styles.formulaLabelChip}>
              <AppText style={styles.formulaLabelText}>KEY EQUATION</AppText>
            </View>
          </View>
          <AppText
            style={[styles.formulaText, { color: isDark ? "#60A5FA" : "#2563EB" }]}
            forceLatinFont
            latinRole="bold"
          >
            {formula}
          </AppText>
          {Boolean(summary) ? (
            <AppText
              style={[styles.summaryText, { color: isDark ? "#94A3B8" : "#64748B" }]}
              languageCode={locale}
              forceKurdishFont={isRtl}
            >
              {summary}
            </AppText>
          ) : null}
        </View>
      ) : null}

      {/* Step-by-Step Breakdown */}
      <View style={styles.stepsContainer}>
        <AppText
          style={[styles.stepsHeaderTitle, { color: theme.ink }]}
          languageCode={locale}
          forceKurdishFont={isRtl}
        >
          {isKu ? "هەنگاو بە هەنگاو شیکارکردن" : isAr ? "خطوة بخطوة بالتفصيل" : "Step-by-Step Breakdown"}
        </AppText>

        {steps.map((step, idx) => {
          const isPlaying = speakingStepIndex === idx;

          return (
            <View
              key={`step-${step.stepNumber}-${idx}`}
              style={[
                styles.stepRow,
                {
                  backgroundColor: theme.surface,
                  borderColor: isPlaying ? "#2563EB" : theme.border,
                },
              ]}
            >
              <View style={styles.stepHeaderRow}>
                <View style={styles.stepNumberBadge}>
                  <AppText style={styles.stepNumberText}>{step.stepNumber}</AppText>
                </View>

                <AppText
                  style={[styles.stepTitleText, { color: theme.ink }]}
                  languageCode={locale}
                  forceKurdishFont={isRtl}
                  numberOfLines={1}
                >
                  {step.title}
                </AppText>

                <PressableScale
                  onPress={() => onSpeakStep(`${step.title}. ${step.explanation}`, idx)}
                  style={[
                    styles.audioButton,
                    {
                      backgroundColor: isPlaying
                        ? "#2563EB"
                        : isDark
                          ? "#334155"
                          : "#E2E8F0",
                    },
                  ]}
                  accessibilityLabel="Read step aloud"
                >
                  <HugeiconsIcon
                    icon={VolumeHighIcon}
                    size={16}
                    color={isPlaying ? "#FFFFFF" : isDark ? "#94A3B8" : "#64748B"}
                  />
                </PressableScale>
              </View>

              <AppText
                style={[styles.stepExplanationText, { color: theme.mutedInk }]}
                languageCode={locale}
                forceKurdishFont={isRtl}
              >
                {step.explanation}
              </AppText>

              {Boolean(step.formulaSnippet) ? (
                <View
                  style={[
                    styles.snippetBox,
                    {
                      backgroundColor: isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.08)",
                      borderColor: "rgba(37, 99, 235, 0.25)",
                    },
                  ]}
                >
                  <AppText
                    style={[styles.snippetText, { color: isDark ? "#93C5FD" : "#1D4ED8" }]}
                    forceLatinFont
                    latinRole="bold"
                  >
                    {step.formulaSnippet}
                  </AppText>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Concept Understanding Check Quiz */}
      {Boolean(quickQuiz?.question) ? (
        <View
          style={[
            styles.quizCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.quizHeaderRow}>
            <View style={styles.quizBadge}>
              <AppText style={styles.quizBadgeText}>
                {isKu ? "تاقیکردنەوەی تێگەیشتن" : isAr ? "اختبر فهمك" : "CONCEPT CHECK"}
              </AppText>
            </View>
          </View>

          <AppText
            style={[styles.quizQuestionText, { color: theme.ink }]}
            languageCode={locale}
            forceKurdishFont={isRtl}
          >
            {quickQuiz.question}
          </AppText>

          <View style={styles.quizOptionsList}>
            {quickQuiz.options.map((opt, oIdx) => {
              const isSelected = selectedQuizOption === oIdx;
              const isCorrect = oIdx === quickQuiz.correctIndex;

              let optionBg = theme.surfaceRaised;
              let optionBorder = theme.border;
              let textColor = theme.ink;

              if (showQuizResult) {
                if (isCorrect) {
                  optionBg = "rgba(16, 185, 129, 0.14)";
                  optionBorder = "#10B981";
                  textColor = "#10B981";
                } else if (isSelected && !isCorrect) {
                  optionBg = "rgba(239, 68, 68, 0.12)";
                  optionBorder = "#EF4444";
                  textColor = "#EF4444";
                }
              } else if (isSelected) {
                optionBorder = "#2563EB";
                optionBg = "rgba(37, 99, 235, 0.1)";
              }

              return (
                <PressableScale
                  key={`quiz-opt-${oIdx}`}
                  onPress={() => handleSelectOption(oIdx)}
                  accessibilityLabel={`Quiz option ${oIdx + 1}`}
                  style={[
                    styles.quizOptionRow,
                    {
                      backgroundColor: optionBg,
                      borderColor: optionBorder,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.optionBullet,
                      {
                        borderColor: isSelected || (showQuizResult && isCorrect) ? optionBorder : theme.faintInk,
                        backgroundColor: showQuizResult && isCorrect ? "#10B981" : "transparent",
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.optionBulletLetter,
                        { color: showQuizResult && isCorrect ? "#FFFFFF" : textColor },
                      ]}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </AppText>
                  </View>

                  <AppText
                    style={[styles.optionText, { color: textColor }]}
                    languageCode={locale}
                    forceKurdishFont={isRtl}
                  >
                    {opt}
                  </AppText>
                </PressableScale>
              );
            })}
          </View>

          {showQuizResult ? (
            <View
              style={[
                styles.explanationBox,
                {
                  backgroundColor:
                    selectedQuizOption === quickQuiz.correctIndex
                      ? "rgba(16, 185, 129, 0.12)"
                      : "rgba(245, 158, 11, 0.12)",
                },
              ]}
            >
              <AppText
                style={[
                  styles.explanationText,
                  {
                    color:
                      selectedQuizOption === quickQuiz.correctIndex
                        ? "#10B981"
                        : isDark
                          ? "#FBBF24"
                          : "#B45309",
                  },
                ]}
                languageCode={locale}
                forceKurdishFont={isRtl}
              >
                {quickQuiz.explanation}
              </AppText>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  },
  formulaCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  formulaBadgeRow: {
    marginBottom: 8,
  },
  formulaLabelChip: {
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  formulaLabelText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 0.8,
  },
  formulaText: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 6,
  },
  stepsContainer: {
    gap: 10,
  },
  stepsHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  stepRow: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  stepHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  stepTitleText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
  },
  audioButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepExplanationText: {
    fontSize: 13,
    lineHeight: 19,
  },
  snippetBox: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 2,
  },
  snippetText: {
    fontSize: 12,
  },
  quizCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  quizHeaderRow: {
    flexDirection: "row",
  },
  quizBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  quizBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 0.8,
  },
  quizQuestionText: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },
  quizOptionsList: {
    gap: 8,
  },
  quizOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  optionBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  optionBulletLetter: {
    fontSize: 11,
    fontWeight: "800",
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  explanationBox: {
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  explanationText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },
});
