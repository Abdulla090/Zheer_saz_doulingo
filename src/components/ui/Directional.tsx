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
  resolveTextAlign,
  type LogicalAlignment,
} from "../../i18n/direction";
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

  return (
    <View
      {...webProps}
      {...props}
      style={StyleSheet.flatten([
        style,
        fullWidth && { width: "100%", alignSelf: "stretch" },
        { direction },
      ])}
    />
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
          textAlign: resolveTextAlign(direction, align),
          ...(Platform.OS === "ios" ? { writingDirection: direction } : null),
        },
      ])}
    />
  );
}
