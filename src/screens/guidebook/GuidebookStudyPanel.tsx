import { VolumeHighIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { GuidebookCopy } from "./guidebook-copy";
import type {
  GuidebookEntry,
  GuidebookLessonViewModel,
} from "./guidebook-model";
import type { GuidebookAccent } from "./guidebook-theme";

type GuidebookStudyPanelProps = {
  lesson: GuidebookLessonViewModel;
  copy: GuidebookCopy;
  accent: GuidebookAccent;
  currentIndex: number;
  revealed: boolean;
  activeId: string | null;
  isRtl: boolean;
  isKurdish: boolean;
  onToggleMeaning: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
  onSpeak: (entry: GuidebookEntry) => void;
};

export function GuidebookStudyPanel({
  lesson,
  copy,
  accent,
  activeId,
  isKurdish,
  onSpeak,
}: GuidebookStudyPanelProps) {
  const { colors } = useThemeColors();
  const entries = lesson.phrases.length > 0 ? lesson.phrases : lesson.entries;

  if (entries.length === 0) {
    return (
      <View style={styles.emptyPanel}>
        <AppText
          style={[styles.emptyText, { color: colors.mutedForeground }]}
          languageCode={lesson.sourceLanguage}
          forceKurdishFont={isKurdish}
          align="center"
        >
          {copy.emptyPractice}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      {entries.map((entry, visibleIndex) => {
        const active = activeId === entry.id;
        const tailOnRight = visibleIndex % 2 === 1;

        return (
          <Animated.View
            key={entry.id}
            entering={FadeInDown.delay(Math.min(visibleIndex * 35, 175)).duration(180)}
            style={styles.bubbleWrap}
          >
            <IOSPressable
              onPress={() => {
                onSpeak(entry);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${copy.listen}: ${entry.english}`}
              accessibilityState={{ selected: active }}
              style={[
                styles.bubble,
                {
                  backgroundColor: colors.background,
                  borderColor: active ? accent.strong : colors.border,
                },
              ]}
            >
              <View style={styles.targetRow}>
                <HugeiconsIcon
                  icon={VolumeHighIcon}
                  size={25}
                  color={accent.strong}
                  strokeWidth={2.2}
                />
                <AppText
                  style={[styles.targetText, { color: colors.foreground }]}
                  languageCode={entry.targetLanguage}
                  align="start"
                  numberOfLines={3}
                >
                  {entry.english}
                </AppText>
              </View>

              <View style={[styles.phraseRule, { borderBottomColor: colors.border }]} />

              <AppText
                style={[styles.meaningText, { color: colors.mutedForeground }]}
                languageCode={entry.sourceLanguage}
                forceKurdishFont={entry.sourceLanguage === "ku"}
                align="start"
                fullWidth
                numberOfLines={3}
              >
                {entry.kurdish}
              </AppText>
            </IOSPressable>

            <View
              pointerEvents="none"
              style={[
                styles.tail,
                tailOnRight ? styles.tailRight : styles.tailLeft,
                {
                  backgroundColor: colors.background,
                  borderColor: active ? accent.strong : colors.border,
                },
              ]}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 16,
    paddingHorizontal: 9,
    paddingBottom: 8,
  },
  bubbleWrap: {
    position: "relative",
  },
  bubble: {
    minHeight: 112,
    borderWidth: 2,
    borderRadius: 25,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 9,
    overflow: "hidden",
  },
  targetRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  targetText: {
    flex: 1,
    minWidth: 0,
    fontSize: 21,
    lineHeight: 29,
    fontWeight: "700",
  },
  phraseRule: {
    height: 1,
    marginStart: 35,
    borderBottomWidth: 2,
    borderStyle: "dashed",
    opacity: 0.9,
  },
  meaningText: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "600",
  },
  tail: {
    position: "absolute",
    width: 18,
    height: 18,
    transform: [{ rotate: "45deg" }],
    zIndex: 2,
  },
  tailLeft: {
    left: -7,
    top: 28,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  tailRight: {
    right: -7,
    bottom: 26,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  emptyPanel: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
});
