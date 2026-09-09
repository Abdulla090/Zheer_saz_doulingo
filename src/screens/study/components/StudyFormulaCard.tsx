import { VolumeHighIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

import { PressableScale } from "../../../components/animations";
import { AppText } from "../../../components/ui/AppText";
import { useI18n } from "../../../hooks/useI18n";
import { useGamesTheme } from "../../games/games-theme";
import type { StudyQuizQuestion, StudyStep } from "../../../services/study-tutor-service";

/**
 * Formats raw LaTeX mathematical strings into clean, readable Unicode math expressions.
 * Transforms commands like \implies, \frac{a}{b}, \lim, \cdot, exponents, and greek letters.
 */
export function formatMathFormula(raw?: string): string {
  if (!raw) return "";

  let s = raw.trim();

  // Remove outer math delimiters if present ($...$ or \[...\])
  s = s.replace(/^\$\$?/, "").replace(/\$\$?$/, "");
  s = s.replace(/^\\\[/, "").replace(/\\\]$/, "");
  s = s.replace(/^\\\(/, "").replace(/\\\)$/, "");

  // Replace fractions iteratively: \frac{num}{den} -> (num) / (den) or num/den
  let prev = "";
  while (prev !== s && s.includes("\\frac")) {
    prev = s;
    s = s.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, (_m, num, den) => {
      const cleanNum = num.trim();
      const cleanDen = den.trim();
      const numFormatted = /^[a-zA-Z0-9]+$/.test(cleanNum) ? cleanNum : `(${cleanNum})`;
      const denFormatted = /^[a-zA-Z0-9]+$/.test(cleanDen) ? cleanDen : `(${cleanDen})`;
      return `${numFormatted} / ${denFormatted}`;
    });
  }

  // Common math symbols
  s = s.replace(/\\implies/g, " ⟹ ");
  s = s.replace(/\\impliedby/g, " ⟸ ");
  s = s.replace(/\\iff/g, " ⟺ ");
  s = s.replace(/\\to(?![a-zA-Z])|\\rightarrow(?![a-zA-Z])/g, " → ");
  s = s.replace(/\\leftarrow(?![a-zA-Z])/g, " ← ");
  s = s.replace(/\\lim_\{([^}]+)\}/g, "lim($1) ");
  s = s.replace(/\\lim(?![a-zA-Z])/g, "lim ");
  s = s.replace(/\\sqrt\s*\{([^}]+)\}/g, "√($1)");
  s = s.replace(/\\cdot(?![a-zA-Z])/g, " · ");
  s = s.replace(/\\times(?![a-zA-Z])/g, " × ");
  s = s.replace(/\\div(?![a-zA-Z])/g, " ÷ ");
  s = s.replace(/\\pm(?![a-zA-Z])/g, " ± ");
  s = s.replace(/\\mp(?![a-zA-Z])/g, " ∓ ");
  s = s.replace(/\\(?:neq|ne)(?![a-zA-Z])/g, " ≠ ");
  s = s.replace(/\\(?:leq|le)(?![a-zA-Z])/g, " ≤ ");
  s = s.replace(/\\(?:geq|ge)(?![a-zA-Z])/g, " ≥ ");
  s = s.replace(/\\approx(?![a-zA-Z])/g, " ≈ ");
  s = s.replace(/\\equiv(?![a-zA-Z])/g, " ≡ ");
  s = s.replace(/\\propto(?![a-zA-Z])/g, " ∝ ");
  s = s.replace(/\\degree(?![a-zA-Z])|\^\\circ/g, "°");
  s = s.replace(/\\infty(?![a-zA-Z])/g, "∞");
  s = s.replace(/\\partial(?![a-zA-Z])/g, "∂");
  s = s.replace(/\\nabla(?![a-zA-Z])/g, "∇");
  s = s.replace(/\\sum(?![a-zA-Z])/g, "∑");
  s = s.replace(/\\int(?![a-zA-Z])/g, "∫");
  s = s.replace(/\\in(?![a-zA-Z])/g, " ∈ ");
  s = s.replace(/\\notin(?![a-zA-Z])/g, " ∉ ");

  // Greek letters
  s = s.replace(/\\alpha(?![a-zA-Z])/g, "α");
  s = s.replace(/\\beta(?![a-zA-Z])/g, "β");
  s = s.replace(/\\gamma(?![a-zA-Z])/g, "γ");
  s = s.replace(/\\delta(?![a-zA-Z])/g, "δ");
  s = s.replace(/\\epsilon(?![a-zA-Z])/g, "ε");
  s = s.replace(/\\zeta(?![a-zA-Z])/g, "ζ");
  s = s.replace(/\\eta(?![a-zA-Z])/g, "η");
  s = s.replace(/\\theta(?![a-zA-Z])/g, "θ");
  s = s.replace(/\\lambda(?![a-zA-Z])/g, "λ");
  s = s.replace(/\\mu(?![a-zA-Z])/g, "μ");
  s = s.replace(/\\pi(?![a-zA-Z])/g, "π");
  s = s.replace(/\\rho(?![a-zA-Z])/g, "ρ");
  s = s.replace(/\\sigma(?![a-zA-Z])/g, "σ");
  s = s.replace(/\\tau(?![a-zA-Z])/g, "τ");
  s = s.replace(/\\phi(?![a-zA-Z])/g, "φ");
  s = s.replace(/\\psi(?![a-zA-Z])/g, "ψ");
  s = s.replace(/\\omega(?![a-zA-Z])/g, "ω");
  s = s.replace(/\\Delta(?![a-zA-Z])/g, "Δ");
  s = s.replace(/\\Omega(?![a-zA-Z])/g, "Ω");

  // LaTeX spacing and styling commands
  s = s.replace(/\\quad\b/g, "   ");
  s = s.replace(/\\qquad\b/g, "     ");
  s = s.replace(/\\text\s*\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathrm\s*\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathbf\s*\{([^}]+)\}/g, "$1");
  s = s.replace(/\\left\s*([(\[{|])/g, "$1");
  s = s.replace(/\\right\s*([)\]}|])/g, "$1");

  // Exponents superscripts
  const superscripts: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
    "a": "ᵃ", "b": "ᵇ", "c": "ᶜ", "d": "ᵈ", "e": "ᵉ",
    "f": "ᶠ", "g": "ᵍ", "h": "ʰ", "i": "ⁱ", "j": "ʲ",
    "k": "ᵏ", "l": "ˡ", "m": "ᵐ", "n": "ⁿ", "o": "ᵒ",
    "p": "ᵖ", "r": "ʳ", "s": "ˢ", "t": "ᵗ", "u": "ᵘ",
    "v": "ᵛ", "w": "ʷ", "x": "ˣ", "y": "ʸ", "z": "ᶻ",
  };
  s = s.replace(/\^([0-9a-z+-])/g, (_m, ch) => superscripts[ch] || `^${ch}`);
  s = s.replace(/\^\{([^{}]+)\}/g, (_m, exp) => {
    const chars = exp.split("");
    if (chars.every((c: string) => superscripts[c])) {
      return chars.map((c: string) => superscripts[c]).join("");
    }
    return `^(${exp})`;
  });

  // Subscripts
  const subscripts: Record<string, string> = {
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
    "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
    "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ",
    "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ",
    "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ",
    "v": "ᵥ", "x": "ₓ",
  };
  s = s.replace(/_([0-9aehijklmnoprstuvx+-])/g, (_m, ch) => subscripts[ch] || `_${ch}`);
  s = s.replace(/_\{([^{}]+)\}/g, (_m, sub) => {
    const chars = sub.split("");
    if (chars.every((c: string) => subscripts[c])) {
      return chars.map((c: string) => subscripts[c]).join("");
    }
    return `_(${sub})`;
  });

  // Clean remaining braces and multiple spaces
  s = s.replace(/\{([a-zA-Z0-9_]+)\}/g, "$1");
  s = s.replace(/\\/g, ""); // strip any remaining orphan backslashes
  s = s.replace(/\s{2,}/g, " ").trim();

  return s;
}

