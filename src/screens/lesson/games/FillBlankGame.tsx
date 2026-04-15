import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { EaseView } from "react-native-ease";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { FillBlankQuestion } from "@/data/lesson-content";
import { useKurdishFont } from "@/hooks/useKurdishFont";

type Props = { question: FillBlankQuestion; onAnswer: (correct: boolean) => void };

export default function FillBlankGame({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const font = useKurdishFont();

  const firedRef = useRef(false);
  const fireAnswer = (correct: boolean) => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAnswer(correct);
  };

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const pick = (opt: string) => {
    if (locked) return;
    setSelected(opt);
    setLocked(true);

    const ok = opt === question.correctAnswer;
    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 42 }), withTiming(8, { duration: 42 }),
        withTiming(-5, { duration: 36 }), withTiming(5, { duration: 36 }),
        withTiming( 0, { duration: 50, easing: Easing.out(Easing.quad) })
      );
      // Auto-unlock after 1.4s so user can retry
      setTimeout(() => { setSelected(null); setLocked(false); }, 1400);
    } else {
      setTimeout(() => fireAnswer(true), 960);
    }
  };

  const optionState = (opt: string): "idle" | "correct" | "wrong" => {
    if (selected !== opt) return "idle";
    return opt === question.correctAnswer ? "correct" : "wrong";
  };

  return (
    <View style={styles.container}>
      <EaseView
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 220, easing: "easeOut" }}
        style={{ opacity: 0, translateY: -10 }}
      >
        <Text style={styles.title}>خانەی بەتاڵ پڕبکەرەوە</Text>
        <Text style={styles.hint}>{question.kurdishHint}</Text>
      </EaseView>

      {/* Sentence with gap */}
      <Animated.View style={[styles.sentenceCard, shakeStyle]}>
        <View style={styles.sentenceRow}>
          {/* Force LTR for English text */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8, direction: "ltr" as any }}>
            {question.sentenceParts[0] ? (
              <Text style={styles.sentenceText}>{question.sentenceParts[0]} </Text>
            ) : null}

            {/* The gap */}
            <View style={[
              styles.gap,
              selected && optionState(selected) === "correct" && styles.gapCorrect,
              selected && optionState(selected) === "wrong"   && styles.gapWrong,
            ]}>
              <Text style={[
                styles.gapText,
                selected && optionState(selected) === "correct" && { color: "#FFF" },
                selected && optionState(selected) === "wrong"   && { color: "#FFF" },
              ]}>
                {selected || "___________"}
              </Text>
            </View>

            {question.sentenceParts[1] ? (
              <Text style={styles.sentenceText}> {question.sentenceParts[1]}</Text>
            ) : null}
          </View>
        </View>
      </Animated.View>

      {/* Options */}
      <View style={styles.optionsGrid}>
        {question.options.map((opt, i) => {
          const state = optionState(opt);
          return (
            <EaseView
              key={opt}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 200, delay: i * 55, easing: "easeOut" }}
              style={{ opacity: 0, transform: [{ scale: 0.88 }], flex: 1, minWidth: "45%" }}
            >
              <OptionChip opt={opt} state={state} onPress={() => pick(opt)} disabled={locked} />
            </EaseView>
          );
        })}
      </View>

      {/* Feedback row */}
      {selected && (
        <EaseView
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 200, easing: "easeOut" }}
          style={[
            styles.feedbackBar,
            optionState(selected) === "correct" ? styles.feedbackCorrect : styles.feedbackWrong,
            { opacity: 0, translateY: 12 },
          ]}
        >
          <Text style={styles.feedbackText}>
            {optionState(selected) === "correct" ? "✓ دروستە!" : `✗ وەڵامی دروست: ${question.correctAnswer}`}
          </Text>
        </EaseView>
      )}
    </View>
  );
}

function OptionChip({ opt, state, onPress, disabled }: {
  opt: string; state: "idle" | "correct" | "wrong"; onPress: () => void; disabled: boolean;
}) {
  const ty = useSharedValue(0);
  const colorP = useSharedValue(0);

  const shadowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorP.value, [0, 1, 2], ["#E5E5E5", "#58A700", "#EA2B2B"]),
  }));
  const frontStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorP.value, [0, 1, 2], ["#FFF", "#58CC02", "#FF4B4B"]),
    borderColor: interpolateColor(colorP.value, [0, 1, 2], ["#E5E5E5", "#58CC02", "#FF4B4B"]),
    transform: [{ translateY: ty.value }],
  }));

  React.useEffect(() => {
    const t = (v: number) => withTiming(v, { duration: 200, easing: Easing.out(Easing.quad) });
    if (state === "correct") colorP.value = t(1);
    else if (state === "wrong") colorP.value = t(2);
    else colorP.value = t(0);
  }, [state]);

  return (
    <Animated.View style={[styles.optBase, shadowStyle]}>
      <Animated.View style={[styles.optFront, frontStyle]}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          onPressIn={() => { ty.value = withTiming(4, { duration: 80 }); }}
          onPressOut={() => { ty.value = withTiming(0, { duration: 110 }); }}
          style={styles.optPressable}
        >
          <Text style={[
            styles.optText,
            state === "correct" && { color: "#FFF" },
            state === "wrong"   && { color: "#FFF" },
          ]}>
            {opt}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24, alignItems: "center" },
  title:     { fontSize: 20, color: "#4B4B4B", textAlign: "center", marginBottom: 8 },
  hint:      { fontSize: 15, color: "#7EC8E8", textAlign: "center", marginBottom: 22 },

  sentenceCard: {
    width: "100%",
    backgroundColor: "#EAF6FF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 2,
    borderColor: "#1CB0F6",
    boxShadow: "0px 4px 10px rgba(28, 176, 246, 0.12)" as any,
    elevation: 4,
  },
  sentenceRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" },
  sentenceText: { fontSize: 22, color: "#4B4B4B" },

  gap: {
    minWidth: 90,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 2.5,
    borderColor: "#1CB0F6",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  gapCorrect: { backgroundColor: "#58CC02", borderColor: "#58CC02", borderStyle: "solid" },
  gapWrong:   { backgroundColor: "#FF4B4B", borderColor: "#FF4B4B", borderStyle: "solid" },
  gapText:    { fontSize: 20, color: "#1CB0F6" },

  optionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, width: "100%", justifyContent: "center", marginTop: 8 },

  optBase:  { borderRadius: 14, marginBottom: 0 },
  optFront: { borderRadius: 14, borderWidth: 2, marginBottom: 4 },
  optPressable: { paddingHorizontal: 20, paddingVertical: 20, alignItems: "center" },
  optText:  { fontSize: 18, color: "#4B4B4B", textAlign: "center" },

  feedbackBar: { width: "100%", borderRadius: 16, padding: 20, alignItems: "center", marginTop: 20 },
  feedbackCorrect: { backgroundColor: "#E5FFDC" },
  feedbackWrong:   { backgroundColor: "#FFEBEB" },
  feedbackText: { fontSize: 16, color: "#4B4B4B", textAlign: "center" },
});
