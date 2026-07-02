/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Alignment,
  DataBindMode,
  Fit,
  RiveView,
  useRive,
  useRiveFile,
  useViewModelInstance,
} from "@rive-app/react-native";
import { useRouter } from "expo-router";

import { playButtonHaptic } from "../admin/rive/playButtonHaptic";
import { useProgressStore, useCurrentProgress } from "../../stores/useProgressStore";
import { buildLessonRouteForMode } from "../../utils/lesson-navigation";

const RIVE_SOURCE = require("../../../assets/rive/largoapp3.riv");

const ARTBOARD_NAME = "withLayout";
const STATE_MACHINE_NAME = "State Machine 1";
const VIEW_MODEL_NAME = "base";

const BTM_X_TRIGGER = "btmX";
const HAPTIC_PROPERTY = "haptic";
const HAPTIC_ON_VALUE = 1;

export default function KidsRivePathScreenImpl(): React.ReactElement {
  const router = useRouter();
  const { riveFile, isLoading, error } = useRiveFile(RIVE_SOURCE);
  const { setHybridRef, riveViewRef } = useRive();
  const [reloadKey, setReloadKey] = useState(0);

  const kidsNextLessonPathIndex = useCurrentProgress().kidsNextLessonPathIndex;

  const { instance: viewModelInstance } = useViewModelInstance(
    riveFile,
    { viewModelName: VIEW_MODEL_NAME }
  );

  const { instance: boundInstance } = useViewModelInstance(riveViewRef);
  const vmInstance = boundInstance ?? viewModelInstance;

  const launchLesson = useCallback(() => {
    console.log("[Rive Kids] Launching kids lesson index:", kidsNextLessonPathIndex);
    playButtonHaptic();
    const routeParams = buildLessonRouteForMode("kids", 0, 0, kidsNextLessonPathIndex);
    if (routeParams) {
      router.push(routeParams);
    }
  }, [kidsNextLessonPathIndex, router]);

  const isReadyRef = React.useRef(false);

  useEffect(() => {
    if (!vmInstance) return;

    const timer = setTimeout(() => {
      isReadyRef.current = true;
    }, 3000);

    const unsubs: (() => void)[] = [];

    // btmX trigger — handle lesson launch and tab navigation
    const btmTrigger = vmInstance.triggerProperty(BTM_X_TRIGGER);
    const btmValueProp = vmInstance.numberProperty("xBtmValue");
    if (btmTrigger) {
      unsubs.push(
        btmTrigger.addListener(() => {
          if (!isReadyRef.current) {
            console.log(`[Rive Kids] trigger "${BTM_X_TRIGGER}" ignored (startup)`);
            return;
          }
          const val = btmValueProp ? btmValueProp.value : 0;
          console.log(`[Rive Kids] trigger "${BTM_X_TRIGGER}" fired, xBtmValue:`, val);
          if (val === 0) {
            playButtonHaptic();
            router.push("/(kids)/games" as any);
          } else if (val === 1) {
            playButtonHaptic();
            router.push("/(kids)/classic-path" as any);
          } else if (val === 2) {
            playButtonHaptic();
            router.push("/(kids)/games" as any);
          } else if (val === 3) {
            playButtonHaptic();
            router.push("/(kids)/profile" as any);
          }
        })
      );
    }

    // Haptic feedback
    const hapticProp = vmInstance.numberProperty(HAPTIC_PROPERTY);
    if (hapticProp) {
      let lastHaptic: number | null = null;
      unsubs.push(
        hapticProp.addListener((value) => {
          if (!isReadyRef.current) return;
          if (value === HAPTIC_ON_VALUE && lastHaptic !== HAPTIC_ON_VALUE) {
            console.log(`[Rive Kids] haptic feedback fired`);
            playButtonHaptic();
          }
          lastHaptic = value;
        })
      );
    }

    // Set propertyOfScreenMAPS to select the screen page based on kidsNextLessonPathIndex
    const mapsProp = vmInstance.numberProperty("propertyOfScreenMAPS");
    if (mapsProp) {
      const currentScreen = Math.floor(kidsNextLessonPathIndex / 4);
      mapsProp.value = currentScreen % 4; // Loop maps visuals if higher than 4 screens
      console.log(`[Rive Kids] Set propertyOfScreenMAPS value to: ${mapsProp.value}`);
    }

    // Event listener for map node taps
    if (riveViewRef) {
      try {
        riveViewRef.onEventListener((event) => {
          console.log("[Rive Kids Event] click event:", event.name, event.type, event.properties);
          
          const nameLower = event.name.toLowerCase();
          // Detect click events on the path level nodes
          if (nameLower.includes("area click") || nameLower.includes("level") || nameLower.includes("play")) {
            let index = 0;
            if (nameLower.includes("click 2") || nameLower.includes("level 2") || nameLower.includes("level: 2")) index = 1;
            else if (nameLower.includes("click 3") || nameLower.includes("level 3") || nameLower.includes("level: 3")) index = 2;
            else if (nameLower.includes("click 4") || nameLower.includes("level 4") || nameLower.includes("level: 4")) index = 3;
            else if (nameLower.includes("2")) index = 1;
            else if (nameLower.includes("3")) index = 2;
            else if (nameLower.includes("4")) index = 3;
            
            const currentScreen = Math.floor(kidsNextLessonPathIndex / 4);
            const clickedLessonIndex = currentScreen * 4 + index;
            
            console.log("[Rive Kids Event] Launching kids lesson index:", clickedLessonIndex);
            setReloadKey(prev => prev + 1);
            playButtonHaptic();
            const routeParams = buildLessonRouteForMode("kids", 0, 0, clickedLessonIndex);
            if (routeParams) {
              router.push(routeParams);
            }
          }
        });
        unsubs.push(() => {
          try {
            riveViewRef.removeEventListeners();
          } catch (e) {
            console.warn("[Rive Kids Event] Error removing event listeners:", e);
          }
        });
      } catch (e) {
        console.warn("[Rive Kids Event] Error setting event listener:", e);
      }
    }

    return () => {
      clearTimeout(timer);
      unsubs.forEach((u) => u());
    };
  }, [vmInstance, reloadKey, launchLesson, riveViewRef, kidsNextLessonPathIndex]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Preparing Map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RiveView
        key={`rive-kids-${reloadKey}`}
        hybridRef={setHybridRef}
        file={riveFile}
        artboardName={ARTBOARD_NAME}
        stateMachineName={STATE_MACHINE_NAME}
        dataBind={viewModelInstance ?? DataBindMode.None}
        autoPlay
        fit={Fit.Layout}
        alignment={Alignment.Center}
        style={styles.rive}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  rive: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
  },
  text: {
    color: "#2C59F3",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DINNextRoundedBold",
  },
  errorText: {
    color: "#EF5350",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DINNextRoundedBold",
  },
});

