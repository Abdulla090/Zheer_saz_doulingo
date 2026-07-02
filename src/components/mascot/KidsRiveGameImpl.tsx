import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  Alignment,
  DataBindMode,
  Fit,
  RiveView,
  useRive,
  useRiveFile,
  useViewModelInstance,
} from "@rive-app/react-native";

const ARTBOARD_NAME = "withLayout";

interface KidsRiveGameImplProps {
  correct: boolean | null;
  selectedOptionIndex: number | null;
  progress: number; // 0 to 100
  prompt?: string;
  options?: string[];
  onSelectOption?: (index: number) => void;
  onSubmit?: () => void;
  title?: string;
  hearts?: number;
  onBack?: () => void;
  exerciseIndex?: number;
  totalExercises?: number;
  hideHeader?: boolean;
}

const RIVE_SOURCE = require("../../../assets/rive/kids_interactive.riv");
const VIEW_MODEL_NAME = "viewModel";

export default function KidsRiveGameImpl({
  correct,
  selectedOptionIndex,
  progress,
  prompt,
  options,
  onSelectOption,
  onSubmit,
  title,
  hearts,
  onBack,
  exerciseIndex,
  totalExercises,
  hideHeader,
}: KidsRiveGameImplProps) {
  const { riveFile, isLoading, error } = useRiveFile(RIVE_SOURCE);
  const { setHybridRef, riveViewRef } = useRive();

  const { instance: viewModelInstance } = useViewModelInstance(
    riveFile,
    { viewModelName: VIEW_MODEL_NAME }
  );

  const { instance: boundInstance } = useViewModelInstance(riveViewRef);
  const vmInstance = boundInstance ?? viewModelInstance;

  // Track last correct status to detect transitions
  const lastCorrectRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!vmInstance) return;

    const unsubs: (() => void)[] = [];

    try {
      // 1. Update progress
      const numProg = vmInstance.numberProperty("numberProgress");
      if (numProg) numProg.value = progress;

      const greenProg = vmInstance.numberProperty("greenProgress");
      if (greenProg) greenProg.value = progress;

      // 1b. Update hearts count if available
      if (hearts !== undefined) {
        const heartsProp = vmInstance.numberProperty("hearts") ?? vmInstance.numberProperty("numberHearts");
        if (heartsProp) heartsProp.value = hearts;
      }

      // 2. Update selections
      const notSel1 = vmInstance.booleanProperty("notSelected1");
      const notSel2 = vmInstance.booleanProperty("notSelected2");
      const notSel3 = vmInstance.booleanProperty("notSelected3");
      const notSel4 = vmInstance.booleanProperty("notSelected4");

      if (selectedOptionIndex !== null) {
        if (notSel1) notSel1.value = selectedOptionIndex !== 0;
        if (notSel2) notSel2.value = selectedOptionIndex !== 1;
        if (notSel3) notSel3.value = selectedOptionIndex !== 2;
        if (notSel4) notSel4.value = selectedOptionIndex !== 3;

        // Set pressed/selected states
        const isPres = vmInstance.booleanProperty("isPressed") ?? vmInstance.booleanProperty("pressed") ?? vmInstance.booleanProperty("selected");
        if (isPres) isPres.value = true;
      } else {
        if (notSel1) notSel1.value = true;
        if (notSel2) notSel2.value = true;
        if (notSel3) notSel3.value = true;
        if (notSel4) notSel4.value = true;

        const isPres = vmInstance.booleanProperty("isPressed") ?? vmInstance.booleanProperty("pressed") ?? vmInstance.booleanProperty("selected");
        if (isPres) isPres.value = false;
      }

      // 3. Update correct/wrong states & trigger animations
      if (correct === true) {
        const corrAns = vmInstance.booleanProperty("correctAnwser") ?? vmInstance.booleanProperty("isCorrect");
        if (corrAns) corrAns.value = true;

        const wrongAns = vmInstance.booleanProperty("isWrong");
        if (wrongAns) wrongAns.value = false;

        // Trigger playCorrect on transition to correct
        if (lastCorrectRef.current !== true) {
          const playCorr = vmInstance.triggerProperty("playCorrect");
          if (playCorr) playCorr.trigger();
        }
      } else if (correct === false) {
        const corrAns = vmInstance.booleanProperty("correctAnwser") ?? vmInstance.booleanProperty("isCorrect");
        if (corrAns) corrAns.value = false;

        const wrongAns = vmInstance.booleanProperty("isWrong");
        if (wrongAns) wrongAns.value = true;

        // Trigger playWrong on transition to wrong
        if (lastCorrectRef.current !== false) {
          const playWr = vmInstance.triggerProperty("playWrong");
          if (playWr) playWr.trigger();
        }
      } else {
        // correct === null (idle / active)
        const corrAns = vmInstance.booleanProperty("correctAnwser") ?? vmInstance.booleanProperty("isCorrect");
        if (corrAns) corrAns.value = false;

        const wrongAns = vmInstance.booleanProperty("isWrong");
        if (wrongAns) wrongAns.value = false;

        if (lastCorrectRef.current !== null) {
          const playId = vmInstance.triggerProperty("playIdle");
          if (playId) playId.trigger();
        }
      }

      lastCorrectRef.current = correct;

      // 4. Listen to state machine triggers for option clicks and next actions
      const tB1 = vmInstance.triggerProperty("triggerBanner1");
      const tB2 = vmInstance.triggerProperty("triggerBanner2");
      const tB3 = vmInstance.triggerProperty("triggerBanner3");
      const tNext = vmInstance.triggerProperty("triggerNEXT");

      if (tB1) {
        unsubs.push(tB1.addListener(() => {
          console.log("[KidsRiveGame] triggerBanner1 fired");
          onSelectOption?.(0);
        }));
      }
      if (tB2) {
        unsubs.push(tB2.addListener(() => {
          console.log("[KidsRiveGame] triggerBanner2 fired");
          onSelectOption?.(1);
        }));
      }
      if (tB3) {
        unsubs.push(tB3.addListener(() => {
          console.log("[KidsRiveGame] triggerBanner3 fired");
          onSelectOption?.(2);
        }));
      }
      if (tNext) {
        unsubs.push(tNext.addListener(() => {
          console.log("[KidsRiveGame] triggerNEXT fired");
          onSubmit?.();
        }));
      }
    } catch (e) {
      console.warn("[KidsRiveGame] Error updating VM properties:", e);
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [vmInstance, correct, selectedOptionIndex, progress, hearts, onSelectOption, onSubmit]);

  // Set text runs for prompt & options if available
  useEffect(() => {
    if (!riveViewRef) return;

    const updateTextRuns = async () => {
      try {
        if (typeof riveViewRef.awaitViewReady === "function") {
          await riveViewRef.awaitViewReady();
        }

        if (typeof riveViewRef.setTextRunValue === "function") {
          const setTextRun = (name: string, value: string) => {
            riveViewRef.setTextRunValue(name, value);
            riveViewRef.setTextRunValue(name, value, ARTBOARD_NAME);
          };

          // Update option labels if present
          if (options && options.length > 0) {
            options.forEach((opt, idx) => {
              setTextRun(`option${idx + 1}`, opt);
            });
            // Clear remaining options if less than 4
            for (let idx = options.length; idx < 4; idx++) {
              setTextRun(`option${idx + 1}`, "");
            }
          }

          // Update main question prompt if present (spelled without 'e' inside Rive)
          if (prompt) {
            setTextRun("Qustion", prompt);
          }

          // Update bottom button text
          setTextRun("btmText", correct === null ? "check" : "continue");

          // Update translated Header/Title run
          if (exerciseIndex && totalExercises) {
            setTextRun("HD", `EXERCISE ${exerciseIndex} OF ${totalExercises}`);
          } else if (title) {
            setTextRun("HD", title);
          }
        }
      } catch (e) {
        console.warn("[KidsRiveGame] Error setting text runs:", e);
      }
    };

    updateTextRuns();
  }, [riveViewRef, prompt, options, correct, title, exerciseIndex, totalExercises]);

  if (isLoading || error) {
    // Return empty view during loading/error
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <RiveView
        hybridRef={setHybridRef}
        file={riveFile}
        artboardName={ARTBOARD_NAME}
        stateMachineName="State Machine 1"
        dataBind={viewModelInstance ?? DataBindMode.None}
        autoPlay
        fit={Fit.Contain}
        alignment={Alignment.Center}
        style={styles.rive}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  rive: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
