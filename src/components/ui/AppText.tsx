import { FontLatin } from "@/constants/typography";
import { useKurdishFont } from "@/hooks/useKurdishFont";
import { dirForText } from "@/screens/lesson/games/game-text";
import { latinRoleFromWeight } from "@/utils/pickFontFamily";
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";

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
  /** Always use Rabar + RTL defaults. */
  forceKurdishFont?: boolean;
  /** Always use DIN (English UI). */
  forceLatinFont?: boolean;
  latinRole?: keyof typeof FontLatin;
};

/**
 * Text with automatic Kurdish (Rabar) vs Latin (DIN) font and RTL direction.
 */
export function AppText({
  style,
  children,
  forceKurdishFont,
  forceLatinFont,
  latinRole,
  ...props
}: AppTextProps) {
  const kurdishFont = useKurdishFont();

  // Fix: Call StyleSheet.flatten on style (handles IDs, objects, and arrays correctly)
  const flat = useMemo(() => {
    if (!style) return undefined;
    return StyleSheet.flatten(style);
  }, [style]);

  // Optimize: Get only the first character to detect language direction, rather than stringifying the whole tree
  const firstChar = useMemo(() => {
    if (forceKurdishFont || forceLatinFont) return "";
    return getFirstChar(children);
  }, [forceKurdishFont, forceLatinFont, children]);

  const role = useMemo(() => {
    return latinRole ?? latinRoleFromWeight(flat?.fontWeight);
  }, [latinRole, flat?.fontWeight]);

  const fontFamily = useMemo(() => {
    return forceLatinFont ? FontLatin[role] : kurdishFont;
  }, [forceLatinFont, role, kurdishFont]);

  const direction = useMemo(() => {
    if (forceKurdishFont) return dirForText("ک");
    if (forceLatinFont) return dirForText("A");
    return dirForText(firstChar);
  }, [forceKurdishFont, forceLatinFont, firstChar]);

  // Robust style flattening to prevent leaks (such as white text background boxes on Android)
  const combinedStyle = useMemo(() => {
    const flattened = StyleSheet.flatten([
      style,
      direction,
      { backgroundColor: "transparent" },
    ]);
    const { fontFamily: _ignoredFont, ...rest } = flattened;
    return {
      ...rest,
      fontFamily,
    };
  }, [style, direction, fontFamily]);

  return (
    <Text
      style={combinedStyle}
      {...props}
    >
      {children}
    </Text>
  );
}
