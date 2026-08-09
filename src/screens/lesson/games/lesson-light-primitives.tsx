/* eslint-disable */
/**
 * Lesson UI — same liquid glass / smooth press feel as the home dashboard.
 */

import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeMeshBackground,
} from "../../../components/ui/ios-liquid-home";
import { useI18n } from "../../../hooks/useI18n";
import { PRIMARY_ACTION } from "../../../constants/primary-action";
import { crossShadow } from "../../../utils/shadows";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { AppText } from "../../../components/ui/AppText";
import { IOSPressable as TouchableOpacity } from "../../../components/ui/ios-pressable";
import {
  Image,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { VolumeHighIcon } from "@hugeicons/core-free-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
  interpolate,
  ZoomIn,
  Easing,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useLocalSearchParams } from "expo-router";
import { useTTS } from "../../../hooks/use-tts";
import { L, Duo, LightMotion, LightRadius, LightType } from "./lesson-light-design";
import {
  DuoCheckButton,
  DuoFeedbackPanel,
  DuoHeading,
  DuoLessonHeader,
  DuoPrompt,
  DuoTile,
  useIsNormalPath,
  type DuoTileState,
} from "./duo-normal";
import type { AnswerTier } from "../../../utils/answer-tier";
import { TIER_COLORS } from "../../../utils/answer-tier";
import { LessonUnitLessonChip } from "../components/LessonUnitLessonChip";
import { EmojiSticker } from "../../../components/ui/EmojiSticker";
import { TwinoMascot, type TwinoPose } from "../../../components/mascot/TwinoMascot";
import { RiveMascot } from "../../../components/mascot/RiveMascot";
import { DirectionalView } from "../../../components/ui/Directional";
import { getLanguageDirection } from "../../../i18n/direction";
import { LayoutDirectionProvider, useLayoutDirection } from "../../../i18n/layout-direction";
import { useLocaleStore } from "../../../stores/useLocaleStore";
import { useThemeColors } from "../../../hooks/useThemeColors";

