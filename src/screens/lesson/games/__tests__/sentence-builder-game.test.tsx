import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import React from "react";
import renderer, { act } from "react-test-renderer";
import { Text } from "react-native";

import SentenceBuilderGame from "../SentenceBuilderGame";
import { LightWordTile, LightCheckButton } from "../lesson-light-primitives";
import type { SentenceBuilderQuestion } from "../../../../data/lesson-content";

// Mock expo-router
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ mode: "normal" }),
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- resolve native dependency inside the hoisted mock.
  const { View: RNView } = require("react-native");
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- resolve native dependency inside the hoisted mock.
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
    interpolateColor: () => "#000",
    runOnJS: (fn: any) => fn,
  };
});

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- resolve native dependency inside the hoisted mock.
  const { View: RNView } = require("react-native");
  const gestureChain: any = new Proxy(
    {},
    {
      get: () => () => gestureChain,
    },
  );
  return {
    Gesture: new Proxy(
      {
        Pan: () => gestureChain,
        Tap: () => gestureChain,
        Race: (..._args: any[]) => gestureChain,
        Simultaneous: (..._args: any[]) => gestureChain,
      },
      {
        get: (target: any, prop: string) => {
          if (prop in target) return target[prop];
          return () => gestureChain;
        },
      },
    ),
    GestureDetector: ({ children }: any) => <RNView>{children}</RNView>,
  };
});

// Mock useWordSpeech
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- resolve native dependency inside the hoisted mock.
  const { View: RNView } = require("react-native");
  return {
    TwinoMascot: (props: any) => <RNView testID="twino-mascot" {...props} />,
  };
});

// Mock react-native-svg
jest.mock("react-native-svg", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- resolve native dependency inside the hoisted mock.
  const { View: RNView } = require("react-native");
  return {
    __esModule: true,
    default: RNView,
    Path: RNView,
    Circle: RNView,
    Line: RNView,
  };
});

const mockQuestion: SentenceBuilderQuestion = {
  type: "sentence_builder",
  kurdishSentence: "ئەو سێو دەخوات",
  correctWords: ["She", "eats", "apples"],
  wordBank: ["apples", "today", "She", "eats", "banana", "coffee"],
  targetLanguage: "en",
  sourceLanguage: "ku",
  xp: 10,
};

