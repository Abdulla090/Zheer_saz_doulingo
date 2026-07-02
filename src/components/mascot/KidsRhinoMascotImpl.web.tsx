import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useRive } from "@rive-app/react-canvas";

/* eslint-disable @typescript-eslint/no-require-imports */
const RIVE_SOURCE = require("../../../assets/rive/kids_interactive.riv");

type Props = { size: number };

export default function KidsRhinoMascotImplWeb({ size }: Props) {
  const { rive, RiveComponent } = useRive({
    src: RIVE_SOURCE,
    artboard: "withLayout",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  useEffect(() => {
    if (!rive) return;
    const timer = setTimeout(() => {
      try {
        const smNames =
          (rive as any).stateMachineNames ||
          (rive as any).artboard?.stateMachineNames ||
          [];
        const sm = smNames[0] || "State Machine 1";
        const inputs = rive.stateMachineInputs(sm);
        const playIdle = inputs?.find((i: any) => i.name === "playIdle");
        if (playIdle && "fire" in playIdle) {
          (playIdle as { fire: () => void }).fire();
        }
      } catch {
        // autoplay handles idle
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [rive]);

  return (
    <View style={[styles.clip, { width: size, height: size * 1.15 }]}>
      <View
        style={[
          styles.riveWrap,
          {
            width: size * 3.6,
            height: size * 3.6,
            left: -size * 0.05,
            top: -size * 0.55,
          },
        ]}
      >
        <RiveComponent style={{ width: "100%", height: "100%", border: "none" }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  riveWrap: {
    position: "absolute",
  },
});