export function LightGameHeading({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  const lh = useLessonStyles();
  const { isKu, isAr } = useI18n();
  const rtl = isKu || isAr;
  const uiLanguage = useLocaleStore((state) => state.selectedUiLanguage);
  const { colors, isDark } = useThemeColors();
  const params = useLocalSearchParams();
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const isKidsRoute = rawMode === "kids";
  const showExtras = isKidsRoute || isDark;
  const isNormal = useIsNormalPath();

  if (isNormal) {
    return <DuoHeading title={title} />;
  }

  return (
    <View style={[lh.headingWrap, { alignItems: rtl ? "flex-end" : "flex-start" }]}>
      {showExtras && badge ? (
        <View style={[lh.kidsGameHeadingBadge, { alignSelf: rtl ? "flex-end" : "flex-start" }]}>
          <AppText style={lh.kidsGameHeadingBadgeText} forceLatinFont latinRole="bold">
            {badge.toUpperCase()}
          </AppText>
        </View>
      ) : null}
      <AppText languageCode={uiLanguage} align="start" fullWidth style={[LightType.title, { color: colors.foreground }]}>
        {title}
      </AppText>
      {showExtras && subtitle ? (
        <AppText languageCode={uiLanguage} align="start" fullWidth style={[LightType.subtitle, { color: colors.mutedForeground }]} latinRole="regular">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

export function LightPromptCard({
  kurdish,
  english,
  onSpeak,
  variant = "default",
  sourceLanguage,
  targetLanguage,
}: {
  kurdish?: string;
  english?: string;
  onSpeak?: () => void;
  variant?: "default" | "kids";
  sourceLanguage?: string;
  targetLanguage?: string;
}) {
  const lh = useLessonStyles();
  const isKids = variant === "kids";
  const storedSourceLanguage = useLocaleStore((state) => state.selectedSourceLanguage);
  const storedTargetLanguage = useLocaleStore((state) => state.selectedTargetLanguage);
  const { colors, isDark } = useThemeColors();

  const inner = (
    <>
      <SpringPressable
        onPress={onSpeak}
        style={lh.speakerBtn}
      >
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M11 5L6 9H3v6h3l5 4V5zM15.5 8.5a4 4 0 010 7M18 6a7.5 7.5 0 010 12"
            stroke={isKids ? "#C2410C" : L.blue}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </SpringPressable>
      <View style={lh.promptTextCol}>
        {kurdish ? (
          <AppText languageCode={sourceLanguage ?? storedSourceLanguage} style={[LightType.promptKu, { color: colors.foreground }]}>
            {kurdish}
          </AppText>
        ) : null}
        {english ? (
          <AppText languageCode={targetLanguage ?? storedTargetLanguage} style={[LightType.promptEn, { color: colors.mutedForeground }]} latinRole="medium">
            {english}
          </AppText>
        ) : null}
      </View>
    </>
  );

  if (isKids) {
    return (
      <View style={lh.kidsPromptWrap}>
        <LinearGradient
          colors={["#FFF3E0", "#FFD0A8", "#C8E6FF"]}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={lh.kidsPromptGradient}
        >
          <View style={lh.kidsPromptOrb} />
          <View style={lh.kidsPromptContent}>{inner}</View>
        </LinearGradient>
      </View>
    );
  }

  if (isDark) {
    return (
      <HomeLiquidCard contentStyle={lh.promptCardInner} radius={22}>
        {inner}
      </HomeLiquidCard>
    );
  }
  return (
    <View style={[lh.promptCardInner, { backgroundColor: Duo.surface, borderRadius: 16, borderWidth: 1, borderColor: Duo.border, borderBottomWidth: 3, borderBottomColor: Duo.borderDark }]}>
      {inner}
    </View>
  );
}

export type LightTileState =
  | "idle"
  | "pending"
  | "selected"
  | "correct"
  | "wrong"
  | "great"
  | "good"
  | "bad"
  | "terrible"
  | "ghost";

type TileState = LightTileState;

export function LightSurfaceCard({
  children,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const lh = useLessonStyles();
  const { isDark } = useThemeColors();
  const params = useLocalSearchParams();
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const isKidsRoute = rawMode === "kids";
  const isNormal = useIsNormalPath();

  // Normal path: content sits directly on the canvas — no card, no frame.
  if (isNormal) {
    return <View style={[lh.surfaceBare, contentStyle, style]}>{children}</View>;
  }

  if (isDark || isKidsRoute) {
    return (
      <HomeLiquidCard style={style} contentStyle={[lh.surfaceCardInner, contentStyle]} radius={22}>
        {children}
      </HomeLiquidCard>
    );
  }
  return (
    <View style={[lh.surfaceCardInner, contentStyle, style]}>
      {children}
    </View>
  );
}

/** Speech-bubble card for another speaker's line — distinct from question hero and answer tiles */
export function LightDialogueCard({
  label,
  children,
  contentLanguageCode,
}: {
  label: string;
  children: string;
  contentLanguageCode?: string;
}) {
  const lh = useLessonStyles();
  const { t, isKu, isAr } = useI18n();
  const rtl = isKu || isAr;
  const uiLanguage = useLocaleStore((state) => state.selectedUiLanguage);
  const targetLanguage = useLocaleStore((state) => state.selectedTargetLanguage);
  const languageCode = contentLanguageCode ?? targetLanguage;
  const { colors, isDark } = useThemeColors();
  const isNormal = useIsNormalPath();
  const { speak } = useTTS();

  const speakDialogue = React.useCallback(() => {
    if (Platform.OS !== "web") void Haptics.selectionAsync();
    void speak(children, languageCode, undefined, { provider: "device" });
  }, [children, languageCode, speak]);

  if (isNormal) {
    /*
     * This is the other speaker's line, not something the learner can pick. It
     * previously rendered as a white 2px-bordered box — the exact silhouette of
     * an answer tile sitting directly below it, so the turn read as a sixth
     * option. Three cues separate them now:
     *   • a tinted fill instead of the tiles' white face
     *   • no bottom rim (the tiles' 4px rim is what reads as "pressable")
     *   • a tail pointing back at the speaker, plus a replayable speaker glyph
     */
    return (
      <View style={lh.duoDialogueWrap}>
        <AppText
          languageCode={uiLanguage}
          align="start"
          fullWidth
          style={lh.duoDialogueLabel}
        >
          {label}
        </AppText>
        <View style={lh.duoDialogueBubbleWrap}>
          <Pressable
            onPress={() => speakDialogue()}
            accessibilityRole="button"
            accessibilityLabel={`${t("lessons.listenLabel")}: ${children}`}
            style={[
              lh.duoDialogueBubble,
              {
                backgroundColor: isDark ? colors.surfaceRaised : Duo.accentBg,
                borderColor: isDark ? colors.border : Duo.accentBorder,
              },
            ]}
          >
            <View style={lh.duoDialogueSpeaker}>
              <HugeiconsIcon icon={VolumeHighIcon} size={22} color={Duo.accent} strokeWidth={2.4} />
            </View>
            <AppText
              languageCode={languageCode}
              align="start"
              style={[lh.duoDialogueText, { color: colors.foreground, flex: 1 }]}
            >
              {children}
            </AppText>
          </Pressable>
          {/* Tail points back toward the speaker; physical side is not mirrored for us. */}
          <View
            style={[
              lh.duoDialogueTail,
              rtl ? lh.duoDialogueTailRtl : lh.duoDialogueTailLtr,
              {
                backgroundColor: isDark ? colors.surfaceRaised : Duo.accentBg,
                borderColor: isDark ? colors.border : Duo.accentBorder,
              },
            ]}
            pointerEvents="none"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[lh.dialogueWrap, rtl ? { marginLeft: 0, marginRight: 4 } : undefined]}>
      <View style={lh.dialogueBubble}>
        <LinearGradient
          colors={isDark ? [colors.surfaceRaised, colors.surface, "#172A46"] : [Duo.canvas, Duo.canvas, "#EEF2F6"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={lh.dialogueGradient}
        >
          <View style={lh.dialogueContent}>
            <View style={[lh.dialogueBadge, { alignSelf: rtl ? "flex-end" : "flex-start" }]}>
              <AppText languageCode={uiLanguage} style={LightType.dialogueBadge}>
                {label}
              </AppText>
            </View>
            <DirectionalView languageCode={languageCode} style={lh.dialogueRow}>
              <DialogueQuoteIcon />
              <AppText
                languageCode={languageCode}
                align="start"
                style={[LightType.dialogueText, { color: colors.foreground }]}
                latinRole="medium"
              >
                {children}
              </AppText>
            </DirectionalView>
          </View>
        </LinearGradient>
        <View style={[
          lh.dialogueTail,
          rtl ? { left: undefined, right: 22, transform: [{ rotate: "-45deg" }] } : undefined,
        ]} pointerEvents="none" />
      </View>
    </View>
  );
}

function DialogueQuoteIcon() {
  const lh = useLessonStyles();
  return (
    <View style={lh.dialogueQuoteWrap}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M7 11c0-2.2 1.4-4 3.5-5.2L9 3C5.1 4.6 3 8 3 12v5h6v-6H7zm10 0c0-2.2 1.4-4 3.5-5.2L19 3c-3.9 1.6-6 5-6 9v5h6v-6h-2z"
          fill="rgba(255, 107, 74, 0.34)"
        />
      </Svg>
    </View>
  );
}

/** Hero-style question prompt — visually distinct from tappable answer tiles */
export function LightQuestionPrompt({
  children,
  label,
  forceKurdishFont,
  variant = "default",
  layout = "row",
  expanded = false,
  contentLanguageCode,
  speechText,
  speechLanguageCode,
}: {
  children: string;
  label: string;
  forceKurdishFont?: boolean;
  variant?: "default" | "kids";
  layout?: "row" | "stacked";
  expanded?: boolean;
  contentLanguageCode?: string;
  /** Text spoken by the audio button; may differ from the displayed source-language hint. */
  speechText?: string;
  /** Language used for TTS voice selection. */
  speechLanguageCode?: string;
}) {
  const lh = useLessonStyles();
  const params = useLocalSearchParams();
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const isKids = variant === "kids" || rawMode === "kids";
  const { width, height } = useWindowDimensions();
  const isNormal = useIsNormalPath();

  const { speak } = useTTS();
  const { t, isKu, isAr } = useI18n();
  const rtl = isKu || isAr;
  const uiLanguage = useLocaleStore((state) => state.selectedUiLanguage);
  const sourceLanguage = useLocaleStore((state) => state.selectedSourceLanguage);
  const languageCode = contentLanguageCode ?? (forceKurdishFont ? sourceLanguage : uiLanguage);
  const compactLayout = width < 480 || height < 720;
  const stacked = layout === "stacked" || compactLayout;
  const compact = width < 380 || height < 720;
  const normalMascotSize = stacked ? (compact ? 90 : 104) : 120;
  const kidsMascotSize = stacked ? (compact ? 110 : 124) : 160;

  const floatY = useSharedValue(0);
  const breathe = useSharedValue(1);
  const droplet1Y = useSharedValue(0);
  const droplet2Y = useSharedValue(0);

  useEffect(() => {
    if (isKids) {
      droplet1Y.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(3, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      droplet2Y.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(-2, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    }
  }, [isKids, droplet1Y, droplet2Y]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: breathe.value }],
  }));

  const shadowStyle = useAnimatedStyle(() => {
    const scaleX = interpolate(floatY.value, [-5, 5], [0.85, 1.15]);
    const opacity = interpolate(floatY.value, [-5, 5], [0.04, 0.08]);
    return {
      transform: [{ scaleX }],
      opacity,
    };
  });

  const droplet1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: droplet1Y.value }],
  }));
  const droplet2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: droplet2Y.value }],
  }));

  const handleSpeak = () => {
    speak(
      speechText ?? children,
      speechLanguageCode ?? languageCode,
      undefined,
      { provider: "device" },
    );
  };

  const pose = React.useMemo<TwinoPose>(() => {
    const l = label.toLowerCase();
    if (l.includes("speak") || l.includes("voice") || l.includes("pronounce") || l.includes("mic")) {
      return "headset";
    }
    const c = children.toLowerCase();
    if (c.includes("!") || c.includes("congrats") || c.includes("happy") || c.includes("great")) {
      return "party";
    }
    const poses: TwinoPose[] = ["wave", "happy", "wink"];
    let hash = 0;
    for (let i = 0; i < children.length; i++) {
      hash = children.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % poses.length;
    return poses[index];
  }, [children, label]);

  if (isNormal) {
    return (
      <DuoPrompt
        speechText={speechText}
        speechLanguageCode={speechLanguageCode}
        contentLanguageCode={languageCode}
        pose={pose}
      >
        {children}
      </DuoPrompt>
    );
  }

  if (isKids) {
    return (
      <View style={[lh.kidsMascotStage, stacked && lh.kidsMascotStageStacked]}>
        {/* Mascot with gentle floating animation */}
        <View
          style={[
            lh.kidsMascotArea,
            stacked && lh.kidsMascotAreaStacked,
            stacked && { width: kidsMascotSize, height: kidsMascotSize + 10 },
          ]}
        >
          <Animated.View
            style={[
              lh.kidsMascotWrap,
              stacked && { width: kidsMascotSize, height: kidsMascotSize + 8 },
              mascotStyle,
            ]}
          >
            <RiveMascot size={kidsMascotSize} pose="wave" />
          </Animated.View>
          <Animated.View style={[lh.kidsMascotShadow, shadowStyle]} />
        </View>

        {/* Speech Bubble */}
        <View style={[lh.mascotBubbleWrap, stacked && lh.mascotBubbleWrapStacked]}>
          <View style={[lh.kidsBubble, stacked && lh.kidsBubbleStacked]}>
            <View style={[
              stacked ? lh.kidsBubbleTailTop : lh.kidsBubbleTail,
              !stacked && rtl ? { left: undefined, right: -9, transform: [{ rotate: "225deg" }] } : {}
            ]} />
            <View style={lh.bubbleTextCol}>
              <AppText
                languageCode={languageCode}
                align="start"
                fullWidth
                style={[
                  lh.kidsBubbleTextEn,
                  compact && lh.kidsBubbleTextCompact,
                ]}
                latinRole="bold"
              >
                {children}
              </AppText>
            </View>
            <Pressable
              onPress={handleSpeak}
              accessibilityRole="button"
              accessibilityLabel={`${t("lessons.listenLabel")}: ${speechText ?? children}`}
              style={lh.kidsBubbleSpeaker}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M11 5L6 9H3v6h3l5 4V5zM15.5 8.5a4 4 0 010 7"
                  stroke="#0EA5E9"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[lh.normalMascotStage, stacked && lh.normalMascotStageStacked]}>
      {/* Twino Mascot with gentle floating animation */}
      <View
        style={[
          lh.normalMascotArea,
          stacked && lh.normalMascotAreaStacked,
          stacked && { width: normalMascotSize, height: normalMascotSize + 8 },
        ]}
      >
        <Animated.View
          style={[
            lh.normalMascotWrap,
            stacked && { width: normalMascotSize, height: normalMascotSize + 6 },
            mascotStyle,
          ]}
        >
          <TwinoMascot size={normalMascotSize} pose={pose} />
        </Animated.View>
        <Animated.View style={[lh.normalMascotShadow, shadowStyle]} />
      </View>

      {/* Speech Bubble */}
      <View style={[lh.mascotBubbleWrap, stacked && lh.mascotBubbleWrapStacked]}>
        <View style={[lh.normalBubble, stacked && lh.normalBubbleStacked, expanded && lh.normalBubbleExpanded]}>
          {/* Bubble tail pointing left to the mascot */}
          <View style={[
            stacked ? lh.normalBubbleTailTop : lh.normalBubbleTail,
            !stacked && rtl ? { left: undefined, right: -7, transform: [{ rotate: "225deg" }] } : {}
          ]} />
          
          <View style={lh.bubbleTextCol}>
            <AppText languageCode={uiLanguage} style={lh.normalBubbleLabel}>
              {label}
            </AppText>
            <AppText
              languageCode={languageCode}
              align="start"
              fullWidth
              style={[
                lh.normalBubbleText,
                compact && lh.normalBubbleTextCompact,
                expanded && lh.normalBubbleTextExpanded,
              ]}
            >
              {children}
            </AppText>
          </View>

          <TouchableOpacity
            onPress={handleSpeak}
            accessibilityRole="button"
            accessibilityLabel={`${t("lessons.listenLabel")}: ${speechText ?? children}`}
            style={lh.normalBubbleSpeaker}
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={18} color={Duo.accent} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/** Mesh backdrop for lesson + path screens */
export function LessonMeshBackdrop({ children }: { children: React.ReactNode }) {
  const lh = useLessonStyles();
  const { colors, isDark } = useThemeColors();
  return (
    <View style={[lh.backdrop, { backgroundColor: isDark ? colors.background : Duo.canvas }]}>
      <View style={lh.backdropContent}>{children}</View>
    </View>
  );
}

export function KidsBottomScene() {
  const lh = useLessonStyles();
  return (
    <View style={lh.hillsContainer} pointerEvents="none">
      <Svg height={160} width="100%" viewBox="0 0 375 160" preserveAspectRatio="none">
        {/* Back Hills */}
        <Path
          d="M-20,160 L-20,90 Q80,40 180,95 Q280,40 395,90 L395,160 Z"
          fill="#3EAE42"
        />
        {/* Pathway */}
        <Path
          d="M140,160 Q170,110 180,90 Q190,110 220,160 Z"
          fill="#E8F8D0"
        />
        {/* Front Left Hill */}
        <Path
          d="M-20,160 L-20,110 Q90,70 190,120 L190,160 Z"
          fill="#58CC02"
        />
        {/* Front Right Hill */}
        <Path
          d="M170,160 L170,125 Q280,65 395,105 L395,160 Z"
          fill="#58CC02"
        />
        
        {/* Flag Pole */}
        <Line x1="70" y1="130" x2="70" y2="90" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
        {/* Purple Flag */}
        <Path
          d="M70,90 L40,100 L70,110 Z"
          fill="#A855F7"
        />
        
        {/* Flower Stem */}
        <Path
          d="M310,135 Q312,120 310,110"
          stroke="#4CAF50"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Leaf */}
        <Path
          d="M310,125 Q300,120 306,118 Z"
          fill="#4CAF50"
        />
        {/* Petals */}
        <Circle cx="302" cy="106" r="6" fill="#FFFFFF" />
        <Circle cx="318" cy="106" r="6" fill="#FFFFFF" />
        <Circle cx="310" cy="98" r="6" fill="#FFFFFF" />
        <Circle cx="310" cy="114" r="6" fill="#FFFFFF" />
        {/* Flower Center */}
        <Circle cx="310" cy="106" r="5" fill="#FFC000" />
      </Svg>
    </View>
  );
}

export function KidsCloudsBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg height={280} width="100%" viewBox="0 0 375 280" preserveAspectRatio="none">
        <Path
          d="M-20,0 L395,0 L395,120 Q310,160 260,110 Q190,70 120,110 Q50,150 -20,100 Z"
          fill="#FFFFFF"
          opacity={0.8}
        />
        <Path
          d="M-20,0 L395,0 L395,90 Q340,120 290,90 Q220,50 160,95 Q100,140 40,90 Q-10,50 -20,80 Z"
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
}

