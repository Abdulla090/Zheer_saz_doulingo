import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
// EaseView replaced with Animated.View from reanimated
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  cancelAnimation,
  Easing,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { VoiceQuestion } from "@/data/lesson-content";
import { Icon3DMic, Icon3DVolume, Icon3DCheckCircle } from "@/components/icons/Icon3D";
import { crossShadow, crossTextShadow } from "@/utils/shadows";

type Props = { question: VoiceQuestion; onAnswer: (correct: boolean) => void };
type ListenState = "idle" | "listening" | "success" | "fail";

function getSpeechRec(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

const isWebWithSpeech = Platform.OS === "web" && getSpeechRec() !== null;

// ── Ultra Premium Pill Button ──────────────────────────────────────────────────
function ActionBtn({
  label,
  icon,
  bgColor,
  textColor,
  onPress,
  disabled = false,
}: {
  label: string;
  icon?: React.ReactNode;
  bgColor: string;
  textColor: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  
  return (
    <Animated.View style={[{ width: "100%" }, faceStyle]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
        style={{
          backgroundColor: bgColor,
          paddingVertical: 18,
          borderRadius: 24,
          flexDirection: 'row',
          alignItems: "center",
          justifyContent: "center",
          ...crossShadow({
            color: bgColor,
            offsetY: 6,
            opacity: 0.25,
            blur: 12,
            elevation: 6
          }),
          elevation: 6,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      >
        {icon && <View style={{ marginRight: 10 }}>{icon}</View>}
        <Text style={{ fontSize: 17, fontWeight: "700", color: textColor, letterSpacing: 0.5 }}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}


export default function VoiceGame({ question, onAnswer }: Props) {
  const [state, setState]           = useState<ListenState>("idle");
  const [transcript, setTranscript] = useState("");
  const recRef   = useRef<any>(null);
  const firedRef = useRef(false);
  const stateRef = useRef<ListenState>("idle");

  const fireAnswer = (correct: boolean) => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAnswer(correct);
  };

  const updateState = (s: ListenState) => {
    stateRef.current = s;
    setState(s);
  };

  const micTy    = useSharedValue(0);
  const shakeX   = useSharedValue(0);
  const micStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: micTy.value }, { translateX: shakeX.value }],
  }));

  const ringS = useSharedValue(1);
  const ringO = useSharedValue(0);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringS.value }],
    opacity: ringO.value,
  }));

  const skipO  = useSharedValue(0);
  const skipStyle = useAnimatedStyle(() => ({ opacity: skipO.value }));

  const stopPulse = () => {
    cancelAnimation(ringS);
    ringS.value = withTiming(1,   { duration: 200 });
    ringO.value = withTiming(0,   { duration: 240 });
  };

  const onSuccess = (text: string) => {
    stopPulse();
    setTranscript(text);
    updateState("success");
    micTy.value = withSequence(
      withTiming(4, { duration: 105, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 155, easing: Easing.inOut(Easing.quad) })
    );
    setTimeout(() => fireAnswer(true), 980);
  };

  const onFail = () => {
    if (stateRef.current === "fail" || stateRef.current === "success") return;
    stopPulse();
    updateState("fail");
    shakeX.value = withSequence(
      withTiming(-7, { duration: 43 }), withTiming( 7, { duration: 43 }),
      withTiming(-5, { duration: 37 }), withTiming( 5, { duration: 37 }),
      withTiming( 0, { duration: 50, easing: Easing.out(Easing.quad) })
    );
    skipO.value = withTiming(1, { duration: 300 });
  };

  const startListening = () => {
    if (stateRef.current !== "idle") return;
    updateState("listening");

    ringO.value = withTiming(0.38, { duration: 180 });
    ringS.value = withRepeat(
      withSequence(
        withTiming(1.52, { duration: 720, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.0,  { duration: 620, easing: Easing.inOut(Easing.quad) })
      ), -1, false
    );

    const Rec = getSpeechRec();
    const rec = new Rec();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recRef.current = rec;

    rec.onresult = (e: any) => {
      const result = e.results[0][0].transcript.toLowerCase().trim();
      setTranscript(result);
      const target = question.targetWord.toLowerCase();
      if (result.includes(target) || target.includes(result)) {
        onSuccess(result);
      } else {
        onFail();
      }
    };
    rec.onerror = () => { onFail(); };
    rec.onend = () => {
      if (stateRef.current === "listening") {
        onFail();
      }
    };

    rec.start();
    setTimeout(() => { try { rec.stop(); } catch (_) {} }, 7000);
  };

  // ── Mobile / No-Speech-API mode ─────────────────────────────────────
  if (!isWebWithSpeech) {
    return (
      <View style={s.root}>
        {/* Preamble */}
        <Animated.View
          entering={FadeInDown.duration(300)}

          style={{}}
        >
          <Text style={[s.preamble, { color: 'rgba(255,255,255,0.9)' }]}>Pronunciation</Text>
        </Animated.View>

        <Text style={[s.prompt, crossTextShadow({ color: 'rgba(0,0,0,0.3)', offsetY: 1, blur: 3 })]}>{question.prompt}</Text>

        {/* Premium White Card */}
        <View style={s.cardWrapper}>
          <Animated.View
            style={[s.whiteCard, { opacity: 0, transform: [{ scale: 0.95 }, { translateY: 20 }] }]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
              style={s.cardGlow}
            />

            <View style={s.kuRow}>
              <View style={s.volBadge}>
                <Icon3DVolume size={18} />
              </View>
              <Text style={s.kuHint}>{question.targetKurdish}</Text>
            </View>
            <Text style={s.targetWord}>{question.targetWord}</Text>
          </Animated.View>
        </View>

        <Text style={s.mobileInstruction}>ئەم دەقەیە بە دەنگی بەرز بڵێ، پاشان هەڵبژێرە</Text>

        {/* Premium Actions */}
        <Animated.View
          style={[s.mobileActionWrap, { opacity: 0, translateY: 16 }]}
        >
          <ActionBtn 
            label="بڵێیم کرد (I said it)" 
            icon={<Icon3DCheckCircle size={22} />}
            bgColor="#10B981" 
            textColor="#FFFFFF" 
            onPress={() => fireAnswer(true)} 
          />
          <View style={{ height: 12 }} />
          <ActionBtn 
            label="نەمتوانی بڵێم (Skip)" 
            bgColor="#FFFFFF" 
            textColor="#64748B" 
            onPress={() => fireAnswer(false)} 
          />
        </Animated.View>
      </View>
    );
  }

  // ── Web mode ───────────────────────────────
  const micBg = state === "listening" ? "#3B82F6" : state === "success" ? "#10B981" : state === "fail" ? "#EF4444" : "#FFFFFF";
  const statusColor = state === "success" ? "#10B981" : state === "fail" ? "#EF4444" : "rgba(255,255,255,0.7)";
  const statusText =
    state === "idle"      ? "دوگمەی مایکرۆفۆن بپەڕینە" :
    state === "listening" ? "گوێم لێیە... قسەبکە" :
    state === "success"   ? "باشە! دروستت بووە" :
                            "هەڵەیە، دووبارە هەوڵبدەوە";

  return (
    <View style={s.root}>
      {/* Preamble */}
      <Animated.View
        entering={FadeInDown.duration(300)}

        style={{}}
      >
        <Text style={[s.preamble, { color: 'rgba(255,255,255,0.9)' }]}>Pronunciation</Text>
      </Animated.View>

      <Text style={[s.prompt, crossTextShadow({ color: 'rgba(0,0,0,0.3)', offsetY: 1, blur: 3 })]}>{question.prompt}</Text>

      {/* Premium White Card */}
      <View style={s.cardWrapper}>
        <Animated.View
          style={[s.whiteCard, { opacity: 0, transform: [{ scale: 0.95 }, { translateY: 20 }] }]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
            style={s.cardGlow}
          />
          <View style={s.kuRow}>
            <View style={s.volBadge}>
              <Icon3DVolume size={18} />
            </View>
            <Text style={s.kuHint}>{question.targetKurdish}</Text>
          </View>
          <Text style={s.targetWord}>{question.targetWord}</Text>
        </Animated.View>
      </View>

      <Animated.View
        style={[s.micOuter, { opacity: 0, translateY: 14 }]}
      >
        <Animated.View style={[s.ring, { backgroundColor: micBg }, ringStyle]} />

        <Animated.View style={[micStyle, s.micFront, { backgroundColor: micBg }]}>
          <Pressable
            onPress={startListening}
            disabled={state !== "idle"}
            onPressIn={() => { micTy.value = withTiming(6, { duration: 80 }); }}
            onPressOut={() => { micTy.value = withTiming(0, { duration: 120 }); }}
            style={s.micInner}
          >
            <Icon3DMic size={36} />
          </Pressable>
        </Animated.View>
      </Animated.View>

      <Text style={[s.status, { color: statusColor }]}>{statusText}</Text>

      {/* Transcript reveal */}
      {transcript.length > 0 && (
        <Animated.View
          style={[s.transcriptBox, { opacity: 0, transform: [{ scale: 0.93 }] }]}
        >
          <Text style={s.transcriptLabel}>بیلێی:</Text>
          <Text style={s.transcriptText}>{transcript}</Text>
        </Animated.View>
      )}

      {/* Skip / Retry buttons on fail */}
      {state === "fail" && (
        <Animated.View style={[s.actionRow, skipStyle]}>
          <View style={{ flex: 1 }}>
            <ActionBtn 
              label="دووبارە هەوڵبدە" 
              bgColor="#FFFFFF" 
              textColor="#3B82F6" 
              onPress={() => { firedRef.current = false; setState("idle"); setTranscript(""); }} 
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <ActionBtn 
              label="بگوزەرێ" 
              bgColor="rgba(255,255,255,0.2)" 
              textColor="#FFFFFF" 
              onPress={() => fireAnswer(false)} 
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  preamble: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  prompt: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  cardWrapper: {
    width: "100%",
    marginBottom: 36,
  },
  whiteCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: "center",
    ...crossShadow({
      color: "#000000",
      offsetY: 24,
      opacity: 0.15,
      blur: 40,
      elevation: 16
    }),
    position: "relative",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
  },
  cardGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 40,
    borderTopLeftRadius: 36, borderTopRightRadius: 36,
  },
  kuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  volBadge: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  kuHint: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0284C7",
    letterSpacing: -0.3,
  },
  targetWord: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 0,
    textAlign: "center",
    lineHeight: 44,
  },

  // Mobile
  mobileInstruction: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 24,
  },
  mobileActionWrap: {
    width: "100%",
  },

  // Web Mic
  micOuter: {
    width: 130, height: 130,
    alignItems: "center", justifyContent: "center",
    marginBottom: 20,
    alignSelf: 'center',
  },
  ring: {
    position: "absolute",
    width: 110, height: 110,
    borderRadius: 55,
  },
  micFront: {
    width: 96, height: 96,
    borderRadius: 48,
    alignItems: "center", justifyContent: "center",
    ...crossShadow({
      color: "#000",
      offsetY: 12,
      opacity: 0.15,
      blur: 20,
      elevation: 10
    }),
  },
  micInner: {
    width: 96, height: 96,
    borderRadius: 48,
    alignItems: "center", justifyContent: "center",
  },

  status: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  transcriptBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  transcriptLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  transcriptText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  actionRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: "auto" as any,
    paddingTop: 20,
  },
});
