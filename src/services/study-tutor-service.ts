import { generateGeminiContent } from "./gemini-gateway";
import {
  generateAtomBuilderHtml,
  generateBalanceScaleHtml,
  generateChessTacticsHtml,
  generateCircuitSimHtml,
  generateCoordinateGraphHtml,
  generateLeverTorqueHtml,
  prepareSandboxedHtml,
} from "./study-simulation-templates";

export type StudySubject = "math" | "physics" | "chemistry" | "logic" | "general";

export type InteractiveWidgetType =
  | "balance-scale"
  | "coordinate-graph"
  | "fraction-bars"
  | "lever-torque"
  | "circuit-sim"
  | "atom-builder"
  | "chess-tactics"
  | "dynamic-simulation"
  | string;

export type InteractiveBalanceScaleConfig = {
  equation: string;
  leftTarget: number;
  rightTarget: number;
  initialLeft: number;
  initialRight: number;
  variableName: string;
  solutionValue: number;
};

export type InteractiveCoordinateGraphConfig = {
  equation: string;
  initialSlope: number;
  initialIntercept: number;
  minSlope?: number;
  maxSlope?: number;
  minIntercept?: number;
  maxIntercept?: number;
};

export type InteractiveFractionBarsConfig = {
  targetNumerator: number;
  targetDenominator: number;
  compareNumerator: number;
  compareDenominator: number;
};

export type InteractiveLeverTorqueConfig = {
  pivotX: number;
  leftWeight: number;
  leftDistance: number;
  rightWeight: number;
  rightDistance: number;
};

export type InteractiveCircuitSimConfig = {
  initialVoltage: number;
  initialResistance: number;
  componentName: string;
};

export type InteractiveAtomBuilderConfig = {
  initialProtons: number;
  initialNeutrons: number;
  initialElectrons: number;
  elementSymbol: string;
  elementName: string;
};

export type InteractiveChessTacticsConfig = {
  boardFen?: string;
  puzzleTitle: string;
  instructions: string;
  solutionFrom: string;
  solutionTo: string;
  pieceType: "knight" | "bishop" | "rook" | "queen" | "pawn";
};

export type InteractiveWidgetState = {
  type: string;
  title?: string;
  summary?: string;
  html?: string;
  code?: string;
  config?: Record<string, any>;
  computedData?: Record<string, any>;
  executedPythonCode?: string;
  executedPythonOutput?: string;
};

export type StudyStep = {
  stepNumber: number;
  title: string;
  explanation: string;
  formulaSnippet?: string;
  highlightTerm?: string;
};

export type StudyQuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type StudyTutorResponse = {
  id: string;
  subject: StudySubject;
  title: string;
  speechExplanation: string;
  formula: string;
  summary: string;
  steps: StudyStep[];
  interactive: InteractiveWidgetState;
  quickQuiz: StudyQuizQuestion;
  modelUsed?: string;
};

export const PRIMARY_GEMINI_STUDY_MODEL = "gemini-3.8-flash";
export const FALLBACK_GEMINI_STUDY_MODEL = "gemini-3.5-flash-lite";

/**
 * Built-in curriculum presets for instantaneous exploration without network lag.
 */
