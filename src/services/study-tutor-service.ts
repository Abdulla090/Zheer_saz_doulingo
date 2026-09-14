import { generateGeminiContent } from "./gemini-gateway";
import { prepareSandboxedHtml } from "./study-simulation-templates";

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
  latex?: string;
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
  thinkingProcess?: string[];
  speechExplanation: string;
  formula: string;
  summary: string;
  steps: StudyStep[];
  interactive: InteractiveWidgetState;
  quickQuiz: StudyQuizQuestion;
  modelUsed?: string;
};

export const PRIMARY_GEMINI_STUDY_MODEL = "gemini-3.6-flash";

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

  // 4. Parse with invalid escape sequence fixing (e.g. LLM wrote unescaped LaTeX backslashes \sum, \int, \alpha)
  try {
    const noTrailingCommas = raw.replace(/,\s*([}\]])/g, "$1");
    const sanitized = sanitizeJsonControlChars(noTrailingCommas);
    // Escape backslashes that are not followed by valid JSON escape characters (" \ / b f n r t u)
    const fixedEscapes = sanitized.replace(/\\([^"\\\/bfnrtu])/g, "\\\\$1");
    return JSON.parse(fixedEscapes);
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
    "",
    "CRITICAL TUTORING DIRECTIVES:",
    "1. FOCUS ON DYNAMIC SIMULATIONS & MOTIONS (NON-MATH SUBJECTS):",
    "   - For physics, chemistry, biology, circuits, mechanics, and any science questions, DO NOT answer with homework text steps or formula cards!",
    "   - INSTEAD, YOUR MAIN PURPOSE IS TO CREATE 60fps DYNAMIC SIMULATIONS AND INTERACTIVE VISUALIZATIONS (interactive.html).",
    "   - For physics and chemistry, the 'steps' array MUST be empty [] because you do not output text answers, but create interactive simulations!",
    "   - 'speechExplanation' must be engaging spoken guidance inviting the student to interact with the simulation and observing the physical principles.",
    "   - Build a complete 60fps HTML5 Canvas or SVG dynamic simulation with particle loops (requestAnimationFrame), draggable bodies, interactive force vectors, or slider controls so the student can directly manipulate parameters and explore the physical phenomenon visually.",
    "2. CLEAN LATEX STEPS (MATH SUBJECTS):",
    "   - When answering mathematics, provide clean, rigorous derivation steps in sequential order in 'steps'.",
    "   - Each step in 'steps' MUST include an explicit 'latex' field containing the pure LaTeX formula for that step (e.g. '\\frac{dy}{dx} = -\\frac{1}{(1+x)^2}').",
    "   - The mobile UI presents each step as clean 'STEP X' and the large LaTeX math step in large typography without cards or boxes.",
    "3. EXPLAIN THE SOLUTION:",
    "   - Give a short, learner-facing solution outline, not an internal reasoning trace.",
    "   - Return a thinkingProcess array with the key learning objectives and equations used.",
    "4. HONEST EXPLANATIONS:",
    "   - You do not have a code execution tool. Never claim to have run Python or verified output.",
    "   - Leave executedPythonCode and executedPythonOutput empty. Keep the lesson JSON compact and complete within the output budget.",
    "",
    "SIMULATION CODE SPECIFICATION (interactive.html):",
    "- If the user attached an image containing a problem (e.g. math equation, physics diagram, circuit, or graph), carefully read the problem from the image and solve it step-by-step.",
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
      thinkingProcess: [
        "1. Identify physical laws & problem constraints...",
        "2. Formulate equations of motion / algebraic steps...",
        "3. Summarize the result and its assumptions...",
        "4. Construct 60fps dynamic visual simulation & LaTeX steps...",
      ],
      speechExplanation: "1-2 engaging spoken sentences suitable for text-to-speech audio explanation",
      formula: "Key mathematical or scientific formula (empty string for non-math)",
      summary: "One sentence summary of the core physical or mathematical insight",
      steps: [
        {
          stepNumber: 1,
          title: "Step Title",
          latex: "\\frac{d}{dx}[x^2] = 2x",
          explanation: "Detailed intuitive explanation of this step",
          formulaSnippet: "\\frac{d}{dx}[x^2] = 2x",
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

    if (!parsed.title || !parsed.speechExplanation) {
      return null;
    }

    let thinkingProcess: string[] | undefined = undefined;
    if (Array.isArray(parsed.thinkingProcess) && parsed.thinkingProcess.length > 0) {
      thinkingProcess = parsed.thinkingProcess.map(String);
    } else if (typeof parsed.thinkingProcess === "string" && parsed.thinkingProcess.trim().length > 0) {
      thinkingProcess = [parsed.thinkingProcess.trim()];
    } else {
      const thoughtMatch = jsonText.match(/<thought>([\s\S]*?)<\/thought>/i);
      if (thoughtMatch?.[1]) {
        const lines = thoughtMatch[1]
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        if (lines.length > 0) thinkingProcess = lines;
      }
    }

    const rawSteps = Array.isArray(parsed.steps) ? parsed.steps : [];
    const steps: StudyStep[] = rawSteps.map((s: any, idx: number) => ({
      stepNumber: s.stepNumber || idx + 1,
      title: String(s.title || `Step ${idx + 1}`),
      explanation: String(s.explanation || ""),
      latex: s.latex ? String(s.latex) : s.formulaSnippet ? String(s.formulaSnippet) : undefined,
      formulaSnippet: s.formulaSnippet ? String(s.formulaSnippet) : s.latex ? String(s.latex) : undefined,
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
      executedPythonCode:
        executedPythonCode ||
        (typeof interactiveObj.executedPythonCode === "string"
          ? interactiveObj.executedPythonCode
          : undefined) ||
        (typeof interactiveObj.pythonCode === "string"
          ? interactiveObj.pythonCode
          : undefined) ||
        (typeof parsed.executedPythonCode === "string"
          ? parsed.executedPythonCode
          : undefined) ||
        (typeof parsed.pythonCode === "string" ? parsed.pythonCode : undefined) ||
        undefined,
      executedPythonOutput:
        executedPythonOutput ||
        (typeof interactiveObj.executedPythonOutput === "string"
          ? interactiveObj.executedPythonOutput
          : undefined) ||
        (typeof interactiveObj.pythonOutput === "string"
          ? interactiveObj.pythonOutput
          : undefined) ||
        (typeof parsed.executedPythonOutput === "string"
          ? parsed.executedPythonOutput
          : undefined) ||
        (typeof parsed.pythonOutput === "string" ? parsed.pythonOutput : undefined) ||
        undefined,
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
      thinkingProcess,
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

export async function askStudyTutor(params: {
  question: string;
  subject?: StudySubject;
  language?: string;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<StudyTutorResponse> {
  const cleanQuestion = params.question.trim().slice(0, 500);
  const targetSubject = params.subject || normalizeSubject(cleanQuestion);
  const language = params.language || "English";

  if (!cleanQuestion && !params.imageBase64) {
    throw new Error("No question or image provided");
  }

  const promptContent = [
    `Subject: ${targetSubject}`,
    cleanQuestion
      ? `User's study question: "${cleanQuestion}"`
      : "The user provided an image of a study question or problem.",
    params.imageBase64
      ? "An image is attached. Inspect the equation, diagram, or question in the image and solve it step-by-step with real mathematical rigor."
      : "",
    "Design a step-by-step interactive lesson with an appropriate interactive visualizer widget to answer and teach this question.",
  ]
    .filter(Boolean)
    .join("\n");

  const contentParts: any[] = [{ text: promptContent }];
  if (params.imageBase64 && params.imageMimeType) {
    contentParts.push({
      inline_data: {
        data: params.imageBase64,
        mime_type: params.imageMimeType,
      },
    });
  }

  // One deliberate submission creates one charge. Never silently retry a paid
  // generation or substitute an unrelated example for the learner's question.
  const payload = await generateGeminiContent<any>(
    PRIMARY_GEMINI_STUDY_MODEL,
    {
      contents: [{ parts: contentParts }],
      systemInstruction: { parts: [{ text: buildSystemPrompt(language) }] },
      generationConfig: { maxOutputTokens: 4096 },
    },
    { featureKey: "study_tutor", timeoutMs: 60_000 },
  );
  const parts = payload?.candidates?.[0]?.content?.parts ?? [];
  const responseText = parts.map((part: { text?: string }) => part.text ?? "").join("\n");
  const parsed = parseGeminiStudyResponse(responseText);
  if (!parsed) throw new Error("The lesson could not be read. Please try again.");
  return { ...parsed, interactive: { ...parsed.interactive, executedPythonCode: "", executedPythonOutput: "" }, modelUsed: payload.modelUsed ?? PRIMARY_GEMINI_STUDY_MODEL };
}
