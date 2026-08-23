/* eslint-disable */
/**
 * SentenceBuilderGame — Premium light UI ("Order the words").
 * Word tiles morph bidirectionally between the bank and answer slots via Reanimated FLIP transitions.
 * Features 60fps real-time interactive drag-and-drop sliding reorder with live sibling gap opening.
 */

import { wordTileMorphTiming } from "../../../components/animations/motion";
import { AppText } from "../../../components/ui/AppText";
import { getLanguageDirection } from "../../../i18n/direction";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useWordSpeech } from "./use-word-speech";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type View as RNView,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  interpolate,
  LinearTransition,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { SentenceBuilderQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { L, Duo, DuoMotion } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightQuestionPrompt,
  LightWordTile,
  type LightTileState,
} from "./lesson-light-primitives";
import {
  GameFooter,
  GameHeader,
  GameRoot,
} from "./GameAnimatedShell";
import { measureGameElement } from "./game-layout-measure";
import {
  MIN_RAILS,
  RAIL_DROP,
  RAIL_H,
  RAIL_RADIUS,
  ROW_GAP,
  ROW_H,
  ROW_STRIDE,
  TILE_GAP,
  estimateRailCount,
  estimateTileWidth,
  linesFromHeight,
  resolveHoverTarget,
  resolveSiblingOffset,
} from "./duo-answer-rails";

type Placed = { word: string; id: string; bankIndex: number };
type FBState = "idle" | "correct" | "wrong";
type FlyDirection = "forward" | "reverse";

/** Resting width of the landing anchor — just enough to be measurable. */
const LANDING_ANCHOR_REST_W = 1;
/** Fallback if reserving the anchor produces no layout event. */
const ANCHOR_LAYOUT_TIMEOUT_MS = 32;
/**
 * A flight that has not finished within this window has lost its completion
 * callback (dropped layout event, interrupted Reanimated timing). The watchdog
 * releases its locks so taps and Check can never be wedged permanently.
 */
const FLY_WATCHDOG_MS = 3000;

/** True when every coordinate is a usable number — NaN geometry never flies. */
const isUsablePoint = (p: { x: number; y: number } | null | undefined): p is { x: number; y: number } =>
  !!p && Number.isFinite(p.x) && Number.isFinite(p.y);
const isUsableCoords = (
  p: { x: number; y: number; w: number; h: number } | null | undefined,
): boolean =>
  isUsablePoint(p) &&
  Number.isFinite(p!.w) &&
  Number.isFinite(p!.h);

type FlySession = {
  id: string;
  direction: FlyDirection;
  bankIndex: number;
  word: string;
  slotIndex?: number;
  /** Wall-clock start, used by the watchdog to recover lost flights. */
  startedAt: number;
  fromX: number;
  fromY: number;
  fromW: number;
  fromH: number;
  toX: number;
  toY: number;
  toW: number;
  toH: number;
};

type Props = {
  question: SentenceBuilderQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
};

/** Apple / Duolingo Max tier — critically damped, crisp response, zero childish wobble */
/*
 * Kept as separate constants, deliberately not one object.
 *
 * Worklets below reference the spring configs by name, and the Babel worklet
 * transform captures the whole referenced binding into the worklet closure.
 * If those bindings lived on a single object together with `layoutGlide`,
 * every gesture/animation sent to the UI thread would try to serialize the
 * LinearTransition too and crash with
 * "[Worklets] Cannot copy value of type `LinearTransition`".
 */
const PremiumSiblingSpring = { damping: 26, stiffness: 640, mass: 0.22, overshootClamping: true };
const PremiumReleaseSnap = { damping: 28, stiffness: 720, mass: 0.18, overshootClamping: true };
const PremiumLayoutGlide =
  Platform.OS === "web"
    ? LinearTransition.duration(180)
    : LinearTransition.duration(180).easing(Easing.out(Easing.cubic));

/*
 * FlyingTile handles bidirectional morphing (Bank -> Answer Slot and Answer Slot -> Bank Ghost).
 *
 * The inner tile is rendered at the LARGER of `fromW` and `toW` so text always
 * has enough room and never truncates with "..." mid-flight. A compensating
 * inverse-scale keeps the visible footprint at exactly `fromW × fromH` at p=0
 * and `toW × toH` at p=1.
 */