export const STUDY_PRESETS: Record<string, StudyTutorResponse> = {
  "math-balance": {
    id: "math-balance",
    subject: "math",
    title: "Solving Equations with Balance Scale",
    speechExplanation:
      "Think of an algebraic equation like a physical balance scale. Whatever you do to one side, you must do to the other to keep it balanced.",
    formula: "2x + 4 = 12 ⟹ x = 4",
    summary: "Visualizing algebraic balance: subtract 4 from both sides, then divide by 2.",
    steps: [
      {
        stepNumber: 1,
        title: "Identify the Balance",
        explanation: "The left pan holds 2x and 4 units. The right pan holds 12 units. Both sides are in equilibrium.",
        formulaSnippet: "2x + 4 = 12",
        highlightTerm: "Equilibrium",
      },
      {
        stepNumber: 2,
        title: "Isolate the Variable Term",
        explanation: "Subtract 4 units from both sides of the balance scale so only the x terms remain on the left.",
        formulaSnippet: "2x = 12 - 4 = 8",
        highlightTerm: "Subtract 4",
      },
      {
        stepNumber: 3,
        title: "Solve for x",
        explanation: "Divide both sides by 2 to find the value of a single x block.",
        formulaSnippet: "x = 8 / 2 = 4",
        highlightTerm: "x = 4",
      },
    ],
    interactive: {
      type: "balance-scale",
      title: "Solving Equations with Balance Scale",
      summary: "Visualizing algebraic balance: subtract 4 from both sides, then divide by 2.",
      html: generateBalanceScaleHtml({
        equation: "2x + 4 = 12",
        initialLeft: 4,
        initialRight: 12,
        variableName: "x",
        solutionValue: 4,
      }),
      config: {
        equation: "2x + 4 = 12",
        leftTarget: 12,
        rightTarget: 12,
        initialLeft: 4,
        initialRight: 12,
        variableName: "x",
        solutionValue: 4,
      },
    },
    quickQuiz: {
      question: "If 3x + 6 = 21, what is the first step to isolate x?",
      options: [
        "Divide both sides by 3",
        "Subtract 6 from both sides",
        "Add 6 to both sides",
        "Multiply both sides by 2",
      ],
      correctIndex: 1,
      explanation: "Subtracting 6 from both sides gives 3x = 15, isolating the variable term first.",
    },
  },

  "math-linear": {
    id: "math-linear",
    subject: "math",
    title: "Linear Function & Slope-Intercept",
    speechExplanation:
      "The equation y = mx + b defines a straight line. m controls the steepness or slope, while b is where the line crosses the y-axis.",
    formula: "y = m·x + b",
    summary: "Explore how changing slope m tilts the line, and changing b slides it vertically.",
    steps: [
      {
        stepNumber: 1,
        title: "The Y-Intercept (b)",
        explanation: "When x is 0, y equals b. This marks the exact point where the graph crosses the vertical axis (0, b).",
        formulaSnippet: "y = m(0) + b = b",
        highlightTerm: "Intercept",
      },
      {
        stepNumber: 2,
        title: "The Slope (m)",
        explanation: "Slope is rise over run: for every 1 unit moved to the right, y increases by m units.",
        formulaSnippet: "m = Δy / Δx",
        highlightTerm: "Rise / Run",
      },
      {
        stepNumber: 3,
        title: "Predicting Coordinates",
        explanation: "Substitute any x coordinate into the linear formula to find its matching y coordinate on the line.",
        formulaSnippet: "(x, mx + b)",
        highlightTerm: "Coordinates",
      },
    ],
    interactive: {
      type: "coordinate-graph",
      title: "Linear Function & Slope-Intercept",
      summary: "Explore how changing slope m tilts the line, and changing b slides it vertically.",
      html: generateCoordinateGraphHtml({
        equation: "y = 2x + 1",
        initialSlope: 2,
        initialIntercept: 1,
      }),
      config: {
        equation: "y = 2x + 1",
        initialSlope: 2,
        initialIntercept: 1,
        minSlope: -4,
        maxSlope: 4,
        minIntercept: -5,
        maxIntercept: 5,
      },
    },
    quickQuiz: {
      question: "What happens to the graph of y = mx + b if the slope m is negative?",
      options: [
        "The line slopes upward from left to right",
        "The line slopes downward from left to right",
        "The line becomes completely horizontal",
        "The line turns into a parabola",
      ],
      correctIndex: 1,
      explanation: "A negative slope means y decreases as x increases, sloping downwards from left to right.",
    },
  },

  "physics-torque": {
    id: "physics-torque",
    subject: "physics",
    title: "Torque & Rotational Equilibrium",
    speechExplanation:
      "Torque is rotational force. A smaller weight placed far from the pivot can balance a heavy weight placed close to the pivot.",
    formula: "τ = F · d = m · g · d",
    summary: "For a seesaw or lever to balance, total counterclockwise torque must equal clockwise torque.",
    steps: [
      {
        stepNumber: 1,
        title: "Torque Definition",
        explanation: "Torque measures how effectively a force causes rotation around an axis or fulcrum.",
        formulaSnippet: "τ = r × F",
        highlightTerm: "Force × Distance",
      },
      {
        stepNumber: 2,
        title: "Rotational Equilibrium",
        explanation: "When the net torque on a lever is zero, the lever remains horizontal and balanced.",
        formulaSnippet: "m₁ · d₁ = m₂ · d₂",
        highlightTerm: "Balanced Torque",
      },
      {
        stepNumber: 3,
        title: "Mechanical Advantage",
        explanation: "Doubling the distance from the fulcrum halves the force needed to balance the opposite side.",
        formulaSnippet: "MA = d₁ / d₂",
        highlightTerm: "Leverage",
      },
    ],
    interactive: {
      type: "lever-torque",
      title: "Torque & Rotational Equilibrium",
      summary: "For a seesaw or lever to balance, total counterclockwise torque must equal clockwise torque.",
      html: generateLeverTorqueHtml({
        leftWeight: 10,
        leftDistance: 2,
        rightWeight: 5,
        rightDistance: 4,
      }),
      config: {
        pivotX: 0,
        leftWeight: 10,
        leftDistance: 2,
        rightWeight: 5,
        rightDistance: 4,
      },
    },
    quickQuiz: {
      question: "If a 20 kg child sits 1 meter from the fulcrum, where must a 10 kg child sit to balance?",
      options: ["1 meter away", "2 meters away", "3 meters away", "0.5 meters away"],
      correctIndex: 1,
      explanation: "20 kg × 1 m = 10 kg × 2 m = 20 kg·m of torque on both sides.",
    },
  },

  "physics-circuit": {
    id: "physics-circuit",
    subject: "physics",
    title: "Ohm's Law: Voltage, Current & Resistance",
    speechExplanation:
      "Ohm's Law connects electric pressure (voltage) to electron flow (current) and the opposition to flow (resistance).",
    formula: "V = I · R  ⟺  I = V / R",
    summary: "Current increases when voltage increases, but current decreases when resistance increases.",
    steps: [
      {
        stepNumber: 1,
        title: "Voltage (V)",
        explanation: "Voltage is electric potential difference, provided by the battery to push charge through the circuit.",
        formulaSnippet: "V (Volts)",
        highlightTerm: "Potential",
      },
      {
        stepNumber: 2,
        title: "Resistance (R)",
        explanation: "Resistors oppose the flow of electric current, converting electrical energy into heat or light.",
        formulaSnippet: "R (Ohms, Ω)",
        highlightTerm: "Resistance",
      },
      {
        stepNumber: 3,
        title: "Current & Brightness (I)",
        explanation: "Current is the rate of charge flow. A higher current through the lightbulb produces more luminescence.",
        formulaSnippet: "I = V / R (Amperes)",
        highlightTerm: "Flow Rate",
      },
    ],
    interactive: {
      type: "circuit-sim",
      title: "Ohm's Law: Voltage, Current & Resistance",
      summary: "Current increases when voltage increases, but current decreases when resistance increases.",
      html: generateCircuitSimHtml({
        initialVoltage: 9,
        initialResistance: 3,
        componentName: "Incandescent Bulb",
      }),
      config: {
        initialVoltage: 9,
        initialResistance: 3,
        componentName: "Incandescent Bulb",
      },
    },
    quickQuiz: {
      question: "If voltage is doubled while resistance remains unchanged, what happens to current?",
      options: [
        "Current is halved",
        "Current doubles",
        "Current stays constant",
        "Current drops to zero",
      ],
      correctIndex: 1,
      explanation: "According to I = V / R, current is directly proportional to voltage, so it doubles.",
    },
  },

  "chemistry-atom": {
    id: "chemistry-atom",
    subject: "chemistry",
    title: "Bohr Model & Atomic Structure",
    speechExplanation:
      "Atoms consist of a dense nucleus of protons and neutrons, orbited by electrons in discrete valence energy shells.",
    formula: "Z = Protons, A = Protons + Neutrons",
    summary: "Protons identify the element. The outermost valence electrons dictate chemical bonding behavior.",
    steps: [
      {
        stepNumber: 1,
        title: "Atomic Number (Z)",
        explanation: "The number of protons in the nucleus uniquely determines which chemical element the atom is.",
        formulaSnippet: "Z = P⁺",
        highlightTerm: "Element Identity",
      },
      {
        stepNumber: 2,
        title: "Electron Shells (2n²)",
        explanation: "The first shell holds up to 2 electrons, while the second shell holds up to 8 electrons.",
        formulaSnippet: "K=2, L=8",
        highlightTerm: "Shell Capacity",
      },
      {
        stepNumber: 3,
        title: "Electrical Neutrality",
        explanation: "In a neutral atom, the number of negatively charged electrons balances the positive protons.",
        formulaSnippet: "Net Charge = P⁺ - e⁻ = 0",
        highlightTerm: "Neutral Charge",
      },
    ],
    interactive: {
      type: "atom-builder",
      title: "Bohr Model & Atomic Structure",
      summary: "Protons identify the element. The outermost valence electrons dictate chemical bonding behavior.",
      html: generateAtomBuilderHtml({
        initialProtons: 6,
        initialNeutrons: 6,
        initialElectrons: 6,
        elementSymbol: "C",
        elementName: "Carbon",
      }),
      config: {
        initialProtons: 6,
        initialNeutrons: 6,
        initialElectrons: 6,
        elementSymbol: "C",
        elementName: "Carbon",
      },
    },
    quickQuiz: {
      question: "What element has an atomic number of 8 (8 protons)?",
      options: ["Nitrogen", "Oxygen", "Fluorine", "Carbon"],
      correctIndex: 1,
      explanation: "Oxygen has 8 protons in its nucleus (atomic number Z = 8).",
    },
  },

  "chess-tactics": {
    id: "chess-tactics",
    subject: "logic",
    title: "Tactical Motifs: The Knight Fork",
    speechExplanation:
      "A fork occurs when a single piece attacks two or more enemy pieces simultaneously. The knight is especially deadly because it can jump over obstacles.",
    formula: "Fork: 1 Attacker ⟹ ≥ 2 Targets",
    summary: "Position the knight so that both the king and another high-value piece are under direct attack.",
    steps: [
      {
        stepNumber: 1,
        title: "Identify Undefended Targets",
        explanation: "Notice the opponent's king and queen are separated by an L-shaped distance that a knight can exploit.",
        formulaSnippet: "Geometry Check",
        highlightTerm: "Double Threat",
      },
      {
        stepNumber: 2,
        title: "Deliver Check with Tempo",
        explanation: "By attacking the king, the opponent is legally forced to respond to the check, allowing you to capture the second target next.",
        formulaSnippet: "Forced Move",
        highlightTerm: "King in Check",
      },
      {
        stepNumber: 3,
        title: "Reap the Material",
        explanation: "After the king steps out of check, take the captured piece on the subsequent turn.",
        formulaSnippet: "+Material Advantage",
        highlightTerm: "Decisive Win",
      },
    ],
    interactive: {
      type: "chess-tactics",
      title: "Tactical Motifs: The Knight Fork",
      summary: "Position the knight so that both the king and another high-value piece are under direct attack.",
      html: generateChessTacticsHtml({
        puzzleTitle: "Royal Knight Fork",
        instructions: "Tap the white knight, then tap the square that forks both the king and queen!",
        solutionFrom: "e4",
        solutionTo: "f6",
      }),
      config: {
        puzzleTitle: "Royal Knight Fork",
        instructions: "Tap the white knight, then tap the square that forks both the king and queen!",
        solutionFrom: "e4",
        solutionTo: "f6",
        pieceType: "knight",
      },
    },
    quickQuiz: {
      question: "Why is a knight fork particularly difficult for opponents to defend?",
      options: [
        "Knights can move backwards",
        "Knights jump over pieces and their attack angle cannot be blocked",
        "Knights have higher point value than rooks",
        "Knights control eight squares on every move",
      ],
      correctIndex: 1,
      explanation: "Because knights leap over other pieces, an opponent cannot interpose a defender to block the check.",
    },
  },
};

