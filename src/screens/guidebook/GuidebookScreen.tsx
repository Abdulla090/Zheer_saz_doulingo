import { AppText } from "@/components/ui/AppText";
import { BUTTON_FACE_RIM_COLORS } from "@/constants/button-theme-colors";
import { ALL_GUIDEBOOKS, GuidebookLesson } from "@/data/guidebook-data";
import { useTTS } from "@/hooks/use-tts";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Icon3DBook,
  Icon3DBookSm,
  Icon3DMessage,
  Icon3DGradCap,
  Icon3DVolume,
  Icon3DChevronDown,
  Icon3DX,
} from "@/components/icons/Icon3D";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
// EaseView replaced with Animated.View from reanimated
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SoftCircleButton } from "@/components/ui/soft-2.5d";
import { crossShadow } from "@/utils/shadows";

// ─── Color utils ──────────────────────────────────────────────────────────────
const rgba = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

function TTSPill({
  onPress,
  isActive,
  faceColor,
  rimColor,
  size = "sm",
}: {
  onPress: () => void;
  isActive: boolean;
  faceColor: string;
  rimColor: string;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? 40 : 34;
  const iconSize = size === "lg" ? 20 : 16;

  return (
    <SoftCircleButton
      size={dim}
      onPress={onPress}
      faceColor={isActive ? faceColor : "#FFFFFF"}
      rimColor={isActive ? rimColor : "#E2E8F0"}
    >
      <Icon3DVolume size={iconSize} />
    </SoftCircleButton>
  );
}

// ─── Word Card (vocabulary item) ─────────────────────────────────────────────
function WordCard({
  english, kurdish, faceColor, rimColor, isActive, onPress, delay,
}: {
  english: string; kurdish: string; faceColor: string; rimColor: string;
  isActive: boolean; onPress: () => void; delay: number;
}) {
  const p = useSharedValue(0);
  React.useEffect(() => {
    p.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive]);

  const cardBg = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], ["#FAFAFA", rgba(faceColor, 0.07)]),
  }));

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <Animated.View
        style={[
          styles.wordCard,
          cardBg,
          { borderLeftColor: faceColor },
          isActive && crossShadow({ color: faceColor, offsetY: 6, opacity: 0.12, blur: 12, elevation: 3 }),
        ]}
      >
        <Pressable onPress={onPress} style={styles.wordCardInner}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.wordEn}>{english}</Text>
              <AppText
                style={[styles.wordKu, { color: rgba(faceColor, 0.75) }]}
                forceKurdishFont
              >
                {kurdish}
              </AppText>
            </View>
            <TTSPill
              onPress={onPress}
              isActive={isActive}
              faceColor={faceColor}
              rimColor={rimColor}
              size="sm"
            />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Phrase Card ──────────────────────────────────────────────────────────────
function PhraseCard({
  english, kurdish, faceColor, rimColor, isActive, onPress, delay,
}: {
  english: string; kurdish: string; faceColor: string; rimColor: string;
  isActive: boolean; onPress: () => void; delay: number;
}) {
  const p = useSharedValue(0);
  React.useEffect(() => {
    p.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive]);

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(p.value, [0, 1], ["#EBEBEB", faceColor]),
    backgroundColor: interpolateColor(p.value, [0, 1], ["#FFFFFF", rgba(faceColor, 0.05)]),
  }));

  return (
    <Animated.View>
      <Animated.View
        style={[
          styles.phraseCard,
          cardStyle,
          isActive && crossShadow({ color: faceColor, offsetY: 6, opacity: 0.1, blur: 12, elevation: 2 }),
        ]}
      >
        <Pressable onPress={onPress}>
            {/* Accent stripe */}
            <View style={[styles.phraseAccentBar, { backgroundColor: faceColor }]} />
            <View style={styles.phraseInner}>
              <View style={styles.phraseTopRow}>
                <Text style={styles.phraseEn}>{english}</Text>
                <TTSPill
                  onPress={onPress}
                  isActive={isActive}
                  faceColor={faceColor}
                  rimColor={rimColor}
                  size="sm"
                />
              </View>
              <View style={[styles.phraseDivider, { backgroundColor: rgba(faceColor, 0.12) }]} />
              <AppText style={styles.phraseKu} forceKurdishFont>
                {kurdish}
              </AppText>
            </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Section Header Row ───────────────────────────────────────────────────────
function SectionHeader({
  icon, label, count, faceColor,
}: {
  icon: React.ReactNode; label: string; count: number; faceColor: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIconWrap, { backgroundColor: rgba(faceColor, 0.12) }]}>
        {icon}
      </View>
      <Text style={[styles.sectionLabel, { color: faceColor }]}>{label}</Text>
      <View style={styles.sectionFlex} />
      <View style={[styles.sectionCountBadge, { backgroundColor: rgba(faceColor, 0.1) }]}>
        <Text style={[styles.sectionCountText, { color: faceColor }]}>{count}</Text>
      </View>
    </View>
  );
}

