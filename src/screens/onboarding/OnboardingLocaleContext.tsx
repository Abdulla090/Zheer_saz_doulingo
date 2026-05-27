import type { AppLocale } from "@/utils/rtl";
import { localeIsRtl } from "@/utils/rtl";
import React, { createContext, useContext, useMemo } from "react";

type Ctx = {
  locale: AppLocale;
  isRtl: boolean;
};

const OnboardingLocaleContext = createContext<Ctx>({
  locale: "ku",
  isRtl: true,
});

export function OnboardingLocaleProvider({
  locale,
  children,
}: {
  locale: AppLocale;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({ locale, isRtl: localeIsRtl(locale) }),
    [locale],
  );
  return (
    <OnboardingLocaleContext.Provider value={value}>
      {children}
    </OnboardingLocaleContext.Provider>
  );
}

export function useOnboardingLocale() {
  return useContext(OnboardingLocaleContext);
}
