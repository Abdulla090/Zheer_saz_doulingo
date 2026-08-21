import React, { useEffect, useRef } from "react";
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
  const scrollRef = useRef<ScrollView>(null);

  // Keep the active chapter dot smoothly in view
  useEffect(() => {
    if (!isWide && scrollRef.current && lessons.length > 0) {
      const itemWidth = 38 + 8; // chapterDot width 38 + gap 8
      const x = Math.max(0, selectedIndex * itemWidth - 16);
      scrollRef.current.scrollTo({ x, animated: true });
    }
  }, [isWide, selectedIndex, lessons.length]);

  if (!isWide) {
    return (
      <View style={styles.mobileNavigator}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mobileLessonContent}
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
        { borderBottomColor: colors.border },
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
            style={styles.modeButton}
          >
            <AppText
              style={[
                styles.modeLabel,
                { color: active ? accent.strong : colors.mutedForeground },
              ]}
              forceKurdishFont={isKurdish}
            >
              {item.label}
            </AppText>
            <View
              style={[
                styles.modeIndicator,
                { backgroundColor: active ? accent.strong : "transparent" },
              ]}
            />
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
    paddingTop: 4,
  },
  mobileLessonContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
  },
  chapterDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    minHeight: 46,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modeButton: {
    flex: 1,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    position: "relative",
  },
  modeLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
  },
  modeIndicator: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: -1,
    height: 3,
    borderRadius: 2,
  },
});