// ─── Lesson Accordion ─────────────────────────────────────────────────────────
function LessonAccordion({
  lesson, index, faceColor, rimColor, activeId, onSpeak, isFirst,
}: {
  lesson: GuidebookLesson; index: number; faceColor: string; rimColor: string;
  activeId: string | null; onSpeak: (text: string, id: string) => void; isFirst: boolean;
}) {
  const [open, setOpen] = useState(isFirst);
  const rot = useSharedValue(isFirst ? 90 : 0);
  const chevStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value}deg` }],
  }));

  const toggle = () => {
    setOpen((prev) => {
      rot.value = withTiming(prev ? 0 : 90, { duration: 220, easing: Easing.out(Easing.quad) });
      return !prev;
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}

      style={{}}
    >
      <View style={styles.accordionCard}>
        {/* Header ──────────────────────────────────── */}
        <Pressable onPress={toggle}>
          <View style={styles.accordionHeader}>
            {/* Index badge */}
            <View style={[styles.indexBadge, { backgroundColor: faceColor }]}>
              <Text style={styles.indexBadgeText}>{index + 1}</Text>
            </View>

            {/* Titles */}
            <View style={styles.accordionTitles}>
              <Text style={styles.topicEn}>{lesson.topic}</Text>
              <Text style={styles.topicKu}>{lesson.topicKu}</Text>
            </View>

            {/* Stats pills */}
            <View style={styles.accordionMeta}>
              <View style={[styles.metaPill, { backgroundColor: rgba(faceColor, 0.1) }]}>
              <Icon3DBookSm size={12} />
                <Text style={[styles.metaPillText, { color: faceColor }]}>
                  {lesson.words.length}
                </Text>
              </View>
              <Animated.View style={chevStyle}>
                <Icon3DChevronDown size={18} />
              </Animated.View>
            </View>
          </View>
        </Pressable>

        {/* Body ───────────────────────────────────── */}
        {open && (
          <View style={styles.accordionBody}>
            {/* Separator */}
            <View style={[styles.accordionSep, { backgroundColor: rgba(faceColor, 0.1) }]} />

            {/* Vocabulary ─────────────────── */}
            <SectionHeader
            icon={<Icon3DBook size={16} />}
              label="Vocabulary"
              count={lesson.words.length}
              faceColor={faceColor}
            />
            <View style={styles.wordList}>
              {lesson.words.map((w, i) => (
                <WordCard
                  key={`w-${index}-${i}`}
                  english={w.english}
                  kurdish={w.kurdish}
                  faceColor={faceColor}
                  rimColor={rimColor}
                  isActive={activeId === `w-${index}-${i}`}
                  onPress={() => onSpeak(w.english, `w-${index}-${i}`)}
                  delay={i * 35}
                />
              ))}
            </View>

            {/* Key Phrases ─────────────────── */}
            {lesson.phrases.length > 0 && (
              <>
                <SectionHeader
                icon={<Icon3DMessage size={14} />}
                  label="Key Phrases"
                  count={lesson.phrases.length}
                  faceColor={rimColor}
                />
                <View style={styles.phraseList}>
                  {lesson.phrases.map((p, i) => (
                    <PhraseCard
                      key={`p-${index}-${i}`}
                      english={p.english}
                      kurdish={p.kurdish}
                      faceColor={faceColor}
                      rimColor={rimColor}
                      isActive={activeId === `p-${index}-${i}`}
                      onPress={() => onSpeak(p.english, `p-${index}-${i}`)}
                      delay={i * 45}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Close Button ─────────────────────────────────────────────────────────────
function CloseBtn({ onPress }: { onPress: () => void }) {
  return (
    <SoftCircleButton
      size={36}
      onPress={onPress}
      faceColor="rgba(255,255,255,0.28)"
      rimColor="rgba(0,0,0,0.2)"
    >
      <Icon3DX size={18} />
    </SoftCircleButton>
  );
}

// ─── Stats Row Item ───────────────────────────────────────────────────────────
function StatItem({ value, label, faceColor }: { value: string; label: string; faceColor: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: faceColor }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function GuidebookScreen() {
  const { unit } = useLocalSearchParams<{ unit?: string }>();
  const unitIndex = parseInt(unit ?? "0", 10);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { speak, stop, activeId } = useTTS();

  const guidebook = useMemo(() => ALL_GUIDEBOOKS[unitIndex], [unitIndex]);
  const theme = (guidebook?.displayTheme ?? "blue") as keyof typeof BUTTON_FACE_RIM_COLORS;
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

  if (!guidebook) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Text style={{ color: "#aaa", textAlign: "center", marginTop: 80 }}>Not available</Text>
      </View>
    );
  }

  const [rawUnitLabel, ...rest] = guidebook.title.split(":");
  const unitLabel = rawUnitLabel?.trim();
  const sectionTitle = rest.join(":").trim();

  return (
    <View style={[styles.root, { backgroundColor: "#F4F6F9" }]}>

      {/* ══ HERO HEADER — 3D card, unit color, full bleed ══════════════════ */}
      <View style={[styles.heroOuter, { backgroundColor: colors.rim, paddingTop: insets.top }]}>
        <View style={[styles.heroFace, { backgroundColor: colors.face }]}>

          {/* Top row: close + unit label */}
          <View style={styles.heroTopRow}>
            <CloseBtn onPress={() => { stop(); router.back(); }} />
            <View style={[styles.unitLabelPill, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Text style={styles.unitLabelText}>{unitLabel}</Text>
            </View>
          </View>

          {/* Icon + title block */}
          <View style={styles.heroContentRow}>
            <View style={[styles.heroIconWrap, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Icon3DGradCap size={48} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{sectionTitle}</Text>
              <Text style={styles.heroSub}>Guidebook — tap any word to hear it</Text>
            </View>
          </View>

          {/* Stats strip */}
          <View style={styles.statsStrip}>
            <StatItem value={String(guidebook.lessons.length)} label="Lessons" faceColor="#FFFFFF" />
            <View style={styles.statsDivider} />
            <StatItem value={String(totalWords)} label="Words" faceColor="#FFFFFF" />
            <View style={styles.statsDivider} />
            <StatItem value={String(totalPhrases)} label="Phrases" faceColor="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* ══ LESSONS LIST ════════════════════════════════════════════════════ */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 36 }]}
        showsVerticalScrollIndicator={false}
      >
        {guidebook.lessons.map((lesson, i) => (
          <LessonAccordion
            key={`lesson-${i}`}
            lesson={lesson}
            index={i}
            faceColor={colors.face}
            rimColor={colors.rim}
            activeId={activeId}
            onSpeak={handleSpeak}
            isFirst={i === 0}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4F6F9",
  },

  // ── Hero ────────────────────────────────────────────────────────────────────
  heroOuter: {
    // 3D depth: rim color shows at bottom
    paddingBottom: 6,
  },
  heroFace: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 18,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 3,          // ← 3D depth off rim
  },
  closeBtnRim: {
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.18)",
    overflow: "hidden" as const,
  },
  closeBtnInner: {
    padding: 8,
  },
  unitLabelPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  unitLabelText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heroContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  heroIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 5,
    lineHeight: 28,
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 18,
  },

  // Stats strip
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "800", marginBottom: 2 },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: "600" },
  statsDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.2)" },

  // ── List ─────────────────────────────────────────────────────────────────────
  listContent: {
    padding: 16,
    gap: 12,
  },

  // ── Accordion card ────────────────────────────────────────────────────────────
  accordionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    ...crossShadow({ color: "#000", offsetY: 2, opacity: 0.06, blur: 8, elevation: 3 }),
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  indexBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  indexBadgeText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
  },
  accordionTitles: { flex: 1, minWidth: 0 },
  topicEn: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 3,
  },
  topicKu: {
    fontSize: 13,
    color: "#ABABAB",
    fontWeight: "500",
  },
  accordionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  accordionSep: {
    height: 1,
    marginBottom: 20,
    marginHorizontal: 0,
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // ── Section header ────────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sectionFlex: { flex: 1 },
  sectionCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // ── Word cards ────────────────────────────────────────────────────────────────
  wordList: { gap: 8, marginBottom: 20 },
  wordCardRim: {
    borderRadius: 14,
    overflow: "hidden" as const,
  },
  wordCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    borderRadius: 14,
    borderLeftWidth: 3.5,
    ...crossShadow({ color: "#0F172A", offsetY: 4, opacity: 0.06, blur: 10, elevation: 2 }),
  },
  wordCardInner: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 13,
    paddingLeft: 14,
    paddingRight: 10,
  },
  wordEn: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 3,
  },
  wordKu: {
    fontSize: 13,
    fontWeight: "500",
    writingDirection: "rtl",
  },

  // ── Phrase cards ──────────────────────────────────────────────────────────────
  phraseList: { gap: 10 },
  phraseRim: {
    borderRadius: 16,
    overflow: "hidden" as const,
  },
  phraseCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden" as const,
    ...crossShadow({ color: "#0F172A", offsetY: 4, opacity: 0.06, blur: 10, elevation: 2 }),
  },
  phraseAccentBar: {
    height: 4,
    width: "100%",
  },
  phraseInner: { padding: 14 },
  phraseTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  phraseEn: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
    lineHeight: 22,
  },
  phraseDivider: {
    height: 1,
    marginBottom: 10,
  },
  phraseKu: {
    fontSize: 14,
    color: "#777",
    writingDirection: "rtl",
    lineHeight: 21,
    fontWeight: "400",
  },
});