export function KidsLessonBackdrop({ children }: { children: React.ReactNode }) {
  const lh = useLessonStyles();
  return (
    <View style={lh.backdrop}>
      <LinearGradient
        colors={["#C5E8F7", "#A8D8F0", "#8ECAE6"]}
        style={StyleSheet.absoluteFill}
      />
      <KidsCloudsBackground />
      <KidsBottomScene />
      <View style={lh.backdropContent}>{children}</View>
    </View>
  );
}

/** Full-width answer row for multiple choice / conversation */
export function LightOptionRow({
  label,
  tierLabel,
  state = "idle",
  onPress,
  disabled,
  rtl,
  forceLatinFont,
  isKids = false,
  languageCode,
}: {
  label: string;
  tierLabel?: string;
  state?: LightTileState;
  onPress?: () => void;
  disabled?: boolean;
  rtl?: boolean;
  forceLatinFont?: boolean;
  isKids?: boolean;
  languageCode?: string;
}) {
  const lh = useLessonStyles();
  return (
    <View style={lh.optionRowWrap}>
      <LightWordTile
        label={label}
        tierLabel={tierLabel}
        state={state}
        onPress={onPress}
        disabled={disabled}
        rtl={rtl}
        forceLatinFont={forceLatinFont}
        languageCode={languageCode}
        isKids={isKids}
        centerLabel
        wide
      />
    </View>
  );
}

export function mapOptionState(
  state: "idle" | "pending" | "selected" | "correct" | "wrong" | AnswerTier,
): LightTileState {
  if (state === "selected") return "selected";
  if (state === "great" || state === "good" || state === "bad" || state === "terrible") {
    return state;
  }
  return state;
}

function extractEmoji(text: string): { emoji: string | null; cleanText: string } {
  if (!text) return { emoji: null, cleanText: "" };
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
  const match = text.match(emojiRegex);
  if (match) {
    const emoji = match[0];
    const cleanText = text.replace(emoji, "").replace(/\n/g, " ").trim();
    return { emoji, cleanText };
  }
  return { emoji: null, cleanText: text };
}

