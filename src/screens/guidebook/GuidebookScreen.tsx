import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import { getGuidebook } from "../../data/guidebook-data";
import { useI18n } from "../../hooks/useI18n";
import { useTTS } from "../../hooks/use-tts";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { hapticImpact, hapticSelection } from "../../utils/haptics";
import { getGuidebookCopy } from "./guidebook-copy";
import { GuidebookHeader } from "./GuidebookHeader";
import {
  GuidebookModeSwitch,
  GuidebookNavigator,
  type GuidebookMode,
} from "./GuidebookNavigator";
import { GuidebookPracticePanel } from "./GuidebookPracticePanel";
import { GuidebookStudyPanel } from "./GuidebookStudyPanel";
import {
  buildGuidebookViewModel,
  parsePathMode,
  parseUnitIndex,
  type GuidebookEntry,
} from "./guidebook-model";
import { getGuidebookAccent } from "./guidebook-theme";

const WIDE_GUIDE_BREAKPOINT = 920;
const GUIDE_MAX_WIDTH = 1080;

export default function GuidebookScreen() {
  const params = useLocalSearchParams<{
    unit?: string | string[];
    mode?: string | string[];
  }>();
  const safeBack = useSafeBack("/path");
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { locale, isKu, isAr } = useI18n();
  const { colors } = useThemeColors();
  const { speak, stop, activeId } = useTTS();
  const sourceLanguage = useLocaleStore((state) => state.selectedSourceLanguage);
  const targetLanguage = useLocaleStore((state) => state.selectedTargetLanguage);

  const unitIndex = parseUnitIndex(params.unit);
  const pathMode = parsePathMode(params.mode);
  const isWide = width >= WIDE_GUIDE_BREAKPOINT;
  const isRtl = isKu || isAr;
  const webDirectionProps =
    Platform.OS === "web"
      ? ({ dir: isRtl ? "rtl" : "ltr" } as Record<string, string>)
      : undefined;
  const copy = useMemo(() => getGuidebookCopy(locale), [locale]);

  const guidebook = useMemo(
    () => getGuidebook(pathMode, unitIndex, locale, sourceLanguage, targetLanguage),
    [locale, pathMode, sourceLanguage, targetLanguage, unitIndex],
  );
  const guide = useMemo(
    () => (guidebook ? buildGuidebookViewModel(guidebook) : null),
    [guidebook],
  );
  const accent = useMemo(
    () => getGuidebookAccent(guide?.displayTheme ?? "blue"),
    [guide?.displayTheme],
  );

  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [mode, setMode] = useState<GuidebookMode>("study");
  const [studyIndex, setStudyIndex] = useState(0);
  const [studyRevealed, setStudyRevealed] = useState(true);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceRevealed, setPracticeRevealed] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);

  const safeLessonIndex = guide
    ? Math.min(selectedLessonIndex, Math.max(guide.lessons.length - 1, 0))
    : 0;
  const selectedLesson = guide?.lessons[safeLessonIndex];
  const safeStudyIndex = selectedLesson
    ? Math.min(studyIndex, Math.max(selectedLesson.entries.length - 1, 0))
    : 0;

  const resetPractice = useCallback(() => {
    setPracticeIndex(0);
    setPracticeRevealed(false);
    setPracticeComplete(false);
  }, []);

  const resetStudy = useCallback(() => {
    setStudyIndex(0);
    setStudyRevealed(true);
  }, []);

  const handleClose = useCallback(() => {
    void stop();
    safeBack();
  }, [safeBack, stop]);

  const handleSelectLesson = useCallback(
    (index: number) => {
      void stop();
      hapticSelection();
      setSelectedLessonIndex(index);
      resetStudy();
      resetPractice();
    },
    [resetPractice, resetStudy, stop],
  );

  const handleModeChange = useCallback(
    (nextMode: GuidebookMode) => {
      if (nextMode === mode) return;
      void stop();
      hapticSelection();
      setMode(nextMode);
      if (nextMode === "practice") resetPractice();
    },
    [mode, resetPractice, stop],
  );

  const handleSpeak = useCallback(
    (entry: GuidebookEntry) => {
      if (activeId === entry.id) {
        void stop();
        return;
      }
      void speak(entry.english, entry.targetLanguage, entry.id, {
        provider: "device",
      });
    },
    [activeId, speak, stop],
  );

  const handleToggleMeaning = useCallback(() => {
    hapticSelection();
    setStudyRevealed((visible) => !visible);
  }, []);

  const handleStudyNext = useCallback(() => {
    if (!selectedLesson) return;
    void stop();
    hapticSelection();
    if (safeStudyIndex >= selectedLesson.entries.length - 1) {
      setMode("practice");
      resetPractice();
      return;
    }
    setStudyIndex((index) => index + 1);
    setStudyRevealed(true);
  }, [resetPractice, safeStudyIndex, selectedLesson, stop]);

  const handleStudyPrevious = useCallback(() => {
    if (safeStudyIndex === 0) return;
    void stop();
    hapticSelection();
    setStudyIndex((index) => Math.max(0, index - 1));
    setStudyRevealed(true);
  }, [safeStudyIndex, stop]);

  const handleStudySelect = useCallback(
    (index: number) => {
      if (index === safeStudyIndex) return;
      void stop();
      hapticSelection();
      setStudyIndex(index);
      setStudyRevealed(true);
    },
    [safeStudyIndex, stop],
  );

  const handleReveal = useCallback(() => {
    if (practiceRevealed) return;
    hapticImpact();
    setPracticeRevealed(true);
  }, [practiceRevealed]);

  const handleNext = useCallback(() => {
    if (!selectedLesson) return;
    void stop();
    hapticSelection();
    if (practiceIndex >= selectedLesson.entries.length - 1) {
      setPracticeComplete(true);
      return;
    }
    setPracticeIndex((index) => index + 1);
    setPracticeRevealed(false);
  }, [practiceIndex, selectedLesson, stop]);

  const handlePrevious = useCallback(() => {
    if (practiceIndex === 0) return;
    void stop();
    hapticSelection();
    setPracticeIndex((index) => Math.max(0, index - 1));
    setPracticeRevealed(false);
    setPracticeComplete(false);
  }, [practiceIndex, stop]);

  const handleRestart = useCallback(() => {
    hapticImpact();
    resetPractice();
  }, [resetPractice]);

  useEffect(() => {
    return () => {
      void stop();
    };
  }, [stop]);

  if (!guide || !selectedLesson) {
    return (
      <View
        style={[
          styles.unavailable,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <AppText
          style={[
            styles.unavailableText,
            { color: colors.mutedForeground },
            isRtl && styles.rtlText,
          ]}
          forceKurdishFont={isKu}
        >
          {copy.notAvailable}
        </AppText>
        <IOSPressable
          onPress={handleClose}
          style={[
            styles.unavailableButton,
            { backgroundColor: colors.foreground },
          ]}
        >
          <AppText style={[styles.unavailableButtonText, { color: colors.background }]}>
            OK
          </AppText>
        </IOSPressable>
      </View>
    );
  }

  return (
    <ScrollView
      {...webDirectionProps}
      style={[styles.root, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: insets.bottom + (isWide ? 56 : 40),
      }}
    >
      <View
        style={[
          styles.page,
          isWide && {
            width: "100%",
            maxWidth: GUIDE_MAX_WIDTH,
            alignSelf: "center",
            paddingHorizontal: 24,
          },
        ]}
      >
        <GuidebookHeader
          guide={guide}
          copy={copy}
          accent={accent}
          isWide={isWide}
          isRtl={isRtl}
          isKurdish={isKu}
          topInset={isWide ? Math.max(insets.top, 18) : insets.top}
          onClose={handleClose}
        />

        {!isWide ? (
          <GuidebookNavigator
            lessons={guide.lessons}
            selectedIndex={safeLessonIndex}
            accent={accent}
            isWide={false}
            isRtl={isRtl}
            onSelect={handleSelectLesson}
          />
        ) : null}

        <View
          style={[
            styles.studyLayout,
            isWide && styles.studyLayoutWide,
            isWide && isRtl && Platform.OS !== "web" && styles.rowReverse,
          ]}
        >
          {isWide ? (
            <GuidebookNavigator
              lessons={guide.lessons}
              selectedIndex={safeLessonIndex}
              accent={accent}
              isWide
              isRtl={isRtl}
              onSelect={handleSelectLesson}
            />
          ) : null}

          <View style={styles.reader}>
            <GuidebookModeSwitch
              mode={mode}
              onChange={handleModeChange}
              copy={copy}
              accent={accent}
              isRtl={isRtl}
              isKurdish={isKu}
            />

            {mode === "study" ? (
              <GuidebookStudyPanel
                lesson={selectedLesson}
                copy={copy}
                accent={accent}
                currentIndex={safeStudyIndex}
                revealed={studyRevealed}
                activeId={activeId}
                isRtl={isRtl}
                isKurdish={isKu}
                onToggleMeaning={handleToggleMeaning}
                onNext={handleStudyNext}
                onPrevious={handleStudyPrevious}
                onSelect={handleStudySelect}
                onSpeak={handleSpeak}
              />
            ) : (
              <GuidebookPracticePanel
                lesson={selectedLesson}
                copy={copy}
                accent={accent}
                currentIndex={practiceIndex}
                revealed={practiceRevealed}
                complete={practiceComplete}
                activeId={activeId}
                isRtl={isRtl}
                isKurdish={isKu}
                onReveal={handleReveal}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onRestart={handleRestart}
                onSpeak={handleSpeak}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  page: {
    width: "100%",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  studyLayout: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  studyLayoutWide: {
    paddingHorizontal: 0,
    paddingTop: 28,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
  },
  reader: {
    flex: 1,
    minWidth: 0,
    maxWidth: 720,
    gap: 18,
  },
  unavailable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  unavailableText: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "700",
    textAlign: "center",
  },
  unavailableButton: {
    marginTop: 18,
    minWidth: 100,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  unavailableButtonText: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
});
