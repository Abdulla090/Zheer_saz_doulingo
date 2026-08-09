import { AppText } from "../../components/ui/AppText";
import { PressableScale } from "../../components/animations";
import { useI18n } from "../../hooks/useI18n";
import { useSafeBack } from "../../hooks/use-safe-back";
import { crossShadow } from "../../utils/shadows";
import { canStartPodcastPlayback } from "../../utils/podcast-playback";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
  VolumeHighIcon,
  VolumeMuteIcon,
  HeadphonesIcon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { FadeInDown } from "react-native-reanimated";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioSource,
} from "expo-audio";

import {
  GamesCard,
  GamesGlassHeader,
  GamesIntroCard,
  GamesPrimaryButton,
  GamesProgressBar,
  GamesScreenShell,
  GamesSectionLabel,
  GamesSegmented,
  GamesStateBlock,
  useGamesChrome,
} from "./components/games-chrome";
import { GamesMotion, GamesType } from "./games-theme";

type PodcastLevel = "basic" | "intermediate" | "advanced";

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
  const safeBack = useSafeBack("/(tabs)/play");
  const { isKu } = useI18n();
  const { theme, isRtl } = useGamesChrome("podcast");

  const [selectedLevel, setSelectedLevel] = useState<PodcastLevel>("basic");
  const [error, setError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

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

  const progress = audioDuration > 0 ? audioCurrentTime / audioDuration : 0;
  const contentLang = isKu ? "ku" : "en";

  const levelOptions = (["basic", "intermediate", "advanced"] as const).map((lvl) => {
    let label = lvl.charAt(0).toUpperCase() + lvl.slice(1);
    if (isKu) {
      if (lvl === "basic") label = "سەرەتایی";
      else if (lvl === "intermediate") label = "ناوەند";
      else label = "پێشکەوتوو";
    }
    return { value: lvl, label };
  });

  return (
    <GamesScreenShell
      onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 4)}
      header={
        <GamesGlassHeader
          title={isKu ? "پۆدکاستەکان" : "Podcasts"}
          titleLanguageCode={contentLang}
          onBack={handleBack}
          scrolled={scrolled}
        />
      }
    >
      <GamesIntroCard
        mode="podcast"
        icon={HeadphonesIcon}
        languageCode={contentLang}
        eyebrow={isKu ? "وانە دەنگییە ئامادەکراوەکان" : "Built-in audio lessons"}
        title={isKu ? "ئاستێک هەڵبژێرە و گوێ بگرە" : "Choose a level and listen"}
      >
        <View style={{ gap: 10, marginTop: 16 }}>
          <GamesSectionLabel languageCode={contentLang}>
            {isKu ? "ئاستی پۆدکاستەکە" : "Select level"}
          </GamesSectionLabel>
          <GamesSegmented
            options={levelOptions}
            value={selectedLevel}
            languageCode={contentLang}
            onChange={(lvl) => {
              pulse();
              setSelectedLevel(lvl);
            }}
          />
        </View>

        <GamesPrimaryButton
          label={isKu ? "پۆدکاست لێبدە" : "Play podcast"}
          languageCode={contentLang}
          icon={PlayIcon}
          onPress={handleOpenPodcast}
          style={{ marginTop: 16 }}
        />
      </GamesIntroCard>

      {error ? (
        <GamesCard>
          <GamesStateBlock
            icon={Alert02Icon}
            tone="danger"
            languageCode={contentLang}
            title={isKu ? "کێشەیەک ڕوویدا" : "Something went wrong"}
            body={error}
          />
        </GamesCard>
      ) : null}

      {activeEpisode && (
        <GamesCard entering={FadeInDown.duration(GamesMotion.enterMs)}>
          <View style={{ alignItems: "center", gap: 4, marginBottom: 18 }}>
            <AppText
              languageCode={contentLang}
              style={[GamesType.title, { color: theme.ink, textAlign: "center" }]}
            >
              {isKu ? activeEpisode.titleKu : activeEpisode.title}
            </AppText>
            <AppText
              languageCode={contentLang}
              style={[GamesType.caption, { color: theme.mutedInk, textAlign: "center" }]}
            >
              {isKu ? activeEpisode.subtitleKu : activeEpisode.subtitle}
            </AppText>
          </View>

          {/* Progress */}
          <GamesProgressBar value={progress} />
          <View
            style={{
              flexDirection: isRtl ? "row-reverse" : "row",
              justifyContent: "space-between",
              marginTop: 8,
              marginBottom: 18,
            }}
          >
            <AppText style={[GamesType.caption, { fontSize: 12, color: theme.mutedInk }]}>
              {formatTime(audioCurrentTime)}
            </AppText>
            <AppText style={[GamesType.caption, { fontSize: 12, color: theme.mutedInk }]}>
              {formatTime(audioDuration)}
            </AppText>
          </View>

          {/* Transport — the play button is the one accent-filled control here,
              so the primary action stays unambiguous at every point in the flow. */}
          <View
            style={{
              flexDirection: isRtl ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 30,
              marginBottom: 20,
            }}
          >
            <PressableScale onPress={handleRewind} style={styles.transportBtn}>
              <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
                <HugeiconsIcon icon={BackwardIcon} size={28} color={theme.ink} strokeWidth={2} />
              </View>
            </PressableScale>

            <PressableScale
              onPress={togglePlay}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? "Pause" : "Play"}
              style={[
                styles.playBtn,
                { backgroundColor: theme.accent },
                crossShadow({
                  color: theme.accent,
                  offsetY: 6,
                  blur: 16,
                  opacity: theme.isDark ? 0.34 : 0.26,
                  elevation: 6,
                }),
              ]}
            >
              {isPlaying ? (
                <HugeiconsIcon icon={PauseIcon} size={34} color={theme.onAccent} />
              ) : (
                <HugeiconsIcon
                  icon={PlayIcon}
                  size={34}
                  color={theme.onAccent}
                  style={{ marginLeft: 3 }}
                />
              )}
            </PressableScale>

            <PressableScale onPress={handleFastForward} style={styles.transportBtn}>
              <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
                <HugeiconsIcon icon={ForwardIcon} size={28} color={theme.ink} strokeWidth={2} />
              </View>
            </PressableScale>
          </View>

          {/* Speed — a segmented control, same as the level picker above it. */}
          <View style={{ gap: 10, marginBottom: 16 }}>
            <GamesSectionLabel languageCode={contentLang}>
              {isKu ? "خێرایی لێدان" : "Playback speed"}
            </GamesSectionLabel>
            <GamesSegmented
              options={[
                { value: "0.8", label: "0.8x" },
                { value: "1", label: "1x" },
                { value: "1.2", label: "1.2x" },
                { value: "1.5", label: "1.5x" },
              ]}
              value={String(playbackRate)}
              onChange={(v) => changeSpeed(Number(v))}
            />
          </View>

          {/* Volume — neutral, because it is an adjustment, not a commit. */}
          <View
            style={{
              flexDirection: isRtl ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Pressable
              onPress={toggleMute}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={isMuted ? "Unmute" : "Mute"}
            >
              <HugeiconsIcon
                icon={isMuted || volume === 0 ? VolumeMuteIcon : VolumeHighIcon}
                size={20}
                color={theme.mutedInk}
                strokeWidth={2}
              />
            </Pressable>
            <Pressable
              onPress={handleVolumePress}
              onLayout={(e) => setVolumeWidth(e.nativeEvent.layout.width)}
              style={{ flex: 1, paddingVertical: 10 }}
            >
              <View
                style={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: theme.track,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${(isMuted ? 0 : volume) * 100}%`,
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: theme.mutedInk,
                  }}
                />
              </View>
            </Pressable>
          </View>
        </GamesCard>
      )}
    </GamesScreenShell>
  );
}

const styles = StyleSheet.create({
  transportBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
