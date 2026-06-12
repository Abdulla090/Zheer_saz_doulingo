/* eslint-disable */
/**
 * KidsPlayGame — contextual kids mechanics (scene, bubbles, feed, shadow, etc.)
 */

import { AppText } from "../../../components/ui/AppText";
import { HomeLiquidButton, HomeLiquidCard } from "../../../components/ui/ios-liquid-home";
import { KidsPlayQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { KidsSceneKey } from "../../../data/kids-games";
import { useI18n } from "../../../hooks/useI18n";
import { useTTS } from "../../../hooks/use-tts";
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
  withSpring,
} from "react-native-reanimated";
import { GameHeader, GameRoot } from "./GameAnimatedShell";
import { L, LightRadius } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightPromptCard,
  LightWordTile,
} from "./lesson-light-primitives";
import { EmojiSticker } from "../../../components/ui/EmojiSticker";

type Props = {
  question: KidsPlayQuestion;
  onAnswer: (correct: boolean | "skip") => void;
  pathMode?: LessonPathMode;
};

const SCENE_GRADIENTS: Record<
  KidsSceneKey,
  readonly [string, string, string]
> = {
  bedroom: ["#FFE8D6", "#FFF3C4", "#E8F4FF"],
  kitchen: ["#FFF4E0", "#FFE8C8", "#FFF0DB"],
  playground: ["#D8F5E4", "#B8EBD4", "#E8FFF4"],
  closet: ["#FFF5EB", "#FFE5CC", "#FAD8B5"],
  yard: ["#DFF5D0", "#C8EBB8", "#F0FFE8"],
  art: ["#E0F7FA", "#E0E8FF", "#FFF8D0"],
  backyard: ["#D4F0C8", "#B8E8A8", "#E8FFD8"],
  living: ["#F5EDE4", "#EDE0D4", "#FFF8F0"],
  street: ["#D8E8F8", "#C0D8F0", "#E8F0FF"],
  night: ["#0B132B", "#1C2541", "#3A506B"],
  bathroom: ["#E0F7FA", "#B2EBF2", "#80DEEA"],
  classroom: ["#FFF9C4", "#FFF59D", "#FFF176"],
  livingroom: ["#F5EDE4", "#EDE0D4", "#FFF8F0"],
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
  const driftY = useSharedValue(0);
  const driftX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const bubbleScale = useSharedValue(1);

  useEffect(() => {
    driftY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1500 + index * 130, easing: Easing.inOut(Easing.sin) }),
        withTiming(12, { duration: 1500 + index * 130, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    driftX.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1700 + index * 90, easing: Easing.inOut(Easing.sin) }),
        withTiming(8, { duration: 1700 + index * 90, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    rotation.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1900 + index * 180, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 1900 + index * 180, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [driftY, driftX, rotation, index]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: driftY.value },
      { translateX: driftX.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
  }));

  return (
    <Animated.View style={[style, kb.bubbleWrap]} entering={FadeInDown.delay(index * 80).duration(320)}>
      <Pressable
        onPress={() => {
          if (disabled) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          bubbleScale.value = withSequence(
            withSpring(0.7, { damping: 5, stiffness: 200 }),
            withSpring(1, { damping: 10 }),
          );
          onPop();
        }}
        onPressIn={() => {
          bubbleScale.value = withSpring(0.9, { damping: 12 });
        }}
        onPressOut={() => {
          bubbleScale.value = withSpring(1, { damping: 12 });
        }}
        disabled={disabled}
      >
        <Animated.View style={[kb.bubble, popStyle]}>
          <EmojiSticker emoji={emoji} size={42} animateOnMount={false} />
          <AppText style={kb.bubbleLabel} forceLatinFont latinRole="bold">
            {label}
          </AppText>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
export default function KidsPlayGame({ question, onAnswer, pathMode }: Props) {
  const { t, isKu: isSystemKu } = useI18n();
  const { speak } = useTTS();
  const firedRef = useRef(false);
  const heading = variantHeading(question.variant, t);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [treasureOpen, setTreasureOpen] = useState(false);
  const [shadowPicks, setShadowPicks] = useState<Record<string, string>>({});
  const [activeChip, setActiveChip] = useState<string | null>(null);

  // Mascot animations
  const mascotScale = useSharedValue(1);
  const mascotY = useSharedValue(0);
  const mascotBounce = useSharedValue(0);

  // Chest / gift box animations
  const chestShake = useSharedValue(0);
  const chestScale = useSharedValue(1);

  // Yes / No animations
  const yesScale = useSharedValue(1);
  const noScale = useSharedValue(1);

  // Shadow placement pop animation
  const slotPopScale = useSharedValue(1);

  useEffect(() => {
    setSelectedId(null);
    setRevealed(false);
    setTreasureOpen(false);
    setShadowPicks({});
    setActiveChip(null);
    firedRef.current = false;
    chestShake.value = 0;
    chestScale.value = 1;
    slotPopScale.value = 1;
  }, [question]);

  useEffect(() => {
    // Mascot breathing
    mascotScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.97, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    mascotY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
        withTiming(5, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    if (revealed && question.variant === "feed" && selectedId === question.correctId) {
      mascotBounce.value = withSequence(
        withTiming(-35, { duration: 160, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 250, easing: Easing.bounce }),
      );
    }
  }, [revealed, selectedId, question.variant]);

  const mascotStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: mascotY.value + mascotBounce.value },
        { scale: mascotScale.value },
      ],
    };
  });

  const chestStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: chestShake.value },
        { scale: chestScale.value },
      ],
    };
  });

  const yesStyle = useAnimatedStyle(() => ({
    transform: [{ scale: yesScale.value }],
  }));

  const noStyle = useAnimatedStyle(() => ({
    transform: [{ scale: noScale.value }],
  }));

  const currentMascotEmoji = useMemo(() => {
    const base = question.mascotEmoji ?? "🦉";
    if (revealed) {
      return selectedId === question.correctId ? "🥳" : "😢";
    }
    if (selectedId) {
      return "😋"; // mascot gets hungry / opens mouth when item is selected
    }
    return base;
  }, [question.mascotEmoji, selectedId, revealed, question.correctId]);

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
    
    // Animate slot drop pop
    slotPopScale.value = 0.4;
    slotPopScale.value = withSpring(1, { damping: 10, stiffness: 150 });

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
    
    // Shake gift
    chestShake.value = withSequence(
      withTiming(-12, { duration: 50 }),
      withTiming(12, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );

    // Spring scaling pop
    chestScale.value = withSequence(
      withTiming(1.25, { duration: 180 }),
      withTiming(1, { duration: 200, easing: Easing.bounce }),
    );

    setTimeout(() => {
      setTreasureOpen(true);
      if (question.treasureRevealLabel) {
        speak(question.treasureRevealLabel, "en");
      }
    }, 320);
  };

  const renderChoicesGrid = (floating?: boolean) => (
    <View style={[kb.grid, floating && kb.bubbleRow, { flexDirection: isSystemKu ? "row-reverse" : "row" }]}>
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
              isKids={true}
            />
          </Animated.View>
        ),
      )}
    </View>
  );

  return (
    <GameRoot style={kb.root}>
      <GameHeader>
        <LightGameHeading title={heading.title} />
      </GameHeader>

      <LightPromptCard
        kurdish={isKu ? question.prompt : undefined}
        english={!isKu ? question.prompt : undefined}
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
            style={({ pressed }) => [kb.mascotZone, pressed && { opacity: 0.95 }]}
          >
            <Animated.View style={mascotStyle}>
              <HomeLiquidCard contentStyle={kb.mascotCard} radius={28}>
                <EmojiSticker emoji={currentMascotEmoji} size={64} animateOnMount={false} />
                <AppText style={kb.mascotHint} forceLatinFont latinRole="bold">
                  {selectedId ? "Tap here to give it!" : "Pick an item first"}
                </AppText>
              </HomeLiquidCard>
            </Animated.View>
          </Pressable>
        </View>
      ) : null}

      {question.variant === "shadow" ? (
        <View style={kb.shadowArea}>
          <View style={[kb.chipRow, { flexDirection: isSystemKu ? "row-reverse" : "row" }]}>
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
                  isKids={true}
                />
              );
            })}
          </View>
          <View style={[kb.slotRow, { flexDirection: isSystemKu ? "row-reverse" : "row" }]}>
            {slots.map((slotId) => {
              const chip = question.choices.find((c) => c.id === slotId);
              const placed = shadowPicks[slotId];
              const placedChip = question.choices.find((c) => c.id === placed);
              return (
                <Pressable
                  key={slotId}
                  onPress={() => onShadowSlot(slotId)}
                  style={[
                    kb.slot,
                    placedChip && { borderColor: L.green, borderStyle: "solid", backgroundColor: "#F0FDF4" }
                  ]}
                >
                  {placedChip ? (
                    <Animated.View style={[{ alignItems: "center" }, placed === slotId && { transform: [{ scale: slotPopScale }] }]}>
                      <EmojiSticker emoji={placedChip.emoji} size={36} animateOnMount={false} />
                      <AppText style={kb.slotLabel} forceLatinFont>
                        {placedChip.label}
                      </AppText>
                    </Animated.View>
                  ) : (
                    <View style={{ alignItems: "center", opacity: 0.25 }}>
                      <AppText style={kb.slotEmoji}>
                        {chip?.emoji ?? "⬜"}
                      </AppText>
                      <AppText style={[kb.slotLabel, kb.slotGhost]} forceLatinFont>
                        {chip?.label ?? "?"}
                      </AppText>
                    </View>
                  )}
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
            <EmojiSticker emoji={question.shownEmoji ?? "⭐"} size={64} style={{ marginBottom: 4 }} />
            <AppText style={kb.trickLabel} forceLatinFont latinRole="bold">
              {question.shownLabel}
            </AppText>
            <View style={kb.speechBubble}>
              <AppText style={kb.trickSays} forceLatinFont>
                Mascot says: &quot;{question.spokenWord}&quot;
              </AppText>
            </View>
          </HomeLiquidCard>
          <View style={[kb.trickBtns, { flexDirection: isSystemKu ? "row-reverse" : "row" }]}>
            <Animated.View style={[yesStyle, { flex: 1 }]}>
              <Pressable
                onPressIn={() => { yesScale.value = withSpring(0.92, { damping: 10 }); }}
                onPressOut={() => { yesScale.value = withSpring(1, { damping: 10 }); }}
                onPress={() => onYesNo("yes")}
                style={[kb.yesNoBtn, { borderColor: L.green, backgroundColor: "#F0FDF4" }]}
              >
                <AppText style={[kb.yesNoText, { color: L.greenDeep }]} forceLatinFont latinRole="bold">
                  ✓  Match!
                </AppText>
              </Pressable>
            </Animated.View>
            <Animated.View style={[noStyle, { flex: 1 }]}>
              <Pressable
                onPressIn={() => { noScale.value = withSpring(0.92, { damping: 10 }); }}
                onPressOut={() => { noScale.value = withSpring(1, { damping: 10 }); }}
                onPress={() => onYesNo("no")}
                style={[kb.yesNoBtn, { borderColor: L.red, backgroundColor: "#FEF2F2" }]}
              >
                <AppText style={[kb.yesNoText, { color: L.redDeep }]} forceLatinFont latinRole="bold">
                  ✗  Trick!
                </AppText>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      ) : null}

      {question.variant === "treasure" ? (
        <View style={kb.treasureArea}>
          <Pressable 
            onPress={openChest} 
            style={kb.chestWrap}
          >
            <Animated.View style={chestStyle}>
              {treasureOpen ? (
                <View style={{ alignItems: "center", gap: 6 }}>
                  <EmojiSticker emoji={question.treasureRevealEmoji ?? "⭐"} size={72} />
                  <AppText style={{ fontSize: 18, color: L.greenDeep, fontFamily: "DINNextRoundedBold" }}>
                    {question.treasureRevealLabel}
                  </AppText>
                </View>
              ) : (
                <EmojiSticker emoji="🎁" size={72} />
              )}
            </Animated.View>
            {!treasureOpen ? (
              <AppText style={kb.chestHint} forceLatinFont latinRole="bold">
                Tap the gift!
              </AppText>
            ) : (
              <Animated.View entering={FadeIn.duration(300)} style={kb.revealWrap}>
                <AppText style={kb.revealEmoji}>🔊</AppText>
                <AppText style={kb.revealLabel} forceLatinFont latinRole="bold">
                  Listen!
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
                  style={({ pressed }) => [kb.audioOpt, pressed && { opacity: 0.85 }, { flexDirection: isSystemKu ? "row-reverse" : "row" }]}
                >
                  <AppText style={kb.audioLabel} forceLatinFont>
                    {c.label}
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
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "#D6E8FF",
    shadowColor: L.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  bubbleEmoji: { fontSize: 36, lineHeight: 42 },
  bubbleLabel: { fontSize: 14, color: L.navy, marginTop: 6, fontFamily: "DINNextRoundedBold" },
  feedArea: { gap: 12 },
  mascotZone: { alignSelf: "center", width: "100%", maxWidth: 280, marginTop: 8 },
  mascotCard: { alignItems: "center", paddingVertical: 18, gap: 8 },
  mascotEmoji: { fontSize: 56, lineHeight: 64 },
  mascotHint: { fontSize: 15, color: L.navy, fontFamily: "DINNextRoundedBold", textAlign: "center" },
  shadowArea: { gap: 16 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  slotRow: { flexDirection: "row", justifyContent: "center", gap: 12, marginTop: 8 },
  slot: {
    width: 96,
    height: 112,
    borderRadius: 20,
    borderWidth: 2.5,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    shadowColor: "#1A2B48",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  slotEmoji: { fontSize: 32, opacity: 0.35 },
  slotLabel: { fontSize: 12, fontWeight: "700", color: L.navy, fontFamily: "DINNextRoundedBold" },
  slotGhost: { opacity: 0.4 },
  pickArea: { marginTop: 4 },
  trickArea: { gap: 16, alignItems: "center" },
  trickCard: { alignItems: "center", padding: 18, gap: 6, width: "100%" },
  trickEmoji: { fontSize: 52, lineHeight: 60 },
  trickLabel: { fontSize: 20, color: L.navy, fontFamily: "DINNextRoundedBold" },
  trickSays: { fontSize: 15, color: L.navySoft, textAlign: "center", fontFamily: "DINNextRoundedMedium" },
  trickBtns: { flexDirection: "row", gap: 12, width: "100%" },
  yesNoBtn: {
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A2B48",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  yesNoText: {
    fontSize: 16,
    fontFamily: "DINNextRoundedBold",
  },
  speechBubble: {
    backgroundColor: "rgba(26, 43, 72, 0.05)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  treasureArea: { alignItems: "center", gap: 16, paddingVertical: 8 },
  chestWrap: { alignItems: "center", gap: 8 },
  chestEmoji: { fontSize: 72, lineHeight: 80 },
  chestHint: { fontSize: 16, color: L.blue, fontFamily: "DINNextRoundedBold" },
  revealWrap: { alignItems: "center", gap: 4, marginTop: 4 },
  revealEmoji: { fontSize: 44 },
  revealLabel: { fontSize: 18, color: L.navy, fontFamily: "DINNextRoundedBold" },
  treasureOpts: { width: "100%", gap: 10 },
  audioOpt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: LightRadius.tile,
    padding: 14,
    borderWidth: 2.5,
    borderColor: L.border,
  },
  audioEmoji: { fontSize: 28 },
  audioLabel: { fontSize: 17, fontWeight: "700", color: L.navy, fontFamily: "DINNextRoundedBold" },
  footer: { marginTop: 8 },
});
