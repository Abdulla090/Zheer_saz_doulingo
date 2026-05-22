import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { Image } from "expo-image";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
// Animations use Reanimated entering API
import { Icon3DCheck, Icon3DX } from "@/components/icons/Icon3D";
import { MultipleChoiceQuestion } from "@/data/lesson-content";
import { LinearGradient } from "expo-linear-gradient";
import { crossShadow } from "@/utils/shadows";

type Props = {
  question: MultipleChoiceQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

type State = "idle" | "correct" | "showCorrect" | "wrong";

// ── Ultra Premium iOS Button ──────────────────────────────────────────────────
function OptionBtn({
  text,
  state,
  onPress,
  disabled,
  delay,
  index,
}: {
  text: string;
  state: State;
  onPress: () => void;
  disabled: boolean;
  delay: number;
  index: number;
}) {
  const p = useSharedValue(0); // 0=idle 1=correct/showCorrect 2=wrong
  const scale = useSharedValue(1);

  React.useEffect(() => {
    const t = (v: number) =>
      withTiming(v, { duration: 250, easing: Easing.out(Easing.cubic) });
    if (state === "idle") p.value = t(0);
    if (state === "correct" || state === "showCorrect") p.value = t(1);
    if (state === "wrong") p.value = t(2);
  }, [state]);

  const faceStyle = useAnimatedStyle(() => {
    const base = {
      backgroundColor: interpolateColor(
        p.value,
        [0, 1, 2],
        ["#FFFFFF", "#ECFDF5", "#FEF2F2"]
      ),
      borderColor: interpolateColor(
        p.value,
        [0, 1, 2],
        ["#F1F5F9", "#10B981", "#EF4444"]
      ),
      transform: [{ scale: scale.value }],
    } as any;
    
    if (Platform.OS === "web") {
      base.boxShadow = `0px 6px 12px rgba(16, 185, 129, 0.1)`;
    } else {
      base.shadowColor = interpolateColor(p.value, [0, 1, 2], ["#94A3B8", "#10B981", "#EF4444"]);
      base.shadowOpacity = interpolateColor(p.value, [0, 1, 2], [0.08, 0.2, 0.2]);
    }
    return base;
  });

  const letterColor = {
    idle: "#64748B",
    correct: "#059669",
    showCorrect: "#059669",
    wrong: "#DC2626",
  }[state];

  const letterBg = {
    idle: "#F8FAFC",
    correct: "#D1FAE5",
    showCorrect: "#D1FAE5",
    wrong: "#FEE2E2",
  }[state];

  const textColor = {
    idle: "#0F172A",
    correct: "#065F46",
    showCorrect: "#065F46",
    wrong: "#991B1B",
  }[state];

  const isCorrectState = state === "correct" || state === "showCorrect";
  const letter = ["A", "B", "C", "D", "E"][index % 5];

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(350)}
      style={{ width: "100%", marginBottom: 14 }}
    >
      <Animated.View style={[s.face, faceStyle]}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          onPressIn={() => {
            scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 15, stiffness: 300 });
          }}
          style={s.pressable}
        >
          <View style={[s.letterCircle, { backgroundColor: letterBg, ...crossShadow({ color: "#000", offsetY: 2, opacity: 0.04, blur: 4 }) }]}>
            <Text style={[s.letterText, { color: letterColor }]}>{letter}</Text>
          </View>
          
          <Text style={[s.optText, { color: textColor }]} numberOfLines={2}>
            {text}
          </Text>
          
          {isCorrectState && (
            <Animated.View style={{ transform: [{ scale: p }] }}>
              <Icon3DCheck size={24} />
            </Animated.View>
          )}
          {state === "wrong" && (
            <Animated.View style={{ transform: [{ scale: p }] }}>
              <Icon3DX size={24} />
            </Animated.View>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MultipleChoiceGame({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const firedRef = useRef(false);

  const pick = (opt: string) => {
    if (locked) return;
    setSelected(opt);
    setLocked(true);
    const correct = opt === question.correctAnswer;
    setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        onAnswer(correct);
      }
    }, 600); // give time for beautiful spring animations to complete
  };

  const getState = (opt: string): State => {
    if (!locked) return "idle";
    if (opt === selected) return opt === question.correctAnswer ? "correct" : "wrong";
    if (opt === question.correctAnswer && selected !== null && selected !== question.correctAnswer) {
      return "showCorrect";
    }
    return "idle";
  };

  return (
    <View style={s.root}>
      {/* Question Progress/Preamble */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{ alignItems: 'center', marginBottom: 24 }}
      >
         <Text style={{ fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
           Multiple Choice
         </Text>
      </Animated.View>

      {/* Ultra Premium Floating White Card */}
      <View style={s.cardWrapper}>
        <Animated.View
          entering={FadeInUp.delay(100).springify().damping(18).stiffness(100)}
          style={s.whiteCard}
        >
          {/* Subtle Top Inner Glow via LinearGradient */}
          <LinearGradient
            colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, borderTopLeftRadius: 36, borderTopRightRadius: 36 }}
          />

          {/* Top text area */}
          <View style={s.questionArea}>
            <Text style={s.questionText}>{question.prompt}</Text>
          </View>

          {/* Options */}
          <View style={s.optionsList}>
            {question.options.map((opt, i) => (
              <OptionBtn
                key={opt}
                index={i}
                text={opt}
                state={getState(opt)}
                onPress={() => pick(opt)}
                disabled={locked}
                delay={150 + i * 80}
              />
            ))}
          </View>

          {/* Dolphin Mascot on top right */}
          <View style={s.mascotWrap}>
            <Animated.View
               entering={FadeInUp.delay(300).springify().damping(12).stiffness(90)}
               style={{ width: '100%', height: '100%' }}
            >
              <Image
                source={{ uri: "https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/WN31PESNqnk/components/Pf9EJxsRI9K.png" }}
                style={s.mascotImg}
                contentFit="contain"
              />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cardWrapper: {
    flex: 1,
    paddingTop: 45, // space for dolphin to overlap
  },
  whiteCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    ...crossShadow({ color: "#000000", offsetY: 24, opacity: 0.15, blur: 40, elevation: 16 }),
    position: "relative",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
  },
  mascotWrap: {
    position: "absolute",
    right: -15,
    top: -65,
    width: 140,
    height: 140,
    zIndex: 10,
    ...crossShadow({ color: "#000", offsetY: 12, opacity: 0.15, blur: 16 }),
  },
  mascotImg: {
    width: "100%",
    height: "100%",
  },
  questionArea: {
    paddingRight: 90, // leave space for mascot
    marginBottom: 36,
    minHeight: 80,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 32,
    letterSpacing: -0.5,
    textAlign: "left",
  },
  optionsList: {
    width: "100%",
  },

  // Ultra Premium iOS Option Button anatomy
  face: {
    borderRadius: 24,
    borderWidth: 1.5,
    width: "100%",
    ...crossShadow({ color: "#94A3B8", offsetY: 6, opacity: 0.08, blur: 12, elevation: 3 }),
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 16,
  },
  letterCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  letterText: {
    fontSize: 15,
    fontWeight: "800",
  },
  optText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.2,
    textAlign: "left",
  },
});
