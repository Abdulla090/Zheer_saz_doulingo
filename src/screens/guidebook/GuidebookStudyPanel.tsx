import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

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
import { EyeIcon, EyeOffIcon, VolumeHighIcon } from "@hugeicons/core-free-icons/dist/cjs/index.js";

type GuidebookStudyPanelProps = {
  lesson: GuidebookLessonViewModel;
  copy: GuidebookCopy;
  accent: GuidebookAccent;
  showMeanings: boolean;
  activeId: string | null;
  isRtl: boolean;
  isKurdish: boolean;
  onToggleMeanings: () => void;
  onSpeak: (entry: GuidebookEntry) => void;
};

function StudyEntryRow({
  entry,
  copy,
  accent,
  showMeanings,
  active,
  isRtl,
  onSpeak,
}: {
  entry: GuidebookEntry;
  copy: GuidebookCopy;
  accent: GuidebookAccent;
  showMeanings: boolean;
  active: boolean;
  isRtl: boolean;
  onSpeak: () => void;
}) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      layout={LinearTransition.duration(180)}
      style={[
        styles.entryRow,
        isRtl && styles.rowReverse,
        { backgroundColor: active ? accent.tint : "transparent" },
      ]}
    >
      <View
        style={[
          styles.entryCopy,
          { alignItems: isRtl ? "flex-end" : "flex-start" },
        ]}
      >
        <AppText
          style={[
            styles.englishText,
            { color: active ? accent.deep : colors.foreground },
          ]}
          languageCode="en"
          align={isRtl ? "end" : "start"}
          fullWidth
        >
          {entry.english}
        </AppText>

        {showMeanings ? (
          <Animated.View entering={FadeIn.duration(150)} style={styles.meaning}>
            <AppText
              style={[styles.kurdishText, { color: colors.mutedForeground }]}
              languageCode="ku"
              align={isRtl ? "end" : "start"}
              forceKurdishFont
              fullWidth
            >
              {entry.kurdish}
            </AppText>
          </Animated.View>
        ) : null}
      </View>

      <IOSPressable
        onPress={onSpeak}
        accessibilityRole="button"
        accessibilityLabel={`${copy.listen}: ${entry.english}`}
        style={[
          styles.audioButton,
          {
            backgroundColor: active ? accent.strong : colors.muted,
          },
        ]}
      >
        <HugeiconsIcon
          icon={VolumeHighIcon}
          size={18}
          color={active ? "#FFFFFF" : accent.strong}
          strokeWidth={2.2}
        />
      </IOSPressable>
    </Animated.View>
  );
}

function StudySection({
  title,
  entries,
  copy,
  accent,
  showMeanings,
  activeId,
  isRtl,
  isKurdish,
  onSpeak,
}: {
  title: string;
  entries: GuidebookEntry[];
  copy: GuidebookCopy;
  accent: GuidebookAccent;
  showMeanings: boolean;
  activeId: string | null;
  isRtl: boolean;
  isKurdish: boolean;
  onSpeak: (entry: GuidebookEntry) => void;
}) {
  const { colors } = useThemeColors();
  if (entries.length === 0) return null;

  return (
    <View style={styles.section}>
      <AppText
        style={[
          styles.sectionTitle,
          { color: colors.foreground },
          isRtl && styles.rtlText,
        ]}
        forceKurdishFont={isKurdish}
      >
        {title}
      </AppText>

      <View style={styles.entryList}>
        {entries.map((entry) => (
          <StudyEntryRow
            key={entry.id}
            entry={entry}
            copy={copy}
            accent={accent}
            showMeanings={showMeanings}
            active={activeId === entry.id}
            isRtl={isRtl}
            onSpeak={() => onSpeak(entry)}
          />
        ))}
      </View>
    </View>
  );
}

export function GuidebookStudyPanel({
  lesson,
  copy,
  accent,
  showMeanings,
  activeId,
  isRtl,
  isKurdish,
  onToggleMeanings,
  onSpeak,
}: GuidebookStudyPanelProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      key={lesson.id}
      entering={FadeIn.duration(180)}
      style={[styles.panel, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.panelHeader, isRtl && styles.rowReverse]}>
        <View
          style={[
            styles.panelHeading,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          <AppText
            style={[styles.lessonTitle, { color: colors.foreground }]}
            languageCode="ku"
            align="end"
            forceKurdishFont
          >
            {lesson.topicKu}
          </AppText>
          <AppText
            style={[styles.lessonTranslation, { color: colors.mutedForeground }]}
            languageCode="en"
            align="end"
          >
            {lesson.topic}
          </AppText>
        </View>

        <IOSPressable
          onPress={onToggleMeanings}
          accessibilityRole="button"
          accessibilityLabel={
            showMeanings ? copy.meaningsOn : copy.meaningsOff
          }
          accessibilityState={{ expanded: showMeanings }}
          style={[
            styles.meaningToggle,
            {
              backgroundColor: showMeanings ? accent.tint : colors.muted,
            },
          ]}
        >
          <HugeiconsIcon
            icon={showMeanings ? EyeOffIcon : EyeIcon}
            size={19}
            color={showMeanings ? accent.strong : colors.mutedForeground}
            strokeWidth={2.2}
          />
        </IOSPressable>
      </View>

      <StudySection
        title={copy.vocabulary}
        entries={lesson.words}
        copy={copy}
        accent={accent}
        showMeanings={showMeanings}
        activeId={activeId}
        isRtl={isRtl}
        isKurdish={isKurdish}
        onSpeak={onSpeak}
      />
      <StudySection
        title={copy.keyPhrases}
        entries={lesson.phrases}
        copy={copy}
        accent={accent}
        showMeanings={showMeanings}
        activeId={activeId}
        isRtl={isRtl}
        isKurdish={isKurdish}
        onSpeak={onSpeak}
      />
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
    paddingVertical: 8,
  },
  panelHeader: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  panelHeading: {
    flex: 1,
    minWidth: 0,
  },
  lessonTitle: {
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "900",
    fontFamily: "DINNextRoundedBold",
  },
  lessonTranslation: {
    marginTop: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  meaningToggle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  section: {
    paddingTop: 12,
  },
  sectionTitle: {
    paddingHorizontal: 18,
    marginBottom: 4,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "900",
  },
  entryList: {
    paddingHorizontal: 6,
  },
  entryRow: {
    minHeight: 68,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  entryCopy: {
    flex: 1,
    minWidth: 0,
  },
  englishText: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
  },
  meaning: {
    width: "100%",
    marginTop: 2,
  },
  kurdishText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