export function LightWordTile({
  label,
  tierLabel,
  state = "idle",
  onPress,
  disabled,
  rtl,
  forceLatinFont,
  wide,
  wrapLabel,
  isKids = false,
  fontSize,
  centerLabel = false,
  fitLabel = false,
  fitLabelLines = 1,
  style,
  languageCode,
}: {
  label: string;
  tierLabel?: string;
  state?: TileState;
  onPress?: () => void;
  disabled?: boolean;
  rtl?: boolean;
  forceLatinFont?: boolean;
  wide?: boolean;
  /** Pair-match columns: wrap text, avoid clipping in narrow tiles */
  wrapLabel?: boolean;
  isKids?: boolean;
  fontSize?: number;
  centerLabel?: boolean;
  /** Shrink a word to fit inside a fixed-size tile. */
  fitLabel?: boolean;
  /** Fixed number of lines available when fitting text inside a tile. */
  fitLabelLines?: 1 | 2 | 3;
  style?: StyleProp<ViewStyle>;
  languageCode?: string;
}) {
  const lh = useLessonStyles();
  const params = useLocalSearchParams();
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const isKidsRoute = rawMode === "kids" || isKids;
  const sourceLanguage = useLocaleStore((state) => state.selectedSourceLanguage);
  const targetLanguage = useLocaleStore((state) => state.selectedTargetLanguage);
  const uiLanguage = useLocaleStore((state) => state.selectedUiLanguage);
  const { colors, isDark } = useThemeColors();
  const isNormal = useIsNormalPath();
  const ambientDirection = useLayoutDirection();

  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const stateIndex = useSharedValue(0);

  const STATE_INDEX = React.useMemo(() => ({
    idle: 0,
    pending: 1,
    selected: 2,
    correct: 3,
    wrong: 4,
    great: 5,
    good: 6,
    bad: 7,
    terrible: 8,
    ghost: 9,
  }), []);

  React.useEffect(() => {
    stateIndex.value = withTiming(STATE_INDEX[state] ?? 0, {
      duration: LightMotion.colorMs,
    });
  }, [state, STATE_INDEX]);

  const colorMap = React.useMemo(() => {
    const dividerColor = colors.border;
    const darkState = {
      selected: "rgba(59, 130, 246, 0.28)",
      correct: "rgba(16, 185, 129, 0.24)",
      wrong: "rgba(239, 68, 68, 0.24)",
      good: "rgba(59, 130, 246, 0.22)",
      bad: "rgba(245, 158, 11, 0.22)",
    };
    return {
      bg: [
        isDark && !isKidsRoute ? colors.surfaceRaised : Duo.snow, // idle
        isDark && !isKidsRoute ? colors.surface : Duo.surface, // pending
        isKidsRoute ? "#7DD3FC" : isDark ? darkState.selected : Duo.blueBg, // selected
        isKidsRoute ? "#BBF7D0" : isDark ? darkState.correct : Duo.greenBg, // correct
        isKidsRoute ? "#FEF2F2" : isDark ? darkState.wrong : Duo.redBg, // wrong
        isDark && !isKidsRoute ? darkState.correct : TIER_COLORS.great.bg,
        isDark && !isKidsRoute ? darkState.good : TIER_COLORS.good.bg,
        isDark && !isKidsRoute ? darkState.bad : TIER_COLORS.bad.bg,
        isDark && !isKidsRoute ? darkState.wrong : TIER_COLORS.terrible.bg,
        /*
         * Ghost is the empty slug a lifted word leaves behind, so it reads as a
         * hole in the bank: a filled grey well, not a transparent outline that
         * still looks like an available tile.
         */
        isDark && !isKidsRoute ? colors.muted : L.bgSoft, // ghost
      ],
      border: [
        isKidsRoute ? "#E5E7EB" : dividerColor, // idle
        "#94A3B8", // pending
        isKidsRoute ? "#38BDF8" : Duo.blue, // selected
        isKidsRoute ? "#16A34A" : Duo.green, // correct
        isKidsRoute ? "#EF4444" : Duo.red, // wrong
        TIER_COLORS.great.accent,
        TIER_COLORS.good.accent,
        TIER_COLORS.bad.accent,
        TIER_COLORS.terrible.accent,
        isDark && !isKidsRoute ? colors.border : L.slotDash, // ghost
      ]
    };
  }, [colors, isDark, isKidsRoute]);

  const themedLabelColor = React.useMemo(() => {
    if (isKidsRoute || !isDark) return undefined;
    switch (state) {
      case "selected":
      case "good":
        return "#DBEAFE";
      case "correct":
      case "great":
        return "#A7F3D0";
      case "wrong":
      case "terrible":
        return "#FECACA";
      case "bad":
        return "#FDE68A";
      default:
        return colors.foreground;
    }
  }, [colors.foreground, isDark, isKidsRoute, state]);

  const isPressedOrSelected = state === "selected" || state === "correct" || state === "wrong";
  const animScale = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value + (isKidsRoute && isPressedOrSelected ? 2 : 0) }
    ],
  }));

  const animColor = useAnimatedStyle(() => {
    const bgVal = interpolateColor(
      stateIndex.value,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      colorMap.bg
    );
    const borderVal = interpolateColor(
      stateIndex.value,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      colorMap.border
    );
    return {
      backgroundColor: bgVal,
      borderColor: borderVal,
    };
  });

  const { emoji: parsedEmoji, cleanText } = isKidsRoute
    ? extractEmoji(label)
    : { emoji: null, cleanText: label };
  const labelLanguageCode = forceLatinFont
    ? "en"
    : languageCode ?? (rtl ? sourceLanguage : targetLanguage);
  const isLtrLabel = getLanguageDirection(labelLanguageCode) === "ltr";
  const shouldCenterLabel = centerLabel && !isLtrLabel;
  // Native Pressable inherits the app's RTL direction. Keep English answer
  // tiles explicitly LTR before checking; Kurdish/Arabic tiles are untouched.
  // The provider must travel with the style so AppText inside compensates for
  // this boundary rather than the outer one — see `i18n/layout-direction`.
  const nativeLtrBoundary =
    Platform.OS !== "web" && isLtrLabel
      ? ({ direction: "ltr" } as const)
      : undefined;
  const tileDirection: "ltr" | "rtl" = nativeLtrBoundary ? "ltr" : ambientDirection;

  if (isNormal) {
    // "pending" (a word sitting in an answer slot) reads as a plain resting
    // tile in the reference design; the tier states collapse onto correct/wrong.
    const duoState: DuoTileState =
      state === "ghost"
        ? "ghost"
        : state === "selected"
          ? "selected"
          : state === "correct" || state === "great"
            ? "correct"
            : state === "wrong" || state === "bad" || state === "terrible"
              ? "wrong"
              : state === "good"
                ? "selected"
                : "idle";

    return (
      <DuoTile
        label={label}
        tierLabel={tierLabel}
        state={duoState}
        onPress={onPress}
        disabled={disabled}
        languageCode={labelLanguageCode}
        align={wide ? "start" : "center"}
        fontSize={fontSize}
        numberOfLines={wrapLabel ? 3 : undefined}
        style={[wide && { width: "100%" }, style]}
      />
    );
  }

  const content = (
    <Animated.View
      style={[
        lh.tile,
        wide && lh.tileWide,
        wrapLabel && lh.tileWrap,
        isKidsRoute && {
          borderRadius: 20,
          borderWidth: 2,
          borderBottomWidth: state === "selected" || state === "correct" || state === "wrong" ? 4 : 6,
          borderBottomColor: 
            state === "correct" ? "#15803D" :
            state === "wrong" ? "#B91C1C" :
            state === "selected" ? "#0284C7" :
            "#D1D5DB",
          paddingVertical: parsedEmoji ? 12 : 14,
        },
        animColor,
        {
          borderStyle: state === "ghost" ? "dashed" : "solid",
          overflow: wrapLabel ? "visible" : "hidden",
        },
        state !== "ghost" && isKidsRoute &&
          crossShadow({
            color: "#1A2B48",
            offsetY: 8,
            blur: 16,
            opacity: 0.1,
            elevation: 4,
          }),
        style,
        nativeLtrBoundary,
      ]}
    >

      {/*
        A ghost tile is the empty grey slug left behind when its word has been
        lifted out. The label still renders — it is what gives the slug the
        exact width of the word it stands in for, so the bank never reflows —
        but it is made invisible rather than merely faded, because a readable
        word in the bank makes it look like the tile was never taken.
      */}
      {parsedEmoji ? (
        <DirectionalView
          languageCode={labelLanguageCode}
          style={{ alignItems: "center", gap: 8, opacity: state === "ghost" ? 0 : 1 }}
        >
          <EmojiSticker emoji={parsedEmoji} size={36} animateOnMount={false} />
          {cleanText ? (
            <AppText
              languageCode={labelLanguageCode}
              align="center"
              nativeAlign="start"
              fullWidth
              style={[
                LightType.tile,
                {
                  color: isKidsRoute ? L.navy : colors.foreground,
                  fontSize: 15,
                  fontFamily: "DINNextRoundedBold",
                  textAlign: "center",
                },
              ]}
            >
              {cleanText}
            </AppText>
          ) : null}
        </DirectionalView>
      ) : tierLabel ? (
        <DirectionalView
          languageCode={labelLanguageCode}
          style={[lh.tileRow, { opacity: state === "ghost" ? 0 : 1 }]}
        >
          <AppText
            languageCode={labelLanguageCode}
            align="start"
            style={[LightType.tile, lh.tileAnswer, { zIndex: 1, color: isKidsRoute ? L.navy : colors.foreground }, isKidsRoute && { fontFamily: "DINNextRoundedBold" }]}
          >
            {label}
          </AppText>
          <AppText
            languageCode={uiLanguage}
            style={[
              lh.tierBadge,
              {
                color:
                  state === "great" ||
                  state === "good" ||
                  state === "bad" ||
                  state === "terrible"
                    ? TIER_COLORS[state].deep
                    : L.gray,
              },
            ]}
            forceLatinFont
          >
            {tierLabel}
          </AppText>
        </DirectionalView>
      ) : (
        <AppText
          languageCode={labelLanguageCode}
          align={shouldCenterLabel ? "center" : "start"}
          nativeAlign="start"
          fullWidth={shouldCenterLabel || wide}
          style={[
            LightType.tile,
            wrapLabel && lh.tileWrapText,
            shouldCenterLabel && { alignSelf: "center", width: "100%" },
            wide && { alignSelf: "stretch", width: "100%" },
            {
              zIndex: 1,
              color:
                !isKidsRoute && themedLabelColor
                  ? themedLabelColor
                  : isKidsRoute && state === "correct"
                    ? "#14532D"
                    : isKidsRoute && state === "wrong"
                      ? "#B91C1C"
                      : isKidsRoute && state === "selected"
                        ? "#0284C7"
                        : state === "selected"
                          ? L.blue
                          : (isKidsRoute ? L.navy : colors.foreground),
            },
            isKidsRoute && { fontFamily: "DINNextRoundedBold", fontSize: fontSize ?? 16 },
            fontSize !== undefined && !isKidsRoute && { fontSize, lineHeight: fontSize + 8 },
            fontSize !== undefined && isKidsRoute && { lineHeight: fontSize + 8 },
            state === "ghost" && { opacity: 0 },
          ]}
          numberOfLines={fitLabel ? fitLabelLines : undefined}
          adjustsFontSizeToFit={fitLabel}
          minimumFontScale={fitLabel ? 0.58 : undefined}
        >
          {label}
        </AppText>
      )}
    </Animated.View>
  );

  if (!onPress || disabled || state === "ghost") {
    return (
      <LayoutDirectionProvider value={tileDirection}>
        <Animated.View style={[animScale, nativeLtrBoundary]}>{content}</Animated.View>
      </LayoutDirectionProvider>
    );
  }

  return (
    <LayoutDirectionProvider value={tileDirection}>
      <Animated.View style={[animScale, nativeLtrBoundary]}>
        <Pressable
          style={nativeLtrBoundary}
          onPress={() => {
            if (Platform.OS !== "web") void Haptics.selectionAsync();
            onPress();
          }}
          onPressIn={() => {
            scale.value = withSpring(0.97, LightMotion.soft);
            translateY.value = withSpring(isKidsRoute ? 4 : 0, LightMotion.soft);
          }}
          onPressOut={() => {
            scale.value = withSpring(1, LightMotion.soft);
            translateY.value = withSpring(0, LightMotion.soft);
          }}
          disabled={disabled}
        >
          {content}
        </Pressable>
      </Animated.View>
    </LayoutDirectionProvider>
  );
}

