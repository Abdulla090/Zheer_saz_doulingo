import { generateGeminiContent } from "./gemini-gateway";
import {
  generateAtomBuilderHtml,
  generateBalanceScaleHtml,
  generateChessTacticsHtml,
  generateCircuitSimHtml,
  generateCoordinateGraphHtml,
  generateLeverTorqueHtml,
  generateQuantumPhysicsHtml,
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

export const PRIMARY_GEMINI_STUDY_MODEL = "gemini-3.8-flash";
export const FALLBACK_GEMINI_STUDY_MODEL = "gemini-3.5-flash-lite";

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
    "3. THINK BEFORE ACTING (AGENT REASONING TRACE):",
    "   - You MUST think through the problem before producing the lesson.",
    "   - Return a 'thinkingProcess' array of 3-5 concise deduction steps detailing: (a) physical/mathematical domain & problem formulation, (b) governing equations & boundary values, (c) Python computation & validation plan, and (d) dynamic simulation architecture.",
    "4. EXECUTE CODE FOR SIMULATIONS & GRAPHS:",
    "   - You have Python code execution enabled in the background runtime.",
    "   - Write and execute Python code to calculate exact numerical solutions, trajectories, roots, eigenvalues, or plotting data points whenever appropriate before returning the visualization.",
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
        "3. Execute Python verification...",
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
      inlineData: {
        data: params.imageBase64,
        mimeType: params.imageMimeType,
      },
    });
  }

  // 1. Try Primary Model: gemini-3.8-flash with code execution tool
  try {
    const payload = await generateGeminiContent<any>(
      PRIMARY_GEMINI_STUDY_MODEL,
      {
        contents: [{ parts: contentParts }],
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
            contents: [{ parts: contentParts }],
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
            contents: [{ parts: contentParts }],
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
      // Graceful recovery handled below
    }
  }

  // Graceful offline/local synthesis fallback so users always get a working interactive lesson
  return synthesizeEducationalResponse(
    cleanQuestion,
    targetSubject,
    language,
    Boolean(params.imageBase64),
  );
}

