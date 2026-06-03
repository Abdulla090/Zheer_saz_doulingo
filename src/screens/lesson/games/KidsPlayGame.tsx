/**
 * KidsPlayGame — contextual kids mechanics (scene, bubbles, feed, shadow, etc.)
 */

import { AppText } from "@/components/ui/AppText";
import { HomeLiquidButton, HomeLiquidCard } from "@/components/ui/ios-liquid-home";
import { KidsPlayQuestion } from "@/data/lesson-content";
import type { LessonPathMode } from "@/data/lesson-content";
import { KidsSceneKey } from "@/data/kids-games";
import { useI18n } from "@/hooks/useI18n";
import { useTTS } from "@/hooks/use-tts";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { GameHeader, GameRoot } from "./GameAnimatedShell";
import { L, LightRadius } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightPromptCard,
  LightWordTile,
} from "./lesson-light-primitives";

type Props = {
  question: KidsPlayQuestion;
  onAnswer: (correct: boolean) => void;
  pathMode?: LessonPathMode;
};

const SCENE_GRADIENTS: Record<
  KidsSceneKey,
  readonly [string, string, string]
> = {
  bedroom: ["#FFE8D6", "#FFD6E8", "#E8F4FF"],
  kitchen: ["#FFF4E0", "#FFE8C8", "#FFF0DB"],
  playground: ["#D8F5E4", "#B8EBD4", "#E8FFF4"],
  closet: ["#EDE4FF", "#E0D4F8", "#F5EEFF"],
  yard: ["#DFF5D0", "#C8EBB8", "#F0FFE8"],
  art: ["#FFE0F0", "#E0E8FF", "#FFF8D0"],
  backyard: ["#D4F0C8", "#B8E8A8", "#E8FFD8"],
  living: ["#F5EDE4", "#EDE0D4", "#FFF8F0"],
  street: ["#D8E8F8", "#C0D8F0", "#E8F0FF"],
  night: ["#2A2848", "#3D3560", "#1E1C38"],
};

function variantHeading(
  variant: KidsPlayQuestion["variant"],
  t: ReturnType<typeof useI18n>["t"],
) {
  switch (variant) {
    case "scene":
      return { title: t("lessons.kidsScene"), subtitle: t("lessons.kidsSceneSub") };
    case "bubble":
      return { title: t("lessons.kidsBubble"), subtitle: t("lessons.kidsBubbleSub") };
    case "feed":
      return { title: t("lessons.kidsFeed"), subtitle: t("lessons.kidsFeedSub") };
    case "shadow":
      return { title: t("lessons.kidsShadow"), subtitle: t("lessons.kidsShadowSub") };
    case "pick":
      return { title: t("lessons.kidsPick"), subtitle: t("lessons.kidsPickSub") };
    case "yes_no":
      return { title: t("lessons.kidsTrick"), subtitle: t("lessons.kidsTrickSub") };
    case "treasure":
      return { title: t("lessons.kidsTreasure"), subtitle: t("lessons.kidsTreasureSub") };
    default:
      return { title: t("lessons.kidsPick"), subtitle: t("lessons.kidsPickSub") };
  }
}

