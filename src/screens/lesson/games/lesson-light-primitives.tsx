/* eslint-disable */
/**
 * Lesson UI — same liquid glass / smooth press feel as the home dashboard.
 */

import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeLiquidPill,
  HomeMeshBackground,
} from "../../../components/ui/ios-liquid-home";
import { useI18n } from "../../../hooks/useI18n";
import { crossShadow } from "../../../utils/shadows";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { AppText } from "../../../components/ui/AppText";
import {
  Image,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
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
import { L, LightMotion, LightRadius, LightType } from "./lesson-light-design";
import type { AnswerTier } from "../../../utils/answer-tier";
import { TIER_COLORS } from "../../../utils/answer-tier";
import { LessonUnitLessonChip } from "../components/LessonUnitLessonChip";
import { EmojiSticker } from "../../../components/ui/EmojiSticker";
import { TwinoMascot } from "../../../components/mascot/TwinoMascot";
import { RiveMascot } from "../../../components/mascot/RiveMascot";

export function LightGameHeading({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <View style={lh.headingWrap}>
      {badge ? (
        <View style={lh.kidsGameHeadingBadge}>
          <AppText style={lh.kidsGameHeadingBadgeText} forceLatinFont latinRole="bold">
            {badge.toUpperCase()}
          </AppText>
        </View>
      ) : null}
      <AppText style={LightType.title} forceLatinFont>
        {title}
      </AppText>
      {subtitle ? (
        <AppText style={LightType.subtitle} forceLatinFont latinRole="regular">
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
}: {
  kurdish?: string;
  english?: string;
  onSpeak?: () => void;
  variant?: "default" | "kids";
}) {
  const isKids = variant === "kids";

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
          <AppText style={LightType.promptKu} forceKurdishFont>
            {kurdish}
          </AppText>
        ) : null}
        {english ? (
          <AppText style={LightType.promptEn} forceLatinFont latinRole="medium">
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

  return (
    <HomeLiquidCard contentStyle={lh.promptCardInner} radius={22}>
      {inner}
    </HomeLiquidCard>
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
  return (
    <HomeLiquidCard style={style} contentStyle={[lh.surfaceCardInner, contentStyle]} radius={22}>
      {children}
    </HomeLiquidCard>
  );
}

/** Speech-bubble card for another speaker's line — distinct from question hero and answer tiles */
export function LightDialogueCard({
  label,
  children,
  forceLatinFont = true,
}: {
  label: string;
  children: string;
  forceLatinFont?: boolean;
}) {
  return (
    <View style={lh.dialogueWrap}>
      <View style={lh.dialogueBubble}>
        <LinearGradient
          colors={["#F0F9FF", "#E0F2FE", "#BAE6FD"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={lh.dialogueGradient}
        >
          <View style={lh.dialogueContent}>
            <View style={lh.dialogueBadge}>
              <AppText style={LightType.dialogueBadge} forceKurdishFont>
                {label}
              </AppText>
            </View>
            <View style={lh.dialogueRow}>
              <DialogueQuoteIcon />
              <AppText
                style={LightType.dialogueText}
                forceLatinFont={forceLatinFont}
                latinRole="medium"
              >
                {children}
              </AppText>
            </View>
          </View>
        </LinearGradient>
        <View style={lh.dialogueTail} pointerEvents="none" />
      </View>
    </View>
  );
}

function DialogueQuoteIcon() {
  return (
    <View style={lh.dialogueQuoteWrap}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M7 11c0-2.2 1.4-4 3.5-5.2L9 3C5.1 4.6 3 8 3 12v5h6v-6H7zm10 0c0-2.2 1.4-4 3.5-5.2L19 3c-3.9 1.6-6 5-6 9v5h6v-6h-2z"
          fill="rgba(107, 79, 212, 0.35)"
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
}: {
  children: string;
  label: string;
  forceKurdishFont?: boolean;
  variant?: "default" | "kids";
}) {
  const params = useLocalSearchParams();
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const isKids = variant === "kids" || rawMode === "kids";

  const { speak } = useTTS();

  const floatY = useSharedValue(0);
  const breathe = useSharedValue(1);
  const droplet1Y = useSharedValue(0);
  const droplet2Y = useSharedValue(0);

  useEffect(() => {
    if (!isKids) return;
    floatY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(5, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.99, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
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
  }, [isKids, floatY, breathe, droplet1Y, droplet2Y]);

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
    speak(children, "en");
  };

  if (isKids) {
    return (
      <View style={lh.kidsMascotStage}>
        {/* Mascot with gentle floating animation */}
        <View style={lh.kidsMascotArea}>
          <Animated.View style={[lh.kidsMascotWrap, mascotStyle]}>
            <RiveMascot size={130} pose="wave" />
          </Animated.View>
          <Animated.View style={[lh.kidsMascotShadow, shadowStyle]} />
        </View>

        {/* Speech Bubble */}
        <View style={{ flex: 1, position: "relative" }}>
          <View style={lh.kidsBubble}>
            <View style={lh.kidsBubbleTail} />
            <View style={{ flex: 1 }}>
              <AppText style={lh.kidsBubbleTextEn} forceLatinFont latinRole="bold">
                {children}
              </AppText>
            </View>
            <Pressable onPress={handleSpeak} style={lh.kidsBubbleSpeaker}>
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
    <View style={[lh.questionHeroWrap, isKids && lh.questionHeroWrapKids]}>
      <LinearGradient
        colors={
          isKids
            ? ["#FFF3E0", "#FFD0A8", "#C8E6FF"]
            : ["#152238", "#1E3354", "#2B59F3"]
        }
        locations={isKids ? [0, 0.55, 1] : [0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={lh.questionHeroGradient}
      >
        {isKids ? (
          <View style={lh.questionHeroOrbKids} />
        ) : (
          <View style={lh.questionHeroOrb} />
        )}

        <View style={lh.questionHeroContent}>
          <View style={[lh.questionHeroBadge, isKids && lh.questionHeroBadgeKids]}>
            <AppText
              style={isKids ? LightType.questionHeroBadgeKids : LightType.questionHeroBadge}
              forceLatinFont
            >
              {label}
            </AppText>
          </View>
          <AppText
            style={isKids ? LightType.questionHeroKids : LightType.questionHero}
            forceKurdishFont={forceKurdishFont}
          >
            {children}
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
}

/** Mesh backdrop for lesson + path screens */
export function LessonMeshBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <View style={lh.backdrop}>
      <HomeMeshBackground />
      <View style={lh.backdropContent}>{children}</View>
    </View>
  );
}

export function KidsBottomScene() {
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
}: {
  label: string;
  tierLabel?: string;
  state?: LightTileState;
  onPress?: () => void;
  disabled?: boolean;
  rtl?: boolean;
  forceLatinFont?: boolean;
  isKids?: boolean;
}) {
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
        isKids={isKids}
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
  style,
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
  style?: StyleProp<ViewStyle>;
}) {
  const params = useLocalSearchParams();
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const isKidsRoute = rawMode === "kids" || isKids;

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
    const dividerColor = L.border || "#E2E8F0";
    return {
      bg: [
        "#FFFFFF", // idle
        "#F8FAFC", // pending
        isKidsRoute ? "#7DD3FC" : "#E8EFFF", // selected
        isKidsRoute ? "#BBF7D0" : "#E7F9E0", // correct — vivid green (~85%+ contrast)
        isKidsRoute ? "#FEF2F2" : "#FFE8E8", // wrong
        TIER_COLORS.great.bg,
        TIER_COLORS.good.bg,
        TIER_COLORS.bad.bg,
        TIER_COLORS.terrible.bg,
        "rgba(255, 255, 255, 0)", // ghost
      ],
      border: [
        isKidsRoute ? "#E5E7EB" : dividerColor, // idle
        "#94A3B8", // pending
        isKidsRoute ? "#38BDF8" : L.blue, // selected
        isKidsRoute ? "#16A34A" : L.green, // correct
        isKidsRoute ? "#EF4444" : L.red, // wrong
        TIER_COLORS.great.accent,
        TIER_COLORS.good.accent,
        TIER_COLORS.bad.accent,
        TIER_COLORS.terrible.accent,
        L.slotDash, // ghost
      ]
    };
  }, [isKidsRoute]);

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
          opacity: state === "ghost" ? 0.35 : 1,
          overflow: wrapLabel ? "visible" : "hidden",
        },
        state !== "ghost" &&
          crossShadow({
            color: "#1A2B48",
            offsetY: isKidsRoute ? 8 : 6,
            blur: isKidsRoute ? 16 : 14,
            opacity: isKidsRoute ? 0.1 : 0.07,
            elevation: isKidsRoute ? 4 : 3,
          }),
        style,
      ]}
    >

      {parsedEmoji ? (
        <View style={{ alignItems: "center", gap: 8 }}>
          <EmojiSticker emoji={parsedEmoji} size={36} animateOnMount={false} />
          {cleanText ? (
            <AppText
              style={[
                LightType.tile,
                {
                  color: L.navy,
                  fontSize: 15,
                  fontFamily: "DINNextRoundedBold",
                  textAlign: "center",
                },
              ]}
              forceKurdishFont={rtl && !forceLatinFont}
              forceLatinFont={forceLatinFont || !rtl}
            >
              {cleanText}
            </AppText>
          ) : null}
        </View>
      ) : tierLabel ? (
        <View style={lh.tileRow}>
          <AppText
            style={[LightType.tile, lh.tileAnswer, { zIndex: 1, color: L.navy }, isKidsRoute && { fontFamily: "DINNextRoundedBold" }]}
            forceKurdishFont={rtl && !forceLatinFont}
            forceLatinFont={forceLatinFont || !rtl}
          >
            {label}
          </AppText>
          <AppText
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
        </View>
      ) : (
        <AppText
          style={[
            LightType.tile,
            wrapLabel && lh.tileWrapText,
            centerLabel && { textAlign: "center" as const, alignSelf: "center", width: "100%" },
            {
              zIndex: 1,
              color:
                isKidsRoute && state === "correct"
                  ? "#14532D"
                  : isKidsRoute && state === "wrong"
                    ? "#B91C1C"
                    : isKidsRoute && state === "selected"
                      ? "#0284C7"
                      : state === "selected"
                        ? L.blue
                        : L.navy,
            },
            isKidsRoute && { fontFamily: "DINNextRoundedBold", fontSize: fontSize ?? 16 },
            fontSize !== undefined && !isKidsRoute && { fontSize, lineHeight: fontSize + 8 },
            fontSize !== undefined && isKidsRoute && { lineHeight: fontSize + 8 },
          ]}
          forceKurdishFont={rtl && !forceLatinFont}
          forceLatinFont={forceLatinFont || !rtl}
        >
          {label}
        </AppText>
      )}
    </Animated.View>
  );

  if (!onPress || disabled || state === "ghost") {
    return <Animated.View style={animScale}>{content}</Animated.View>;
  }

  return (
    <Animated.View style={animScale}>
      <Pressable
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
  );
}

