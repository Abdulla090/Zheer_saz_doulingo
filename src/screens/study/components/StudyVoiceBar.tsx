import {
  Cancel01Icon,
  Mic01Icon,
  PlayIcon,
  SentIcon,
  StopIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { PressableScale } from "../../../components/animations";
import { AppText } from "../../../components/ui/AppText";
import { useSpeechCapture } from "../../../hooks/use-speech-capture";
import { useI18n } from "../../../hooks/useI18n";
import { useGamesTheme } from "../../games/games-theme";

export function StudyVoiceBar({
  onAskQuestion,
  isGenerating,
  onReplayAudio,
  speaking,
}: {
  onAskQuestion: (question: string) => void;
  isGenerating: boolean;
  onReplayAudio: () => void;
  speaking: boolean;
}) {
  const theme = useGamesTheme();
  const isDark = theme.isDark;
  const { isKu, isAr, locale } = useI18n();
  const isRtl = isKu || isAr;

  const [textInput, setTextInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState("");

  const speechLocale = isKu ? "ckb-IQ" : isAr ? "ar-IQ" : "en-US";
  const { start, stop, listening, available } = useSpeechCapture(speechLocale);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (listening || speaking) {
      pulseScale.value = withRepeat(
        withSequence(withTiming(1.15, { duration: 450 }), withTiming(1.0, { duration: 450 })),
        -1,
        true,
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 250 });
    }
  }, [listening, speaking, pulseScale]);

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleMicToggle = async () => {
    if (listening) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      stop();
      if (interimSpeech.trim()) {
        onAskQuestion(interimSpeech.trim());
        setInterimSpeech("");
      }
    } else {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setInterimSpeech("");
      await start({
        onResult: (text: string, isFinal: boolean) => {
          setInterimSpeech(text);
          if (isFinal && text.trim()) {
            onAskQuestion(text.trim());
            setInterimSpeech("");
          }
        },
        onError: (_code: string, _msg: string) => {
          setInterimSpeech("");
        },
      });
    }
  };

  const handleTextSubmit = () => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAskQuestion(trimmed);
    setTextInput("");
    setIsTyping(false);
  };

  return (
    <View
      style={[
        styles.barContainer,
        {
          backgroundColor: isDark ? "#161D24" : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0",
        },
      ]}
    >
      {/* Listening or Typing Banner if active */}
      {Boolean(listening || interimSpeech.trim()) ? (
        <View style={styles.speechFeedbackRow}>
          <View style={styles.livePulseDot} />
          <AppText
            numberOfLines={1}
            style={[styles.interimText, { color: isDark ? "#93C5FD" : "#2563EB" }]}
          >
            {interimSpeech || (isKu ? "گوێت لێیە... بپرسە" : isAr ? "نستمع إليك... تفضل بالسؤال" : "Listening... ask your question")}
          </AppText>
        </View>
      ) : null}

      <View style={styles.barInner}>
        {/* Replay Audio Button */}
        <PressableScale
          onPress={onReplayAudio}
          style={[
            styles.roundIconBtn,
            {
              backgroundColor: speaking ? "#2563EB" : isDark ? "#1E293B" : "#F1F5F9",
            },
          ]}
          accessibilityLabel={speaking ? "Stop voice" : "Listen to tutor"}
        >
          <HugeiconsIcon
            icon={speaking ? StopIcon : PlayIcon}
            size={18}
            color={speaking ? "#FFFFFF" : isDark ? "#94A3B8" : "#64748B"}
          />
        </PressableScale>

        {/* Center: Text Input or Prompt Placeholder */}
        {isTyping ? (
          <View style={styles.inputContainer}>
            <TextInput
              value={textInput}
              onChangeText={setTextInput}
              placeholder={
                isKu
                  ? "پرسیارەکەت بنووسە..."
                  : isAr
                    ? "اكتب سؤالك هنا..."
                    : "Type your question..."
              }
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
              style={[
                styles.textInputField,
                {
                  color: theme.ink,
                  textAlign: isRtl ? "right" : "left",
                },
              ]}
              autoFocus
              returnKeyType="send"
              onSubmitEditing={handleTextSubmit}
            />
            <PressableScale
              onPress={() => setIsTyping(false)}
              style={styles.cancelInputBtn}
              accessibilityLabel="Cancel typing"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} color={theme.mutedInk} />
            </PressableScale>
          </View>
        ) : (
          <PressableScale
            onPress={() => setIsTyping(true)}
            style={[
              styles.inputPlaceholderBox,
              { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" },
            ]}
            accessibilityLabel="Type question"
          >
            <AppText
              style={[styles.placeholderText, { color: theme.mutedInk }]}
              languageCode={locale}
              forceKurdishFont={isRtl}
              numberOfLines={1}
            >
              {isKu
                ? "یان پرسیارێک بنووسە لەسەر بیرکاری..."
                : isAr
                  ? "أو اكتب سؤالك في الرياضيات، الفيزياء..."
                  : "Ask anything in Math, Physics, Chem..."}
            </AppText>
          </PressableScale>
        )}

        {/* Right action button: Submit text or Microphone */}
        {isTyping ? (
          <PressableScale
            onPress={handleTextSubmit}
            disabled={!textInput.trim() || isGenerating}
            style={[
              styles.roundIconBtn,
              {
                backgroundColor: textInput.trim() ? "#2563EB" : isDark ? "#334155" : "#E2E8F0",
              },
            ]}
            accessibilityLabel="Submit question"
          >
            <HugeiconsIcon
              icon={SentIcon}
              size={18}
              color={textInput.trim() ? "#FFFFFF" : isDark ? "#64748B" : "#94A3B8"}
            />
          </PressableScale>
        ) : (
          <Animated.View style={micAnimatedStyle}>
            <PressableScale
              onPress={handleMicToggle}
              disabled={isGenerating || !available}
              style={[
                styles.roundIconBtn,
                styles.micBtn,
                {
                  backgroundColor: listening ? "#EF4444" : "#2563EB",
                },
              ]}
              accessibilityLabel={listening ? "Stop listening" : "Ask by voice"}
            >
              <HugeiconsIcon
                icon={listening ? StopIcon : Mic01Icon}
                size={20}
                color="#FFFFFF"
              />
            </PressableScale>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    ...Platform.select({
      web: {
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
      },
      default: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 14,
        elevation: 6,
      },
    }),
  },
  barInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  roundIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  micBtn: {
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  inputPlaceholderBox: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  placeholderText: {
    fontSize: 13,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    paddingHorizontal: 14,
  },
  textInputField: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  cancelInputBtn: {
    padding: 4,
  },
  speechFeedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 6,
    paddingTop: 2,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  interimText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
});