function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  let candidate = trimmed;

  // Only unwrap if the response outer wrapper starts with a markdown code fence
  if (trimmed.startsWith("```")) {
    const endFence = trimmed.lastIndexOf("```");
    if (endFence > 3) {
      candidate = trimmed
        .slice(3, endFence)
        .replace(/^(?:json)?\s*/i, "")
        .trim();
    }
  }

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

/**
 * Sanitizes unescaped ASCII control characters (newlines, carriage returns, tabs)
 * inside JSON string literals so JSON.parse does not fail with 'Bad control character'.
 */
function sanitizeJsonControlChars(raw: string): string {
  let inString = false;
  let escaped = false;
  let result = "";

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '"' && !escaped) {
      inString = !inString;
      result += ch;
    } else if (inString) {
      if (ch === "\n") {
        result += "\\n";
      } else if (ch === "\r") {
        result += "\\r";
      } else if (ch === "\t") {
        result += "\\t";
      } else {
        result += ch;
      }
      escaped = ch === "\\" && !escaped;
    } else {
      result += ch;
      escaped = false;
    }
  }

  return result;
}

function safeParseJson(raw: string): any {
  // 1. Direct parse attempt
  try {
    return JSON.parse(raw);
  } catch {}

  // 2. Parse with control character sanitization (fixes multiline code inside string literals)
  try {
    return JSON.parse(sanitizeJsonControlChars(raw));
  } catch {}

  // 3. Parse with trailing comma removal + control character sanitization
  try {
    const noTrailingCommas = raw.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(sanitizeJsonControlChars(noTrailingCommas));
  } catch {}

  return null;
}

function normalizeSubject(input?: string): StudySubject {
  const val = (input || "").toLowerCase().trim();
  if (val.includes("math") || val.includes("algebra") || val.includes("geom") || val.includes("calculus")) {
    return "math";
  }
  if (val.includes("physic") || val.includes("force") || val.includes("gravity") || val.includes("electric")) {
    return "physics";
  }
  if (val.includes("chem") || val.includes("atom") || val.includes("element") || val.includes("molecule")) {
    return "chemistry";
  }
  if (val.includes("chess") || val.includes("logic") || val.includes("puzzle") || val.includes("tactic")) {
    return "logic";
  }
  return "general";
}

function buildSystemPrompt(language: string): string {
  return [
    "You are an elite, world-class interactive STEM and academic tutor for Twino (like Brilliant.org + Apple HIG).",
    `Explain concepts with crystal-clear logic, intuitive step-by-step clarity, and engaging voice narration in ${language}.`,
    "IMPORTANT: Do NOT output fixed widget config values or rely on a hardcoded library of pre-made widgets.",
    "Instead, you MUST dynamically generate the complete, self-contained interactive simulation / visualization code tailored specifically to the user's question (e.g. double slit experiment, pendulum with air drag, titration curve with live pH indicator, Doppler effect, Fourier series, sorting visualizer, Bayes probability tree, projectile motion, capacitor discharge, etc.).",
    "You have code execution enabled in the background: if needed, run Python code to compute exact mathematical curves, trajectories, eigenvalues, or physical constants before generating the visualization.",
    "",
    "SIMULATION CODE SPECIFICATION (interactive.html):",
    "- Must be a complete, self-contained, responsive HTML5 document with embedded <style> and <script>.",
    "- Use HTML5 <canvas> or clean inline <svg> with modern JavaScript for physics animation loops (requestAnimationFrame) or reactive math graphs.",
    "- Interaction: Provide touch & mouse controls (draggable points, interactive sliders, step/reset buttons) so the student can directly manipulate parameters and see real-time cause-and-effect.",
    "- Aesthetics: Match Apple HIG standards. Clean continuous rounded controls, legible typography (system fonts: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif), smooth 60fps animations.",
    "- Colors: Support CSS variables (--bg, --surface, --text, --muted, --border, --accent #2563EB). Default to clean light/dark adaptability.",
    "- Haptics & Events: When key interactions occur (e.g. reaching equilibrium, collision, release), invoke:",
    "  if (window.ReactNativeWebView?.postMessage) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'haptic', style: 'light' }));",
    "  else if (window.parent?.postMessage) window.parent.postMessage(JSON.stringify({ type: 'haptic', style: 'light' }), '*');",
    "- Zero external dependencies (no external CDNs that require internet inside the sandbox; write vanilla JS/Canvas/SVG).",
    "",
    "You MUST respond ONLY with a single valid JSON object strictly matching this schema:",
    JSON.stringify({
      subject: "math | physics | chemistry | logic | general",
      title: "Short concise topic title",
      speechExplanation: "1-2 engaging spoken sentences suitable for text-to-speech audio explanation",
      formula: "Key mathematical or scientific formula (e.g. y = mx + b or d*sin(θ) = m*λ)",
      summary: "One sentence summary of the core physical or mathematical insight",
      steps: [
        {
          stepNumber: 1,
          title: "Step Title",
          explanation: "Detailed intuitive explanation of this step",
          formulaSnippet: "x = ...",
          highlightTerm: "Term to emphasize",
        },
      ],
      interactive: {
        type: "dynamic-simulation",
        title: "Simulation Title",
        summary: "How to interact with this simulation",
        html: "<!DOCTYPE html><html><head><style>...</style></head><body><canvas id='c'></canvas><script>...</script></body></html>",
        config: {},
      },
      quickQuiz: {
        question: "Concept check question?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: 0,
        explanation: "Why this option is correct",
      },
    }),
    "Do NOT include markdown wrapping outside of the JSON. Return only the JSON object.",
  ].join("\n");
}

