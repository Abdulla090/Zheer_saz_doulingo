import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { GuidebookCopy } from "./guidebook-copy";
import type { GuidebookLessonViewModel } from "./guidebook-model";
import type { GuidebookAccent } from "./guidebook-theme";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { BookOpen02Icon, Cards02Icon } from "@hugeicons/core-free-icons/dist/cjs/index.js";

export type GuidebookMode = "study" | "practice";

type GuidebookNavigatorProps = {
  lessons: GuidebookLessonViewModel[];
  selectedIndex: number;
  accent: GuidebookAccent;
  isWide: boolean;
  onSelect: (index: number) => void;
};

export function GuidebookNavigator({
  lessons,
  selectedIndex,
  accent,
  isWide,
  onSelect,
}: GuidebookNavigatorProps) {
  const { colors } = useThemeColors();
  const mobileWebRtlProps =
    Platform.OS === "web"
      ? ({ dir: "rtl" } as Record<string, string>)
      : undefined;

  const lessonButtons = lessons.map((lesson) => {
    const selected = lesson.index === selectedIndex;

    return (
      <IOSPressable
        key={lesson.id}
        onPress={() => onSelect(lesson.index)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={[
          styles.lessonButton,
          isWide ? styles.lessonButtonWide : styles.lessonButtonCompact,
          {
            backgroundColor: selected ? accent.strong : colors.muted,
          },
        ]}
      >
        <View
          style={[
            styles.lessonNumber,
            {
              backgroundColor: selected
                ? "rgba(255,255,255,0.18)"
                : colors.surface,
            },
          ]}
        >
          <AppText
            style={[
              styles.lessonNumberText,
              { color: selected ? "#FFFFFF" : colors.mutedForeground },
            ]}
          >
            {lesson.index + 1}
          </AppText>
        </View>

        <AppText
          style={[
            styles.lessonTopic,
            { color: selected ? "#FFFFFF" : colors.foreground },
          ]}
          languageCode="ku"
          align="end"
          forceKurdishFont
          numberOfLines={2}
        >
          {lesson.topicKu}
        </AppText>
      </IOSPressable>
    );
  });

  if (!isWide) {
    return (
      <View style={styles.mobileNavigator}>
        <View {...mobileWebRtlProps}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.mobileLessonContent,
              Platform.OS !== "web" && styles.rowReverse,
            ]}
          >
            {lessonButtons}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.desktopNavigator}>
      <View style={styles.desktopLessonList}>{lessonButtons}</View>
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
    { key: "study" as const, label: copy.study, icon: BookOpen02Icon },
    { key: "practice" as const, label: copy.practice, icon: Cards02Icon },
  ];

  return (
    <View style={[styles.modeSwitch, isRtl && styles.rowReverse]}>
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
              isRtl && styles.rowReverse,
              {
                backgroundColor: active ? accent.tint : "transparent",
              },
            ]}
          >
            <HugeiconsIcon
              icon={item.icon}
              size={18}
              color={active ? accent.strong : colors.mutedForeground}
              strokeWidth={2.2}
            />
            <AppText
              style={[
                styles.modeLabel,
                {
                  color: active ? accent.deep : colors.mutedForeground,
                },
                isRtl && styles.rtlText,
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
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  mobileNavigator: {
    paddingTop: 18,
  },
  mobileLessonContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  desktopNavigator: {
    width: 248,
    flexShrink: 0,
    alignSelf: "flex-start",
  },
  desktopLessonList: {
    gap: 7,
  },
  lessonButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 9,
  },
  lessonButtonWide: {
    width: "100%",
    minHeight: 54,
    borderRadius: 18,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  lessonButtonCompact: {
    width: 132,
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  lessonNumberText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  lessonTopic: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  modeSwitch: {
    flexDirection: "row",
    gap: 8,
  },
  modeButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modeLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
});
