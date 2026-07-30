import React from "react";
import {
  Platform,
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { PRIMARY_ACTION } from "../../constants/primary-action";
import { AppText, type AppTextProps } from "./AppText";
import { IOSPressable } from "./ios-pressable";

type LoginPrimaryButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** The single primary button used by auth and onboarding. */
export function LoginPrimaryButton({
  children,
  onPress,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: LoginPrimaryButtonProps) {
  return (
    <IOSPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, style, disabled && styles.buttonDisabled]}
    >
      {children}
    </IOSPressable>
  );
}

export function LoginPrimaryButtonLabel({
  style,
  ...props
}: AppTextProps & { style?: StyleProp<TextStyle> }) {
  return (
    <AppText
      {...props}
      style={[styles.label, style]}
      latinRole="bold"
      numberOfLines={1}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: PRIMARY_ACTION.height,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: PRIMARY_ACTION.radius,
    backgroundColor: PRIMARY_ACTION.face,
    borderBottomWidth: PRIMARY_ACTION.rimWidth,
    borderBottomColor: PRIMARY_ACTION.rim,
    ...Platform.select({
      web: { cursor: "pointer" } as any,
    }),
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    letterSpacing: 0.1,
  },
});