function FlyingTile({
  session,
  onFinish,
  isKids,
  isNormal,
  languageCode,
}: {
  session: FlySession;
  onFinish: (id: string, bankIndex: number, direction: FlyDirection) => void;
  isKids?: boolean;
  isNormal?: boolean;
  languageCode?: string;
}) {
  const flyProgress = useSharedValue(0);

  /*
   * Larger of both endpoints plus slack. The shell is still scaled to match
   * the endpoint footprints exactly (scaleXFrom/scaleXTo below compensate for
   * the extra room), while the slack guarantees the label always lays out on a
   * single line mid-flight — its last letter never wraps to a second line and
   * the text is never ellipsized ("wor…").
   */
  const FLY_SLACK_W = 18;
  const FLY_SLACK_H = 8;
  const renderW = Math.max(session.fromW, session.toW) + FLY_SLACK_W;
  const renderH = Math.max(session.fromH, session.toH) + FLY_SLACK_H;

  // At p=0 the visible shell must be fromW × fromH;
  // at p=1 it must be toW × toH.
  const scaleXFrom = session.fromW > 0 ? session.fromW / renderW : 1;
  const scaleXTo   = session.toW   > 0 ? session.toW   / renderW : 1;
  const scaleYFrom = session.fromH > 0 ? session.fromH / renderH : 1;
  const scaleYTo   = session.toH   > 0 ? session.toH   / renderH : 1;

  const flyStyle = useAnimatedStyle(() => {
    const p = flyProgress.value;
    return {
      transform: [
        { translateX: interpolate(p, [0, 1], [session.fromX, session.toX]) },
        { translateY: interpolate(p, [0, 1], [session.fromY, session.toY]) },
        { scaleX: interpolate(p, [0, 1], [scaleXFrom, scaleXTo]) },
        { scaleY: interpolate(p, [0, 1], [scaleYFrom, scaleYTo]) },
      ],
    };
  });

  React.useEffect(() => {
    flyProgress.value = withTiming(1, wordTileMorphTiming, (finished) => {
      if (finished) runOnJS(onFinish)(session.id, session.bankIndex, session.direction);
    });
  }, [session, onFinish, flyProgress]);

  return (
    <View
      {...(Platform.OS === "web" ? ({ dir: getLanguageDirection(languageCode) } as any) : {})}
      style={[s.flySessionLayer, Platform.OS !== "web" ? { direction: getLanguageDirection(languageCode) } : undefined]}
    >
      <Animated.View
        style={[
          {
            width: renderW,
            height: renderH,
            transformOrigin: "top left",
          },
          flyStyle,
        ]}
      >
        <View style={s.flyTileFill}>
          <LightWordTile
            label={session.word}
            state="idle"
            isKids={isKids}
            languageCode={languageCode}
            // One strict line. With the slack built into the shell above there
            // is always room for it, so the word can neither wrap its last
            // letter onto a second line nor truncate with "..." mid-flight.
            fitLabel={!isNormal}
            fitLabelLines={1}
            labelLines={1}
            duoDepthStyle={isNormal ? "subtle" : "default"}
            fontSize={
              isNormal
                ? undefined
                : session.word.length > 12 ? 10 : session.word.length > 9 ? 11 : 14
            }
            style={isNormal ? s.flyWordTileDuo : s.flyWordTile}
          />
        </View>
      </Animated.View>
    </View>
  );
}

/**
 * Draggable placed word.
 *
 * Real-time displacement: siblings spring open an exact gap (real measured
 * widths) as the dragged tile passes their midpoint. On release EVERY transform
 * is dropped atomically on the UI thread (the style simply switches branch —
 * no JS roundtrip), so there is exactly one clean baseline frame before React
 * commits the reorder and LinearTransition glides all tiles to their new spots
 * as a single coordinated movement. Layout and transforms are never mixed in a
 * painted frame, so nothing can flash, double-move or overlap.
 */
