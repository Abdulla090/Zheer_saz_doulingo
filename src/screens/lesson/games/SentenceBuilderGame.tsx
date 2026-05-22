/**
 * SentenceBuilderGame — Duolingo style.
 *
 * Drop zone (dashed): tap words from bank to place them.
 * CONTINUE (3D green) at bottom: validates → calls onAnswer.
 * Wrong: shake + reset after 1s.
 */

import React, { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
import { Icon3DX } from "@/components/icons/Icon3D";
import { SentenceBuilderQuestion } from "@/data/lesson-content";
import { G } from "./game-design";
import { crossShadow } from "@/utils/shadows";

type Props = {
  question: SentenceBuilderQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};
type FBState = "idle" | "correct" | "wrong";

// Removed direction: ltr to fix style error
const LTR = {};

// ── Ghost placeholder ─────────────────────────────────────────────────────────
function Ghost({ word }: { word: string }) {
  return (
    <View style={sg.ghost}>
      <Text style={[sg.ghostText, { opacity: 0 }]}>{word}</Text>
    </View>
  );
}

// ── Bank word chip (3D) ───────────────────────────────────────────────────────
function BankChip({ word, isUsed, delay, onPress }: {
  word: string; isUsed: boolean; delay: number; onPress: () => void;
}) {
  const ty = useSharedValue(0);
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  if (isUsed) return <Ghost word={word} />;
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}

      style={{}}
    >
      <View style={sg.rim}>
        <Animated.View style={[sg.face, faceStyle]}>
          <Pressable
            onPress={onPress}
            onPressIn={() => { ty.value = withTiming(G.depth, { duration: 70 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 100 }); }}
            style={sg.bankInner}
          >
            <Text style={sg.bankText}>{word}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

// ── Placed word chip (blue 3D) ────────────────────────────────────────────────
function PlacedChip({ word, onRemove, fb }: { word: string; onRemove: () => void; fb: FBState }) {
  const faceBg  = fb === "correct" ? G.greenBg : fb === "wrong" ? G.redBg : G.blueBg;
  const faceCol = fb === "correct" ? G.green   : fb === "wrong" ? G.red   : G.blue;
  const rimCol  = fb === "correct" ? G.greenRim: fb === "wrong" ? G.redRim: G.blueRim;
  const textCol = fb === "correct" ? G.greenText: fb === "wrong" ? G.redText: G.blueText;

  const ty = useSharedValue(0);
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

  return (
    <Animated.View
      style={{ opacity: 0, transform: [{ scale: 0.6 }] }}
    >
      <View style={[sg.placedRim, { backgroundColor: rimCol }]}>
        <Animated.View style={[sg.placedFace, { backgroundColor: faceBg, borderColor: faceCol }, faceStyle]}>
          <Pressable
            onPress={onRemove}
            disabled={fb !== "idle"}
            onPressIn={() => { ty.value = withTiming(G.depth, { duration: 65 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 90 }); }}
            style={sg.placedInner}
          >
            <Text style={[sg.placedText, { color: textCol }]}>{word}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

// ── CHECK button (3D) ─────────────────────────────────────────────────────────
function CheckBtn({ onPress, canCheck, fb }: {
  onPress: () => void; canCheck: boolean; fb: FBState;
}) {
  const ty = useSharedValue(0);
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

  const rimCol  = !canCheck ? G.border    : fb === "correct" ? G.greenRim : fb === "wrong" ? G.redRim : G.greenRim;
  const faceCol = !canCheck ? G.bgSoft    : fb === "correct" ? G.green    : fb === "wrong" ? G.red    : G.green;
  const textCol = !canCheck ? G.textLight : "#FFF";

  return (
    <View style={[sg.checkRim, { backgroundColor: rimCol }]}>
      <Animated.View style={[sg.checkFace, { backgroundColor: faceCol }, faceStyle]}>
        <Pressable
          onPress={onPress}
          disabled={!canCheck}
          onPressIn={() => { ty.value = withTiming(G.depth, { duration: 75 }); }}
          onPressOut={() => { ty.value = withTiming(0, { duration: 110 }); }}
          style={sg.checkInner}
        >
          <Text style={[sg.checkText, { color: textCol }]}>
            {fb === "idle"    ? "CHECK"
           : fb === "correct" ? "✓ Correct!"
           :                    "✗ Try again"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
type Placed = { word: string; id: string };

export default function SentenceBuilderGame({ question, onAnswer }: Props) {
  const [sentence, setSentence] = useState<Placed[]>([]);
  const [fb, setFb] = useState<FBState>("idle");
  const slotN = useRef(0);
  const firedRef = useRef(false);

  const dropAnim = useSharedValue(0);
  const dropStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(dropAnim.value, [0, 1, 2],
      [G.border, G.green, G.red]),
    backgroundColor: interpolateColor(dropAnim.value, [0, 1, 2],
      [G.bgSoft, G.greenBg, G.redBg]),
  }));

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const supply: Record<string, number> = {};
  for (const w of question.wordBank) supply[w] = (supply[w] || 0) + 1;
  const used: Record<string, number> = {};
  for (const p of sentence) used[p.word] = (used[p.word] || 0) + 1;
  const slotUsed: boolean[] = (() => {
    const rem = { ...used };
    return question.wordBank.map(w => {
      if ((rem[w] || 0) > 0) { rem[w]--; return true; }
      return false;
    });
  })();

  const addWord = (w: string) => {
    if (fb !== "idle") return;
    if ((used[w] || 0) >= (supply[w] || 0)) return;
    const id = `s${slotN.current++}`;
    setSentence(p => [...p, { word: w, id }]);
  };
  const removeWord = (id: string) => {
    if (fb !== "idle") return;
    setSentence(p => p.filter(x => x.id !== id));
  };

  const check = () => {
    if (!sentence.length || fb !== "idle") return;
    const placed = sentence.map(p => p.word);
    const ok = placed.join(" ").toLowerCase() === question.correctWords.join(" ").toLowerCase();
    const t = (v: number) => withTiming(v, { duration: 220, easing: Easing.out(Easing.quad) });
    setFb(ok ? "correct" : "wrong");
    dropAnim.value = t(ok ? 1 : 2);

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-9, { duration: 40 }), withTiming(9, { duration: 40 }),
        withTiming(-5, { duration: 34 }), withTiming(5, { duration: 34 }),
        withTiming( 0, { duration: 46, easing: Easing.out(Easing.quad) }),
      );
      setTimeout(() => {
        setFb("idle"); dropAnim.value = t(0);
      }, 1200);
    } else {
      setTimeout(() => {
        if (!firedRef.current) { firedRef.current = true; onAnswer(true); }
      }, 380);
    }
  };

  const canCheck = sentence.length > 0 && fb === "idle";

  return (
    <View style={sg.root}>
      {/* Instruction */}
      <Animated.View
        entering={FadeInDown.duration(300)}

        style={{}}
      >
        <Text style={[sg.instruction, { color: 'rgba(255,255,255,0.9)' }]}>Arrange the words in order</Text>
        <Text style={[sg.prompt, { color: '#FFFFFF' }]}>{question.kurdishSentence}</Text>
      </Animated.View>

      {/* Drop zone */}
      <Animated.View style={[sg.drop, dropStyle, shakeStyle]}>
        {sentence.length === 0 ? (
          <Text style={sg.placeholder}>Tap words below to build the sentence…</Text>
        ) : (
          <View style={[sg.dropContent, LTR]}>
            {sentence.map(p => (
              <PlacedChip key={p.id} word={p.word} onRemove={() => removeWord(p.id)} fb={fb} />
            ))}
          </View>
        )}
      </Animated.View>

      {/* Word bank */}
      <View style={[sg.bank, LTR]}>
        {question.wordBank.map((w, i) => (
          <BankChip key={`${w}-${i}`} word={w} isUsed={slotUsed[i]}
            delay={50 + i * 35} onPress={() => addWord(w)} />
        ))}
      </View>

      <View style={{ flex: 1 }} />

      {/* CHECK button */}
      <CheckBtn onPress={check} canCheck={canCheck} fb={fb} />
    </View>
  );
}