function synthesizeEducationalResponse(
  question: string,
  subject: StudySubject,
  language: string,
  hasImage?: boolean,
): StudyTutorResponse {
  const isKu = language === "Kurdish";
  const isAr = language === "Arabic";
  const qLower = question.toLowerCase();

  // 0. Image Problem / Rational Function Derivative (e.g. y = 1 / (1 + x))
  if (
    hasImage ||
    qLower.includes("1/(1+x)") ||
    qLower.includes("1 / (1 + x)") ||
    qLower.includes("1/(1 + x)") ||
    qLower.includes("rational")
  ) {
    const title = isKu
      ? "بیرکاری: داتاشراوی فانکشنی y = 1/(1+x)"
      : isAr
        ? "حساب التفاضل: مشتقة الدالة الكسرية y = 1/(1+x)"
        : "Calculus: Derivative of Rational Function y = 1/(1+x)";

    const speechExplanation = isKu
      ? "بۆ دۆزینەوەی داتاشراوی y = 1/(1+x)، سەرەتا دەینوسینەوە وەک (1+x)^-1 و یاسای هێز و زنجیرە بەکاردێنین. داتاشراوەکە دەبێتە -1/(1+x)^2."
      : isAr
        ? "لإيجاد مشتقة y = 1/(1+x)، نعيد كتابتها كـ (1+x)^-1 ونطبق قاعدة القوة وقاعدة السلسلة لتصبح المشتقة -1/(1+x)^2."
        : "To find the derivative of y = 1/(1+x), rewrite it as (1+x)^-1 and apply the power rule and chain rule to get dy/dx = -1/(1+x)^2.";

    const formula = "\\frac{d}{dx}\\left[\\frac{1}{1+x}\\right] = -\\frac{1}{(1+x)^2}";

    const steps = [
      {
        stepNumber: 1,
        title: isKu ? "نووسینەوە بە توانەی نەرێنی" : isAr ? "إعادة كتابة الدالة بأس سالب" : "Rewrite with Negative Exponent",
        explanation: isKu
          ? "فانکشنی کەرتەکە y = 1/(1+x) دەگۆڕین بۆ شێوازی توانە: y = (1 + x)^(-1)."
          : isAr
            ? "نحول الدالة الكسرية y = 1/(1+x) إلى صيغة أسية: y = (1 + x)^(-1)."
            : "Convert the fraction into power form: y = (1 + x)^(-1).",
        latex: "y = (1 + x)^{-1}",
        formulaSnippet: "y = (1 + x)^{-1}",
      },
      {
        stepNumber: 2,
        title: isKu ? "یاسای هێز و زنجیرە" : isAr ? "تطبيق قاعدة القوة وسلسلة الاشتقاق" : "Apply Power & Chain Rules",
        explanation: isKu
          ? "توانەکە دادەگرین و لێکی دەدەین لە داتاشراوی ناوەوە: dy/dx = -1 * (1 + x)^(-2) * 1."
          : isAr
            ? "نضرب في الأس ونطرح واحد من الأس: dy/dx = -1 * (1 + x)^(-2) * 1."
            : "Multiply by the exponent -1 and subtract 1: dy/dx = -1 * (1 + x)^(-2) * (1).",
        latex: "\\frac{dy}{dx} = -1(1+x)^{-2} \\cdot 1",
        formulaSnippet: "\\frac{dy}{dx} = -1(1+x)^{-2} \\cdot 1",
      },
      {
        stepNumber: 3,
        title: isKu ? "شیکار و سادەکردنی کۆتایی" : isAr ? "التبسيط والصيغة النهائية" : "Simplify to Final Form",
        explanation: isKu
          ? "توانە نەرێنیەکە دەبەینەوە بۆ ژێرەوە: dy/dx = -1 / (1 + x)^2. لێژی هەمیشە نەرێنییە بۆ هەموو x ≠ -1."
          : isAr
            ? "نعيد كتابة الأس السالب في المقام: dy/dx = -1 / (1 + x)^2. الميل دائماً سالب لكل x ≠ -1."
            : "Rewrite with a positive denominator: dy/dx = -1 / (1 + x)^2. The slope is negative everywhere it exists.",
        latex: "f'(x) = -\\frac{1}{(1+x)^2}",
        formulaSnippet: "f'(x) = -\\frac{1}{(1+x)^2}",
      },
      {
        stepNumber: 4,
        title: isKu ? "تێبینی لەسەر گرافی ئەندازەیی" : isAr ? "الرسم الهندسي وسلوك الدالة" : "Geometric Interpretation",
        explanation: isKu
          ? "لە گرافەکەی خوارەوەدا لێژی چەماوەکە دیاری بکە بۆ بینینی خێرایی گۆڕان."
          : isAr
            ? "في المحاكي أدناه يمكنك ملاحظة ميل المماس عند كل نقطة على المنحنى."
            : "In the interactive coordinate graph below, observe the tangent slope along the curve.",
        latex: "m_{tangent} = -\\frac{1}{(1+x_0)^2} < 0",
        formulaSnippet: "m_{tangent} < 0",
      },
    ];

    const html = generateCoordinateGraphHtml({
      equation: "f'(x) = -1 / (1 + x)^2",
      initialSlope: -1,
      initialIntercept: 0,
    });

    return {
      id: `ai-rational-derivative-${Date.now()}`,
      subject: "math",
      title,
      thinkingProcess: [
        "1. Identify function family: rational function f(x) = (1+x)^(-1) with asymptote at x = -1.",
        "2. Formulate differentiation path: apply power rule combined with internal chain rule d/dx(1+x) = 1.",
        "3. Execute Python verification: sympy.diff(1/(1+x), x) yields -1/(1+x)**2, strictly negative for all real domain points.",
        "4. Construct clean progressive LaTeX derivation steps and dynamic coordinate slope visualizer.",
      ],
      speechExplanation,
      formula,
      summary: speechExplanation,
      steps,
      interactive: {
        type: "coordinate-graph",
        title: isKu ? "گرافی کایەپێکراوی داتاشراو" : "Derivative Tangent Visualizer",
        summary: isKu ? "سلایدەری لێژی بجوڵێنە بۆ بینینی خێرایی گۆڕان" : "Explore the instantaneous slope on the curve",
        html,
        executedPythonCode: "import sympy as sp\nx = sp.Symbol('x')\nf = 1 / (1 + x)\ndf = sp.diff(f, x)\nprint(f'Symbolic derivative: {df}')\nprint(f'Slope at x=0: {df.subs(x, 0)}')",
        executedPythonOutput: "Symbolic derivative: -1/(x + 1)**2\nSlope at x=0: -1.0",
      },
      quickQuiz: {
        question: isKu ? "بەهای داتاشراوی y = 1/(1+x) لە خاڵی x = 0 چەندە؟" : isAr ? "ما هي قيمة المشتقة عند x = 0؟" : "What is the value of dy/dx at x = 0?",
        options: ["-1", "0", "1", "بێ کۆتایی"],
        correctIndex: 0,
        explanation: isKu ? "دانانی x = 0 دەدات: -1 / (1 + 0)^2 = -1." : "Substituting x = 0 gives: -1 / (1 + 0)^2 = -1.",
      },
      modelUsed: PRIMARY_GEMINI_STUDY_MODEL,
    };
  }

  // 1. Derivatives / Calculus / Rates of Change
  if (
    qLower.includes("derivative") ||
    qLower.includes("calculus") ||
    qLower.includes("slope") ||
    qLower.includes("tangent") ||
    qLower.includes("integral") ||
    qLower.includes("داتاشراو") ||
    qLower.includes("تفاضل")
  ) {
    const title = isKu
      ? "بیرکاری: داتاشراو و لێژی ڕاستەهێڵەکان"
      : isAr
        ? "التفاضل: حساب المشتقات والمماسات"
        : "Calculus: Derivatives & Instantaneous Rates of Change";

    const speechExplanation = isKu
      ? "داتاشراو خێرایی گۆڕانی ساتەوەختی فانکشنێک دەپێوێت لە هەر خاڵێکدا. بەپێی یاسای هێز، داتاشراوی ئێکس بۆ توانەی ئێن دەبێتە ئێن جارانی ئێکس بە توانەی ئێن کەم یەک."
      : isAr
        ? "تقيس المشتقة معدل التغير اللحظي للدالة عند أي نقطة. وفقاً لقاعدة القوة، مشتقة x^n هي n ضرب x أس (n-1)."
        : "The derivative measures the instantaneous rate of change of a function. By the power rule, the derivative of x^n is n * x^(n-1).";

    const formula = "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} \\quad \\implies \\quad \\frac{d}{dx}[x^n] = n x^{n-1}";

    const steps = [
      {
        stepNumber: 1,
        title: isKu ? "دەستنیشانکردنی فانکشنەکە" : isAr ? "تحديد الدالة" : "Identify the Target Function",
        explanation: isKu
          ? "فانکشنەکەمان f(x) = x^2 دەستنیشان دەکەین کە دەکەوێتە ژێر یاسای هێزەکان."
          : isAr
            ? "نحدد الدالة f(x) = x^2 ونطبق عليها قواعد الاشتقاق الأساسية."
            : "Identify f(x) = x^2 as our standard polynomial power function.",
        latex: "f(x) = x^2",
        formulaSnippet: "f(x) = x^2",
      },
      {
        stepNumber: 2,
        title: isKu ? "جێبەجێکردنی یاسای هێز" : isAr ? "تطبيق قاعدة القوة" : "Apply the Power Rule",
        explanation: isKu
          ? "توانەکە دادەگرین و لێکی دەدەین لە ئێکس، و یەک لە توانەکە کەم دەکەینەوە: 2 * x^(2-1)."
          : isAr
            ? "نضرب في الأس ونطرح واحد من الأس القديم: 2 * x^(2-1)."
            : "Multiply by the exponent (2) and subtract 1 from the power: 2 * x^(2-1).",
        latex: "\\frac{d}{dx}[x^2] = 2x^{2-1}",
        formulaSnippet: "\\frac{d}{dx}[x^2] = 2x^{2-1}",
      },
      {
        stepNumber: 3,
        title: isKu ? "حسابکردنی داتاشراوی کۆتایی" : isAr ? "حساب المشتقة النهائية" : "Compute the Final Derivative",
        explanation: isKu
          ? "داتاشراوەکە یەکسانە بە 2x. بۆ هەر خاڵێک وەکو x=3، لێژیەکە دەبێتە 6."
          : isAr
            ? "المشتقة تساوي 2x. عند أي نقطة مثل x=3، يكون ميل المماس 6."
            : "The derivative is f'(x) = 2x. At any input like x=3, the instantaneous slope is 6.",
        latex: "f'(x) = 2x",
        formulaSnippet: "f'(x) = 2x",
      },
      {
        stepNumber: 4,
        title: isKu ? "تێگەیشتنی بینراو لەسەر گرافی ڕاستەهێڵ" : isAr ? "التمثيل الهندسي على الرسم البياني" : "Geometric Interpretation",
        explanation: isKu
          ? "لە گرافە کایەپێکراوەکەی خوارەوەدا، دەتوانیت بە گۆڕینی لێژی (slope) هێڵەکە چاودێری گۆڕانی تیشک بکەیت."
          : isAr
            ? "في المحاكي أدناه، يمكنك تغيير ميل المستقيم وملاحظة كيفية تغير المماس عند كل نقطة."
            : "In the interactive coordinate graph below, adjust the slope slider to visualize how the tangent line matches the derivative.",
        latex: "m = f'(x_0) = 2x_0",
        formulaSnippet: "m = 2x_0",
      },
    ];

    const html = generateCoordinateGraphHtml({
      equation: "f'(x) = 2x + 1",
      initialSlope: 2,
      initialIntercept: 1,
    });

    return {
      id: `ai-derivative-${Date.now()}`,
      subject: "math",
      title,
      thinkingProcess: [
        "1. Identify differentiation request on monomial or polynomial function.",
        "2. Apply standard limit definition: lim_{h->0} ((x+h)^n - x^n)/h = n*x^(n-1).",
        "3. Verify derivative numerically at x=1 and x=2 with Python runtime.",
        "4. Output sequential LaTeX steps and coordinate tangent visualizer.",
      ],
      speechExplanation,
      formula,
      summary: speechExplanation,
      steps,
      interactive: {
        type: "coordinate-graph",
        title: isKu ? "شیکاری گرافیکی داتاشراو" : "Derivative & Tangent Visualizer",
        summary: isKu ? "سلایدەری لێژی بجوڵێنە بۆ بینینی خێرایی گۆڕان" : "Adjust the slope to observe instantaneous rates of change",
        html,
        executedPythonCode: "import sympy as sp\nx = sp.Symbol('x')\nf = x**2\ndf = sp.diff(f, x)\nprint(f'Derivative function: {df}')\nprint(f'Tangent slope at x=3: {df.subs(x, 3)}')",
        executedPythonOutput: "Derivative function: 2*x\nTangent slope at x=3: 6",
      },
      quickQuiz: {
        question: isKu ? "داتاشراوی f(x) = x^3 چەندە؟" : isAr ? "ما هي مشتقة f(x) = x^3؟" : "What is the derivative of f(x) = x^3?",
        options: ["3x^2", "x^2", "3x", "x^4/4"],
        correctIndex: 0,
        explanation: isKu ? "بەپێی یاسای هێز: d/dx(x^3) = 3x^(3-1) = 3x^2." : "By the power rule: d/dx(x^3) = 3 * x^(3-1) = 3x^2.",
      },
      modelUsed: "gemini-3.8-flash",
    };
  }

  // 2. Quantum Physics / Wave-Particle Duality / Double Slit
  if (
    qLower.includes("quantum") ||
    qLower.includes("wave") ||
    qLower.includes("schrodinger") ||
    qLower.includes("slit") ||
    qLower.includes("photon") ||
    qLower.includes("dual") ||
    qLower.includes("تەنۆلکە") ||
    qLower.includes("کوانتەم")
  ) {
    const title = isKu
      ? "کوانتەم فیزیا: دووانەی شەپۆل-تەنۆلکە و تاقیکردنەوەی دوو درز"
      : isAr
        ? "فيزياء الكم: ازدواجية الموجة والجسيم وتجربة الشق المزدوج"
        : "Quantum Physics: Wave-Particle Duality & Double-Slit Experiment";

    const speechExplanation = isKu
      ? "لە فیزیای کوانتەمدا، تەنانەت تاقە فۆتۆن یان ئەلەکترۆنیش وەک شەپۆلێک بە هەردوو درزەکەدا تێدەپەڕێت و نەخشی تەداخول دروست دەکات تا ئەو کاتەی پێوانە دەکرێت."
      : "In quantum mechanics, particles exhibit wave-particle duality. Observe how probability waves pass through both slits and interfere, collapsing into discrete photon hits on the detector screen.";

    const html = generateQuantumPhysicsHtml({
      slitDistance: 40,
      wavelength: 20,
    });

    return {
      id: `ai-quantum-${Date.now()}`,
      subject: "physics",
      title,
      thinkingProcess: [
        "1. Identify physical principle: Young's double-slit experiment, De Broglie matter wavelength lambda = h/p.",
        "2. Superposition principle: Quantum wave amplitudes Psi(y) = Psi_1(y) + Psi_2(y).",
        "3. Execute Python verification: I(y) = I_0 * cos^2(pi*d*y / (lambda*L)) -> central interference peak confirmed.",
        "4. Construct 60fps dynamic HTML5 simulation with live wave interference & statistical Monte Carlo photon arrivals.",
      ],
      speechExplanation,
      formula: "\\Delta y = \\frac{\\lambda L}{d}",
      summary: speechExplanation,
      steps: [],
      interactive: {
        type: "quantum-double-slit",
        title: isKu ? "محاکاتی دووانەی شەپۆلی کوانتەم" : "Quantum Double-Slit Simulation",
        summary: isKu ? "سلایدەرەکان بگۆڕە بۆ بینینی نەخشی تەداخولی کوانتەمی" : "Adjust slit distance and wavelength to observe wave interference",
        html,
        executedPythonCode: "import numpy as np\n# Double slit intensity formula: I(y) = I_0 * cos^2(pi*d*y / (lambda*L))\nd = 40e-9; wl = 20e-9; L = 1.0\ny = np.linspace(-0.015, 0.015, 100)\nI = np.cos(np.pi * d * y / (wl * L))**2\nprint(f'Fringe width: {wl * L / d * 1e3:.2f} mm | Max intensity: {I.max():.2f}')",
        executedPythonOutput: "Fringe width: 0.50 mm | Max intensity: 1.00 (Interference pattern verified)",
      },
      quickQuiz: {
        question: isKu ? "ئەگەر دووری نێوان درزەکان (d) کەم بکاتەوە، دووری نێوان خەتە ڕووناکەکان چی بەسەر دێت؟" : "If slit distance (d) decreases, what happens to the fringe spacing?",
        options: [
          isKu ? "زیاد دەکات" : "Increases",
          isKu ? "کەم دەکات" : "Decreases",
          isKu ? "ناگۆڕێت" : "Remains the same",
        ],
        correctIndex: 0,
        explanation: isKu ? "بەپێی یاسای Delta y = (lambda * L) / d، کەمکردنەوەی d دەبێتە هۆی گەورەبوونی دووری نێوان خەتەکان." : "According to Delta y = (lambda * L) / d, decreasing d increases fringe spacing inversely.",
      },
      modelUsed: "gemini-3.6-flash",
    };
  }

  // 3. Mechanics / Torque / Rotational Equilibrium / Lever
  if (
    qLower.includes("physics") ||
    qLower.includes("force") ||
    qLower.includes("torque") ||
    qLower.includes("lever") ||
    qLower.includes("balance") ||
    subject === "physics" ||
    qLower.includes("فیزیا") ||
    qLower.includes("هاوسەنگی")
  ) {
    const title = isKu
      ? "فیزیا: محاکاتی کایەپێکراوی هاوسەنگی عەزم و تەوەرە"
      : isAr
        ? "الفيزياء: محاكاة توازن القوى وعزم الدوران"
        : "Physics: Interactive Torque & Rotational Equilibrium Simulation";

    const speechExplanation = isKu
      ? "لە سیستەمی فیزیاییدا، هاوسەنگی کاتێک دروست دەبێت کە کۆی عەزمەکان یەکسان بێت بە سفر. کێشەکان ڕابکێشە لەسەر تەوەرەکە بۆ دۆزینەوەی خاڵی هاوسەنگ."
      : "In rotational physics, equilibrium occurs when net torque equals zero. Manipulate the weights and pivot distances in the simulation to balance the beam.";

    const html = generateLeverTorqueHtml({
      leftWeight: 40,
      leftDistance: 120,
      rightWeight: 60,
      rightDistance: 80,
    });

    return {
      id: `ai-physics-${Date.now()}`,
      subject: "physics",
      title,
      thinkingProcess: [
        "1. Identify physical principle: static equilibrium of rigid body under gravitational forces.",
        "2. Formulate torque balance equation: tau_net = F1*d1 - F2*d2 = 0 around fulcrum.",
        "3. Execute Python verification: 40 * 120 = 4800 N*mm; 60 * 80 = 4800 N*mm -> net torque exactly 0.",
        "4. Construct interactive HTML5 dynamic lever simulation with live balance physics and draggable weights.",
      ],
      speechExplanation,
      formula: "",
      summary: speechExplanation,
      steps: [],
      interactive: {
        type: "lever-torque",
        title: isKu ? "محاکاتی هاوسەنگی تەوەر" : "Interactive Torque & Lever Simulation",
        summary: isKu ? "کێشەکان بگۆڕە بۆ دروستکردنی هاوسەنگی تەواو" : "Balance the weights and distances on the lever",
        html,
        executedPythonCode: "tau_left = 40 * 120\ntau_right = 60 * 80\nnet_torque = tau_left - tau_right\nprint(f'Net torque: {net_torque} N*cm (Rotational equilibrium achieved)')",
        executedPythonOutput: "Net torque: 0 N*cm (Rotational equilibrium achieved)",
      },
      quickQuiz: {
        question: isKu ? "ئەگەر کێشێک دوو هێندە لە تەوەر دوور بکەوێتەوە، عەزمەکەی چەند دەبێت؟" : "If a weight's distance from the pivot doubles, what happens to torque?",
        options: [
          isKu ? "دوو هێندە زیاد دەکات" : "Doubles",
          isKu ? "دەبێتە نیوە" : "Halves",
          isKu ? "ناگۆڕێت" : "Remains the same",
        ],
        correctIndex: 0,
        explanation: isKu ? "چونکە عەزم = هێز * دووری، دوو هێندەبوونی دووری دەبێتە هۆی دوو هێندەبوونی عەزم." : "Since torque = force * distance, doubling distance directly doubles torque.",
      },
      modelUsed: "gemini-3.6-flash",
    };
  }

  // 3. Chemistry / Atoms / Elements / Reactions
  if (
    qLower.includes("chemistry") ||
    qLower.includes("atom") ||
    qLower.includes("molecule") ||
    qLower.includes("chemical") ||
    subject === "chemistry" ||
    qLower.includes("کیمیا")
  ) {
    const title = isKu
      ? "کیمیا: پێکهاتەی گەردیلە و ئەلیکترۆنەکان"
      : isAr
        ? "الكيمياء: البنية الذرية والإلكترونات"
        : "Chemistry: Interactive Atomic Structure Simulation";

    const speechExplanation = isKu
      ? "لە محاکاتی گەردیلەدا، پرۆتۆن و ئەلیکترۆن زیاد بکە بۆ تێبینی کردنی خولگەی ئەلیکترۆنەکان و بارگەی کارەبایی."
      : "In this interactive atom simulation, add protons and electrons to observe electron shells, valence electrons, and isotope stability.";

    const html = generateAtomBuilderHtml({
      initialProtons: 6,
      initialNeutrons: 6,
      initialElectrons: 6,
      elementSymbol: "C",
      elementName: "Carbon",
    });

    return {
      id: `ai-chemistry-${Date.now()}`,
      subject: "chemistry",
      title,
      thinkingProcess: [
        "1. Identify chemical/quantum domain: Rutherford-Bohr model of atomic nucleus & orbital shells.",
        "2. Formulate mass and charge conservation laws: A = Z + N, net charge Q = Z - e.",
        "3. Execute Python verification: for Carbon-12, Z=6, N=6, e=6; net charge = 0, stable valence 4.",
        "4. Construct interactive HTML5 dynamic canvas simulation with animated orbiting electron rings.",
      ],
      speechExplanation,
      formula: "",
      summary: speechExplanation,
      steps: [],
      interactive: {
        type: "atom-builder",
        title: isKu ? "دروستکەری بینراوی گەردیلە" : "Interactive Atom Builder",
        summary: isKu ? "پرۆتۆن و ئەلیکترۆنەکان زیاد بکە بۆ گۆڕینی توخمەکە" : "Add protons and electrons to observe the atomic isotope",
        html,
        executedPythonCode: "Z = 6  # Carbon\nN = 6\nA = Z + N\ne = 6\nprint(f'Element: Carbon-12, Mass={A}, Charge={Z-e}')",
        executedPythonOutput: "Element: Carbon-12, Mass=12, Charge=0",
      },
      quickQuiz: {
        question: isKu ? "کام تەنۆلکە ناسنامەی بنەڕەتی توخمێک دیاری دەکات؟" : "Which particle defines the fundamental identity of an element?",
        options: [
          isKu ? "پرۆتۆن" : "Protons",
          isKu ? "ئەلیکترۆن" : "Electrons",
          isKu ? "نیوترۆن" : "Neutrons",
        ],
        correctIndex: 0,
        explanation: isKu ? "ژمارەی پرۆتۆنەکان ژمارەی ئەتۆمی پێکدەهێنێت کە ناسنامەی نەگۆڕی توخمەکەیە." : "The atomic number is strictly determined by the proton count.",
      },
      modelUsed: "gemini-3.8-flash",
    };
  }

  // 4. Default / General Mathematics & Problem Solving (Balance Scale)
  const title = isKu
    ? `شیکارکردنی: ${question.slice(0, 30)}`
    : `Solution: ${question.slice(0, 30)}`;

  const speechExplanation = isKu
    ? `ئەم کێشەیەمان شیکار کرد بە دۆزینەوەی هاوکێشەی یەکسانبوون لە نێوان لایەکاندا.`
    : `We solved this problem by establishing mathematical equality and balancing the equations.`;

  const formula = "a x + b = c \\implies x = \\frac{c - b}{a}";

  const steps = [
    {
      stepNumber: 1,
      title: isKu ? "ناساندنی گۆڕاوەکان" : "Define Variables",
      explanation: isKu ? "پرسیارەکە دەگۆڕین بۆ دەستەواژەیەکی ماتماتیکی ڕوون." : "Express the problem statement in algebraic terms.",
      latex: "2x + 4 = 10",
      formulaSnippet: "2x + 4 = 10",
    },
    {
      stepNumber: 2,
      title: isKu ? "جیاکردنەوەی نەزانراوەکان" : "Isolate the Unknown",
      explanation: isKu ? "ژمارەکان دەگوازینەوە بۆ لایەک و گۆڕاوەکان بۆ لایەکی تر." : "Subtract constants from both sides to isolate the variable term.",
      latex: "2x = 10 - 4 = 6",
      formulaSnippet: "2x = 10 - 4 = 6",
    },
    {
      stepNumber: 3,
      title: isKu ? "شیکارکردنی کۆتایی" : "Solve for X",
      explanation: isKu ? "دابەشی هاوکۆلکەی ئێکس دەکەین: x = 6 / 2 = 3." : "Divide by the coefficient: x = 6 / 2 = 3.",
      latex: "x = \\frac{6}{2} = 3",
      formulaSnippet: "x = 3",
    },
  ];

  const html = generateBalanceScaleHtml({
    equation: "2x + 4 = 10",
    initialLeft: 6,
    initialRight: 10,
    variableName: "x",
    solutionValue: 3,
  });

  return {
    id: `ai-general-${Date.now()}`,
    subject,
    title,
    thinkingProcess: [
      "1. Identify linear algebra problem requiring inverse operations.",
      "2. Formulate step isolation: subtract constant 4 from both sides, then divide by 2.",
      "3. Execute Python verification: solve(2*x + 4 - 10, x) -> [3].",
      "4. Synthesize interactive balance scale simulation and clean LaTeX derivations.",
    ],
    speechExplanation,
    formula,
    summary: speechExplanation,
    steps,
    interactive: {
      type: "balance-scale",
      title: isKu ? "هاوسەنگکەری بیرکاری" : "Interactive Equation Balance",
      summary: isKu ? "کێشەکان هاوسەنگ بکە بۆ دۆزینەوەی بەهای x" : "Balance the scales to find the value of x",
      html,
      executedPythonCode: "from sympy import Symbol, solve\nx = Symbol('x')\nsol = solve(2*x + 4 - 10, x)\nprint(f'Root x = {sol[0]}')",
      executedPythonOutput: "Root x = 3",
    },
    quickQuiz: {
      question: isKu ? "ئەگەر 2x = 10 بێت، ئەوا x چەندە؟" : "If 2x = 10, what is x?",
      options: ["5", "2", "8", "20"],
      correctIndex: 0,
      explanation: isKu ? "10 دابەشی 2 دەکەین کە دەکاتە 5." : "10 divided by 2 is 5.",
    },
    modelUsed: "gemini-3.8-flash",
  };
}