export function parseGeminiStudyResponse(
  jsonText: string,
  executedPythonCode?: string,
  executedPythonOutput?: string,
): StudyTutorResponse | null {
  try {
    const raw = extractJsonObject(jsonText);
    if (!raw) return null;
    const parsed = safeParseJson(raw);
    if (!parsed || typeof parsed !== "object") return null;

    if (!parsed.title || !parsed.speechExplanation || !Array.isArray(parsed.steps)) {
      return null;
    }

    const steps: StudyStep[] = parsed.steps.map((s: any, idx: number) => ({
      stepNumber: s.stepNumber || idx + 1,
      title: String(s.title || `Step ${idx + 1}`),
      explanation: String(s.explanation || ""),
      formulaSnippet: s.formulaSnippet ? String(s.formulaSnippet) : undefined,
      highlightTerm: s.highlightTerm ? String(s.highlightTerm) : undefined,
    }));

    const interactiveObj =
      parsed.interactive && typeof parsed.interactive === "object"
        ? parsed.interactive
        : {};

    let html = typeof interactiveObj.html === "string" ? interactiveObj.html.trim() : "";
    if (html.startsWith("```")) {
      html = html.replace(/^```(?:html|html5|xml)?\s*/i, "").replace(/\s*```$/, "").trim();
    }

    let code = typeof interactiveObj.code === "string" ? interactiveObj.code.trim() : "";
    if (code.startsWith("```")) {
      code = code.replace(/^```(?:javascript|js)?\s*/i, "").replace(/\s*```$/, "").trim();
    }

    // If html contains pure JS, swap to code
    if (
      html &&
      !html.includes("<") &&
      (html.includes("function") ||
        html.includes("var ") ||
        html.includes("let ") ||
        html.includes("const "))
    ) {
      code = html;
      html = "";
    }

    // If code contains HTML markup, swap to html
    if (
      code &&
      (code.includes("<canvas") ||
        code.includes("<svg") ||
        code.includes("<div") ||
        code.includes("<!DOCTYPE") ||
        code.includes("<html"))
    ) {
      html = code;
      code = "";
    }

    // Fallback: check if raw jsonText has markdown ```html or ```js block outside JSON
    if (!html && !code) {
      const htmlBlockMatch = jsonText.match(/```(?:html|html5)\s*([\s\S]*?)```/i);
      if (htmlBlockMatch?.[1]) {
        html = htmlBlockMatch[1].trim();
      } else {
        const jsBlockMatch = jsonText.match(/```(?:javascript|js)\s*([\s\S]*?)```/i);
        if (jsBlockMatch?.[1]) {
          code = jsBlockMatch[1].trim();
        }
      }
    }

    // Prepare self-contained sandboxed HTML
    if (!html && code) {
      html = prepareSandboxedHtml({
        title: interactiveObj.title || parsed.title || "Simulation",
        code,
      });
    } else if (html) {
      html = prepareSandboxedHtml({
        title: interactiveObj.title || parsed.title || "Simulation",
        html,
        code,
      });
    }

    const widgetType = String(interactiveObj.type || "dynamic-simulation");

    const interactiveState: InteractiveWidgetState = {
      type: widgetType,
      title: String(interactiveObj.title || parsed.title || "Simulation"),
      summary: String(interactiveObj.summary || parsed.summary || ""),
      html: html || undefined,
      code: code || undefined,
      config: interactiveObj.config || {},
      executedPythonCode: executedPythonCode || undefined,
      executedPythonOutput: executedPythonOutput || undefined,
    };

    const quickQuiz: StudyQuizQuestion = {
      question: String(parsed.quickQuiz?.question || "What is the key takeaway of this lesson?"),
      options:
        Array.isArray(parsed.quickQuiz?.options) && parsed.quickQuiz.options.length >= 2
          ? parsed.quickQuiz.options.map(String)
          : ["Correct principle", "Incorrect assumption", "Unrelated factor"],
      correctIndex:
        typeof parsed.quickQuiz?.correctIndex === "number" ? parsed.quickQuiz.correctIndex : 0,
      explanation: String(
        parsed.quickQuiz?.explanation ||
          "Understanding the balance of forces/values leads to the solution.",
      ),
    };

    return {
      id: `ai-${Date.now()}`,
      subject: normalizeSubject(parsed.subject),
      title: String(parsed.title),
      speechExplanation: String(parsed.speechExplanation),
      formula: String(parsed.formula || ""),
      summary: String(parsed.summary || parsed.speechExplanation),
      steps,
      interactive: interactiveState,
      quickQuiz,
    };
  } catch {
    return null;
  }
}

/**
 * Fallback resolver when offline, unauthenticated, or when network/API fails.
 * Selects the preset best matching the keywords or subject.
 */
export function getOfflinePresetFallback(
  cleanQuestion: string,
  targetSubject: StudySubject,
): StudyTutorResponse {
  const lowerQ = cleanQuestion.toLowerCase();
  if (lowerQ.includes("balance") || lowerQ.includes("scale") || lowerQ.includes("equation")) {
    return STUDY_PRESETS["math-balance"];
  }
  if (lowerQ.includes("slope") || lowerQ.includes("linear") || lowerQ.includes("graph")) {
    return STUDY_PRESETS["math-linear"];
  }
  if (lowerQ.includes("torque") || lowerQ.includes("lever") || lowerQ.includes("seesaw")) {
    return STUDY_PRESETS["physics-torque"];
  }
  if (lowerQ.includes("circuit") || lowerQ.includes("ohm") || lowerQ.includes("volt") || lowerQ.includes("resistor")) {
    return STUDY_PRESETS["physics-circuit"];
  }
  if (lowerQ.includes("atom") || lowerQ.includes("proton") || lowerQ.includes("bohr") || lowerQ.includes("electron")) {
    return STUDY_PRESETS["chemistry-atom"];
  }
  if (lowerQ.includes("chess") || lowerQ.includes("fork") || lowerQ.includes("knight") || lowerQ.includes("tactic")) {
    return STUDY_PRESETS["chess-tactics"];
  }

  if (targetSubject === "math") return STUDY_PRESETS["math-balance"];
  if (targetSubject === "physics") return STUDY_PRESETS["physics-torque"];
  if (targetSubject === "chemistry") return STUDY_PRESETS["chemistry-atom"];
  if (targetSubject === "logic") return STUDY_PRESETS["chess-tactics"];

  return STUDY_PRESETS["math-balance"];
}

