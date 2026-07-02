/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect } from "react";
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

const RIVE_SOURCE = require("../../../assets/rive/kids_interactive.riv");
const ARTBOARD = "withLayout";
const STATE_MACHINE = "State Machine 1";
const VIEW_MODEL = "viewModel";

type Props = { size: number };

export default function KidsRhinoMascotImpl({ size }: Props) {
  const { riveFile, isLoading } = useRiveFile(RIVE_SOURCE);
  const { setHybridRef, riveViewRef } = useRive();
  const { instance: viewModelInstance } = useViewModelInstance(riveFile, {
    viewModelName: VIEW_MODEL,
  });
  const { instance: boundInstance } = useViewModelInstance(riveViewRef);
  const vmInstance = boundInstance ?? viewModelInstance;

  useEffect(() => {
    if (!vmInstance) return;
    try {
      const playIdle = vmInstance.triggerProperty("playIdle");
      playIdle?.trigger();
    } catch {
      // idle may autoplay via state machine
    }
  }, [vmInstance]);

  if (isLoading || !riveFile) {
    return <View style={{ width: size, height: size }} />;
  }

  return (
    <View style={[styles.clip, { width: size, height: size * 1.15 }]}>
      <RiveView
        hybridRef={setHybridRef}
        file={riveFile}
        artboardName={ARTBOARD}
        stateMachineName={STATE_MACHINE}
        dataBind={viewModelInstance ?? DataBindMode.None}
        autoPlay
        fit={Fit.Cover}
        alignment={Alignment.TopLeft}
        style={[
          styles.rive,
          {
            width: size * 3.6,
            height: size * 3.6,
            left: -size * 0.05,
            top: -size * 0.55,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  rive: {
    position: "absolute",
  },
});
