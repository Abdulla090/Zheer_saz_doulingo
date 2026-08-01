import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Cards02Icon,
  EyeIcon,
  EyeOffIcon,
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
  currentIndex,
  revealed,
  activeId,
  isRtl,
  isKurdish,
  onToggleMeaning,
  onNext,
  onPrevious,
  onSelect,
  onSpeak,
}: GuidebookStudyPanelProps) {
  const { colors } = useThemeColors();
  const entry = lesson.entries[currentIndex];

  if (!entry) {
    return (
      <View style={styles.emptyPanel}>
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

  const previousIcon = isRtl ? ArrowRight02Icon : ArrowLeft02Icon;
  const nextIcon = isRtl ? ArrowLeft02Icon : ArrowRight02Icon;
  const isLast = currentIndex === lesson.entries.length - 1;
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

      <View style={[styles.focusCanvas, { backgroundColor: accent.tint }]}>
        <View
          style={[
            styles.canvasToolbar,
            isRtl && Platform.OS !== "web" && styles.rowReverse,
          ]}
        >
          <View
            style={[
              styles.kindPill,
              { backgroundColor: "rgba(255,255,255,0.62)" },
            ]}
          >
            <AppText
              style={[styles.kindLabel, { color: accent.deep }]}
              forceKurdishFont={isKurdish}
            >
              {kindLabel}
            </AppText>
          </View>

          <IOSPressable
            onPress={onToggleMeaning}
            accessibilityRole="button"
            accessibilityLabel={
              revealed ? copy.meaningsOn : copy.meaningsOff
            }
            accessibilityState={{ expanded: revealed }}
            style={[
              styles.canvasIconButton,
              { backgroundColor: "rgba(255,255,255,0.62)" },
            ]}
          >
            <HugeiconsIcon
              icon={revealed ? EyeOffIcon : EyeIcon}
              size={19}
              color={accent.deep}
              strokeWidth={2.1}
            />
          </IOSPressable>
        </View>

        <View style={styles.focusCopy}>
          <AppText
            style={[styles.targetText, { color: accent.deep }]}
            languageCode={entry.targetLanguage}
            align="center"
            fullWidth
          >
            {entry.english}
          </AppText>

          <View style={[styles.artRule, { backgroundColor: accent.soft }]} />

          {revealed ? (
            <Animated.View
              entering={FadeInDown.duration(180)}
              style={styles.meaningBlock}
            >
              <AppText
                style={[styles.meaningText, { color: accent.deep }]}
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
              style={[styles.hiddenMeaning, { color: accent.deep }]}
              forceKurdishFont={isKurdish}
              align="center"
            >
              {copy.meaningsOff}
            </AppText>
          )}
        </View>

        <IOSPressable
          onPress={() => onSpeak(entry)}
          accessibilityRole="button"
          accessibilityLabel={`${copy.listen}: ${entry.english}`}
          style={[
            styles.audioButton,
            {
              backgroundColor:
                activeId === entry.id ? accent.strong : "rgba(255,255,255,0.7)",
            },
          ]}
        >
          <HugeiconsIcon
            icon={VolumeHighIcon}
            size={20}
            color={activeId === entry.id ? "#FFFFFF" : accent.deep}
            strokeWidth={2.2}
          />
        </IOSPressable>
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
          onPress={onNext}
          accessibilityRole="button"
          style={[
            styles.nextButton,
            { backgroundColor: accent.strong },
            isRtl && Platform.OS !== "web" && styles.rowReverse,
          ]}
        >
          <AppText
            style={styles.nextButtonLabel}
            forceKurdishFont={isKurdish}
          >
            {isLast ? copy.practice : copy.nextCard}
          </AppText>
          <HugeiconsIcon
            icon={isLast ? Cards02Icon : nextIcon}
            size={19}
            color="#FFFFFF"
            strokeWidth={2.2}
          />
        </IOSPressable>
      </View>

      <View style={styles.collection}>
        <AppText
          style={[styles.collectionTitle, { color: colors.mutedForeground }]}
          forceKurdishFont={isKurdish}
          align="start"
          fullWidth
        >
          {copy.more}
        </AppText>

        <View>
          {lesson.entries.map((listEntry, index) => {
            const selected = index === currentIndex;
            const isLastRow = index === lesson.entries.length - 1;
            return (
              <IOSPressable
                key={listEntry.id}
                onPress={() => onSelect(index)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[
                  styles.collectionRow,
                  isRtl && Platform.OS !== "web" && styles.rowReverse,
                  {
                    backgroundColor: selected ? accent.tint : "transparent",
                    borderBottomColor: colors.border,
                    borderBottomWidth: isLastRow ? 0 : StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.collectionNumber,
                    { color: selected ? accent.deep : colors.mutedForeground },
                  ]}
                  forceLatinFont
                >
                  {String(index + 1).padStart(2, "0")}
                </AppText>

                <View style={styles.collectionCopy}>
                  <AppText
                    style={[
                      styles.collectionTarget,
                      { color: selected ? accent.deep : colors.foreground },
                    ]}
                    languageCode={listEntry.targetLanguage}
                    align="start"
                    fullWidth
                    numberOfLines={1}
                  >
                    {listEntry.english}
                  </AppText>
                  <AppText
                    style={[
                      styles.collectionMeaning,
                      { color: colors.mutedForeground },
                    ]}
                    languageCode={listEntry.sourceLanguage}
                    align="start"
                    forceKurdishFont={listEntry.sourceLanguage === "ku"}
                    fullWidth
                    numberOfLines={1}
                  >
                    {listEntry.kurdish}
                  </AppText>
                </View>

                {selected ? (
                  <View
                    style={[
                      styles.selectedMark,
                      { backgroundColor: accent.strong },
                    ]}
                  />
                ) : null}
              </IOSPressable>
            );
          })}
        </View>
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
  focusCanvas: {
    minHeight: 324,
    borderRadius: 28,
    padding: 16,
    overflow: "hidden",
  },
  canvasToolbar: {
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
  canvasIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  focusCopy: {
    flex: 1,
    minHeight: 220,
    paddingHorizontal: 12,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  targetText: {
    fontSize: 36,
    lineHeight: 45,
    fontWeight: "900",
    fontFamily: "DINNextRoundedBold",
  },
  artRule: {
    width: 42,
    height: 3,
    borderRadius: 2,
    marginVertical: 18,
  },
  meaningBlock: {
    width: "100%",
  },
  meaningText: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "800",
  },
  hiddenMeaning: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    opacity: 0.72,
  },
  audioButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  collection: {
    paddingTop: 10,
  },
  collectionTitle: {
    paddingHorizontal: 4,
    paddingBottom: 7,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
  },
  collectionRow: {
    minHeight: 62,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  collectionNumber: {
    width: 26,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  collectionCopy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  collectionTarget: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  collectionMeaning: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  selectedMark: {
    width: 4,
    height: 22,
    borderRadius: 2,
    flexShrink: 0,
  },
  previousButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  nextButtonLabel: {
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
  },
  emptyText: {
    maxWidth: 320,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
});
