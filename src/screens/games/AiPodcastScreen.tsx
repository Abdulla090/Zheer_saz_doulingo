import { AppText } from "../../components/ui/AppText";
import { HomeLiquidCard } from "../../components/ui/ios-liquid-home";
import { PressableScale } from "../../components/animations";
import { useI18n } from "../../hooks/useI18n";
import { useSafeBack } from "../../hooks/use-safe-back";
import { crossShadow } from "../../utils/shadows";
import { canStartPodcastPlayback } from "../../utils/podcast-playback";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, VolumeHighIcon, VolumeMuteIcon } from "@hugeicons/core-free-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioSource,
} from "expo-audio";

type PodcastLevel = "basic" | "intermediate" | "advanced";
const PODCAST_BLUE = "#2563EB";

type PodcastEpisode = {
  id: string;
  title: string;
  titleKu: string;
  subtitle: string;
  subtitleKu: string;
  audioSource: AudioSource;
};

const PODCASTS_BY_LEVEL: Record<PodcastLevel, Omit<PodcastEpisode, "id">> = {
  basic: {
    title: "Basic Podcast",
    titleKu: "پۆدکاستی سەرەتایی",
    subtitle: "Jack & Cloie • English conversation",
    subtitleKu: "جاک و کلۆیی • گفتوگۆی ئینگلیزی",
    audioSource: require("../../../assets/aipodcast/basic/ai_radio_basic.mp3"),
  },
  intermediate: {
    title: "Intermediate Podcast",
    titleKu: "پۆدکاستی ناوەند",
    subtitle: "Jack & Cloie • English conversation",
    subtitleKu: "جاک و کلۆیی • گفتوگۆی ئینگلیزی",
    audioSource: require("../../../assets/aipodcast/intermidate/erbil.mp3"),
  },
  advanced: {
    title: "Advanced Podcast",
    titleKu: "پۆدکاستی پێشکەوتوو",
    subtitle: "Jack & Cloie • English conversation",
    subtitleKu: "جاک و کلۆیی • گفتوگۆی ئینگلیزی",
    audioSource: require("../../../assets/aipodcast/advance/sulaimany.mp3"),
  },
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export function AiPodcastScreen() {
  const insets = useSafeAreaInsets();
  const safeBack = useSafeBack("/(tabs)/play");
  const { locale, isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const isRtl = isKu || locale === "ar";

  const [selectedLevel, setSelectedLevel] = useState<PodcastLevel>("basic");
  const [error, setError] = useState<string | null>(null);

  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const [autoPlayEpisodeId, setAutoPlayEpisodeId] = useState<string | null>(null);

  // Volume & Speed States
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [preMuteVolume, setPreMuteVolume] = useState(0.7);
  const [volumeWidth, setVolumeWidth] = useState(150);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const audioPlayer = useAudioPlayer(activeEpisode?.audioSource ?? null, {
    updateInterval: 200,
    downloadFirst: Platform.OS !== "web",
    keepAudioSessionActive: true,
    preferredForwardBufferDuration: 10,
  });
  const audioStatus = useAudioPlayerStatus(audioPlayer);
  const isPlaying = audioStatus.playing;
  const audioCurrentTime = Number.isFinite(audioStatus.currentTime)
    ? Math.max(audioStatus.currentTime, 0)
    : 0;
  const audioDuration = Number.isFinite(audioStatus.duration)
    ? Math.max(audioStatus.duration, 0)
    : 0;

  const pulse = () => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleBack = useCallback(() => {
    safeBack();
  }, [safeBack]);

  // The hook owns and releases the native player. Wait for the packaged asset to
  // finish resolving before changing playback state on Android or iOS.
  useEffect(() => {
    if (!audioStatus.isLoaded) return;
    try {
      audioPlayer.volume = isMuted ? 0 : volume;
      audioPlayer.setPlaybackRate(playbackRate, "medium");
    } catch (err) {
      console.warn("Failed to configure podcast player:", err);
      setError(
        isKu
          ? "دەنگی پۆدکاستەکە ئامادە نەبوو. تکایە دووبارە هەوڵ بدەوە."
          : "The podcast player was not ready. Please try again.",
      );
    }
  }, [audioPlayer, audioStatus.isLoaded, isKu, isMuted, playbackRate, volume]);

  useEffect(() => {
    if (!canStartPodcastPlayback({
      activeEpisodeId: activeEpisode?.id ?? null,
      autoPlayEpisodeId,
      isLoaded: audioStatus.isLoaded,
      playbackError: audioStatus.error,
    })) {
      return;
    }

    let cancelled = false;
    const startPlayback = async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          interruptionMode: "doNotMix",
          shouldPlayInBackground: false,
          shouldRouteThroughEarpiece: false,
        });
        if (cancelled) return;
        audioPlayer.play();
        setAutoPlayEpisodeId(null);
      } catch (err) {
        if (cancelled) return;
        console.warn("Podcast playback failed to start:", err);
        setAutoPlayEpisodeId(null);
        setError(
          isKu
            ? "دەنگی پۆدکاستەکە نەکراوە. تکایە دووبارە هەوڵ بدەوە."
            : "The podcast audio could not start. Please try again.",
        );
      }
    };

    void startPlayback();
    return () => {
      cancelled = true;
    };
  }, [
    activeEpisode,
    audioPlayer,
    audioStatus.error,
    audioStatus.isLoaded,
    autoPlayEpisodeId,
    isKu,
  ]);

  useEffect(() => {
    if (!audioStatus.error) return;
    console.warn("Podcast audio playback error:", audioStatus.error);
    setAutoPlayEpisodeId(null);
    setError(
      isKu
        ? "دەنگی پۆدکاستەکە بارنەبوو. تکایە دووبارە هەوڵ بدەوە."
        : "The podcast audio could not load. Please try again.",
    );
  }, [audioStatus.error, isKu]);

  useEffect(() => {
    if (!audioStatus.didJustFinish) return;
    void audioPlayer.seekTo(0).catch((err) => {
      console.warn("Failed to reset finished podcast:", err);
    });
  }, [audioPlayer, audioStatus.didJustFinish]);

  const handleOpenPodcast = () => {
    pulse();
    try {
      audioPlayer.pause();
      audioPlayer.replace(null);
    } catch {
      // The player can still be resolving a previous source.
    }
    setError(null);
    const nextEpisode: PodcastEpisode = {
      ...PODCASTS_BY_LEVEL[selectedLevel],
      id: `${selectedLevel}-${Date.now()}`,
    };
    setActiveEpisode(nextEpisode);
    setAutoPlayEpisodeId(nextEpisode.id);
  };

  const togglePlay = () => {
    pulse();
    if (!activeEpisode) return;
    if (!audioStatus.isLoaded) {
      setError(isKu ? "دەنگەکە هێشتا بار دەبێت..." : "The audio is still loading...");
      return;
    }
    try {
      setError(null);
      if (isPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play();
      }
    } catch (err) {
      console.warn("Failed to toggle podcast playback:", err);
      setError(
        isKu
          ? "دەنگی پۆدکاستەکە نەکراوە. تکایە دووبارە هەوڵ بدەوە."
          : "The podcast audio could not start. Please try again.",
      );
    }
  };

  const handleRewind = () => {
    pulse();
    if (!activeEpisode || !audioStatus.isLoaded) return;
    const nextTime = Math.max(audioCurrentTime - 10, 0);
    void audioPlayer.seekTo(nextTime).catch((err) => {
      console.warn("Failed to rewind podcast:", err);
    });
  };

  const handleFastForward = () => {
    pulse();
    if (!activeEpisode || !audioStatus.isLoaded) return;
    const nextTime = Math.min(audioCurrentTime + 10, audioDuration);
    void audioPlayer.seekTo(nextTime).catch((err) => {
      console.warn("Failed to fast-forward podcast:", err);
    });
  };

  // Adjust volume via touch
  const changeVolume = (val: number) => {
    if (typeof val !== "number" || isNaN(val) || !isFinite(val)) return;
    const rounded = Math.round(val * 10) / 10;
    setVolume(rounded);
    if (rounded > 0) {
      setIsMuted(false);
    }
    if (audioStatus.isLoaded) {
      try {
        audioPlayer.volume = rounded;
      } catch (err) {
        console.warn("Failed to set audio volume:", err);
      }
    }
  };

  const handleVolumePress = (event: any) => {
    const x = event.nativeEvent.locationX;
    if (typeof x !== "number" || isNaN(x)) return;
    if (typeof volumeWidth !== "number" || isNaN(volumeWidth) || volumeWidth <= 0) return;

    const newVolume = Math.min(Math.max(x / volumeWidth, 0), 1);
    if (isFinite(newVolume)) {
      changeVolume(newVolume);
    }
  };

  const toggleMute = () => {
    pulse();
    if (isMuted) {
      setIsMuted(false);
      changeVolume(preMuteVolume);
    } else {
      setPreMuteVolume(volume);
      setIsMuted(true);
      if (audioStatus.isLoaded) {
        try {
          audioPlayer.volume = 0;
        } catch (err) {
          console.warn("Failed to mute audio player:", err);
        }
      }
    }
  };

  // Adjust playback speed
  const changeSpeed = (rate: number) => {
    pulse();
    setPlaybackRate(rate);
    if (audioStatus.isLoaded) {
      try {
        audioPlayer.setPlaybackRate(rate, "medium");
      } catch (err) {
        console.warn("Failed to set audio playback rate:", err);
      }
    }
  };

  const progressPercent = audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, flexDirection: "row" }]}>
        <PressableScale onPress={handleBack} style={styles.backBtn}>
          <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="#0F1A30" />
          </View>
        </PressableScale>
        <AppText style={styles.headerTitle} languageCode={isKu ? "ku" : "en"} align="center">
          {isKu ? "پۆدکاستەکان" : "Podcasts"}
        </AppText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) + 28 }]}
      >
        {/* Settings/Generator Card */}
        <HomeLiquidCard style={styles.generatorCard} contentStyle={styles.generatorInner}>
          <View style={[styles.generatorHeader, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
            <View style={styles.generatorIcon}>
                <HugeiconsIcon icon={VolumeHighIcon} size={20} color={PODCAST_BLUE} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1, alignItems: isRtl ? "flex-end" : "flex-start" }}>
              <AppText style={styles.generatorEyebrow}>
                {isKu ? "وانە دەنگییە ئامادەکراوەکان" : "Built-in audio lessons"}
              </AppText>
              <AppText style={styles.generatorTitle}>
                {isKu ? "ئاستێک هەڵبژێرە و گوێ بگرە" : "Choose a level and listen"}
              </AppText>
            </View>
          </View>

          {/* Level Selector */}
          <AppText style={[styles.sectionLabel, isRtl && styles.rtlText]}>
            {isKu ? "ئاستی پۆدکاستەکە" : "Select Level"}
          </AppText>
          <View style={[styles.levelSelector, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
            {(["basic", "intermediate", "advanced"] as const).map((lvl) => {
              const active = selectedLevel === lvl;
              let label = lvl.charAt(0).toUpperCase() + lvl.slice(1);
              if (isKu) {
                if (lvl === "basic") label = "سەرەتایی";
                else if (lvl === "intermediate") label = "ناوەند";
                else label = "پێشکەوتوو";
              }
              return (
                <PressableScale
                  key={lvl}
                  onPress={() => {
                    pulse();
                    setSelectedLevel(lvl);
                  }}
                  style={[styles.levelBtn, active && styles.levelBtnActive]}
                >
                  <AppText style={[styles.levelBtnText, active && styles.levelBtnTextActive]}>
                    {label}
                  </AppText>
                </PressableScale>
              );
            })}
          </View>

          <PressableScale onPress={handleOpenPodcast} style={styles.generateBtn}>
            <AppText style={styles.generateText}>
              {isKu ? "پۆدکاست لێبدە" : "Play podcast"}
            </AppText>
          </PressableScale>

          {error && (
            <AppText style={[styles.errorText, isRtl && styles.rtlText]}>{error}</AppText>
          )}
        </HomeLiquidCard>

        {/* Audio Player Card */}
        {activeEpisode && (
          <HomeLiquidCard style={styles.generatorCard} contentStyle={styles.generatorInner}>
            <View style={styles.infoArea}>
              <AppText
                style={styles.podcastTitle}
                nativeAlign={isRtl ? "start" : undefined}
                fullWidth={isRtl}
              >
                {isKu ? activeEpisode.titleKu : activeEpisode.title}
              </AppText>
              <AppText
                style={styles.podcastSub}
                nativeAlign={isRtl ? "start" : undefined}
                fullWidth={isRtl}
              >
                {isKu ? activeEpisode.subtitleKu : activeEpisode.subtitle}
              </AppText>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressArea}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(progressPercent, 100)}%` }]} />
              </View>
              <View style={[styles.timeRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
                <AppText style={styles.timeText}>{formatTime(audioCurrentTime)}</AppText>
                <AppText style={styles.timeText}>{formatTime(audioDuration)}</AppText>
              </View>
            </View>

            {/* Playback Speed Controller */}
            <View style={styles.speedControlArea}>
              <AppText style={styles.speedLabel}>
                {isKu ? "خێرایی لێدان:" : "Playback Speed:"}
              </AppText>
              <View style={styles.speedPillsRow}>
                {([0.8, 1.0, 1.2, 1.5] as const).map((rate) => {
                  const active = playbackRate === rate;
                  return (
                    <PressableScale
                      key={rate}
                      onPress={() => changeSpeed(rate)}
                      style={[styles.speedPill, active && styles.speedPillActive]}
                    >
                      <AppText style={[styles.speedPillText, active && styles.speedPillTextActive]}>
                        {rate}x
                      </AppText>
                    </PressableScale>
                  );
                })}
              </View>
            </View>

            {/* Controls */}
            <View style={[styles.controlsRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
              <PressableScale onPress={handleRewind} style={styles.controlBtn}>
                <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
                  <HugeiconsIcon icon={BackwardIcon} size={30} color="#0F1A30" />
                </View>
              </PressableScale>

              <PressableScale
                onPress={togglePlay}
                style={styles.playBtn}
              >
                {isPlaying ? (
                  <HugeiconsIcon icon={PauseIcon} size={38} color="#FFFFFF" />
                ) : (
                  <HugeiconsIcon icon={PlayIcon} size={38} color="#FFFFFF" style={{ marginLeft: 4 }} />
                )}
              </PressableScale>

              <PressableScale onPress={handleFastForward} style={styles.controlBtn}>
                <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
                  <HugeiconsIcon icon={ForwardIcon} size={30} color="#0F1A30" />
                </View>
              </PressableScale>
            </View>

            {/* Interactive Volume Control */}
            <View style={[styles.volumeArea, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
              <Pressable onPress={toggleMute} style={styles.muteBtn}>
                <HugeiconsIcon
                  icon={isMuted || volume === 0 ? VolumeMuteIcon : VolumeHighIcon}
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
              <Pressable
                onPress={handleVolumePress}
                onLayout={(e) => setVolumeWidth(e.nativeEvent.layout.width)}
                style={styles.volumeBarTouchArea}
              >
                <View style={styles.volumeBarBg}>
                  <View
                    style={[
                      styles.volumeBarFill,
                      { width: `${(isMuted ? 0 : volume) * 100}%` },
                    ]}
                  />
                </View>
              </Pressable>
            </View>
          </HomeLiquidCard>
        )}
      </ScrollView>
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? colors.surfaceRaised : "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  content: {
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },
  generatorCard: {
    width: "100%",
    marginBottom: 18,
  },
  generatorInner: {
    padding: 18,
    gap: 16,
  },
  generatorHeader: {
    alignItems: "center",
    gap: 10,
  },
  generatorIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  generatorTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  generatorEyebrow: {
    fontSize: 11,
    color: PODCAST_BLUE,
    fontWeight: "800",
    letterSpacing: 0.2,
    marginBottom: 2,
    fontFamily: "DINNextRoundedBold",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
    marginTop: 2,
  },
  levelSelector: {
    flexDirection: "row",
    backgroundColor: colors.muted,
    padding: 4,
    borderRadius: 16,
    gap: 4,
    marginBottom: 8,
  },
  levelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  levelBtnActive: {
    backgroundColor: colors.surfaceRaised,
    ...crossShadow({ color: "rgba(0,0,0,0.06)", offsetY: 3, blur: 8, opacity: 1 }),
  },
  levelBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.mutedForeground,
    fontFamily: "DINNextRoundedBold",
  },
  levelBtnTextActive: {
    color: PODCAST_BLUE,
  },
  topicInput: {
    minHeight: 82,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.foreground,
    fontFamily: "DINNextRoundedRegular",
    lineHeight: 21,
  },
  topicInputRtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  starterRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 8,
  },
  starterChip: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
  },
  starterText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  generateBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: PODCAST_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  generateText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  progressContainer: {
    gap: 10,
    paddingVertical: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: "700",
  },
  progressPercent: {
    fontSize: 14,
    color: PODCAST_BLUE,
    fontWeight: "800",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  infoArea: {
    alignItems: "center",
    marginVertical: 12,
  },
  podcastTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
    marginBottom: 6,
    textAlign: "center",
  },
  podcastSub: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "DINNextRoundedRegular",
  },
  progressArea: {
    width: "100%",
    marginTop: 10,
    marginBottom: 16,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
    borderRadius: 3,
    marginBottom: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: PODCAST_BLUE,
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: "600",
  },
  speedControlArea: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  speedLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.mutedForeground,
    fontFamily: "DINNextRoundedBold",
  },
  speedPillsRow: {
    flexDirection: "row",
    gap: 6,
  },
  speedPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  speedPillActive: {
    backgroundColor: PODCAST_BLUE,
    borderColor: PODCAST_BLUE,
  },
  speedPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.mutedForeground,
    fontFamily: "DINNextRoundedBold",
  },
  speedPillTextActive: {
    color: "#FFFFFF",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 34,
    marginBottom: 16,
  },
  controlBtn: {
    padding: 10,
  },
  playBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: PODCAST_BLUE,
    alignItems: "center",
    justifyContent: "center",
    ...crossShadow({ color: PODCAST_BLUE, offsetY: 6, blur: 14, opacity: 0.22 }),
  },
  volumeArea: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    gap: 10,
    marginTop: 8,
  },
  muteBtn: {
    padding: 6,
  },
  volumeBarTouchArea: {
    flex: 1,
    paddingVertical: 10,
  },
  volumeBarBg: {
    height: 4,
    backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
    borderRadius: 2,
  },
  volumeBarFill: {
    height: "100%",
    backgroundColor: "#9CA3AF",
    borderRadius: 2,
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  });
}
