import { FontLatin } from "../../constants/typography";
import { useLanguageFont } from "../../hooks/useLanguageFont";
import { useThemeColors } from "../../hooks/useThemeColors";
import { dirForText } from "../../screens/lesson/games/game-text";
import { latinRoleFromWeight } from "../../utils/pickFontFamily";
import React, { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  type TextProps,
} from "react-native";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { LANGUAGES } from "../../config/languages";

function getFirstChar(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    const s = String(children).trim();
    return s ? s.charAt(0) : "";
  }
  if (Array.isArray(children)) {
    for (const child of children) {
      const char = getFirstChar(child);
      if (char) return char;
    }
  }
  return "";
}

export type AppTextProps = TextProps & {
  /** Alias for forceSourceFont */
  forceKurdishFont?: boolean;
  /** Always use DIN (English UI). */
  forceLatinFont?: boolean;
  latinRole?: keyof typeof FontLatin;
};

/**
 * Text with automatic Source vs Latin font and RTL direction.
 */
export function AppText({
  style,
  children,
  forceKurdishFont,
  forceLatinFont,
  latinRole,
  ...props
}: AppTextProps) {
  const languageFont = useLanguageFont();
  const sourceLang = useLocaleStore((s) => s.selectedSourceLanguage);
  const isSourceRtl = LANGUAGES[sourceLang]?.rtl || false;
  const { colors } = useThemeColors();

  const flat = useMemo(() => {
    if (!style) return undefined;
    return StyleSheet.flatten(style);
  }, [style]);

  const firstChar = useMemo(() => {
    if (forceKurdishFont || forceLatinFont) return "";
    return getFirstChar(children);
  }, [forceKurdishFont, forceLatinFont, children]);

  const role = useMemo(() => {
    return latinRole ?? latinRoleFromWeight(flat?.fontWeight);
  }, [latinRole, flat?.fontWeight]);

  const fontFamily = useMemo(() => {
    return forceLatinFont ? FontLatin[role] : (languageFont || FontLatin[role]);
  }, [forceLatinFont, role, languageFont]);

  const direction = useMemo(() => {
    if (forceKurdishFont) return { writingDirection: isSourceRtl ? "rtl" : "ltr", textAlign: isSourceRtl ? "right" : "left" } as any;
    if (forceLatinFont) return { writingDirection: "ltr", textAlign: "left" } as any;
    return dirForText(firstChar);
  }, [forceKurdishFont, forceLatinFont, firstChar, isSourceRtl]);

  const combinedStyle = useMemo(() => {
    const flattened = StyleSheet.flatten([
      direction,
      { color: colors.foreground },
      style,
      { backgroundColor: "transparent" },
    ]);
    if (flattened.textAlign === "center" || Platform.OS === "android") {
      flattened.writingDirection = undefined;
    }
    const { fontFamily: _ignoredFont, ...rest } = flattened;
    return {
      ...rest,
      fontFamily,
    };
  }, [colors.foreground, style, direction, fontFamily]);

  return (
    <Text
      style={combinedStyle}
      {...props}
    >
      {children}
    </Text>
  );
}
