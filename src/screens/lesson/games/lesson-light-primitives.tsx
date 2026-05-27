/**
 * Lesson UI — same liquid glass / smooth press feel as the home dashboard.
 */

import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeLiquidPill,
  HomeMeshBackground,
} from "@/components/ui/ios-liquid-home";
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
    <HomeLiquidCard contentStyle={lh.promptCardInner} radius={22}>
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
    </HomeLiquidCard>
  );
}

export type LightTileState = "idle" | "selected" | "correct" | "wrong" | "ghost";

type TileState = LightTileState;

export function LightSurfaceCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <HomeLiquidCard contentStyle={[lh.surfaceCardInner, style]} radius={22}>
      {children}
    </HomeLiquidCard>
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

/** Full-width answer row for multiple choice / conversation */
export function LightOptionRow({
  label,
  state = "idle",
  onPress,
  disabled,
  rtl,
}: {
  label: string;
  state?: LightTileState;
  onPress?: () => void;
  disabled?: boolean;
  rtl?: boolean;
}) {
  return (
    <View style={lh.optionRowWrap}>
      <LightWordTile
        label={label}
        state={state}
        onPress={onPress}
        disabled={disabled}
        rtl={rtl}
        wide
      />
    </View>
  );
}

export function mapOptionState(
  state: "idle" | "selected" | "correct" | "wrong" | "showCorrect",
): LightTileState {
  if (state === "showCorrect") return "correct";
  return state;
}

export function LightWordTile({
  label,
  state = "idle",
  onPress,
  disabled,
  rtl,
  wide,
}: {
  label: string;
  state?: TileState;
  onPress?: () => void;
  disabled?: boolean;
  rtl?: boolean;
  wide?: boolean;
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
        wide && lh.tileWide,
        {
          backgroundColor: bg,
          borderColor: border,
          borderStyle: state === "ghost" ? "dashed" : "solid",
          opacity: state === "ghost" ? 0.35 : 1,
        },
        state !== "ghost" &&
          crossShadow({
            color: "#1A2B48",
            offsetY: 6,
            blur: 14,
            opacity: 0.07,
            elevation: 3,
          }),
      ]}
    >
      {state !== "ghost" && (
        <LinearGradient
          colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0.08)", "rgba(255,255,255,0)"]}
          locations={[0, 0.4, 1]}
          style={lh.tileSheen}
          pointerEvents="none"
        />
      )}
      <Text
        style={[
          LightType.tile,
          rtl && { writingDirection: "rtl", textAlign: "center" },
          { zIndex: 1 },
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
        {showBulb ? <Text style={lh.hintEmoji}>💡</Text> : null}
        <Text style={lh.hintLabel}>{label}</Text>
      </HomeLiquidCard>
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
  if (disabled) {
    return (
      <View style={lh.checkBtnDisabled}>
        <Text style={[lh.checkLabel, { color: L.grayLight }]}>{label}</Text>
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
}: {
  progressFillStyle: StyleProp<ViewStyle>;
  hearts: number;
  onBack: () => void;
}) {
  return (
    <View style={lh.lessonHeader}>
      <HomeLiquidPill onPress={onBack} size={44}>
        <BackChevron />
      </HomeLiquidPill>
      <HomeLiquidCard style={lh.progressGlass} contentStyle={lh.progressGlassInner} radius={14}>
        <View style={lh.progressTrack}>
          <Animated.View style={[lh.progressFill, progressFillStyle]}>
            <View style={lh.progressKnob} />
          </Animated.View>
        </View>
      </HomeLiquidCard>
      <HomeLiquidCard contentStyle={lh.heartsPill} radius={22}>
        <HeartIcon />
        <Text style={lh.heartsText}>{hearts}</Text>
      </HomeLiquidCard>
    </View>
  );
}

/** Bottom feedback — liquid glass card (correct / incorrect) */
export function LessonLiquidFeedback({
  correct,
  title,
  subtitle,
  buttonLabel,
  onContinue,
}: {
  correct: boolean;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onContinue: () => void;
}) {
  const accent = correct ? L.green : L.red;
  return (
    <HomeLiquidCard
      style={{ borderColor: accent, borderWidth: 1.5 }}
      contentStyle={lh.feedbackInner}
      radius={26}
    >
      <View style={[lh.feedbackAccent, { backgroundColor: accent }]} />
      <Text style={[lh.feedbackTitle, { color: correct ? L.greenDeep : L.redDeep }]}>
        {title}
      </Text>
      <Text style={lh.feedbackSub}>{subtitle}</Text>
      <HomeLiquidButton
        label={buttonLabel ?? "CONTINUE"}
        onPress={onContinue}
        color={accent}
        style={{ marginTop: 4 }}
      />
    </HomeLiquidCard>
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
});
