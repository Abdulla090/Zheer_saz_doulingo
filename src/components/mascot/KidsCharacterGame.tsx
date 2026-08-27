/**
 * KidsCharacterGame — native re-creation of the Rive kids game UI.
 *
 * Drop-in replacement for <KidsRiveGame />: identical props, but renders the
 * app's own React Native UI (mascot + speech bubble + animated option cards +
 * check button) so lesson content is fully data-driven instead of baked into
 * the .riv file. No Rive UI is shown.
 */

import React, { useEffect } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "../ui/AppText";
import { PRIMARY_ACTION } from "../../constants/primary-action";

 
const MASCOT = require("../../../assets/images/characters/kids-rhino-mascot.png");

const C = {
  skyGradStart: "#E0F2FE",
  skyGradEnd: "#BAE6FD",
  navy: "#1A2B48",
  navySoft: "#3D4F6F",
  bubble: "#FFFFFF",
  bubbleBorder: "#8C52FF",
  bubbleShadow: "#6D28D9",
  card: "#FFFFFF",
  cardBorder: "#E2E8F0",
  cardShadow: "#CDD7E2",
  cardSelected: "#EFF6FF",
  cardSelectedBorder: "#3B82F6",
  cardSelectedShadow: "#1D4ED8",
  green: "#22C55E",
  greenDeep: "#15803D",
  greenShadow: "#15803D",
  greenBg: "#F0FDF4",
  red: "#EF4444",
  redDeep: "#B91C1C",
  redShadow: "#B91C1C",
  redBg: "#FEF2F2",
  track: "#F3F4F6",
  white: "#FFFFFF",
} as const;

export interface KidsCharacterGameProps {
  correct: boolean | null;
  selectedOptionIndex: number | null;
  progress: number; // 0..100
  prompt?: string;
  options?: string[];
  onSelectOption?: (index: number) => void;
  onSubmit?: () => void;
  title?: string;
  
  // Custom header props
  hearts?: number;
  onBack?: () => void;
  exerciseIndex?: number;
  totalExercises?: number;
  hideHeader?: boolean;
}

function CloseXIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="#FFFFFF"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeartIcon() {
  return (
    <Svg width={18} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#FF4B4B"
      />
    </Svg>
  );
}

