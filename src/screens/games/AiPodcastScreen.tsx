import { AppText } from "@/components/ui/AppText";
import {
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette as C,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import { crossShadow } from "@/utils/shadows";
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
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "@/components/animations";

export function AiPodcastScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.root}>
      <HomeMeshBackground />
      
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <PressableScale onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#0F1A30" />
        </PressableScale>
        <AppText style={styles.headerTitle}>AI Podcast</AppText>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <HomeLiquidCard style={styles.artCard} contentStyle={styles.artCardInner}>
          <View style={styles.iconCircle}>
            <Mic2 size={64} color={C.blue} strokeWidth={1.5} />
          </View>
        </HomeLiquidCard>

        <View style={styles.infoArea}>
          <AppText style={styles.podcastTitle}>English ↔ Arabic Bites</AppText>
          <AppText style={styles.podcastSub}>AI Generated Language Lessons</AppText>
        </View>

        <View style={styles.progressArea}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: isPlaying ? "45%" : "0%" }]} />
          </View>
          <View style={styles.timeRow}>
            <AppText style={styles.timeText}>0:00</AppText>
            <AppText style={styles.timeText}>15:00</AppText>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <PressableScale style={styles.controlBtn}>
            <Rewind size={32} color="#0F1A30" />
          </PressableScale>
          
          <PressableScale onPress={togglePlay} style={[styles.playBtn, crossShadow({ color: C.blue, offsetY: 8, blur: 16, opacity: 0.3 })]}>
            {isPlaying ? (
              <Pause size={40} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={40} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 4 }} />
            )}
          </PressableScale>

          <PressableScale style={styles.controlBtn}>
            <FastForward size={32} color="#0F1A30" />
          </PressableScale>
        </View>
        
        <View style={styles.volumeArea}>
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
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(43,89,243,0.1)",
    alignItems: "center",
    justifyContent: "center",
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