function RealtimeDraggablePlacedWord({
  placed,
  index,
  sentenceWords,
  cellWidths,
  tileState,
  targetLanguage,
  isNormal,
  isKids,
  isRtl,
  activeDragIndex,
  dragTranslationX,
  dragTranslationY,
  hoverTargetIndex,
  onRemove,
  onReorder,
  slotRef,
  onLayout,
}: {
  placed: Placed;
  index: number;
  sentenceWords: string[];
  /** Measured outer width of every placed cell, indexed by slot. */
  cellWidths: SharedValue<number[]>;
  tileState: LightTileState;
  targetLanguage?: string;
  isNormal?: boolean;
  isKids?: boolean;
  isRtl?: boolean;
  activeDragIndex: SharedValue<number>;
  dragTranslationX: SharedValue<number>;
  dragTranslationY: SharedValue<number>;
  hoverTargetIndex: SharedValue<number>;
  onRemove: (placed: Placed, index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  slotRef: (el: RNView | null) => void;
  onLayout: () => void;
}) {
  const isDragging = useSharedValue(0);
  const totalCount = sentenceWords.length;

  /**
   * How far this tile is pushed aside to open a gap for the dragged word.
   * Own shared value rather than an inline `withSpring` — the style worklet
   * re-runs every frame of a drag, and an inline spring would restart from
   * the current position each frame, so neighbours stutter and never settle.
   */
  const siblingOffset = useSharedValue(0);

  /*
   * Recomputed only when the drag state changes — not every frame. The offset
   * matches the slot stride, so after the reorder commits, `layout + offset`
   * already equals the tile's final position; zeroing it at release is a
   * visual no-op instead of a second movement.
   */
  useAnimatedReaction(
    () => {
      const dragIdx = activeDragIndex.value;
      if (dragIdx === -1 || dragIdx === index) return 0;
      const gap =
        (cellWidths.value[dragIdx] ??
          estimateTileWidth(sentenceWords[dragIdx] ?? "")) + TILE_GAP;
      return resolveSiblingOffset(
        index,
        dragIdx,
        hoverTargetIndex.value,
        gap,
        isRtl === true,
      );
    },
    (target, previous) => {
      if (target === previous) return;
      if (activeDragIndex.value === -1) {
        /*
         * Drag ended. This runs on the UI thread in the same event as the
         * style branch switch, so the gap closes in exactly the frame the
         * dragged tile rejoins the row — one clean baseline before the
         * committed reorder glides everyone to their new spots.
         */
        siblingOffset.value = 0;
        return;
      }
      siblingOffset.value = withSpring(target, PremiumSiblingSpring);
    },
    [index, isRtl, sentenceWords],
  );

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleCommitReorder = useCallback(
    (fromIdx: number, toIdx: number) => {
      triggerHaptic();
      onReorder(fromIdx, toIdx);
    },
    [onReorder, triggerHaptic],
  );

  const panGesture = Gesture.Pan()
    .minDistance(6)
    .activeOffsetX([-6, 6])
    .onStart(() => {
      activeDragIndex.value = index;
      hoverTargetIndex.value = index;
      dragTranslationX.value = 0;
      dragTranslationY.value = 0;
      isDragging.value = withTiming(1, { duration: 80, easing: Easing.out(Easing.quad) });
    })
    .onUpdate((e) => {
      dragTranslationX.value = e.translationX;
      dragTranslationY.value = e.translationY * 0.3;

      // Normalise to reading order before measuring: under RTL a rightward drag
      // moves the word *earlier* in the sentence.
      const delta = isRtl ? -e.translationX : e.translationX;
      const newHover = resolveHoverTarget(
        index,
        delta,
        cellWidths.value,
        sentenceWords,
        totalCount,
      );

      if (hoverTargetIndex.value !== newHover) {
        hoverTargetIndex.value = newHover;
        runOnJS(triggerHaptic)();
      }
    })
    .onEnd(() => {
      const fromIdx = activeDragIndex.value;
      const toIdx = hoverTargetIndex.value;

      isDragging.value = withTiming(0, { duration: 60, easing: Easing.out(Easing.quad) });

      /*
       * Atomic release, all on the UI thread: the animated style switches to
       * its resting branch and the reaction closes the gaps in THIS frame.
       * Transforms and layout are therefore never painted mixed — the reorder
       * glide that follows starts from one clean baseline.
       */
      activeDragIndex.value = -1;
      hoverTargetIndex.value = -1;

      if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
        runOnJS(handleCommitReorder)(fromIdx, toIdx);
      }
    })
    .onFinalize(() => {
      activeDragIndex.value = -1;
      hoverTargetIndex.value = -1;
    });

  const animatedStyle = useAnimatedStyle(() => {
    if (activeDragIndex.value === index) {
      // Active dragged tile: elevated, follows the finger
      return {
        transform: [
          { translateX: dragTranslationX.value },
          { translateY: dragTranslationY.value },
          { scale: interpolate(isDragging.value, [0, 1], [1, 1.04]) },
        ],
        zIndex: 100,
        opacity: 1,
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: interpolate(isDragging.value, [0, 1], [0, 0.16]),
        shadowRadius: 10,
      };
    }

    // Sibling / resting tile: one settled spring, driven by the reaction above.
    return {
      transform: [
        { translateX: siblingOffset.value },
        { translateY: 0 },
        { scale: 1 },
      ],
      zIndex: 1,
      opacity: 1,
      elevation: 0,
      shadowOpacity: 0,
    };
  });

  return (
    <Animated.View
      layout={PremiumLayoutGlide}
      style={[
        isNormal ? s.duoPlacedCell : s.slotCell,
        animatedStyle,
      ]}
    >
      <View
        ref={slotRef}
        onLayout={onLayout}
        collapsable={false}
        /*
         * Normal-path cells are intrinsically sized by their word.  A flex: 1
         * wrapper here makes the auto-width flex row redistribute short words
         * (and, on some native layouts, measure them as zero-width), while the
         * cell's end margin still reserves TILE_GAP.  That mismatch is the
         * source of the occasional short-word overlap.  Keep the fixed-width
         * legacy slots stretched, but let the normal row retain its measured
         * footprint.
         */
        style={isNormal ? undefined : { flex: 1 }}
      >
        <GestureDetector gesture={panGesture}>
          <View style={isNormal ? undefined : { flex: 1 }}>
            <LightWordTile
              label={placed.word}
              state={tileState}
              onPress={() => onRemove(placed, index)}
              activateOnPressIn={false}
              duoDepthStyle={isNormal ? "subtle" : "default"}
              isKids={isKids}
              languageCode={targetLanguage}
              fitLabel={!isNormal}
              fitLabelLines={2}
              fontSize={
                isNormal
                  ? undefined
                  : placed.word.length > 12 ? 10 : placed.word.length > 9 ? 11 : 14
              }
              style={isNormal ? s.duoWordTile : s.slotWordTile}
            />
          </View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

export default function SentenceBuilderGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const { colors, isDark } = useThemeColors();
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const isNormal = pathMode === "normal";
  const targetDirection = getLanguageDirection(question.targetLanguage);
  const isRtl = targetDirection === "rtl";
  const { speakWord, stop, language: targetLanguage } = useWordSpeech(question.targetLanguage);

  const fullSentence = React.useMemo(
    () => question.correctWords.join(" "),
    [question.correctWords],
  );
  
  const shuffledWordBank = React.useMemo(() => {
    const bank = [...question.wordBank];
    for (let i = bank.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bank[i], bank[j]] = [bank[j], bank[i]];
    }
    return bank;
  }, [question.wordBank]);

  const [sentence, setSentence] = useState<Placed[]>([]);
  const [usedBank, setUsedBank] = useState(() =>
    shuffledWordBank.map(() => false),
  );
  const [fb, setFb] = useState<FBState>("idle");
  const [flySessions, setFlySessions] = useState<FlySession[]>([]);
  const [placedLines, setPlacedLines] = useState(1);
  const [answerWidth, setAnswerWidth] = useState(0);

  // Real-time Shared Drag Values
  const activeDragIndex = useSharedValue<number>(-1);
  const dragTranslationX = useSharedValue<number>(0);
  const dragTranslationY = useSharedValue<number>(0);
  const hoverTargetIndex = useSharedValue<number>(-1);
  /**
   * Real measured width of each placed cell, mirrored onto the UI thread so the
   * drag worklets displace neighbours by the exact space the dragged word takes.
   * Fed by the same `measureInWindow` calls that already populate `slotCoords`.
   */
  const cellWidths = useSharedValue<number[]>([]);

  const [anchorWidth, setAnchorWidth] = useState(LANDING_ANCHOR_REST_W);
  const anchorWidthRef = useRef(LANDING_ANCHOR_REST_W);
  const anchorLayoutWaiterRef = useRef<(() => void) | null>(null);

  const resolveAnchorLayout = useCallback(() => {
    const waiter = anchorLayoutWaiterRef.current;
    if (waiter) {
      anchorLayoutWaiterRef.current = null;
      waiter();
    }
  }, []);

  const reserveLandingAnchor = useCallback(
    (width: number) =>
      new Promise<void>((resolve) => {
        if (Math.abs(anchorWidthRef.current - width) < 0.5) {
          resolve();
          return;
        }
        anchorWidthRef.current = width;
        anchorLayoutWaiterRef.current = resolve;
        setAnchorWidth(width);
        setTimeout(() => {
          if (anchorLayoutWaiterRef.current === resolve) {
            anchorLayoutWaiterRef.current = null;
            resolve();
          }
        }, ANCHOR_LAYOUT_TIMEOUT_MS);
      }),
    [],
  );

  const releaseLandingAnchor = useCallback(() => {
    anchorWidthRef.current = LANDING_ANCHOR_REST_W;
    setAnchorWidth(LANDING_ANCHOR_REST_W);
  }, []);

  const slotN = useRef(0);
  const completedRef = useRef(false);
  const wrongSentRef = useRef(false);
  const measuringBankRef = useRef<number | null>(null);
  /**
   * Word-bank taps arrive faster than React can commit the first FLIP. Keep a
   * small JS-side queue so every distinct touch-down is accepted immediately,
   * then drain it in visual order as each flight finishes.
   */
  const pendingAddQueueRef = useRef<number[]>([]);
  const addFlightActiveRef = useRef(false);
  const reservedAddCountRef = useRef(0);
  const sentenceCountRef = useRef(0);
  const usedBankRef = useRef<boolean[]>([]);
  const processQueuedAddsRef = useRef<() => void>(() => {});
  
  const rootRef = useRef<RNView>(null);
  const bankRefs = useRef<(RNView | null)[]>([]);
  const slotRefs = useRef<(RNView | null)[]>([]);

  const rootCoords = useRef<{ x: number; y: number } | null>(null);
  const bankCoords = useRef<{ [key: number]: { x: number; y: number; w: number; h: number } }>({});
  const slotCoords = useRef<{ [key: number]: { x: number; y: number; w: number; h: number } }>({});

  /** Records a placed cell's geometry for both the fly measurement and the drag worklets. */
  const recordSlotLayout = useCallback(
    (index: number) => {
      slotRefs.current[index]?.measureInWindow((x, y, w, h) => {
        slotCoords.current[index] = { x, y, w, h };
        if (Math.abs((cellWidths.value[index] ?? -1) - w) < 0.5) return;
        const next = [...cellWidths.value];
        next[index] = w;
        cellWidths.value = next;
      });
    },
    [cellWidths],
  );

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  React.useEffect(() => {
    void stop();
    setSentence([]);
    setUsedBank(shuffledWordBank.map(() => false));
    setFb("idle");
    setFlySessions([]);
    setPlacedLines(1);
    slotN.current = 0;
    pendingAddQueueRef.current = [];
    addFlightActiveRef.current = false;
    reservedAddCountRef.current = 0;
    sentenceCountRef.current = 0;
    usedBankRef.current = shuffledWordBank.map(() => false);
    completedRef.current = false;
    wrongSentRef.current = false;
    measuringBankRef.current = null;
    bankCoords.current = {};
    slotCoords.current = {};
    cellWidths.value = [];
    activeDragIndex.value = -1;
    hoverTargetIndex.value = -1;
    dragTranslationX.value = 0;
    dragTranslationY.value = 0;
    anchorLayoutWaiterRef.current = null;
    releaseLandingAnchor();
  }, [shuffledWordBank, stop, releaseLandingAnchor, activeDragIndex, hoverTargetIndex, cellWidths, dragTranslationX, dragTranslationY]);

  React.useEffect(() => () => {
    void stop();
  }, [stop]);

  const slotCount = question.correctWords.length;
  const sentenceWords = useMemo(() => sentence.map((p) => p.word), [sentence]);

  const commitAddWord = useCallback(
    (bankIndex: number) => {
      const w = shuffledWordBank[bankIndex];
      const id = `s${slotN.current++}`;
      sentenceCountRef.current += 1;
      reservedAddCountRef.current = Math.max(0, reservedAddCountRef.current - 1);
      setSentence((p) => [...p, { word: w, id, bankIndex }]);
    },
    [shuffledWordBank],
  );

  const finishFly = useCallback(
    (id: string, bankIndex: number, direction: FlyDirection) => {
      if (direction === "forward") {
        commitAddWord(bankIndex);
        releaseLandingAnchor();
        addFlightActiveRef.current = false;
      } else {
        setUsedBank((prev) => {
          const next = [...prev];
          next[bankIndex] = false;
          usedBankRef.current[bankIndex] = false;
          return next;
        });
      }
      setFlySessions((prev) => prev.filter((s) => s.id !== id));
    },
    [commitAddWord, releaseLandingAnchor],
  );

  const startFlyToSlot = useCallback(
    async (bankIndex: number) => {
      if (fb === "correct") return;
      /*
       * `addWord` reserves this bank entry before calling us. The queue owns
       * serialization, so the next slot is derived from the committed count,
       * not from render state which can be one or more taps behind.
       */
      const slotIndex = sentenceCountRef.current;
      if (slotIndex >= slotCount) return;

      const word = shuffledWordBank[bankIndex];
      speakWord(word, `builder-word-${bankIndex}`);
      measuringBankRef.current = bankIndex;

      if (isNormal) {
        const bankWidth =
          bankCoords.current[bankIndex]?.w ??
          (await measureGameElement(bankRefs.current[bankIndex]))?.w;
        // A reset (new question) or an abort clears the lock — drop the stale flight.
        if (measuringBankRef.current !== bankIndex) return;
        if (bankWidth) await reserveLandingAnchor(bankWidth + TILE_GAP);
        if (measuringBankRef.current !== bankIndex) return;
      }

      const cachedRoot = rootCoords.current;
      const cachedBank = bankCoords.current[bankIndex];
      const cachedSlot = slotCoords.current[slotIndex];
      const [measuredRoot, measuredBank, measuredSlot] = await Promise.all([
        cachedRoot ? Promise.resolve(cachedRoot) : measureGameElement(rootRef.current),
        cachedBank ? Promise.resolve(cachedBank) : measureGameElement(bankRefs.current[bankIndex]),
        isNormal
          ? measureGameElement(slotRefs.current[slotIndex])
          : cachedSlot
            ? Promise.resolve(cachedSlot)
            : measureGameElement(slotRefs.current[slotIndex]),
      ]);

      if (measuringBankRef.current !== bankIndex) return;

      const root = measuredRoot ?? rootCoords.current;
      const bank = measuredBank ?? bankCoords.current[bankIndex];
      const slot = measuredSlot ?? slotCoords.current[slotIndex];

      if (!isUsablePoint(root) || !isUsableCoords(bank) || !isUsableCoords(slot)) {
        measuringBankRef.current = null;
        releaseLandingAnchor();
        commitAddWord(bankIndex);
        addFlightActiveRef.current = false;
        return;
      }

      setFlySessions((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          direction: "forward",
          bankIndex,
          word,
          slotIndex,
          startedAt: Date.now(),
          fromX: bank.x - root.x,
          fromY: bank.y - root.y,
          fromW: bank.w,
          fromH: bank.h,
          toX: slot.x - root.x,
          toY: slot.y - root.y,
          toW: isNormal ? bank.w : slot.w,
          toH: isNormal ? bank.h : slot.h,
        },
      ]);
      // Released only after the session exists, so the `flySessions` guard above
      // takes over without a window where neither lock is held.
      measuringBankRef.current = null;
    },
    [fb, slotCount, shuffledWordBank, commitAddWord, isNormal, speakWord, reserveLandingAnchor, releaseLandingAnchor],
  );

  const processQueuedAdds = useCallback(() => {
    if (
      fb === "correct" ||
      addFlightActiveRef.current ||
      flySessions.length > 0 ||
      measuringBankRef.current !== null
    ) return;
    if (sentenceCountRef.current >= slotCount) {
      pendingAddQueueRef.current = [];
      reservedAddCountRef.current = 0;
      return;
    }

    const nextBankIndex = pendingAddQueueRef.current.shift();
    if (nextBankIndex === undefined) return;

    addFlightActiveRef.current = true;
    void startFlyToSlot(nextBankIndex);
  }, [fb, flySessions.length, slotCount, startFlyToSlot]);

  React.useEffect(() => {
    processQueuedAddsRef.current = processQueuedAdds;
  }, [processQueuedAdds]);

  /*
   * Wait for the committed sentence render before measuring the next slot.
   * Running the next flight directly from `finishFly` can read the previous
   * anchor because React has not committed `setSentence` yet.
   */
  React.useEffect(() => {
    if (flySessions.length === 0 && !addFlightActiveRef.current) {
      processQueuedAdds();
    }
  }, [flySessions.length, sentence.length, processQueuedAdds]);

  const flySessionsRef = useRef<FlySession[]>([]);
  React.useEffect(() => {
    flySessionsRef.current = flySessions;
  }, [flySessions]);

  /*
   * Self-healing watchdog. If a flight ever loses its completion callback
   * (dropped layout event, interrupted Reanimated timing), the locks above
   * would silently disable every tap and the Check button forever — the
   * "dead screen" failure mode. Instead: expire the stale session, release
   * the locks, and place (or restore) the word instantly. Normal flights
   * finish in ~220ms, so 3s only ever trips on a genuinely lost flight.
   */
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const stuck = flySessionsRef.current.filter(
        (f) => now - f.startedAt > FLY_WATCHDOG_MS,
      );
      if (stuck.length === 0) return;
      for (const f of stuck) {
        if (f.direction === "forward") {
          // The word never landed — commit it directly so it can't vanish.
          commitAddWord(f.bankIndex);
        }
      }
      flySessionsRef.current = [];
      setFlySessions([]);
      measuringBankRef.current = null;
      addFlightActiveRef.current = false;
      releaseLandingAnchor();
    }, 500);
    return () => clearInterval(timer);
  }, [commitAddWord, releaseLandingAnchor]);

  const startFlyToBank = useCallback(
    async (placed: Placed, slotIndex: number) => {
      if (fb === "correct") return;
      // Same serialization as the forward flight: `slotCoords` is wiped below, so
      // a second tap mid-measure would read a stale slot and fly from nowhere.
      if (
        flySessions.length > 0 ||
        measuringBankRef.current !== null ||
        addFlightActiveRef.current ||
        pendingAddQueueRef.current.length > 0
      ) return;
      if (fb === "wrong") setFb("idle");

      const bankIndex = placed.bankIndex;
      measuringBankRef.current = bankIndex;

      const cachedRoot = rootCoords.current;
      const cachedBank = bankCoords.current[bankIndex];
      const cachedSlot = slotCoords.current[slotIndex];

      const [measuredRoot, measuredBank, measuredSlot] = await Promise.all([
        cachedRoot ? Promise.resolve(cachedRoot) : measureGameElement(rootRef.current),
        cachedBank ? Promise.resolve(cachedBank) : measureGameElement(bankRefs.current[bankIndex]),
        cachedSlot ? Promise.resolve(cachedSlot) : measureGameElement(slotRefs.current[slotIndex]),
      ]);

      if (measuringBankRef.current !== bankIndex) return;

      const root = measuredRoot ?? rootCoords.current;
      const bank = measuredBank ?? bankCoords.current[bankIndex];
      const slot = measuredSlot ?? slotCoords.current[slotIndex];

      // The answer slot is removed immediately so a queued bank tap can target
      // the newly opened position without waiting for the reverse FLIP to end.
      // Keep the imperative count in lock-step with that optimistic removal;
      // render state may not commit until after the next rapid touch.
      sentenceCountRef.current = Math.max(0, sentenceCountRef.current - 1);
      setSentence((current) => current.filter((item) => item.id !== placed.id));
      slotCoords.current = {};
      cellWidths.value = [];

      if (!isUsablePoint(root) || !isUsableCoords(bank) || !isUsableCoords(slot)) {
        measuringBankRef.current = null;
        setUsedBank((prev) => {
          const next = [...prev];
          next[bankIndex] = false;
          usedBankRef.current[bankIndex] = false;
          return next;
        });
        return;
      }

      setFlySessions((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          direction: "reverse",
          bankIndex,
          word: placed.word,
          slotIndex,
          startedAt: Date.now(),
          fromX: slot.x - root.x,
          fromY: slot.y - root.y,
          fromW: slot.w || bank.w,
          fromH: slot.h || bank.h,
          toX: bank.x - root.x,
          toY: bank.y - root.y,
          toW: bank.w,
          toH: bank.h,
        },
      ]);
      measuringBankRef.current = null;
    },
    [fb, flySessions.length, cellWidths],
  );

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    setSentence((prev) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= prev.length || toIndex >= prev.length) {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved!);
      return next;
    });
  }, []);

  const addWord = useCallback((bankIndex: number) => {
    if (fb === "correct" || usedBankRef.current[bankIndex]) return;
    if (sentenceCountRef.current + reservedAddCountRef.current >= slotCount) return;

    if (fb === "wrong") setFb("idle");
    usedBankRef.current[bankIndex] = true;
    reservedAddCountRef.current += 1;
    pendingAddQueueRef.current.push(bankIndex);
    setUsedBank((prev) => {
      const next = [...prev];
      next[bankIndex] = true;
      return next;
    });
    processQueuedAddsRef.current();
  }, [fb, slotCount]);

  const check = () => {
    if (
      !sentence.length ||
      flySessions.length > 0 ||
      measuringBankRef.current !== null ||
      addFlightActiveRef.current ||
      pendingAddQueueRef.current.length > 0 ||
      fb !== "idle"
    ) return;
    const placed = sentence.map((p) => p.word);
    const ok =
      placed.join(" ").toLowerCase() ===
      question.correctWords.join(" ").toLowerCase();
    setFb(ok ? "correct" : "wrong");

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 36 }),
        withTiming(8, { duration: 36 }),
        withTiming(-4, { duration: 30 }),
        withTiming(4, { duration: 30 }),
        withTiming(0, { duration: 40, easing: Easing.out(Easing.quad) }),
      );
      if (!wrongSentRef.current) {
        wrongSentRef.current = true;
        onAnswer(false);
      }
    } else if (!completedRef.current) {
      completedRef.current = true;
      speakWord(fullSentence, "builder-sentence");
      onAnswer(true);
    }
  };

  const slotTileState = (index: number): LightTileState => {
    if (index >= sentence.length) return "ghost";
    if (fb === "correct") return "correct";
    if (fb === "wrong") return "wrong";
    return "idle";
  };

  const canCheck =
    sentence.length > 0 &&
    flySessions.length === 0 &&
    measuringBankRef.current === null &&
    !addFlightActiveRef.current &&
    pendingAddQueueRef.current.length === 0 &&
    fb !== "correct";

  const answerRails = Math.max(
    MIN_RAILS,
    placedLines,
    estimateRailCount(question.correctWords, answerWidth),
  );
  const railColor = isDark ? colors.border : Duo.rail;

  return (
    <GameRoot style={{ flex: 1 }}>
      <View
        ref={rootRef}
        style={s.root}
        collapsable={false}
        onLayout={() => {
          rootRef.current?.measureInWindow((x, y) => {
            rootCoords.current = { x, y };
          });
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <GameHeader>
            <LightGameHeading
              title={t("lessons.orderWords")}
            />
          </GameHeader>

          <View style={s.exerciseArea}>
            <LightQuestionPrompt
              label={t("lessons.questionLabel")}
              forceKurdishFont
              contentLanguageCode={question.sourceLanguage}
              speechText={fullSentence}
              speechLanguageCode={targetLanguage}
              variant={pathMode === "kids" ? "kids" : "default"}
            >
              {question.kurdishSentence}
            </LightQuestionPrompt>

            <Animated.View style={[s.slotsWrap, isNormal && s.slotsWrapDuo, shakeStyle]}>
              {isNormal ? (
                <View
                  style={[s.duoAnswerArea, { height: answerRails * ROW_STRIDE }]}
                  onLayout={(e) => setAnswerWidth(e.nativeEvent.layout.width)}
                >
                  {Array.from({ length: answerRails }).map((_, i) => (
                    <View
                      key={`rail-${i}`}
                      pointerEvents="none"
                      style={[
                        s.duoRail,
                        { top: i * ROW_STRIDE + ROW_H + RAIL_DROP, backgroundColor: railColor },
                      ]}
                    />
                  ))}
                  <Animated.View
                    {...(Platform.OS === "web" ? ({ dir: targetDirection } as any) : {})}
                    style={[
                      s.duoPlacedRow,
                      { flexDirection: "row" },
                      Platform.OS !== "web" ? { direction: targetDirection } : undefined,
                    ]}
                    onLayout={(e) =>
                      setPlacedLines(linesFromHeight(e.nativeEvent.layout.height))
                    }
                  >
                    {sentence.map((placed, i) => {
                      const hideWhileFlying = flySessions.some(
                        (f) => f.direction === "forward" && f.slotIndex === i && f.bankIndex === placed.bankIndex,
                      );
                      if (hideWhileFlying) return null;
                      return (
                        <RealtimeDraggablePlacedWord
                          key={placed.id}
                          placed={placed}
                          index={i}
                          sentenceWords={sentenceWords}
                          cellWidths={cellWidths}
                          tileState={slotTileState(i)}
                          targetLanguage={question.targetLanguage}
                          isNormal={true}
                          isKids={false}
                          isRtl={isRtl}
                          activeDragIndex={activeDragIndex}
                          dragTranslationX={dragTranslationX}
                          dragTranslationY={dragTranslationY}
                          hoverTargetIndex={hoverTargetIndex}
                          onRemove={startFlyToBank}
                          onReorder={handleReorder}
                          slotRef={(r) => {
                            slotRefs.current[i] = r;
                          }}
                          onLayout={() => recordSlotLayout(i)}
                        />
                      );
                    })}
                    {/* Measurement anchor for the next incoming word */}
                    <View
                      ref={(r) => {
                        slotRefs.current[sentence.length] = r;
                      }}
                      onLayout={() => {
                        slotRefs.current[sentence.length]?.measureInWindow((x, y, w, h) => {
                          slotCoords.current[sentence.length] = { x, y, w, h };
                          resolveAnchorLayout();
                        });
                      }}
                      collapsable={false}
                      style={[s.duoLandingAnchor, { width: anchorWidth }]}
                    />
                  </Animated.View>
                </View>
              ) : (
                <Animated.View
                  {...(Platform.OS === "web" ? ({ dir: targetDirection } as any) : {})}
                  style={[
                    s.slotsRow,
                    { flexDirection: "row" },
                    Platform.OS !== "web" ? { direction: targetDirection } : undefined,
                  ]}
                >
                  {Array.from({ length: slotCount }).map((_, i) => {
                    const placed = sentence[i];
                    const hideWhileFlying = placed !== undefined && flySessions.some(s => s.direction === "forward" && s.slotIndex === i && s.bankIndex === placed.bankIndex);

                    return (
                      <View
                        key={`slot-${i}`}
                        ref={(r) => {
                          slotRefs.current[i] = r;
                        }}
                        onLayout={() => recordSlotLayout(i)}
                        collapsable={false}
                        style={s.slotCell}
                      >
                        {placed && !hideWhileFlying ? (
                          <RealtimeDraggablePlacedWord
                            placed={placed}
                            index={i}
                            sentenceWords={sentenceWords}
                            cellWidths={cellWidths}
                            tileState={slotTileState(i)}
                            targetLanguage={question.targetLanguage}
                            isNormal={false}
                            isKids={pathMode === "kids"}
                            isRtl={isRtl}
                            activeDragIndex={activeDragIndex}
                            dragTranslationX={dragTranslationX}
                            dragTranslationY={dragTranslationY}
                            hoverTargetIndex={hoverTargetIndex}
                            onRemove={startFlyToBank}
                            onReorder={handleReorder}
                            slotRef={(r) => {
                              slotRefs.current[i] = r;
                            }}
                            onLayout={() => recordSlotLayout(i)}
                          />
                        ) : (
                          <View
                            style={[
                              pathMode === "kids" ? s.emptySlot : s.emptySlotDuo,
                              isDark && {
                                backgroundColor: colors.muted,
                                borderColor: colors.border,
                              },
                            ]}
                          />
                        )}
                      </View>
                    );
                  })}
                </Animated.View>
              )}
            </Animated.View>

            <View style={s.wordBankSpacer} />
            {!isNormal ? <View style={s.bankDivider} /> : null}

            <Animated.View
              {...(Platform.OS === "web" ? ({ dir: targetDirection } as any) : {})}
              style={[
                s.bank,
                isNormal && s.bankDuo,
                { flexDirection: "row" },
                Platform.OS !== "web" ? { direction: targetDirection } : undefined,
              ]}
            >
              {shuffledWordBank.map((w, i) => {
                const taken = usedBank[i];

                if (isNormal) {
                  return (
                    <View
                      key={`bank-${i}`}
                      ref={(el) => { bankRefs.current[i] = el; }}
                      onLayout={() => {
                        bankRefs.current[i]?.measureInWindow((x, y, w, h) => {
                          bankCoords.current[i] = { x, y, w, h };
                        });
                      }}
                      collapsable={false}
                      style={s.bankCellDuo}
                    >
                      <LightWordTile
                        label={w}
                        state={taken ? "ghost" : "idle"}
                        onPress={taken ? undefined : () => addWord(i)}
                        activateOnPressIn
                        duoDepthStyle="subtle"
                        disabled={taken || fb === "correct"}
                        languageCode={question.targetLanguage}
                        style={s.duoWordTile}
                      />
                    </View>
                  );
                }

                return (
                  <View
                    key={`bank-${i}`}
                    ref={(el) => { bankRefs.current[i] = el; }}
                    onLayout={() => {
                      bankRefs.current[i]?.measureInWindow((x, y, w, h) => {
                        bankCoords.current[i] = { x, y, w, h };
                      });
                    }}
                    collapsable={false}
                    style={s.bankCell}
                  >
                    <View
                      style={[
                        s.bankPlaceholder,
                        isDark && {
                          backgroundColor: colors.muted,
                          borderColor: colors.border,
                        },
                      ]}
                    />
                    <View style={{ zIndex: 10, opacity: taken ? 0 : 1 }} pointerEvents={taken ? "none" : "auto"}>
                      <LightWordTile
                        label={w}
                        state="idle"
                        onPress={() => addWord(i)}
                        activateOnPressIn
                        disabled={taken || fb !== "idle"}
                        isKids={pathMode === "kids"}
                        languageCode={question.targetLanguage}
                        fitLabel
                        fontSize={w.length > 10 ? 13 : 15}
                        style={[s.wordTile, compact && s.wordTileCompact]}
                      />
                    </View>
                  </View>
                );
              })}
            </Animated.View>
          </View>
        </ScrollView>
      </View>

      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
        {flySessions.length > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={s.flyLayer}
            collapsable={false}
          >
            {flySessions.map(session => (
              <FlyingTile
                key={session.id}
                session={session}
                onFinish={finishFly}
                isKids={pathMode === "kids"}
                isNormal={isNormal}
                languageCode={question.targetLanguage}
              />
            ))}
          </Animated.View>
        ) : null}
      </View>

      <GameFooter delay={200}>
        <View
          style={[
            s.footerWrap,
            { backgroundColor: colors.background, borderTopColor: colors.border },
            pathMode === "kids" && { backgroundColor: "transparent", borderTopWidth: 0 },
            isNormal && s.footerWrapDuo,
          ]}
        >
          <LightCheckButton
            label={t("lessons.check")}
            onPress={check}
            disabled={!canCheck}
            variant={pathMode === "kids" ? "kids" : "default"}
          />
        </View>
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 24,
  },
  exerciseArea: {
    flex: 1,
  },
  footerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: L.bg,
    borderTopWidth: 1,
    borderTopColor: L.border,
  },
  footerWrapDuo: {
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  bank: {
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: 6,
    paddingBottom: 4,
  },
  wordBankSpacer: {
    flex: 1,
    minHeight: 56,
  },
  bankCell: {
    position: "relative",
    marginHorizontal: 4,
    marginVertical: 5,
  },
  bankPlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
  },
  slotsWrap: {
    minHeight: 118,
    paddingTop: 16,
    paddingBottom: 6,
  },
  slotsWrapDuo: {
    minHeight: 0,
    paddingTop: 26,
    paddingBottom: 0,
  },
  duoAnswerArea: {
    width: "100%",
    position: "relative",
  },
  duoPlacedRow: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  duoPlacedCell: {
    height: ROW_H,
    marginEnd: TILE_GAP,
    marginBottom: ROW_GAP,
    flexGrow: 0,
    flexShrink: 0,
  },
  duoLandingAnchor: {
    height: ROW_H,
    marginBottom: ROW_GAP,
  },
  duoRail: {
    position: "absolute",
    left: 0,
    right: 0,
    height: RAIL_H,
    borderRadius: RAIL_RADIUS,
  },
  duoWordTile: {
    height: ROW_H,
    minHeight: ROW_H,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  bankDuo: {
    paddingTop: 4,
    paddingBottom: 4,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  bankCellDuo: {
    height: ROW_H,
    marginEnd: TILE_GAP,
    marginBottom: 8,
  },
  slotsRow: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  slotCell: {
    width: 74,
    height: 48,
    marginHorizontal: 2,
    marginVertical: 5,
  },
  wordTile: {
    minHeight: 42,
    maxWidth: 156,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  wordTileCompact: {
    maxWidth: 128,
  },
  slotWordTile: {
    width: 74,
    height: 48,
    minHeight: 48,
    paddingHorizontal: 2,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptySlot: {
    width: 74,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptySlotDuo: {
    width: 74,
    height: 48,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: Duo.border,
    backgroundColor: "transparent",
  },
  bankDivider: {
    height: 2,
    backgroundColor: Duo.border,
    marginHorizontal: 8,
    borderRadius: 1,
  },
  flyLayer: {
    bottom: 0,
    zIndex: 40,
  },
  flySessionLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "flex-start",
  },
  flyTileFill: {
    flex: 1,
    justifyContent: "center",
  },
  flyWordTile: {
    width: "100%",
    height: "100%",
    minHeight: 0,
    paddingHorizontal: 2,
    paddingVertical: 4,
    borderRadius: 12,
  },
  flyWordTileDuo: {
    width: "100%",
    height: "100%",
    minHeight: 0,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
});
