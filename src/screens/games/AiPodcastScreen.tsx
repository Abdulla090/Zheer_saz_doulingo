import { AppText } from "../../components/ui/AppText";
import {
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette as C,
} from "../../components/ui/ios-liquid-home";
import { PressableScale } from "../../components/animations";
import { useTTS } from "../../hooks/use-tts";
import { useI18n } from "../../hooks/useI18n";
import { crossShadow } from "../../utils/shadows";
import {
  generateAiPodcastEpisode,
  isGeminiConfigured,
  type AiPodcastEpisode,
  type AiPodcastTemplateId,
} from "../../services/gemini-speech-service";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { ArrowLeft01Icon, Mic01Icon, PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, VolumeHighIcon } from "@hugeicons/core-free-icons/dist/cjs/index.js";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PodcastTemplate = {
  id: AiPodcastTemplateId;
  title: string;
  titleKu: string;
  subtitle: string;
};

type TopicStarter = {
  label: string;
  labelKu: string;
  topic: string;
};

const PODCAST_TEMPLATES: PodcastTemplate[] = [
  {
    id: "daily_lesson",
    title: "Daily lesson",
    titleKu: "وانەی ڕۆژانە",
    subtitle: "Words, examples, recap",
  },
  {
    id: "story_mode",
    title: "Mini story",
    titleKu: "چیرۆکی کورت",
    subtitle: "Learn through a scene",
  },
  {
    id: "conversation",
    title: "Two hosts",
    titleKu: "دوو پێشکەشکار",
    subtitle: "Podcast-style dialogue",
  },
  {
    id: "exam_coach",
    title: "Exam coach",
    titleKu: "ڕاهێنەری تاقیکردنەوە",
    subtitle: "IELTS/TOEFL phrases",
  },
  {
    id: "quick_explainer",
    title: "Quick explainer",
    titleKu: "ڕوونکردنەوەی خێرا",
    subtitle: "Simple idea, examples, challenge",
  },
  {
    id: "pronunciation_drill",
    title: "Pronunciation",
    titleKu: "دەربڕین",
    subtitle: "Repeatable phrases and rhythm",
  },
];

const INITIAL_TOPIC = "Ordering coffee at a cafe";

const TOPIC_STARTERS: TopicStarter[] = [
  {
    label: "Job interview",
    labelKu: "چاوپێکەوتنی کار",
    topic: "Answering job interview questions with confident English",
  },
  {
    label: "Travel",
    labelKu: "گەشت",
    topic: "Asking for directions and help while traveling",
  },
  {
    label: "Daily life",
    labelKu: "ژیانی ڕۆژانە",
    topic: "Talking about daily routines in natural English",
  },
  {
    label: "Exam answer",
    labelKu: "وەڵامی تاقیکردنەوە",
    topic: "Building a strong IELTS speaking answer",
  },
];

