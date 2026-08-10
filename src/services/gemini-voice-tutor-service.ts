import {
  GEMINI_SPEECH_MODEL,
  isGeminiConfigured,
} from "../constants/gemini";
import { generateGeminiContent } from "./gemini-gateway";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useLocaleStore } from "../stores/useLocaleStore";

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
  if (code === "es") return "Spanish";
  if (code === "ru") return "Russian";
  if (code === "en") return "English";
  if (code === "ku") return "Kurdish";
  return code;
}

function buildTutorSystem(
  nativeLang: string,
  targetLang: string,
  userAge: string,
  englishLevel: number
): string {
  const nativeName = getLanguageName(nativeLang);
  const targetName = getLanguageName(targetLang);
  const onboardingComplete = useSettingsStore.getState().tutorOnboardingComplete;

  const levelMapping: Record<number, { cefr: string; pace: string; vocab: string; feedback: string; desc: string }> = {
    1: { cefr: "Pre-A1", pace: "very slowly, with long pauses between words", vocab: "greetings, numbers, colors, family words", feedback: nativeName, desc: "Greetings, numbers, colors, family words" },
    2: { cefr: "A1", pace: "very slowly", vocab: "everyday nouns/verbs", feedback: nativeName, desc: "Everyday nouns/verbs" },
    3: { cefr: "A1+", pace: "slowly", vocab: "daily routine vocabulary", feedback: nativeName, desc: "Daily routine vocab" },
    4: { cefr: "A2", pace: "slowly", vocab: "common objects, feelings", feedback: targetName, desc: "Common objects, feelings" },
    5: { cefr: "A2+", pace: "moderately slowly", vocab: "shopping, travel, work basics", feedback: targetName, desc: "Shopping, travel, work basics" },
    6: { cefr: "B1", pace: "normal pace", vocab: "opinions, descriptions", feedback: targetName, desc: "Opinions, descriptions" },
    7: { cefr: "B1+", pace: "natural conversational speed", vocab: "idiomatic everyday phrases", feedback: targetName, desc: "Idiomatic everyday phrases" },
    8: { cefr: "B2", pace: "natural conversational speed", vocab: "abstract topics (news, work, plans)", feedback: targetName, desc: "Abstract topics (news, work, plans)" },
    9: { cefr: "B2+/C1", pace: "natural native speed", vocab: "professional/academic vocabulary", feedback: targetName, desc: "Professional/academic vocab" },
    10: { cefr: "C1/C2", pace: "fast natural native speed", vocab: "native-like range", feedback: targetName, desc: "Near-native conversation" },
  };

  const currentLevel = levelMapping[englishLevel] || levelMapping[5];
  
  const ageGroup = userAge && parseInt(userAge, 10) < 13 
    ? "Child (< 13 years old). Make the topics playful, engaging, and kid-friendly (games, pets, school, toys). Use highly encouraging tone."
    : "Adult. Use standard conversational topics (travel, culture, work, interests, daily life).";

  const systemRules = [
    `You are Twino — a disciplined private English tutor speaking with a ${nativeName}-speaking student.`,
    `The learner's age group is: ${ageGroup}`,
    `Your tone is calm, friendly, encouraging, and modern.`,
    `Never sound robotic, never over-explain, never repeat yourself unnecessarily.`,
    ``,
    `STRICT RULES FOR EVERY TURN:`,
    `- Keep every turn to 1–3 short sentences. Never lecture.`,
    `- Ask ONE question, then STOP and wait for the student's answer. Never stack questions.`,
    `- No filler phrases. Acknowledge briefly ("Good.", "Nice try.", "Almost!") and move on.`,
    `- Corrections are always short: state the fixed sentence once, no grammar essays.`,
    `- Never break character to explain what you are doing.`,
  ];

  if (!onboardingComplete) {
    systemRules.push(
      `=== PHASE: intro_ku ===`,
      `You are in the onboarding phase. Greet the student with exactly one sentence in English: 'Hi! I'm your English tutor.'`,
      `Immediately after greeting, ask the level question in Kurdish Sorani: 'لە ١ بۆ ١٠، ئاستی ئینگلیزیت چەندە؟'`,
      `Wait for a clear readiness/number response.`,
      `Output ONLY valid JSON matching the format below.`
    );
  } else {
    systemRules.push(
      `=== PHASE: english ===`,
      `Conduct English practice adapted to CEFR ${currentLevel.cefr}.`,
      `- Speak ${currentLevel.pace}.`,
      `- Use ${currentLevel.vocab}.`,
      `- Offer gentle corrections in ${currentLevel.feedback}.`,
      ``,
      `WORD-FIRST PEDAGOGY LOOP:`,
      `Introduce words from the level's word list:`,
      `1. Ask: 'Do you know the word [word]?'`,
      `2. If yes: ask them to 'Use it in a sentence.'`,
      `3. If no: give a one-line definition and one example, then ask them to make their own sentence.`,
      `Every 3 words, run a short 2-4 line conversation using the recent words.`,
      `teachNote: 1 short ${nativeName} sentence explaining the key grammar/vocab thing you just modeled.`,
      `wordHighlight: the single most important English word or phrase from this turn (max 3 words).`
    );
  }

  systemRules.push(
    ``,
    `=== OUTPUT FORMAT ===`,
    `Reply ONLY with a single valid JSON object. No markdown, no code fences, no extra text.`,
    '{"phase":"intro_ku"|"english","reply":"...","replyLang":"ku"|"en","teachNote":"optional string","wordHighlight":"optional string","readyDetected":false,"userTranscript":"optional string"}'
  );

  return systemRules.join("\n");
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

export async function sendTutorTurn(
  input: TutorTurnInput,
): Promise<TutorTurnResponse> {
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

  const data = await generateGeminiContent<GeminiGenerateResponse>(
    GEMINI_SPEECH_MODEL,
    {
      systemInstruction: {
        parts: [
          {
            text: buildTutorSystem(
              useLocaleStore.getState().selectedSourceLanguage,
              useLocaleStore.getState().selectedTargetLanguage,
              useSettingsStore.getState().userAge,
              useSettingsStore.getState().englishLevel || 5,
            ),
          },
        ],
      },
      contents,
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 200,
      },
    },
    {
      featureKey: input.audioBase64
        ? "roleplay_voice_response"
        : "roleplay_text_response",
      timeoutMs: API_TIMEOUT_MS,
    },
  );

  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? "";

  if (!text) throw new Error("Gemini returned an empty response.");
  return parseTutorPayload(text);
}
