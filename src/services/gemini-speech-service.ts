import {
  GEMINI_SPEECH_MODEL,
  getGeminiApiKey,
  isGeminiConfigured,
} from "../constants/gemini";
import { matchesTarget } from "../utils/speech-match";

export type GeminiSpeechEvaluation = {
  transcript: string;
  matches: boolean;
};

const API_TIMEOUT_MS = 20_000;

type GeminiGenerateResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
  }[];
  error?: { message?: string };
};

type GeminiGenerateBody = {
  contents: {
    role?: "user" | "model";
    parts: ({ text: string } | { inline_data: { mime_type: string; data: string } })[];
  }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
};

function extractGeminiText(data: GeminiGenerateResponse): string {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

async function requestGeminiGenerateContent(
  body: GeminiGenerateBody,
  timeoutMs = API_TIMEOUT_MS,
): Promise<GeminiGenerateResponse> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_SPEECH_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      },
    );

    const data = (await res.json()) as GeminiGenerateResponse;
    if (!res.ok) {
      throw new Error(data.error?.message ?? `Gemini request failed (${res.status})`);
    }

    return data;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Network timeout: Gemini request took too long.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

function extractJsonArray(text: string): string | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
  if (start === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

function parseEvaluationPayload(
  text: string,
  targetPhrase: string,
): GeminiSpeechEvaluation {
  const jsonText = extractJsonObject(text);
  if (jsonText) {
    try {
      const parsed = JSON.parse(jsonText) as {
        transcript?: unknown;
        matches?: unknown;
      };
      const transcript =
        typeof parsed.transcript === "string" ? parsed.transcript.trim() : "";
      if (transcript) {
        const matches =
          typeof parsed.matches === "boolean"
            ? parsed.matches
            : matchesTarget(transcript, targetPhrase);
        return { transcript, matches };
      }
    } catch {
      /* fall through */
    }
  }

  const transcript = text.trim();
  return {
    transcript,
    matches: matchesTarget(transcript, targetPhrase),
  };
}

export { isGeminiConfigured };

function normalizeGeminiMimeType(mimeType: string): string {
  const base = mimeType.split(";")[0]?.trim().toLowerCase() || "audio/webm";
  if (base === "audio/x-m4a") return "audio/mp4";
  if (base.startsWith("audio/")) return base;
  return "audio/webm";
}

export async function evaluateSpeechWithGemini(input: {
  audioBase64: string;
  mimeType: string;
  targetPhrase: string;
}): Promise<GeminiSpeechEvaluation> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.warn("[evaluateSpeechWithGemini] API key missing!");
    throw new Error("Gemini API key is not configured.");
  }
  if (!input.audioBase64) {
    console.warn("[evaluateSpeechWithGemini] audioBase64 missing!");
    throw new Error("No audio was captured.");
  }

  const mimeType = normalizeGeminiMimeType(input.mimeType);

  const prompt = [
    "You evaluate English speaking practice for language learners.",
    `The learner was asked to say: "${input.targetPhrase}"`,
    "Listen to the audio and reply with ONLY valid JSON (no markdown):",
    '{"transcript":"what they said in English","matches":true}',
    "Set matches to true when the meaning matches the target phrase, allowing minor wording or pronunciation differences.",
    "Set matches to false when unrelated or clearly wrong.",
  ].join("\n");

  const controller = new AbortController();

  const fetchPromise = fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_SPEECH_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: input.audioBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 256,
        },
      }),
      signal: controller.signal,
    },
  );

  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      console.warn("[evaluateSpeechWithGemini] Request timed out after", API_TIMEOUT_MS, "ms");
      reject(new Error("Network timeout: Gemini request took too long."));
    }, API_TIMEOUT_MS);
  });

  try {
    const res = (await Promise.race([
      fetchPromise,
      timeoutPromise,
    ])) as Response;
    clearTimeout(timeoutId!);

    console.log("[evaluateSpeechWithGemini] Response status:", res.status);
    const data = (await res.json()) as GeminiGenerateResponse;
    console.log("[evaluateSpeechWithGemini] Response JSON:", JSON.stringify(data));

    if (!res.ok) {
      throw new Error(
        data.error?.message ?? `Gemini request failed (${res.status})`,
      );
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const evaluation = parseEvaluationPayload(text, input.targetPhrase);
    console.log("[evaluateSpeechWithGemini] Parsed evaluation:", evaluation);
    return evaluation;
  } finally {
    clearTimeout(timeoutId!);
  }
}

export async function generateRolePlayResponse(
  scenarioId: string,
  userText: string,
  history: { sender: "user" | "ai"; text: string }[]
): Promise<string> {
  const scenarioDetails: Record<string, { role: string; instructions: string }> = {
    cafe: {
      role: "a polite French café barista",
      instructions: "The user is a customer ordering a coffee or croissant. Keep it light, offer pastries, and respond in character."
    },
    space: {
      role: "a strict Mars transit flight gate agent",
      instructions: "The user is a space traveler whose baggage exceeds weight limits. Demand justifications in a robotic but amusing gate agent persona."
    },
    job: {
      role: "an AI Engineering hiring manager",
      instructions: "The user is an applicant. Ask questions about optimizing small language models, quantization, or mobile AI deployment."
    },
    market: {
      role: "a persistent bazaar merchant bargaining over a high-quality rug",
      instructions: "The user is trying to bargain. Start high (500 gold coins), be dramatic, and bargain back-and-forth."
    }
  };

  const sc = scenarioDetails[scenarioId] ?? {
    role: "a conversational partner",
    instructions: "Engage in a friendly roleplay scenario."
  };

  const historyPrompt = history
    .slice(-8)
    .map((h) => `${h.sender === "user" ? "Learner" : "You (AI roleplayer)"}: ${h.text}`)
    .join("\n");

  const prompt = [
    `You are roleplaying as ${sc.role}.`,
    `Scenario Context & Instructions: ${sc.instructions}`,
    `Keep your response simple (A2-B1 English), warm, and concise (1-2 sentences).`,
    `Do not include any translations, explanations, or metadata. Reply ONLY with your in-character spoken line.`,
    `\nHistory:`,
    historyPrompt,
    `Learner: ${userText}`,
    `You (AI roleplayer):`
  ].join("\n");

  const data = await requestGeminiGenerateContent(
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 96,
      },
    },
    12_000,
  );

  const text = extractGeminiText(data);

  return text || "Of course! Let's continue.";
}