export function LightAnswerSlots({
  count,
  filled,
}: {
  count: number;
  filled: number;
}) {
  const lh = useLessonStyles();
  return (
    <View style={lh.slotsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            lh.slot,
            i < filled && lh.slotFilled,
          ]}
        />
      ))}
    </View>
  );
}

function SvgLightbulb({ size = 16, color = Duo.accent }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H15M9 18H15M12 2C7.58 2 4 5.58 4 10C4 12.89 5.53 15.42 7.82 16.82C8.56 17.27 9 18.06 9 18.91V19C9 20.1 9.9 21 11 21H13C14.1 21 15 20.1 15 19V18.91C15 18.06 15.44 17.27 16.18 16.82C18.47 15.42 20 12.89 20 10C20 5.58 16.42 2 12 2Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LightHintButton({
  onPress,
  label = "Hint",
  showBulb = true,
}: {
  onPress?: () => void;
  label?: string;
  showBulb?: boolean;
}) {
  const lh = useLessonStyles();
  return (
    <Pressable onPress={onPress}>
      <HomeLiquidCard contentStyle={lh.hintBtn} radius={LightRadius.btn}>
        {showBulb ? <SvgLightbulb size={18} color={Duo.accent} /> : null}
        <AppText style={lh.hintLabel} forceKurdishFont>{label}</AppText>
      </HomeLiquidCard>
    </Pressable>
  );
}

export function LightCheckButton({
  label = "CHECK",
  onPress,
  disabled,
  color: _color = L.blue,
  variant,
}: {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  variant?: "default" | "kids";
}) {
  const lh = useLessonStyles();
  const params = useLocalSearchParams();
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const isKids = variant === "kids" || rawMode === "kids";
  const isNormal = useIsNormalPath();

  if (isNormal) {
    return <DuoCheckButton label={label} onPress={onPress} disabled={disabled} />;
  }

  if (isKids) {
    if (disabled) {
      return (
        <View style={lh.kidsCheckBtnDisabled}>
          <AppText style={lh.kidsCheckLabelDisabled} latinRole="bold">
            {label.toLowerCase()}
          </AppText>
        </View>
      );
    }
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          lh.kidsCheckBtnActive,
          {
            borderBottomWidth: 3,
            transform: [{ translateY: pressed ? 1 : 0 }],
          }
        ]}
      >
        <AppText style={lh.kidsCheckLabelActive} latinRole="bold">
          {label.toLowerCase()}
        </AppText>
      </Pressable>
    );
  }

  if (disabled) {
    return (
      <View style={lh.checkBtnDisabled}>
        <AppText style={[lh.checkLabel, lh.checkLabelDisabled]} forceKurdishFont>{label}</AppText>
      </View>
    );
  }
  return (
    <HomeLiquidButton
      label={label}
      onPress={onPress}
      flush
      variant="login"
    />
  );
}

