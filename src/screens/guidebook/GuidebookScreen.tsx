/* eslint-disable */
import React, { useCallback, useMemo, useState } from "react";
import { IOSPressable as Pressable } from "../../components/ui/ios-pressable";
import { View, StyleSheet, Text, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { AppText } from "../../components/ui/AppText";
import { BUTTON_FACE_RIM_COLORS } from "../../constants/button-theme-colors";
import { getGuidebook } from "../../data/guidebook-data";
import type { LessonPathMode } from "../../data/lesson-content";
import { useI18n } from "../../hooks/useI18n";
import { useTTS } from "../../hooks/use-tts";
import { useThemeColors } from "../../hooks/useThemeColors";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { BookOpen02Icon, Message01Icon, GraduationCapIcon, VolumeHighIcon, ChevronDownIcon, Cancel01Icon } from "@hugeicons/core-free-icons/dist/cjs/index.js";

// ─── Color Utils ─────────────────────────────────────────────────────────────
const hexWithAlpha = (hex: string, alpha: number) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}${a}`;
};

function parseSearchParam(
  raw: string | string[] | undefined,
): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function parseUnitIndex(raw: string | string[] | undefined): number {
  const n = Number.parseInt(parseSearchParam(raw) ?? "0", 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parsePathMode(raw: string | string[] | undefined): LessonPathMode {
  const mode = parseSearchParam(raw);
  if (mode === "normal") return "normal";
  if (mode === "kids") return "kids";
  return "street";
}

const GUIDEBOOK_COPY = {
  en: {
    subtitle: "Review before the lesson",
    lessons: "Lessons",
    words: "Words",
    phrases: "Phrases",
    vocabulary: "Vocabulary",
    keyPhrases: "Key Phrases",
    notAvailable: "Not available",
    languageStackFull: "English / Sorani / Arabic",
    languageStackPartial: "English / Sorani",
    soraniLabel: "Sorani",
    arabicLabel: "Arabic",
  },
  ku: {
    subtitle: "پێش وانەکە پێداچوونەوە بکە",
    lessons: "وانە",
    words: "وشە",
    phrases: "دەستەواژە",
    vocabulary: "وشەکان",
    keyPhrases: "دەستەواژە گرنگەکان",
    notAvailable: "بەردەست نییە",
    languageStackFull: "ئینگلیزی / سۆرانی / عەرەبی",
    languageStackPartial: "ئینگلیزی / سۆرانی",
    soraniLabel: "سۆرانی",
    arabicLabel: "عەرەبی",
  },
  ar: {
    subtitle: "راجع قبل الدرس",
    lessons: "دروس",
    words: "كلمات",
    phrases: "عبارات",
    vocabulary: "المفردات",
    keyPhrases: "عبارات مهمة",
    notAvailable: "غير متاح",
    languageStackFull: "الإنجليزية / السورانية / العربية",
    languageStackPartial: "الإنجليزية / السورانية",
    soraniLabel: "سوراني",
    arabicLabel: "عربي",
  },
} as const;

function getGuidebookCopy(locale: string) {
  if (locale === "ku") return GUIDEBOOK_COPY.ku;
  if (locale === "ar") return GUIDEBOOK_COPY.ar;
  return GUIDEBOOK_COPY.en;
}

// ─── Shared Components ────────────────────────────────────────────────────────

function CloseBtn({ onPress }: { onPress: () => void }) {
  const ty = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));
  return (
    <Pressable
      onPressIn={() => {
        ty.value = withTiming(3, { duration: 65 });
      }}
      onPressOut={() => {
        ty.value = withSpring(0, { damping: 14, stiffness: 200, mass: 0.7 });
      }}
      onPress={onPress}
    >
      <View
        style={{
          borderRadius: 20,
          backgroundColor: "rgba(0,0,0,0.2)",
          paddingBottom: 3,
        }}
      >
        <Animated.View
          style={[
            {
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.25)",
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
            style,
          ]}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color="#FFFFFF" />
        </Animated.View>
      </View>
    </Pressable>
  );
}

function TTSPill({
  onPress,
  isActive,
  faceColor,
  rimColor,
}: {
  onPress: () => void;
  isActive: boolean;
  faceColor: string;
  rimColor: string;
}) {
  const { colors: themeColors } = useThemeColors();
  const p = useSharedValue(0);
  const ty = useSharedValue(0);

  React.useEffect(() => {
    p.value = withTiming(isActive ? 1 : 0, { duration: 180 });
  }, [isActive]);

  const shadowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [themeColors.border, rimColor]),
  }));
  const faceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [themeColors.surfaceRaised, faceColor]),
    transform: [{ translateY: ty.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          borderRadius: 14,
          minWidth: 46,
          minHeight: 46,
          justifyContent: "center",
        },
        shadowStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            borderRadius: 14,
            marginBottom: 3,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          },
          faceStyle,
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={() => {
            ty.value = withTiming(3, { duration: 65 });
          }}
          onPressOut={() => {
            ty.value = withTiming(0, { duration: 100 });
          }}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HugeiconsIcon icon={VolumeHighIcon} size={20} color={isActive ? "#FFFFFF" : faceColor} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ─── List Components ──────────────────────────────────────────────────────────

function HeroSection({
  item,
  faceColor,
  rimColor,
  insets,
  onClose,
}: {
  item: any;
  faceColor: string;
  rimColor: string;
  insets: any;
  onClose: () => void;
}) {
  return (
    <View
      style={{
        backgroundColor: rimColor,
        paddingBottom: 8,
        marginBottom: 16,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
      }}
    >
      <View
        style={{
          backgroundColor: faceColor,
          paddingTop: insets.top,
          paddingHorizontal: 20,
          paddingBottom: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        {/* Top Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            marginBottom: 20,
          }}
        >
          <CloseBtn onPress={onClose} />
          {item.unitLabel && (
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 24,
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                  fontWeight: "900",
                }}
              >
                {item.unitLabel}
              </Text>
            </View>
          )}
        </View>

        {/* Title Block */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.25)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.4)",
              flexShrink: 0,
            }}
          >
            <HugeiconsIcon icon={GraduationCapIcon} size={52} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <AppText
              style={{
                color: "#FFF",
                fontSize: 26,
                fontWeight: "900",
                lineHeight: 34,
                flexShrink: 1,
              }}
              numberOfLines={3}
            >
              {item.title}
            </AppText>
            <AppText
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 16,
                fontWeight: "700",
                marginTop: 6,
                flexShrink: 1,
              }}
              numberOfLines={2}
            >
              {item.subtitle}
            </AppText>
            {item.languageStack ? (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  marginTop: 10,
                  maxWidth: "100%",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: "900",
                    flexShrink: 1,
                  }}
                >
                  {item.languageStack}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Stats Strip */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "rgba(0,0,0,0.15)",
            borderRadius: 20,
            padding: 18,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <StatItem value={item.lessonsCount} label={item.lessonsLabel} />
          <View
            style={{
              width: 2,
              height: 32,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
          <StatItem value={item.wordsCount} label={item.wordsLabel} />
          <View
            style={{
              width: 2,
              height: 32,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
          <StatItem value={item.phrasesCount} label={item.phrasesLabel} />
        </View>
      </View>
    </View>
  );
}

function StatItem({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ color: "#FFF", fontSize: 24, fontWeight: "900" }}>
        {value}
      </Text>
      <Text
        style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: 13,
          fontWeight: "800",
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function LessonHeader({
  item,
  faceColor,
  rimColor,
  onToggle,
}: {
  item: any;
  faceColor: string;
  rimColor: string;
  onToggle: () => void;
}) {
  const { colors: themeColors } = useThemeColors();
  const ty = useSharedValue(0);
  const rot = useSharedValue(item.isOpen ? 90 : 0);

  React.useEffect(() => {
    rot.value = withTiming(item.isOpen ? 90 : 0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  }, [item.isOpen]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));
  const chevStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value}deg` }],
  }));

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 12, marginTop: 12 }}>
      <Pressable
        onPress={onToggle}
        onPressIn={() => {
          ty.value = withTiming(4, { duration: 60 });
        }}
        onPressOut={() => {
          ty.value = withSpring(0, { damping: 14, stiffness: 200, mass: 0.7 });
        }}
      >
        <View
          style={{
            backgroundColor: themeColors.border,
            borderRadius: 20,
            paddingBottom: 4,
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: themeColors.surface,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: themeColors.border,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
              },
              cardStyle,
            ]}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                backgroundColor: faceColor,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "900" }}>
                {item.index + 1}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "800", color: themeColors.foreground }}
              >
                {item.topicEn}
              </Text>
              <AppText
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: themeColors.mutedForeground,
                  marginTop: 2,
                  textAlign: "right",
                  writingDirection: "rtl",
                }}
                forceKurdishFont
              >
                {item.topicKu}
              </AppText>
              {item.topicAr ? (
                <AppText
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: themeColors.mutedForeground,
                    marginTop: 2,
                    textAlign: "right",
                    writingDirection: "rtl",
                  }}
                  forceKurdishFont
                >
                  {item.topicAr}
                </AppText>
              ) : null}
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: hexWithAlpha(faceColor, 0.1),
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
              >
                <HugeiconsIcon icon={BookOpen02Icon} size={14} color={faceColor} />
                <Text
                  style={{ color: faceColor, fontWeight: "800", fontSize: 14 }}
                >
                  {item.wordsCount}
                </Text>
              </View>
              <Animated.View style={chevStyle}>
                <HugeiconsIcon icon={ChevronDownIcon} size={22} color={faceColor} />
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}

