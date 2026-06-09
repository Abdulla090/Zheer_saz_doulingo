import { translate, type AppLocale, type I18nKey } from "../i18n";
import { useLocaleStore } from "../stores/useLocaleStore";
import { useCallback } from "react";

export function useI18n() {
  const locale = useLocaleStore((s) => s.locale);
  const ready = useLocaleStore((s) => s.ready);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const t = useCallback(
    (key: I18nKey) => translate(locale, key),
    [locale],
  );

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

export type { AppLocale, I18nKey };
