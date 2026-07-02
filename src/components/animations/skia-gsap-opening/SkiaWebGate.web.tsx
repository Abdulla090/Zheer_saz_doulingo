import React from "react";

type Props = { children: React.ReactNode };

/** Web pass-through: web reveal uses Reanimated/gradient fallback, not CanvasKit. */
export function SkiaWebGate({ children }: Props) {
  return <>{children}</>;
}
