import { describe, expect, test } from "@jest/globals";
import {
  FALLBACK_GEMINI_STUDY_MODEL,
  PRIMARY_GEMINI_STUDY_MODEL,
  askStudyTutor,
  parseGeminiStudyResponse,
  type StudySubject,
} from "../study-tutor-service";

describe("Study Tutor Service & STEM Presets", () => {
  test("specifies correct Gemini primary and fallback models", () => {
    expect(PRIMARY_GEMINI_STUDY_MODEL).toBe("gemini-3.8-flash");
    expect(FALLBACK_GEMINI_STUDY_MODEL).toBe("gemini-3.5-flash-lite");
  });

  test("askStudyTutor throws when empty question and no image provided", async () => {
    await expect(askStudyTutor({ question: "" })).rejects.toThrow();
  });

  test("parseGeminiStudyResponse parses dynamic AI simulation with Python code execution", () => {
    const geminiJson = JSON.stringify({
      subject: "physics",
      title: "Harmonic Oscillator with Air Drag",
      speechExplanation: "Damped harmonic motion decays exponentially over time due to fluid resistance.",
      formula: "m·x'' + b·x' + k·x = 0",
      summary: "Energy dissipates as heat, decreasing amplitude.",
      steps: [
        {
          stepNumber: 1,
          title: "Setup Differential Equation",
          explanation: "Balance spring restoring force against velocity-dependent drag.",
          formulaSnippet: "F_net = -kx - bv",
          highlightTerm: "Damping Coefficient",
        },
      ],
      interactive: {
        type: "dynamic-simulation",
        title: "Harmonic Oscillator with Drag",
        html: "<!DOCTYPE html><html><body><canvas id='c'></canvas></body></html>",
      },
      quickQuiz: {
        question: "What happens to the oscillation frequency under weak damping?",
        options: ["Slightly decreases", "Increases", "Remains infinity", "Becomes zero"],
        correctIndex: 0,
        explanation: "Damping slightly reduces the natural frequency ω_d = sqrt(ω_0^2 - γ^2).",
      },
    });

    const parsed = parseGeminiStudyResponse(
      geminiJson,
      "import numpy as np\nomega_0 = 5.0\ngamma = 0.2",
      "omega_d = 4.996 rad/s",
    );

    expect(parsed).not.toBeNull();
    expect(parsed!.title).toBe("Harmonic Oscillator with Air Drag");
    expect(parsed!.subject).toBe("physics");
    expect(parsed!.interactive.type).toBe("dynamic-simulation");
    expect(parsed!.interactive.html).toContain("<canvas id='c'></canvas>");
    expect(parsed!.interactive.executedPythonCode).toContain("omega_0 = 5.0");
    expect(parsed!.interactive.executedPythonOutput).toContain("omega_d = 4.996 rad/s");
  });

  test("parseGeminiStudyResponse automatically wraps raw simulation JS code into HTML5 template", () => {
    const rawCodeJson = JSON.stringify({
      subject: "chemistry",
      title: "Acid-Base Titration Curve",
      speechExplanation: "The pH changes slowly until approaching the equivalence point where it spikes.",
      formula: "pH = -log[H+]",
      summary: "Equivalence occurs when moles of base equal moles of acid.",
      steps: [
        {
          stepNumber: 1,
          title: "Equivalence Point",
          explanation: "At pH 7 for strong acid/strong base, moles are balanced.",
        },
      ],
      interactive: {
        type: "dynamic-simulation",
        title: "Titration Curve",
        code: "function drawCurve() { console.log('titration'); } drawCurve();",
      },
      quickQuiz: {
        question: "What is the pH at equivalence for HCl and NaOH?",
        options: ["7", "4", "10", "1"],
        correctIndex: 0,
        explanation: "Strong acid and strong base neutralize completely to pH 7.",
      },
    });

    const parsed = parseGeminiStudyResponse(rawCodeJson);
    expect(parsed).not.toBeNull();
    expect(parsed!.interactive.html).toContain("<!DOCTYPE html>");
    expect(parsed!.interactive.html).toContain("drawCurve");
    expect(parsed!.interactive.html).toContain("window.sendToTwino");
  });

  test("parseGeminiStudyResponse successfully parses LLM JSON with unescaped literal newlines in code string", () => {
    // Construct a raw JSON string with literal newlines inside interactive.html (ASCII 10)
    const multilineHtml = "<!DOCTYPE html>\n<html>\n<body>\n<canvas id='c'></canvas>\n<script>\nconsole.log(42);\n</script>\n</body>\n</html>";
    const rawJsonWithLiteralNewlines = `{\n  "subject": "physics",\n  "title": "Fourier Series Decomposition",\n  "speechExplanation": "Any periodic wave can be synthesized as a sum of sines and cosines.",\n  "formula": "f(x) = a0/2 + sum(an*cos(nx) + bn*sin(nx))",\n  "summary": "Higher harmonics add finer details to the synthesized wave.",\n  "steps": [\n    {\n      "stepNumber": 1,\n      "title": "Fundamental Frequency",\n      "explanation": "The first harmonic defines the base pitch.",\n      "formulaSnippet": "omega = 2*pi*f",\n      "highlightTerm": "Fundamental"\n    }\n  ],\n  "interactive": {\n    "type": "dynamic-simulation",\n    "title": "Fourier Harmonics",\n    "html": "${multilineHtml.replace(/\n/g, "\n")}"\n  },\n  "quickQuiz": {\n    "question": "What is the frequency of the 3rd harmonic relative to fundamental f?",\n    "options": ["3f", "f/3", "9f", "f + 3"],\n    "correctIndex": 0,\n    "explanation": "The n-th harmonic has frequency n * f."\n  }\n}`;

    const parsed = parseGeminiStudyResponse(rawJsonWithLiteralNewlines);
    expect(parsed).not.toBeNull();
    expect(parsed!.title).toBe("Fourier Series Decomposition");
    expect(parsed!.interactive.html).toContain("canvas id='c'");
  });

  test("parseGeminiStudyResponse strips markdown fences from interactive.code without leaving backticks in script", () => {
    const fencedCodeJson = JSON.stringify({
      subject: "logic",
      title: "Sorting Visualizer",
      speechExplanation: "QuickSort partitions around a pivot element recursively.",
      formula: "T(n) = 2T(n/2) + O(n)",
      summary: "Divide and conquer brings average time complexity to O(n log n).",
      steps: [
        {
          stepNumber: 1,
          title: "Choose Pivot",
          explanation: "Pick an element and partition elements smaller to the left.",
        },
      ],
      interactive: {
        type: "dynamic-simulation",
        title: "Sorting Bars",
        code: "```javascript\nvar arr = [5, 3, 8, 1, 2];\nconsole.log(arr);\n```",
      },
      quickQuiz: {
        question: "What is average complexity of QuickSort?",
        options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
        correctIndex: 0,
        explanation: "QuickSort averages O(n log n).",
      },
    });

    const parsed = parseGeminiStudyResponse(fencedCodeJson);
    expect(parsed).not.toBeNull();
    expect(parsed!.interactive.html).not.toContain("```javascript");
    expect(parsed!.interactive.html).not.toContain("```");
    expect(parsed!.interactive.html).toContain("var arr = [5, 3, 8, 1, 2];");
  });

  test("parseGeminiStudyResponse handles swapped html and code properties automatically", () => {
    // LLM puts pure JS code in 'html' property
    const swappedJson = JSON.stringify({
      subject: "math",
      title: "Prime Sieve",
      speechExplanation: "The Sieve of Eratosthenes marks multiples of primes.",
      formula: "p <= sqrt(n)",
      summary: "Composite numbers are eliminated early.",
      steps: [
        {
          stepNumber: 1,
          title: "Mark Multiples",
          explanation: "Iterate through numbers and cross off multiples.",
        },
      ],
      interactive: {
        type: "dynamic-simulation",
        title: "Sieve Grid",
        html: "function sieve(n) { return []; } sieve(100);",
      },
      quickQuiz: {
        question: "Is 2 prime?",
        options: ["Yes", "No"],
        correctIndex: 0,
        explanation: "2 is the only even prime.",
      },
    });

    const parsed = parseGeminiStudyResponse(swappedJson);
    expect(parsed).not.toBeNull();
    expect(parsed!.interactive.html).toContain("<!DOCTYPE html>");
    expect(parsed!.interactive.html).toContain("function sieve");
  });

  test("parseGeminiStudyResponse parses thinkingProcess array and latex property on steps", () => {
    const mathJson = JSON.stringify({
      subject: "math",
      title: "Derivative of 1/(1+x)",
      thinkingProcess: [
        "1. Identify quotient/power rule applicability for f(x) = (1+x)^(-1)",
        "2. Apply chain rule: d/du[u^(-1)] * du/dx",
        "3. Simplify to -1/(1+x)^2",
        "4. Calculate sample slopes with Python runtime",
      ],
      speechExplanation: "We rewrite the fraction using negative exponents and apply the chain rule.",
      formula: "\\frac{d}{dx}\\left[\\frac{1}{1+x}\\right] = -\\frac{1}{(1+x)^2}",
      summary: "Power and chain rules give -1/(1+x)^2.",
      steps: [
        {
          stepNumber: 1,
          title: "Rewrite using Negative Exponent",
          latex: "f(x) = (1 + x)^{-1}",
          explanation: "Express the denominator as a negative power for direct differentiation.",
        },
        {
          stepNumber: 2,
          title: "Apply Power & Chain Rule",
          latex: "f'(x) = -1 \\cdot (1 + x)^{-2} \\cdot \\frac{d}{dx}[1+x]",
          explanation: "Bring down exponent -1 and multiply by the inner derivative.",
        },
      ],
    });

    const parsed = parseGeminiStudyResponse(mathJson);
    expect(parsed).not.toBeNull();
    expect(parsed!.thinkingProcess).toBeDefined();
    expect(parsed!.thinkingProcess?.length).toBe(4);
    expect(parsed!.thinkingProcess?.[0]).toContain("Identify quotient/power rule");
    expect(parsed!.steps[0].latex).toBe("f(x) = (1 + x)^{-1}");
    expect(parsed!.steps[1].latex).toBe("f'(x) = -1 \\cdot (1 + x)^{-2} \\cdot \\frac{d}{dx}[1+x]");
    // formulaSnippet fallback should match latex
    expect(parsed!.steps[0].formulaSnippet).toBe("f(x) = (1 + x)^{-1}");
  });

  test("parseGeminiStudyResponse extracts <thought> tag into thinkingProcess when field not in JSON", () => {
    const thoughtBlockText = String.raw`<thought>
Analyze torque balance
Calculate tau_net = r1 * F1 - r2 * F2
Verify equilibrium condition
</thought>
{
  "subject": "physics",
  "title": "Torque Equilibrium",
  "speechExplanation": "Torques must sum to zero for rotational equilibrium.",
  "formula": "\\sum \\tau = 0",
  "summary": "Equal and opposite torques balance the lever.",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Balance Torques",
      "formulaSnippet": "\\tau_1 = \\tau_2",
      "explanation": "Ensure clockwise torque equals counter-clockwise torque."
    }
  ]
}`;

    const parsed = parseGeminiStudyResponse(thoughtBlockText);
    expect(parsed).not.toBeNull();
    expect(parsed!.thinkingProcess).toBeDefined();
    expect(parsed!.thinkingProcess?.length).toBe(3);
    expect(parsed!.thinkingProcess?.[0]).toBe("Analyze torque balance");
    expect(parsed!.steps[0].latex).toBe("\\tau_1 = \\tau_2");
  });

  test("parseGeminiStudyResponse successfully parses science response when steps array is empty or omitted", () => {
    const scienceJson = JSON.stringify({
      subject: "physics",
      title: "Gravitational Orbit Simulation",
      thinkingProcess: [
        "1. Identify Keplerian orbital mechanics and Newton's law of universal gravitation.",
        "2. Formulate velocity vector: v = sqrt(G*M/r).",
        "3. Execute Python verification to calculate orbital period: T = 2*pi*sqrt(r^3/(G*M)).",
        "4. Synthesize 60fps dynamic canvas simulation with orbiting satellite.",
      ],
      speechExplanation: "Watch how the planet's velocity vector curves under gravitational acceleration.",
      formula: "",
      summary: "Gravity acts as the centripetal force sustaining the orbit.",
      steps: [],
      interactive: {
        type: "dynamic-simulation",
        title: "Orbital Mechanics",
        html: "<canvas id='orbit'></canvas>",
      },
      quickQuiz: {
        question: "What happens to orbital velocity as orbital radius increases?",
        options: ["Decreases", "Increases", "Remains constant"],
        correctIndex: 0,
        explanation: "Velocity decreases inversely with the square root of radius.",
      },
    });

    const parsed = parseGeminiStudyResponse(scienceJson, "v = sqrt(G*M/r)", "v = 7.67 km/s");
    expect(parsed).not.toBeNull();
    expect(parsed!.subject).toBe("physics");
    expect(parsed!.steps.length).toBe(0);
    expect(parsed!.interactive.executedPythonCode).toBe("v = sqrt(G*M/r)");
    expect(parsed!.interactive.executedPythonOutput).toBe("v = 7.67 km/s");
  });

  test("parseGeminiStudyResponse extracts executedPythonCode from JSON body if tool args are missing", () => {
    const jsonWithPython = JSON.stringify({
      subject: "math",
      title: "Roots of Quadratic",
      speechExplanation: "Find roots using the quadratic formula.",
      formula: "ax^2 + bx + c = 0",
      summary: "Roots found via discriminant.",
      steps: [],
      interactive: {
        type: "dynamic-simulation",
        title: "Parabola Plotter",
        html: "<canvas id='parabola'></canvas>",
        executedPythonCode: "import sympy\nx = sympy.Symbol('x')\nprint(sympy.solve(x**2 - 4, x))",
        executedPythonOutput: "[-2, 2]",
      },
    });

    const parsed = parseGeminiStudyResponse(jsonWithPython);
    expect(parsed).not.toBeNull();
    expect(parsed!.interactive.executedPythonCode).toContain("sympy.solve");
    expect(parsed!.interactive.executedPythonOutput).toBe("[-2, 2]");
  });

  test("askStudyTutor synthesized offline response produces empty steps and atom-builder simulation for chemistry", async () => {
    const response = await askStudyTutor({
      question: "Explain atomic structure and electrons of carbon",
      subject: "chemistry",
    });

    expect(response.subject).toBe("chemistry");
    expect(response.steps.length).toBe(0); // Science focuses purely on dynamic simulation
    expect(response.interactive.type).toBe("atom-builder");
    expect(response.interactive.html).toBeDefined();
    expect(response.interactive.executedPythonCode).toContain("Carbon");
    expect(response.interactive.executedPythonOutput).toContain("Charge=0");
    expect(response.thinkingProcess?.length).toBeGreaterThan(0);
  });

  test("askStudyTutor produces quantum double-slit simulation and empty steps for quantum physics", async () => {
    const response = await askStudyTutor({
      question: "explain quantum physics",
      subject: "physics",
    });

    expect(response.subject).toBe("physics");
    expect(response.steps.length).toBe(0); // Non-math focuses on dynamic simulation
    expect(response.interactive.type).not.toBe("lever-torque");
    expect(response.interactive.html).toBeDefined();
    expect(response.thinkingProcess?.length).toBeGreaterThan(0);
  });
});


