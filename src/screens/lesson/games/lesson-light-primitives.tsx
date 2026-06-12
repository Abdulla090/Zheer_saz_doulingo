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
import React from "react";
import { AppText } from "../../../components/ui/AppText";
import {
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
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { L, LightMotion, LightRadius, LightType } from "./lesson-light-design";
import type { AnswerTier } from "../../../utils/answer-tier";
import { TIER_COLORS } from "../../../utils/answer-tier";
import { LessonUnitLessonChip } from "../components/LessonUnitLessonChip";
import { EmojiSticker } from "../../../components/ui/EmojiSticker";

export function LightGameHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={lh.headingWrap}>
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
      <Pressable
        onPress={onSpeak}
        style={({ pressed }) => [lh.speakerBtn, pressed && { opacity: 0.85 }]}
        hitSlop={8}
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
      </Pressable>
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
  const isKids = variant === "kids";

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
        <LinearGradient
          colors={
            isKids
              ? ["rgba(255,255,255,0.55)", "rgba(255,255,255,0.12)", "rgba(255,255,255,0)"]
              : ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.04)", "rgba(255,255,255,0)"]
          }
          locations={[0, 0.45, 1]}
          style={lh.questionHeroSheen}
          pointerEvents="none"
        />
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

/** Full-width answer row for multiple choice / conversation */
export function LightOptionRow({
  label,
  tierLabel,
  state = "idle",
  onPress,
  disabled,
  rtl,
  forceLatinFont,
}: {
  label: string;
  tierLabel?: string;
  state?: LightTileState;
  onPress?: () => void;
  disabled?: boolean;
  rtl?: boolean;
  forceLatinFont?: boolean;
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
        wide
      />
    </View>
  );
}

export function mapOptionState(
  state: "idle" | "pending" | "selected" | "correct" | "wrong" | AnswerTier,
): LightTileState {
  if (state === "selected") return "pending";
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
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bg =
    state === "great"
      ? TIER_COLORS.great.bg
      : state === "good"
        ? TIER_COLORS.good.bg
        : state === "bad"
          ? TIER_COLORS.bad.bg
          : state === "terrible"
            ? TIER_COLORS.terrible.bg
            : state === "correct"
              ? isKids ? "#F0FDF4" : "#E7F9E0"
              : state === "wrong"
                ? isKids ? "#FEF2F2" : "#FFE8E8"
                : state === "pending"
                  ? "#F8FAFC"
                  : state === "selected"
                    ? isKids ? "#EFF6FF" : "#E8EFFF"
                    : state === "ghost"
                      ? "transparent"
                      : "#FFFFFF";

  const border =
    state === "great"
      ? TIER_COLORS.great.accent
      : state === "good"
        ? TIER_COLORS.good.accent
        : state === "bad"
          ? TIER_COLORS.bad.accent
          : state === "terrible"
            ? TIER_COLORS.terrible.accent
            : state === "correct"
              ? L.green
              : state === "wrong"
                ? L.red
                : state === "pending"
                  ? "#94A3B8"
                  : state === "selected"
                    ? L.blue
                    : state === "ghost"
                      ? L.slotDash
                      : isKids ? "#E2E8F0" : L.border;

  const { emoji: parsedEmoji, cleanText } = isKids
    ? extractEmoji(label)
    : { emoji: null, cleanText: label };

  const content = (
    <View
      style={[
        lh.tile,
        wide && lh.tileWide,
        wrapLabel && lh.tileWrap,
        isKids && {
          borderRadius: 24,
          borderWidth: 2.5,
          paddingVertical: parsedEmoji ? 14 : 16,
        },
        {
          backgroundColor: bg,
          borderColor: border,
          borderStyle: state === "ghost" ? "dashed" : "solid",
          opacity: state === "ghost" ? 0.35 : 1,
          overflow: wrapLabel ? "visible" : "hidden",
        },
        state !== "ghost" &&
          crossShadow({
            color: "#1A2B48",
            offsetY: isKids ? 8 : 6,
            blur: isKids ? 16 : 14,
            opacity: isKids ? 0.1 : 0.07,
            elevation: isKids ? 4 : 3,
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
            style={[LightType.tile, lh.tileAnswer, { zIndex: 1, color: L.navy }, isKids && { fontFamily: "DINNextRoundedBold" }]}
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
            { zIndex: 1, color: L.navy },
            isKids && { fontFamily: "DINNextRoundedBold", fontSize: 16 },
          ]}
          forceKurdishFont={rtl && !forceLatinFont}
          forceLatinFont={forceLatinFont || !rtl}
        >
          {label}
        </AppText>
      )}
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
}: {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
}) {
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
}: {
  progressFillStyle: any;
  hearts: number;
  onBack: () => void;
  unitNumber: number;
  lessonNumber: number;
}) {
  const { isKu } = useI18n();
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
}: {
  correct: boolean;
  tier?: AnswerTier;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onContinue: () => void;
}) {
  const { t } = useI18n();
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
  return (
    <HomeLiquidCard
      style={{ borderColor: accent, borderWidth: 1.5 }}
      contentStyle={lh.feedbackInner}
      radius={26}
    >
      <View style={[lh.feedbackAccent, { backgroundColor: accent }]} />
      <AppText style={[lh.feedbackTitle, { color: titleColor }]}>
        {title}
      </AppText>
      <AppText style={lh.feedbackSub}>{subtitle}</AppText>
      <HomeLiquidButton
        label={buttonLabel ?? t("common.continue")}
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
    backgroundColor: "rgba(91, 141, 239, 0.35)",
  },
  questionHeroOrbKids: {
    position: "absolute",
    top: -32,
    right: -24,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 120, 30, 0.48)",
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
    backgroundColor: "rgba(255, 120, 30, 0.44)",
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
});
