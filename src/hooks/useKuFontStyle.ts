import { useKurdishFont } from "@/hooks/useKurdishFont";
import { rtlBlock } from "@/screens/lesson/games/game-text";
import type { TextStyle } from "react-native";

/** Style fragment for Kurdish copy — Rabar + RTL. */
export function useKuFontStyle(extra?: TextStyle): TextStyle {
  const fontFamily = useKurdishFont();
  return { fontFamily, ...rtlBlock, ...extra };
}
