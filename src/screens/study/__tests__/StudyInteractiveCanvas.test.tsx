import { describe, expect, test, jest } from "@jest/globals";
import React from "react";
import { Pressable } from "react-native";
import renderer, { act } from "react-test-renderer";

import { StudyInteractiveCanvas } from "../components/StudyInteractiveCanvas";
import type { InteractiveWidgetState } from "../../../services/study-tutor-service";

const mockReact = React;
const mockPressable = Pressable;
jest.mock("../../../components/animations", () => ({
  PressableScale: (props: any) => mockReact.createElement(mockPressable, props),
}));

describe("StudyInteractiveCanvas Component", () => {
  test("renders AI-generated dynamic HTML simulation cleanly", () => {
    const aiWidget: InteractiveWidgetState = {
      type: "dynamic-simulation",
      title: "Double Slit Experiment",
      summary: "Interference pattern of light passing through twin slits",
      html: "<!DOCTYPE html><html><body><canvas id='c'></canvas></body></html>",
      executedPythonCode: "import math\nwavelength = 650e-9\nslit_d = 0.1e-3",
      executedPythonOutput: "fringe_spacing = 0.0065 m",
    };

    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(<StudyInteractiveCanvas widgetState={aiWidget} />);
    });

    const root = component!.root;
    expect(root).toBeDefined();

    // Verify title is rendered
    const textNodes = root.findAllByType("Text" as any);
    const textContents = textNodes.map((n) => n.props.children).flat().join(" ");
    expect(textContents).toContain("DOUBLE SLIT EXPERIMENT");
    expect(textContents).toContain("Python Math");
  });

  test("renders fallback simulation for preset widgets cleanly", () => {
    const presetWidget: InteractiveWidgetState = {
      type: "balance-scale",
      title: "Solving Equations with Balance Scale",
      config: {
        equation: "2x + 4 = 12",
        leftTarget: 12,
        rightTarget: 12,
        initialLeft: 4,
        initialRight: 12,
        variableName: "x",
        solutionValue: 4,
      },
    };

    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(<StudyInteractiveCanvas widgetState={presetWidget} />);
    });

    const root = component!.root;
    expect(root).toBeDefined();

    const textNodes = root.findAllByType("Text" as any);
    const textContents = textNodes.map((n) => n.props.children).flat().join(" ");
    expect(textContents).toContain("SOLVING EQUATIONS WITH BALANCE SCALE");
    expect(textContents).toContain("Reset");
  });

  test("handles Python calculations disclosure toggle", () => {
    const aiWidget: InteractiveWidgetState = {
      type: "dynamic-simulation",
      title: "Pendulum with Drag",
      executedPythonCode: "theta_ddot = -g/L * sin(theta) - b * theta_dot",
      executedPythonOutput: "period = 2.006 s",
    };

    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(<StudyInteractiveCanvas widgetState={aiWidget} />);
    });

    const root = component!.root;
    // Find the toggle button
    const pythonBadge = root.findAll((node) => {
      return (
        node.props?.children &&
        (typeof node.props.children === "string"
          ? node.props.children.includes("Python Math")
          : Array.isArray(node.props.children) &&
            node.props.children.some(
              (c: any) => typeof c === "string" && c.includes("Python Math"),
            ))
      );
    });

    expect(pythonBadge.length).toBeGreaterThan(0);
  });

  test("renders AI-generated dynamic JS simulation code without pre-baked HTML cleanly", () => {
    const aiCodeWidget: InteractiveWidgetState = {
      type: "dynamic-simulation",
      title: "Bayesian Probability Tree",
      summary: "Visualizing prior and posterior probabilities",
      code: "function drawTree() { console.log('tree'); } drawTree();",
    };

    let component: renderer.ReactTestRenderer | undefined;
    act(() => {
      component = renderer.create(<StudyInteractiveCanvas widgetState={aiCodeWidget} />);
    });

    const root = component!.root;
    expect(root).toBeDefined();

    const textNodes = root.findAllByType("Text" as any);
    const textContents = textNodes.map((n) => n.props.children).flat().join(" ");
    expect(textContents).toContain("BAYESIAN PROBABILITY TREE");
    expect(textContents).toContain("Reset");
  });
});