function SectionHeader({ item, faceColor }: { item: any; faceColor: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 12,
        marginBottom: 16,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: hexWithAlpha(faceColor, 0.15),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.iconType === "vocab" ? (
          <HugeiconsIcon icon={BookOpen02Icon} size={20} color={faceColor} />
        ) : (
          <HugeiconsIcon icon={Message01Icon} size={18} color={faceColor} />
        )}
      </View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "900",
          color: faceColor,
        }}
      >
        {item.label}
      </Text>
    </View>
  );
}

function TranslationLine({
  label,
  text,
  color = "#777777",
}: {
  label: string;
  text?: string;
  color?: string;
}) {
  const { colors: themeColors, isDark } = useThemeColors();
  if (!text) return null;
  const resolvedColor = isDark ? themeColors.mutedForeground : color;

  return (
    <View style={styles.translationLine}>
      <Text style={[styles.translationLabel, { color: resolvedColor }]}>{label}</Text>
      <AppText
        style={[styles.translationText, { color: resolvedColor }]}
        forceKurdishFont
      >
        {text}
      </AppText>
    </View>
  );
}

function WordCard({
  item,
  faceColor,
  rimColor,
  isActive,
  onSpeak,
  copy,
}: {
  item: any;
  faceColor: string;
  rimColor: string;
  isActive: boolean;
  onSpeak: () => void;
  copy: ReturnType<typeof getGuidebookCopy>;
}) {
  const { colors: themeColors, isDark } = useThemeColors();
  const ty = useSharedValue(0);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));

  return (
    <View style={{ marginBottom: 12, paddingHorizontal: 16 }}>
      <Pressable
        onPress={onSpeak}
        onPressIn={() => {
          ty.value = withTiming(4, { duration: 60 });
        }}
        onPressOut={() => {
          ty.value = withSpring(0, { damping: 14, stiffness: 200, mass: 0.7 });
        }}
      >
        <View
          style={{
            backgroundColor: isActive
              ? hexWithAlpha(faceColor, 0.4)
              : themeColors.border,
            borderRadius: 16,
            paddingBottom: 4,
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: isActive
                  ? (isDark ? themeColors.surfaceRaised : hexWithAlpha(faceColor, 0.08))
                  : themeColors.surface,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isActive ? faceColor : themeColors.border,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
              },
              cardStyle,
            ]}
          >
            <View style={{ flex: 1, paddingEnd: 16 }}>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: "800",
                  color: faceColor,
                  marginBottom: 4,
                }}
              >
                {item.english}
              </Text>
              <TranslationLine label={copy.soraniLabel} text={item.kurdish} />
              <TranslationLine
                label={copy.arabicLabel}
                text={item.arabic}
                color="#5F6368"
              />
            </View>
            <TTSPill
              onPress={onSpeak}
              isActive={isActive}
              faceColor={faceColor}
              rimColor={rimColor}
            />
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}