export function getLocalizedStudyPreset(
  presetKey: string,
  locale?: string,
): StudyTutorResponse {
  const base = STUDY_PRESETS[presetKey] || STUDY_PRESETS["math-balance"];
  const isKu = locale === "ku";
  const isAr = locale === "ar";

  if (!isKu && !isAr) return base;

  const overrides: Record<string, Partial<StudyTutorResponse>> = isKu
    ? {
        "math-balance": {
          title: "شیکارکردنی هاوکێشە بە تەرازووی هاوسەنگ",
          speechExplanation:
            "هاوکێشەی جەبری وەک تەرازوویەکی فیزیکی وایە. هەر کردارێک لە لایەک بکەیت، دەبێت لە لایەکەی دیکەش بیکەیت بۆ پاراستنی هاوسەنگی.",
          summary: "هاوسەنگی جەبری: چوار لە هەردوو لا کەم بکەرەوە، پاشان دابەشی دووی بکە.",
          steps: [
            {
              stepNumber: 1,
              title: "ناسینی هاوسەنگی",
              explanation: "سینی چەپ 2x و 4 یەکە لەخۆدەگرێت، سینی ڕاست 12 یەکە. هەردوو لا لە هاوسەنگیدان.",
              formulaSnippet: "2x + 4 = 12",
              highlightTerm: "هاوسەنگی",
            },
            {
              stepNumber: 2,
              title: "جیاکردنەوەی گۆڕاو",
              explanation: "چوار لە هەردوو لا دەربێنە تا تەنها بەشەکانی x لە لای چەپ بمێننەوە.",
              formulaSnippet: "2x = 12 - 4 = 8",
              highlightTerm: "کەمکردنەوەی 4",
            },
            {
              stepNumber: 3,
              title: "دۆزینەوەی نرخی x",
              explanation: "هەردوو لا دابەشی دوو بکە تا نرخی یەک x بدۆزیتەوە.",
              formulaSnippet: "x = 8 / 2 = 4",
              highlightTerm: "x = 4",
            },
          ],
          quickQuiz: {
            question: "ئەگەر 3x + 6 = 21 بێت، یەکەم هەنگاو چییە بۆ جیاکردنەوەی x؟",
            options: [
              "دابەشکردنی هەردوو لا بە 3",
              "کەمکردنەوەی 6 لە هەردوو لا",
              "کۆکردنەوەی 6 لەگەڵ هەردوو لا",
              "لێکدانی هەردوو لا بە 2",
            ],
            correctIndex: 1,
            explanation: "کەمکردنەوەی 6 دەبێتە هۆی 3x = 15 و بەشە نەزانراوەکە بەتەنیا دەمێنێتەوە.",
          },
        },
        "math-linear": {
          title: "نەخشەی هێڵی و لێژی y = mx + b",
          speechExplanation:
            "هاوکێشەی y = mx + b هێڵێکی ڕاست دیاری دەکات. m لێژییەکەی دیاری دەکات و b خاڵی بڕینی تەوەرەی ستوونییە.",
          summary: "تێگەیشتن لە چۆنیەتی گۆڕانی لێژی m و بەرزبوونەوەی هێڵ بە بڕی b.",
          steps: [
            {
              stepNumber: 1,
              title: "خاڵی بڕینی ستوونی (b)",
              explanation: "کاتێک x دەبێتە 0، نرخی y یەکسانە بە b و هێڵەکە لەم خاڵە تەوەرەی ستوونی دەبڕێت.",
              formulaSnippet: "y = m(0) + b = b",
              highlightTerm: "خاڵی بڕین",
            },
            {
              stepNumber: 2,
              title: "لێژی هێڵ (m)",
              explanation: "لێژی بریتییە لە بەرزبوونەوە بەسەر ڕۆیشتن: بۆ هەر یەک یەکە بەرەو ڕاست، y بە بڕی m دەگۆڕێت.",
              formulaSnippet: "m = Δy / Δx",
              highlightTerm: "بەرزبوونەوە / ڕۆیشتن",
            },
            {
              stepNumber: 3,
              title: "دیاریکردنی خاڵەکان",
              explanation: "هەر نرخێکی x دابنێیت لە هاوکێشەکە، نرخی بەرامبەری y لەسەر هێڵەکە دەدۆزیتەوە.",
              formulaSnippet: "(x, mx + b)",
              highlightTerm: "خاڵەکان",
            },
          ],
          quickQuiz: {
            question: "چی بەسەر هێڵی y = mx + b دێت ئەگەر لێژی m نەرێنی بێت؟",
            options: [
              "هێڵەکە لە چەپ بۆ ڕاست بەرز دەبێتەوە",
              "هێڵەکە لە چەپ بۆ ڕاست دادەبەزێت",
              "هێڵەکە بەتەواوی ئاسۆیی دەبێت",
              "هێڵەکە دەبێتە پارابۆلا",
            ],
            correctIndex: 1,
            explanation: "لێژی نەرێنی واتە بە زیادبوونی x، نرخی y دادەبەزێت لە چەپەوە بۆ ڕاست.",
          },
        },
        "physics-torque": {
          title: "زەبر و هاوسەنگی خولانەوە",
          speechExplanation:
            "زەبر بریتییە لە هێزی خولێنەر. کێشێکی کەم لە دوورییەکی زۆر دەتوانێت هاوسەنگی کێشێکی گەورە لە دوورییەکی کەم بکات.",
          summary: "بۆ هاوسەنگبوونی دارتەختە، کۆی زەبری پێچەوانەی میل دەبێت یەکسان بێت بە زەبری دەوری میل.",
          steps: [
            {
              stepNumber: 1,
              title: "پێناسەی زەبر",
              explanation: "زەبر پێوانەی کارایی هێز دەکات بۆ دروستکردنی خولانەوە لە دەوری چەقی جێگیر.",
              formulaSnippet: "τ = r × F",
              highlightTerm: "هێز × دووری",
            },
            {
              stepNumber: 2,
              title: "هاوسەنگی خولانەوە",
              explanation: "کاتێک کۆی زەبری سەر دەستەکە سفر بێت، دەستەکە ئاسۆیی و هاوسەنگ دەمێنێتەوە.",
              formulaSnippet: "m₁ · d₁ = m₂ · d₂",
              highlightTerm: "زەبری هاوسەنگ",
            },
            {
              stepNumber: 3,
              title: "سوودی میکانیکی",
              explanation: "دووهێندەکردنی دووری لە چەق، ئەو هێزەی پێویستە بۆ هاوسەنگکردن دەکاتە نیوە.",
              formulaSnippet: "MA = d₁ / d₂",
              highlightTerm: "بەهێزی دەستە",
            },
          ],
          quickQuiz: {
            question: "ئەگەر منداڵێکی 20 کیلۆ لە دووری 1 مەتر دابنیشێت، منداڵێکی 10 کیلۆ دەبێت لە چ دوورییەک دابنیشێت تا هاوسەنگ بێت؟",
            options: ["1 مەتر", "2 مەتر", "3 مەتر", "0.5 مەتر"],
            correctIndex: 1,
            explanation: "20kg × 1m = 10kg × 2m = 20kg·m لە هەردوو لا.",
          },
        },
        "physics-circuit": {
          title: "یاسای ئۆم: ڤۆڵتیە، تەزوو و بەرگری",
          speechExplanation:
            "یاسای ئۆم پەیوەندی نێوان پەستانی کارەبایی (ڤۆڵتیە)، تەزووی ئەلەکترۆنەکان و بەرگری خولگە ڕوون دەکاتەوە.",
          summary: "تەزووی کارەبا زیاد دەکات کاتێک ڤۆڵتیە بەرز دەبێتەوە، بەڵام کەم دەکات کاتێک بەرگری زیاد دەبێت.",
          steps: [
            {
              stepNumber: 1,
              title: "ڤۆڵتیە (V)",
              explanation: "ڤۆڵتیە بریتییە لە جیاوازی بارگەی کارەبایی کە پاتری دابینی دەکات بۆ پاڵنانی تەزوو.",
              formulaSnippet: "V (ڤۆڵت)",
              highlightTerm: "پەستانی کارەبا",
            },
            {
              stepNumber: 2,
              title: "بەرگری (R)",
              explanation: "بەرگری ڕێگری لە هاتووچۆی تەزوو دەکات و وزەی کارەبایی دەگۆڕێت بۆ گەرمی یان ڕووناکی.",
              formulaSnippet: "R (ئۆم، Ω)",
              highlightTerm: "بەرگری",
            },
            {
              stepNumber: 3,
              title: "تەزوو و ڕووناکی (I)",
              explanation: "تەزوو بریتییە لە ڕێژەی تێپەڕبوونی بارگە. تەزووی زیاتر گلۆپەکە گەشاوەتر دەکات.",
              formulaSnippet: "I = V / R (ئەمپێر)",
              highlightTerm: "تەزووی ڕژاو",
            },
          ],
          quickQuiz: {
            question: "ئەگەر ڤۆڵتیە دووهێندە بکرێت بەبێ گۆڕانی بەرگری، چی بەسەر تەزوودا دێت؟",
            options: ["تەزوو دەبێتە نیوە", "تەزوو دووهێندە دەبێت", "تەزوو وەک خۆی دەمێنێتەوە", "تەزوو دەبێتە سفر"],
            correctIndex: 1,
            explanation: "بەپێی I = V / R، تەزوو هاوڕێژەیە لەگەڵ ڤۆڵتیە، کەواتە دووهێندە دەبێت.",
          },
        },
        "chemistry-atom": {
          title: "مۆدێلی بۆر و پێکهاتەی ئەتۆم",
          speechExplanation:
            "ئەتۆم لە ناوکێکی چڕی پرۆتۆن و نیوترۆن پێکدێت، لەگەڵ ئەلەکترۆنەکان کە لە خولگەکانی دەوری ناوک دەسووڕێنەوە.",
          summary: "پرۆتۆنەکان ناسنامەی ماددەکە دیاری دەکەن، و ئەلەکترۆنەکانی خولگەی دەرەوە کردارە کیمیاییەکان ڕێکدەخەن.",
          steps: [
            {
              stepNumber: 1,
              title: "ژمارەی ئەتۆمی (Z)",
              explanation: "ژمارەی پرۆتۆنەکان لەناو ناوکدا ناسنامەی توخمە کیمیاییەکە دیاری دەکات.",
              formulaSnippet: "Z = P⁺",
              highlightTerm: "ناسنامەی توخم",
            },
            {
              stepNumber: 2,
              title: "خولگەکانی ئەلەکترۆن (2n²)",
              explanation: "خولگەی یەکەم تا 2 ئەلەکترۆن و خولگەی دووەم تا 8 ئەلەکترۆن لەخۆدەگرێت.",
              formulaSnippet: "K=2, L=8",
              highlightTerm: "توانستی خولگە",
            },
            {
              stepNumber: 3,
              title: "هاوسەنگی بارگە",
              explanation: "لە ئەتۆمی هاوسەنگدا، ژمارەی ئەلەکترۆنە نەرێنییەکان یەکسانە بە پرۆتۆنە ئەرێنییەکان.",
              formulaSnippet: "بارگەی گشتی = 0",
              highlightTerm: "بارگەی بێلایەن",
            },
          ],
          quickQuiz: {
            question: "کام توخم خاوەنی 8 پرۆتۆنە لە ناوکەکەیدا؟",
            options: ["نایترۆجین", "ئۆکسجین", "فلۆرین", "کاربۆن"],
            correctIndex: 1,
            explanation: "ئۆکسجین خاوەنی 8 پرۆتۆنە لە ناوکیدا (Z = 8).",
          },
        },
        "chess-tactics": {
          title: "تەکتیکی شەتڕەنج: فۆڕکی ئەسپ",
          speechExplanation:
            "فۆڕک کاتێک ڕوودەدات کە یەک پارچە لە یەک کاتدا هێرش بکاتە سەر دوو یان زیاتر لە پارچەکانی دوژمن.",
          summary: "ئەسپەکە لە شوێنێک دابنێ کە هاوکات شا و وەزیر لەژێر هەڕەشەدابن.",
          steps: [
            {
              stepNumber: 1,
              title: "ناسینی ئامانجە بێبەرگرییەکان",
              explanation: "سەرنج بدە کە شا و وەزیری دوژمن لە دوورییەکی شێوەی Lدان کە ئەسپ دەتوانێت کەڵکی لێ وەربگرێت.",
              formulaSnippet: "پشکنینی ئەندازەیی",
              highlightTerm: "دوو هەڕەشە",
            },
            {
              stepNumber: 2,
              title: "کیش بە شا",
              explanation: "بە کیشکردن لە شا، بەرامبەر ناچار دەبێت جووڵە بە شا بکات و ڕێگە دەدات لە نۆبەی دواتر وەزیر ببەیت.",
              formulaSnippet: "جووڵەی ناچاری",
              highlightTerm: "کیش",
            },
            {
              stepNumber: 3,
              title: "دەستکەوتنی باڵادەستی",
              explanation: "دوای ئەوەی شا دەربازی دەبێت لە کیش، لە هەنگاوی دواتر پارچەکە بگرە و سەرکەوتن مسۆگەر بکە.",
              formulaSnippet: "+باڵادەستی سەربازی",
              highlightTerm: "بردنەوەی یەکلاکەرەوە",
            },
          ],
          quickQuiz: {
            question: "بۆچی بەرگریکردن لە فۆڕکی ئەسپ ئەستەمە؟",
            options: [
              "ئەسپ دەتوانێت بەرەو دواوە بڕوات",
              "ئەسپ باز بەسەر پارچەکاندا دەدات و گۆشەی هێرشەکەی ناگیرێت",
              "خاڵی ئەسپ لە قەڵا زیاترە",
              "ئەسپ 8 خانە دەگرێت",
            ],
            correctIndex: 1,
            explanation: "چونکە ئەسپ باز دەدات، بەرامبەر ناتوانێت پارچەیەک بخاتە بەردەمی بۆ بەرگری لە کیشەکە.",
          },
        },
      }
    : {
        "math-balance": {
          title: "حل المعادلات بميزان التوازن",
          speechExplanation:
            "المعادلة الجبرية تشبه الميزان ذي الكفتين تماماً. ما تفعله في طرف، يجب فعله في الطرف الآخر للحفاظ على التوازن.",
          summary: "التوازن الجبري: اطرح 4 من الطرفين ثم اقسم على 2.",
          steps: [
            {
              stepNumber: 1,
              title: "تحديد حالة التوازن",
              explanation: "الكفة اليسرى تحوي 2x و 4 وحدات، والكفة اليمنى تحوي 12 وحدة. الكفتان متوازنتان.",
              formulaSnippet: "2x + 4 = 12",
              highlightTerm: "التوازن",
            },
            {
              stepNumber: 2,
              title: "عزل المتغير",
              explanation: "اطرح 4 من كلا الطرفين لتبقى حدود x وحدها في الطرف الأيسر.",
              formulaSnippet: "2x = 12 - 4 = 8",
              highlightTerm: "طرح 4",
            },
            {
              stepNumber: 3,
              title: "إيجاد قيمة x",
              explanation: "اقسم الطرفين على 2 للحصول على قيمة x واحدة.",
              formulaSnippet: "x = 8 / 2 = 4",
              highlightTerm: "x = 4",
            },
          ],
          quickQuiz: {
            question: "إذا كان 3x + 6 = 21، فما هي الخطوة الأولى لعزل x؟",
            options: [
              "القسمة على 3",
              "طرح 6 من كلا الطرفين",
              "إضافة 6 لكلا الطرفين",
              "الضرب في 2",
            ],
            correctIndex: 1,
            explanation: "طرح 6 من الطرفين يعطي 3x = 15 ويعزل المتغير أولاً.",
          },
        },
        "math-linear": {
          title: "الدالة الخطية والميل y = mx + b",
          speechExplanation:
            "المعادلة y = mx + b تمثل خطاً مستقيماً. يحدد m مدى انحدار الخط، بينما يمثل b نقطة تقاطع المحور الرأسي.",
          summary: "استكشف كيف يغير الميل m انحدار الخط وكيف يحركه b رأسياً.",
          steps: [
            {
              stepNumber: 1,
              title: "المقطع الصادي (b)",
              explanation: "عندما يكون x صفراً، فإن y يساوي b ويمثل نقطة تقاطع الخط مع المحور الرأسي.",
              formulaSnippet: "y = m(0) + b = b",
              highlightTerm: "نقطة التقاطع",
            },
            {
              stepNumber: 2,
              title: "الميل (m)",
              explanation: "الميل هو التغير الرأسي مقسوماً على التغير الأفقي.",
              formulaSnippet: "m = Δy / Δx",
              highlightTerm: "الميل",
            },
            {
              stepNumber: 3,
              title: "تحديد الإحداثيات",
              explanation: "عوّض بأي قيمة للمتغير x لإيجاد النقطة المطابقة على الخط المستقيم.",
              formulaSnippet: "(x, mx + b)",
              highlightTerm: "الإحداثيات",
            },
          ],
          quickQuiz: {
            question: "ماذا يحدث لمسار الخط عندما يكون الميل m سالباً؟",
            options: [
              "ينحدر الخط للأعلى من اليسار لليمين",
              "ينحدر الخط للأسفل من اليسار لليمين",
              "يصبح الخط أفقياً تماماً",
              "يتحول الخط إلى قطع مكافئ",
            ],
            correctIndex: 1,
            explanation: "الميل السالب يعني تناقص قيمة y مع زيادة x، فينحدر للأسفل.",
          },
        },
        "physics-torque": {
          title: "عزم الدوران والاتزان الدوراني",
          speechExplanation:
            "عزم الدوران هو القوة المسببة للدوران. يمكن لكتلة صغيرة على مسافة بعيدة أن توازن كتلة كبيرة قريبة من نقطة الارتكاز.",
          summary: "لكي تتوازن الرافعة، يجب أن يتساوى عزم الدوران مع اتجاه عقارب الساعة وعكسها.",
          steps: [
            {
              stepNumber: 1,
              title: "تعريف عزم الدوران",
              explanation: "يقيس عزم الدوران مدى فعالية القوة في إحداث دوران حول نقطة الارتكاز.",
              formulaSnippet: "τ = r × F",
              highlightTerm: "القوة × المسافة",
            },
            {
              stepNumber: 2,
              title: "الاتزان الدوراني",
              explanation: "عندما تكون محصلة العزوم صفراً، تبقى الرافعة في حالة توازن واستقرار أفقي.",
              formulaSnippet: "m₁ · d₁ = m₂ · d₂",
              highlightTerm: "توازن العزوم",
            },
            {
              stepNumber: 3,
              title: "الفائدة الميكانيكية",
              explanation: "مضاعفة المسافة عن نقطة الارتكاز تقلل القوة المطلوبة للموازنة إلى النصف.",
              formulaSnippet: "MA = d₁ / d₂",
              highlightTerm: "الرافعة",
            },
          ],
          quickQuiz: {
            question: "إذا جلس طفل وزنه 20 كغ على بعد 1 متر، فأين يجب أن يجلس طفل وزنه 10 كغ ليتوازنا؟",
            options: ["على بعد 1 متر", "على بعد 2 متر", "على بعد 3 أمتار", "على بعد 0.5 متر"],
            correctIndex: 1,
            explanation: "20 كغ × 1 م = 10 كغ × 2 م = 20 كغ·م في كلا الطرفين.",
          },
        },
        "physics-circuit": {
          title: "قانون أوم: الجهد والتيار والمقاومة",
          speechExplanation:
            "يربط قانون أوم بين فرق الجهد الكهربائي وتدفق التيار والمقاومة التي تعيق هذا التدفق.",
          summary: "يزداد التيار بزيادة الجهد الكهربائي، ويقل عندما تزداد المقاومة.",
          steps: [
            {
              stepNumber: 1,
              title: "فرق الجهد (V)",
              explanation: "الجهد هو فرق الطاقة الكهربائية الذي تدفعه البطارية لتحريك الشحنات في الدارة.",
              formulaSnippet: "V (فولت)",
              highlightTerm: "فرق الجهد",
            },
            {
              stepNumber: 2,
              title: "المقاومة (R)",
              explanation: "تقاوم المقاومات تدفق الشحنات الكهربائية وتحول الطاقة إلى حرارة أو ضوء.",
              formulaSnippet: "R (أوم، Ω)",
              highlightTerm: "المقاومة",
            },
            {
              stepNumber: 3,
              title: "التيار والإضاءة (I)",
              explanation: "التيار هو معدل تدفق الشحنات. كلما زاد التيار زادت إضاءة المصباح.",
              formulaSnippet: "I = V / R (أمبير)",
              highlightTerm: "معدل التدفق",
            },
          ],
          quickQuiz: {
            question: "إذا تضاعف الجهد مع ثبات المقاومة، فماذا يحدث للتيار الكهربائي؟",
            options: ["يقل إلى النصف", "يتضاعف التيار", "يبقى ثابتاً", "ينخفض إلى الصفر"],
            correctIndex: 1,
            explanation: "وفقاً للعلاقة I = V / R، يتناسب التيار طردياً مع الجهد، وبالتالي يتضاعف.",
          },
        },
        "chemistry-atom": {
          title: "نموذج بور وبنية الذرة",
          speechExplanation:
            "تتكون الذرة من نواة كثيفة من البروتونات والنيوترونات، تدور حولها الإلكترونات في مدارات طاقة محددة.",
          summary: "يحدد عدد البروتونات هوية العنصر الكيميائي، بينما تتحكم إلكترونات التكافؤ في التفاعلات الكيميائية.",
          steps: [
            {
              stepNumber: 1,
              title: "العدد الذري (Z)",
              explanation: "عدد البروتونات داخل النواة يحدد بشكل فريد هوية العنصر الكيميائي.",
              formulaSnippet: "Z = P⁺",
              highlightTerm: "هوية العنصر",
            },
            {
              stepNumber: 2,
              title: "مدارات الإلكترونات (2n²)",
              explanation: "يستوعب المدار الأول حتى إلكترونين، بينما يستوعب المدار الثاني حتى 8 إلكترونات.",
              formulaSnippet: "K=2, L=8",
              highlightTerm: "سعة المدار",
            },
            {
              stepNumber: 3,
              title: "التعادل الكهربائي",
              explanation: "في الذرة المتعادلة، يتساوى عدد الإلكترونات السالبة مع عدد البروتونات الموجبة.",
              formulaSnippet: "الشحنة الكلية = 0",
              highlightTerm: "التعادل",
            },
          ],
          quickQuiz: {
            question: "ما هو العنصر الذي يحتوي على 8 بروتونات في نواته؟",
            options: ["النيتروجين", "الأكسجين", "الفلور", "الكربون"],
            correctIndex: 1,
            explanation: "الأكسجين يحتوي على 8 بروتونات في نواته (العدد الذري Z = 8).",
          },
        },
        "chess-tactics": {
          title: "تكتيك الشطرنج: شوكة الحصان",
          speechExplanation:
            "تحدث الشوكة عندما تهاجم قطعة واحدة قطعتين معاديتين أو أكثر في الوقت نفسه، ويتميز الحصان بالقدرة على القفز.",
          summary: "ضع الحصان في موقع يهدد كلاً من الملك والوزير في آن واحد.",
          steps: [
            {
              stepNumber: 1,
              title: "رصد الأهداف غير المحمية",
              explanation: "لاحظ أن الملك والوزير يبعدان بمسافة على شكل حرف L يستطيع الحصان استغلالها.",
              formulaSnippet: "فحص الشكل الهندسي",
              highlightTerm: "تهديد مزدوج",
            },
            {
              stepNumber: 2,
              title: "توجيه كش للملك",
              explanation: "عند توجيه كش للملك، يُجبر الخصم قانونياً على الرد، مما يتيح لك أخذ القطعة الثانية لاحقاً.",
              formulaSnippet: "نقلة إجبارية",
              highlightTerm: "كش ملك",
            },
            {
              stepNumber: 3,
              title: "حصد التفوق المادي",
              explanation: "بعد تحرك الملك بعيداً عن الكش، التقط القطعة الأخرى في النقلة التالية.",
              formulaSnippet: "+أفضلية مادية",
              highlightTerm: "فوز حاسم",
            },
          ],
          quickQuiz: {
            question: "لماذا يصعب الدفاع ضد شوكة الحصان؟",
            options: [
              "لأن الحصان يمكنه التحرك للخلف",
              "لأن الحصان يقفز فوق القطع ولا يمكن حجب زاوية هجومه",
              "لأن قيمة الحصان أعلى من القلعة",
              "لأن الحصان يسيطر على ثمانية مربعات دائماً",
            ],
            correctIndex: 1,
            explanation: "نظراً لأن الحصان يقفز فوق القطع، لا يمكن للخصم وضع مدافع في مسار الهجوم لقطع الكش.",
          },
        },
      };

  const override = overrides[presetKey];
  if (!override) return base;

  return {
    ...base,
    ...override,
    steps: override.steps || base.steps,
    quickQuiz: override.quickQuiz || base.quickQuiz,
  };
}

