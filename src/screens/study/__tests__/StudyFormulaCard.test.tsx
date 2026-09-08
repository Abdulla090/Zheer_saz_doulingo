import { describe, expect, test, jest } from "@jest/globals";
import React from "react";
import { Pressable, View } from "react-native";
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

import { StudyFormulaCard } from "../components/StudyFormulaCard";
import type { StudyQuizQuestion, StudyStep } from "../../../services/study-tutor-service";

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

describe("StudyFormulaCard Component", () => {
  const mockSteps: StudyStep[] = [
    {
      stepNumber: 1,
      title: "Subtract 4 from both sides",
      explanation: "To isolate 2x, subtract 4 from both sides of the balance.",
      formulaSnippet: "2x + 4 - 4 = 12 - 4",
    },
    {
      stepNumber: 2,
      title: "Divide both sides by 2",
      explanation: "Divide both sides by the coefficient 2 to find x.",
      formulaSnippet: "x = 4",
    },
  ];

  const mockQuiz: StudyQuizQuestion = {
    question: "If 2x + 4 = 12, what is x?",
    options: ["2", "4", "6", "8"],
    correctIndex: 1,
    explanation: "Subtract 4 to get 2x = 8, then divide by 2 to get x = 4.",
  };

  test("renders formula card, steps, and quiz without unexpected text nodes under any View", () => {
    const onSpeakStep = jest.fn();

    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyFormulaCard
          formula="2x + 4 = 12"
          summary="A balanced linear equation solved by inverse operations."
          steps={mockSteps}
          quickQuiz={mockQuiz}
          onSpeakStep={onSpeakStep}
          speakingStepIndex={null}
        />,
      );
    });

    const root = component!.root;
    expect(root).toBeDefined();
    assertNoTextNodeUnderAnyView(root);
  });

  test("renders gracefully with empty formula, summary, and quiz without stray text nodes", () => {
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyFormulaCard
          formula=""
          summary=""
          steps={[]}
          quickQuiz={{ question: "", options: [], correctIndex: 0, explanation: "" }}
          onSpeakStep={jest.fn()}
          speakingStepIndex={null}
        />,
      );
    });

    const root = component!.root;
    expect(root).toBeDefined();
    assertNoTextNodeUnderAnyView(root);
  });

  test("handles quiz option selection and displays explanation with correct styling", () => {
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyFormulaCard
          formula="2x + 4 = 12"
          summary="A balanced linear equation solved by inverse operations."
          steps={mockSteps}
          quickQuiz={mockQuiz}
          onSpeakStep={jest.fn()}
          speakingStepIndex={null}
        />,
      );
    });

    const root = component!.root;

    // Find quiz options
    const option1 = root.findByProps({ accessibilityLabel: "Quiz option 1" });
    const option2 = root.findByProps({ accessibilityLabel: "Quiz option 2" });
    const option3 = root.findByProps({ accessibilityLabel: "Quiz option 3" });
    const option4 = root.findByProps({ accessibilityLabel: "Quiz option 4" });
    expect(option1).toBeDefined();
    expect(option2).toBeDefined();
    expect(option3).toBeDefined();
    expect(option4).toBeDefined();

    // Click correct option (index 1 / option 2)
    act(() => {
      option2.props.onPress();
    });

    assertNoTextNodeUnderAnyView(root);

    // Verify explanation is shown
    const allTexts = root.findAllByType("Text" as any).map((t) => t.props.children).flat().join(" ");
    expect(allTexts).toContain("Subtract 4 to get 2x = 8");
  });

  test("triggers onSpeakStep when audio button on step is pressed", () => {
    const onSpeakStep = jest.fn();
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyFormulaCard
          formula="2x + 4 = 12"
          summary="A balanced linear equation."
          steps={mockSteps}
          quickQuiz={mockQuiz}
          onSpeakStep={onSpeakStep}
          speakingStepIndex={null}
        />,
      );
    });

    const root = component!.root;
    const audioButtons = root.findAllByProps({ accessibilityLabel: "Read step aloud" });
    expect(audioButtons.length).toBeGreaterThan(0);

    act(() => {
      audioButtons[0].props.onPress();
    });

    expect(onSpeakStep).toHaveBeenCalledWith(
      "Subtract 4 from both sides. To isolate 2x, subtract 4 from both sides of the balance.",
      0,
    );
  });
});
