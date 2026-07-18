import React from "react";
import { StyleSheet, View } from "react-native";
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
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { ArrowLeft02Icon, ArrowRight02Icon, Cards02Icon, CheckmarkCircle02Icon, VolumeHighIcon } from "@hugeicons/core-free-icons/dist/cjs/index.js";

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

function ActionButton({
  label,
  icon,
  accent,
  isRtl,
  isKurdish,
  onPress,
}: {
  label: string;
  icon: object;
  accent: GuidebookAccent;
  isRtl: boolean;
  isKurdish: boolean;
  onPress: () => void;
}) {
  return (
    <IOSPressable
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.actionButton,
        { backgroundColor: accent.strong },
        isRtl && styles.rowReverse,
      ]}
    >
      <HugeiconsIcon
        icon={icon}
        size={19}
        color="#FFFFFF"
        strokeWidth={2.2}
      />
      <AppText
        style={[styles.actionButtonLabel, isRtl && styles.rtlText]}
        forceKurdishFont={isKurdish}
      >
        {label}
      </AppText>
    </IOSPressable>
  );
}

function PreviousButton({
  label,
  icon,
  disabled,
  onPress,
}: {
  label: string;
  icon: object;
  disabled: boolean;
  onPress: () => void;
}) {
  const { colors } = useThemeColors();

  return (
    <IOSPressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.previousButton,
        {
          backgroundColor: colors.muted,
          opacity: disabled ? 0.35 : 1,
        },
      ]}
    >
      <HugeiconsIcon
        icon={icon}
        size={20}
        color={colors.foreground}
        strokeWidth={2.2}
      />
    </IOSPressable>
  );
}

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

  if (lesson.entries.length === 0 || !entry) {
    return (
      <View
        style={[
          styles.panel,
          styles.emptyPanel,
          { backgroundColor: colors.surface },
        ]}
      >
        <HugeiconsIcon
          icon={Cards02Icon}
          size={32}
          color={colors.mutedForeground}
          strokeWidth={1.8}
        />
        <AppText
          style={[
            styles.emptyText,
            { color: colors.mutedForeground },
            isRtl && styles.rtlText,
          ]}
          forceKurdishFont={isKurdish}
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
        style={[
          styles.panel,
          styles.completePanel,
          { backgroundColor: colors.surface },
        ]}
      >
        <View style={[styles.completeIcon, { backgroundColor: accent.tint }]}>
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={40}
            color={accent.strong}
            strokeWidth={2.2}
          />
        </View>
        <AppText
          style={[
            styles.completeTitle,
            { color: colors.foreground },
            isRtl && styles.rtlText,
          ]}
          forceKurdishFont={isKurdish}
        >
          {copy.completeTitle}
        </AppText>
        <ActionButton
          label={copy.restart}
          icon={Cards02Icon}
          accent={accent}
          isRtl={isRtl}
          isKurdish={isKurdish}
          onPress={onRestart}
        />
      </Animated.View>
    );
  }

  const previousIcon = isRtl ? ArrowRight02Icon : ArrowLeft02Icon;
  const nextIcon = isRtl ? ArrowLeft02Icon : ArrowRight02Icon;

  return (
    <Animated.View
      key={`${lesson.id}-${currentIndex}`}
      entering={FadeIn.duration(170)}
      style={[styles.panel, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.practiceHeader, isRtl && styles.rowReverse]}>
        <AppText
          style={[
            styles.practiceTitle,
            { color: colors.foreground },
            isRtl && styles.rtlText,
          ]}
          forceKurdishFont={isKurdish}
        >
          {copy.practiceTitle}
        </AppText>
        <AppText
          style={[styles.cardCount, { color: colors.mutedForeground }]}
        >
          {currentIndex + 1} / {lesson.entries.length}
        </AppText>
      </View>

      <View style={[styles.flashCard, { backgroundColor: accent.tint }]}>
        <IOSPressable
          onPress={() => onSpeak(entry)}
          accessibilityRole="button"
          accessibilityLabel={`${copy.listen}: ${entry.english}`}
          style={[
            styles.practiceAudio,
            {
              backgroundColor:
                activeId === entry.id ? accent.strong : colors.surface,
            },
          ]}
        >
          <HugeiconsIcon
            icon={VolumeHighIcon}
            size={21}
            color={activeId === entry.id ? "#FFFFFF" : accent.strong}
            strokeWidth={2.2}
          />
        </IOSPressable>

        <IOSPressable
          onPress={onReveal}
          accessibilityRole="button"
          accessibilityState={{ expanded: revealed }}
          style={styles.promptBlock}
        >
          <AppText
            style={[styles.promptText, { color: colors.foreground }]}
            languageCode="en"
            align="center"
          >
            {entry.english}
          </AppText>

          {revealed ? (
            <Animated.View
              entering={FadeInDown.duration(180)}
              style={styles.answerBlock}
            >
              <AppText
                style={[styles.answerText, { color: accent.deep }]}
                languageCode="ku"
                align="center"
                forceKurdishFont
              >
                {entry.kurdish}
              </AppText>
            </Animated.View>
          ) : (
            <AppText
              style={[
                styles.revealHint,
                { color: accent.deep },
                isRtl && styles.rtlText,
              ]}
              forceKurdishFont={isKurdish}
            >
              {copy.tapToReveal}
            </AppText>
          )}
        </IOSPressable>
      </View>

      <View style={[styles.actions, isRtl && styles.rowReverse]}>
        <PreviousButton
          label={copy.previousCard}
          icon={previousIcon}
          disabled={currentIndex === 0}
          onPress={onPrevious}
        />
        <ActionButton
          label={revealed ? copy.nextCard : copy.revealAnswer}
          icon={revealed ? nextIcon : Cards02Icon}
          accent={accent}
          isRtl={isRtl}
          isKurdish={isKurdish}
          onPress={revealed ? onNext : onReveal}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rowReverse: {
    flexDirection: "row-reverse",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  panel: {
    borderRadius: 22,
    padding: 16,
  },
  emptyPanel: {
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    maxWidth: 320,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  completePanel: {
    minHeight: 380,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 20,
  },
  completeIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  completeTitle: {
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "900",
    textAlign: "center",
  },
  practiceHeader: {
    minHeight: 44,
    paddingHorizontal: 2,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  practiceTitle: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "900",
  },
  cardCount: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  flashCard: {
    minHeight: 320,
    borderRadius: 24,
    padding: 14,
  },
  practiceAudio: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  promptBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingBottom: 34,
  },
  promptText: {
    fontSize: 31,
    lineHeight: 40,
    fontWeight: "900",
    textAlign: "center",
    fontFamily: "DINNextRoundedBold",
  },
  revealHint: {
    marginTop: 20,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  answerBlock: {
    marginTop: 20,
    width: "100%",
  },
  answerText: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "800",
    textAlign: "center",
  },
  actions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  previousButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionButtonLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
});
