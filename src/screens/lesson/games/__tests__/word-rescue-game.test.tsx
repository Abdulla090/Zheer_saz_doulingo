/* eslint-disable @typescript-eslint/no-require-imports */
import React from "react";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import renderer, { act } from "react-test-renderer";
import WordRescueGame from "../word-rescue-game";
import { buildWordRescue } from "../word-rescue";
import type { MultipleChoiceQuestion } from "../../../../data/types";

jest.mock("../../../../components/ui/AppText", () => ({ AppText: require("react-native").Text }));
jest.mock("../../../../hooks/useI18n", () => ({ useI18n: () => ({ locale: "en", t: (key: string) => key }) }));
jest.mock("../../../../hooks/useThemeColors", () => ({ useThemeColors: () => ({ colors: {} }) }));
jest.mock("../../../../utils/haptics", () => ({ hapticSelection: jest.fn() }));
jest.mock("../use-word-speech", () => ({ useWordSpeech: () => ({ speakWord: jest.fn(), canSpeak: false }) }));
jest.mock("../GameAnimatedShell", () => ({ GameRoot: require("react-native").View, GameFooter: require("react-native").View }));
jest.mock("../lesson-light-primitives", () => ({
  LightGameHeading: require("react-native").Text,
  LightCheckButton: ({ label, ...props }: { label: string }) =>
    require("react").createElement(require("react-native").Pressable, { ...props, accessibilityLabel: label }),
}));
jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: { View: require("react-native").View },
  useReducedMotion: () => false,
  useSharedValue: (value: number) => ({ get: () => value, set: jest.fn() }),
  useAnimatedStyle: () => ({}), withSpring: (value: number) => value,
}));

const question: MultipleChoiceQuestion = {
  type: "multiple_choice", prompt: "قەهوە", promptLang: "ku", targetLanguage: "en",
  correctAnswer: "coffee", options: ["coffee", "tea"], xp: 10,
};

describe("Word Rescue interaction", () => {
  let tree: renderer.ReactTestRenderer;
  afterEach(() => { act(() => tree.unmount()); });
  const buttons = () => tree.root.findAll(node => typeof node.props.onPress === "function" &&
    (node.props.accessibilityRole === "button" || node.props.accessibilityLabel === "lessons.check"));
  const tile = (letter: string) => buttons().find(b => b.props.accessibilityLabel === letter && !b.props.disabled)!;
  const check = () => buttons().find(b => b.props.accessibilityLabel === "lessons.check")!;
  const action = (key: string) => buttons().find(b => b.findAll(node => node.props.children === key).length > 0)!;

  it("keeps Check disabled until complete, prevents duplicate tile use and submits once", () => {
    const onAnswer = jest.fn();
    act(() => { tree = renderer.create(<WordRescueGame question={question} puzzle={buildWordRescue(question)!} onAnswer={onAnswer} />); });
    expect(check().props.disabled).toBe(true);
    const first = tile("c");
    act(() => { first.props.onPress(); first.props.onPress(); });
    expect(check().props.disabled).toBe(true);
    for (const letter of "offee") act(() => tile(letter).props.onPress());
    expect(check().props.disabled).toBe(false);
    const submit = check().props.onPress;
    act(() => { submit(); submit(); });
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it("lets the learner undo, repairs an incorrect start with a hint, and grades a wrong word", () => {
    const onAnswer = jest.fn();
    act(() => { tree = renderer.create(<WordRescueGame question={question} puzzle={buildWordRescue(question)!} onAnswer={onAnswer} />); });
    act(() => tile("e").props.onPress());
    act(() => action("lessons.wordRescueUndo").props.onPress());
    expect(buttons().filter(b => b.props.accessibilityState?.selected)).toHaveLength(0);
    act(() => tile("e").props.onPress());
    act(() => action("lessons.wordRescueHint").props.onPress());
    expect(buttons().find(b => b.props.accessibilityLabel === "c")!.props.disabled).toBe(true);
    for (const letter of "effeo") act(() => tile(letter).props.onPress());
    act(() => check().props.onPress());
    expect(onAnswer).toHaveBeenCalledWith(false);
  });
});
