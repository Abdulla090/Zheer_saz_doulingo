import { useTranslation } from "react-i18next";
import { useLocaleStore } from "../stores/useLocaleStore";

export function useI18n() {
  const { t, i18n } = useTranslation();
  const locale = useLocaleStore((s) => s.selectedSourceLanguage);
  const ready = useLocaleStore((s) => s.ready);
  const setLocale = useLocaleStore((s) => s.setLocale); // Legacy alias

  return {
    t,
    locale,
    ready,
    isKu: locale === "ku",
    setLocale,
    setEnglish: () => setLocale("en"),
    setKurdish: () => setLocale("ku"),
  };
}