const PREBUILT_PODCASTS: AiPodcastEpisode[] = [
  {
    title: "Cafe Coffee Talk (Qawa)",
    subtitle: "Darya & Zanyar • Ordering coffee with Kurdish style",
    segments: [
      { text: "Slaw guys! Welcome to our quick cafe conversation podcast.", lang: "en" },
      { text: "Slaw Darya! Today we order coffee. Zor basha, let's learn some useful phrases.", lang: "en" },
      { text: "First, when you walk in, you say: Can I get a black coffee, please?", lang: "en" },
      { text: "Yes, please is very important. Spas is always polite!", lang: "en" },
      { text: "And if you want milk, you say: With a splash of milk, please.", lang: "en" },
      { text: "Splash means a small amount. A bit of milk. Chunkek.", lang: "en" },
      { text: "Exactly! And the barista might ask: For here or to go?", lang: "en" },
      { text: "To go means you drink it outside. Bo darawa.", lang: "en" },
      { text: "Yes. So you reply: To go, please. Spas!", lang: "en" },
      { text: "Basha, let's repeat together: Can I get a black coffee to go?", lang: "en" },
      { text: "Perfect. Now you try saying it out loud in your room.", lang: "en" },
      { text: "Zor supas for listening to our coffee explainer today.", lang: "en" },
      { text: "Keep practicing, and see you in the next episode. Bye bye!", lang: "en" },
    ],
  },
  {
    title: "Job Interview Prep (Kar)",
    subtitle: "Hero & Karwan • Answering with confidence",
    segments: [
      { text: "Slaw, learning friends! Welcome back to our weekly English coach.", lang: "en" },
      { text: "Slaw Hero! Today we discuss job interviews. Shwene kar.", lang: "en" },
      { text: "Yes, interviews can make you feel a bit stressed, or dalkhar.", lang: "en" },
      { text: "But don't worry, we have some great English tips for you.", lang: "en" },
      { text: "First, when they ask: Tell me about yourself, keep it simple.", lang: "en" },
      { text: "Start with your experience. For example: I have worked in tech for two years.", lang: "en" },
      { text: "Good. And then state your main strength, or tawanayi sereketa.", lang: "en" },
      { text: "You can say: I am highly organized and love solving difficult problems.", lang: "en" },
      { text: "Nice phrase! Highly organized means you plan everything basha.", lang: "en" },
      { text: "Exactly, no mess! Then they might ask about your future plans.", lang: "en" },
      { text: "You should say: I want to grow my skills and help the team succeed.", lang: "en" },
      { text: "Succeed is serkawtin. We all want to succeed, spas!", lang: "en" },
      { text: "Let's review: I want to grow my skills in this company.", lang: "en" },
      { text: "Say it slowly with confidence. You can do it!", lang: "en" },
      { text: "Yes, practice makes perfect. Zor basha!", lang: "en" },
      { text: "Thank you for joining our interview preparation session today.", lang: "en" },
      { text: "Goodbye for now, and see you soon!", lang: "en" },
    ],
  },
  {
    title: "Bazaar & Bargaining (Arzan)",
    subtitle: "Lana & Aram • Asking for discounts in English",
    segments: [
      { text: "Slaw Aram! Welcome to our bazaar and shopping special episode.", lang: "en" },
      { text: "Slaw Lana! I love the bazaar, but we need good English to bargain, right?", lang: "en" },
      { text: "Exactly! Bargaining is asking for a lower price. Arzan kirdin.", lang: "en" },
      { text: "So, if the shopkeeper says: This rug is fifty dollars.", lang: "en" },
      { text: "You don't just pay! You say: Can you give me a discount?", lang: "en" },
      { text: "Discount means dakhandin. A lower price.", lang: "en" },
      { text: "Yes. Or you can say: Is that your best price?", lang: "en" },
      { text: "That is a very polite way to bargain. Zor jwana.", lang: "en" },
      { text: "If they say: Forty-five is my best price, you can try one more time.", lang: "en" },
      { text: "Say: How about forty dollars? And I will buy it now.", lang: "en" },
      { text: "Yes, How about... is a great bargaining pattern.", lang: "en" },
      { text: "Basha, let's practice: Can you give me a discount on this?", lang: "en" },
      { text: "Perfect! Now repeat it in a strong, friendly voice.", lang: "en" },
      { text: "And remember, always smile. Teakaya, be friendly!", lang: "en" },
      { text: "Yes, a smile gets you a better discount, spas!", lang: "en" },
      { text: "Thank you for listening to our bazaar guide today.", lang: "en" },
      { text: "Keep practicing, and happy shopping in English!", lang: "en" },
    ],
  },
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export function AiPodcastScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, isKu } = useI18n();
  const isRtl = isKu || locale === "ar";
  const { speak, stop } = useTTS();

  const [topic, setTopic] = useState(INITIAL_TOPIC);
  const [templateId, setTemplateId] = useState<AiPodcastTemplateId>("daily_lesson");
  const [episode, setEpisode] = useState<AiPodcastEpisode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentIdxRef = useRef(0);
  const isPlayingRef = useRef(false);
  const episodeRef = useRef<AiPodcastEpisode | null>(null);
  const generationIdRef = useRef(0);

  const segments = episode?.segments ?? [];
  const hasEpisode = segments.length > 0;

  useEffect(() => {
    currentIdxRef.current = currentIdx;
    isPlayingRef.current = isPlaying;
    episodeRef.current = episode;
  }, [currentIdx, episode, isPlaying]);

  useEffect(() => {
    if (!isPlaying || !episodeRef.current) {
      void stop();
      return;
    }

    const activeEpisode = episodeRef.current;
    const segment = activeEpisode.segments[currentIdx];
    if (!segment) {
      setIsPlaying(false);
      setCurrentIdx(0);
      return;
    }

    void speak(segment.text, segment.lang, `podcast-${currentIdx}`, {
      rate: 0.92,
      onDone: () => {
        if (!isPlayingRef.current) return;
        const nextIdx = currentIdxRef.current + 1;
        if (nextIdx < activeEpisode.segments.length) {
          setCurrentIdx(nextIdx);
        } else {
          setIsPlaying(false);
          setCurrentIdx(0);
        }
      },
    });

    return () => {
      void stop();
    };
  }, [currentIdx, isPlaying, speak, stop]);

  const pulse = () => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGenerate = async () => {
    const cleanTopic = topic.trim();
    pulse();
    if (!cleanTopic) {
      setError(isKu ? "بابەتێک بنووسە." : "Write a topic first.");
      return;
    }
    if (!isGeminiConfigured()) {
      setError(isKu ? "کلیلی Gemini دانەنراوە." : "Gemini is not configured.");
      return;
    }

    const generationId = generationIdRef.current + 1;
    generationIdRef.current = generationId;
    setIsGenerating(true);
    setError(null);
    setIsPlaying(false);
    setCurrentIdx(0);
    void stop();

    try {
      const nextEpisode = await generateAiPodcastEpisode({
        topic: cleanTopic,
        templateId,
      });
      if (generationIdRef.current !== generationId) return;
      setEpisode(nextEpisode);
    } catch (err) {
      if (generationIdRef.current !== generationId) return;
      const message = err instanceof Error ? err.message : "Could not generate podcast.";
      setError(message);
    } finally {
      if (generationIdRef.current === generationId) {
        setIsGenerating(false);
      }
    }
  };

  const togglePlay = () => {
    pulse();
    if (!hasEpisode || isGenerating) return;
    setIsPlaying((value) => !value);
  };

  const handleRewind = () => {
    pulse();
    void stop();
    setCurrentIdx(0);
    if (hasEpisode) setIsPlaying(false);
  };

  const handleFastForward = () => {
    pulse();
    void stop();
    if (segments.length > 0) {
      setCurrentIdx(segments.length - 1);
      setIsPlaying(false);
    }
  };

  const progressPercent =
    segments.length > 0 ? ((currentIdx + (isPlaying ? 1 : 0)) / segments.length) * 100 : 0;
  const sentenceDisplay = segments[currentIdx]?.text || "";
  const selectedTemplate = PODCAST_TEMPLATES.find((item) => item.id === templateId);

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <View style={[styles.header, { paddingTop: insets.top + 16, flexDirection: "row" }]}>
        <PressableScale onPress={() => { void stop(); router.back(); }} style={styles.backBtn}>
          <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="#0F1A30" />
          </View>
        </PressableScale>
        <AppText style={styles.headerTitle}>{isKu ? "پۆدکاستی ژیری دەستکرد" : "AI Podcast"}</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) + 28 }]}
        keyboardShouldPersistTaps="handled"
      >
        <HomeLiquidCard style={styles.generatorCard} contentStyle={styles.generatorInner}>
          <View style={[styles.generatorHeader, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
            <View style={styles.generatorIcon}>
              <HugeiconsIcon icon={Mic01Icon} size={20} color={C.blue} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1, alignItems: isRtl ? "flex-end" : "flex-start" }}>
              <AppText style={styles.generatorEyebrow}>
                {isKu ? "پۆدکاستی دروستکراو" : "Write your own topic"}
              </AppText>
              <AppText style={styles.generatorTitle}>{isKu ? "AI با باسی چی بکات؟" : "What should the AI talk about?"}</AppText>
              <AppText style={styles.generatorSub}>{isKu ? "بابەت بنووسە، یان نموونەیەک هەڵبژێرە" : "Type anything, or tap a starter below"}</AppText>
            </View>
          </View>

          <TextInput
            value={topic}
            onChangeText={setTopic}
            placeholder={isKu ? "نموونە: گەشتکردن، قاوە، کار..." : "Example: travel, coffee, job interview..."}
            placeholderTextColor="#94A3B8"
            style={[styles.topicInput, isRtl && styles.topicInputRtl]}
            multiline
            textAlignVertical="top"
          />

          <View style={[styles.starterRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
            {TOPIC_STARTERS.map((starter) => (
              <PressableScale
                key={starter.label}
                onPress={() => {
                  pulse();
                  setTopic(starter.topic);
                  setError(null);
                }}
                style={styles.starterChip}
                scaleDown={0.98}
              >
                <AppText style={styles.starterText}>
                  {isKu ? starter.labelKu : starter.label}
                </AppText>
              </PressableScale>
            ))}
          </View>

          <AppText style={[styles.sectionLabel, isRtl && styles.rtlText]}>
            {isKu ? "شێوازی قسەکردنی AI" : "Podcast template"}
          </AppText>

          <View style={styles.templateGrid}>
            {PODCAST_TEMPLATES.map((template) => {
              const selected = template.id === templateId;
              return (
                <PressableScale
                  key={template.id}
                  onPress={() => {
                    pulse();
                    setTemplateId(template.id);
                  }}
                  style={[
                    styles.templateChip,
                    selected && styles.templateChipActive,
                  ]}
                  scaleDown={0.98}
                >
                  <AppText style={[styles.templateTitle, selected && styles.templateTitleActive]}>
                    {isKu ? template.titleKu : template.title}
                  </AppText>
                  <AppText style={styles.templateSub}>{template.subtitle}</AppText>
                </PressableScale>
              );
            })}
          </View>

          <PressableScale
            onPress={handleGenerate}
            disabled={isGenerating}
            style={[
              styles.generateBtn,
              isGenerating && { opacity: 0.72 },
              crossShadow({ color: C.blue, offsetY: 8, blur: 16, opacity: 0.22 }),
            ]}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <AppText style={styles.generateText}>
                {isKu ? "پۆدکاست دروست بکە" : "Generate podcast"}
              </AppText>
            )}
          </PressableScale>
          {error ? (
            <AppText style={[styles.errorText, isRtl && styles.rtlText]}>{error}</AppText>
          ) : isGenerating ? (
            <AppText style={[styles.statusText, isRtl && styles.rtlText]}>
              {isKu ? "AI پۆدکاستەکە لەسەر بابەتەکەت دەنووسێت..." : "AI is writing the podcast from your topic..."}
            </AppText>
          ) : null}
        </HomeLiquidCard>

        <HomeLiquidCard style={styles.generatorCard} contentStyle={styles.generatorInner}>
          <View style={[styles.generatorHeader, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
            <View style={styles.generatorIcon}>
              <HugeiconsIcon icon={VolumeHighIcon} size={20} color={C.blue} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1, alignItems: isRtl ? "flex-end" : "flex-start" }}>
              <AppText style={styles.generatorEyebrow}>
                {isKu ? "پۆدکاستی ئامادەکراو" : "Instant templates"}
              </AppText>
              <AppText style={styles.generatorTitle}>
                {isKu ? "لێدانی یەکسەری پۆدکاست" : "Ready-to-Play Podcasts"}
              </AppText>
              <AppText style={styles.generatorSub}>
                {isKu ? "لێدانی یەکسەر بەبێ چاوەڕوانی دروستکردن" : "Play immediately without waiting"}
              </AppText>
            </View>
          </View>

          <View style={{ gap: 10 }}>
            {PREBUILT_PODCASTS.map((pb) => {
              const isActive = episode?.title === pb.title;
              return (
                <PressableScale
                  key={pb.title}
                  onPress={() => {
                    pulse();
                    setEpisode(pb);
                    setCurrentIdx(0);
                    setIsPlaying(false);
                    void stop();
                  }}
                  style={[
                    styles.starterChip,
                    isActive && {
                      borderColor: "rgba(59, 130, 246, 0.42)",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                    },
                    {
                      width: "100%",
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 18,
                      alignItems: "stretch",
                    }
                  ]}
                  scaleDown={0.98}
                >
                  <View style={{ flexDirection: isRtl ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1, alignItems: isRtl ? "flex-end" : "flex-start" }}>
                      <AppText style={[styles.starterText, { fontSize: 14, color: isActive ? C.blue : "#0F1A30" }]}>
                        {pb.title}
                      </AppText>
                      <AppText style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                        {pb.subtitle}
                      </AppText>
                    </View>
                    <HugeiconsIcon icon={PlayIcon} size={18} color={isActive ? C.blue : "#64748B"} />
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </HomeLiquidCard>

        <HomeLiquidCard style={styles.artCard} contentStyle={styles.artCardInner}>
          <View style={styles.iconCircle}>
            <HugeiconsIcon icon={Mic01Icon} size={58} color={C.blue} strokeWidth={1.5} />
          </View>
          <View style={styles.textBubble}>
            <AppText style={styles.bubbleText} forceLatinFont numberOfLines={4}>
              {sentenceDisplay || (isKu ? "سەرەتا پۆدکاستێک دروست بکە." : "Generate a podcast first.")}
            </AppText>
          </View>
        </HomeLiquidCard>

        <View style={styles.infoArea}>
          <AppText style={styles.podcastTitle}>
            {episode?.title || (isKu ? "پۆدکاستی تایبەت بە تۆ" : "Your custom podcast")}
          </AppText>
          <AppText style={styles.podcastSub}>
            {episode?.subtitle || selectedTemplate?.subtitle || "AI generated language lessons"}
          </AppText>
        </View>

        <View style={styles.progressArea}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(progressPercent, 100)}%` }]} />
          </View>
          <View style={[styles.timeRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
            <AppText style={styles.timeText}>{formatTime(currentIdx * 4)}</AppText>
            <AppText style={styles.timeText}>{formatTime(Math.max(segments.length, 1) * 4)}</AppText>
          </View>
        </View>

        <View style={[styles.controlsRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
          <PressableScale onPress={handleRewind} style={styles.controlBtn}>
            <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
              <HugeiconsIcon icon={BackwardIcon} size={30} color="#0F1A30" />
            </View>
          </PressableScale>

          <PressableScale
            onPress={togglePlay}
            disabled={!hasEpisode || isGenerating}
            style={[
              styles.playBtn,
              (!hasEpisode || isGenerating) && styles.playBtnDisabled,
              crossShadow({ color: C.blue, offsetY: 8, blur: 16, opacity: 0.3 }),
            ]}
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

        <View style={[styles.volumeArea, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
          <HugeiconsIcon icon={VolumeHighIcon} size={20} color="#9CA3AF" />
          <View style={styles.volumeBarBg}>
            <View style={[styles.volumeBarFill, { width: hasEpisode ? "70%" : "0%" }]} />
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 14,
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
    paddingHorizontal: 20,
    alignItems: "center",
  },
  generatorCard: {
    width: "100%",
    marginBottom: 18,
  },
  generatorInner: {
    padding: 18,
    gap: 14,
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
    color: "#0F1A30",
    fontFamily: "DINNextRoundedBold",
  },
  generatorEyebrow: {
    fontSize: 11,
    color: C.blue,
    fontWeight: "800",
    letterSpacing: 0.2,
    marginBottom: 2,
    fontFamily: "DINNextRoundedBold",
  },
  generatorSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  topicInput: {
    minHeight: 82,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.1)",
    backgroundColor: "rgba(255,255,255,0.86)",
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#0F1A30",
    fontFamily: "DINNextRoundedRegular",
    lineHeight: 21,
  },
  topicInputRtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  starterRow: {
    flexWrap: "wrap",
    gap: 8,
  },
  starterChip: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
  },
  starterText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
    fontFamily: "DINNextRoundedBold",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
    fontFamily: "DINNextRoundedBold",
    marginTop: 2,
  },
  templateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  templateChip: {
    flexGrow: 1,
    flexBasis: "46%",
    minHeight: 74,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  templateChipActive: {
    borderColor: "rgba(59, 130, 246, 0.42)",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  templateTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F1A30",
    fontFamily: "DINNextRoundedBold",
    marginBottom: 4,
  },
  templateTitleActive: {
    color: C.blue,
  },
  templateSub: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 15,
  },
  generateBtn: {
    height: 52,
    borderRadius: 20,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  generateText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  statusText: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  artCard: {
    width: "100%",
    minHeight: 250,
    borderRadius: 32,
    marginBottom: 24,
  },
  artCardInner: {
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 32,
    padding: 20,
  },
  iconCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  textBubble: {
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.12)",
    maxWidth: "94%",
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F1A30",
    textAlign: "center",
    lineHeight: 20,
  },
  infoArea: {
    alignItems: "center",
    marginBottom: 24,
  },
  podcastTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#0F1A30",
    fontFamily: "DINNextRoundedBold",
    marginBottom: 6,
    textAlign: "center",
  },
  podcastSub: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
  progressArea: {
    width: "100%",
    marginBottom: 28,
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
    gap: 38,
    marginBottom: 28,
  },
  controlBtn: {
    padding: 10,
  },
  playBtn: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtnDisabled: {
    opacity: 0.45,
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
