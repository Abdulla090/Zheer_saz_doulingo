import { FontLatin } from "@/constants/typography";
import { useKurdishFont } from "@/hooks/useKurdishFont";
import { dirForText } from "@/screens/lesson/games/game-text";
import { latinRoleFromWeight, pickFontFamily } from "@/utils/pickFontFamily";
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";

function textFromChildren(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(textFromChildren).join("");
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
  const flat = useMemo(() => StyleSheet.flatten(style), [style]);
  const content = textFromChildren(children);

  const role =
    latinRole ?? latinRoleFromWeight(flat?.fontWeight as TextStyle["fontWeight"]);

  const fontFamily = forceLatinFont
    ? FontLatin[role]
    : forceKurdishFont
      ? kurdishFont
      : pickFontFamily(content, kurdishFont, role);

  const direction = forceKurdishFont
    ? dirForText("ک")
    : forceLatinFont
      ? dirForText("A")
      : dirForText(content);

  // Strip fontFamily from passed styles when forcing a script — LightType.tile
  // sets DIN which cannot render Kurdish/Arabic (empty tiles on pair-match).
  const { fontFamily: _ignoredFont, ...restStyle } = flat ?? {};

  return (
    <Text
      style={[
        direction,
        { fontFamily },
        forceKurdishFont || forceLatinFont ? restStyle : style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
