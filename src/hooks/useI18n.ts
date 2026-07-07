import { useTranslation } from "react-i18next";
import { useLocaleStore } from "../stores/useLocaleStore";

export function useI18n() {
  const { t: baseT } = useTranslation();
  const locale = useLocaleStore((s) => s.selectedSourceLanguage);
  const ready = useLocaleStore((s) => s.ready);
  const setLocale = useLocaleStore((s) => s.setLocale); // Legacy alias

  const t = (key: string, options?: any): string => {
    const isGameKey =
      key.startsWith("lessons.") ||
      key.startsWith("game.") ||
      key.startsWith("slang.") ||
      key.startsWith("aiTeacher.") ||
      key.startsWith("rolePlay.") ||
      key.startsWith("voiceTutor.");

    if (locale === "ku" && isGameKey) {
      return baseT(key, { ...options, lng: "ku" }) as string;
    }
    return baseT(key, options) as string;
  };

  return {
    t,
    locale,
    ready,
    isKu: locale === "ku",
    isAr: locale === "ar",
    setLocale,
    setEnglish: () => setLocale("en"),
    setKurdish: () => setLocale("ku"),
  };
}
