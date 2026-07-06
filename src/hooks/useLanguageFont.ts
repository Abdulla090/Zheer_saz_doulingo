import { useFontStore } from "../stores/useFontStore";

export function useLanguageFont(): string {
  const selectedFont = useFontStore((s) => s.selectedFont);
  return selectedFont;
}
