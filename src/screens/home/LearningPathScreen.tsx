import { KidsEnglishPathScreen } from "@/screens/home/KidsEnglishPathScreen";
import { NormalEnglishPathScreen } from "@/screens/home/NormalEnglishPathScreen";
import { StreetEnglishPathScreen } from "@/screens/home/StreetEnglishPathScreen";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useLocalSearchParams } from "expo-router";
import React from "react";

type PathMode = "street" | "normal" | "kids";

function parseMode(raw: string | string[] | undefined): PathMode | null {
  if (raw == null) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "normal") return "normal";
  if (value === "kids") return "kids";
  return "street";
}

export function LearningPathScreen() {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const savedMode = useSettingsStore((s) => s.pathMode);
  const activeMode = parseMode(params.mode) ?? savedMode;

  if (activeMode === "normal") {
    return <NormalEnglishPathScreen />;
  }
  if (activeMode === "kids") {
    return <KidsEnglishPathScreen />;
  }
  return <StreetEnglishPathScreen />;
}