function PhraseCard({
  item,
  faceColor,
  rimColor,
  isActive,
  onSpeak,
  copy,
}: {
  item: any;
  faceColor: string;
  rimColor: string;
  isActive: boolean;
  onSpeak: () => void;
  copy: ReturnType<typeof getGuidebookCopy>;
}) {
  const { colors: themeColors, isDark } = useThemeColors();
  const ty = useSharedValue(0);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));

  return (
    <View style={{ marginBottom: 12, paddingHorizontal: 16 }}>
      <Pressable
        onPress={onSpeak}
        onPressIn={() => {
          ty.value = withTiming(4, { duration: 60 });
        }}
        onPressOut={() => {
          ty.value = withSpring(0, { damping: 14, stiffness: 200, mass: 0.7 });
        }}
      >
        <View
          style={{
            backgroundColor: isActive
              ? hexWithAlpha(faceColor, 0.4)
              : themeColors.border,
            borderRadius: 16,
            paddingBottom: 4,
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: isActive
                  ? (isDark ? themeColors.surfaceRaised : hexWithAlpha(faceColor, 0.08))
                  : themeColors.surface,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isActive ? faceColor : themeColors.border,
                padding: 16,
              },
              cardStyle,
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: themeColors.foreground,
                  flex: 1,
                  lineHeight: 26,
                  paddingEnd: 12,
                }}
              >
                {item.english}
              </Text>
              <TTSPill
                onPress={onSpeak}
                isActive={isActive}
                faceColor={faceColor}
                rimColor={rimColor}
              />
            </View>
            <View
              style={{
                height: 2,
                backgroundColor: themeColors.border,
                marginBottom: 14,
                borderRadius: 1,
              }}
            />
            <TranslationLine
              label={copy.soraniLabel}
              text={item.kurdish}
              color="#777777"
            />
            <TranslationLine
              label={copy.arabicLabel}
              text={item.arabic}
              color="#5F6368"
            />
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