export type ParagraphSpeechEvaluation = {
  transcript: string;
  accuracyScore: number;
  wordAnalysis: { word: string; correct: boolean }[];
};

export async function evaluateParagraphSpeechWithGemini(
  audioBase64: string,
  mimeType: string,
  targetParagraphs: string[]
): Promise<ParagraphSpeechEvaluation> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  if (!audioBase64) {
    throw new Error("No audio was captured.");
  }

  const normalizedMimeType = normalizeGeminiMimeType(mimeType);
  const targetText = targetParagraphs.join(" ");

  const prompt = [
    "You evaluate English speaking practice for language learners.",
    `The learner was asked to read the following text aloud:`,
    `"${targetText}"`,
    `Listen to the audio and evaluate their pronunciation word by word.`,
    `Return ONLY a valid JSON object with the following structure:`,
    `{`,
    `  "transcript": "exactly what you heard them say",`,
    `  "accuracyScore": 85, // an integer from 0 to 100 representing overall pronunciation accuracy`,
    `  "wordAnalysis": [`,
    `    { "word": "word1 from target text", "correct": true },`,
    `    { "word": "word2 from target text", "correct": false }`,
    `  ]`,
    `}`,
    `IMPORTANT RULES:`,
    `- The "wordAnalysis" array MUST contain every single word from the target text, in the exact original order.`,
    `- Set "correct" to true if the user pronounced the word intelligibly (allow minor accent differences).`,
    `- Set "correct" to false if they skipped it, completely mispronounced it, or said the wrong word.`,
    `- Strip punctuation from the "word" field in wordAnalysis for cleaner UI mapping, but keep it in the transcript.`
  ].join("\n");

  const controller = new AbortController();
  const fetchPromise = fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_SPEECH_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: normalizedMimeType,
                  data: audioBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        },
      }),
      signal: controller.signal,
    },
  );

  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error("Network timeout: Gemini request took too long."));
    }, API_TIMEOUT_MS * 2); // Longer timeout since paragraphs are longer
  });

  try {
    const res = (await Promise.race([
      fetchPromise,
      timeoutPromise,
    ])) as Response;
    clearTimeout(timeoutId!);

    const data = (await res.json()) as GeminiGenerateResponse;
    if (!res.ok) {
      throw new Error(data.error?.message ?? `Gemini request failed (${res.status})`);
    }

    let text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const evaluation = JSON.parse(text) as ParagraphSpeechEvaluation;
    return evaluation;
  } catch (err: any) {
    console.error("[evaluateParagraphSpeechWithGemini] Error:", err);
    throw new Error(err.message || "Failed to evaluate paragraph speech.");
  } finally {
    clearTimeout(timeoutId!);
  }
}

export async function generateReadingPracticeParagraphs(
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  paragraphCount: number,
  wordCountPerParagraph: number = 80
): Promise<string[]> {
  const prompt = `You are an expert English teacher. Create a reading practice exercise for a language learner.
The difficulty is ${difficulty}.
You must generate exactly ${paragraphCount} paragraph(s).
Each paragraph MUST contain approximately ${wordCountPerParagraph} words (do not make it shorter than this, write a full, rich and engaging paragraph).
The topic should be engaging, like self-improvement, technology, nature, or a short story.
Respond with ONLY a JSON array of strings, where each string is a paragraph. Do not include markdown formatting or backticks.
Example: ["Paragraph 1 text.", "Paragraph 2 text."]`;

  try {
    const data = await requestGeminiGenerateContent(
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200,
        },
      },
      18_000,
    );

    const text = extractGeminiText(data);
    const jsonText = extractJsonArray(text) || text.trim();
    
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(String);
      }
    } catch {
      // Fallback if it fails to parse
    }

    // Manual fallback: split by double newline
    return text.split('\n\n').map(p => p.trim()).filter(Boolean);

  } catch (err) {
    console.error("[generateReadingPracticeParagraphs] Failed:", err);
    // Hardcoded fallback with richer paragraphs
    if (difficulty === "Beginner") {
      return [
        "The weather is beautiful and warm today. The yellow sun is shining and the small birds are singing in the garden. I like to walk in the quiet park with my friends. We see many colorful flowers and tall green trees. It is a wonderful day to be outside, play games, and enjoy nature together."
      ].slice(0, paragraphCount);
    }
    return [
      "Learning a new language opens up incredible opportunities for personal growth and cultural understanding. While it takes time and dedicated practice to master new vocabulary and speak fluently, the process is deeply rewarding. Conversing with native speakers is one of the most effective ways to build your everyday confidence.",
      "Consistency is the ultimate key to language mastery, so practicing for just fifteen minutes every day leads to significant progress over time. Try to surround yourself with English media, write down new expressions, and do not be afraid of making mistakes, as they are a natural part of the learning journey."
    ].slice(0, paragraphCount);
  }
}
