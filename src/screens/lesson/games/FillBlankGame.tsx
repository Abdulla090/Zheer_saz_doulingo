/**
 * FillBlankGame — Duolingo style.
 *
 * Sentence with a blank (dashed box). Word option chips below.
 * Tap chip → fills blank → correct: green border/bg, wrong: red + shows correct.
 * Calls onAnswer after 380ms.
 */

import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
// EaseView replaced with Animated.View from reanimated
import { Icon3DCheck, Icon3DX } from "@/components/icons/Icon3D";
import { FillBlankQuestion } from "@/data/lesson-content";
import { G } from "./game-design";
import { crossShadow } from "@/utils/shadows";

// Removed direction: ltr to fix style error
const LTR = {};

type Props = {
  question: FillBlankQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};
type ChipState = "idle" | "correct" | "wrong" | "showCorrect";

// ── Word chip (3D) ────────────────────────────────────────────────────────────
function WordChip({
  word, state, onPress, disabled, delay,
}: {
  word: string; state: ChipState; onPress: () => void; disabled: boolean; delay: number;
}) {
  const ty = useSharedValue(0);
  const p  = useSharedValue(0);

  React.useEffect(() => {
    const t = (v: number) => withTiming(v, { duration: 200, easing: Easing.out(Easing.quad) });
    if (state === "idle")        p.value = t(0);
    if (state === "correct" || state === "showCorrect") p.value = t(1);
    if (state === "wrong")       p.value = t(2);
  }, [state]);

  const rimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1, 2],
      [G.optRim, G.greenRim, G.redRim]),
  }));
  const faceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1, 2],
      [G.optBg, G.greenBg, G.redBg]),
    borderColor: interpolateColor(p.value, [0, 1, 2],
      [G.optBorder, G.green, G.red]),
    transform: [{ translateY: ty.value }],
  }));

  const isGood = state === "correct" || state === "showCorrect";
  const color = isGood ? G.greenText : state === "wrong" ? G.redText : G.textDark;

  return (
    <Animated.View
      style={{ opacity: 0, transform: [{ scale: 0.88 }] }}
    >
      <Animated.View style={[s.rim, rimStyle]}>
        <Animated.View style={[s.face, faceStyle]}>
          <Pressable
            onPress={onPress}
            disabled={disabled}
            onPressIn={() => { ty.value = withTiming(G.depth, { duration: 75 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 110 }); }}
            style={s.chipPressable}
          >
            {isGood && <Icon3DCheck size={16} />}
            {state === "wrong" && <Icon3DX size={16} />}
            <Text style={[s.chipText, { color }]}>{word}</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FillBlankGame({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [locked,   setLocked]   = useState(false);
  const firedRef = useRef(false);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const blankP = useSharedValue(0);
  const blankStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(blankP.value, [0, 1, 2],
      ["transparent", G.greenBg, G.redBg]),
    borderColor: interpolateColor(blankP.value, [0, 1, 2],
      [G.optBorder, G.green, G.red]),
  }));

  const pick = (word: string) => {
    if (locked) return;
    setSelected(word);
    setLocked(true);
    const ok = word === question.correctAnswer;
    const t = (v: number) => withTiming(v, { duration: 220, easing: Easing.out(Easing.quad) });
    blankP.value = t(ok ? 1 : 2);

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 40 }), withTiming(10, { duration: 40 }),
        withTiming(-5,  { duration: 34 }), withTiming(5,  { duration: 34 }),
        withTiming( 0,  { duration: 48, easing: Easing.out(Easing.quad) }),
      );
    }
    setTimeout(() => {
      if (!firedRef.current) { firedRef.current = true; onAnswer(ok); }
    }, 380);
  };

  const getState = (w: string): ChipState => {
    if (!locked) return "idle";
    if (w === selected) return w === question.correctAnswer ? "correct" : "wrong";
    if (w === question.correctAnswer && selected !== question.correctAnswer) return "showCorrect";
    return "idle";
  };

  const blankTextColor = !selected
    ? G.textLight
    : selected === question.correctAnswer ? G.greenText : G.redText;

  return (
    <View style={s.root}>
      {/* Instruction */}
      <Animated.View
        entering={FadeInDown.duration(300)}

        style={{}}
      >
        <Text style={[s.instruction, { color: 'rgba(255,255,255,0.9)' }]}>Fill in the blank</Text>
        <Text style={[s.hint, { color: '#FFFFFF' }]}>{question.kurdishHint}</Text>
      </Animated.View>

      {/* Sentence card with blank */}
      <Animated.View style={[s.sentenceCard, shakeStyle]}>
        <View style={[s.sentenceRow, LTR]}>
          {question.sentenceParts[0] ? (
            <Text style={s.sentenceText}>{question.sentenceParts[0]} </Text>
          ) : null}

          {/* The blank */}
          <Animated.View style={[s.blank, blankStyle]}>
            <Text style={[s.blankText, { color: blankTextColor }]}>
              {selected || "___________"}
            </Text>
          </Animated.View>

          {question.sentenceParts[1] ? (
            <Text style={s.sentenceText}> {question.sentenceParts[1]}</Text>
          ) : null}
        </View>
      </Animated.View>

      {/* Word chips */}
      <View style={[s.chipsWrap, LTR]}>
        {question.options.map((w, i) => (
          <WordChip
            key={w}
            word={w}
            state={getState(w)}
            onPress={() => pick(w)}
            disabled={locked}
            delay={i * 55}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: G.px,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 20,
  },
  instruction: {
    fontSize: 13,
    fontWeight: "700",
    color: G.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  hint: {
    fontSize: 18,
    fontWeight: "600",
    color: G.textMid,
    lineHeight: 25,
  },

  sentenceCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: G.rXl,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    padding: 24,
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    ...crossShadow({ color: "#000000", offsetY: 12, opacity: 0.15, blur: 20, elevation: 8 }),
  },
  sentenceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: "600",
    color: G.textDark,
    lineHeight: 28,
  },

  // Blank slot
  blank: {
    minWidth: 100,
    borderRadius: G.rSm,
    borderWidth: 2.5,
    borderStyle: "dashed" as any,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  blankText: {
    fontSize: 20,
    fontWeight: "800",
  },

  // Chips
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  rim:  { borderRadius: G.rMd, overflow: "hidden", ...crossShadow({ color: "#000", offsetY: 4, opacity: 0.1, blur: 8 }) },
  face: { borderRadius: G.rMd, borderWidth: 1.5, marginBottom: G.depth, borderColor: 'rgba(0,0,0,0.05)' },
  chipPressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chipText: {
    fontSize: 18,
    fontWeight: "700",
  },
});
