import { useI18n } from "@/hooks/useI18n";
import { useSettingsStore } from "@/stores/useSettingsStore";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

type Step = "native" | "target";

type Props = {
  onFinish: () => void;
};

const LANGS = [
  { id: "en", label: "English", icon: "🇬🇧" },
  { id: "ku", label: "Kurdish (Sorani)", icon: "☀️" },
  { id: "ar", label: "Arabic", icon: "🇦🇪" },
];

function LangButton({ label, icon, onPress }: { label: string; icon: string; onPress: () => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={s.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0.1)"]}
          style={s.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={s.buttonIcon}>{icon}</Text>
          <Text style={s.buttonText}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function LanguageSelectionFlow({ onFinish }: Props) {
  const { t } = useI18n();
  const setNativeLang = useSettingsStore((s) => s.setNativeLang);
  const setTargetLang = useSettingsStore((s) => s.setTargetLang);

  const [step, setStep] = useState<Step>("native");
  const [native, setNative] = useState<string>("ku");

  const handleSelectNative = (lang: string) => {
    if (Platform.OS !== "web") void Haptics.selectionAsync();
    setNative(lang);
    setNativeLang(lang);
    setTimeout(() => setStep("target"), 200);
  };

  const handleSelectTarget = (lang: string) => {
    if (Platform.OS !== "web") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTargetLang(lang);
    setTimeout(() => onFinish(), 250);
  };

  const targetLangs = LANGS.filter((l) => l.id === "en" || (native !== "ku" && l.id === "ku"));

  return (
    <View style={s.root}>
      <LinearGradient colors={["#0A0B10", "#1A1B26"]} style={StyleSheet.absoluteFill} />
      
      <View style={s.glowTop} />
      <View style={s.glowBottom} />

      <BlurView intensity={80} tint="dark" style={s.blurContainer}>
        {step === "native" ? (
          <Animated.View key="native" entering={FadeInDown.springify().damping(18)} exiting={FadeOutUp} style={s.content}>
            <View style={s.badge}>
              <Text style={s.badgeText}>STEP 1 OF 2</Text>
            </View>
            <Text style={s.title}>What is your native language?</Text>
            <Text style={s.subtitle}>Select the language you speak best.</Text>
            
            <View style={s.optionsWrap}>
              {LANGS.map((l) => (
                <LangButton key={l.id} label={l.label} icon={l.icon} onPress={() => handleSelectNative(l.id)} />
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View key="target" entering={FadeInDown.springify().damping(18).delay(100)} exiting={FadeOutUp} style={s.content}>
            <View style={s.badge}>
              <Text style={s.badgeText}>STEP 2 OF 2</Text>
            </View>
            <Text style={s.title}>What do you want to learn?</Text>
            <Text style={s.subtitle}>Choose your target language.</Text>
            
            <View style={s.optionsWrap}>
              {targetLangs.map((l) => (
                <LangButton key={l.id} label={l.label} icon={l.icon} onPress={() => handleSelectTarget(l.id)} />
              ))}
            </View>
          </Animated.View>
        )}
      </BlurView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glowTop: {
    position: "absolute",
    top: -150,
    left: -100,
    width: width * 1.5,
    height: 400,
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    borderRadius: 999,
    transform: [{ scale: 1.5 }],
    filter: "blur(80px)" as any, // Web only, handled via BlurView on native
  },
  glowBottom: {
    position: "absolute",
    bottom: -150,
    right: -100,
    width: width * 1.5,
    height: 400,
    backgroundColor: "rgba(139, 92, 246, 0.25)",
    borderRadius: 999,
    transform: [{ scale: 1.5 }],
    filter: "blur(80px)" as any,
  },
  blurContainer: {
    width: "90%",
    maxWidth: 420,
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    backgroundColor: "rgba(20, 21, 30, 0.4)",
  },
  content: {
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  badgeText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    fontFamily: "DINNextRoundedBold",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "DINNextRoundedBold",
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "DINNextRoundedMedium",
    lineHeight: 24,
  },
  optionsWrap: {
    width: "100%",
    gap: 16,
  },
  button: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
  },
  buttonIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
  },
});
