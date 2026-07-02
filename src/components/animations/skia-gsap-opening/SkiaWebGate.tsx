import React from "react";

type Props = { children: React.ReactNode };

/** Pass-through gate; web uses a non-Skia reveal overlay and should not preload CanvasKit. */
export function SkiaWebGate({ children }: Props) {
  return <>{children}</>;
}
