/**
 * Ambient *layout* direction — the direction of the box the text sits in, which
 * is not the same thing as the direction of the text's own script.
 *
 * Why a context rather than `I18nManager.isRTL`:
 *
 *   • `applyUiLanguageDirection` calls `I18nManager.forceRTL` but deliberately
 *     never reloads the app (see the comment in `useLocaleStore`), so that flag
 *     describes the *previous* cold start, not the language on screen now.
 *   • The direction that is actually in effect comes from the `direction` style
 *     on the root view in `app/_layout.tsx`, which follows the UI language
 *     immediately.
 *   • Several screens then override it locally — an English answer tile inside a
 *     Kurdish lesson sets `direction: "ltr"` on itself.
 *
 * Android resolves `textAlign: "left" | "right"` against that layout direction
 * (it swaps them under RTL), so `AppText` has to know the *local* value to
 * pre-encode the physical edge it wants. Every place that sets a `direction`
 * style must therefore also publish it here, which is what `DirectionBoundary`
 * is for.
 */

import React from "react";
import { Platform, StyleSheet, View, type ViewProps } from "react-native";

import type { Direction } from "./direction";

const LayoutDirectionContext = React.createContext<Direction>("ltr");

/** The layout direction of the nearest enclosing direction boundary. */
export function useLayoutDirection(): Direction {
  return React.useContext(LayoutDirectionContext);
}

/**
 * Publish a layout direction without rendering a view.
 *
 * For the cases where the `direction` style has to live on a component that
 * already exists (an animated tile face, a `Pressable`), so a wrapper view would
 * change the layout.
 */
export function LayoutDirectionProvider({
  value,
  children,
}: {
  value: Direction;
  children: React.ReactNode;
}) {
  return (
    <LayoutDirectionContext.Provider value={value}>{children}</LayoutDirectionContext.Provider>
  );
}

export type DirectionBoundaryProps = ViewProps & {
  direction: Direction;
  fullWidth?: boolean;
};

/**
 * A view that flips its subtree's layout direction and keeps the context in
 * step. Prefer this over a bare `{ direction }` style — a style on its own
 * mirrors the layout while leaving `AppText` compensating for the outer
 * direction, which lands the text on the wrong edge.
 *
 * On web the direction travels through the `dir` attribute and CSS handles the
 * rest; the style is native-only to match the rest of the app.
 */
export function DirectionBoundary({
  direction,
  fullWidth,
  style,
  ...props
}: DirectionBoundaryProps) {
  const webProps =
    Platform.OS === "web" ? ({ dir: direction } as Record<string, string>) : undefined;

  return (
    <LayoutDirectionProvider value={direction}>
      <View
        {...webProps}
        {...props}
        style={StyleSheet.flatten([
          style,
          fullWidth && { width: "100%", alignSelf: "stretch" },
          { direction },
        ])}
      />
    </LayoutDirectionProvider>
  );
}
