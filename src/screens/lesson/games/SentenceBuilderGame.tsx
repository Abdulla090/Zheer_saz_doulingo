import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { EaseView } from "react-native-ease";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { SentenceBuilderQuestion } from "@/data/lesson-content";
import { useKurdishFont } from "@/hooks/useKurdishFont";

type Props = { question: SentenceBuilderQuestion; onAnswer: (correct: boolean) => void };
type FBState = "idle" | "correct" | "wrong";

// Inline style object to force LTR — applied directly on Views (bypasses StyleSheet validator)
const LTR = { direction: "ltr" } as any;

function shuffleArr<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type PlacedWord = { word: string; slotId: string };

// ─── Ghost placeholder — dashed box preserving word width ─────────────
function GhostChip({ word }: { word: string }) {
  return (
    <View style={styles.ghostBase}>
      <View style={styles.ghostChip}>
        {/* Invisible text keeps the box the same width as the real chip */}
        <View style={styles.chipPressable}>
          <Text style={[styles.wordText, { opacity: 0 }]}>{word}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Active word chip ─────────────────────────────────────────────────
function WordChip({ word, isUsed, delay, onPress }: {
  word: string; isUsed: boolean; delay: number; onPress: () => void;
}) {
  const ty = useSharedValue(0);
  const pi = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

  if (isUsed) return <GhostChip word={word} />;

  return (
    <EaseView
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 210, delay, easing: "easeOut" }}
      style={{ translateY: 12, opacity: 0 }}
    >
      <View style={styles.wordChipBase}>
        <Animated.View style={[pi, styles.wordChip]}>
          <Pressable
            onPress={onPress}
            onPressIn={() => { ty.value = withTiming(3, { duration: 80 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 115 }); }}
            style={styles.chipPressable}
          >
            <Text style={styles.wordText}>{word}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </EaseView>
  );
}

// ─── Placed chip (blue, inside drop zone) ────────────────────────────
function PlacedChip({ word, onRemove }: { word: string; onRemove: () => void }) {
  const ty = useSharedValue(0);
  const pi = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  return (
    <EaseView
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 165, easing: "easeOut" }}
      style={{ opacity: 0, transform: [{ scale: 0.55 }] }}
    >
      <View style={styles.placedBase}>
        <Animated.View style={[pi, styles.placed]}>
          <Pressable
            onPress={onRemove}
            onPressIn={() => { ty.value = withTiming(3, { duration: 75 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 110 }); }}
            style={styles.placedPressable}
          >
            <Text style={styles.placedText}>{word}</Text>
            <Text style={styles.placedX}>✕</Text>
          </Pressable>
        </Animated.View>
      </View>
    </EaseView>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────