function FloatingBubble({
  emoji,
  label,
  index,
  onPop,
  disabled,
}: {
  emoji: string;
  label: string;
  index: number;
  onPop: () => void;
  disabled: boolean;
}) {
  const drift = useSharedValue(0);
  useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1400 + index * 120, easing: Easing.inOut(Easing.sin) }),
        withTiming(10, { duration: 1400 + index * 120, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [drift, index]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: drift.value }],
  }));

  return (
    <Animated.View style={[style, kb.bubbleWrap]} entering={FadeInDown.delay(index * 80).duration(320)}>
      <Pressable
        onPress={() => {
          if (disabled) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPop();
        }}
        style={({ pressed }) => [kb.bubble, pressed && { transform: [{ scale: 0.94 }] }]}
      >
        <AppText style={kb.bubbleEmoji}>{emoji}</AppText>
        <AppText style={kb.bubbleLabel} forceLatinFont latinRole="bold">
          {label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

export default function KidsPlayGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const { speak } = useTTS();
  const firedRef = useRef(false);
  const heading = variantHeading(question.variant, t);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [treasureOpen, setTreasureOpen] = useState(false);
  const [shadowPicks, setShadowPicks] = useState<Record<string, string>>({});
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const isKu = question.promptLang === "ku";
  const sceneColors = question.scene ? SCENE_GRADIENTS[question.scene] : SCENE_GRADIENTS.bedroom;
  const isNight = question.scene === "night";

  const speakPrompt = useCallback(() => {
    speak(question.prompt, isKu ? "ku" : "en");
  }, [isKu, question.prompt, speak]);

  useEffect(() => {
    const id = setTimeout(speakPrompt, 400);
    return () => clearTimeout(id);
  }, [question.prompt, speakPrompt]);

  const finish = (correct: boolean) => {
    if (firedRef.current) return;
    firedRef.current = true;
    setRevealed(true);
    onAnswer(correct);
  };

  const pickChoice = (id: string) => {
    if (revealed) return;
    if (question.variant === "feed") {
      setSelectedId(id);
      return;
    }
    const correct = id === question.correctId;
    finish(correct);
  };

  const feedToMascot = () => {
    if (!selectedId || revealed) return;
    finish(selectedId === question.correctId);
  };

  const slots = useMemo(
    () => question.shadowSlotIds ?? [],
    [question.shadowSlotIds],
  );
  const shadowDone = useMemo(
    () => slots.length > 0 && slots.every((slotId) => shadowPicks[slotId] === slotId),
    [shadowPicks, slots],
  );

  useEffect(() => {
    if (question.variant !== "shadow" || !shadowDone || revealed || firedRef.current) {
      return;
    }
    firedRef.current = true;
    setRevealed(true);
    onAnswer(true);
  }, [question.variant, shadowDone, revealed, onAnswer]);

  const onShadowSlot = (slotId: string) => {
    if (!activeChip || revealed) return;
    if (activeChip !== slotId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setShadowPicks((prev) => ({ ...prev, [slotId]: activeChip }));
    setActiveChip(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onYesNo = (pick: "yes" | "no") => {
    if (revealed) return;
    finish(pick === question.correctId);
  };

  const openChest = () => {
    if (treasureOpen) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTreasureOpen(true);
  };

  const renderChoicesGrid = (floating?: boolean) => (
    <View style={[kb.grid, floating && kb.bubbleRow]}>
      {question.choices.map((c, i) =>
        floating ? (
          <FloatingBubble
            key={c.id}
            emoji={c.emoji}
            label={c.label}
            index={i}
            disabled={revealed}
            onPop={() => pickChoice(c.id)}
          />
        ) : (
          <Animated.View key={c.id} entering={FadeIn.delay(i * 60).duration(280)} style={kb.gridItem}>
            <LightWordTile
              label={`${c.emoji}\n${c.label}`}
              state={
                revealed
                  ? c.id === question.correctId
                    ? "correct"
                    : c.id === selectedId
                      ? "wrong"
                      : "idle"
                  : selectedId === c.id
                    ? "selected"
                    : "idle"
              }
              onPress={() => pickChoice(c.id)}
              disabled={revealed}
              wide
              wrapLabel
            />
          </Animated.View>
        ),
      )}
    </View>
  );

  return (
    <GameRoot style={kb.root}>
      <GameHeader>
        <LightGameHeading title={heading.title} subtitle={heading.subtitle} />
      </GameHeader>

      <LightPromptCard
        kurdish={isKu ? question.prompt : question.prompt}
        english={!isKu ? undefined : question.prompt}
        onSpeak={speakPrompt}
        variant={pathMode === "kids" ? "kids" : "default"}
      />

      {question.variant === "scene" && question.scene ? (
        <LinearGradient colors={[...sceneColors]} style={kb.scene}>
          <AppText style={[kb.sceneLabel, isNight && kb.sceneLabelNight]} forceLatinFont>
            {question.scene.charAt(0).toUpperCase() + question.scene.slice(1)}
          </AppText>
          <View style={kb.sceneObjects}>{renderChoicesGrid()}</View>
        </LinearGradient>
      ) : null}

      {question.variant === "bubble" ? (
        <View style={kb.bubbleArea}>{renderChoicesGrid(true)}</View>
      ) : null}

      {question.variant === "feed" ? (
        <View style={kb.feedArea}>
          {renderChoicesGrid()}
          <Pressable
            onPress={feedToMascot}
            style={({ pressed }) => [kb.mascotZone, pressed && { opacity: 0.9 }]}
          >
            <HomeLiquidCard contentStyle={kb.mascotCard} radius={28}>
              <AppText style={kb.mascotEmoji}>{question.mascotEmoji ?? "🦉"}</AppText>
              <AppText style={kb.mascotHint} forceLatinFont latinRole="bold">
                {selectedId ? "Tap here to give it!" : "Pick an item first"}
              </AppText>
            </HomeLiquidCard>
          </Pressable>
        </View>
      ) : null}

      {question.variant === "shadow" ? (
        <View style={kb.shadowArea}>
          <View style={kb.chipRow}>
            {question.choices.map((c) => {
              const used = Object.values(shadowPicks).includes(c.id);
              return (
                <LightWordTile
                  key={c.id}
                  label={`${c.emoji} ${c.label}`}
                  state={activeChip === c.id ? "selected" : used ? "correct" : "idle"}
                  onPress={() => !used && !revealed && setActiveChip(c.id)}
                  disabled={used || revealed}
                  wide
                />
              );
            })}
          </View>
          <View style={kb.slotRow}>
            {slots.map((slotId) => {
              const chip = question.choices.find((c) => c.id === slotId);
              const placed = shadowPicks[slotId];
              const placedChip = question.choices.find((c) => c.id === placed);
              return (
                <Pressable
                  key={slotId}
                  onPress={() => onShadowSlot(slotId)}
                  style={kb.slot}
                >
                  <AppText style={kb.slotEmoji}>
                    {placedChip ? placedChip.emoji : chip?.emoji ?? "⬜"}
                  </AppText>
                  <AppText
                    style={[kb.slotLabel, !placedChip && kb.slotGhost]}
                    forceLatinFont
                  >
                    {placedChip ? placedChip.label : "?"}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {question.variant === "pick" ? (
        <View style={kb.pickArea}>{renderChoicesGrid()}</View>
      ) : null}

      {question.variant === "yes_no" ? (
        <View style={kb.trickArea}>
          <HomeLiquidCard contentStyle={kb.trickCard} radius={24}>
            <AppText style={kb.trickEmoji}>{question.shownEmoji}</AppText>
            <AppText style={kb.trickLabel} forceLatinFont latinRole="bold">
              {question.shownLabel}
            </AppText>
            <AppText style={kb.trickSays} forceLatinFont>
              Mascot says: &quot;{question.spokenWord}&quot;
            </AppText>
          </HomeLiquidCard>
          <View style={kb.trickBtns}>
            <HomeLiquidButton
              label="✓  Match!"
              color={L.green}
              onPress={() => onYesNo("yes")}
            />
            <HomeLiquidButton
              label="✗  Trick!"
              color={L.red}
              onPress={() => onYesNo("no")}
            />
          </View>
        </View>
      ) : null}

      {question.variant === "treasure" ? (
        <View style={kb.treasureArea}>
          <Pressable onPress={openChest} style={kb.chestWrap}>
            <AppText style={kb.chestEmoji}>{treasureOpen ? "🎁" : "🧳"}</AppText>
            {!treasureOpen ? (
              <AppText style={kb.chestHint} forceLatinFont latinRole="bold">
                Tap the chest!
              </AppText>
            ) : (
              <Animated.View entering={FadeIn.duration(300)} style={kb.revealWrap}>
                <AppText style={kb.revealEmoji}>{question.treasureRevealEmoji}</AppText>
                <AppText style={kb.revealLabel} forceLatinFont latinRole="bold">
                  {question.treasureRevealLabel}
                </AppText>
              </Animated.View>
            )}
          </Pressable>
          {treasureOpen ? (
            <View style={kb.treasureOpts}>
              {question.choices.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => pickChoice(c.id)}
                  style={({ pressed }) => [kb.audioOpt, pressed && { opacity: 0.85 }]}
                >
                  <AppText style={kb.audioEmoji}>{c.emoji}</AppText>
                  <AppText style={kb.audioLabel} forceLatinFont>
                    🔊 {c.label}
                  </AppText>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {question.variant === "feed" && selectedId ? (
        <View style={kb.footer}>
          <LightCheckButton
            label={t("lessons.check")}
            disabled={!selectedId || revealed}
            onPress={feedToMascot}
          />
        </View>
      ) : null}
    </GameRoot>
  );
}

const kb = StyleSheet.create({
  root: { gap: 12 },
  scene: {
    borderRadius: LightRadius.card,
    padding: 16,
    minHeight: 220,
    marginTop: 4,
  },
  sceneLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: L.navySoft,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  sceneLabelNight: { color: "rgba(255,255,255,0.65)" },
  sceneObjects: { flex: 1 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  gridItem: { width: "46%", minWidth: 140 },
  bubbleArea: { minHeight: 200, justifyContent: "center", paddingVertical: 8 },
  bubbleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  bubbleWrap: { width: "44%", marginVertical: 6 },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D6E8FF",
    shadowColor: L.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  bubbleEmoji: { fontSize: 36, lineHeight: 42 },
  bubbleLabel: { fontSize: 14, color: L.navy, marginTop: 4 },
  feedArea: { gap: 12 },
  mascotZone: { alignSelf: "center", width: "100%", maxWidth: 280 },
  mascotCard: { alignItems: "center", paddingVertical: 20, gap: 6 },
  mascotEmoji: { fontSize: 56, lineHeight: 64 },
  mascotHint: { fontSize: 15, color: L.navy },
  shadowArea: { gap: 16 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  slotRow: { flexDirection: "row", justifyContent: "center", gap: 12 },
  slot: {
    width: 96,
    height: 108,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  slotEmoji: { fontSize: 32, opacity: 0.35 },
  slotLabel: { fontSize: 12, fontWeight: "700", color: L.navy },
  slotGhost: { opacity: 0.4 },
  pickArea: { marginTop: 4 },
  trickArea: { gap: 16, alignItems: "center" },
  trickCard: { alignItems: "center", padding: 20, gap: 8, width: "100%" },
  trickEmoji: { fontSize: 52, lineHeight: 60 },
  trickLabel: { fontSize: 22, color: L.navy },
  trickSays: { fontSize: 16, color: L.navySoft, textAlign: "center" },
  trickBtns: { flexDirection: "row", gap: 12, width: "100%" },
  treasureArea: { alignItems: "center", gap: 16, paddingVertical: 8 },
  chestWrap: { alignItems: "center", gap: 8 },
  chestEmoji: { fontSize: 72, lineHeight: 80 },
  chestHint: { fontSize: 16, color: L.blue },
  revealWrap: { alignItems: "center", gap: 4 },
  revealEmoji: { fontSize: 48 },
  revealLabel: { fontSize: 20, color: L.navy },
  treasureOpts: { width: "100%", gap: 10 },
  audioOpt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: LightRadius.tile,
    padding: 14,
    borderWidth: 1,
    borderColor: L.border,
  },
  audioEmoji: { fontSize: 28 },
  audioLabel: { fontSize: 17, fontWeight: "700", color: L.navy },
  footer: { marginTop: 8 },
});
