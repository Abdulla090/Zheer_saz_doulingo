import { describe, expect, it, jest } from "@jest/globals";
import React from "react";
import renderer, { act } from "react-test-renderer";
import { Text } from "react-native";

/*
 * Reanimated 4 throws on import outside a native runtime, and its shipped
 * `mock` entry re-imports the real module, so it cannot help here. Stub the
 * handful of APIs this component touches instead. The branch under test
 * deliberately avoids Reanimated — this only exists so the module graph loads.
 */
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
  /*
   * `motion.ts` builds transition/animation descriptors at module scope via
   * fluent chains (`LinearTransition.duration(160).easing(...)`), so the stubs
   * for those have to return something endlessly chainable.
   */
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
    ReduceMotion: { System: "system", Never: "never", Always: "always" },
    Extrapolation: { CLAMP: "clamp" },
    LinearTransition: chainable,
    FadeIn: chainable,
    FadeInDown: chainable,
    FadeInUp: chainable,
    FadeOut: chainable,
    ZoomIn: chainable,
    SlideInDown: chainable,
    cancelAnimation: () => {},
    interpolate: () => 0,
    interpolateColor: () => "#000000",
    runOnJS: (fn: unknown) => fn,
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    useReducedMotion: () => false,
    withDelay: (_d: unknown, v: unknown) => v,
    withRepeat: passthrough,
    withSequence: passthrough,
    withSpring: passthrough,
    withTiming: passthrough,
  };
});

// eslint-disable-next-line import/first -- must load after the jest.mock above.
import { IOSPressable } from "../ios-pressable";

/**
 * `IOSPressable` has two implementations behind one prop. The `inList` branch
 * skips Reanimated for virtualized lists, and it destructures the press
 * callbacks out of `props` to do so — which means every prop it forgets to
 * re-forward is dropped silently. That is exactly what happened to
 * `onPressIn`/`onPressOut`: the path nodes drive their own 3D press animation
 * from those callbacks, and none of it ran, so tapping a lesson node produced
 * no visual feedback at all.
 *
 * Nothing about that bug is visible to the type checker (both callbacks are
 * optional) or to a lint rule, so it is pinned here.
 */
/**
 * Returns the props of the pressable that `IOSPressable` actually rendered.
 *
 * Deliberately not `findByType(Pressable)`: under jest-expo the rendered node
 * type is not identical to the imported `Pressable`, and the point of the test
 * is prop forwarding, not component identity. So this walks for the innermost
 * node carrying a press handler, excluding `IOSPressable` itself — whose props
 * are the ones we passed in, and would make a dropped callback look forwarded.
 */
function mount(element: React.ReactElement, handlerKey = "onPressIn") {
  let tree!: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(element);
  });

  const matches = tree.root.findAll(
    (node) =>
      node.type !== IOSPressable && typeof (node.props as any)?.[handlerKey] === "function",
    { deep: true },
  );

  return (matches.at(-1)?.props ?? {}) as Record<string, any>;
}

describe("IOSPressable press callbacks", () => {
  it.each([true, false])("forwards onPressIn/onPressOut when inList=%s", (inList) => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();

    const props = mount(
      <IOSPressable inList={inList} onPressIn={onPressIn} onPressOut={onPressOut}>
        <Text>node</Text>
      </IOSPressable>,
    );

    act(() => {
      props.onPressIn?.({});
    });
    expect(onPressIn).toHaveBeenCalledTimes(1);

    act(() => {
      props.onPressOut?.({});
    });
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it.each([true, false])("still forwards onPress when inList=%s", (inList) => {
    const onPress = jest.fn();

    const props = mount(
      <IOSPressable inList={inList} onPress={onPress}>
        <Text>node</Text>
      </IOSPressable>,
      "onPress",
    );

    act(() => {
      props.onPress?.({});
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each([true, false])("passes disabled through when inList=%s", (inList) => {
    // Keyed on `onPress`: a disabled node still receives the handler prop,
    // whereas `onPressIn` is not what this case is about.
    const props = mount(
      <IOSPressable inList={inList} disabled onPress={() => {}}>
        <Text>node</Text>
      </IOSPressable>,
      "onPress",
    );
    expect(props.disabled).toBe(true);
  });
});
