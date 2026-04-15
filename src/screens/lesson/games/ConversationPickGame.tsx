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
import { ConversationPickQuestion } from "@/data/lesson-content";
import { MessageCircle, User } from "lucide-react-native";

type Props = { question: ConversationPickQuestion; onAnswer: (correct: boolean) => void };

export default function ConversationPickGame({ question, onAnswer }: Props) {
  const [selected, setSelected]   = useState<string | null>(null);
  const [showExp, setShowExp]     = useState(false);
  const [locked, setLocked]       = useState(false);

  const firedRef = useRef(false);
  const fireAnswer = (correct: boolean) => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAnswer(correct);
  };

  const pick = (opt: string) => {
    if (locked) return;
    setSelected(opt);
    setLocked(true);

    const ok = opt === question.correctAnswer;
    if (ok) {
      setShowExp(true);
      setTimeout(() => fireAnswer(true), 1600);
    } else {
      setShowExp(true);
      // Auto-unlock after 2s so user can try again
      setTimeout(() => {
        setSelected(null);
        setShowExp(false);
        setLocked(false);
      }, 2000);
    }
  };

  const state = (opt: string): "idle" | "correct" | "wrong" => {
    if (selected !== opt) return "idle";
    return opt === question.correctAnswer ? "correct" : "wrong";
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Situation label */}
      <EaseView
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 220, easing: "easeOut" }}
        style={[styles.situationBox, { opacity: 0, translateY: -8 }]}
      >
        <Text style={styles.situationLabel}>📍 شوێن</Text>
        <Text style={styles.situation}>{question.situation}</Text>
      </EaseView>

      {/* They ask (speech bubble) */}
      <EaseView
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 250, delay: 80, easing: "easeOut" }}
        style={[styles.bubbleWrapper, { opacity: 0, transform: [{ scale: 0.9 }] }]}
      >
        <View style={styles.avatarCircle}>
          <User color="#FFF" size={20} />
        </View>
        <View style={[styles.bubble, { direction: "ltr" } as any]}>
          <Text style={styles.bubbleText}>{question.theyAsk}</Text>
        </View>
      </EaseView>

      {/* Prompt */}
      <Text style={styles.prompt}>ئینگلیزی باشترین وەڵام کوێیە؟</Text>

      {/* Options */}
      <View style={styles.options}>
        {question.options.map((opt, i) => (
          <EaseView
            key={opt}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 210, delay: 120 + i * 65, easing: "easeOut" }}
            style={{ opacity: 0, translateY: 14 }}
          >
            <OptionRow opt={opt} chipState={state(opt)} onPress={() => pick(opt)} disabled={locked} />
          </EaseView>
        ))}
      </View>

      {/* Explanation after selection */}
      {showExp && (
        <EaseView
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 250, easing: "easeOut" }}
          style={[
            styles.expBox,
            selected === question.correctAnswer ? styles.expCorrect : styles.expWrong,
            { opacity: 0, transform: [{ scale: 0.93 }] },
          ]}
        >
          <Text style={styles.expIcon}>
            {selected === question.correctAnswer ? "✓" : "✗"}
          </Text>
          <Text style={styles.expText}>{question.explanation}</Text>
        </EaseView>
      )}
    </ScrollView>
  );
}

// ─── Option Row ─────────────────────────────────────────────────────────────
function OptionRow({ opt, chipState, onPress, disabled }: {
  opt: string; chipState: "idle" | "correct" | "wrong"; onPress: () => void; disabled: boolean;
}) {
  const ty       = useSharedValue(0);
  const colorP   = useSharedValue(0);

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
    if (chipState === "correct") colorP.value = t(1);
    else if (chipState === "wrong") colorP.value = t(2);
    else colorP.value = t(0);
  }, [chipState]);

  return (
    <Animated.View style={[styles.optBase, shadowStyle]}>
      <Animated.View style={[styles.optFront, frontStyle]}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          onPressIn={() => { ty.value = withTiming(4, { duration: 80 }); }}
          onPressOut={() => { ty.value = withTiming(0, { duration: 115 }); }}
          style={styles.optPressable}
        >
          <MessageCircle
            color={chipState === "idle" ? "#1CB0F6" : "#FFF"}
            size={18}
            style={{ marginRight: 10, flexShrink: 0 }}
          />
          {/* Force LTR for English option text */}
          <Text style={[
            styles.optText,
            chipState !== "idle" && { color: "#FFF" },
          ]}>
            {opt}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 32, gap: 16 },

  situationBox: {
    backgroundColor: "#F5F3FF",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1CB0F6",
  },
  situationLabel: { fontSize: 12, color: "#1CB0F6", marginBottom: 4 },
  situation:      { fontSize: 15, color: "#4B4B4B", textAlign: "right" },

  bubbleWrapper: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  avatarCircle:  {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#1CB0F6",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  bubble: {
    flex: 1,
    backgroundColor: "#EAF6FF",
    borderRadius: 18,
    borderTopRightRadius: 4,
    padding: 16,
    borderWidth: 2,
    borderColor: "#1CB0F6",
    // direction: "ltr" applied as inline style on the View — web validator rejects it in StyleSheet
  },
  bubbleText: { fontSize: 19, color: "#1CB0F6", lineHeight: 28 },

  prompt: { fontSize: 17, color: "#4B4B4B", textAlign: "center" },

  options: { gap: 10 },

  // 3D option chip
  optBase:  { borderRadius: 14 },
  optFront: { borderRadius: 14, borderWidth: 2, marginBottom: 4 },
  optPressable: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 16 },
  optText:  { fontSize: 16, color: "#4B4B4B", flex: 1, writingDirection: "ltr" },

  // Explanation
  expBox: {
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 2,
  },
  expCorrect: { backgroundColor: "#E5FFDC", borderColor: "#58CC02" },
  expWrong:   { backgroundColor: "#FFEBEB", borderColor: "#FF4B4B" },
  expIcon:    { fontSize: 22 },
  expText:    { fontSize: 14, color: "#4B4B4B", flex: 1, textAlign: "right" },
});
