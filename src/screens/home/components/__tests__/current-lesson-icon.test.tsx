import { describe, expect, it, jest } from "@jest/globals";
import React from "react";
import { View } from "react-native";
import renderer, { act } from "react-test-renderer";

import { CurrentLessonIcon } from "../current-lesson-icon";

jest.mock("react-native-reanimated", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- resolve native dependency inside the hoisted mock.
  const { View: NativeView } = require("react-native");
  const passthrough = (value: unknown) => value;
  const easingFn = () => 0;
  return {
    __esModule: true,
    default: { View: NativeView, createAnimatedComponent: (component: unknown) => component },
    Easing: {
      out: () => easingFn,
      in: () => easingFn,
      bezier: () => easingFn,
      quad: easingFn,
      cubic: easingFn,
      linear: easingFn,
    },
    useAnimatedStyle: (fn: any) => fn(),
    useReducedMotion: () => false,
    useSharedValue: (initial: unknown) => ({ value: initial }),
    withDelay: passthrough,
    withRepeat: passthrough,
    withSequence: passthrough,
    withTiming: passthrough,
    withSpring: passthrough,
    ReduceMotion: { System: "system", Never: "never" },
    cancelAnimation: jest.fn(),
    Extrapolation: { CLAMP: "clamp" },
    interpolate: (val: number, inR: number[], outR: number[]) => outR[0] ?? 1,
  };
});

const MockIcon = (props: any) => <View testID="mock-icon" {...props} />;

describe("CurrentLessonIcon", () => {
  it("renders without crashing", () => {
    let tree: renderer.ReactTestRenderer | null = null;
    act(() => {
      tree = renderer.create(
        <CurrentLessonIcon
          IconComponent={MockIcon}
          color="#58cc02"
          width={40}
          height={40}
        />
      );
    });
    expect(tree).not.toBeNull();
    const json = tree!.toJSON();
    expect(json).toBeDefined();
  });
});

