import { HomeLiquidButton } from "@/components/ui/ios-liquid-home";
import { useI18n } from "@/hooks/useI18n";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import {
  buildLessonRouteForMode,
  buildLessonRouteFromMeta,
  getCurrentLessonMeta,
} from "@/utils/lesson-navigation";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

function parsePathMode(
  raw: string | string[] | undefined,
  saved: "street" | "normal" | "kids",
): "street" | "normal" | "kids" {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "normal") return "normal";
  if (value === "kids") return "kids";
  return saved;
}

/** Primary CONTINUE CTA on the learning path (moved off home). */
export function PathContinueBanner() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const pathMode = useSettingsStore((s) => s.pathMode);
  const streetNext = useProgressStore((s) => s.nextLessonPathIndex);
  const normalNext = useProgressStore((s) => s.normalNextLessonPathIndex);
  const kidsNext = useProgressStore((s) => s.kidsNextLessonPathIndex);
  const activeMode = parsePathMode(params.mode, pathMode);

  const onContinue = useCallback(() => {
    const meta = getCurrentLessonMeta(
      activeMode,
      streetNext,
      normalNext,
      locale,
      kidsNext,
    );
    const route = meta
      ? buildLessonRouteFromMeta(meta)
      : buildLessonRouteForMode(activeMode, streetNext, normalNext, kidsNext);
    if (route) router.push(route);
  }, [activeMode, kidsNext, locale, normalNext, router, streetNext]);

  return (
    <View style={styles.wrap}>
      <HomeLiquidButton label={t("home.continue")} onPress={onContinue} />
    </View>
  );
}

export const PATH_CONTINUE_BANNER_HEIGHT = 52;

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignItems: "stretch",
  },
});
