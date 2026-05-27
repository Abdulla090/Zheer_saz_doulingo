import { NormalEnglishPathScreen } from "@/screens/home/NormalEnglishPathScreen";
import { StreetEnglishPathScreen } from "@/screens/home/StreetEnglishPathScreen";
import { useLocalSearchParams } from "expo-router";
import React from "react";

function parseMode(raw: string | string[] | undefined): "street" | "normal" {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "normal" ? "normal" : "street";
}

export function LearningPathScreen() {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const activeMode = parseMode(params.mode);

  if (activeMode === "normal") {
    return <NormalEnglishPathScreen />;
  }
  return <StreetEnglishPathScreen />;
}
