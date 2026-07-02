/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { RiveView, useRive, useRiveFile } from "@rive-app/react-native";

const DUO_SOURCE = require("../../../assets/rive/duo.riv");
const GIRL_SOURCE = require("../../../assets/rive/girl.riv");
const MAN_SOURCE = require("../../../assets/rive/man.riv");

type MascotConfig = {
  source: any;
  artboard: string;
  stateMachine: string;
  trigger?: string;
};

const POSE_CONFIGS: Record<string, MascotConfig> = {
  wave: {
    source: GIRL_SOURCE,
    artboard: "Artboard",
    stateMachine: "State Machine 1",
    trigger: "wave",
  },
  happy: {
    source: MAN_SOURCE,
    artboard: "Artboard",
    stateMachine: "State Machine 1",
    trigger: "jump",
  },
  party: {
    source: MAN_SOURCE,
    artboard: "Artboard",
    stateMachine: "State Machine 1",
    trigger: "thumbs_up",
  },
  wink: {
    source: MAN_SOURCE,
    artboard: "Artboard",
    stateMachine: "State Machine 1",
    trigger: "wink",
  },
  sad: {
    source: MAN_SOURCE,
    artboard: "Artboard",
    stateMachine: "State Machine 1",
    trigger: "sad9",
  },
  fail: {
    source: MAN_SOURCE,
    artboard: "Artboard",
    stateMachine: "State Machine 1",
    trigger: "dissapoint9",
  },
  headset: {
    source: DUO_SOURCE,
    artboard: "Artboard",
    stateMachine: "",
  },
};

type Props = {
  size: number;
  pose: string;
};

export default function RiveMascotImpl({ size, pose }: Props) {
  const config = POSE_CONFIGS[pose] || POSE_CONFIGS.wave;
  const { riveFile } = useRiveFile(config.source);
  const { setHybridRef, riveViewRef } = useRive();

  useEffect(() => {
    if (!riveViewRef || !config.trigger) return;

    const runTrigger = async () => {
      try {
        await riveViewRef.awaitViewReady();
        riveViewRef.triggerInput(config.trigger!);
        riveViewRef.setBooleanInputValue(config.trigger!, true);
        setTimeout(() => {
          try {
            riveViewRef.setBooleanInputValue(config.trigger!, false);
          } catch {}
        }, 1000);
      } catch (e) {
        console.warn("[RiveMascot] Trigger error:", e);
      }
    };

    runTrigger();
  }, [riveViewRef, pose, config.trigger]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {riveFile ? (
        <RiveView
          key={pose}
          hybridRef={setHybridRef}
          file={riveFile}
          artboardName={config.artboard}
          {...(config.stateMachine ? { stateMachineName: config.stateMachine } : {})}
          autoPlay
          style={styles.rive}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  rive: {
    width: "100%",
    height: "100%",
  },
});
