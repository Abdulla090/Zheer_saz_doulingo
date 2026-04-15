import React, { useState } from "react";
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
import { MultipleChoiceQuestion } from "@/data/lesson-content";
import { CheckCircle2, XCircle } from "lucide-react-native";
import { useKurdishFont } from "@/hooks/useKurdishFont";

type ChipState = "idle" | "correct" | "wrong" | "dimmed";
type Props = { question: MultipleChoiceQuestion; onAnswer: (correct: boolean) => void };

// ─── Single option chip ────────────────────────────────────────────
function OptionChip({ label, chipState, delay, onPress }: {
  label: string; chipState: ChipState; delay: number; onPress: () => void;
}) {
  // Reanimated: border + bg color interpolation
  const colorP   = useSharedValue(0); // 0=idle, 1=correct, 2=wrong
  const shakeX   = useSharedValue(0);
  const popScale = useSharedValue(1);
  const ty       = useSharedValue(0);

  const shadowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorP.value, [0, 1, 2], ["#E5E5E5", "#58A700", "#EA2B2B"]),
  }));

  const frontStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(colorP.value, [0, 1, 2], ["#E5E5E5", "#58CC02", "#FF4B4B"]),
    backgroundColor: interpolateColor(colorP.value, [0, 1, 2], ["#FFFFFF", "#E5FFDC", "#FFEBEB"]),
    transform: [{ translateX: shakeX.value }, { scale: popScale.value }, { translateY: ty.value }],
  }));

  React.useEffect(() => {
    const t = (v: number) => withTiming(v, { duration: 200, easing: Easing.out(Easing.quad) });
    if (chipState === "correct") {
      colorP.value = t(1);
      popScale.value = withSequence(
        withTiming(1.05, { duration: 110, easing: Easing.out(Easing.cubic) }),
        withTiming(1.0,  { duration: 160, easing: Easing.inOut(Easing.quad) })
      );
    } else if (chipState === "wrong") {
      colorP.value = t(2);
      shakeX.value = withSequence(
        withTiming(-7, { duration: 44 }),
        withTiming( 7, { duration: 44 }),
        withTiming(-5, { duration: 37 }),
        withTiming( 5, { duration: 37 }),
        withTiming( 0, { duration: 48, easing: Easing.out(Easing.quad) })
      );
    }
  }, [chipState]);

  return (
    // EaseView — handles staggered slide-up entrance from native layer
    <EaseView
      animate={{ opacity: chipState === "dimmed" ? 0.3 : 1, translateY: 0 }}
      transition={{ type: "timing", duration: 240, delay, easing: "easeOut" }}
      style={{ translateY: 18, opacity: 0 }}
    >
      <Animated.View style={[styles.optionBase, shadowStyle]}>
        <Animated.View style={[styles.optionFront, frontStyle]}>
          <Pressable
            onPress={onPress}
            disabled={chipState !== "idle"}
            onPressIn={() => { ty.value = withTiming(4, { duration: 80 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 120 }); }}
            style={styles.optionInner}
          >
            {chipState === "correct" && <CheckCircle2 color="#58CC02" size={22} style={styles.icon} />}
            {chipState === "wrong"   && <XCircle      color="#FF4B4B" size={22} style={styles.icon} />}
            <Text style={[styles.optionText, chipState === "correct" && { color: "#58CC02" }, chipState === "wrong" && { color: "#FF4B4B" }]}>
              {label}
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </EaseView>
  );
}

// ─── Screen ────────────────────────────────────────────────────────
export default function MultipleChoiceGame({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const font = useKurdishFont();

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onAnswer(opt === question.correctAnswer), 820);
  };

  const getState = (opt: string): ChipState => {
    if (!selected) return "idle";
    if (opt === question.correctAnswer) return "correct";
    if (opt === selected) return "wrong";
    return "dimmed";
  };

  return (
    <View style={styles.container}>
      {/* EaseView — scale-in from native thread */}
      <EaseView
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 280, easing: "easeOut" }}
        style={[styles.prompt, { opacity: 0, transform: [{ scale: 0.91 }] }]}
      >
        <Text style={styles.promptText}>{question.prompt}</Text>
        <Text style={styles.promptSub}>
          {question.promptLang === "ku" ? "وەڵام بدەوە" : "Choose the correct translation"}
        </Text>
      </EaseView>

      <View style={styles.grid}>
        {question.options.map((opt, i) => (
          <OptionChip
            key={opt}
            label={opt}
            chipState={getState(opt)}
            delay={80 + i * 55}
            onPress={() => handleSelect(opt)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },
  prompt: {
    backgroundColor: "#EAF6FF",
    borderRadius: 22,
    padding: 26,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#1CB0F6",
    boxShadow: "0px 5px 14px rgba(28, 176, 246, 0.15)" as any,
    elevation: 5,
  },
  promptText: { fontSize: 24, color: "#1CB0F6", textAlign: "center", marginBottom: 6 },
  promptSub:  { fontSize: 14, color: "#7EC8E8", textAlign: "center" },
  grid: { gap: 14 },
  
  // 3D Option Button
  optionBase: {
    borderRadius: 16,
  },
  optionFront: {
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 4, // 3D depth
    backgroundColor: "#FFFFFF",
  },
  optionInner: { flexDirection: "row", alignItems: "center", paddingVertical: 18, paddingHorizontal: 18 },
  icon:        { marginRight: 12 },
  optionText:  { fontSize: 18, color: "#4B4B4B" },
});

