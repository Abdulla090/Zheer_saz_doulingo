import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useRive } from "@rive-app/react-canvas";
import { Asset } from "expo-asset";
import DUO_SOURCE from "../../../assets/rive/duo.riv";
import GIRL_SOURCE from "../../../assets/rive/girl.riv";
import MAN_SOURCE from "../../../assets/rive/man.riv";

type MascotConfig = {
  source: number;
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
  const assetUri = Asset.fromModule(config.source).uri;

  const { rive, RiveComponent } = useRive({
    src: assetUri,
    artboard: config.artboard,
    autoplay: true,
  });

  const isRiveLoaded = (rive as any)?.loaded;

  useEffect(() => {
    if (!rive || !isRiveLoaded || !config.trigger) return;

    try {
      const smNames = (rive as any).stateMachineNames || (rive as any).artboard?.stateMachineNames || [];
      const activeSmName = smNames.find((name: string) => name === config.stateMachine) || smNames[0];
      if (!activeSmName) return;

      const inputs = rive.stateMachineInputs(activeSmName);
      if (!inputs) return;

      const input = inputs.find((i: any) => i.name === config.trigger);
      if (input) {
        if ("fire" in input && typeof (input as any).fire === "function") {
          (input as any).fire();
        } else {
          input.value = true;
          setTimeout(() => {
            input.value = false;
          }, 1000);
        }
      }
    } catch (e) {
      console.warn("[RiveMascot] Failed to trigger input:", e);
    }
  }, [rive, isRiveLoaded, pose, config.stateMachine, config.trigger]);

  return (
    <View key={assetUri} style={[styles.container, { width: size, height: size }]}>
      <RiveComponent style={{ width: "100%", height: "100%", border: "none" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
