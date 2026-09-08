import { describe, expect, test } from "@jest/globals";
import {
  FALLBACK_GEMINI_STUDY_MODEL,
  PRIMARY_GEMINI_STUDY_MODEL,
  STUDY_PRESETS,
  askStudyTutor,
  getLocalizedStudyPreset,
  getOfflinePresetFallback,
  parseGeminiStudyResponse,
  type StudySubject,
} from "../study-tutor-service";

describe("Study Tutor Service & STEM Presets", () => {
  test("specifies correct Gemini primary and fallback models", () => {
    expect(PRIMARY_GEMINI_STUDY_MODEL).toBe("gemini-3.8-flash");
    expect(FALLBACK_GEMINI_STUDY_MODEL).toBe("gemini-3.5-flash-lite");
  });

  test("all built-in presets have valid structures", () => {
    const presetKeys = Object.keys(STUDY_PRESETS);
    expect(presetKeys.length).toBeGreaterThanOrEqual(6);

    for (const key of presetKeys) {
      const preset = STUDY_PRESETS[key];
      expect(preset.id).toBe(key);
      expect(preset.title).toBeTruthy();
      expect(preset.speechExplanation).toBeTruthy();
      expect(preset.formula).toBeTruthy();
      expect(preset.summary).toBeTruthy();
      expect(preset.steps.length).toBeGreaterThan(0);
      expect(preset.interactive.type).toBeTruthy();
      expect(preset.interactive.config).toBeDefined();
      expect(preset.quickQuiz.question).toBeTruthy();
      expect(preset.quickQuiz.options.length).toBeGreaterThanOrEqual(2);
      expect(preset.quickQuiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(preset.quickQuiz.correctIndex).toBeLessThan(preset.quickQuiz.options.length);
    }
  });

  test("contains all required STEM and Logic widget types", () => {
    const widgetTypes = Object.values(STUDY_PRESETS).map((p) => p.interactive.type);
    expect(widgetTypes).toContain("balance-scale");
    expect(widgetTypes).toContain("coordinate-graph");
    expect(widgetTypes).toContain("lever-torque");
    expect(widgetTypes).toContain("circuit-sim");
    expect(widgetTypes).toContain("atom-builder");
    expect(widgetTypes).toContain("chess-tactics");
  });

  test("getLocalizedStudyPreset returns localized Kurdish and Arabic content", () => {
    const kuPreset = getLocalizedStudyPreset("math-balance", "ku");
    expect(kuPreset.title).toBe("شیکارکردنی هاوکێشە بە تەرازووی هاوسەنگ");
    expect(kuPreset.steps[0].title).toBe("ناسینی هاوسەنگی");

    const arPreset = getLocalizedStudyPreset("math-balance", "ar");
    expect(arPreset.title).toBe("حل المعادلات بميزان التوازن");
    expect(arPreset.steps[0].title).toBe("تحديد حالة التوازن");

    const enPreset = getLocalizedStudyPreset("math-balance", "en");
    expect(enPreset.title).toBe("Solving Equations with Balance Scale");
  });

  test("getOfflinePresetFallback resolves correct widget from question keywords", () => {
    expect(getOfflinePresetFallback("How does balance work?", "math").interactive.type).toBe("balance-scale");
    expect(getOfflinePresetFallback("Plot linear slope", "math").interactive.type).toBe("coordinate-graph");
    expect(getOfflinePresetFallback("What is torque lever?", "physics").interactive.type).toBe("lever-torque");
    expect(getOfflinePresetFallback("Calculate electric circuit Ohm", "physics").interactive.type).toBe("circuit-sim");
    expect(getOfflinePresetFallback("Build a Bohr atom with protons", "chemistry").interactive.type).toBe("atom-builder");
    expect(getOfflinePresetFallback("Show chess knight fork tactic", "logic").interactive.type).toBe("chess-tactics");
  });

  test("askStudyTutor falls back gracefully to appropriate presets for known keywords", async () => {
    const mathRes = await askStudyTutor({ question: "Explain balance scale equation" });
    expect(mathRes.interactive.type).toBe("balance-scale");

    const graphRes = await askStudyTutor({ question: "How does linear slope work?" });
    expect(graphRes.interactive.type).toBe("coordinate-graph");

    const torqueRes = await askStudyTutor({ question: "What is torque on a seesaw?" });
    expect(torqueRes.interactive.type).toBe("lever-torque");

    const circuitRes = await askStudyTutor({ question: "Explain Ohm's Law circuit" });
    expect(circuitRes.interactive.type).toBe("circuit-sim");

    const atomRes = await askStudyTutor({ question: "What is a Bohr atom?" });
    expect(atomRes.interactive.type).toBe("atom-builder");

    const chessRes = await askStudyTutor({ question: "How do I do a knight fork in chess?" });
    expect(chessRes.interactive.type).toBe("chess-tactics");
  });

  test("askStudyTutor handles unexpected inputs cleanly without throwing", async () => {
    const emptyRes = await askStudyTutor({ question: "" });
    expect(emptyRes).toBeDefined();
    expect(emptyRes.title).toBeTruthy();

    const randomSubj: StudySubject = "general";
    const generalRes = await askStudyTutor({ question: "???", subject: randomSubj });
    expect(generalRes).toBeDefined();
    expect(generalRes.interactive).toBeDefined();
  });

  test("all presets include self-contained interactive simulation HTML", () => {
    for (const preset of Object.values(STUDY_PRESETS)) {
      expect(preset.interactive.html).toBeDefined();
      expect(preset.interactive.html).toContain("<!DOCTYPE html>");
      expect(preset.interactive.html).toContain("<canvas");
      expect(preset.interactive.html).toContain("window.sendToTwino");
    }
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
});