describe("SentenceBuilderGame", () => {
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

  it("renders Kurdish prompt sentence and all word bank tiles", () => {
    act(() => {
      tree = renderer.create(
        <SentenceBuilderGame
          question={mockQuestion}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;

    // Verify Kurdish prompt is rendered
    const textNodes = root.findAllByType(Text);
    const renderedTexts = textNodes
      .map((n) => (typeof n.props.children === "string" ? n.props.children : ""))
      .filter(Boolean);

    expect(renderedTexts).toContain(mockQuestion.kurdishSentence);

    // Verify all bank words are available to pick
    for (const word of mockQuestion.wordBank) {
      expect(renderedTexts).toContain(word);
    }
  });

  it("disables check button initially when no words are placed", () => {
    act(() => {
      tree = renderer.create(
        <SentenceBuilderGame
          question={mockQuestion}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;
    const checkBtn = root.findByType(LightCheckButton);
    expect(checkBtn.props.disabled).toBe(true);
  });

  it("allows selecting words from bank and completing correct sentence", async () => {
    const onAnswerMock = jest.fn();

    act(() => {
      tree = renderer.create(
        <SentenceBuilderGame
          question={mockQuestion}
          onAnswer={onAnswerMock}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;

    // Pick correct words in order: "She", "eats", "apples"
    for (const targetWord of mockQuestion.correctWords) {
      const bankTiles = root.findAllByType(LightWordTile);
      const tile = bankTiles.find(
        (t) => t.props.label === targetWord && !t.props.disabled && t.props.onPress,
      );
      expect(tile).toBeDefined();

      await act(async () => {
        tile!.props.onPress();
        await jest.advanceTimersByTimeAsync(300);
      });
    }

    // Check button should now be enabled
    const checkBtn = root.findByType(LightCheckButton);
    expect(checkBtn.props.disabled).toBe(false);

    await act(async () => {
      checkBtn.props.onPress();
      await jest.advanceTimersByTimeAsync(300);
    });

    // onAnswer should be called with true
    expect(onAnswerMock).toHaveBeenCalledWith(true);
  });

  it("handles wrong answer submission and reports false", async () => {
    const onAnswerMock = jest.fn();

    act(() => {
      tree = renderer.create(
        <SentenceBuilderGame
          question={mockQuestion}
          onAnswer={onAnswerMock}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;

    // Pick wrong word sequence: "banana"
    const bankTiles = root.findAllByType(LightWordTile);
    const bananaTile = bankTiles.find(
      (t) => t.props.label === "banana" && !t.props.disabled && t.props.onPress,
    );
    expect(bananaTile).toBeDefined();

    await act(async () => {
      bananaTile!.props.onPress();
      await jest.advanceTimersByTimeAsync(300);
    });

    const checkBtn = root.findByType(LightCheckButton);
    expect(checkBtn.props.disabled).toBe(false);

    await act(async () => {
      checkBtn.props.onPress();
      await jest.advanceTimersByTimeAsync(300);
    });

    expect(onAnswerMock).toHaveBeenCalledWith(false);
  });

  it("supports tapping answered words to return them to the bank", async () => {
    act(() => {
      tree = renderer.create(
        <SentenceBuilderGame
          question={mockQuestion}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;

    // Pick "She"
    const bankTiles = root.findAllByType(LightWordTile);
    const sheTile = bankTiles.find((t) => t.props.label === "She" && t.props.onPress);
    expect(sheTile).toBeDefined();

    await act(async () => {
      sheTile!.props.onPress();
      await jest.advanceTimersByTimeAsync(300);
    });

    let checkBtn = root.findByType(LightCheckButton);
    expect(checkBtn.props.disabled).toBe(false);

    // Tap "She" again to return it to bank
    await act(async () => {
      sheTile!.props.onPress();
      await jest.advanceTimersByTimeAsync(300);
    });

    // Check button should now be disabled again
    checkBtn = root.findByType(LightCheckButton);
    expect(checkBtn.props.disabled).toBe(true);
  });

  it("resets answer state when question changes", async () => {
    act(() => {
      tree = renderer.create(
        <SentenceBuilderGame
          question={mockQuestion}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;

    // Select a word
    const bankTiles = root.findAllByType(LightWordTile);
    const sheTile = bankTiles.find((t) => t.props.label === "She" && t.props.onPress);

    await act(async () => {
      sheTile!.props.onPress();
      await jest.advanceTimersByTimeAsync(300);
    });

    let checkBtn = root.findByType(LightCheckButton);
    expect(checkBtn.props.disabled).toBe(false);

    // Change to a new question
    const nextQuestion: SentenceBuilderQuestion = {
      type: "sentence_builder",
      kurdishSentence: "من قاوە دەخۆمەوە",
      correctWords: ["I", "drink", "coffee"],
      wordBank: ["coffee", "drink", "I", "tea"],
      targetLanguage: "en",
      sourceLanguage: "ku",
      xp: 10,
    };

    act(() => {
      tree?.update(
        <SentenceBuilderGame
          question={nextQuestion}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    // Check button should be reset to disabled
    checkBtn = root.findByType(LightCheckButton);
    expect(checkBtn.props.disabled).toBe(true);
  });

  it("handles RTL questions with Kurdish target language properly", () => {
    const rtlQuestion: SentenceBuilderQuestion = {
      type: "sentence_builder",
      kurdishSentence: "I drink tea",
      correctWords: ["من", "چای", "دەخۆمەوە"],
      wordBank: ["دەخۆمەوە", "چای", "ئاو", "من"],
      targetLanguage: "ku",
      sourceLanguage: "en",
      xp: 10,
    };

    act(() => {
      tree = renderer.create(
        <SentenceBuilderGame
          question={rtlQuestion}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;
    const textNodes = root.findAllByType(Text);
    const renderedTexts = textNodes
      .map((n) => (typeof n.props.children === "string" ? n.props.children : ""))
      .filter(Boolean);

    for (const word of rtlQuestion.wordBank) {
      expect(renderedTexts).toContain(word);
    }
  });

  it("produces deterministic word bank ordering across renders", () => {
    act(() => {
      tree = renderer.create(
        <SentenceBuilderGame
          question={mockQuestion}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    const root1 = tree!.root;
    const tiles1 = root1.findAllByType(LightWordTile).map((t) => t.props.label);

    act(() => {
      tree?.update(
        <SentenceBuilderGame
          question={{ ...mockQuestion }}
          onAnswer={jest.fn()}
          pathMode="normal"
        />,
      );
    });

    const root2 = tree!.root;
    const tiles2 = root2.findAllByType(LightWordTile).map((t) => t.props.label);

    expect(tiles1).toEqual(tiles2);
  });

  it("handles duplicate words in the word bank properly", async () => {
    const questionWithDupes: SentenceBuilderQuestion = {
      type: "sentence_builder",
      kurdishSentence: "پشیلەکە سەیری سەگەکەی کرد",
      correctWords: ["the", "cat", "saw", "the", "dog"],
      wordBank: ["the", "cat", "saw", "the", "dog", "bird"],
      targetLanguage: "en",
      sourceLanguage: "ku",
      xp: 10,
    };

    const onAnswerMock = jest.fn();

    act(() => {
      tree = renderer.create(
        <SentenceBuilderGame
          question={questionWithDupes}
          onAnswer={onAnswerMock}
          pathMode="normal"
        />,
      );
    });

    const root = tree!.root;

    // Pick words in order: "the", "cat", "saw", "the", "dog"
    for (const targetWord of questionWithDupes.correctWords) {
      const bankTiles = root.findAllByType(LightWordTile);
      // Find an unselected tile matching targetWord
      const tile = bankTiles.find(
        (t) => t.props.label === targetWord && t.props.state === "idle" && t.props.onPress,
      );
      expect(tile).toBeDefined();

      await act(async () => {
        tile!.props.onPress();
        await jest.advanceTimersByTimeAsync(300);
      });
    }

    const checkBtn = root.findByType(LightCheckButton);
    expect(checkBtn.props.disabled).toBe(false);

    await act(async () => {
      checkBtn.props.onPress();
      await jest.advanceTimersByTimeAsync(300);
    });

    expect(onAnswerMock).toHaveBeenCalledWith(true);
  });
});

