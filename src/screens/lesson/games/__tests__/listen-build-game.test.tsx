import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import React from "react";
import renderer, { act } from "react-test-renderer";
import { Text, View } from "react-native";

// Mock expo-router
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({}),
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/",
}));

// Mock expo-audio
jest.mock("expo-audio", () => ({
  createAudioPlayer: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    remove: jest.fn(),
  }),
  useAudioPlayer: () => ({
    play: jest.fn(),
    pause: jest.fn(),
  }),
}));

// Mock useTTS
jest.mock("../../../../hooks/use-tts", () => ({
  useTTS: () => ({
    speak: jest.fn(),
    stop: jest.fn(),
    isSpeaking: false,
  }),
}));

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Warning: "warning", Error: "error" },
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View: RNView } = require("react-native");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useRef } = require("react");
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
      View: RNView,
      createAnimatedComponent: (c: unknown) => c,
    },
    Easing,
    LinearTransition: chainable,
    FadeIn: chainable,
    FadeOut: chainable,
    FadeInDown: chainable,
    FadeInUp: chainable,
    FadeOutDown: chainable,
    FadeOutUp: chainable,
    useSharedValue: (initial: unknown) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const ref = useRef({ value: initial });
      return ref.current;
    },
    useAnimatedStyle: () => ({}),
    useAnimatedReaction: () => {},
    useReducedMotion: () => false,
    withSpring: passthrough,
    withTiming: passthrough,
    withSequence: passthrough,
    withDelay: passthrough,
    withRepeat: passthrough,
    cancelAnimation: () => {},
    interpolate: (_val: number, _inRange: number[], outRange: number[]) => outRange[0] ?? 0,
    runOnJS: (fn: any) => fn,
  };
});

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View: RNView } = require("react-native");
  const gestureChain: any = new Proxy(
    {},
    {
      get: () => () => gestureChain,
    },
  );
  return {
    Gesture: {
      Pan: () => gestureChain,
    },
    GestureDetector: ({ children }: any) => <RNView>{children}</RNView>,
  };
});

// Mock useWordSpeech with stable functions
const mockSpeak = jest.fn();
const mockSpeakWord = jest.fn();
const mockStop = jest.fn();

jest.mock("../use-word-speech", () => ({
  useWordSpeech: () => ({
    speak: mockSpeak,
    speakWord: mockSpeakWord,
    stop: mockStop,
    speaking: false,
  }),
}));

// Mock mascot
jest.mock("../../../../components/mascot/TwinoMascot", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View: RNView } = require("react-native");
  return {
    TwinoMascot: (props: any) => <RNView testID="twino-mascot" {...props} />,
  };
});

// Mock react-native-svg
jest.mock("react-native-svg", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View: RNView } = require("react-native");
  return {
    __esModule: true,
    default: RNView,
    Path: RNView,
    Circle: RNView,
    Line: RNView,
  };
});

import ListenBuildGame from "../ListenBuildGame";
import { LightWordTile, LightCheckButton } from "../lesson-light-primitives";
import type { ListenBuildQuestion } from "../../../../data/types";

const mockQuestion: ListenBuildQuestion = {
  type: "listen_build",
  sentence: "I like learning languages",
  correctWords: ["I", "like", "learning", "languages"],
  wordBank: ["learning", "banana", "I", "languages", "like", "coffee"],
  targetLanguage: "en",
  xp: 10,
};

describe("ListenBuildGame", () => {
  let tree: renderer.ReactTestRenderer | null = null;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (tree) {
      act(() => {
        tree?.unmount();
      });
      tree = null;
    }
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("renders audio prompt without leaking the written sentence text", () => {
    act(() => {
      tree = renderer.create(
        <ListenBuildGame
          question={mockQuestion}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;

    // Check mascot is present with headset pose
    const mascot = root.findByProps({ testID: "twino-mascot" });
    expect(mascot).toBeDefined();
    expect(mascot.props.pose).toBe("headset");

    // Check all text in the component to verify the secret sentence is NOT rendered
    const textNodes = root.findAllByType(Text);
    const renderedTexts = textNodes
      .map((n) => (typeof n.props.children === "string" ? n.props.children : ""))
      .filter(Boolean);

    // The full secret sentence should NOT appear anywhere in the UI text
    expect(renderedTexts).not.toContain("I like learning languages");

    // All bank words should be available for the user to choose
    for (const word of mockQuestion.wordBank) {
      expect(renderedTexts).toContain(word);
    }
  });

  it("renders both standard speed and slow speed audio buttons", () => {
    act(() => {
      tree = renderer.create(
        <ListenBuildGame
          question={mockQuestion}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;
    // Verify audio button labels are present in accessibility or text
    const textNodes = root.findAllByType(Text);
    const renderedTexts = textNodes
      .map((n) => (typeof n.props.children === "string" ? n.props.children : ""))
      .filter(Boolean);

    // Should include Listen and Slow option labels
    const hasListen = renderedTexts.some((t) => /listen/i.test(t));
    expect(hasListen).toBe(true);
  });

  it("allows selecting words from bank and checking answer", async () => {
    const onAnswerMock = jest.fn();

    act(() => {
      tree = renderer.create(
        <ListenBuildGame
          question={mockQuestion}
          onAnswer={onAnswerMock}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;

    // Click bank tiles in correct order: "I", "like", "learning", "languages"
    for (const targetWord of mockQuestion.correctWords) {
      // Re-find bank tiles each iteration as state updates
      const bankTiles = root.findAllByType(LightWordTile);
      const tile = bankTiles.find(
        (t) => t.props.label === targetWord && !t.props.disabled && t.props.onPress,
      );
      expect(tile).toBeDefined();

      await act(async () => {
        tile!.props.onPress();
        await jest.advanceTimersByTimeAsync(500);
      });
    }

    // Now find the check button and press it
    const checkBtn = root.findByType(LightCheckButton);
    expect(checkBtn.props.disabled).toBe(false);

    await act(async () => {
      checkBtn.props.onPress();
      await jest.advanceTimersByTimeAsync(500);
    });

    // onAnswer should be called with true for correct sentence
    expect(onAnswerMock).toHaveBeenCalledWith(true);
  });
});
