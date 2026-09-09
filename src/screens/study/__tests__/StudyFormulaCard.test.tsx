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

import { formatMathFormula, StudyFormulaCard } from "../components/StudyFormulaCard";
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

  test("formatMathFormula converts LaTeX commands to clean readable Unicode math", () => {
    const rawEquation = "a x + b = c \\implies x = \\frac{c - b}{a}";
    const formatted = formatMathFormula(rawEquation);
    expect(formatted).toContain("⟹");
    expect(formatted).not.toContain("\\implies");
    expect(formatted).not.toContain("\\frac");
    expect(formatted).toContain("(c - b) / a");

    const derivative = "\\frac{d}{dx}\\left[\\frac{1}{1+x}\\right] = -\\frac{1}{(1+x)^2}";
    const formattedDeriv = formatMathFormula(derivative);
    expect(formattedDeriv).not.toContain("\\frac");
    expect(formattedDeriv).not.toContain("\\left");
    expect(formattedDeriv).toContain("²");
  });

  test("respects visibleStepCount for synchronized progressive step reveal", () => {
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyFormulaCard
          formula="2x + 4 = 12"
          summary="A balanced linear equation."
          steps={mockSteps}
          quickQuiz={mockQuiz}
          onSpeakStep={jest.fn()}
          speakingStepIndex={0}
          visibleStepCount={1}
        />,
      );
    });

    const root = component!.root;
    assertNoTextNodeUnderAnyView(root);

    // Only step 1 title should be rendered, step 2 should not be visible yet
    const allTexts = root.findAllByType("Text" as any).map((t) => t.props.children).flat().join(" ");
    expect(allTexts).toContain("1 / 2");
    expect(allTexts).toContain("Subtract 4 from both sides");
    expect(allTexts).not.toContain("Divide both sides by 2");
  });

  test("renders all steps when visibleStepCount is omitted or equals total steps", () => {
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyFormulaCard
          formula="2x + 4 = 12"
          summary="A balanced linear equation."
          steps={mockSteps}
          quickQuiz={mockQuiz}
          onSpeakStep={jest.fn()}
          speakingStepIndex={null}
          visibleStepCount={2}
        />,
      );
    });

    const root = component!.root;
    assertNoTextNodeUnderAnyView(root);

    const allTexts = root.findAllByType("Text" as any).map((t) => t.props.children).flat().join(" ");
    expect(allTexts).toContain("Subtract 4 from both sides");
    expect(allTexts).toContain("Divide both sides by 2");
  });

  test("cleanMathMode renders strictly cardless: just Step X and large LaTeX math without cards or quiz", () => {
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyFormulaCard
          formula="f'(x) = -1/(1+x)^2"
          summary="Derivative of rational function."
          steps={[
            {
              stepNumber: 1,
              title: "Power Rule",
              explanation: "Convert to negative power.",
              latex: "y = (1 + x)^{-1}",
            },
            {
              stepNumber: 2,
              title: "Differentiate",
              explanation: "Apply chain rule.",
              latex: "\\frac{dy}{dx} = -1(1+x)^{-2}",
            },
          ]}
          quickQuiz={mockQuiz}
          onSpeakStep={jest.fn()}
          speakingStepIndex={0}
          visibleStepCount={1}
          cleanMathMode={true}
        />,
      );
    });

    const root = component!.root;
    assertNoTextNodeUnderAnyView(root);

    const allTexts = root.findAllByType("Text" as any).map((t) => t.props.children).flat().join(" ");
    // Must contain step number and clean math
    expect(allTexts).toMatch(/STEP 1|هەنگاوی 1/);
    expect(allTexts).toContain("(1 + x)⁻¹");
    // Must NOT contain card badges or quiz
    expect(allTexts).not.toContain("KEY EQUATION");
    expect(allTexts).not.toContain("CONCEPT CHECK");
    expect(allTexts).not.toContain("Step-by-Step Derivation");
    expect(allTexts).not.toContain("STEP 2");
  });

  test("formatMathFormula converts LaTeX subscripts properly", () => {
    const formatted = formatMathFormula("x_0 + x_1 + \\tau_1 = a_{n}");
    expect(formatted).toContain("x₀");
    expect(formatted).toContain("x₁");
    expect(formatted).toContain("τ₁");
    expect(formatted).toContain("aₙ");
  });

  test("formatMathFormula handles multi-letter subscripts like net and max", () => {
    const formatted = formatMathFormula("F_{net} = m \\cdot a_{max}");
    expect(formatted).toContain("Fₙₑₜ");
    expect(formatted).toContain("aₘₐₓ");
  });

  test("formatMathFormula converts extended operators and symbols", () => {
    const formatted = formatMathFormula(
      "a \\div b \\pm c \\mp d \\le e \\ge f \\neq g \\nabla f \\in S",
    );
    expect(formatted).toContain("÷");
    expect(formatted).toContain("±");
    expect(formatted).toContain("∓");
    expect(formatted).toContain("≤");
    expect(formatted).toContain("≥");
    expect(formatted).toContain("≠");
    expect(formatted).toContain("∇");
    expect(formatted).toContain("∈");
  });

  test("cleanMathMode falls back to explanation or title if formula is not present", () => {
    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(
        <StudyFormulaCard
          formula=""
          summary=""
          steps={[
            {
              stepNumber: 1,
              title: "Conceptual Intuition",
              explanation: "Think of momentum as mass in motion.",
            },
          ]}
          quickQuiz={mockQuiz}
          onSpeakStep={jest.fn()}
          speakingStepIndex={null}
          visibleStepCount={1}
          cleanMathMode={true}
        />,
      );
    });

    const root = component!.root;
    assertNoTextNodeUnderAnyView(root);
    const allTexts = root.findAllByType("Text" as any).map((t) => t.props.children).flat().join(" ");
    expect(allTexts).toContain("Think of momentum as mass in motion.");
    expect(allTexts).not.toContain("KEY EQUATION");
  });
});

