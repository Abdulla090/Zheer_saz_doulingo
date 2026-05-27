import { NormalEnglishPathScreen } from "@/screens/home/NormalEnglishPathScreen";
import { StreetEnglishPathScreen } from "@/screens/home/StreetEnglishPathScreen";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useLocalSearchParams } from "expo-router";
import React from "react";

function parseMode(raw: string | string[] | undefined): "street" | "normal" | null {
  if (raw == null) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "normal" ? "normal" : "street";
}

export function LearningPathScreen() {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const savedMode = useSettingsStore((s) => s.pathMode);
  const activeMode = parseMode(params.mode) ?? savedMode;

  if (activeMode === "normal") {
    return <NormalEnglishPathScreen />;
  }
  return <StreetEnglishPathScreen />;
}
