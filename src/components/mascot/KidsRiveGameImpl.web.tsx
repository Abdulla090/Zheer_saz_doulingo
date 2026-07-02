import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useRive, EventType } from "@rive-app/react-canvas";

interface KidsRiveGameImplProps {
  correct: boolean | null;
  selectedOptionIndex: number | null;
  progress: number;
  prompt?: string;
  options?: string[];
  onSelectOption?: (index: number) => void;
  onSubmit?: () => void;
  title?: string;
}

const RIVE_SOURCE = require("../../../assets/rive/kids_interactive.riv");

export default function KidsRiveGameImpl({
  correct,
  selectedOptionIndex,
  progress,
  prompt,
  options,
  onSelectOption,
  onSubmit,
  title,
}: KidsRiveGameImplProps) {
  const { rive, RiveComponent } = useRive({
    src: RIVE_SOURCE,
    artboard: "withLayout",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const lastCorrectRef = useRef<boolean | null>(null);

  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    if (!rive) return;

    const readyTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 0);

    if ((rive as any).isLoaded) {
      setTimeout(() => setIsLoaded(true), 0);
    }

    const handleLoad = () => {
      console.log("[Rive Web] loaded event fired");
      setIsLoaded(true);
    };

    rive.on("load" as any, handleLoad);
    return () => {
      clearTimeout(readyTimer);
      rive.off("load" as any, handleLoad);
    };
  }, [rive]);

  const setTextRun = React.useCallback((name: string, value: string) => {
    const api = rive as any;
    if (!api) return;

    if (typeof api.setTextRunValue === "function") {
      api.setTextRunValue(name, value);
    }
  }, [rive]);

  // Update inputs in response to prop changes
  useEffect(() => {
    if (!rive || !isLoaded) return;

    try {
      const smNames = (rive as any).stateMachineNames || (rive as any).artboard?.stateMachineNames || [];
      const activeSmName = smNames[0] || "State Machine 1";
      const inputs = rive.stateMachineInputs(activeSmName);

      if (!inputs) return;

      // 1. Update progress inputs
      const numProg = inputs.find((i: any) => i.name === "numberProgress");
      if (numProg) numProg.value = progress;

      const greenProg = inputs.find((i: any) => i.name === "greenProgress");
      if (greenProg) greenProg.value = progress;

      // 2. Update selections
      const notSel1 = inputs.find((i: any) => i.name === "notSelected1");
      const notSel2 = inputs.find((i: any) => i.name === "notSelected2");
      const notSel3 = inputs.find((i: any) => i.name === "notSelected3");
      const notSel4 = inputs.find((i: any) => i.name === "notSelected4");

      if (selectedOptionIndex !== null) {
        if (notSel1) notSel1.value = selectedOptionIndex !== 0;
        if (notSel2) notSel2.value = selectedOptionIndex !== 1;
        if (notSel3) notSel3.value = selectedOptionIndex !== 2;
        if (notSel4) notSel4.value = selectedOptionIndex !== 3;

        const isPres = inputs.find((i: any) => i.name === "isPressed" || i.name === "pressed" || i.name === "selected");
        if (isPres) isPres.value = true;
      } else {
        if (notSel1) notSel1.value = true;
        if (notSel2) notSel2.value = true;
        if (notSel3) notSel3.value = true;
        if (notSel4) notSel4.value = true;

        const isPres = inputs.find((i: any) => i.name === "isPressed" || i.name === "pressed" || i.name === "selected");
        if (isPres) isPres.value = false;
      }

      // 3. Update correct/wrong & trigger animations
      if (correct === true) {
        const corrAns = inputs.find((i: any) => i.name === "correctAnwser" || i.name === "isCorrect");
        if (corrAns) corrAns.value = true;

        const wrongAns = inputs.find((i: any) => i.name === "isWrong");
        if (wrongAns) wrongAns.value = false;

        if (lastCorrectRef.current !== true) {
          const playCorr = inputs.find((i: any) => i.name === "playCorrect");
          if (playCorr) playCorr.fire();
        }
      } else if (correct === false) {
        const corrAns = inputs.find((i: any) => i.name === "correctAnwser" || i.name === "isCorrect");
        if (corrAns) corrAns.value = false;

        const wrongAns = inputs.find((i: any) => i.name === "isWrong");
        if (wrongAns) wrongAns.value = true;

        if (lastCorrectRef.current !== false) {
          const playWr = inputs.find((i: any) => i.name === "playWrong");
          if (playWr) playWr.fire();
        }
      } else {
        const corrAns = inputs.find((i: any) => i.name === "correctAnwser" || i.name === "isCorrect");
        if (corrAns) corrAns.value = false;

        const wrongAns = inputs.find((i: any) => i.name === "isWrong");
        if (wrongAns) wrongAns.value = false;

        if (lastCorrectRef.current !== null) {
          const playId = inputs.find((i: any) => i.name === "playIdle");
          if (playId) playId.fire();
        }
      }

      // 4. Update text runs
      if (typeof (rive as any).setTextRunValue === "function") {
        if (options && options.length > 0) {
          options.forEach((opt, idx) => {
            setTextRun(`option${idx + 1}`, opt);
          });
          for (let idx = options.length; idx < 4; idx++) {
            setTextRun(`option${idx + 1}`, "");
          }
        }
        if (prompt) {
          setTextRun("Qustion", prompt);
        }
        setTextRun("btmText", correct === null ? "check" : "continue");

        if (title) {
          setTextRun("HD", title);
        }
      }

      lastCorrectRef.current = correct;
    } catch (e) {
      console.warn("[KidsRiveGame.web] Error updating inputs:", e);
    }
  }, [rive, isLoaded, correct, selectedOptionIndex, progress, prompt, options, title, setTextRun]);

  // Subscribe to custom Rive events and state change events on Web
  useEffect(() => {
    if (!rive) return;

    const handleEvent = (event: any) => {
      const name = event?.data?.name || event?.name || "";
      const lowerName = name.toLowerCase();
      console.log("[Rive Kids Web Game Event]:", name);
      if (lowerName.includes("banner1") || lowerName.includes("select1") || lowerName.includes("option1")) {
        onSelectOption?.(0);
      } else if (lowerName.includes("banner2") || lowerName.includes("select2") || lowerName.includes("option2")) {
        onSelectOption?.(1);
      } else if (lowerName.includes("banner3") || lowerName.includes("select3") || lowerName.includes("option3")) {
        onSelectOption?.(2);
      } else if (lowerName.includes("next") || lowerName.includes("check")) {
        onSubmit?.();
      }
    };

    const handleStateChange = (event: any) => {
      const names = Array.isArray(event.data) ? event.data : [event.data];
      names.forEach((name: string) => {
        const lowerName = name.toLowerCase();
        console.log("[Rive Kids Web Game StateChange]:", name);
        if (lowerName.includes("banner1") || lowerName.includes("select1") || lowerName.includes("option1")) {
          onSelectOption?.(0);
        } else if (lowerName.includes("banner2") || lowerName.includes("select2") || lowerName.includes("option2")) {
          onSelectOption?.(1);
        } else if (lowerName.includes("banner3") || lowerName.includes("select3") || lowerName.includes("option3")) {
          onSelectOption?.(2);
        } else if (lowerName.includes("next") || lowerName.includes("check")) {
          onSubmit?.();
        }
      });
    };

    rive.on(EventType.RiveEvent, handleEvent);
    rive.on(EventType.StateChange, handleStateChange);

    return () => {
      rive.off(EventType.RiveEvent, handleEvent);
      rive.off(EventType.StateChange, handleStateChange);
    };
  }, [rive, onSelectOption, onSubmit]);

  return (
    <View style={styles.container}>
      <RiveComponent style={{ width: "100%", height: "100%", border: "none" }} />
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
});
