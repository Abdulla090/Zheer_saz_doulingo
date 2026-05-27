import { FontLatin, type FontLatinRole } from "@/constants/typography";
import { isRtlText } from "@/screens/lesson/games/game-text";
import type { TextStyle } from "react-native";

/** Kurdish (Arabic script) → user-selected Rabar; Latin UI → DIN. */
export function pickFontFamily(
  text: string,
  kurdishFont: string,
  latinRole: FontLatinRole = "bold",
): string {
  if (text && isRtlText(text)) return kurdishFont;
  return FontLatin[latinRole];
}

export function latinRoleFromWeight(
  fontWeight?: TextStyle["fontWeight"],
): FontLatinRole {
  const w =
    typeof fontWeight === "number"
      ? fontWeight
      : fontWeight === "bold" || fontWeight === "800" || fontWeight === "700"
        ? 700
        : fontWeight === "600" || fontWeight === "500"
          ? 500
          : 400;
  if (w >= 700) return "bold";
  if (w >= 500) return "medium";
  return "regular";
}
