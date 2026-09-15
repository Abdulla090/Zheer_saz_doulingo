import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { PremiumPressable } from "../../components/PremiumPressable";
import { AppText } from "../../components/ui/AppText";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { DirectionBoundary } from "../../i18n/layout-direction";
import type { GAME_MODES } from "./game-modes";
import { resolveGameHue, withAlpha } from "./games-theme";

export function PracticeCard({ mode, containerStyle }: {
  mode: (typeof GAME_MODES)[number];
  containerStyle?: StyleProp<ViewStyle>;
}) {
  const router = useRouter();
  const { t, locale, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isRtl = isKu || isAr;
  const hue = resolveGameHue(mode.mode, isDark);

  return (
    <PremiumPressable
      accessibilityRole="button"
      accessibilityLabel={t(mode.titleKey)}
      onPress={() => router.push(mode.href as never)}
      containerStyle={containerStyle ?? styles.container}
      style={[styles.card, {
        backgroundColor: withAlpha(hue.hue, isDark ? 0.16 : 0.11),
        borderColor: hue.border,
      }]}
      pressScale={0.97}
    >
      <View style={[styles.icon, { alignSelf: isRtl ? "flex-end" : "flex-start" }]}>
        <HugeiconsIcon icon={mode.icon} size={30} color={hue.ink} strokeWidth={1.8} />
      </View>
      <DirectionBoundary direction={isRtl ? "rtl" : "ltr"} style={styles.copy}>
        <AppText
          style={[styles.title, { color: colors.foreground }]}
          languageCode={locale}
          align="start"
          latinRole="bold"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          fullWidth
        >
          {t(mode.titleKey)}
        </AppText>
        <AppText style={[styles.blurb, { color: colors.mutedForeground }]} languageCode={locale} align="start" numberOfLines={2} fullWidth>
          {t(mode.blurbKey)}
        </AppText>
      </DirectionBoundary>
    </PremiumPressable>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, flexBasis: "46%", minWidth: 138 },
  card: { flex: 1, minHeight: 176, borderRadius: 26, borderCurve: "continuous", borderWidth: 1, padding: 16, alignItems: "flex-start", justifyContent: "space-between", gap: 18 },
  icon: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  copy: { width: "100%", gap: 3 },
  title: { fontSize: 15, lineHeight: 20 },
  blurb: { fontSize: 12, lineHeight: 17 },
});