/** Match row: tile + connector dot + tile */
export function LightMatchRow({
  left,
  right,
  leftState,
  rightState,
  onLeft,
  onRight,
  leftDisabled,
  rightDisabled,
  leftLanguageCode,
  rightLanguageCode,
}: {
  left: string;
  right: string;
  leftState: TileState;
  rightState: TileState;
  onLeft: () => void;
  onRight: () => void;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
  leftLanguageCode?: string;
  rightLanguageCode?: string;
}) {
  const lh = useLessonStyles();
  return (
    <View style={lh.matchRow}>
      <View style={lh.matchSide}>
        <LightWordTile
          label={left}
          state={leftState}
          onPress={onLeft}
          disabled={leftDisabled}
          rtl
          languageCode={leftLanguageCode}
        />
      </View>
      <View style={lh.matchDotCol}>
        <View style={[lh.matchDot, leftState === "selected" && lh.matchDotActive]} />
        <View style={lh.matchLine} />
        <View style={[lh.matchDot, rightState === "selected" && lh.matchDotActive]} />
      </View>
      <View style={lh.matchSide}>
        <LightWordTile
          label={right}
          state={rightState}
          onPress={onRight}
          disabled={rightDisabled}
          languageCode={rightLanguageCode}
        />
      </View>
    </View>
  );
}

export function SpeakerIcon({ size = 22, color = L.blue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5L6 9H3v6h3l5 4V5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BackChevron({ size = 22, color = L.navy }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6l-6 6 6 6"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HeartIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s-7-4.5-9.5-9C1 9 3 5 7 5c2 0 3.5 1.5 5 3 1.5-1.5 3-3 5-3 4 0 6 4 4.5 7-2.5 4.5-9.5 9-9.5 9z"
        fill={L.red}
      />
    </Svg>
  );
}

export function LessonLightHeader({
  progressFillStyle,
  hearts,
  onBack,
  unitNumber,
  lessonNumber,
  variant = "default",
  maxHearts = 5,
  step,
}: {
  progressFillStyle: any;
  hearts: number;
  onBack: () => void;
  unitNumber: number;
  lessonNumber: number;
  variant?: "default" | "kids";
  maxHearts?: number;
  step?: number;
}) {
  const lh = useLessonStyles();
  const { isKu, isAr } = useI18n();
  const rtl = isKu || isAr;
  const isKids = variant === "kids";
  const { colors, isDark } = useThemeColors();
  const isNormal = useIsNormalPath();

  if (isNormal) {
    return (
      <DuoLessonHeader
        progressFillStyle={progressFillStyle}
        hearts={hearts}
        maxHearts={maxHearts}
        onBack={onBack}
        step={step}
      />
    );
  }

  if (isKids) {
    return (
      <View style={lh.kidsHeader}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            lh.kidsCloseBtn,
            pressed && lh.kidsCloseBtnPressed,
          ]}
        >
          <View style={{ width: 14, height: 14, alignItems: "center", justifyContent: "center" }}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6l12 12"
                stroke="#FFFFFF"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </Pressable>
        <View style={lh.kidsProgressTrack}>
          <Animated.View style={[lh.kidsProgressKnobRail, progressFillStyle]}>
            <View style={lh.kidsProgressKnob} />
          </Animated.View>
        </View>
        <View style={lh.kidsHeartsBadge}>
          <HeartIcon size={18} />
          <AppText style={lh.kidsHeartsText} forceLatinFont latinRole="bold">
            {hearts}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={lh.lessonHeader}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [lh.lessonHeaderButton, pressed && lh.lessonHeaderButtonPressed]}
      >
        <View style={{ transform: [{ scaleX: rtl ? -1 : 1 }] }}>
          <BackChevron color={colors.foreground} />
        </View>
      </Pressable>
      <LessonUnitLessonChip
        unitNumber={unitNumber}
        lessonNumber={lessonNumber}
      />
      <HomeLiquidCard style={lh.progressGlass} contentStyle={lh.progressGlassInner} radius={14}>
        <View style={[lh.progressTrack, isDark && { backgroundColor: "rgba(255,255,255,0.12)" }]}>
          <Animated.View style={[lh.progressFill, progressFillStyle]}>
            <View style={lh.progressKnob} />
          </Animated.View>
        </View>
      </HomeLiquidCard>
      <HomeLiquidCard contentStyle={lh.heartsPill} radius={22}>
        <HeartIcon />
        <AppText style={lh.heartsText} forceLatinFont latinRole="bold">{hearts}</AppText>
      </HomeLiquidCard>
    </View>
  );
}

