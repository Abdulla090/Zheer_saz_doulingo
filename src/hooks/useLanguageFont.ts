import { useLocaleStore } from "../stores/useLocaleStore";
import { useFontStore } from "../stores/useFontStore";
import { LANGUAGES } from "../config/languages";

export function useLanguageFont(): string {
  const sourceLang = useLocaleStore((s) => s.selectedSourceLanguage);
  const selectedFont = useFontStore((s) => s.selectedFont);
  const langDef = LANGUAGES[sourceLang];
  
  // Return the selected Rabar font if the language uses Rabar
  if (langDef && langDef.fontFamily === "Rabar") {
    return selectedFont;
  }
  
  // Fallback to empty string so it uses Latin (DIN) which is handled down the line
  return "";
}
