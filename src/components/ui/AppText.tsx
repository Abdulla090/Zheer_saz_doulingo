import { FontLatin } from "../../constants/typography";
import { useLanguageFont } from "../../hooks/useLanguageFont";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  getLanguageDirection,
  resolvePlatformAlignment,
  resolvePlatformTextAlign,
  resolveTextAlign,
  type LogicalAlignment,
} from "../../i18n/direction";
import { latinRoleFromWeight } from "../../utils/pickFontFamily";
import React, { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";
import { useLocaleStore } from "../../stores/useLocaleStore";

export type AppTextProps = TextProps & {
  /** Alias for forceSourceFont */
  forceKurdishFont?: boolean;
  /** Always use DIN (English UI). */
  forceLatinFont?: boolean;
  latinRole?: keyof typeof FontLatin;
  /** Language of the rendered content, independent from the surrounding UI. */
  languageCode?: string;
  /** Logical alignment resolved against languageCode. */
  align?: LogicalAlignment;
  /** Optional native-only alignment; useful when web intentionally stays centered. */
  nativeAlign?: LogicalAlignment;
  /** Stretch the text block so native alignment is deterministic. */
  fullWidth?: boolean;
};

/**
 * Theme-aware localized text. Mixed-language content must pass languageCode.
 */
export function AppText({
  style,
  children,
  forceKurdishFont,
  forceLatinFont,
  latinRole,
  languageCode,
  align,
  nativeAlign,
  fullWidth,
  ...props
}: AppTextProps) {
  const languageFont = useLanguageFont();
  const uiLanguage = useLocaleStore((s) => s.selectedUiLanguage);
  const sourceLanguage = useLocaleStore((s) => s.selectedSourceLanguage);
  const { colors } = useThemeColors();

  const flat = useMemo(() => {
    if (!style) return undefined;
    return StyleSheet.flatten(style);
  }, [style]);

  const role = useMemo(() => {
    return latinRole ?? latinRoleFromWeight(flat?.fontWeight);
  }, [latinRole, flat?.fontWeight]);

  const effectiveLanguageCode = forceLatinFont
    ? "en"
    : languageCode ?? (forceKurdishFont ? sourceLanguage : uiLanguage);
  const direction = getLanguageDirection(effectiveLanguageCode);

  const fontFamily = useMemo(() => {
    return forceLatinFont || direction === "ltr"
      ? FontLatin[role]
      : (languageFont || FontLatin[role]);
  }, [direction, forceLatinFont, role, languageFont]);

  const requestedPhysicalAlignment =
    flat?.textAlign === "left" || flat?.textAlign === "right" || flat?.textAlign === "center"
      ? flat.textAlign
      : undefined;
  const effectiveAlignment = resolvePlatformAlignment(Platform.OS, align, nativeAlign);
  const desiredPhysicalAlignment = effectiveAlignment
    ? resolveTextAlign(direction, effectiveAlignment)
    : requestedPhysicalAlignment ?? resolveTextAlign(direction, "start");
  const textAlign = resolvePlatformTextAlign(
    Platform.OS,
    direction,
    desiredPhysicalAlignment,
  );
  const directionStyle = {
    // Android already receives the app direction from the root view. Applying
    // `direction` again to each native Text creates opaque glyph-bound boxes
    // on some devices; physical textAlign is sufficient for mixed-language text.
    ...(Platform.OS !== "android" ? { direction } : null),
    textAlign,
    // Android can clip Kurdish/Arabic glyph ascenders when a compact tile
    // disables native font padding. Keep it on for RTL lesson content.
    ...(Platform.OS === "android" && direction === "rtl" ? { includeFontPadding: true } : null),
    ...(Platform.OS === "ios" ? { writingDirection: direction } : null),
  } as const;

  const flattened = StyleSheet.flatten([
    { color: colors.foreground },
    style,
    fullWidth && ({ width: "100%", alignSelf: "stretch" } as TextStyle),
    { backgroundColor: "transparent" },
    // Keep this last: localized direction must not be overridden by a parent style array.
    directionStyle,
  ]) as TextStyle;
  const { fontFamily: _ignoredFont, ...rest } = flattened;
  const combinedStyle: TextStyle = { ...rest, fontFamily };

  const webProps = Platform.OS === "web"
    ? ({ dir: direction, lang: effectiveLanguageCode } as Record<string, string>)
    : undefined;

  return (
    <Text
      {...webProps}
      style={combinedStyle}
      accessibilityLanguage={effectiveLanguageCode}
      {...props}
    >
      {children}
    </Text>
  );
}