/** Bottom feedback — liquid glass card (correct / tiered) */
export function LessonLiquidFeedback({
  correct,
  tier,
  title,
  subtitle,
  buttonLabel,
  onContinue,
  variant = "default",
  correctAnswer,
  bottomInset = 0,
}: {
  correct: boolean;
  tier?: AnswerTier;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onContinue: () => void;
  variant?: "default" | "kids";
  /** Shown under a "Correct Answer:" label when the attempt was wrong. */
  correctAnswer?: string;
  bottomInset?: number;
}) {
  const lh = useLessonStyles();
  const { t, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const rtl = isKu || isAr;
  const isKids = variant === "kids";
  const isPassing = correct || tier === "great" || tier === "good";
  const isNormal = useIsNormalPath();

  if (isNormal) {
    return (
      <DuoFeedbackPanel
        correct={isPassing}
        title={title}
        subtitle={subtitle}
        correctAnswer={correctAnswer}
        buttonLabel={buttonLabel}
        onContinue={onContinue}
        bottomInset={bottomInset}
      />
    );
  }

  if (isKids) {
    const kidsBg = isPassing ? "#EAFBE0" : "#FEECEC";
    const kidsBorder = isPassing ? "#58CC02" : "#EF4444";
    const kidsShadow = isPassing ? "#3F9302" : "#B91C1C";
    const kidsDeepText = isPassing ? "#46A302" : "#DC2626";
    const kidsPose = isPassing ? "happy" : "losing";

    return (
      <View
        style={[
          lh.kidsFeedbackOuter,
          {
            backgroundColor: kidsBg,
            borderColor: kidsBorder,
            borderBottomColor: kidsShadow,
            flexDirection: "column",
          }
        ]}
      >
        <View style={[lh.trayHandle, { backgroundColor: isPassing ? "rgba(70,163,2,0.18)" : "rgba(220,38,38,0.18)" }]} />
        <View style={lh.feedbackRow}>
          <View style={lh.feedbackMascotCol}>
            <TwinoMascot size={110} pose={kidsPose} />
          </View>
          
          <View style={lh.feedbackTextCol}>
            <AppText style={[lh.feedbackTitle, { color: kidsDeepText, textAlign: rtl ? "right" : "left", fontFamily: "DINNextRoundedBold" }]}>
              {title}
            </AppText>
            <AppText style={[lh.feedbackSub, { color: kidsDeepText, opacity: 0.85, textAlign: rtl ? "right" : "left", fontFamily: "DINNextRoundedMedium" }]}>
              {subtitle}
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [
            lh.kidsFeedbackCta,
            {
              backgroundColor: PRIMARY_ACTION.face,
              borderBottomColor: PRIMARY_ACTION.rim,
              borderBottomWidth: 3,
              transform: [{ translateY: pressed ? 1 : 0 }],
            }
          ]}
        >
          <AppText style={lh.kidsFeedbackCtaText} latinRole="bold">
            {(buttonLabel ?? t("common.continue")).toLowerCase()}
          </AppText>
        </Pressable>
      </View>
    );
  }

  const duoBg = isPassing ? Duo.greenBg : Duo.redBg;
  const duoTitleColor = isPassing ? Duo.greenText : Duo.redText;
  const duoBtnBg = isPassing ? Duo.green : Duo.red;
  const duoBtnDark = isPassing ? Duo.greenDark : Duo.redDark;

  return (
    <View
      style={[
        lh.duoFeedbackWrap,
        { backgroundColor: isDark ? colors.surfaceRaised : duoBg },
      ]}
    >
      <View style={[lh.feedbackTextCol, { paddingHorizontal: 20, paddingTop: 20 }]}>
        <View style={{ flexDirection: rtl ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
          {isPassing ? (
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path d="M9 12l2 2 4-4" stroke={duoTitleColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx="12" cy="12" r="10" stroke={duoTitleColor} strokeWidth={2.5} fill="none" />
            </Svg>
          ) : (
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke={duoTitleColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx="12" cy="12" r="10" stroke={duoTitleColor} strokeWidth={2.5} fill="none" />
            </Svg>
          )}
          <AppText style={[lh.feedbackTitle, { color: isDark ? (isPassing ? "#A7F3D0" : "#FECACA") : duoTitleColor, textAlign: rtl ? "right" : "left" }]}>
            {title}
          </AppText>
        </View>
        {subtitle ? (
          <AppText style={[lh.feedbackSub, { color: isDark ? colors.mutedForeground : duoTitleColor, textAlign: rtl ? "right" : "left", marginTop: 4 }]}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 14 }}>
        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [
            lh.duoFeedbackBtn,
            {
              backgroundColor: isDark ? (isPassing ? "#10B981" : "#EF4444") : duoBtnBg,
              borderBottomColor: isDark ? (isPassing ? "#047857" : "#B91C1C") : duoBtnDark,
              transform: [{ translateY: pressed ? 1 : 0 }],
              borderBottomWidth: pressed ? 2 : 4,
            },
          ]}
        >
          <AppText style={lh.duoFeedbackBtnText} forceLatinFont latinRole="bold">
            {(buttonLabel ?? t("common.continue")).toUpperCase()}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

/** A premium spring-animated Pressable wrapper for tactile micro-interactions */
export function SpringPressable({
  children,
  onPress,
  style,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!onPress || disabled) {
    return <View style={style}>{children}</View>;
  }

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") void Haptics.selectionAsync();
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.92, LightMotion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, LightMotion.soft);
        }}
        style={style}
        disabled={disabled}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function useLessonStyles() {
  const { colors, isDark } = useThemeColors();
  return React.useMemo(() => createLessonStyles(colors, isDark), [colors, isDark]);
}

function createLessonStyles(
  colors: ReturnType<typeof useThemeColors>["colors"],
  isDark: boolean,
) {
  return StyleSheet.create({
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  lessonHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lessonHeaderButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
  },
  backdrop: { flex: 1 },
  backdropContent: { flex: 1 },
  progressGlass: { flex: 1 },
  progressGlassInner: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: isDark ? colors.muted : L.track,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    minWidth: 14,
    borderRadius: 7,
    backgroundColor: L.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 2,
  },
  progressKnob: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: L.blue,
  },
  heartsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  heartsText: {
    fontSize: 17,
    fontWeight: "800",
    color: L.red,
    fontFamily: "DINNextRoundedBold",
  },
  headingWrap: { gap: 8, marginBottom: 12 },
  promptCardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  speakerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  promptTextCol: { flex: 1, gap: 4 },
  surfaceCardInner: {
    padding: 18,
  },
  surfaceBare: {
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  duoDialogueWrap: {
    gap: 8,
  },
  duoDialogueLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: Duo.hare,
    fontFamily: "DINNextRoundedBold",
  },
  duoDialogueBubbleWrap: {
    position: "relative",
  },
  duoDialogueBubble: {
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    /*
     * Deliberately no borderBottomWidth: the answer tiles below carry a 4px rim
     * that reads as depth/pressability. Keeping this face flat is what stops the
     * spoken line from looking like one more option.
     */
  },
  duoDialogueSpeaker: {
    marginTop: 2,
  },
  duoDialogueTail: {
    position: "absolute",
    top: 22,
    width: 14,
    height: 14,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  duoDialogueTailLtr: {
    left: -8,
    transform: [{ rotate: "45deg" }],
  },
  duoDialogueTailRtl: {
    right: -8,
    transform: [{ rotate: "225deg" }],
  },
  duoDialogueText: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "600",
    fontFamily: "DINNextRoundedMedium",
  },
  dialogueWrap: {
    marginLeft: 4,
    marginBottom: 6,
  },
  dialogueBubble: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: isDark ? colors.border : Duo.accentBorder,
    overflow: "visible",
    ...crossShadow({
      color: Duo.accent,
      offsetY: 8,
      blur: 20,
      opacity: 0.12,
      elevation: 4,
    }),
  },
  dialogueGradient: {
    borderRadius: 20.5,
    overflow: "hidden",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  dialogueTail: {
    position: "absolute",
    left: 22,
    bottom: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 11,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: isDark ? colors.surfaceRaised : Duo.accentBg,
  },
  dialogueContent: {
    gap: 10,
  },
  dialogueBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Duo.accentBg,
    borderWidth: 1,
    borderColor: Duo.accentBorder,
  },
  dialogueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  dialogueQuoteWrap: {
    marginTop: 2,
    opacity: 0.9,
  },
  questionHeroWrap: {
    position: "relative",
    zIndex: 2,
    borderRadius: 28,
    overflow: "hidden",
    pointerEvents: "none",
    ...crossShadow({
      color: L.blue,
      offsetY: 14,
      blur: 32,
      opacity: 0.28,
      elevation: 8,
    }),
  },
  questionHeroWrapKids: {
    ...crossShadow({
      color: "#E86A00",
      offsetY: 10,
      blur: 24,
      opacity: 0.26,
      elevation: 6,
    }),
    borderWidth: 2,
    borderColor: "rgba(232, 106, 0, 0.55)",
  },
  questionHeroGradient: {
    position: "relative",
    paddingVertical: 22,
    paddingHorizontal: 22,
    borderRadius: 28,
    overflow: "hidden",
  },
  questionHeroOrb: {
    position: "absolute",
    top: -36,
    right: -28,
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: "rgba(91, 141, 239, 0.24)",
  },
  questionHeroOrbKids: {
    position: "absolute",
    top: -32,
    right: -24,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 120, 30, 0.26)",
  },
  questionHeroSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
  },
  questionHeroContent: {
    position: "relative",
    zIndex: 1,
    gap: 10,
  },
  kidsGameHeadingBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F3D5B5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: "#DDA15E",
    marginBottom: 4,
  },
  kidsGameHeadingBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: 0.5,
  },
  questionHeroBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
  },
  questionHeroBadgeKids: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "rgba(194, 65, 12, 0.45)",
  },
  kidsPromptWrap: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(232, 106, 0, 0.5)",
    ...crossShadow({
      color: "#E86A00",
      offsetY: 8,
      blur: 20,
      opacity: 0.22,
      elevation: 5,
    }),
  },
  kidsPromptGradient: {
    position: "relative",
    overflow: "hidden",
  },
  kidsPromptOrb: {
    position: "absolute",
    top: -28,
    right: -20,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 120, 30, 0.22)",
  },
  kidsPromptContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  tileSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 22,
    borderTopLeftRadius: LightRadius.tile,
    borderTopRightRadius: LightRadius.tile,
  },
  checkBtnDisabled: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isDark ? colors.muted : PRIMARY_ACTION.disabledFace,
    borderBottomWidth: 3,
    borderBottomColor: isDark ? colors.border : PRIMARY_ACTION.disabledRim,
  },
  checkLabelDisabled: {
    color: isDark ? colors.mutedForeground : L.grayLight,
  },
  feedbackInner: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 10,
  },
  feedbackAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.4,
  },
  feedbackSub: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.mutedForeground,
    lineHeight: 22,
    fontFamily: "DINNextRoundedMedium",
  },
  optionRowWrap: { width: "100%" },
  tileRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    zIndex: 1,
  },
  tileAnswer: {
    flex: 1,
    textAlign: "left",
    backgroundColor: "transparent",
  },
  tierBadge: {
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    flexShrink: 0,
    backgroundColor: "transparent",
  },
  tile: {
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: LightRadius.tile,
    borderWidth: 2,
    borderBottomWidth: isDark ? 2 : Duo.tileDepth,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tileWide: {
    width: "100%",
    minHeight: 64,
    paddingHorizontal: 20,
  },
  tileWrap: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tileWrapText: {
    alignSelf: "stretch",
    width: "100%",
    textAlign: "center",
    lineHeight: 22,
    fontSize: 16,
    includeFontPadding: false,
    backgroundColor: "transparent",
  },
  slotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    minHeight: 56,
    paddingVertical: 8,
  },
  slot: {
    width: 72,
    height: 48,
    borderRadius: LightRadius.tile,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: isDark ? colors.border : L.slotDash,
    backgroundColor: isDark ? colors.muted : L.bgSoft,
  },
  slotFilled: {
    borderStyle: "solid",
    borderColor: L.blue,
    backgroundColor: isDark ? "rgba(59,130,246,0.18)" : "#EEF2FF",
  },
  hintBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  hintEmoji: { fontSize: 18 },
  hintLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: L.navy,
    fontFamily: "DINNextRoundedBold",
  },
  checkBtn: {
    height: 54,
    borderRadius: LightRadius.btn,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  checkSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 22,
  },
  checkLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.2,
    fontFamily: "DINNextRoundedBold",
    zIndex: 1,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  matchSide: { flex: 1 },
  matchDotCol: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  matchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: L.track,
  },
  matchDotActive: {
    backgroundColor: L.blue,
    transform: [{ scale: 1.2 }],
  },
  matchLine: {
    width: 2,
    height: 28,
    borderRadius: 1,
    backgroundColor: L.track,
  },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 8,
  },
  feedbackMascotCol: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackTextCol: {
    flex: 1,
    gap: 2,
  },
  cloud: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    opacity: 0.7,
  },
  hillsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 0,
  },
  kidsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  kidsCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#A855F7",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  kidsCloseBtnPressed: {
    transform: [{ translateY: 2 }],
  },
  kidsProgressTrack: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#E5E7EB",
    overflow: "visible",
    justifyContent: "center",
  },
  kidsProgressKnobRail: {
    height: "100%",
    minWidth: 16,
    borderRadius: 7,
    backgroundColor: "#58CC02",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  kidsProgressKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#58CC02",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    marginRight: -4,
  },
  kidsHeartsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#1A2B48",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  kidsHeartsText: {
    fontSize: 16,
    color: "#FF4B4B",
    marginTop: -1,
    fontFamily: "DINNextRoundedBold",
    fontWeight: "800",
  },
  kidsFeedbackOuter: {
    borderRadius: 26,
    borderWidth: 3,
    borderBottomWidth: 7,
    padding: 16,
    gap: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  kidsFeedbackCta: {
    height: 52,
    borderRadius: 14,
    borderWidth: 0,
    borderBottomWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  kidsFeedbackCtaText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: 0.3,
  },
  duoFeedbackWrap: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  duoFeedbackBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
  },
  duoFeedbackBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: 1,
  },
  kidsMascotStage: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 190,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  kidsMascotStageStacked: {
    flexDirection: "column",
    alignItems: "center",
    minHeight: 0,
    marginTop: 2,
    marginBottom: 6,
    paddingHorizontal: 0,
    gap: 6,
  },
  kidsMascotArea: {
    width: 160,
    height: 190,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  kidsMascotAreaStacked: {
    justifyContent: "center",
    alignSelf: "center",
  },
  kidsMascotWrap: {
    width: 160,
    height: 180,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  kidsMascotImage: {
    width: "100%",
    height: "100%",
  },
  kidsMascotShadow: {
    position: "absolute",
    bottom: -4,
    width: 86,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.06)",
    zIndex: 1,
  },
  kidsDroplet1: {
    position: "absolute",
    right: 8,
    top: -14,
    transform: [{ rotate: "-15deg" }],
    zIndex: 5,
  },
  kidsDroplet2: {
    position: "absolute",
    right: -4,
    top: -6,
    transform: [{ rotate: "20deg" }],
    zIndex: 5,
  },
  kidsBubble: {
    flex: 1,
    marginLeft: 4,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: isDark ? colors.border : "#BAE6FD",
    borderBottomWidth: 3,
    borderBottomColor: isDark ? colors.muted : "#38BDF8",
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 80,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mascotBubbleWrap: {
    flex: 1,
    position: "relative",
    minWidth: 0,
  },
  mascotBubbleWrapStacked: {
    flex: 0,
    width: "100%",
    alignSelf: "stretch",
  },
  kidsBubbleStacked: {
    width: "100%",
    flex: 0,
    marginLeft: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  kidsBubbleSpeaker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  kidsBubbleTextKu: {
    fontSize: 14,
    color: "#1A2B48",
    textAlign: "left",
    flexShrink: 1,
  },
  kidsBubbleTextEn: {
    fontSize: 17,
    color: "#1A2B48",
    textAlign: "left",
    fontFamily: "DINNextRoundedBold",
    flexShrink: 1,
  },
  kidsBubbleTail: {
    position: "absolute",
    left: -9,
    top: 30,
    width: 14,
    height: 14,
    backgroundColor: colors.surfaceRaised,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: isDark ? colors.border : "#BAE6FD",
    transform: [{ rotate: "45deg" }],
    zIndex: 2,
  },
  kidsBubbleTailTop: {
    position: "absolute",
    top: -9,
    left: "50%",
    marginLeft: -7,
    width: 14,
    height: 14,
    backgroundColor: colors.surfaceRaised,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: isDark ? colors.border : "#BAE6FD",
    transform: [{ rotate: "135deg" }],
    zIndex: 2,
  },
  bubbleTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  kidsBubbleTextCompact: {
    fontSize: 15,
    lineHeight: 21,
  },
  kidsCheckBtnDisabled: {
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY_ACTION.disabledFace,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: PRIMARY_ACTION.disabledRim,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  kidsCheckLabelDisabled: {
    color: PRIMARY_ACTION.disabledText,
    fontSize: 17,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: 0.5,
    textTransform: "none",
  },
  kidsCheckBtnActive: {
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY_ACTION.face,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: PRIMARY_ACTION.rim,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  kidsCheckLabelActive: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: 0.5,
    textTransform: "none",
  },
  normalMascotStage: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 150,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  normalMascotStageStacked: {
    flexDirection: "column",
    alignItems: "center",
    minHeight: 0,
    marginTop: 2,
    marginBottom: 6,
    paddingHorizontal: 0,
    gap: 6,
  },
  normalMascotArea: {
    width: 120,
    height: 150,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  normalMascotAreaStacked: {
    justifyContent: "center",
    alignSelf: "center",
  },
  normalMascotWrap: {
    width: 120,
    height: 130,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  normalMascotShadow: {
    position: "absolute",
    bottom: 2,
    width: 66,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.06)",
    zIndex: 1,
  },
  normalBubble: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: isDark ? colors.surfaceRaised : Duo.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? colors.border : Duo.border,
    borderBottomWidth: 3,
    borderBottomColor: isDark ? colors.muted : Duo.borderDark,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 76,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  normalBubbleStacked: {
    width: "100%",
    flex: 0,
    marginLeft: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  normalBubbleExpanded: {
    minHeight: 116,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  normalBubbleTail: {
    position: "absolute",
    left: -8,
    top: "50%",
    marginTop: -8,
    width: 16,
    height: 16,
    backgroundColor: isDark ? colors.surfaceRaised : Duo.surface,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: isDark ? colors.border : Duo.border,
    transform: [{ rotate: "45deg" }],
    zIndex: 2,
  },
  normalBubbleTailTop: {
    position: "absolute",
    top: -7,
    left: "50%",
    marginLeft: -7,
    width: 14,
    height: 14,
    backgroundColor: colors.surfaceRaised,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.border,
    transform: [{ rotate: "135deg" }],
    zIndex: 2,
  },
  normalBubbleLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  normalBubbleText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.foreground,
    lineHeight: 22,
    flexShrink: 1,
  },
  normalBubbleTextCompact: {
    fontSize: 15,
    lineHeight: 21,
  },
  normalBubbleTextExpanded: {
    fontSize: 14,
    lineHeight: 21,
  },
  normalBubbleSpeaker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? colors.muted : Duo.accentBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  trayHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(0,0,0,0.12)",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  });
}