export function LightAnswerSlots({
  count,
  filled,
}: {
  count: number;
  filled: number;
}) {
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

function SvgLightbulb({ size = 16, color = "#FF9600" }: { size?: number; color?: string }) {
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
  return (
    <Pressable onPress={onPress}>
      <HomeLiquidCard contentStyle={lh.hintBtn} radius={LightRadius.btn}>
        {showBulb ? <SvgLightbulb size={18} color="#FF9600" /> : null}
        <AppText style={lh.hintLabel} forceKurdishFont>{label}</AppText>
      </HomeLiquidCard>
    </Pressable>
  );
}

export function LightCheckButton({
  label = "CHECK",
  onPress,
  disabled,
  color = L.blue,
  variant,
}: {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  variant?: "default" | "kids";
}) {
  const params = useLocalSearchParams();
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const isKids = variant === "kids" || rawMode === "kids";

  if (isKids) {
    if (disabled) {
      return (
        <View style={lh.kidsCheckBtnDisabled}>
          <AppText style={lh.kidsCheckLabelDisabled} forceLatinFont latinRole="bold">
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
            borderBottomWidth: pressed ? 0 : 5,
            transform: [{ translateY: pressed ? 5 : 0 }],
            marginTop: pressed ? 5 : 0,
          }
        ]}
      >
        <AppText style={lh.kidsCheckLabelActive} forceLatinFont latinRole="bold">
          {label.toLowerCase()}
        </AppText>
      </Pressable>
    );
  }

  if (disabled) {
    return (
      <View style={lh.checkBtnDisabled}>
        <AppText style={[lh.checkLabel, { color: L.grayLight }]} forceKurdishFont>{label}</AppText>
      </View>
    );
  }
  return <HomeLiquidButton label={label} onPress={onPress} color={color} />;
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
}: {
  left: string;
  right: string;
  leftState: TileState;
  rightState: TileState;
  onLeft: () => void;
  onRight: () => void;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
}) {
  return (
    <View style={lh.matchRow}>
      <View style={lh.matchSide}>
        <LightWordTile
          label={left}
          state={leftState}
          onPress={onLeft}
          disabled={leftDisabled}
          rtl
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
}: {
  progressFillStyle: any;
  hearts: number;
  onBack: () => void;
  unitNumber: number;
  lessonNumber: number;
  variant?: "default" | "kids";
}) {
  const { isKu } = useI18n();
  const isKids = variant === "kids";

  if (isKids) {
    return (
      <View style={[lh.kidsHeader, { flexDirection: isKu ? "row-reverse" : "row" }]}>
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
    <View style={[lh.lessonHeader, { flexDirection: isKu ? "row-reverse" : "row" }]}>
      <HomeLiquidPill onPress={onBack} size={44}>
        <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
          <BackChevron />
        </View>
      </HomeLiquidPill>
      <LessonUnitLessonChip
        unitNumber={unitNumber}
        lessonNumber={lessonNumber}
      />
      <HomeLiquidCard style={lh.progressGlass} contentStyle={lh.progressGlassInner} radius={14}>
        <View style={[lh.progressTrack, { flexDirection: isKu ? "row-reverse" : "row" }]}>
          <Animated.View style={[lh.progressFill, progressFillStyle, { flexDirection: isKu ? "row-reverse" : "row" }]}>
            <View style={lh.progressKnob} />
          </Animated.View>
        </View>
      </HomeLiquidCard>
      <HomeLiquidCard contentStyle={[lh.heartsPill, { flexDirection: isKu ? "row-reverse" : "row" }]} radius={22}>
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
}: {
  correct: boolean;
  tier?: AnswerTier;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onContinue: () => void;
  variant?: "default" | "kids";
}) {
  const { t, isKu } = useI18n();
  const isKids = variant === "kids";

  if (isKids) {
    const kidsBg = correct ? "#EAFBE0" : "#FEECEC";
    const kidsBorder = correct ? "#58CC02" : "#EF4444";
    const kidsShadow = correct ? "#3F9302" : "#B91C1C";
    const kidsDeepText = correct ? "#46A302" : "#DC2626";
    const kidsPose = correct ? "happy" : "wave";

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
        <View style={[lh.feedbackRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
          <Animated.View
            entering={ZoomIn.springify().mass(0.45).stiffness(160).damping(12)}
            style={lh.feedbackMascotCol}
          >
            <TwinoMascot size={74} pose={kidsPose} />
          </Animated.View>
          
          <View style={lh.feedbackTextCol}>
            <AppText style={[lh.feedbackTitle, { color: kidsDeepText, textAlign: isKu ? "right" : "left", fontFamily: "DINNextRoundedBold" }]}>
              {title}
            </AppText>
            <AppText style={[lh.feedbackSub, { color: kidsDeepText, opacity: 0.85, textAlign: isKu ? "right" : "left", fontFamily: "DINNextRoundedMedium" }]}>
              {subtitle}
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [
            lh.kidsFeedbackCta,
            {
              backgroundColor: kidsBorder,
              borderBottomColor: kidsShadow,
              borderBottomWidth: pressed ? 2 : 6,
              transform: [{ translateY: pressed ? 4 : 0 }],
            }
          ]}
        >
          <AppText style={lh.kidsFeedbackCtaText} forceLatinFont latinRole="bold">
            {(buttonLabel ?? t("common.continue")).toLowerCase()}
          </AppText>
        </Pressable>
      </View>
    );
  }

  const accent = tier
    ? TIER_COLORS[tier].accent
    : correct
      ? L.green
      : L.red;
  const titleColor = tier
    ? TIER_COLORS[tier].deep
    : correct
      ? L.greenDeep
      : L.redDeep;

  // Decide Pingo pose based on correctness
  const isTierGoodOrGreat = tier === "good" || tier === "great";
  const pose = correct ? (isTierGoodOrGreat ? "wink" : "happy") : "wave";

  return (
    <HomeLiquidCard
      style={{ borderColor: accent, borderWidth: 1.5 }}
      contentStyle={[lh.feedbackInner, { paddingBottom: 16 }]}
      radius={26}
    >
      <View style={[lh.feedbackAccent, { backgroundColor: accent }]} />
      
      <View style={[lh.feedbackRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
        <Animated.View 
          entering={ZoomIn.springify().mass(0.45).stiffness(160).damping(12)}
          style={lh.feedbackMascotCol}
        >
          <TwinoMascot size={74} pose={pose} />
        </Animated.View>
        
        <View style={lh.feedbackTextCol}>
          <AppText style={[lh.feedbackTitle, { color: titleColor, textAlign: isKu ? "right" : "left" }]}>
            {title}
          </AppText>
          <AppText style={[lh.feedbackSub, { textAlign: isKu ? "right" : "left" }]}>
            {subtitle}
          </AppText>
        </View>
      </View>

      <HomeLiquidButton
        label={buttonLabel ?? t("common.continue")}
        onPress={onContinue}
        color={accent}
        style={{ marginTop: 8 }}
      />
    </HomeLiquidCard>
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

const lh = StyleSheet.create({
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
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
    backgroundColor: L.track,
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
  headingWrap: { gap: 6, marginBottom: 4 },
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: L.cardTintBorder,
  },
  promptTextCol: { flex: 1, gap: 4 },
  surfaceCardInner: {
    padding: 18,
  },
  dialogueWrap: {
    marginLeft: 4,
    marginBottom: 6,
  },
  dialogueBubble: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#D4C4F5",
    overflow: "visible",
    ...crossShadow({
      color: "#6B4FD4",
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
    borderTopColor: "#E8DEFF",
  },
  dialogueContent: {
    gap: 10,
  },
  dialogueBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(107, 79, 212, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(107, 79, 212, 0.2)",
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
    color: "#B05A1D",
    fontSize: 14,
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
    borderRadius: LightRadius.btn,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: L.track,
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
    color: L.gray,
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
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: LightRadius.tile,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tileWide: {
    width: "100%",
    minHeight: 54,
    paddingHorizontal: 18,
  },
  tileWrap: {
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
  },
  slotFilled: {
    borderStyle: "solid",
    borderColor: L.blue,
    backgroundColor: "#EEF2FF",
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
    width: 74,
    height: 74,
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
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 5,
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
  kidsMascotStage: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 160,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  kidsMascotArea: {
    width: 130,
    height: 160,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  kidsMascotWrap: {
    width: 130,
    height: 150,
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
    width: 70,
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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#E9D5FF",
    borderBottomWidth: 4,
    borderBottomColor: "#C084FC",
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 80,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  },
  kidsBubbleTextEn: {
    fontSize: 17,
    color: "#1A2B48",
    textAlign: "left",
    fontFamily: "DINNextRoundedBold",
  },
  kidsBubbleTail: {
    position: "absolute",
    left: -9,
    top: 30,
    width: 14,
    height: 14,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#E9D5FF",
    transform: [{ rotate: "45deg" }],
    zIndex: 2,
  },
  kidsCheckBtnDisabled: {
    height: 56,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  kidsCheckLabelDisabled: {
    color: "#9CA3AF",
    fontSize: 17,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: 0.5,
    textTransform: "none",
  },
  kidsCheckBtnActive: {
    height: 56,
    borderRadius: 24,
    backgroundColor: "#58CC02",
    borderWidth: 0,
    borderBottomWidth: 5,
    borderBottomColor: "#58A700",
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
});