type GuidebookItem =
  | {
      type: "hero";
      unitLabel?: string;
      title: string;
      subtitle: string;
      languageStack: string;
      lessonsCount: number;
      wordsCount: number;
      phrasesCount: number;
      lessonsLabel: string;
      wordsLabel: string;
      phrasesLabel: string;
    }
  | {
      type: "lesson_header";
      index: number;
      topicEn: string;
      topicKu: string;
      topicAr?: string;
      wordsCount: number;
      isOpen: boolean;
    }
  | {
      type: "section_header";
      label: string;
      iconType: "vocab" | "phrase";
      count: number;
    }
  | { type: "word"; id: string; english: string; kurdish: string; arabic?: string }
  | { type: "phrase"; id: string; english: string; kurdish: string; arabic?: string }
  | { type: "spacer"; height: number };

export default function GuidebookScreen() {
  const { unit, mode } = useLocalSearchParams<{
    unit?: string;
    mode?: string;
  }>();
  const unitIndex = parseUnitIndex(unit);
  const pathMode = parsePathMode(mode);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { locale } = useI18n();
  const { colors: themeColors } = useThemeColors();
  const { speak, stop, activeId } = useTTS();
  const copy = useMemo(() => getGuidebookCopy(locale), [locale]);

  const guidebook = useMemo(
    () => getGuidebook(pathMode, unitIndex, locale),
    [pathMode, unitIndex, locale],
  );

  const theme = (guidebook?.displayTheme ??
    "blue") as keyof typeof BUTTON_FACE_RIM_COLORS;
  const colors = BUTTON_FACE_RIM_COLORS[theme] ?? BUTTON_FACE_RIM_COLORS.blue;

  const totalWords = useMemo(
    () => guidebook?.lessons.reduce((s, l) => s + l.words.length, 0) ?? 0,
    [guidebook],
  );
  const totalPhrases = useMemo(
    () => guidebook?.lessons.reduce((s, l) => s + l.phrases.length, 0) ?? 0,
    [guidebook],
  );
  const hasArabicContent = useMemo(
    () =>
      guidebook?.lessons.some(
        (lesson) =>
          Boolean(lesson.topicAr) ||
          lesson.words.some((word) => Boolean(word.arabic)) ||
          lesson.phrases.some((phrase) => Boolean(phrase.arabic)),
      ) ?? false,
    [guidebook],
  );

  const handleSpeak = useCallback(
    (text: string, id: string) => {
      if (activeId === id) stop();
      else speak(text, "en", id);
    },
    [activeId, speak, stop],
  );

  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(
    new Set([0]),
  );

  const toggleLesson = useCallback((index: number) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const listData = useMemo(() => {
    if (!guidebook) return [];
    const items: GuidebookItem[] = [];

    // 1. Hero
    const [rawUnitLabel, ...rest] = guidebook.title.split(":");
    items.push({
      type: "hero",
      unitLabel: rawUnitLabel?.trim(),
      title: rest.join(":").trim(),
      subtitle: copy.subtitle,
      languageStack: hasArabicContent
        ? copy.languageStackFull
        : copy.languageStackPartial,
      lessonsCount: guidebook.lessons.length,
      wordsCount: totalWords,
      phrasesCount: totalPhrases,
      lessonsLabel: copy.lessons,
      wordsLabel: copy.words,
      phrasesLabel: copy.phrases,
    });

    // 2. Lessons
    guidebook.lessons.forEach((lesson, i) => {
      const isOpen = expandedLessons.has(i);
      items.push({
        type: "lesson_header",
        index: i,
        topicEn: lesson.topic,
        topicKu: lesson.topicKu,
        topicAr: lesson.topicAr,
        wordsCount: lesson.words.length,
        isOpen,
      });

      if (isOpen) {
        if (lesson.words.length > 0) {
          items.push({
            type: "section_header",
            label: copy.vocabulary,
            iconType: "vocab",
            count: lesson.words.length,
          });
          lesson.words.forEach((w, wIndex) => {
            items.push({
              type: "word",
              id: `w-${i}-${wIndex}`,
              english: w.english,
              kurdish: w.kurdish,
              arabic: w.arabic,
            });
          });
        }
        if (lesson.phrases.length > 0) {
          items.push({
            type: "section_header",
            label: copy.keyPhrases,
            iconType: "phrase",
            count: lesson.phrases.length,
          });
          lesson.phrases.forEach((p, pIndex) => {
            items.push({
              type: "phrase",
              id: `p-${i}-${pIndex}`,
              english: p.english,
              kurdish: p.kurdish,
              arabic: p.arabic,
            });
          });
        }
        items.push({ type: "spacer", height: 16 });
      }
    });

    return items;
  }, [copy, expandedLessons, guidebook, hasArabicContent, totalWords, totalPhrases]);

  if (!guidebook) {
    return (
      <View
        style={{ flex: 1, paddingTop: insets.top, backgroundColor: themeColors.background }}
      >
        <Text style={{ color: themeColors.mutedForeground, textAlign: "center", marginTop: 80 }}>
          {copy.notAvailable}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: themeColors.background }]}>
      <FlashList
        data={listData}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        getItemType={(item) => item.type}
        renderItem={({ item }) => {
          switch (item.type) {
            case "hero":
              return (
                <HeroSection
                  item={item}
                  faceColor={colors.face}
                  rimColor={colors.rim}
                  insets={insets}
                  onClose={() => {
                    stop();
                    router.back();
                  }}
                />
              );
            case "lesson_header":
              return (
                <LessonHeader
                  item={item}
                  faceColor={colors.face}
                  rimColor={colors.rim}
                  onToggle={() => toggleLesson(item.index)}
                />
              );
            case "section_header":
              return <SectionHeader item={item} faceColor={colors.face} />;
            case "word":
              return (
                <WordCard
                  item={item}
                  faceColor={colors.face}
                  rimColor={colors.rim}
                  isActive={activeId === item.id}
                  onSpeak={() => handleSpeak(item.english, item.id)}
                  copy={copy}
                />
              );
            case "phrase":
              return (
                <PhraseCard
                  item={item}
                  faceColor={colors.face}
                  rimColor={colors.rim}
                  isActive={activeId === item.id}
                  onSpeak={() => handleSpeak(item.english, item.id)}
                  copy={copy}
                />
              );
            case "spacer":
              return <View style={{ height: item.height }} />;
            default:
              return null;
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6F9" },
  translationLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 5,
  },
  translationLabel: {
    minWidth: 54,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 18,
  },
  translationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
