import { describe, expect, test, jest } from "@jest/globals";
import React from "react";
import { View } from "react-native";
import renderer, { act } from "react-test-renderer";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAwareScrollView: "KeyboardAwareScrollView",
}));

jest.mock("react-native-reanimated", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View: NativeView } = require("react-native");
  const passthrough = (value: unknown) => value;
  const easingFn = () => 0;
  return {
    __esModule: true,
    default: { View: NativeView, createAnimatedComponent: (component: unknown) => component },
    Easing: {
      out: () => easingFn,
      in: () => easingFn,
      inOut: () => easingFn,
      cubic: easingFn,
      quad: easingFn,
    },
    useAnimatedStyle: () => ({}),
    useSharedValue: (initial: unknown) => ({ value: initial }),
    withRepeat: passthrough,
    withSequence: passthrough,
    withTiming: passthrough,
  };
});

jest.mock("../../../components/animations", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactActual = require("react");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pressable: RNPressable } = require("react-native");
  return {
    PressableScale: (props: any) => ReactActual.createElement(RNPressable, props),
  };
});

jest.mock("../../../hooks/use-tts", () => ({
  useTTS: () => ({
    speak: jest.fn(),
    stop: jest.fn(),
    speaking: false,
  }),
}));

jest.mock("../../../hooks/use-speech-capture", () => ({
  useSpeechCapture: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    listening: false,
    available: true,
  }),
}));

jest.mock("react-native-webview", () => ({
  WebView: () => null,
}));

import { StudyTutorScreen } from "../StudyTutorScreen";

function assertNoTextNodeUnderAnyView(root: renderer.ReactTestInstance) {
  const allViews = root.findAllByType(View);
  for (const viewInstance of allViews) {
    const rawChildren = viewInstance.props.children;
    const childArray = Array.isArray(rawChildren) ? rawChildren : [rawChildren];
    for (const child of childArray) {
      if (child === null || child === undefined || child === false || child === true) {
        continue;
      }
      expect(typeof child).not.toBe("string");
      expect(typeof child).not.toBe("number");
    }
  }
}

describe("StudyTutorScreen Component", () => {
  test("mounts full screen cleanly and without any text node under View", () => {
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(<StudyTutorScreen />);
    });

    const root = component!.root;
    expect(root).toBeDefined();
    assertNoTextNodeUnderAnyView(root);
  });
});
