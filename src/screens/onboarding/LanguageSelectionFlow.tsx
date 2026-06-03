import { useI18n } from "@/hooks/useI18n";
import { useSettingsStore } from "@/stores/useSettingsStore";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Step = "native" | "target";

type Props = {
  onFinish: () => void;
};

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
    setTimeout(() => setStep("target"), 150);
  };

  const handleSelectTarget = (lang: string) => {
    if (Platform.OS !== "web") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTargetLang(lang);
    setTimeout(() => onFinish(), 200);
  };

  return (
    <View style={s.root}>
      {step === "native" ? (
        <Animated.View key="native" entering={FadeIn} exiting={FadeOut} style={s.content}>
          <Text style={s.title}>What is your native language?</Text>
          <Text style={s.subtitle}>Select the language you speak best.</Text>
          
          <TouchableOpacity style={s.button} onPress={() => handleSelectNative("en")} activeOpacity={0.7}>
            <Text style={s.buttonText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.button} onPress={() => handleSelectNative("ku")} activeOpacity={0.7}>
            <Text style={s.buttonText}>Kurdish (Sorani)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.button} onPress={() => handleSelectNative("ar")} activeOpacity={0.7}>
            <Text style={s.buttonText}>Arabic</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View key="target" entering={FadeIn} exiting={FadeOut} style={s.content}>
          <Text style={s.title}>What do you want to learn?</Text>
          <Text style={s.subtitle}>Choose your target language.</Text>
          
          <TouchableOpacity style={s.button} onPress={() => handleSelectTarget("en")} activeOpacity={0.7}>
            <Text style={s.buttonText}>English</Text>
          </TouchableOpacity>
          {native !== "ku" && (
            <TouchableOpacity style={s.button} onPress={() => handleSelectTarget("ku")} activeOpacity={0.7}>
              <Text style={s.buttonText}>Kurdish (Sorani)</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "stretch",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
});
