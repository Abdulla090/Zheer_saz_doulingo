import { describe, expect, it, jest } from "@jest/globals";
import React from "react";
import renderer, { act } from "react-test-renderer";
import { StyleSheet, Text } from "react-native";

jest.mock("react-native-reanimated", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require("react-native");
  const passthrough = (v: unknown) => v;
  const easingFn = () => 0;
  const Easing = {
    out: () => easingFn,
    in: () => easingFn,
    inOut: () => easingFn,
    bezier: () => ({ factory: () => easingFn }),
    cubic: easingFn,
    quad: easingFn,
    sin: easingFn,
    linear: easingFn,
    ease: easingFn,
  };
  const chainable: any = new Proxy(
    {},
    {
      get: (_t, prop) => {
        if (prop === "then") return undefined;
        return () => chainable;
      },
    },
  );
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (c: unknown) => c,
    },
    Easing,
    LinearTransition: chainable,
    FadeIn: chainable,
    FadeOut: chainable,
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    useReducedMotion: () => false,
    withSpring: passthrough,
    withTiming: passthrough,
  };
});

// eslint-disable-next-line import/first
import {
  LoginPrimaryButton,
  LoginPrimaryButtonLabel,
} from "../LoginPrimaryButton";
// eslint-disable-next-line import/first
import { PRIMARY_ACTION } from "../../../constants/primary-action";
// eslint-disable-next-line import/first
import { OnboardingFooter } from "../../../screens/onboarding/components/OnboardingChrome";

describe("LoginPrimaryButton & Onboarding Button Polish", () => {
  it("renders with the canonical PRIMARY_ACTION dimensions and styling", () => {
    let tree!: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <LoginPrimaryButton onPress={() => {}}>
          <LoginPrimaryButtonLabel>Continue</LoginPrimaryButtonLabel>
        </LoginPrimaryButton>,
      );
    });

    const root = tree.root;
    const button = root.findByType(LoginPrimaryButton);
    const pressable = button.findByProps({ accessibilityRole: "button" });
    const flattenedStyle = StyleSheet.flatten(pressable.props.style);

    expect(flattenedStyle.height).toBe(PRIMARY_ACTION.height);
    expect(flattenedStyle.borderRadius).toBe(PRIMARY_ACTION.radius);
    expect(flattenedStyle.borderBottomWidth).toBe(PRIMARY_ACTION.rimWidth);
    expect(flattenedStyle.backgroundColor).toBe(PRIMARY_ACTION.face);
    expect(flattenedStyle.borderBottomColor).toBe(PRIMARY_ACTION.rim);
    expect(flattenedStyle.width).toBe("100%");
    expect(flattenedStyle.paddingHorizontal).toBe(16);
  });

  it("enables adjustsFontSizeToFit and minimumFontScale on LoginPrimaryButtonLabel to prevent ... truncation", () => {
    let tree!: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <LoginPrimaryButtonLabel>
          Very Long Onboarding Continue Text That Must Never Be Cut Off
        </LoginPrimaryButtonLabel>,
      );
    });

    const textNode = tree.root.findByType(Text);
    expect(textNode.props.adjustsFontSizeToFit).toBe(true);
    expect(textNode.props.minimumFontScale).toBe(0.75);
    expect(textNode.props.numberOfLines).toBe(1);
  });

  it("sets letterSpacing to 0 for RTL / Kurdish / Arabic scripts to prevent clipping", () => {
    let tree!: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <LoginPrimaryButtonLabel languageCode="ku">
          دەست بە فێربوون بکە
        </LoginPrimaryButtonLabel>,
      );
    });

    const textNode = tree.root.findByType(Text);
    const flatStyle = StyleSheet.flatten(textNode.props.style);
    expect(flatStyle.letterSpacing).toBe(0);
  });

  it("OnboardingFooter renders LoginPrimaryButton without delayed entrance reveal", () => {
    let tree!: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <OnboardingFooter
          label="Continue"
          locale="en"
          bottomInset={20}
          onPress={() => {}}
          testID="onboarding-continue"
        />,
      );
    });

    const button = tree.root.findByType(LoginPrimaryButton);
    expect(button).toBeTruthy();
    expect(button.props.testID).toBe("onboarding-continue");
    expect(button.props.accessibilityLabel).toBe("Continue");
  });
});
