import { useI18n } from "@/hooks/useI18n";
import { useBosonTTS } from "@/hooks/useBosonTTS";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export function RolePlayScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const { speak, isPlaying } = useBosonTTS();
  const [isListening, setIsListening] = useState(false);

  // Orb animation
  const orbScale = useSharedValue(1);
  const orbOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (isPlaying) {
      // Pulse animation when AI is speaking
      orbScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      orbOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 600 }),
          withTiming(0.5, { duration: 600 })
        ),
        -1,
        true
      );
    } else if (isListening) {
      // Different pulse for listening
      orbScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      orbOpacity.value = withTiming(0.3);
    } else {
      // Idle
      orbScale.value = withTiming(1);
      orbOpacity.value = withTiming(0.5);
    }
  }, [isPlaying, isListening]);

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
    opacity: orbOpacity.value,
  }));

  const toggleMic = () => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isListening) {
      setIsListening(true);
      // Mock flow: user speaks, then AI responds
      setTimeout(() => {
        setIsListening(false);
        speak("Hello! How can I help you today? I am your AI conversational partner.");
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleEnd = () => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.back();
  };

  return (
    <View style={s.root}>
      <LinearGradient colors={["#0A0B10", "#1A1B26"]} style={StyleSheet.absoluteFill} />

      {/* Animated Glowing Orb Background */}
      <View style={s.orbContainer}>
        <Animated.View style={[s.orb, animatedOrbStyle]}>
          <LinearGradient
            colors={["#3B82F6", "#8B5CF6"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
      </View>

      {/* Header */}
      <View style={s.header}>
        <View style={s.badge}>
          <Text style={s.badgeText}>SCENARIO: COFFEE SHOP</Text>
        </View>
        <Text style={s.instruction}>You are a customer ordering a latte.</Text>
      </View>

      {/* Status */}
      <View style={s.statusContainer}>
        <Text style={s.statusText}>
          {isPlaying ? "AI is speaking..." : isListening ? "Listening to you..." : "Tap the mic to speak"}
        </Text>
      </View>

      {/* Controls */}
      <View style={s.footer}>
        <TouchableOpacity style={s.endButton} onPress={handleEnd} activeOpacity={0.8}>
          <Text style={s.endButtonIcon}>✖</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.micButton, isListening && s.micButtonActive]} onPress={toggleMic} activeOpacity={0.9}>
          <BlurView intensity={50} tint="light" style={s.micBlur}>
            <Text style={s.micIcon}>{isListening ? "⏹" : "🎙"}</Text>
          </BlurView>
        </TouchableOpacity>

        <View style={s.spacer} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0A0B10",
  },
  orbContainer: {
    position: "absolute",
    top: height * 0.2,
    left: 0,
    right: 0,
    bottom: height * 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  orb: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 999,
    opacity: 0.5,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  badgeText: {
    color: "#A78BFA",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    fontFamily: "DINNextRoundedBold",
  },
  instruction: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "DINNextRoundedBold",
    lineHeight: 30,
  },
  statusContainer: {
    position: "absolute",
    bottom: height * 0.25,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  statusText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontFamily: "DINNextRoundedMedium",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  endButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  endButtonIcon: {
    color: "#EF4444",
    fontSize: 24,
  },
  micButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  micButtonActive: {
    borderColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  micBlur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  micIcon: {
    fontSize: 36,
    color: "#FFFFFF",
  },
  spacer: {
    width: 60,
  },
});
