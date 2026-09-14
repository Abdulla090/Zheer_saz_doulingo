import { Cancel01Icon, Mic01Icon, SentIcon, StopIcon, Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TextInput, View, Image, Modal, Pressable } from "react-native";
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
import { LiquidGlassSurface } from "../../../components/LiquidGlassSurface";

export function StudyVoiceBar({
  onAskQuestion,
  isGenerating,
  onReplayAudio,
  speaking,
  currentLessonHasAudio,
}: {
  onAskQuestion: (question: string, imageBase64?: string, imageMimeType?: string) => void;
  isGenerating: boolean;
  onReplayAudio: () => void;
  speaking: boolean;
  currentLessonHasAudio?: boolean;
}) {
  const theme = useGamesTheme();
  const isDark = theme.isDark;
  const { isKu, isAr } = useI18n();
  const isRtl = isKu || isAr;

  const [textInput, setTextInput] = useState("");
  const [interimSpeech, setInterimSpeech] = useState("");
  const [selectedImage, setSelectedImage] = useState<{ uri: string; base64: string; mimeType: string } | null>(null);
  const [showMediaMenu, setShowMediaMenu] = useState(false);

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
      if (interimSpeech.trim() || selectedImage) {
        onAskQuestion(interimSpeech.trim(), selectedImage?.base64 ?? undefined, selectedImage?.mimeType ?? undefined);
        setInterimSpeech("");
        setSelectedImage(null);
      }
    } else {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setInterimSpeech("");
      await start({
        onResult: (text: string, isFinal: boolean) => {
          setInterimSpeech(text);
          if (isFinal && (text.trim() || selectedImage)) {
            onAskQuestion(text.trim(), selectedImage?.base64 ?? undefined, selectedImage?.mimeType ?? undefined);
            setInterimSpeech("");
            setSelectedImage(null);
          }
        },
        onError: () => {
          setInterimSpeech("");
        },
      });
    }
  };

  const handleTextSubmit = () => {
    const trimmed = textInput.trim();
    if (!trimmed && !selectedImage) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAskQuestion(trimmed, selectedImage?.base64 ?? undefined, selectedImage?.mimeType ?? undefined);
    setTextInput("");
    setSelectedImage(null);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.4,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      const asset = result.assets[0];
      const mimeType = asset.uri.endsWith(".png") ? "image/png" : "image/jpeg";
      setSelectedImage({ uri: asset.uri, base64: asset.base64 as string, mimeType });
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.4,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const asset = result.assets[0];
      const mimeType = asset.uri.endsWith(".png") ? "image/png" : "image/jpeg";
      setSelectedImage({ uri: asset.uri, base64: asset.base64 as string, mimeType });
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const mimeType = asset.mimeType || "application/octet-stream";
        let base64 = "";
        try {
           base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
        } catch (e) {
           console.log("Could not read file as base64", e);
        }
        setSelectedImage({ uri: asset.uri, base64, mimeType });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddMedia = () => {
    setShowMediaMenu((prev) => !prev);
  };

  return (
    <>
      <Modal
        visible={showMediaMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMediaMenu(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowMediaMenu(false)}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: isDark ? "#1E293B" : "#FFFFFF" },
            ]}
          >
            <PressableScale
              style={styles.mediaMenuItem}
              onPress={() => {
                setShowMediaMenu(false);
                void handleTakePhoto();
              }}
            >
              <AppText style={[styles.mediaMenuText, { color: theme.ink }]}>
                📸 {isKu ? "وێنە بگرە" : isAr ? "التقاط صورة" : "Take Photo"}
              </AppText>
            </PressableScale>
            <View style={[styles.menuDivider, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0" }]} />
            <PressableScale
              style={styles.mediaMenuItem}
              onPress={() => {
                setShowMediaMenu(false);
                void handlePickImage();
              }}
            >
              <AppText style={[styles.mediaMenuText, { color: theme.ink }]}>
                🖼️ {isKu ? "لە گەلەری هەڵبژێرە" : isAr ? "اختيار من الصور" : "Photo Library"}
              </AppText>
            </PressableScale>
            <View style={[styles.menuDivider, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0" }]} />
            <PressableScale
              style={styles.mediaMenuItem}
              onPress={() => {
                setShowMediaMenu(false);
                void handlePickDocument();
              }}
            >
              <AppText style={[styles.mediaMenuText, { color: theme.ink }]}>
                📁 {isKu ? "فایل هەڵبژێرە" : isAr ? "اختيار ملف" : "Choose File"}
              </AppText>
            </PressableScale>
          </View>
        </Pressable>
      </Modal>

      <LiquidGlassSurface
        borderRadius={28}
        shadowDepth="tab"
        style={[
          styles.barContainer,
          {
            borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(226, 232, 240, 0.8)",
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

        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
            <PressableScale
              onPress={() => setSelectedImage(null)}
              style={styles.imageRemoveBtn}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} color="#FFF" />
            </PressableScale>
          </View>
        )}

        <View
          style={[
            styles.barInner,
            {
              flexDirection: isRtl ? "row-reverse" : "row",
            },
          ]}
        >
          <View style={styles.mediaActionsRow}>
            <PressableScale onPress={handleAddMedia} disabled={isGenerating} style={[styles.roundIconBtn, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }]}>
              <HugeiconsIcon icon={showMediaMenu ? Cancel01Icon : Add01Icon} size={22} color={isDark ? "#94A3B8" : "#64748B"} />
            </PressableScale>
          </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            onChangeText={setTextInput}
            placeholder={isKu ? "پرسیارەکەت بنووسە..." : isAr ? "اكتب سؤالك هنا..." : "Ask a question..."}
            placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
            style={[styles.textInputField, { color: theme.ink, textAlign: isRtl ? "right" : "left" }]}
            returnKeyType="send"
            onSubmitEditing={handleTextSubmit}
            multiline
            maxLength={2000}
          />
        </View>

        {(textInput.trim() || selectedImage) ? (
          <PressableScale
            onPress={handleTextSubmit}
            disabled={(!textInput.trim() && !selectedImage) || isGenerating}
            style={[
              styles.roundIconBtn,
              styles.micBtn,
              { backgroundColor: "#2563EB" },
            ]}
            accessibilityLabel="Submit question"
          >
            <HugeiconsIcon
              icon={SentIcon}
              size={18}
              color="#FFFFFF"
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
                  backgroundColor: listening ? "#EF4444" : isDark ? "#1E293B" : "#F1F5F9",
                },
              ]}
              accessibilityLabel={listening ? "Stop listening" : "Ask by voice"}
            >
              <HugeiconsIcon
                icon={listening ? StopIcon : Mic01Icon}
                size={20}
                color={listening ? "#FFFFFF" : isDark ? "#94A3B8" : "#64748B"}
              />
            </PressableScale>
          </Animated.View>
        )}
      </View>
    </LiquidGlassSurface>
    </>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backdropFilter: "blur(20px)",
    ...Platform.select({
      web: {
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
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
  mediaActionsRow: {
    flexDirection: "row",
    gap: 6,
  },
  mediaActionsRowPlaceholder: {
    flexDirection: "row",
    gap: 4,
  },
  smallMediaBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  micBtn: {
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  inputPlaceholderBox: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  placeholderText: {
    fontSize: 14,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    paddingHorizontal: 16,
  },
  textInputField: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  cancelInputBtn: {
    padding: 6,
  },
  speechFeedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingTop: 2,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  interimText: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    marginLeft: 8,
    marginTop: 4,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#E2E8F0"
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#000',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    paddingBottom: 90,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.15)",
    ...Platform.select({
      web: {
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
      },
    }),
  },
  mediaMenuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  mediaMenuText: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 12,
  },
});
