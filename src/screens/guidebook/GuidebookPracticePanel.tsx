import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Cards02Icon,
  CheckmarkCircle02Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { GuidebookCopy } from "./guidebook-copy";
import type {
  GuidebookEntry,
  GuidebookLessonViewModel,
} from "./guidebook-model";
import type { GuidebookAccent } from "./guidebook-theme";

type GuidebookPracticePanelProps = {
  lesson: GuidebookLessonViewModel;
  copy: GuidebookCopy;
  accent: GuidebookAccent;
  currentIndex: number;
  revealed: boolean;
  complete: boolean;
  activeId: string | null;
  isRtl: boolean;
  isKurdish: boolean;
  onReveal: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  onSpeak: (entry: GuidebookEntry) => void;
};

export function GuidebookPracticePanel({
  lesson,
  copy,
  accent,
  currentIndex,
  revealed,
  complete,
  activeId,
  isRtl,
  isKurdish,
  onReveal,
  onNext,
  onPrevious,
  onRestart,
  onSpeak,
}: GuidebookPracticePanelProps) {
  const { colors } = useThemeColors();
  const entry = lesson.entries[currentIndex];

  if (!entry) {
    return (
      <View style={styles.emptyPanel}>
        <HugeiconsIcon
          icon={Cards02Icon}
          size={28}
          color={colors.mutedForeground}
          strokeWidth={1.8}
        />
        <AppText
          style={[styles.emptyText, { color: colors.mutedForeground }]}
          forceKurdishFont={isKurdish}
          align="center"
        >
          {copy.emptyPractice}
        </AppText>
      </View>
    );
  }

  if (complete) {
    return (
      <Animated.View
        entering={FadeIn.duration(180)}
        style={[styles.completeCanvas, { backgroundColor: accent.tint }]}
      >
        <View style={[styles.completeRing, { borderColor: accent.soft }]}>
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={42}
            color={accent.strong}
            strokeWidth={2}
          />
        </View>
        <AppText
          style={[styles.completeTitle, { color: accent.deep }]}
          forceKurdishFont={isKurdish}
          align="center"
        >
          {copy.completeTitle}
        </AppText>
        <IOSPressable
          onPress={onRestart}
          accessibilityRole="button"
          style={[styles.restartButton, { backgroundColor: accent.strong }]}
        >
          <HugeiconsIcon
            icon={Cards02Icon}
            size={19}
            color="#FFFFFF"
            strokeWidth={2.2}
          />
          <AppText
            style={styles.primaryButtonLabel}
            forceKurdishFont={isKurdish}
          >
            {copy.restart}
          </AppText>
        </IOSPressable>
      </Animated.View>
    );
  }

  const previousIcon = isRtl ? ArrowRight02Icon : ArrowLeft02Icon;
  const nextIcon = isRtl ? ArrowLeft02Icon : ArrowRight02Icon;
  const kindLabel =
    entry.kind === "word" ? copy.vocabulary : copy.keyPhrases;

  return (
    <Animated.View
      key={`${lesson.id}-${currentIndex}`}
      entering={FadeIn.duration(180)}
      style={styles.panel}
    >
      <View
        style={[
          styles.lessonHeading,
          isRtl && Platform.OS !== "web" && styles.rowReverse,
        ]}
      >
        <View
          style={[
            styles.lessonHeadingCopy,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          <AppText
            style={[styles.lessonTitle, { color: colors.foreground }]}
            languageCode={lesson.sourceLanguage}
            align="start"
            forceKurdishFont={lesson.sourceLanguage === "ku"}
            numberOfLines={2}
          >
            {lesson.topicKu}
          </AppText>
          <AppText
            style={[styles.lessonTranslation, { color: colors.mutedForeground }]}
            languageCode={lesson.targetLanguage}
            align="start"
            numberOfLines={1}
          >
            {lesson.topic}
          </AppText>
        </View>

        <AppText
          style={[styles.entryCount, { color: colors.mutedForeground }]}
          forceLatinFont
        >
          {currentIndex + 1} / {lesson.entries.length}
        </AppText>
      </View>

      <View
        style={[
          styles.flashCanvas,
          { backgroundColor: revealed ? accent.tint : accent.deep },
        ]}
      >
        <View
          style={[
            styles.cardToolbar,
            isRtl && Platform.OS !== "web" && styles.rowReverse,
          ]}
        >
          <View
            style={[
              styles.kindPill,
              {
                backgroundColor: revealed
                  ? "rgba(255,255,255,0.62)"
                  : "rgba(255,255,255,0.14)",
              },
            ]}
          >
            <AppText
              style={[
                styles.kindLabel,
                { color: revealed ? accent.deep : "#FFFFFF" },
              ]}
              forceKurdishFont={isKurdish}
            >
              {kindLabel}
            </AppText>
          </View>

          <IOSPressable
            onPress={() => onSpeak(entry)}
            accessibilityRole="button"
            accessibilityLabel={`${copy.listen}: ${entry.english}`}
            style={[
              styles.audioButton,
              {
                backgroundColor:
                  activeId === entry.id
                    ? accent.strong
                    : revealed
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.14)",
              },
            ]}
          >
            <HugeiconsIcon
              icon={VolumeHighIcon}
              size={20}
              color={
                activeId === entry.id || !revealed ? "#FFFFFF" : accent.deep
              }
              strokeWidth={2.2}
            />
          </IOSPressable>
        </View>

        <View style={styles.promptBlock}>
          <AppText
            style={[
              styles.promptText,
              { color: revealed ? accent.deep : "#FFFFFF" },
            ]}
            languageCode={entry.targetLanguage}
            align="center"
            fullWidth
          >
            {entry.english}
          </AppText>

          {revealed ? (
            <Animated.View
              entering={FadeInDown.duration(180)}
              style={styles.answerBlock}
            >
              <View
                style={[styles.answerRule, { backgroundColor: accent.soft }]}
              />
              <AppText
                style={[styles.answerText, { color: accent.deep }]}
                languageCode={entry.sourceLanguage}
                align="center"
                forceKurdishFont={entry.sourceLanguage === "ku"}
                fullWidth
              >
                {entry.kurdish}
              </AppText>
            </Animated.View>
          ) : (
            <AppText
              style={styles.revealHint}
              forceKurdishFont={isKurdish}
              align="center"
            >
              {copy.tapToReveal}
            </AppText>
          )}
        </View>
      </View>

      <View
        style={[
          styles.actions,
          isRtl && Platform.OS !== "web" && styles.rowReverse,
        ]}
      >
        <IOSPressable
          disabled={currentIndex === 0}
          onPress={onPrevious}
          accessibilityRole="button"
          accessibilityLabel={copy.previousCard}
          style={[
            styles.previousButton,
            {
              backgroundColor: colors.muted,
              opacity: currentIndex === 0 ? 0.34 : 1,
            },
          ]}
        >
          <HugeiconsIcon
            icon={previousIcon}
            size={20}
            color={colors.foreground}
            strokeWidth={2.2}
          />
        </IOSPressable>

        <IOSPressable
          onPress={revealed ? onNext : onReveal}
          accessibilityRole="button"
          style={[
            styles.primaryButton,
            { backgroundColor: accent.strong },
            isRtl && Platform.OS !== "web" && styles.rowReverse,
          ]}
        >
          <AppText
            style={styles.primaryButtonLabel}
            forceKurdishFont={isKurdish}
          >
            {revealed ? copy.nextCard : copy.revealAnswer}
          </AppText>
          <HugeiconsIcon
            icon={revealed ? nextIcon : Cards02Icon}
            size={19}
            color="#FFFFFF"
            strokeWidth={2.2}
          />
        </IOSPressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rowReverse: {
    flexDirection: "row-reverse",
  },
  panel: {
    gap: 14,
  },
  lessonHeading: {
    minHeight: 58,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  },
  lessonHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  lessonTitle: {
    fontSize: 21,
    lineHeight: 29,
    fontWeight: "900",
  },
  lessonTranslation: {
    marginTop: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  entryCount: {
    paddingBottom: 2,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  flashCanvas: {
    minHeight: 324,
    borderRadius: 28,
    padding: 16,
    overflow: "hidden",
  },
  cardToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  kindPill: {
    minHeight: 30,
    borderRadius: 15,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  kindLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
  },
  audioButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  promptBlock: {
    flex: 1,
    minHeight: 236,
    paddingHorizontal: 12,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  promptText: {
    fontSize: 36,
    lineHeight: 45,
    fontWeight: "900",
    fontFamily: "DINNextRoundedBold",
  },
  revealHint: {
    marginTop: 22,
    color: "rgba(255,255,255,0.76)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
  },
  answerBlock: {
    width: "100%",
    alignItems: "center",
  },
  answerRule: {
    width: 42,
    height: 3,
    borderRadius: 2,
    marginVertical: 18,
  },
  answerText: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  previousButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  primaryButtonLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
  emptyPanel: {
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 12,
  },
  emptyText: {
    maxWidth: 320,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  completeCanvas: {
    minHeight: 390,
    borderRadius: 28,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
  },
  completeRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  completeTitle: {
    maxWidth: 340,
    fontSize: 25,
    lineHeight: 34,
    fontWeight: "900",
  },
  restartButton: {
    minWidth: 190,
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
});
