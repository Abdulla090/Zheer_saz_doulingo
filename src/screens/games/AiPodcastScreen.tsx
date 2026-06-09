import { AppText } from "../../components/ui/AppText";
import {
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette as C,
} from "../../components/ui/ios-liquid-home";
import { crossShadow } from "../../utils/shadows";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  FastForward,
  Mic2,
  Pause,
  Play,
  Rewind,
  Volume2,
} from "lucide-react-native";
import React, { useState, useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useI18n } from "../../hooks/useI18n";
import { PressableScale } from "../../components/animations";
import * as Speech from "expo-speech";

const PODCAST_EPISODE = [
  { text: "Welcome to English Arabic Bites! Your daily language practice podcast.", lang: "en" },
  { text: "Today we are learning useful cafe phrases. Let's start with ordering coffee.", lang: "en" },
  { text: "In English, we say: I would like a coffee, please.", lang: "en" },
  { text: "In Arabic: Oureed qahwah, min fadlik.", lang: "ar" },
  { text: "Let's repeat that: Oureed qahwah, min fadlik.", lang: "ar" },
  { text: "Great! Next, if you want a croissant, say: and a croissant, please.", lang: "en" },
  { text: "In Arabic: wa croissant, min fadlak.", lang: "ar" },
  { text: "Thank you for listening to English Arabic Bites. See you next time!", lang: "en" }
];

const speakPodcastSentence = (text: string, lang: string, onDone: () => void) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      const synth = window.speechSynthesis;
      if (synth) {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === "en" ? "en-US" : "ar-SA";
        utterance.rate = 0.92;
        utterance.onend = onDone;
        utterance.onerror = onDone;
        synth.speak(utterance);
      }
    }
  } else {
    void Speech.stop().then(() => {
      void Speech.speak(text, {
        language: lang === "en" ? "en-US" : "ar-EG",
        rate: 0.92,
        onDone,
        onError: onDone,
        onStopped: () => {},
      });
    });
  }
};

const stopPodcastSpeaking = () => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
  } else {
    void Speech.stop();
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export function AiPodcastScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isKu } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentIdxRef = useRef(0);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    currentIdxRef.current = currentIdx;
    isPlayingRef.current = isPlaying;
  }, [currentIdx, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const sentence = PODCAST_EPISODE[currentIdx];
      if (sentence) {
        speakPodcastSentence(sentence.text, sentence.lang, () => {
          if (isPlayingRef.current) {
            if (currentIdxRef.current < PODCAST_EPISODE.length - 1) {
              setCurrentIdx(prev => prev + 1);
            } else {
              setIsPlaying(false);
              setCurrentIdx(0);
            }
          }
        });
      }
    } else {
      stopPodcastSpeaking();
    }
    return () => {
      stopPodcastSpeaking();
    };
  }, [isPlaying, currentIdx]);

  const togglePlay = () => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    stopPodcastSpeaking();
    setCurrentIdx(0);
  };

  const handleFastForward = () => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    stopPodcastSpeaking();
    setCurrentIdx(PODCAST_EPISODE.length - 1);
  };

  const progressPercent = (currentIdx / PODCAST_EPISODE.length) * 100;
  const sentenceDisplay = PODCAST_EPISODE[currentIdx]?.text || "";

  return (
    <View style={styles.root}>
      <HomeMeshBackground />
      
      <View style={[styles.header, { paddingTop: insets.top + 16, flexDirection: isKu ? "row-reverse" : "row" }]}>
        <PressableScale onPress={() => { stopPodcastSpeaking(); router.back(); }} style={styles.backBtn}>
          <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
            <ArrowLeft size={24} color="#0F1A30" />
          </View>
        </PressableScale>
        <AppText style={styles.headerTitle}>{isKu ? "پۆدکاستی ژیری دەستکرد" : "AI Podcast"}</AppText>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <HomeLiquidCard style={styles.artCard} contentStyle={styles.artCardInner}>
          <View style={styles.iconCircle}>
            <Mic2 size={64} color={C.blue} strokeWidth={1.5} />
          </View>
          {isPlaying && (
            <View style={styles.textBubble}>
              <AppText style={styles.bubbleText} forceLatinFont numberOfLines={3}>
                {sentenceDisplay}
              </AppText>
            </View>
          )}
        </HomeLiquidCard>

        <View style={styles.infoArea}>
          <AppText style={styles.podcastTitle}>English ↔ Arabic Bites</AppText>
          <AppText style={styles.podcastSub}>AI Generated Language Lessons</AppText>
        </View>

        <View style={styles.progressArea}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={[styles.timeRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
            <AppText style={styles.timeText}>{formatTime(currentIdx * 3.5)}</AppText>
            <AppText style={styles.timeText}>{formatTime(PODCAST_EPISODE.length * 3.5)}</AppText>
          </View>
        </View>

        <View style={[styles.controlsRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
          <PressableScale onPress={handleRewind} style={styles.controlBtn}>
            <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
              <Rewind size={32} color="#0F1A30" />
            </View>
          </PressableScale>
          
          <PressableScale onPress={togglePlay} style={[styles.playBtn, crossShadow({ color: C.blue, offsetY: 8, blur: 16, opacity: 0.3 })]}>
            {isPlaying ? (
              <Pause size={40} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={40} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 4 }} />
            )}
          </PressableScale>

          <PressableScale onPress={handleFastForward} style={styles.controlBtn}>
            <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
              <FastForward size={32} color="#0F1A30" />
            </View>
          </PressableScale>
        </View>
        
        <View style={[styles.volumeArea, { flexDirection: isKu ? "row-reverse" : "row" }]}>
           <Volume2 size={20} color="#9CA3AF" />
           <View style={styles.volumeBarBg}>
             <View style={[styles.volumeBarFill, { width: "70%" }]} />
           </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.meshBottom,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F1A30",
    fontFamily: "DINNextRoundedBold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  artCard: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 32,
    marginBottom: 40,
  },
  artCardInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 32,
    padding: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(43,89,243,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  textBubble: {
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(43,89,243,0.2)",
    maxWidth: "90%",
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F1A30",
    textAlign: "center",
  },
  infoArea: {
    alignItems: "center",
    marginBottom: 40,
  },
  podcastTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F1A30",
    fontFamily: "DINNextRoundedBold",
    marginBottom: 8,
    textAlign: "center",
  },
  podcastSub: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  progressArea: {
    width: "100%",
    marginBottom: 40,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
    marginBottom: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: C.blue,
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    marginBottom: 40,
  },
  controlBtn: {
    padding: 10,
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  volumeArea: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    gap: 12,
  },
  volumeBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2,
  },
  volumeBarFill: {
    height: "100%",
    backgroundColor: "#9CA3AF",
    borderRadius: 2,
  },
});
