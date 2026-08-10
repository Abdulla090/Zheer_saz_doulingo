import { describe, expect, it, jest } from "@jest/globals";
import React from "react";
import renderer, { act } from "react-test-renderer";
import { Text } from "react-native";

jest.mock("react-native-reanimated", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View: NativeView } = require("react-native");
  const passthrough = (value: unknown) => value;
  const easingFn = () => 0;
  const chainable: any = new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === "then") return undefined;
        return () => chainable;
      },
    },
  );

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
    FadeIn: chainable,
    FadeInDown: chainable,
    FadeInLeft: chainable,
    FadeInRight: chainable,
    FadeInUp: chainable,
    LinearTransition: chainable,
    useAnimatedStyle: () => ({}),
    useReducedMotion: () => false,
    useSharedValue: (initial: unknown) => ({ value: initial }),
    withSpring: passthrough,
    withTiming: passthrough,
  };
});

jest.mock("../../LiquidGlassSurface", () => ({
  LiquidGlassSurface: ({ children }: { children: unknown }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ReactRuntime = require("react");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View: NativeView } = require("react-native");
    return ReactRuntime.createElement(NativeView, null, children);
  },
}));

jest.mock("../../../utils/haptics", () => ({ hapticImpact: jest.fn() }));

// eslint-disable-next-line import/first -- component must load after native mocks.
import { PressableScale } from "../PressableScale";

function mount(activateOnPressIn: boolean, onPress: () => void) {
  let tree!: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(
      <PressableScale
        activateOnPressIn={activateOnPressIn}
        haptic={false}
        onPress={onPress}
      >
        <Text>Start</Text>
      </PressableScale>,
    );
  });

  const pressable = tree.root.findAll(
    (node) =>
      node.type !== PressableScale &&
      typeof (node.props as any)?.onPressIn === "function" &&
      typeof (node.props as any)?.onPress === "function",
    { deep: true },
  ).at(-1);

  return pressable!.props as Record<string, () => void>;
}

describe("PressableScale touch-down activation", () => {
  it("commits on press-in and suppresses the release duplicate", () => {
    const onPress = jest.fn();
    const props = mount(true, onPress);

    act(() => props.onPressIn());
    expect(onPress).toHaveBeenCalledTimes(1);

    act(() => props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("keeps standard release activation by default", () => {
    const onPress = jest.fn();
    const props = mount(false, onPress);

    act(() => props.onPressIn());
    expect(onPress).not.toHaveBeenCalled();

    act(() => props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
