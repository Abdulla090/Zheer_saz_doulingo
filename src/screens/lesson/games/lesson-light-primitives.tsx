/**
 * Premium light lesson UI — soft cards, iOS-smooth buttons (no heavy gradients).
 */

import { crossShadow } from "@/utils/shadows";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { L, LightMotion, LightRadius, LightType } from "./lesson-light-design";

export function LightGameHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={lh.headingWrap}>
      <Text style={LightType.title}>{title}</Text>
      <Text style={LightType.subtitle}>{subtitle}</Text>
    </View>
  );
}

export function LightPromptCard({
  kurdish,
  english,
  onSpeak,
}: {
  kurdish: string;
  english: string;
  onSpeak?: () => void;
}) {
  return (
    <View style={lh.promptCard}>
      <Pressable
        onPress={onSpeak}
        style={({ pressed }) => [lh.speakerBtn, pressed && { opacity: 0.85 }]}
        hitSlop={8}
      >
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M11 5L6 9H3v6h3l5 4V5zM15.5 8.5a4 4 0 010 7M18 6a7.5 7.5 0 010 12"
            stroke={L.blue}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      <View style={lh.promptTextCol}>
        <Text style={[LightType.promptKu, { textAlign: "right" }]}>{kurdish}</Text>
        <Text style={LightType.promptEn}>{english}</Text>
      </View>
    </View>
  );
}

type TileState = "idle" | "selected" | "correct" | "wrong" | "ghost";

export function LightWordTile({
  label,
  state = "idle",
  onPress,
  disabled,
  rtl,
}: {
  label: string;
  state?: TileState;
  onPress?: () => void;
  disabled?: boolean;
  rtl?: boolean;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bg =
    state === "correct"
      ? "#E7F9E0"
      : state === "wrong"
        ? "#FFE8E8"
        : state === "selected"
          ? "#E8EFFF"
          : state === "ghost"
            ? "transparent"
            : "#FFFFFF";

  const border =
    state === "correct"
      ? L.green
      : state === "wrong"
        ? L.red
        : state === "selected"
          ? L.blue
          : state === "ghost"
            ? L.slotDash
            : L.border;

  const content = (
    <View
      style={[
        lh.tile,
        {
          backgroundColor: bg,
          borderColor: border,
          borderStyle: state === "ghost" ? "dashed" : "solid",
          opacity: state === "ghost" ? 0.35 : 1,
        },
        state !== "ghost" &&
          crossShadow({
            color: "#0F172A",
            offsetY: 4,
            blur: 10,
            opacity: 0.05,
            elevation: 2,
          }),
      ]}
    >
      <Text
        style={[
          LightType.tile,
          rtl && { writingDirection: "rtl", textAlign: "center" },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  if (!onPress || disabled || state === "ghost") {
    return <Animated.View style={anim}>{content}</Animated.View>;
  }

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") void Haptics.selectionAsync();
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.94, LightMotion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, LightMotion.soft);
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

export function LightHintButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [lh.hintBtn, pressed && { opacity: 0.9 }]}
    >
      <Text style={lh.hintEmoji}>💡</Text>
      <Text style={lh.hintLabel}>Hint</Text>
    </Pressable>
  );
}

export function LightCheckButton({
  label = "CHECK",
  onPress,
  disabled,
  color = L.blue,
}: {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ width: "100%" }, anim]}>
      <Pressable
        onPress={() => {
          if (disabled) return;
          if (Platform.OS !== "web") {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          onPress();
        }}
        disabled={disabled}
        onPressIn={() => {
          if (!disabled) scale.value = withSpring(0.97, LightMotion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, LightMotion.soft);
        }}
        style={[
          lh.checkBtn,
          {
            backgroundColor: disabled ? L.track : color,
          },
          !disabled &&
            crossShadow({
              color: L.blue,
              offsetY: 6,
              blur: 16,
              opacity: 0.28,
              elevation: 5,
            }),
        ]}
      >
        {!disabled && (
          <LinearGradient
            colors={["rgba(255,255,255,0.38)", "rgba(255,255,255,0)"]}
            style={lh.checkSheen}
            pointerEvents="none"
          />
        )}
        <Text style={[lh.checkLabel, disabled && { color: L.grayLight }]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
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
}: {
  progressFillStyle: StyleProp<ViewStyle>;
  hearts: number;
  onBack: () => void;
}) {
  return (
    <View style={lh.lessonHeader}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={({ pressed }) => [lh.backBtn, pressed && { opacity: 0.6 }]}
      >
        <BackChevron />
      </Pressable>
      <View style={lh.progressOuter}>
        <View style={lh.progressTrack}>
          <Animated.View style={[lh.progressFill, progressFillStyle]}>
            <View style={lh.progressKnob} />
          </Animated.View>
        </View>
      </View>
      <View style={lh.heartsPill}>
        <HeartIcon />
        <Text style={lh.heartsText}>{hearts}</Text>
      </View>
    </View>
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
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  progressOuter: { flex: 1 },
  progressTrack: {
    height: 14,
    borderRadius: 7,
    backgroundColor: L.track,
    overflow: "hidden",
    justifyContent: "center",
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
    minWidth: 52,
    justifyContent: "flex-end",
  },
  heartsText: {
    fontSize: 17,
    fontWeight: "800",
    color: L.red,
    fontFamily: "DINNextRoundedBold",
  },
  headingWrap: { gap: 6, marginBottom: 4 },
  promptCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: L.cardTint,
    borderRadius: LightRadius.card,
    borderWidth: 1,
    borderColor: L.cardTintBorder,
    padding: 16,
    ...crossShadow({
      color: "#0F172A",
      offsetY: 6,
      blur: 14,
      opacity: 0.04,
      elevation: 2,
    }),
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
  tile: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: LightRadius.tile,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: LightRadius.btn,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: L.border,
    ...crossShadow({
      color: "#0F172A",
      offsetY: 3,
      blur: 8,
      opacity: 0.04,
      elevation: 1,
    }),
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
});
