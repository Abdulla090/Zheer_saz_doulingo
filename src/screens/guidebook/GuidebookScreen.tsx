/* eslint-disable */
import React, { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Text, Pressable, Platform } from "react-native";
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
import { getGuidebook, GuidebookLesson } from "../../data/guidebook-data";
import type { LessonPathMode } from "../../data/lesson-content";
import { useI18n } from "../../hooks/useI18n";
import { useTTS } from "../../hooks/use-tts";
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
  const p = useSharedValue(0);
  const ty = useSharedValue(0);

  React.useEffect(() => {
    p.value = withTiming(isActive ? 1 : 0, { duration: 180 });
  }, [isActive]);

  const shadowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], ["#E5E5E5", rimColor]),
  }));
  const faceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], ["#FFFFFF", faceColor]),
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
                  textTransform: "uppercase",
                  letterSpacing: 1,
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
            }}
          >
            <HugeiconsIcon icon={GraduationCapIcon} size={52} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#FFF",
                fontSize: 26,
                fontWeight: "900",
                lineHeight: 34,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 16,
                fontWeight: "700",
                marginTop: 6,
              }}
            >
              {item.subtitle}
            </Text>
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
          <StatItem value={item.lessonsCount} label="Lessons" />
          <View
            style={{
              width: 2,
              height: 32,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
          <StatItem value={item.wordsCount} label="Words" />
          <View
            style={{
              width: 2,
              height: 32,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
          <StatItem value={item.phrasesCount} label="Phrases" />
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
          textTransform: "uppercase",
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
            backgroundColor: "#E5E5E5",
            borderRadius: 20,
            paddingBottom: 4,
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: "#FFF",
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#E5E5E5",
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
                style={{ fontSize: 18, fontWeight: "800", color: "#4B4B4B" }}
              >
                {item.topicEn}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#AFAFAF",
                  marginTop: 2,
                }}
              >
                {item.topicKu}
              </Text>
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
          textTransform: "uppercase",
          letterSpacing: 1.5,
        }}
      >
        {item.label}
      </Text>
    </View>
  );
}

function WordCard({
  item,
  faceColor,
  rimColor,
  isActive,
  onSpeak,
}: {
  item: any;
  faceColor: string;
  rimColor: string;
  isActive: boolean;
  onSpeak: () => void;
}) {
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
              : "#E5E5E5",
            borderRadius: 16,
            paddingBottom: 4,
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: isActive
                  ? hexWithAlpha(faceColor, 0.08)
                  : "#FFFFFF",
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isActive ? faceColor : "#E5E5E5",
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
              },
              cardStyle,
            ]}
          >
            <View style={{ flex: 1, paddingRight: 16 }}>
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
              <AppText
                style={{ fontSize: 17, fontWeight: "700", color: "#777777" }}
                forceKurdishFont
              >
                {item.kurdish}
              </AppText>
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
}: {
  item: any;
  faceColor: string;
  rimColor: string;
  isActive: boolean;
  onSpeak: () => void;
}) {
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
              : "#E5E5E5",
            borderRadius: 16,
            paddingBottom: 4,
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: isActive
                  ? hexWithAlpha(faceColor, 0.08)
                  : "#FFFFFF",
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isActive ? faceColor : "#E5E5E5",
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
                  color: "#4B4B4B",
                  flex: 1,
                  lineHeight: 26,
                  paddingRight: 12,
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
                backgroundColor: "#F0F0F0",
                marginBottom: 14,
                borderRadius: 1,
              }}
            />
            <AppText
              style={{
                fontSize: 17,
                color: "#9F9F9F",
                fontWeight: "700",
                writingDirection: "rtl",
              }}
              forceKurdishFont
            >
              {item.kurdish}
            </AppText>
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
      lessonsCount: number;
      wordsCount: number;
      phrasesCount: number;
    }
  | {
      type: "lesson_header";
      index: number;
      topicEn: string;
      topicKu: string;
      wordsCount: number;
      isOpen: boolean;
    }
  | {
      type: "section_header";
      label: string;
      iconType: "vocab" | "phrase";
      count: number;
    }
  | { type: "word"; id: string; english: string; kurdish: string }
  | { type: "phrase"; id: string; english: string; kurdish: string }
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
  const { speak, stop, activeId } = useTTS();

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
      subtitle: "Guidebook — tap any word to hear it",
      lessonsCount: guidebook.lessons.length,
      wordsCount: totalWords,
      phrasesCount: totalPhrases,
    });

    // 2. Lessons
    guidebook.lessons.forEach((lesson, i) => {
      const isOpen = expandedLessons.has(i);
      items.push({
        type: "lesson_header",
        index: i,
        topicEn: lesson.topic,
        topicKu: lesson.topicKu,
        wordsCount: lesson.words.length,
        isOpen,
      });

      if (isOpen) {
        if (lesson.words.length > 0) {
          items.push({
            type: "section_header",
            label: "Vocabulary",
            iconType: "vocab",
            count: lesson.words.length,
          });
          lesson.words.forEach((w, wIndex) => {
            items.push({
              type: "word",
              id: `w-${i}-${wIndex}`,
              english: w.english,
              kurdish: w.kurdish,
            });
          });
        }
        if (lesson.phrases.length > 0) {
          items.push({
            type: "section_header",
            label: "Key Phrases",
            iconType: "phrase",
            count: lesson.phrases.length,
          });
          lesson.phrases.forEach((p, pIndex) => {
            items.push({
              type: "phrase",
              id: `p-${i}-${pIndex}`,
              english: p.english,
              kurdish: p.kurdish,
            });
          });
        }
        items.push({ type: "spacer", height: 16 });
      }
    });

    return items;
  }, [guidebook, expandedLessons, totalWords, totalPhrases]);

  if (!guidebook) {
    return (
      <View
        style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F4F6F9" }}
      >
        <Text style={{ color: "#aaa", textAlign: "center", marginTop: 80 }}>
          Not available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
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
});
