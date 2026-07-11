import type { ScreenOpeningVariant } from "./opening-themes";
import React, { createContext, useContext } from "react";

type ScreenOpeningContextValue = {
  playKey: number;
  variant: ScreenOpeningVariant;
};

const ScreenOpeningContext = createContext<ScreenOpeningContextValue | null>(null);

export function ScreenOpeningProvider({
  playKey,
  variant,
  children,
}: {
  playKey: number;
  variant: ScreenOpeningVariant;
  children: React.ReactNode;
}) {
  return (
    <ScreenOpeningContext.Provider value={{ playKey, variant }}>
      {children}
    </ScreenOpeningContext.Provider>
  );
}

export function useScreenOpeningPlayKey() {
  return useContext(ScreenOpeningContext)?.playKey ?? null;
}

export function useScreenOpeningVariant() {
  return useContext(ScreenOpeningContext)?.variant ?? null;
}
