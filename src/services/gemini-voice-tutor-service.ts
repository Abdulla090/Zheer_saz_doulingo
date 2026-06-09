import {
  GEMINI_SPEECH_MODEL,
  getGeminiApiKey,
  isGeminiConfigured,
} from "../constants/gemini";
import { useSettingsStore } from "../stores/useSettingsStore";

export type TutorPhase = "intro_ku" | "english";

export type TutorMessage = {
  role: "user" | "tutor";
  text: string;
  lang?: "ku" | "en";
  teachNote?: string;
  wordHighlight?: string;
};

export type TutorTurnInput = {
  phase: TutorPhase;
  history: TutorMessage[];
  userText?: string;
  audioBase64?: string;
  mimeType?: string;
  userReadySignal?: boolean;
  sessionStart?: boolean;
};

export type TutorTurnResponse = {
  phase: TutorPhase;
  userTranscript?: string;
  reply: string;
  replyLang: "ku" | "en";
  teachNote?: string;
  wordHighlight?: string;
  readyDetected: boolean;
};

const API_TIMEOUT_MS = 28_000;

function getLanguageName(code: string): string {
  if (code === "ar") return "Arabic";
  if (code === "en") return "English";
  return "Kurdish Sorani";
}

function buildTutorSystem(nativeLang: string, targetLang: string): string {
  const nativeName = getLanguageName(nativeLang);
  const targetName = getLanguageName(targetLang);

  return [
    `You are Phingo — a warm, natural, world-class ${targetName} conversation tutor for ${nativeName} speakers.`,
    "Your tone is calm, friendly, encouraging, and modern — like a trusted friend who happens to be fluent.",
    "Never sound robotic, never over-explain, never repeat yourself unnecessarily.",
    "",
    "=== PHASE: intro_ku ===",
    `Speak ONLY in ${nativeName}. Keep it warm and brief (2–3 sentences max).`,
    `Introduce yourself naturally, say you'll practice real ${targetName} together, and ask if they're ready.`,
    "Wait for a clear readiness signal before switching phases.",
    "",
    "=== PHASE: english ===",
    `Conduct a natural back-and-forth ${targetName} conversation at A2–B1 level.`,
    "Each turn: (1) respond naturally to what the learner said, (2) offer gentle correction if needed with a natural restatement — never lecture, (3) introduce ONE new useful word or phrase organically in context.",
    "Keep replies concise (2–4 sentences). Vary your topics — daily life, travel, food, emotions, work, culture.",
    "After 3–4 successful exchanges on a topic, smoothly transition to a new topic.",
    "Sound human: use contractions, casual phrasing, short affirmations like 'Exactly!', 'Nice!', 'Love that!'",
    `teachNote: 1 short ${nativeName} sentence explaining the key ${targetName} thing you just modeled.`,
    `wordHighlight: the single most important ${targetName} word or phrase from this turn (max 3 words).`,
    "",
    "=== READY SIGNALS ===",
    "Accepted: ready, yes, ok, sure, let's go, start, ئامادەم, بەڵێ, دەست پێ بکە, or userReadySignal=true.",
    `On detection: set readyDetected=true, phase=english, give a warm 1-sentence welcome + first ${targetName} prompt.`,
    "",
    "=== AUDIO TRANSCRIPTION ===",
    "If audio is attached, transcribe carefully. If speech is unclear, make your best guess and continue naturally.",
    "Set userTranscript to the transcribed text.",
    "",
    "=== OUTPUT FORMAT ===",
    "Reply ONLY with a single valid JSON object. No markdown, no code fences, no extra text before or after.",
    '{"phase":"intro_ku"|"english","reply":"...","replyLang":"ku"|"en","teachNote":"optional string","wordHighlight":"optional string","readyDetected":false,"userTranscript":"optional string"}',
  ].join("\n");
}

type GeminiGenerateResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
};

function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

function parseTutorPayload(text: string): TutorTurnResponse {
  const jsonText = extractJsonObject(text);
  if (jsonText) {
    try {
      const parsed = JSON.parse(jsonText) as Partial<TutorTurnResponse>;
      const phase = parsed.phase === "english" ? "english" : "intro_ku";
      const reply = typeof parsed.reply === "string" ? parsed.reply.trim() : "";
      if (reply) {
        return {
          phase,
          reply,
          replyLang: parsed.replyLang === "en" ? "en" : "ku",
          teachNote:
            typeof parsed.teachNote === "string" ? parsed.teachNote.trim() : undefined,
          wordHighlight:
            typeof parsed.wordHighlight === "string"
              ? parsed.wordHighlight.trim()
              : undefined,
          readyDetected: Boolean(parsed.readyDetected),
          userTranscript:
            typeof parsed.userTranscript === "string"
              ? parsed.userTranscript.trim()
              : undefined,
        };
      }
    } catch {
      /* fall through */
    }
  }

  const fallback = text.trim();
  return {
    phase: "intro_ku",
    reply: fallback || "…",
    replyLang: "ku",
    readyDetected: false,
  };
}