export default function SentenceBuilderGame({ question, onAnswer }: Props) {
  const [wordBank] = useState(() => shuffleArr(question.wordBank));
  const [sentence, setSentence] = useState<PlacedWord[]>([]);
  const [fb, setFb] = useState<FBState>("idle");
  const slotCounter = useRef(0);
  const font = useKurdishFont();

  const firedRef = useRef(false);
  const fireAnswer = (correct: boolean) => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAnswer(correct);
  };

  const areaP = useSharedValue(0);
  const areaX = useSharedValue(0);
  const areaStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(areaP.value, [0, 1, 2], ["#D0D0D0", "#58CC02", "#FF4B4B"]),
    backgroundColor: interpolateColor(areaP.value, [0, 1, 2], ["#FAFAFA", "#E5FFDC", "#FFEBEB"]),
    transform: [{ translateX: areaX.value }],
  }));

  const btnP    = useSharedValue(0);
  const btnTy   = useSharedValue(0);
  const btnStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(btnP.value, [0, 1, 2], ["#58CC02", "#58CC02", "#FF4B4B"]),
  }));
  const btnShadowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(btnP.value, [0, 1, 2], ["#58A700", "#58A700", "#EA2B2B"]),
  }));
  const btnPressStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: btnTy.value }],
  }));

  // Per-word supply counts
  const wordBankCounts: Record<string, number> = {};
  for (const w of wordBank) wordBankCounts[w] = (wordBankCounts[w] || 0) + 1;

  const usedCounts: Record<string, number> = {};
  for (const p of sentence) usedCounts[p.word] = (usedCounts[p.word] || 0) + 1;

  // Per-slot "is this specific slot already used?" — handles duplicate words
  const slotUsed: boolean[] = (() => {
    const remaining = { ...usedCounts };
    return wordBank.map((word) => {
      if ((remaining[word] || 0) > 0) {
        remaining[word]--;
        return true;
      }
      return false;
    });
  })();

  const addWord = (w: string) => {
    if (fb !== "idle") return;
    if ((usedCounts[w] || 0) >= (wordBankCounts[w] || 0)) return;
    const slotId = `slot-${slotCounter.current++}`;
    setSentence((p) => [...p, { word: w, slotId }]);
  };

  const removeWord = (slotId: string) => {
    if (fb !== "idle") return;
    setSentence((p) => p.filter((item) => item.slotId !== slotId));
  };

  const check = () => {
    if (!sentence.length || fb !== "idle") return;

    btnTy.value = withSequence(
      withTiming(4, { duration: 85, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 125, easing: Easing.out(Easing.cubic) })
    );

    const placed = sentence.map((p) => p.word);
    const ok = placed.join(" ").toLowerCase() === question.correctWords.join(" ").toLowerCase();
    const t = (v: number) => withTiming(v, { duration: 220, easing: Easing.out(Easing.quad) });

    setFb(ok ? "correct" : "wrong");
    areaP.value = t(ok ? 1 : 2);
    btnP.value  = t(ok ? 1 : 2);

    if (!ok) {
      areaX.value = withSequence(
        withTiming(-6, { duration: 43 }), withTiming(6, { duration: 43 }),
        withTiming(-4, { duration: 37 }), withTiming(4, { duration: 37 }),
        withTiming( 0, { duration: 48, easing: Easing.out(Easing.quad) })
      );
      setTimeout(() => {
        setFb("idle");
        areaP.value = withTiming(0, { duration: 200 });
        btnP.value  = withTiming(0, { duration: 200 });
      }, 1200);
    } else {
      setTimeout(() => fireAnswer(true), 1000);
    }
  };

  const canCheck = sentence.length > 0 && fb === "idle";

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>وشەکان ڕێکبخە بۆ دروستکردنی لێرەیی ئینگلیزی</Text>

      {/* Kurdish prompt */}
      <EaseView
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 260, easing: "easeOut" }}
        style={[styles.kuBox, { opacity: 0, transform: [{ scale: 0.91 }] }]}
      >
        <Text style={styles.kuText}>{question.kurdishSentence}</Text>
      </EaseView>

      {/* ── Drop zone (forced LTR via inline style) ─────────────────────
           We do NOT put `direction` in StyleSheet.create() because RN Web
           validator rejects it. Inline styles skip that validator.        */}
      <Animated.View style={[styles.dropZone, areaStyle, LTR]}>
        {sentence.length === 0 ? (
          <Text style={styles.placeholder}>وشەکان لێرە دابنێ...</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={LTR}
            contentContainerStyle={[styles.dropScroll, LTR]}
          >
            {sentence.map((item) => (
              <PlacedChip
                key={item.slotId}
                word={item.word}
                onRemove={() => removeWord(item.slotId)}
              />
            ))}
          </ScrollView>
        )}
      </Animated.View>

      {/* ── Word bank (forced LTR via inline style) ─────────────────── */}
      <View style={[styles.wordBank, LTR]}>
        {wordBank.map((word, i) => (
          <WordChip
            key={`${word}-${i}`}
            word={word}
            isUsed={slotUsed[i]}
            delay={65 + i * 38}
            onPress={() => addWord(word)}
          />
        ))}
      </View>

      <View style={{ flex: 1 }} />

      {/* 3D Check Button */}
      <Animated.View style={[styles.checkBtnBase, !canCheck && styles.checkBtnOffBase, btnShadowStyle]}>
        <Animated.View style={[styles.checkBtn, !canCheck && styles.checkBtnOff, btnStyle, btnPressStyle]}>
          <Pressable onPress={check} disabled={!canCheck} style={styles.checkBtnInner}>
            <Text style={[styles.checkText, !canCheck && styles.checkTextOff]}>
              {fb === "idle" ? "پشکنینی وەڵام" : fb === "correct" ? "✓ دروستە!" : "✗ هەڵەیە — دووبارە هەوڵبدە"}
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },
  instruction: { fontSize: 17, color: "#4B4B4B", textAlign: "center", marginBottom: 16 },

  kuBox: {
    backgroundColor: "#EAF6FF", borderRadius: 20, padding: 20, alignItems: "center", marginBottom: 18,
    borderWidth: 2, borderColor: "#1CB0F6",
    boxShadow: "0px 4px 10px rgba(28, 176, 246, 0.13)" as any, elevation: 4,
  },
  kuText: { fontSize: 22, color: "#1CB0F6", textAlign: "center" },

  dropZone: {
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    marginBottom: 20,
    justifyContent: "center",
    overflow: "hidden",
  },
  dropScroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  placeholder: {
    color: "#BDBDBD",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 24,
    textAlign: "center",
    width: "100%",
  },

  placedBase: { backgroundColor: "#1899D6", borderRadius: 12 },
  placed: {
    backgroundColor: "#1CB0F6", borderRadius: 12,
    borderWidth: 2, borderColor: "#1CB0F6", marginBottom: 4,
  },
  placedPressable: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  placedText: { color: "#FFF", fontSize: 16 },
  placedX:    { color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 },

  wordBank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
    justifyContent: "center",
  },

  wordChipBase: { backgroundColor: "#E5E5E5", borderRadius: 14 },
  wordChip: {
    backgroundColor: "#FFF", borderRadius: 14,
    borderWidth: 2, borderColor: "#E5E5E5", marginBottom: 4,
  },
  chipPressable: { paddingHorizontal: 18, paddingVertical: 12 },
  wordText: { fontSize: 16, color: "#4B4B4B" },

  // Dashed ghost box — same padding as wordChip to match size
  ghostBase: {},
  ghostChip: {
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#C8C8C8",
    backgroundColor: "#F7F7F7",
    marginBottom: 4,
  },

  checkBtnBase:    { borderRadius: 16 },
  checkBtn:        { borderRadius: 16, marginBottom: 4 },
  checkBtnOffBase: { backgroundColor: "#E5E5E5" },
  checkBtnOff:     { backgroundColor: "#F0F0F0" },
  checkBtnInner:   { paddingVertical: 18, alignItems: "center" },
  checkText:       { fontSize: 17, color: "#FFF" },
  checkTextOff:    { color: "#AFAFAF" },
});
