import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { GuidebookCopy } from "./guidebook-copy";
import type { GuidebookLessonViewModel } from "./guidebook-model";
import type { GuidebookAccent } from "./guidebook-theme";

export type GuidebookMode = "study" | "practice";

type GuidebookNavigatorProps = {
  lessons: GuidebookLessonViewModel[];
  selectedIndex: number;
  accent: GuidebookAccent;
  isWide: boolean;
  isRtl: boolean;
  onSelect: (index: number) => void;
};

export function GuidebookNavigator({
  lessons,
  selectedIndex,
  accent,
  isWide,
  isRtl,
  onSelect,
}: GuidebookNavigatorProps) {
  const { colors } = useThemeColors();
  const webDirection =
    Platform.OS === "web"
      ? ({ dir: isRtl ? "rtl" : "ltr" } as Record<string, string>)
      : undefined;

  if (!isWide) {
    return (
      <View style={styles.mobileNavigator} {...webDirection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.mobileLessonContent,
            isRtl && Platform.OS !== "web" && styles.rowReverse,
          ]}
        >
          {lessons.map((lesson) => {
            const selected = lesson.index === selectedIndex;
            return (
              <IOSPressable
                key={lesson.id}
                onPress={() => onSelect(lesson.index)}
                accessibilityRole="button"
                accessibilityLabel={`${lesson.index + 1}. ${lesson.topicKu}`}
                accessibilityState={{ selected }}
                style={[
                  styles.chapterDot,
                  {
                    backgroundColor: selected ? accent.strong : "transparent",
                    borderColor: selected ? accent.strong : colors.border,
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.chapterDotText,
                    { color: selected ? "#FFFFFF" : colors.mutedForeground },
                  ]}
                  forceLatinFont
                >
                  {lesson.index + 1}
                </AppText>
              </IOSPressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.desktopNavigator}>
      {lessons.map((lesson) => {
        const selected = lesson.index === selectedIndex;
        return (
          <IOSPressable
            key={lesson.id}
            onPress={() => onSelect(lesson.index)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[
              styles.lessonRow,
              isRtl && Platform.OS !== "web" && styles.rowReverse,
              { backgroundColor: selected ? accent.tint : "transparent" },
            ]}
          >
            <View
              style={[
                styles.lessonNumber,
                {
                  backgroundColor: selected ? accent.strong : colors.muted,
                },
              ]}
            >
              <AppText
                style={[
                  styles.lessonNumberText,
                  { color: selected ? "#FFFFFF" : colors.mutedForeground },
                ]}
                forceLatinFont
              >
                {lesson.index + 1}
              </AppText>
            </View>

            <AppText
              style={[
                styles.lessonTopic,
                { color: selected ? accent.deep : colors.foreground },
              ]}
              languageCode={lesson.sourceLanguage}
              align="start"
              forceKurdishFont={lesson.sourceLanguage === "ku"}
              numberOfLines={2}
            >
              {lesson.topicKu}
            </AppText>
          </IOSPressable>
        );
      })}
    </View>
  );
}

export function GuidebookModeSwitch({
  mode,
  onChange,
  copy,
  accent,
  isRtl,
  isKurdish,
}: {
  mode: GuidebookMode;
  onChange: (mode: GuidebookMode) => void;
  copy: GuidebookCopy;
  accent: GuidebookAccent;
  isRtl: boolean;
  isKurdish: boolean;
}) {
  const { colors } = useThemeColors();
  const items = [
    { key: "study" as const, label: copy.study },
    { key: "practice" as const, label: copy.practice },
  ];

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.modeSwitch,
        { backgroundColor: colors.muted },
        isRtl && Platform.OS !== "web" && styles.rowReverse,
      ]}
    >
      {items.map((item) => {
        const active = mode === item.key;
        return (
          <IOSPressable
            key={item.key}
            onPress={() => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[
              styles.modeButton,
              { backgroundColor: active ? accent.strong : "transparent" },
            ]}
          >
            <AppText
              style={[
                styles.modeLabel,
                { color: active ? "#FFFFFF" : colors.mutedForeground },
              ]}
              forceKurdishFont={isKurdish}
            >
              {item.label}
            </AppText>
          </IOSPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rowReverse: {
    flexDirection: "row-reverse",
  },
  mobileNavigator: {
    paddingTop: 18,
  },
  mobileLessonContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chapterDot: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chapterDotText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  desktopNavigator: {
    width: 226,
    flexShrink: 0,
    alignSelf: "flex-start",
    gap: 3,
  },
  lessonRow: {
    width: "100%",
    minHeight: 54,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  lessonNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  lessonNumberText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  lessonTopic: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
  },
  modeSwitch: {
    minHeight: 50,
    padding: 4,
    borderRadius: 18,
    flexDirection: "row",
    gap: 4,
  },
  modeButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  modeLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
});
