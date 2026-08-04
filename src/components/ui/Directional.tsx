import React from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from "react-native";

import {
  getLanguageDirection,
  resolvePlatformTextAlign,
  resolveTextAlign,
  type LogicalAlignment,
} from "../../i18n/direction";
import { LayoutDirectionProvider } from "../../i18n/layout-direction";
import { AppText, type AppTextProps } from "./AppText";

export type LocalizedTextProps = AppTextProps & { languageCode: string };

export function LocalizedText(props: LocalizedTextProps) {
  return <AppText {...props} />;
}

export type DirectionalViewProps = ViewProps & {
  languageCode: string;
  fullWidth?: boolean;
};

export function DirectionalView({
  languageCode,
  fullWidth,
  style,
  ...props
}: DirectionalViewProps) {
  const direction = getLanguageDirection(languageCode);
  const webProps = Platform.OS === "web"
    ? ({ dir: direction, lang: languageCode } as Record<string, string>)
    : undefined;

  /*
   * The `direction` style flips this subtree's layout, so the provider has to
   * travel with it — otherwise `AppText` inside keeps compensating for the
   * outer direction and lands on the wrong edge. See `i18n/layout-direction`.
   */
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

export type DirectionalTextInputProps = TextInputProps & {
  languageCode: string;
  align?: LogicalAlignment;
  fullWidth?: boolean;
};

export function DirectionalTextInput({
  languageCode,
  align = "start",
  fullWidth,
  style,
  ...props
}: DirectionalTextInputProps) {
  const direction = getLanguageDirection(languageCode);
  /*
   * Unlike `<Text>`, Android's `TextInput` maps `textAlign: left | right` onto
   * absolute gravity, so there is no RTL swap to compensate for — passing an
   * outer layout direction here would push the caret to the wrong edge. iOS
   * does swap, but against this node's own `direction` set below, which is the
   * content direction.
   */
  const textAlign = resolvePlatformTextAlign(
    Platform.OS,
    direction,
    resolveTextAlign(direction, align),
    Platform.OS === "android" ? "ltr" : direction,
  );
  const webProps = Platform.OS === "web"
    ? ({ dir: direction, lang: languageCode } as Record<string, string>)
    : undefined;

  return (
    <TextInput
      {...webProps}
      {...props}
      accessibilityLanguage={languageCode}
      style={StyleSheet.flatten([
        style,
        fullWidth && { width: "100%", alignSelf: "stretch" },
        {
          direction,
          textAlign,
          ...(Platform.OS === "ios" ? { writingDirection: direction } : null),
        },
      ])}
    />
  );
}