function GrassHills() {
  return (
    <View style={styles.hillsContainer} pointerEvents="none">
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
          fill="#8C52FF"
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

function BackgroundClouds() {
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

function OptionCard({
  label,
  index,
  state,
  disabled,
  onPress,
}: {
  label: string;
  index: number;
  state: "idle" | "selected" | "correct" | "wrong";
  disabled: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (state === "selected" || state === "correct" || state === "wrong") {
      translateY.value = withSpring(2, { damping: 12 });
      if (state === "correct") {
        scale.value = withSequence(
          withSpring(1.05, { damping: 6, stiffness: 220 }),
          withSpring(1, { damping: 12 }),
        );
      } else if (state === "wrong") {
        shake.value = withSequence(
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-6, { duration: 50 }),
          withTiming(6, { duration: 50 }),
          withTiming(0, { duration: 50 }),
        );
      }
    } else {
      translateY.value = withSpring(0, { damping: 12 });
    }
  }, [state, translateY, scale, shake]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }, { translateX: shake.value }],
  }));

  const palette =
    state === "correct"
      ? { bg: C.greenBg, border: C.green, bottom: C.greenShadow, text: C.greenDeep }
      : state === "wrong"
        ? { bg: C.redBg, border: C.red, bottom: C.redShadow, text: C.redDeep }
        : state === "selected"
          ? { bg: C.cardSelected, border: C.cardSelectedBorder, bottom: C.cardSelectedShadow, text: C.navy }
          : { bg: C.card, border: C.cardBorder, bottom: C.cardShadow, text: C.navy };

  return (
    <Animated.View entering={FadeIn.delay(index * 70).duration(280)} style={animStyle}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          if (!disabled) {
            scale.value = withSpring(0.97, { damping: 12 });
            translateY.value = withSpring(4, { damping: 12 });
          }
        }}
        onPressOut={() => {
          if (!disabled) {
            scale.value = withSpring(1, { damping: 12 });
            translateY.value = withSpring(state === "selected" ? 2 : 0, { damping: 12 });
          }
        }}
        style={[
          styles.option,
          {
            backgroundColor: palette.bg,
            borderColor: palette.border,
            borderBottomColor: palette.bottom,
            borderBottomWidth: state === "selected" || state === "correct" || state === "wrong" ? 4 : 6,
          },
        ]}
      >
        <AppText style={[styles.optionText, { color: palette.text }]} forceLatinFont latinRole="bold">
          {label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

export function KidsCharacterGame({
  correct,
  selectedOptionIndex,
  progress,
  prompt,
  options = [],
  onSelectOption,
  onSubmit,
  title,
  hearts = 5,
  onBack,
  exerciseIndex = 1,
  totalExercises = 5,
  hideHeader = false,
}: KidsCharacterGameProps) {
  const insets = useSafeAreaInsets();
  const revealed = correct !== null;

  // Mascot idle breathing / float
  const floatY = useSharedValue(0);
  const breathe = useSharedValue(1);
  const droplet1Y = useSharedValue(0);
  const droplet2Y = useSharedValue(0);

  useEffect(() => {
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
  }, [floatY, breathe, droplet1Y, droplet2Y]);

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

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0, Math.min(100, progress))}%`,
  }));

  const btnTranslateY = useSharedValue(0);
  const canSubmit = selectedOptionIndex !== null;

  useEffect(() => {
    if (!revealed && !canSubmit) {
      btnTranslateY.value = withSpring(3, { damping: 12 });
    } else {
      btnTranslateY.value = withSpring(0, { damping: 12 });
    }
  }, [revealed, canSubmit, btnTranslateY]);

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: btnTranslateY.value }],
  }));

  const optionState = (index: number): "idle" | "selected" | "correct" | "wrong" => {
    if (revealed) {
      if (index === selectedOptionIndex) return correct ? "correct" : "wrong";
      return "idle";
    }
    return index === selectedOptionIndex ? "selected" : "idle";
  };

  const buttonLabel = revealed ? "continue" : "check";

  const contentLayout = (
    <View
      style={[
        styles.content,
        {
          paddingTop: hideHeader ? 8 : Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      {/* Custom Header */}
      {!hideHeader && (
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && styles.closeBtnPressed,
            ]}
          >
            <CloseXIcon />
          </Pressable>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <View style={styles.heartsBadge}>
            <HeartIcon />
            <AppText style={styles.heartsText} forceLatinFont latinRole="bold">
              {hearts}
            </AppText>
          </View>
        </View>
      )}

      {/* Exercise Badge & Title */}
      <View style={styles.badgeRow}>
        <View style={styles.exerciseBadge}>
          <AppText style={styles.exerciseText} forceLatinFont latinRole="bold">
            {`EXERCISE ${exerciseIndex} OF ${totalExercises}`}
          </AppText>
        </View>
        <AppText style={styles.headingTitle} forceLatinFont latinRole="bold">
          {title ?? "Fill in the blanks"}
        </AppText>
      </View>

      {/* Character + speech bubble */}
      <View style={styles.stage}>
        {/* Mascot Area */}
        <View style={styles.mascotArea}>
          <Animated.View style={[styles.mascotWrap, mascotStyle]}>
            <Image source={MASCOT} style={styles.mascot} resizeMode="contain" />
          </Animated.View>
        </View>

        {/* Speech Bubble Container with Droplets */}
        <View style={{ flex: 1, position: "relative" }}>
          <Animated.View style={[styles.droplet1, droplet1Style]}>
            <Svg width={12} height={16} viewBox="0 0 14 20" fill="none">
              <Path
                d="M7,0 C7,0 0,8 0,13 C0,16.8 3.1,20 7,20 C10.9,20 14,16.8 14,13 C14,8 7,0 7,0 Z"
                fill="#8C52FF"
              />
            </Svg>
          </Animated.View>
          <Animated.View style={[styles.droplet2, droplet2Style]}>
            <Svg width={9} height={12} viewBox="0 0 14 20" fill="none">
              <Path
                d="M7,0 C7,0 0,8 0,13 C0,16.8 3.1,20 7,20 C10.9,20 14,16.8 14,13 C14,8 7,0 7,0 Z"
                fill="#8C52FF"
              />
            </Svg>
          </Animated.View>

          <View style={styles.bubble}>
            <AppText style={styles.bubbleText} forceLatinFont latinRole="bold">
              {prompt ?? ""}
            </AppText>
            <View style={styles.bubbleTail} />
          </View>
        </View>
      </View>

      {/* Options */}
      <View style={styles.options}>
        {options.map((label, i) => (
          <OptionCard
            key={`${i}-${label}`}
            label={label}
            index={i}
            state={optionState(i)}
            disabled={revealed}
            onPress={() => onSelectOption?.(i)}
          />
        ))}
      </View>

      {/* Check / Continue */}
      <Animated.View style={btnAnimStyle}>
        <Pressable
          disabled={!revealed && !canSubmit}
          onPress={() => {
            if (!revealed && !canSubmit) return;
            onSubmit?.();
          }}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor:
                !revealed && !canSubmit
                  ? PRIMARY_ACTION.disabledFace
                  : PRIMARY_ACTION.face,
              borderBottomColor:
                !revealed && !canSubmit
                  ? PRIMARY_ACTION.disabledRim
                  : PRIMARY_ACTION.rim,
              borderBottomWidth: 3,
              transform: [{ translateY: pressed ? 1 : 0 }],
            },
          ]}
        >
          <AppText
            style={[
              styles.ctaText,
              {
                color:
                  !revealed && !canSubmit
                    ? PRIMARY_ACTION.disabledText
                    : C.white,
              },
            ]}
            forceLatinFont
            latinRole="bold"
          >
            {buttonLabel.toLowerCase()}
          </AppText>
        </Pressable>
      </Animated.View>
    </View>
  );

  if (hideHeader) {
    return <View style={styles.root}>{contentLayout}</View>;
  }

  return (
    <LinearGradient colors={[C.skyGradStart, C.skyGradEnd]} style={styles.root}>
      <BackgroundClouds />
      <GrassHills />
      {contentLayout}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bubbleBorder,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.bubbleShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  closeBtnPressed: {
    transform: [{ translateY: 2 }],
  },
  progressTrack: {
    flex: 1,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: C.green,
  },
  heartsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  heartsText: {
    fontSize: 16,
    color: "#FF4B4B",
    marginTop: -1,
  },
  badgeRow: {
    alignItems: "flex-start",
    marginTop: 12,
    marginBottom: 6,
    gap: 6,
  },
  exerciseBadge: {
    backgroundColor: "#DEAC80",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exerciseText: {
    fontSize: 10,
    color: "#78350F",
    letterSpacing: 0.5,
  },
  headingTitle: {
    fontSize: 22,
    color: C.navy,
  },
  stage: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 160,
    marginBottom: 8,
  },
  mascotArea: {
    width: 120,
    height: 160,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  mascotWrap: {
    width: 120,
    height: 150,
    zIndex: 2,
  },
  mascot: {
    width: "100%",
    height: "100%",
  },
  droplet1: {
    position: "absolute",
    right: 8,
    top: -14,
    transform: [{ rotate: "-15deg" }],
    zIndex: 5,
  },
  droplet2: {
    position: "absolute",
    right: -4,
    top: -6,
    transform: [{ rotate: "20deg" }],
    zIndex: 5,
  },
  bubble: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: C.bubble,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: C.bubbleBorder,
    borderBottomWidth: 7,
    borderBottomColor: C.bubbleShadow,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 88,
    justifyContent: "center",
    position: "relative",
  },
  bubbleTail: {
    position: "absolute",
    left: -10,
    top: 36,
    width: 15,
    height: 15,
    backgroundColor: C.bubble,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: C.bubbleBorder,
    transform: [{ rotate: "45deg" }],
    zIndex: 2,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
    color: C.navy,
  },
  options: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  option: {
    height: 56,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  cta: {
    height: 52,
    borderRadius: 14,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 17,
    letterSpacing: 0.3,
  },
  hillsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 0,
  },
  cloud: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    opacity: 0.7,
  },
});

export default KidsCharacterGame;
