/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
  useViewModelInstanceTrigger,
  EventType,
} from "@rive-app/react-canvas";
import { Asset } from "expo-asset";
import { useRouter } from "expo-router";

import { useProgressStore, useCurrentProgress } from "../../stores/useProgressStore";
import { buildLessonRouteForMode } from "../../utils/lesson-navigation";
import { playButtonHaptic } from "../admin/rive/playButtonHaptic";

const RIVE_SOURCE = require("../../../assets/rive/largoapp3.riv");

const ARTBOARD_NAME = "withLayout";
const STATE_MACHINE_NAME = "State Machine 1";
const VIEW_MODEL_NAME = "base";

const BTM_X_TRIGGER = "btmX";
const HAPTIC_PROPERTY = "haptic";
const HAPTIC_ON_VALUE = 1;

export default function KidsRivePathScreenImplWeb(): React.ReactElement {
  const router = useRouter();
  const [reloadKey, setReloadKey] = useState(0);
  const assetUri = Asset.fromModule(RIVE_SOURCE).uri;
  const kidsNextLessonPathIndex = useCurrentProgress().kidsNextLessonPathIndex;

  const { rive, RiveComponent } = useRive({
    src: assetUri,
    artboard: ARTBOARD_NAME,
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    autoBind: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && rive) {
      (window as any).riveDebug = rive;
    }
  }, [rive]);

  // Get ViewModel definition & instance
  const viewModel = useViewModel(rive, { name: VIEW_MODEL_NAME });
  const viewModelInstance = useViewModelInstance(viewModel, { rive });

  const launchLesson = React.useCallback(() => {
    console.log("[Rive Kids Web] Launching kids lesson index:", kidsNextLessonPathIndex);
    playButtonHaptic();
    const routeParams = buildLessonRouteForMode("kids", 0, 0, kidsNextLessonPathIndex);
    if (routeParams) {
      router.push(routeParams);
    }
  }, [kidsNextLessonPathIndex, router]);

  const isReadyRef = React.useRef(false);

  const sendLog = useCallback((msg: string) => {
    fetch(`http://localhost:9999/log?msg=${encodeURIComponent(msg)}`).catch(() => {});
  }, []);

  useEffect(() => {
    if (!viewModelInstance) return;
    const timer = setTimeout(() => {
      isReadyRef.current = true;
    }, 3000);
    sendLog("[Rive Web Init] Rive ViewModelInstance available: " + (viewModelInstance as any)?.instanceName);
    return () => clearTimeout(timer);
  }, [viewModelInstance, sendLog]);

  // Diagnostic state change listener
  useEffect(() => {
    if (!rive) return;
    
    const handleStateChange = (event: any) => {
      const names = Array.isArray(event.data) ? event.data.join(",") : event.data;
      sendLog("[Rive Web StateChange]: " + names);
      
      // ScreenBase state change logged only to avoid conflicting with custom events
      const namesList = Array.isArray(event.data) ? event.data : [event.data];
      if (namesList.includes("ScreenBase")) {
        sendLog("[Rive Web StateChange] Level click state changed (handled by RiveEvent)");
      }

      try {
        // Log all state machines
        const smNames = (rive as any).stateMachineNames || [];
        sendLog("[Rive Web StateMachines]: " + smNames.join(", "));
        
        for (const smName of smNames) {
          const inputs = rive.stateMachineInputs(smName);
          if (inputs) {
            inputs.forEach((i: any) => {
              sendLog(`[Rive Web SM Input] SM=${smName} | Name=${i.name} | Value=${i.value}`);
            });
          }
        }
      } catch (e: any) {
        sendLog("[Rive Web StateChange] error reading inputs: " + e.message);
      }
      
      try {
        if (viewModelInstance) {
          sendLog("[Rive Web VM Info] instanceName=" + (viewModelInstance as any)?.instanceName);
          // Try to log some common properties if they exist
          const propertiesToTry = ["xBtmValue", "haptic", "level", "levelIndex", "propertyOfScreenMAPS", "levelSelected"];
          for (const prop of propertiesToTry) {
            try {
              const val = (viewModelInstance as any)[prop];
              if (val !== undefined) {
                sendLog(`[Rive Web VM Property] ${prop} = ${JSON.stringify(val)}`);
              }
            } catch (err) {}
          }
        }
      } catch (e: any) {
        sendLog("[Rive Web StateChange] error reading VM: " + e.message);
      }
    };

    rive.on(EventType.StateChange, handleStateChange);
    return () => {
      rive.off(EventType.StateChange, handleStateChange);
    };
  }, [rive, viewModelInstance, sendLog]);

  // Listen to custom Rive events for level bubble clicks on Web
  useEffect(() => {
    if (!rive) return;

    const handleRiveEvent = (event: any) => {
      const eventData = event.data || {};
      const name = eventData.name || "";
      sendLog("[Rive Kids Web Event] click event: " + name + " properties: " + JSON.stringify(eventData.properties));
      console.log("[Rive Kids Web Event] click event:", name, eventData.properties);
      
      const nameLower = name.toLowerCase();
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
        
        console.log("[Rive Kids Web Event] Launching kids lesson index:", clickedLessonIndex);
        playButtonHaptic();
        const routeParams = buildLessonRouteForMode("kids", 0, 0, clickedLessonIndex);
        if (routeParams) {
          router.push(routeParams);
        }
      }
    };

    // Rive JS uses EventType.RiveEvent for custom events
    rive.on(EventType.RiveEvent, handleRiveEvent);

    return () => {
      rive.off(EventType.RiveEvent, handleRiveEvent);
    };
  }, [rive, router, kidsNextLessonPathIndex]);

  // Get xBtmValue property
  const { value: btmValue } = useViewModelInstanceNumber("xBtmValue", viewModelInstance);
  
  // Set propertyOfScreenMAPS input to match the user's progress screen
  useEffect(() => {
    if (!rive) return;
    try {
      const smNames = (rive as any).stateMachineNames || [];
      const smName = smNames[0] || "State Machine 1";
      const inputs = rive.stateMachineInputs(smName);
      if (inputs) {
        const mapsProp = inputs.find((i: any) => i.name === "propertyOfScreenMAPS");
        if (mapsProp) {
          const currentScreen = Math.floor(kidsNextLessonPathIndex / 4);
          mapsProp.value = currentScreen % 4; // Loop maps visuals if higher than 4 screens
          sendLog("[Rive Web VM] Set propertyOfScreenMAPS value to: " + mapsProp.value);
        }
      }

      // Activate all bubbles by setting colorOn=true and nextBTM=true on all BtmVm instances
      // and isPressed=true on all Btm instances
      const file = (rive as any).file;
      if (file) {
        try {
          const btmVm = file.viewModelByName("BtmVm");
          if (btmVm) {
            const count = typeof btmVm.instanceCount === 'function' ? btmVm.instanceCount() : btmVm.instanceCount;
            for (let i = 0; i < count; i++) {
              const inst = btmVm.instanceByIndex(i);
              if (inst) {
                try { inst.boolean("colorOn").value = true; } catch (e) {}
                try { inst.boolean("nextBTM").value = true; } catch (e) {}
              }
            }
          }
        } catch (err) {}
        
        try {
          const btm = file.viewModelByName("Btm");
          if (btm) {
            const count = typeof btm.instanceCount === 'function' ? btm.instanceCount() : btm.instanceCount;
            for (let i = 0; i < count; i++) {
              const inst = btm.instanceByIndex(i);
              if (inst) {
                try { inst.trigger("actif").trigger(); } catch (e) {}
                try { inst.boolean("isPressed").value = true; } catch (e) {}
              }
            }
          }
        } catch (err) {}
      }

    } catch (e: any) {
      sendLog("[Rive Web VM Error] failed to set propertyOfScreenMAPS: " + e.message);
    }
  }, [rive, kidsNextLessonPathIndex, sendLog]);

  useViewModelInstanceTrigger(BTM_X_TRIGGER, viewModelInstance, {
    onTrigger: () => {
      // Ignore ALL fires in the first 3 seconds — the Rive state machine
      // fires btmX multiple times during initialization.
      if (!isReadyRef.current) {
        console.log(`[Rive Kids Web] trigger "${BTM_X_TRIGGER}" ignored (startup)`);
        return;
      }
      const val = btmValue ?? 0;
      console.log(`[Rive Kids Web] trigger "${BTM_X_TRIGGER}" fired, xBtmValue:`, val);
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
    }
  });

  // Haptic feedback binding
  const { value: hapticValue } = useViewModelInstanceNumber(HAPTIC_PROPERTY, viewModelInstance);
  const lastHaptic = React.useRef<number | null>(null);

  useEffect(() => {
    if (!isReadyRef.current) return;
    if (hapticValue === HAPTIC_ON_VALUE && lastHaptic.current !== HAPTIC_ON_VALUE) {
      console.log("[Rive Kids Web] haptic feedback fired");
      playButtonHaptic();
    }
    lastHaptic.current = hapticValue;
  }, [hapticValue]);

  return (
    <View style={styles.container}>
      <View style={styles.riveContainer}>
        {assetUri ? (
          <RiveComponent key={`rive-kids-web-${reloadKey}`} style={{ width: "100%", height: "100%", border: "none" }} />
        ) : (
          <Text style={styles.text}>Loading Web Assets...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  riveContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  text: {
    color: "#2C59F3",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
    marginTop: 100,
  },
});

