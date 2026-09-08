import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import renderer, { act } from "react-test-renderer";

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

let mockListening = false;
let mockAvailable = true;
let capturedHandlers: any = null;
const mockStart = jest.fn(async (handlers: any) => {
  capturedHandlers = handlers;
  return true;
});
const mockStop = jest.fn();

jest.mock("../../../hooks/use-speech-capture", () => ({
  useSpeechCapture: () => ({
    start: mockStart,
    stop: mockStop,
    listening: mockListening,
    available: mockAvailable,
  }),
}));

import { StudyVoiceBar } from "../components/StudyVoiceBar";

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

describe("StudyVoiceBar Component", () => {
  beforeEach(() => {
    mockListening = false;
    mockAvailable = true;
    capturedHandlers = null;
    mockStart.mockClear();
    mockStop.mockClear();
  });

  test("renders without unexpected text node children under any View (default state)", () => {
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyVoiceBar
          onAskQuestion={jest.fn()}
          isGenerating={false}
          onReplayAudio={jest.fn()}
          speaking={false}
        />,
      );
    });

    const root = component!.root;
    expect(root).toBeDefined();
    assertNoTextNodeUnderAnyView(root);
  });

  test("renders properly when listening is active without stray text nodes", () => {
    mockListening = true;

    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyVoiceBar
          onAskQuestion={jest.fn()}
          isGenerating={false}
          onReplayAudio={jest.fn()}
          speaking={false}
        />,
      );
    });

    const root = component!.root;
    expect(root).toBeDefined();
    assertNoTextNodeUnderAnyView(root);
  });

  test("renders properly and text-node-free in typing mode", () => {
    const onAskQuestion = jest.fn();
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyVoiceBar
          onAskQuestion={onAskQuestion}
          isGenerating={false}
          onReplayAudio={jest.fn()}
          speaking={false}
        />,
      );
    });

    const root = component!.root;
    // Find placeholder and click it to open typing mode
    const placeholderPressable = root.findByProps({ accessibilityLabel: "Type question" });

    act(() => {
      placeholderPressable.props.onPress();
    });

    // In typing mode, assert no text nodes directly under View
    assertNoTextNodeUnderAnyView(root);

    // Verify TextInput is present
    const input = root.findByType(TextInput);
    expect(input).toBeDefined();

    // Type text into input
    act(() => {
      input.props.onChangeText("What is kinetic energy?");
    });
    assertNoTextNodeUnderAnyView(root);

    // Submit text via submit button
    const submitBtn = root.findByProps({ accessibilityLabel: "Submit question" });
    act(() => {
      submitBtn.props.onPress();
    });

    expect(onAskQuestion).toHaveBeenCalledWith("What is kinetic energy?");
    assertNoTextNodeUnderAnyView(root);
  });

  test("canceling typing mode returns to placeholder without errors", () => {
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyVoiceBar
          onAskQuestion={jest.fn()}
          isGenerating={false}
          onReplayAudio={jest.fn()}
          speaking={false}
        />,
      );
    });

    const root = component!.root;
    const placeholderPressable = root.findByProps({ accessibilityLabel: "Type question" });

    act(() => {
      placeholderPressable.props.onPress();
    });

    // Find the cancel button
    const cancelPressable = root.findByProps({ accessibilityLabel: "Cancel typing" });
    expect(cancelPressable).toBeDefined();

    act(() => {
      cancelPressable!.props.onPress();
    });

    // Should return to normal mode
    assertNoTextNodeUnderAnyView(root);
    expect(root.findAllByType(TextInput).length).toBe(0);
  });

  test("invokes onReplayAudio when replay audio button is pressed", () => {
    const onReplayAudio = jest.fn();
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyVoiceBar
          onAskQuestion={jest.fn()}
          isGenerating={false}
          onReplayAudio={onReplayAudio}
          speaking={false}
        />,
      );
    });

    const replayBtn = component!.root.findByProps({ accessibilityLabel: "Listen to tutor" });
    expect(replayBtn).toBeDefined();
    act(() => {
      replayBtn.props.onPress();
    });
    expect(onReplayAudio).toHaveBeenCalledTimes(1);
  });

  test("toggles microphone and handles speech recognition callbacks", async () => {
    const onAskQuestion = jest.fn();
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyVoiceBar
          onAskQuestion={onAskQuestion}
          isGenerating={false}
          onReplayAudio={jest.fn()}
          speaking={false}
        />,
      );
    });

    const root = component!.root;
    const micBtn = root.findByProps({ accessibilityLabel: "Ask by voice" });

    await act(async () => {
      await micBtn.props.onPress();
    });

    expect(mockStart).toHaveBeenCalledTimes(1);
    expect(capturedHandlers).toBeDefined();

    // Trigger interim speech result
    act(() => {
      capturedHandlers.onResult("how does", false);
    });
    assertNoTextNodeUnderAnyView(root);

    // Trigger final speech result
    act(() => {
      capturedHandlers.onResult("how does gravity work", true);
    });
    expect(onAskQuestion).toHaveBeenCalledWith("how does gravity work");
    assertNoTextNodeUnderAnyView(root);
  });
});