/**
 * Main AI study tutor query function.
 * Tries primary Gemini 3.8-flash model first, then falls back to Gemini 3.5-flash-lite.
 * If network, authentication, or provider is unavailable, cleanly returns a tailored preset.
 */
export async function askStudyTutor(params: {
  question: string;
  subject?: StudySubject;
  language?: string;
}): Promise<StudyTutorResponse> {
  const cleanQuestion = params.question.trim().slice(0, 500);
  const targetSubject = params.subject || normalizeSubject(cleanQuestion);
  const language = params.language || "English";

  if (!cleanQuestion) {
    return getOfflinePresetFallback("", targetSubject);
  }

  const promptContent = [
    `Subject: ${targetSubject}`,
    `User's study question: "${cleanQuestion}"`,
    "Design a step-by-step interactive lesson with an appropriate interactive visualizer widget to answer and teach this question.",
  ].join("\n");

  // 1. Try Primary Model: gemini-3.8-flash with code execution tool
  try {
    const payload = await generateGeminiContent<any>(
      PRIMARY_GEMINI_STUDY_MODEL,
      {
        contents: [{ parts: [{ text: promptContent }] }],
        systemInstruction: { parts: [{ text: buildSystemPrompt(language) }] },
        tools: [{ codeExecution: {} }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 3500,
        },
      },
      {
        featureKey: "roleplay_text_response",
        timeoutMs: 35_000,
      },
    );

    const parts = payload?.candidates?.[0]?.content?.parts ?? [];
    let responseText = "";
    let pyCode = "";
    let pyOut = "";

    for (const part of parts) {
      if (typeof part.text === "string") {
        responseText += part.text + "\n";
      }
      const execCode = part.executableCode?.code ?? (part as any).executable_code?.code;
      if (execCode) {
        pyCode += execCode + "\n";
      }
      const execOut =
        part.codeExecutionResult?.output ?? (part as any).code_execution_result?.output;
      if (execOut) {
        pyOut += execOut + "\n";
      }
    }

    const parsed = parseGeminiStudyResponse(responseText.trim(), pyCode.trim(), pyOut.trim());
    if (parsed) {
      return { ...parsed, modelUsed: PRIMARY_GEMINI_STUDY_MODEL };
    }
  } catch {
    // 2. Fallback to gemini-3.5-flash-lite
    try {
      let fallbackPayload: any;
      try {
        fallbackPayload = await generateGeminiContent<any>(
          FALLBACK_GEMINI_STUDY_MODEL,
          {
            contents: [{ parts: [{ text: promptContent }] }],
            systemInstruction: { parts: [{ text: buildSystemPrompt(language) }] },
            tools: [{ codeExecution: {} }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 3000,
            },
          },
          {
            featureKey: "roleplay_text_response",
            timeoutMs: 25_000,
          },
        );
      } catch {
        // Retry lite without tools in case codeExecution tool is unsupported on lite model
        fallbackPayload = await generateGeminiContent<any>(
          FALLBACK_GEMINI_STUDY_MODEL,
          {
            contents: [{ parts: [{ text: promptContent }] }],
            systemInstruction: { parts: [{ text: buildSystemPrompt(language) }] },
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 3000,
            },
          },
          {
            featureKey: "roleplay_text_response",
            timeoutMs: 25_000,
          },
        );
      }

      const parts = fallbackPayload?.candidates?.[0]?.content?.parts ?? [];
      let responseText = "";
      let pyCode = "";
      let pyOut = "";

      for (const part of parts) {
        if (typeof part.text === "string") {
          responseText += part.text + "\n";
        }
        const execCode = part.executableCode?.code ?? (part as any).executable_code?.code;
        if (execCode) {
          pyCode += execCode + "\n";
        }
        const execOut =
          part.codeExecutionResult?.output ?? (part as any).code_execution_result?.output;
        if (execOut) {
          pyOut += execOut + "\n";
        }
      }

      const parsed = parseGeminiStudyResponse(responseText.trim(), pyCode.trim(), pyOut.trim());
      if (parsed) {
        return { ...parsed, modelUsed: FALLBACK_GEMINI_STUDY_MODEL };
      }
    } catch {
      // Graceful recovery to offline presets
    }
  }

  // Graceful offline fallback: pick appropriate subject preset
  return getOfflinePresetFallback(cleanQuestion, targetSubject);
}
