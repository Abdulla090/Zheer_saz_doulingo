import React from "react";
import { TabScreenTransition } from "./TabScreenTransition";

/**
 * TabScreenChrome wraps each tab screen.
 * Keep tab switches immediate; decorative openers make navigation feel slow.
 */
export function TabScreenChrome({
  children,
}: {
  children: React.ReactNode;
  lazy?: boolean;
  openingVariant?: string;
}) {
  return <TabScreenTransition>{children}</TabScreenTransition>;
}
