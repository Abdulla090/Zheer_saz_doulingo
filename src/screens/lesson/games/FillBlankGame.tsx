

import { useI18n } from "../../../hooks/useI18n";
import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { layoutSmooth, wordTileMorphTiming } from "../../../components/animations/motion";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "../../../components/ui/AppText";
import { DirectionalView } from "../../../components/ui/Directional";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useWordSpeech } from "./use-word-speech";

import { FillBlankQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { GameFooter, GameHeader, GameRoot } from "./GameAnimatedShell";
import { measureGameElement } from "./game-layout-measure";
import { L, Duo } from "./lesson-light-design";
import { RAIL_H, RAIL_RADIUS } from "./duo-answer-rails";
import {
  LightCheckButton,
  LightGameHeading,
  LightQuestionPrompt,
  LightSurfaceCard,
  LightWordTile,
  mapOptionState,
} from "./lesson-light-primitives";

type FlySession = {
  id: string;
  word: string;
  fromX: number;
  fromY: number;
  fromW: number;
  fromH: number;
  toX: number;
  toY: number;
  toW: number;
  toH: number;
};

function FlyingTile({ session, onFinish, isKids, languageCode }: { session: FlySession; onFinish: (id: string, word: string) => void; isKids?: boolean; languageCode?: string }) {
  const flyProgress = useSharedValue(0);
  const flyStyle = useAnimatedStyle(() => {
    const p = flyProgress.value;
    return {
      width: interpolate(p, [0, 1], [session.fromW, session.toW]),
      height: interpolate(p, [0, 1], [session.fromH, session.toH]),
      transform: [
        { translateX: interpolate(p, [0, 1], [session.fromX, session.toX]) },
        { translateY: interpolate(p, [0, 1], [session.fromY, session.toY]) },
      ],
      opacity: 1,
    };
  });

  React.useEffect(() => {
    flyProgress.value = withTiming(1, wordTileMorphTiming, (finished) => {
      if (finished) runOnJS(onFinish)(session.id, session.word);
    });
  }, [session, onFinish, flyProgress]);

  return (
    <DirectionalView languageCode={languageCode ?? "en"} style={s.flySessionLayer}>
      <Animated.View style={flyStyle}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <LightWordTile label={session.word} state="pending" isKids={isKids} languageCode={languageCode} />
        </View>
      </Animated.View>
    </DirectionalView>
  );
}

type Props = {
  question: FillBlankQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
  questionIndex?: number;
  totalQuestions?: number;
};

export default function FillBlankGame({ question, onAnswer, pathMode, questionIndex, totalQuestions }: Props) {
  const { t } = useI18n();
  const { colors, isDark } = useThemeColors();
  const { speakWord, stop, language: targetLanguage } = useWordSpeech(question.targetLanguage);
  const isNormal = pathMode === "normal";
  const [selected, setSelected] = useState<string | null>(null);
  const [flySession, setFlySession] = useState<FlySession | null>(null);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);
  const measuringWordRef = useRef<string | null>(null);
  
  const rootRef = useRef<View>(null);
  const blankRef = useRef<View>(null);
  const bankRefs = useRef<Record<string, View | null>>({});

  const rootCoords = useRef<{ x: number; y: number } | null>(null);
  const bankCoords = useRef<Record<string, { x: number; y: number; w: number; h: number }>>({});
  const blankCoords = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const flyIdCounter = useRef(0);

  const fullSentence = React.useMemo(
    () =>
      `${question.sentenceParts[0] ?? ""} ${question.correctAnswer} ${question.sentenceParts[1] ?? ""}`,
    [question.sentenceParts, question.correctAnswer],
  );

  React.useEffect(() => {
    void stop();
    setSelected(null);
    setFlySession(null);
    setRevealed(false);
    firedRef.current = false;
    measuringWordRef.current = null;
    bankCoords.current = {};
    blankCoords.current = null;
  }, [question, stop]);

  React.useEffect(() => () => {
    void stop();
  }, [stop]);

  const finishFly = useCallback((_id: string, word: string) => {
    setSelected(word);
    setFlySession(null);
  }, []);

  const pick = async (word: string) => {
    if (revealed) return;
    if (selected === word) return;
    if (flySession || measuringWordRef.current) return;

    speakWord(word, `fill-${word}`);

    measuringWordRef.current = word;
    const cachedRoot = rootCoords.current;
    const cachedBank = bankCoords.current[word];
    const cachedTarget = blankCoords.current;
    const [measuredRoot, measuredBank, measuredTarget] = await Promise.all([
      cachedRoot ? Promise.resolve(cachedRoot) : measureGameElement(rootRef.current),
      cachedBank ? Promise.resolve(cachedBank) : measureGameElement(bankRefs.current[word]),
      cachedTarget ? Promise.resolve(cachedTarget) : measureGameElement(blankRef.current),
    ]);

    if (measuringWordRef.current !== word) return;

    const root = measuredRoot ?? rootCoords.current;
    const bank = measuredBank ?? bankCoords.current[word];
    const target = measuredTarget ?? blankCoords.current;
    measuringWordRef.current = null;

    if (!root || !bank || !target) {
      setSelected(word);
      return;
    }

    flyIdCounter.current += 1;
    setFlySession({
      id: `fly_${flyIdCounter.current}`,
      word,
      fromX: bank.x - root.x,
      fromY: bank.y - root.y,
      fromW: bank.w,
      fromH: bank.h,
      toX: target.x - root.x + (target.w - bank.w) / 2,
      toY: target.y - root.y + (target.h - bank.h) / 2,
      toW: bank.w,
      toH: bank.h,
    });
  };

  const check = () => {
    if (!selected || revealed) return;
    setRevealed(true);
    const ok = selected === question.correctAnswer;

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 36 }),
        withTiming(8, { duration: 36 }),
        withTiming(0, { duration: 40, easing: Easing.out(Easing.quad) }),
      );
    }

    /*
     * Only a correct answer earns the sentence read — hearing the finished
     * sentence is the reward, and reading it back over a wrong pick would
     * teach the wrong thing. `revealed` above makes this run once per
     * question; being the newest device request makes `useTTS` cancel the
     * word audio from `pick` rather than layer on top of it.
     */
    if (ok) {
      speakWord(fullSentence, "fill-sentence");
    }

    if (!firedRef.current) {
      firedRef.current = true;
      onAnswer(ok);
    }
  };

  const getState = (w: string) => {
    if (!revealed) return w === selected ? "selected" : "idle";
    if (w === selected) {
      return w === question.correctAnswer ? "correct" : "wrong";
    }
    return "idle";
  };

  const shuffledOptions = React.useMemo(() => {
    const opts = [...question.options];
    let seed = 0;
    for (const opt of question.options) {
      for (let i = 0; i < opt.length; i++) {
        seed = opt.charCodeAt(i) + ((seed << 5) - seed);
      }
    }
    const a = [...opts];
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      const j = Math.abs(s) % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [question.options]);

  /*
   * The empty blank reserves the width its answer will need, so the sentence
   * does not reflow the moment a word lands in it. Sized from the *longest*
   * option, not the correct one — a wrong pick must not resize the row either.
   *
   * Deliberately no upper clamp: any ceiling below the tile's natural width
   * puts the reflow straight back, because the tile grows with its content
   * regardless. 35 answers in the content set are multi-word phrases ("public
   * transport", "on the other hand") that need >220dp. If the result is wider
   * than the row, the blank takes its own line — but it does so identically
   * before and after answering, which is the property that matters.
   *
   * Estimated rather than measured (a measure pass would cost the very layout
   * jump this avoids), and biased generous: too wide is invisible, too narrow
   * reflows.
   */
  const blankWidth = React.useMemo(() => {
    const longest = [question.correctAnswer, ...question.options].reduce(
      (a, b) => (b.length > a.length ? b : a),
      "",
    );
    const fontSize = isNormal ? 25 : 19;
    const padding = isNormal ? 34 : 42;
    return Math.round(Math.max(96, longest.length * fontSize * 0.58 + padding));
  }, [question.correctAnswer, question.options, isNormal]);

  const blankBorder =
    revealed && selected
      ? selected === question.correctAnswer
        ? (isNormal ? Duo.green : L.green)
        : (isNormal ? Duo.red : L.red)
      : selected || flySession
        ? (isNormal ? Duo.accent : L.blue)
        : isNormal
          ? Duo.rail
          : isDark
            ? colors.border
            : L.slotDash;

  /*
   * The sentence is rendered one word per flex item rather than as two big
   * `<Text>` blocks. A whole fragment is a single flex item, so as soon as the
   * blank grows wide enough that the remainder no longer fits beside it, that
   * entire fragment jumps to the next line and leaves a gap after the blank —
   * the sentence visibly "breaks" mid-clause. Word-level items wrap the way
   * running text does: they fill the space next to the blank and only spill
   * over the word that genuinely doesn't fit.
   */
  const leadTokens = React.useMemo(() => {
    const raw = question.sentenceParts[0]?.trimEnd() ?? "";
    return raw ? raw.split(/\s+/).filter(Boolean) : [];
  }, [question.sentenceParts]);

  /*
   * Punctuation that opens the tail (",", "!", "?") belongs to the blank and
   * must never start a line on its own, so it is glued into the blank's group.
   * The rest of the tail wraps word by word.
   */
  const { gluedPunctuation, tailTokens } = React.useMemo(() => {
    const raw = question.sentenceParts[1]?.trimStart() ?? "";
    if (!raw) return { gluedPunctuation: "", tailTokens: [] as string[] };
    const glued = raw.match(/^[,.!?;:%)\]}'"؛؟،]+/)?.[0] ?? "";
    const rest = raw.slice(glued.length).trim();
    return {
      gluedPunctuation: glued,
      tailTokens: rest ? rest.split(/\s+/).filter(Boolean) : [],
    };
  }, [question.sentenceParts]);

  const kidsBadgeText = pathMode === "kids" && questionIndex !== undefined && totalQuestions !== undefined
    ? `EXERCISE ${questionIndex + 1} OF ${totalQuestions}`
    : undefined;

  return (
    <GameRoot style={s.root}>
      <View
        ref={rootRef}
        style={{ flex: 1 }}
        collapsable={false}
        onLayout={() => {
          rootRef.current?.measureInWindow((x, y) => {
            rootCoords.current = { x, y };
          });
        }}
      >
      <GameHeader>
        <LightGameHeading
          title={t("lessons.fillBlank")}
          badge={kidsBadgeText}
        />
      </GameHeader>

      {/*
        Exercise area owns the slack between the header and the word bank, and
        centres its content in it. Short prompts therefore sit optically centred
        instead of clinging to the top with a void beneath them; long ones fill
        the space and the group behaves exactly as a top-aligned stack.
      */}
      <View style={s.exerciseArea}>
        <LightQuestionPrompt
          label={t("lessons.questionLabel")}
          forceKurdishFont
          contentLanguageCode={question.sourceLanguage}
          speechText={fullSentence}
          speechLanguageCode={targetLanguage}
          variant={pathMode === "kids" ? "kids" : "default"}
        >
          {question.kurdishHint}
        </LightQuestionPrompt>

        <Animated.View style={shakeStyle}>
          <LightSurfaceCard>
          <Animated.View layout={layoutSmooth} style={s.sentenceRow}>
            <DirectionalView languageCode={question.targetLanguage ?? "en"} style={s.sentenceLeadRow}>
              {leadTokens.map((word, i) => (
                <AppText
                  key={`lead_${i}`}
                  languageCode={question.targetLanguage}
                  align="start"
                  style={[s.sentenceText, isNormal && s.sentenceTextDuo, { color: colors.foreground }]}
                >
                  {word}{" "}
                </AppText>
              ))}
              <Animated.View
                ref={blankRef}
                layout={layoutSmooth}
                collapsable={false}
                style={[s.blankContainer, { minWidth: blankWidth }]}
                onLayout={() => {
                  blankRef.current?.measureInWindow((x, y, w, h) => {
                    blankCoords.current = { x, y, w, h };
                  });
                }}
              >
                  {selected && !flySession ? (
                    <Animated.View layout={layoutSmooth}>
                      <LightWordTile
                        label={selected}
                        state={mapOptionState(getState(selected))}
                        onPress={() => {
                          if (revealed) return;
                          setSelected(null);
                        }}
                        activateOnPressIn={Platform.OS !== "web"}
                        isKids={pathMode === "kids"}
                        languageCode={question.targetLanguage}
                        style={[
                          isNormal && s.duoBlankTile,
                          /* Same floor as the empty slot — see `blankWidth`. */
                          { minWidth: blankWidth },
                        ]}
                      />
                    </Animated.View>
                  ) : isNormal ? (
                    /* Empty blank: a coloured rail sitting on the text baseline. */
                    <View style={[s.duoBlankSlot, { width: blankWidth }]}>
                      <View style={[s.duoBlankRail, { backgroundColor: blankBorder }]} />
                    </View>
                  ) : pathMode === "kids" ? (
                    <View style={[
                      s.emptySlot,
                      {
                        width: blankWidth,
                        borderColor: blankBorder,
                        backgroundColor: isDark ? colors.muted : L.bgSoft,
                      },
                    ]}>
                      <AppText
                        languageCode={question.targetLanguage}
                        align="center"
                        style={[s.blankPlaceholder, { color: colors.mutedForeground }]}
                      >
                        ____
                      </AppText>
                    </View>
                  ) : (
                    <View style={[
                      s.emptySlotDuo,
                      {
                        width: blankWidth,
                        borderBottomColor: blankBorder,
                        backgroundColor: isDark ? colors.muted : "transparent",
                      },
                    ]} />
                  )}
                </Animated.View>
                {gluedPunctuation ? (
                  <AppText
                    languageCode={question.targetLanguage}
                    align="start"
                    style={[s.sentenceText, isNormal && s.sentenceTextDuo, { color: colors.foreground }]}
                  >
                    {gluedPunctuation}{" "}
                  </AppText>
                ) : (
                  /* Space between the blank and the first tail word. */
                  tailTokens.length ? (
                    <AppText
                      languageCode={question.targetLanguage}
                      align="start"
                      style={[s.sentenceText, isNormal && s.sentenceTextDuo, { color: colors.foreground }]}
                    >
                      {" "}
                    </AppText>
                  ) : null
                )}
                {tailTokens.map((word, i) => (
                  <AppText
                    key={`tail_${i}`}
                    languageCode={question.targetLanguage}
                    align="start"
                    style={[s.sentenceText, isNormal && s.sentenceTextDuo, { color: colors.foreground }]}
                  >
                    {word}{i < tailTokens.length - 1 ? " " : ""}
                  </AppText>
                ))}
            </DirectionalView>
          </Animated.View>
        </LightSurfaceCard>
        </Animated.View>
      </View>

      <DirectionalView languageCode={question.targetLanguage ?? "en"} style={s.chipsWrap}>
        {shuffledOptions.map((w) => {
          const isFlying = flySession?.word === w;
          const isSelected = selected === w;
          const isTaken = isFlying || isSelected;

          return (
            <View
              key={w}
              ref={(el) => { bankRefs.current[w] = el; }}
              collapsable={false}
              style={{ opacity: isFlying ? 0 : 1 }}
              pointerEvents={isTaken ? "none" : "auto"}
              onLayout={() => {
                bankRefs.current[w]?.measureInWindow((x, y, w, h) => {
                  bankCoords.current[w] = { x, y, w, h };
                });
              }}
            >
              <LightWordTile
                label={w}
                state={isTaken ? "ghost" : mapOptionState(getState(w))}
                onPress={() => pick(w)}
                activateOnPressIn={Platform.OS !== "web"}
                disabled={revealed || isTaken}
                isKids={pathMode === "kids"}
                languageCode={question.targetLanguage}
              />
            </View>
          );
        })}
      </DirectionalView>

      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
        {flySession ? (
          <Animated.View
            pointerEvents="none"
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
            collapsable={false}
          >
            <FlyingTile session={flySession} onFinish={finishFly} isKids={pathMode === "kids"} languageCode={question.targetLanguage} />
          </Animated.View>
        ) : null}
      </View>

      <GameFooter>
        <LightCheckButton
          label={t("lessons.check")}
          onPress={check}
          disabled={!selected || revealed || !!flySession}
          variant={pathMode === "kids" ? "kids" : "default"}
        />
      </GameFooter>
      </View>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 24,
  },
  sentenceRow: {
    alignItems: "stretch",
    gap: 8,
  },
  sentenceLeadRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    /*
     * Zero gap: the sentence fragments carry their own spaces (see the
     * trimEnd/trimStart at the call site), and a flex gap here would add a
     * second space around the blank that the answered sentence doesn't have.
     */
    gap: 0,
    rowGap: 6,
  },
  sentenceText: {
    fontSize: 19,
    fontWeight: "700",
    color: L.navy,
    lineHeight: 28,
    fontFamily: "Rabar_044",
    backgroundColor: "transparent",
  },
  /** Normal path reads at display size, matching the reference. */
  sentenceTextDuo: {
    fontSize: 25,
    lineHeight: 36,
    fontWeight: "600",
    fontFamily: "Rabar_044",
  },
  blankContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  duoBlankSlot: {
    /* Width comes from `blankWidth` at the call site. */
    height: 52,
    justifyContent: "flex-end",
    paddingBottom: 6,
  },
  duoBlankRail: {
    height: RAIL_H,
    width: "100%",
    borderRadius: RAIL_RADIUS,
  },
  duoBlankTile: {
    minHeight: 52,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  emptySlot: {
    /* Width comes from `blankWidth` at the call site. */
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  emptySlotDuo: {
    /* Width comes from `blankWidth` at the call site. */
    height: 48,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: Duo.border,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  blankPlaceholder: {
    fontSize: 17,
    fontWeight: "800",
    color: L.navy,
    fontFamily: "Rabar_044",
    opacity: 0.35,
  },
  exerciseArea: {
    /*
     * Replaces the old flex:1 spacer that used to sit *below* the sentence.
     * Owning the slack here instead lets the prompt + sentence centre within it
     * (see `justifyContent`), which is what stops a short exercise from sitting
     * jammed against the header.
     */
    flex: 1,
    justifyContent: "center",
    gap: 24,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginBottom: 24,
    width: "100%",
  },
  flySessionLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "flex-start",
  },
});