export function StudyFormulaCard({
  formula,
  summary,
  steps,
  quickQuiz,
  onSpeakStep,
  speakingStepIndex,
  visibleStepCount,
  cleanMathMode = false,
}: {
  formula: string;
  summary: string;
  steps: StudyStep[];
  quickQuiz?: StudyQuizQuestion;
  onSpeakStep: (text: string, index: number) => void;
  speakingStepIndex: number | null;
  visibleStepCount?: number;
  cleanMathMode?: boolean;
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

    if (quickQuiz && index === quickQuiz.correctIndex) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const formattedFormula = formatMathFormula(formula);
  const displayedSteps =
    typeof visibleStepCount === "number" ? steps.slice(0, visibleStepCount) : steps;

  // Clean Math Mode: "NO CARD NO NOTHING JUST STEP X AND THE LATEX MATH STEP IN THERE IN LARGE APEAR"
  if (cleanMathMode) {
    if (steps.length === 0) return null;

    return (
      <View style={styles.cleanMathContainer}>
        {displayedSteps.map((step, idx) => {
          const isPlaying = speakingStepIndex === idx;
          const mathExpression = step.latex || step.formulaSnippet || "";
          const formattedMath = formatMathFormula(mathExpression) || mathExpression;
          const displayContent = formattedMath || step.explanation || step.title;

          return (
            <Animated.View
              key={`pure-clean-step-${step.stepNumber}-${idx}`}
              entering={
                typeof SlideInDown !== "undefined" && typeof SlideInDown.springify === "function"
                  ? SlideInDown.springify()
                  : typeof FadeIn !== "undefined"
                    ? FadeIn
                    : undefined
              }
              style={styles.pureStepWrapper}
            >
              <PressableScale
                onPress={() =>
                  onSpeakStep(
                    step.explanation
                      ? `${step.title || 'Step ' + step.stepNumber}. ${step.explanation}`
                      : displayContent,
                    idx,
                  )
                }
                style={styles.pureStepTouchable}
                accessibilityLabel={`Step ${step.stepNumber}`}
              >
                {/* STEP X Micro Label */}
                <View style={styles.pureStepHeaderRow}>
                  <AppText
                    style={[
                      styles.pureStepNumberText,
                      { color: isPlaying ? "#2563EB" : isDark ? "#94A3B8" : "#64748B" },
                    ]}
                  >
                    {isKu
                      ? `هەنگاوی ${step.stepNumber}`
                      : isAr
                        ? `الخطوة ${step.stepNumber}`
                        : `STEP ${step.stepNumber}`}
                  </AppText>
                  {isPlaying ? (
                    <View style={styles.pureSpeakingIndicator}>
                      <View style={styles.pureSpeakingDot} />
                      <AppText style={styles.pureSpeakingLabel}>Speaking</AppText>
                    </View>
                  ) : null}
                </View>

                {/* Large LaTeX Math Formula: Bold, High-Contrast, Spacious */}
                {Boolean(displayContent) ? (
                  <AppText
                    style={[
                      styles.pureLargeMathText,
                      {
                        color: isPlaying
                          ? isDark
                            ? "#93C5FD"
                            : "#1D4ED8"
                          : isDark
                            ? "#60A5FA"
                            : "#2563EB",
                      },
                    ]}
                    forceLatinFont
                    latinRole="bold"
                  >
                    {displayContent}
                  </AppText>
                ) : null}
              </PressableScale>
            </Animated.View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Primary Scientific Formula Display */}
      {Boolean(formula) ? (
        <View
          style={[
            styles.formulaCard,
            {
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(248, 250, 252, 0.9)",
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
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
            {formattedFormula || formula}
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

      {/* Step-by-Step LaTeX Derivation: Clean, Minimal, Card-less */}
      {steps.length > 0 ? (
        <View style={styles.stepsContainer}>
          <View style={styles.stepsHeaderRow}>
            <AppText
              style={[styles.stepsHeaderTitle, { color: theme.ink }]}
              languageCode={locale}
              forceKurdishFont={isRtl}
            >
              {isKu
                ? "هەنگاو بە هەنگاو شیکارکردن"
                : isAr
                  ? "خطوة بخطوة بالتفصيل"
                  : "Step-by-Step Derivation"}
            </AppText>

            {typeof visibleStepCount === "number" && visibleStepCount < steps.length ? (
              <View style={styles.stepProgressPill}>
                <AppText style={styles.stepProgressText}>
                  {`${visibleStepCount} / ${steps.length}`}
                </AppText>
              </View>
            ) : null}
          </View>

          {displayedSteps.map((step, idx) => {
            const isPlaying = speakingStepIndex === idx;
            const mathExpression = step.latex || step.formulaSnippet || "";
            const formattedMath = formatMathFormula(mathExpression) || mathExpression;

            return (
              <View
                key={`clean-step-${step.stepNumber}-${idx}`}
                style={[
                  styles.cleanStepItem,
                  {
                    borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  },
                ]}
              >
                {/* Step Header: Step X + Title + Speaking Indicator + Speaker */}
                <View style={styles.stepHeaderRow}>
                  <View
                    style={[
                      styles.stepNumberBadge,
                      {
                        backgroundColor: isPlaying
                          ? "#2563EB"
                          : isDark
                            ? "#334155"
                            : "#E2E8F0",
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.stepNumberText,
                        { color: isPlaying ? "#FFFFFF" : isDark ? "#F8FAFC" : "#334155" },
                      ]}
                    >
                      {step.stepNumber}
                    </AppText>
                  </View>

                  <AppText
                    style={[
                      styles.stepTitleText,
                      { color: isPlaying ? "#2563EB" : theme.ink },
                    ]}
                    languageCode={locale}
                    forceKurdishFont={isRtl}
                    numberOfLines={1}
                  >
                    {step.title}
                  </AppText>

                  {isPlaying ? (
                    <View style={styles.speakingWavePill}>
                      <View style={styles.speakingWaveDot} />
                      <AppText style={styles.speakingWaveText}>Speaking</AppText>
                    </View>
                  ) : null}

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

                {/* Large LaTeX Math Display (clean, bold, no box) */}
                {Boolean(formattedMath) ? (
                  <View style={styles.largeMathWrapper}>
                    <AppText
                      style={[
                        styles.largeMathText,
                        { color: isDark ? "#60A5FA" : "#2563EB" },
                      ]}
                      forceLatinFont
                      latinRole="bold"
                    >
                      {formattedMath}
                    </AppText>
                  </View>
                ) : null}

                {/* Intuitive Step Explanation */}
                {Boolean(step.explanation) ? (
                  <AppText
                    style={[styles.stepExplanationText, { color: theme.mutedInk }]}
                    languageCode={locale}
                    forceKurdishFont={isRtl}
                  >
                    {step.explanation}
                  </AppText>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}

      {/* Concept Understanding Check Quiz */}
      {quickQuiz && quickQuiz.question ? (
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
                        borderColor:
                          isSelected || (showQuizResult && isCorrect)
                            ? optionBorder
                            : theme.faintInk,
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
    gap: 20,
  },
  formulaCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
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
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  stepsContainer: {
    width: "100%",
    gap: 4,
  },
  stepsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stepsHeaderTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  stepProgressPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
  },
  stepProgressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  cleanStepItem: {
    paddingVertical: 16,
    paddingHorizontal: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
    backgroundColor: "transparent",
  },
  stepHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "800",
  },
  stepTitleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
  speakingWavePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
  },
  speakingWaveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
  },
  speakingWaveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  audioButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  largeMathWrapper: {
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  largeMathText: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  stepExplanationText: {
    fontSize: 14,
    lineHeight: 21,
  },
  quizCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginTop: 8,
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
  cleanMathContainer: {
    width: "100%",
    gap: 20,
    marginVertical: 12,
  },
  pureStepWrapper: {
    width: "100%",
    paddingVertical: 10,
  },
  pureStepTouchable: {
    width: "100%",
    gap: 8,
  },
  pureStepHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pureStepNumberText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  pureSpeakingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
  },
  pureSpeakingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
  },
  pureSpeakingLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
  },
  pureLargeMathText: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  pureStepExplanation: {
    fontSize: 14,
    lineHeight: 22,
  },
});