const sg = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: G.px,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  instruction: {
    fontSize: 13, fontWeight: "700", color: G.textLight,
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4,
  },
  prompt: { fontSize: 20, fontWeight: "600", color: G.textMid, lineHeight: 26 },

  // Drop zone
  drop: {
    minHeight: 120,
    borderRadius: G.rXl,
    borderWidth: 2,
    borderStyle: "dashed" as any,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    overflow: "hidden",
  },
  dropContent: { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 14, alignItems: "center" },
  placeholder: { color: "rgba(255,255,255,0.8)", fontSize: 16, textAlign: "center", paddingHorizontal: 16, paddingVertical: 28, width: "100%" },

  // Placed chip
  placedRim: { borderRadius: G.rMd, overflow: "hidden" },
  placedFace: { borderRadius: G.rMd, borderWidth: 2, marginBottom: G.depth - 2 },
  placedInner: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6 },
  placedText: { fontSize: 14, fontWeight: "700" },

  // Bank
  bank: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  rim:  { borderRadius: G.rMd, backgroundColor: G.optRim, overflow: "hidden", ...crossShadow({ color: "#000", offsetY: 4, opacity: 0.15, blur: 8 }) },
  face: { borderRadius: G.rMd, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', backgroundColor: G.optBg, marginBottom: G.depth },
  bankInner: { paddingHorizontal: 16, paddingVertical: 12 },
  bankText: { fontSize: 16, fontWeight: "700", color: G.textDark },

  // Ghost
  ghost: {
    borderRadius: G.rMd, borderWidth: 2.5, borderStyle: "dashed" as any,
    borderColor: G.border, backgroundColor: "transparent",
    paddingHorizontal: 16, paddingVertical: 12, opacity: 0.4,
    marginBottom: G.depth,
  },
  ghostText: { fontSize: 16, fontWeight: "700", color: G.textDark },

  // CHECK button
  checkRim: { borderRadius: G.rLg, width: "100%", overflow: "hidden" },
  checkFace: { borderRadius: G.rLg, marginBottom: G.depth },
  checkInner: { paddingVertical: 18, alignItems: "center" },
  checkText: { fontSize: 17, fontWeight: "800", letterSpacing: 0.3 },
});
