import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "../../components/animations";
import { AppText } from "../../components/ui/AppText";
import { useTTS } from "../../hooks/use-tts";
import { useI18n } from "../../hooks/useI18n";
import { GamesGlassHeader } from "../games/components/games-chrome";
import { useGamesTheme } from "../games/games-theme";
import {
  STUDY_PRESETS,
  askStudyTutor,
  getLocalizedStudyPreset,
  type StudySubject,
  type StudyTutorResponse,
} from "../../services/study-tutor-service";
import { StudyFormulaCard } from "./components/StudyFormulaCard";
import { StudyInteractiveCanvas } from "./components/StudyInteractiveCanvas";
import { StudyVoiceBar } from "./components/StudyVoiceBar";

export function StudyTutorScreen() {
  const router = useRouter();
  const theme = useGamesTheme();
  const insets = useSafeAreaInsets();
  const { isKu, isAr, locale } = useI18n();
  const isRtl = isKu || isAr;

  const [activeSubject, setActiveSubject] = useState<StudySubject>("math");
  const [currentLesson, setCurrentLesson] = useState<StudyTutorResponse>(() =>
    getLocalizedStudyPreset("math-balance", locale),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [speakingStepIdx, setSpeakingStepIdx] = useState<number | null>(null);

  const { speak, stop, speaking } = useTTS();

  const speechLang = isKu ? "ckb" : isAr ? "ar" : "en";

  // Stop TTS when leaving the screen
  useEffect(() => {
    return () => {
      void stop();
    };
  }, [stop]);

  // Sync localized preset on language change
  useEffect(() => {
    if (STUDY_PRESETS[currentLesson.id]) {
      setCurrentLesson(getLocalizedStudyPreset(currentLesson.id, locale));
    }
  }, [locale, currentLesson.id]);

  const handleSubjectChange = (subj: StudySubject) => {
    void Haptics.selectionAsync();
    void stop();
    setActiveSubject(subj);
    setSpeakingStepIdx(null);

    const defaultKey =
      subj === "math"
        ? "math-balance"
        : subj === "physics"
          ? "physics-torque"
          : subj === "chemistry"
            ? "chemistry-atom"
            : "chess-tactics";
    setCurrentLesson(getLocalizedStudyPreset(defaultKey, locale));
  };

  const handleSelectPreset = (presetKey: string) => {
    void Haptics.selectionAsync();
    void stop();
    const preset = getLocalizedStudyPreset(presetKey, locale);
    setCurrentLesson(preset);
    setActiveSubject(preset.subject);
    setSpeakingStepIdx(null);
  };

  const handleAskQuestion = async (query: string) => {
    if (!query.trim()) return;
    setIsGenerating(true);
    void stop();
    setSpeakingStepIdx(null);

    try {
      const response = await askStudyTutor({
        question: query,
        subject: activeSubject,
        language: isKu ? "Kurdish" : isAr ? "Arabic" : "English",
      });

      setCurrentLesson(response);
      setActiveSubject(response.subject);

      // Auto-narrate the speech explanation
      if (response.speechExplanation) {
        void speak(response.speechExplanation, speechLang, "summary-voice");
      }
    } catch {
      // Handled inside askStudyTutor with offline preset fallback
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeakStep = useCallback(
    (text: string, index: number) => {
      if (speaking && speakingStepIdx === index) {
        void stop();
        setSpeakingStepIdx(null);
      } else {
        setSpeakingStepIdx(index);
        void speak(text, speechLang, `step-${index}`, {
          onDone: () => setSpeakingStepIdx(null),
        });
      }
    },
    [speak, stop, speaking, speakingStepIdx, speechLang],
  );

  const handleReplaySummary = useCallback(() => {
    if (speaking) {
      void stop();
      setSpeakingStepIdx(null);
    } else if (currentLesson.speechExplanation) {
      setSpeakingStepIdx(null);
      void speak(currentLesson.speechExplanation, speechLang, "summary-replay");
    }
  }, [speak, stop, speaking, currentLesson.speechExplanation, speechLang]);

  const subjectTabs: { key: StudySubject; labelKu: string; labelAr: string; labelEn: string }[] = [
    { key: "math", labelKu: "بیرکاری", labelAr: "رياضيات", labelEn: "Math" },
    { key: "physics", labelKu: "فیزیک", labelAr: "فيزياء", labelEn: "Physics" },
    { key: "chemistry", labelKu: "کیمیا", labelAr: "كيمياء", labelEn: "Chemistry" },
    { key: "logic", labelKu: "شەتڕەنج و لۆژیک", labelAr: "شطرنج ومنطق", labelEn: "Chess & Logic" },
  ];

  const presetsForSubject: Record<StudySubject, { key: string; titleKu: string; titleAr: string; titleEn: string }[]> = {
    math: [
      { key: "math-balance", titleKu: "تەرازووی هاوکێشە", titleAr: "ميزان المعادلات", titleEn: "Balance Scale" },
      { key: "math-linear", titleKu: "هێڵی ئەندازەیی y=mx+b", titleAr: "الرسم البياني الخطي", titleEn: "Linear Graph" },
    ],
    physics: [
      { key: "physics-torque", titleKu: "زەبر و هاوسەنگی", titleAr: "عزم الدوران والرافعة", titleEn: "Lever & Torque" },
      { key: "physics-circuit", titleKu: "یاسای ئۆم و خولگە", titleAr: "قانون أوم والدارة", titleEn: "Ohm's Law" },
    ],
    chemistry: [
      { key: "chemistry-atom", titleKu: "مۆدێلی بۆر و ئەتۆم", titleAr: "نموذج بور للذرة", titleEn: "Bohr Atom" },
    ],
    logic: [
      { key: "chess-tactics", titleKu: "فۆڕکی ئەسپ لە شەتڕەنج", titleAr: "شوكة الحصان بالتكتيك", titleEn: "Knight Fork" },
    ],
    general: [],
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.canvas }]}>
      <GamesGlassHeader
        title={isKu ? "مامۆستای لێکۆڵینەوەی AI" : isAr ? "معلم الدراسة الذكي" : "AI Study Tutor"}
        onBack={() => router.back()}
        right={
          <View style={styles.headerPill}>
            <AppText style={styles.headerPillText}>
              {currentLesson.modelUsed === "gemini-3.5-flash-lite"
                ? "3.5 Lite"
                : currentLesson.modelUsed === "gemini-3.8-flash"
                  ? "Gemini 3.8"
                  : "Interactive"}
            </AppText>
          </View>
        }
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Subject Category Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectChipRow}
          >
            {subjectTabs.map((tab) => {
              const isSelected = activeSubject === tab.key;
              return (
                <PressableScale
                  key={tab.key}
                  onPress={() => handleSubjectChange(tab.key)}
                  style={[
                    styles.subjectChip,
                    {
                      backgroundColor: isSelected
                        ? "#2563EB"
                        : theme.surface,
                      borderColor: isSelected ? "#2563EB" : theme.border,
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.subjectChipText,
                      { color: isSelected ? "#FFFFFF" : theme.ink },
                    ]}
                    languageCode={locale}
                    forceKurdishFont={isRtl}
                  >
                    {isKu ? tab.labelKu : isAr ? tab.labelAr : tab.labelEn}
                  </AppText>
                </PressableScale>
              );
            })}
          </ScrollView>

          {/* Quick Sub-Topic Presets */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetChipRow}
          >
            {presetsForSubject[activeSubject]?.map((preset) => {
              const isSelected = currentLesson.id === preset.key;
              return (
                <PressableScale
                  key={preset.key}
                  onPress={() => handleSelectPreset(preset.key)}
                  style={[
                    styles.presetPill,
                    {
                      backgroundColor: isSelected
                        ? "rgba(37, 99, 235, 0.15)"
                        : theme.surfaceRaised,
                      borderColor: isSelected ? "#2563EB" : theme.border,
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.presetPillText,
                      { color: isSelected ? "#2563EB" : theme.mutedInk },
                    ]}
                    languageCode={locale}
                    forceKurdishFont={isRtl}
                  >
                    {isKu ? preset.titleKu : isAr ? preset.titleAr : preset.titleEn}
                  </AppText>
                </PressableScale>
              );
            })}
          </ScrollView>

          {/* Lesson Title & Topic Badge */}
          <View style={styles.titleSection}>
            <AppText
              style={[styles.lessonTitle, { color: theme.ink }]}
              languageCode={locale}
              forceKurdishFont={isRtl}
            >
              {currentLesson.title}
            </AppText>
            {Boolean(currentLesson.speechExplanation) ? (
              <AppText
                style={[styles.lessonExplanation, { color: theme.mutedInk }]}
                languageCode={locale}
                forceKurdishFont={isRtl}
              >
                {currentLesson.speechExplanation}
              </AppText>
            ) : null}
          </View>

          {/* Loading Indicator when Gemini generates */}
          {isGenerating ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#2563EB" />
              <AppText style={styles.loadingText}>
                {isKu ? "Gemini سەرقاڵی شیکارکردنە..." : isAr ? "جاري التحليل عبر Gemini..." : "Gemini is building your interactive simulation..."}
              </AppText>
            </View>
          ) : null}

          {/* High-Fidelity Interactive Visual Canvas */}
          <StudyInteractiveCanvas widgetState={currentLesson.interactive} />

          {/* Step-by-Step Solver & Formula Card */}
          <StudyFormulaCard
            formula={currentLesson.formula}
            summary={currentLesson.summary}
            steps={currentLesson.steps}
            quickQuiz={currentLesson.quickQuiz}
            onSpeakStep={handleSpeakStep}
            speakingStepIndex={speakingStepIdx}
          />
        </ScrollView>

        {/* Floating Voice & Query Capsule */}
        <View style={[styles.bottomVoiceDock, { bottom: insets.bottom + 8 }]}>
          <StudyVoiceBar
            onAskQuestion={handleAskQuestion}
            isGenerating={isGenerating}
            onReplayAudio={handleReplaySummary}
            speaking={speaking}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  headerPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.25)",
  },
  headerPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
  },
  subjectChipRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  subjectChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  subjectChipText: {
    fontSize: 13,
    fontWeight: "700",
  },
  presetChipRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  presetPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  presetPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  titleSection: {
    gap: 6,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  lessonExplanation: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(37, 99, 235, 0.08)",
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
  bottomVoiceDock: {
    position: "absolute",
    left: 16,
    right: 16,
    maxWidth: 720,
    alignSelf: "center",
  },
});