function normalizeMimeType(mimeType: string): string {
  const base = mimeType.split(";")[0]?.trim().toLowerCase() || "audio/webm";
  if (base === "audio/x-m4a") return "audio/mp4";
  if (base.startsWith("audio/")) return base;
  return "audio/webm";
}

function buildUserPrompt(input: TutorTurnInput): string {
  if (input.sessionStart) {
    return "Session start. Greet the learner in Kurdish Sorani and ask if they are ready to practice English.";
  }

  const parts: string[] = [`Current phase: ${input.phase}.`];

  if (input.userReadySignal) {
    parts.push("The learner tapped the ready button. Transition to English practice now.");
  }

  if (input.userText?.trim()) {
    parts.push(`Learner said (text): "${input.userText.trim()}"`);
  }

  if (input.audioBase64) {
    parts.push(
      "Learner spoke (audio attached). Transcribe what they said, set userTranscript, then reply as tutor.",
    );
  }

  parts.push("Respond with tutor JSON only.");
  return parts.join("\n");
}

function historyToContents(history: TutorMessage[]) {
  return history.slice(-12).map((msg) => ({
    role: msg.role === "tutor" ? ("model" as const) : ("user" as const),
    parts: [{ text: msg.text }],
  }));
}

export { isGeminiConfigured };

export function mockTutorTurn(input: TutorTurnInput): TutorTurnResponse {
  if (input.sessionStart) {
    return {
      phase: "intro_ku",
      reply:
        "سڵاو! من فینگۆم، مامۆستای ئینگلیزیت. کاتێک ئامادە بوویت، پێکەوە ئینگلیزی فێر دەبین. ئامادەیت دەست پێ بکەین؟",
      replyLang: "ku",
      readyDetected: false,
    };
  }

  const ready =
    input.userReadySignal ||
    /ready|yes|start|ئاماد|بەڵێ|دەست پێ/i.test(input.userText ?? "");

  if (input.phase === "intro_ku" && ready) {
    return {
      phase: "english",
      reply: "Perfect! Let's begin. Say this with me: Hello — it means سڵاو. Your turn!",
      replyLang: "en",
      teachNote: "Hello واتە سڵاو — بەردەوام بیت!",
      wordHighlight: "Hello",
      readyDetected: true,
      userTranscript: input.userText,
    };
  }

  if (input.phase === "english") {
    const user = input.userText?.trim() || "…";
    return {
      phase: "english",
      reply: `Nice try! You said "${user}". Now let's learn: Thank you — use it when someone helps you.`,
      replyLang: "en",
      teachNote: "Thank you واتە سوپاس — زۆر بەسوودە!",
      wordHighlight: "Thank you",
      readyDetected: false,
      userTranscript: user,
    };
  }

  return {
    phase: "intro_ku",
    reply: "زۆر باش! کاتێک ئامادە بوویت، دوگمەی «ئامادەم» دابگرە یان بڵێ «ئامادەم».",
    replyLang: "ku",
    readyDetected: false,
    userTranscript: input.userText,
  };
}

export async function sendTutorTurn(
  input: TutorTurnInput,
): Promise<TutorTurnResponse> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 700));
    return mockTutorTurn(input);
  }

  const userPrompt = buildUserPrompt(input);
  const parts: { text?: string; inline_data?: { mime_type: string; data: string } }[] =
    [{ text: userPrompt }];

  if (input.audioBase64) {
    parts.push({
      inline_data: {
        mime_type: normalizeMimeType(input.mimeType ?? "audio/webm"),
        data: input.audioBase64,
      },
    });
  }

  const contents = [
    ...historyToContents(input.history),
    { role: "user" as const, parts },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_SPEECH_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: buildTutorSystem(useSettingsStore.getState().nativeLang, useSettingsStore.getState().targetLang) }] },
          contents,
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 512,
          },
        }),
        signal: controller.signal,
      },
    );

    const data = (await res.json()) as GeminiGenerateResponse;
    if (!res.ok) {
      throw new Error(data.error?.message ?? `Gemini request failed (${res.status})`);
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return parseTutorPayload(text);
  } finally {
    clearTimeout(timeout);
  }
}
