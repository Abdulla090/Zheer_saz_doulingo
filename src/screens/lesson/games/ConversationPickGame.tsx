/**
 * ConversationPickGame — Duolingo style.
 *
 * Situation chip → speech bubble (they say) → 4 stacked 3D option buttons.
 * On pick: calls onAnswer(correct, explanation) after 380ms.
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
  withTiming,
} from "react-native-reanimated";
// EaseView replaced with Animated.View from reanimated
import { Icon3DCheck, Icon3DX, Icon3DTarget, Icon3DMessage } from "@/components/icons/Icon3D";
import { ConversationPickQuestion } from "@/data/lesson-content";
import { G } from "./game-design";
import { crossShadow } from "@/utils/shadows";

type Props = {
  question: ConversationPickQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};
type OptState = "idle" | "correct" | "showCorrect" | "wrong";

// ── 3D Option button (same pattern as MultipleChoice) ─────────────────────────
function OptionBtn({
  text, state, onPress, disabled, delay,
}: {
  text: string; state: OptState; onPress: () => void; disabled: boolean; delay: number;
}) {
  const ty = useSharedValue(0);
  const p  = useSharedValue(0);

  React.useEffect(() => {
    const t = (v: number) => withTiming(v, { duration: 200, easing: Easing.out(Easing.quad) });
    if (state === "idle")   p.value = t(0);
    if (state === "correct" || state === "showCorrect") p.value = t(1);
    if (state === "wrong")  p.value = t(2);
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
  const textCol = isGood ? G.greenText : state === "wrong" ? G.redText : G.textDark;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}

      style={{}}
    >
      <Animated.View style={[s.rim, rimStyle]}>
        <Animated.View style={[s.face, faceStyle]}>
          <Pressable
            onPress={onPress}
            disabled={disabled}
            onPressIn={() => { ty.value = withTiming(G.depth, { duration: 75 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 110 }); }}
            style={s.optPressable}
          >
            <View style={[
              s.badge,
              state === "idle"
                ? { borderWidth: 2, borderColor: G.optBorder }
                : { backgroundColor: isGood ? G.green : G.red, borderWidth: 0 },
            ]}>
              {isGood && <Icon3DCheck size={14} />}
              {state === "wrong" && <Icon3DX size={14} />}
            </View>
            <Text style={[s.optText, { color: textCol }]} numberOfLines={3}>{text}</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ConversationPickGame({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [locked,   setLocked]   = useState(false);
  const firedRef = useRef(false);

  const pick = (opt: string) => {
    if (locked) return;
    setSelected(opt);
    setLocked(true);
    const ok = opt === question.correctAnswer;
    setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        onAnswer(ok, question.explanation);
      }
    }, 380);
  };

  const getState = (opt: string): OptState => {
    if (!locked) return "idle";
    if (opt === selected) return opt === question.correctAnswer ? "correct" : "wrong";
    if (opt === question.correctAnswer && selected !== question.correctAnswer) return "showCorrect";
    return "idle";
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={s.root}
      showsVerticalScrollIndicator={false}
    >
      {/* Situation chip */}
      <Animated.View
        entering={FadeInDown.duration(300)}

        style={{}}
      >
        <View style={s.situationChip}>
          <Icon3DTarget size={14} />
          <Text style={s.situationText}>{question.situation}</Text>
        </View>
      </Animated.View>

      {/* Speech bubble */}
      <Animated.View
        style={{ opacity: 0, transform: [{ scale: 0.92 }] }}
      >
        <View style={s.bubbleRow}>
          {/* Avatar */}
          <View style={s.avatar}>
            <Icon3DMessage size={24} />
          </View>

          {/* Bubble (Duolingo blue tint) */}
          <View style={s.bubble}>
            <Text style={s.bubbleLabel}>THEY SAY</Text>
            <Text style={s.bubbleText}>{question.theyAsk}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Instruction */}
      <Text style={[s.instruction, { color: 'rgba(255,255,255,0.9)' }]}>Choose the best response</Text>

      {/* Options */}
      <View style={s.optList}>
        {question.options.map((opt, i) => (
          <OptionBtn
            key={opt}
            text={opt}
            state={getState(opt)}
            onPress={() => pick(opt)}
            disabled={locked}
            delay={100 + i * 60}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: {
    paddingHorizontal: G.px,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 14,
  },

  situationChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: G.rMd,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "100%",
    ...crossShadow({ color: "#000", offsetY: 4, opacity: 0.15, blur: 8 }),
  },
  situationText: {
    fontSize: 13,
    fontWeight: "700",
    color: G.blueText,
    flex: 1,
    flexWrap: "wrap" as any,
  },

  // Speech bubble
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: G.blue,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 4,
    // Duolingo-style border
    borderWidth: 3,
    borderColor: G.blueRim,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: G.rXl,
    borderTopLeftRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    padding: 16,
    ...crossShadow({ color: "#000", offsetY: 8, opacity: 0.15, blur: 16 }),
  },
  bubbleLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: G.blue,
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: 17,
    fontWeight: "700",
    color: G.blueText,
    lineHeight: 24,
    textAlign: "left",
    writingDirection: "ltr",
  },

  instruction: {
    fontSize: 13,
    fontWeight: "700",
    color: G.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  optList: { gap: 10 },

  // 3D button
  rim:  { borderRadius: G.rMd, overflow: "hidden", ...crossShadow({ color: "#000", offsetY: 4, opacity: 0.1, blur: 8 }) },
  face: { borderRadius: G.rMd, borderWidth: 1.5, marginBottom: G.depth, borderColor: 'rgba(0,0,0,0.05)' },
  optPressable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
    minHeight: 60,
  },
  badge: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  optText: {
    flex: 1, fontSize: 16, fontWeight: "700", lineHeight: 22,
    writingDirection: "ltr" as any,
    textAlign: "left",
  },
});
