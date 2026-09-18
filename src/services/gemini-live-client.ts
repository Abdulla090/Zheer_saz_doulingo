import {
  GEMINI_LIVE_INPUT_RATE,
  GEMINI_LIVE_MODEL,
  type GeminiLiveModel,
  isLiveExtendedThinkingModel,
  getGeminiLiveWebSocketUrl,
} from "../constants/gemini";
import { supabase } from "../lib/supabase";
import { createAiIdempotencyKey } from "./gemini-gateway";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useLocaleStore } from "../stores/useLocaleStore";
import { getLanguage } from "../config/languages";
import { LEVEL_CONFIGS } from "../data/voice-tutor-word-banks";
import { getPersonaById } from "../constants/voice-personas";

export type LiveServerMessage = Record<string, unknown>;
type GeminiLiveUsageMetadata = Record<string, unknown>;

export type LiveSessionCallbacks = {
  onOpen?: () => void;
  onSetupComplete?: () => void;
  onAudio?: (pcmBase64: string) => void;
  onText?: (text: string) => void;
  onInputTranscription?: (text: string) => void;
  onOutputTranscription?: (text: string) => void;
  onTurnComplete?: () => void;
  onInteractionStatus?: (status: "IN_PROGRESS" | "IDLE") => void;
  onInterrupted?: () => void;
  onClose?: (reason?: string) => void;
  onError?: (message: string) => void;
};

type GeminiLiveTokenResponse = {
  token?: string;
  durationMinutes?: number;
  expiresAt?: string;
  chargedCredits?: number;
  balance?: number;
  reservationId?: string;
};

export type GeminiLiveTokenGrant = {
  token: string;
  durationMinutes: 5 | 10 | 15;
  expiresAt: string;
  chargedCredits: number;
  balance: number;
  reservationId: string;
};

async function createGeminiLiveToken(
  durationMinutes: 5 | 10 | 15,
  model?: GeminiLiveModel,
): Promise<GeminiLiveTokenGrant> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.access_token) {
    throw new Error("Sign in to use the AI tutor.");
  }

  const { data, error } =
    await supabase.functions.invoke<GeminiLiveTokenResponse>(
      "gemini-live-token",
      {
        body: {
          durationMinutes,
          model: model || useSettingsStore.getState().liveTutorModel || GEMINI_LIVE_MODEL,
          idempotencyKey: createAiIdempotencyKey(`live_tutor_${durationMinutes}`),
        },
        timeout: 12_000,
      },
    );

  if (error) {
    // Extract HTTP status and backend error message from the Edge Function response
    const response = (error as { context?: Response }).context;
    const httpStatus = response?.status ?? 0;
    let backendMessage = "";

    if (response) {
      try {
        const cloned = response.clone();
        const text = await cloned.text();
        if (text) {
          try {
            const payload = JSON.parse(text) as { error?: unknown; message?: unknown };
            const msg = payload.error ?? payload.message;
            if (typeof msg === "string") backendMessage = msg;
          } catch {
            // Response body was not JSON — use raw text if short enough
            if (text.length < 200) backendMessage = text;
          }
        }
      } catch {
        // Could not read response body at all
      }
    }

    console.warn(
      `[GeminiLiveToken] Edge Function error — status=${httpStatus}, ` +
      `backend="${backendMessage}", transport="${error.message}"`,
    );

    // Map HTTP status codes to user-friendly messages
    const userMessage =
      httpStatus === 401
        ? "Sign in to use the AI tutor."
        : httpStatus === 402
          ? "Not enough AI credits. Add credits or choose a plan on the Twino website."
        : httpStatus === 429
          ? "Daily AI limit reached. Try again tomorrow."
          : httpStatus === 502 || httpStatus === 503
            ? "AI tutor service is temporarily unavailable. Please try again."
            : backendMessage || error.message || "Could not start AI tutor session.";

    throw new Error(userMessage);
  }
  if (
    !data?.token ||
    data.durationMinutes !== durationMinutes ||
    typeof data.expiresAt !== "string" ||
    typeof data.chargedCredits !== "number" ||
    typeof data.balance !== "number" ||
    typeof data.reservationId !== "string"
  ) {
    throw new Error("Could not start AI tutor session.");
  }
  return {
    token: data.token,
    durationMinutes,
    expiresAt: data.expiresAt,
    chargedCredits: data.chargedCredits,
    balance: data.balance,
    reservationId: data.reservationId,
  };
}

export function getLanguageName(code: string): string {
  const language = getLanguage(code);
  if (!language) return code || "English";
  return language.id === "ku" ? "Kurdish Sorani" : language.name;
}

export function getLiveTutorLanguages(): { sourceLangCode: string; targetLangCode: string } {
  const localeStore = useLocaleStore.getState();
  const settingsStore = useSettingsStore.getState();
  const sourceLangCode = localeStore.selectedSourceLanguage || "ku";
  const targetLangCode = settingsStore.targetLang || localeStore.selectedTargetLanguage || "en";
  return { sourceLangCode, targetLangCode };
}

const LIVE_TRANSCRIPTION_LANGUAGE_CODES: Record<string, string> = {
  ku: "ku",
  en: "en-US",
  ar: "ar",
  es: "es-419",
  ru: "ru-RU",
};

const SORANI_TRANSCRIPTION_VOCABULARY = [
  "کوردی",
  "سۆرانی",
  "کوردی سۆرانی",
  "زمانی کوردی",
  "کوردستان",
  "سلێمانی",
  "هەولێر",
  "کەرکووک",
  "دهۆک",
  "سڵاو",
  "چۆنی",
  "باشم",
  "سوپاس",
  "تکایە",
  "بەڵێ",
  "نەخێر",
  "دەست خۆش",
  "هەر بژی",
  "گیان",
  "هاوڕێ",
  "فێربوون",
  "قسەکردن",
  "ئینگلیزی",
  "ڕۆژباش",
  "ببورە",
  "دەزانم",
  "دەمەوێت",
  "فێرم بکە",
  "بە کوردی قسە بکە",
  "من کوردی قسە دەکەم",
  "تێناگەم",
  "دووبارە بکەوە",
  "هێواشتر قسە بکە",
  "دەکرێت هێواشتر قسە بکەیت",
  "واتای چییە",
  "ئەم وشەیە واتای چییە",
  "چۆن دەوترێت",
  "چی",
  "چۆن",
  "بۆچی",
  "کوێ",
  "کەی",
  "من",
  "تۆ",
  "ئێمە",
  "ئێوە",
  "ئەمە",
  "ئەوە",
  "دەکرێت",
  "دەتوانم",
  "ناتوانم",
  "فێری زمانم بکە",
  "توینۆ",
];

/**
 * Bias Live transcription toward the configured language pair. Sorani shares
 * Arabic script with several languages, so automatic detection alone can
 * produce confident but completely wrong transcripts in unrelated languages.
 */
export function buildLiveInputAudioTranscriptionConfig(
  sourceLangCode: string,
  targetLangCode: string,
): Record<string, unknown> {
  // `ku` is Gemini Live's documented Kurdish code. In Sorani sessions it must
  // be the sole ASR hint: adding English or the lesson language makes short
  // Kurdish utterances compete with unrelated Latin-script hypotheses. The
  // native-audio model still hears the raw audio and can teach/code-switch.
  const languageCodes = sourceLangCode === "ku"
    ? ["ku"]
    : Array.from(
        new Set(
          [sourceLangCode, targetLangCode]
            .map((code) => LIVE_TRANSCRIPTION_LANGUAGE_CODES[code])
            .filter((code): code is string => Boolean(code)),
        ),
      );

  return {
    ...(languageCodes.length > 0 ? { languageCodes } : {}),
    mode: "VERBATIM",
    ...(sourceLangCode === "ku"
      ? { customVocabulary: SORANI_TRANSCRIPTION_VOCABULARY }
      : {}),
  };
}

export function getLocalizedLanguageName(targetCode: string, inSourceCode: string): string {
  const dicts: Record<string, Record<string, string>> = {
    ku: {
      en: "ئینگلیزی",
      ku: "کوردی",
      ar: "عەرەبی",
      es: "ئیسپانی",
      ru: "ڕووسی",
    },
    ar: {
      en: "الإنجليزية",
      ku: "الكردية",
      ar: "العربية",
      es: "الإسبانية",
      ru: "الروسية",
    },
    es: {
      en: "inglés",
      ku: "kurdo",
      ar: "árabe",
      es: "español",
      ru: "ruso",
    },
    ru: {
      en: "английском языке",
      ku: "курдском языке",
      ar: "арабском языке",
      es: "испанском языке",
      ru: "русском языке",
    },
    en: {
      en: "English",
      ku: "Kurdish",
      ar: "Arabic",
      es: "Spanish",
      ru: "Russian",
    },
  };

  const inDict = dicts[inSourceCode];
  if (inDict && inDict[targetCode]) return inDict[targetCode];
  return getLanguageName(targetCode);
}

export function buildLiveTutorSystem(): string {
  const settings = useSettingsStore.getState();
  const level = settings.englishLevel || 5;
  const age = settings.userAge || "";
  const name = settings.userName?.trim() || "Student";
  const persona = getPersonaById(settings.voicePersonaId || settings.tutorVoice);
  const personaIdentity =
    persona.nativeName && persona.nativeName !== persona.name
      ? `${persona.name} (${persona.nativeName})`
      : persona.name;

  const { sourceLangCode, targetLangCode } = getLiveTutorLanguages();

  const sourceLangName = getLanguageName(sourceLangCode);
  const targetLangName = getLanguageName(targetLangCode);

  const currentLevel = LEVEL_CONFIGS[level] || LEVEL_CONFIGS[5];

  const parsedAge = Number.parseInt(age, 10);
  const learnerContext = Number.isFinite(parsedAge) && parsedAge < 13
    ? `The learner is ${parsedAge}; keep every topic child-safe and concrete.`
    : Number.isFinite(parsedAge) && parsedAge < 18
      ? `The learner is ${parsedAge}; use age-appropriate, natural examples.`
      : "Use practical adult everyday contexts.";

  const systemRules = [
    `You are ${personaIdentity}, Twino's perceptive live language coach for ${name}.`,
    `Voice and temperament: ${persona.personalityPrompt}`,
    `Learner context: native language ${sourceLangName}; saved learning language ${targetLangName}; level ${level}/10 (${currentLevel.cefr}). ${learnerContext}`,
    `The saved learning language is only the session default, never a permanent rule.`,
    ``,
    `INTENT OVERRIDES DEFAULTS`,
    `- Follow the learner's latest clear request. If they say "teach me Spanish", "let's practise Arabic", or name any other language, make that the active learning language immediately and keep it active until they change it again.`,
    `- Never claim that you teach English unless English is actually the active learning language. Never steer a learner back to ${targetLangName} after they explicitly chose another language.`,
    `- Do not force an onboarding script, placement interview, track menu, or fixed lesson order. Infer the goal from natural speech and start helping. Ask one short clarification only when the request is genuinely ambiguous.`,
    ``,
    `LANGUAGE CONTROL`,
    `- Understand ${sourceLangName} and the active learning language, including natural code-switching. Do not translate or relabel what the learner said unless they ask.`,
    `- Use ${sourceLangName} for brief explanations and recovery when the learner is confused. Use the active learning language for examples, practice, role-play, and immersion. Follow an explicit request to speak in a particular language.`,
    `- Once the learner chooses a response language, do not drift into another language.`,
    sourceLangCode === "ku"
      ? [
          `- The learner's native language is Central Kurdish (Sorani), BCP-47 "ku". Treat Arabic-script Kurdish speech as Sorani by default, including informal, fast, accented, and code-mixed speech. Never reinterpret it as Turkish, English, Persian, Urdu, or Arabic unless the learner clearly switches.`,
          `- Listen for Iraqi Central Kurdish phonology and meaning even when automatic transcription is imperfect. Do not trust a conflicting Turkish, English, Persian, Urdu, or Arabic transcript label over the learner's actual audio and conversation context.`,
          `- Whenever you repeat, quote, or write the learner's Kurdish, preserve it in Arabic-script Sorani using letters such as ڕ، ڵ، ۆ، ێ، ە، ڤ، گ، چ، پ، ژ. Never transliterate Sorani into Latin script and never translate it into another language unless asked.`,
          `- When speaking Kurdish, use natural Iraqi Sorani, not Kurmanji, Persian, Arabic, or literal machine translation. If uncertain what was said, ask one short clarification in Sorani instead of inventing a transcript or meaning.`,
        ].join("\n")
      : `- Interpret the learner's speech as ${sourceLangName} by default unless they clearly switch languages.`,
    ``,
    `TEACH LIKE A HUMAN`,
    `- Respond to the meaning of the learner's last turn, then add one useful teaching move: a natural recast, a precise explanation, a better phrase, or a short challenge. Do not dump all four.`,
    `- Start with a concrete example or practice turn instead of describing what you could teach. Adapt difficulty continuously from the learner's actual replies.`,
    `- Correct high-value errors without interrupting every sentence. Avoid canned praise, repeated introductions, slogans, lectures, and generic encouragement.`,
    `- Remember the active language, topic, corrections, and learner choices for the whole session. Do not restart the conversation.`,
    ``,
    `VOICE OUTPUT`,
    `- Everything is spoken aloud. Use natural spoken sentences only: no markdown, lists, headings, JSON, emoji, or stage directions.`,
    `- Usually speak for 1 to 3 sentences and ask at most one question. Leave room for the learner to talk.`,
  ];

  return systemRules.join("\n");
}

export function buildLiveTutorOpeningPrompt(): string {
  const settings = useSettingsStore.getState();
  const name = settings.userName?.trim() || "";
  const persona = getPersonaById(settings.voicePersonaId || settings.tutorVoice);
  const { sourceLangCode, targetLangCode } = getLiveTutorLanguages();
  const sourceLangName = getLanguageName(sourceLangCode);
  const targetLangName = getLanguageName(targetLangCode);
  const targetLangInSource = getLocalizedLanguageName(targetLangCode, sourceLangCode);

  const personaDisplayName =
    sourceLangCode === "ku" && persona.nativeName
      ? persona.nativeName
      : sourceLangCode === "ar" && persona.nativeName
        ? persona.nativeName
        : persona.name;

  let nativeGreetingText: string;
  if (sourceLangCode === "ku") {
    nativeGreetingText = `سڵاو ${name ? `${name} گیان` : ""}! من ${personaDisplayName}م. ئەمڕۆ دەتەوێت لە زمانی ${targetLangInSource} چی فێربیت یان چی ڕاهێنان بکەیت؟`;
  } else if (sourceLangCode === "ar") {
    nativeGreetingText = `مرحباً ${name || ""}! أنا ${personaDisplayName}. ماذا تريد أن تتعلم أو تتدرب عليه اليوم في ${targetLangInSource}؟`;
  } else if (sourceLangCode === "es") {
    nativeGreetingText = `¡Hola ${name || ""}! Soy ${personaDisplayName}. ¿Qué quieres aprender o practicar hoy en ${targetLangInSource}?`;
  } else if (sourceLangCode === "ru") {
    nativeGreetingText = `Привет, ${name || ""}! Я ${personaDisplayName}. Что ты хочешь сегодня выучить или потренировать в ${targetLangInSource}?`;
  } else {
    nativeGreetingText = `Hello ${name || ""}! I am ${personaDisplayName}. What would you like to learn or practise in ${targetLangName} today?`;
  }

  return [
    `Start the session now.`,
    `OUTPUT LANGUAGE FOR THIS TURN: ${sourceLangName}. RESPOND UNMISTAKABLY IN ${sourceLangName}.`,
    `Say this naturally, without adding a menu or placement test: "${nativeGreetingText}"`,
    `Then wait. The learner's next request may replace ${targetLangName} with another active learning language.`,
  ].join(" ");
}

function parseServerMessage(raw: string): LiveServerMessage | null {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed[0] as LiveServerMessage;
    return parsed as LiveServerMessage;
  } catch {
    return null;
  }
}

function pick<T>(obj: Record<string, unknown>, camel: string, snake: string): T | undefined {
  return (obj[camel] ?? obj[snake]) as T | undefined;
}

function extractAudioBase64Parts(msg: LiveServerMessage): string[] {
  const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
  if (!serverContent) return [];

  const modelTurn = pick<Record<string, unknown>>(
    serverContent,
    "modelTurn",
    "model_turn",
  );
  const parts = modelTurn?.parts as { inlineData?: { data?: string }; inline_data?: { data?: string } }[] | undefined;
  if (!parts?.length) return [];

  const audioParts: string[] = [];
  for (const part of parts) {
    const data = part.inlineData?.data ?? part.inline_data?.data;
    if (data) audioParts.push(data);
  }
  return audioParts;
}

function extractTextParts(msg: LiveServerMessage): string[] {
  const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
  if (!serverContent) return [];

  const modelTurn = pick<Record<string, unknown>>(
    serverContent,
    "modelTurn",
    "model_turn",
  );
  const parts = modelTurn?.parts as { text?: string }[] | undefined;
  if (!parts?.length) return [];

  const textParts: string[] = [];
  for (const part of parts) {
    if (part.text) textParts.push(part.text);
  }
  return textParts;
}

function extractTranscriptionText(
  msg: LiveServerMessage,
  field: "inputTranscription" | "outputTranscription",
): string | null {
  const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
  const snakeField = field === "inputTranscription" ? "input_transcription" : "output_transcription";
  const transcription = (serverContent?.[field] ?? serverContent?.[snakeField]) as
    | { text?: unknown }
    | undefined;
  return typeof transcription?.text === "string" ? transcription.text : null;
}

export class GeminiLiveSession {
  private ws: WebSocket | null = null;
  private callbacks: LiveSessionCallbacks = {};
  private activeModel: GeminiLiveModel = GEMINI_LIVE_MODEL;
  private setupDone = false;
  private incomingMessageChain: Promise<void> = Promise.resolve();
  private connectionId = 0;
  private expiryTimeout: ReturnType<typeof setTimeout> | null = null;
  private tokenGrant: GeminiLiveTokenGrant | null = null;
  private usageMetadata: GeminiLiveUsageMetadata | null = null;
  private sessionStartedAtMs: number | null = null;
  private usageReportTimer: ReturnType<typeof setTimeout> | null = null;
  private usageFinalized = false;
  private usageReportChain: Promise<void> = Promise.resolve();

  async connect(
    callbacks: LiveSessionCallbacks,
    durationMinutes: 5 | 10 | 15 = 5,
    model?: GeminiLiveModel,
  ): Promise<void> {
    this.callbacks = callbacks;
    this.activeModel =
      model ||
      useSettingsStore.getState().liveTutorModel ||
      GEMINI_LIVE_MODEL;
    this.setupDone = false;
    this.usageMetadata = null;
    this.sessionStartedAtMs = Date.now();
    this.usageFinalized = false;
    const connectionId = ++this.connectionId;
    this.incomingMessageChain = Promise.resolve();

    const grant = await createGeminiLiveToken(durationMinutes, this.activeModel);
    this.tokenGrant = grant;
    if (connectionId !== this.connectionId) {
      await this.reportLiveUsage("abandoned");
      return;
    }
    const url = getGeminiLiveWebSocketUrl(grant.token);

    if (this.expiryTimeout) clearTimeout(this.expiryTimeout);
    const msUntilExpiry = Math.max(
      0,
      Date.parse(grant.expiresAt) - Date.now() - 1500,
    );
    this.expiryTimeout = setTimeout(() => {
      if (connectionId !== this.connectionId) return;
      this.disconnect();
      this.callbacks.onClose?.(
        `Your ${durationMinutes}-minute Live Tutor block has ended.`,
      );
    }, msUntilExpiry);

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const ws = new WebSocket(url);
      this.ws = ws;
      const isCurrentConnection = () =>
        this.connectionId === connectionId && this.ws === ws;
      const setupTimeout = setTimeout(() => {
        if (settled || !isCurrentConnection()) return;
        settled = true;
        const message = "Gemini Live took too long to connect.";
        this.callbacks.onError?.(message);
        ws.close();
        reject(new Error(message));
      }, 15_000);

      ws.onopen = () => {
        if (!isCurrentConnection()) return;
        this.callbacks.onOpen?.();
        this.sendSetup();
      };

      const processMessage = async (eventData: unknown) => {
        if (!isCurrentConnection()) return;
        let data: string | null = null;
        if (typeof eventData === "string") {
          data = eventData;
        } else if (eventData instanceof Blob) {
          data = await eventData.text();
        } else if (eventData instanceof ArrayBuffer) {
          data = new TextDecoder().decode(eventData);
        } else if (
          eventData &&
          typeof (eventData as { text?: unknown }).text === "function"
        ) {
          data = await (eventData as { text: () => Promise<string> }).text();
        }
        if (!data) return;

        const msg = parseServerMessage(data);
        if (!msg) return;

        const usageMetadata = pick<GeminiLiveUsageMetadata>(
          msg,
          "usageMetadata",
          "usage_metadata",
        );
        if (usageMetadata) {
          this.usageMetadata = usageMetadata;
          this.scheduleUsageReport();
        }

        const err = pick<{ message?: string }>(msg, "error", "error");
        if (err?.message) {
          this.callbacks.onError?.(err.message);
          if (!settled) {
            settled = true;
            clearTimeout(setupTimeout);
            reject(new Error(err.message));
          }
          return;
        }

        if ((msg.setupComplete || msg.setup_complete) && !this.setupDone) {
          this.setupDone = true;
          this.callbacks.onSetupComplete?.();
          if (!settled) {
            settled = true;
            clearTimeout(setupTimeout);
            resolve();
          }
          return;
        }

        for (const audio of extractAudioBase64Parts(msg)) {
          this.callbacks.onAudio?.(audio);
        }

        for (const text of extractTextParts(msg)) {
          this.callbacks.onText?.(text);
        }

        const inputTranscription = extractTranscriptionText(msg, "inputTranscription");
        if (inputTranscription) {
          this.callbacks.onInputTranscription?.(inputTranscription);
        }

        const outputTranscription = extractTranscriptionText(msg, "outputTranscription");
        if (outputTranscription) {
          this.callbacks.onOutputTranscription?.(outputTranscription);
        }

        const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
        if (serverContent?.interrupted) {
          this.callbacks.onInterrupted?.();
        }
        if (serverContent?.turnComplete || serverContent?.turn_complete) {
          this.callbacks.onTurnComplete?.();
        }

        const rawStatus =
          pick<string>(msg, "interactionStatus", "interaction_status") ||
          pick<string>(serverContent || {}, "interactionStatus", "interaction_status");
        if (rawStatus === "IN_PROGRESS" || rawStatus === "IDLE") {
          this.callbacks.onInteractionStatus?.(rawStatus as "IN_PROGRESS" | "IDLE");
        }

        const goAway =
          pick<Record<string, unknown>>(msg, "goAway", "go_away") ||
          pick<Record<string, unknown>>(serverContent || {}, "goAway", "go_away");
        if (goAway) {
          this.callbacks.onClose?.("Session duration completed.");
          this.disconnect();
          return;
        }
      };

      ws.onmessage = (event) => {
        // React Native can deliver WebSocket frames as Blob objects. Reading
        // Blob.text() is async, so separate handlers can otherwise resolve out
        // of order and let turnComplete reach the hook before the final audio.
        const next = this.incomingMessageChain.then(() =>
          processMessage(event.data),
        );
        this.incomingMessageChain = next.catch((error) => {
          if (!isCurrentConnection()) return;
          const message =
            error instanceof Error ? error.message : "Live message failed.";
          this.callbacks.onError?.(message);
          if (!settled) {
            settled = true;
            clearTimeout(setupTimeout);
            reject(error instanceof Error ? error : new Error(message));
          }
        });
      };

      ws.onerror = (event) => {
        if (!isCurrentConnection()) return;
        console.error("WS ERROR:", event);
        const err = new Error("Live connection failed.");
        this.callbacks.onError?.(err.message);
        if (!settled) {
          settled = true;
          clearTimeout(setupTimeout);
          reject(err);
        }
      };

      ws.onclose = (event) => {
        if (!isCurrentConnection()) return;
        this.ws = null;
        void this.reportLiveUsage(this.setupDone ? "completed" : "abandoned");
        console.warn("WS CLOSE:", event.code, event.reason);
        this.callbacks.onClose?.(event.reason || undefined);
        if (!settled) {
          settled = true;
          clearTimeout(setupTimeout);
          reject(new Error(event.reason || "Connection closed before setup."));
        }
      };
    });
  }

  private send(raw: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(raw));
    }
  }

  private scheduleUsageReport() {
    if (this.usageReportTimer || this.usageFinalized) return;
    this.usageReportTimer = setTimeout(() => {
      this.usageReportTimer = null;
      void this.reportLiveUsage("started");
    }, 5_000);
  }

  private async reportLiveUsage(
    status: "started" | "completed" | "abandoned",
  ): Promise<void> {
    const grant = this.tokenGrant;
    if (!grant || (status !== "started" && this.usageFinalized)) return;
    if (status !== "started") this.usageFinalized = true;
    if (this.usageReportTimer) {
      clearTimeout(this.usageReportTimer);
      this.usageReportTimer = null;
    }
    const elapsedSeconds = this.sessionStartedAtMs
      ? Math.max(0, Math.min(grant.durationMinutes * 60, (Date.now() - this.sessionStartedAtMs) / 1000))
      : 0;
    const usageMetadata = this.usageMetadata;
    const sendReport = async () => {
      const { error } = await supabase.functions.invoke("gemini-live-token", {
        body: {
          action: "usage",
          reservationId: grant.reservationId,
          status,
          model: this.activeModel,
          usageMetadata,
          audioDurationSeconds: elapsedSeconds,
        },
        timeout: 10_000,
      });
      if (error) {
        console.warn("[GeminiLiveUsage] Usage report failed", {
          status,
          message: error.message,
        });
      }
    };
    const queued = this.usageReportChain.then(sendReport, sendReport);
    this.usageReportChain = queued.catch(() => undefined);
    await queued;
  }

  private sendSetup() {
    const isExtendedThinking = isLiveExtendedThinkingModel(this.activeModel);

    const state = useSettingsStore.getState();
    const persona = getPersonaById(state.voicePersonaId || state.tutorVoice);
    const resolvedVoiceName = persona.geminiVoice || state.tutorVoice || "Aoede";
    const { sourceLangCode, targetLangCode } = getLiveTutorLanguages();

    const generationConfig: Record<string, unknown> = {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: resolvedVoiceName,
          },
        },
      },
      maxOutputTokens: 320,
    };

    // Official Gemini Multimodal Live API specifications:
    // - gemini-3.8-live-extended-thinking: supports background reasoning with "low" | "medium" | "high" (defaulting to "medium")
    // - gemini-3.8-live: does NOT support thinkingLevel; thinkingConfig must be omitted entirely.
    if (isExtendedThinking) {
      generationConfig.thinkingConfig = {
        thinkingLevel: "MEDIUM",
      };
    }

    this.send({
      setup: {
        model: `models/${this.activeModel}`,
        generationConfig,
        systemInstruction: {
          parts: [{ text: buildLiveTutorSystem() }],
        },
        inputAudioTranscription: buildLiveInputAudioTranscriptionConfig(
          sourceLangCode,
          targetLangCode,
        ),
        outputAudioTranscription: {},
      },
    });
  }

  startGreeting() {
    this.sendClientText(buildLiveTutorOpeningPrompt());
  }

  sendPcmChunk(pcmBase64: string) {
    this.sendAudioChunk(pcmBase64, `audio/pcm;rate=${GEMINI_LIVE_INPUT_RATE}`);
  }

  sendAudioChunk(base64: string, mimeType: string) {
    // Use the new `realtime_input.audio` format.
    // `media_chunks` was deprecated and causes 1007 WebSocket close on newer models.
    this.send({
      realtimeInput: {
        audio: { data: base64, mimeType },
      },
    });
  }

  sendAudioStreamEnd() {
    this.send({ realtimeInput: { audioStreamEnd: true } });
  }

  sendClientAudio(base64: string, mimeType: string) {
    this.send({
      clientContent: {
        turns: [
          {
            role: "user",
            parts: [{ inlineData: { mimeType, data: base64 } }],
          },
        ],
        turnComplete: true,
      },
    });
  }

  sendClientText(text: string) {
    this.send({
      realtimeInput: {
        text,
      },
    });
  }

  getBillingGrant(): Omit<GeminiLiveTokenGrant, "token"> | null {
    if (!this.tokenGrant) return null;
    const { token: _token, ...grant } = this.tokenGrant;
    return grant;
  }

  disconnect() {
    void this.reportLiveUsage(this.setupDone ? "completed" : "abandoned");
    this.connectionId += 1;
    if (this.ws) {
      try {
        if (
          this.ws.readyState === WebSocket.OPEN ||
          this.ws.readyState === WebSocket.CONNECTING
        ) {
          this.ws.close(1000, "Client closed session");
        }
      } catch (e) {
        console.warn("Error closing live socket:", e);
      }
      this.ws = null;
    }
    this.setupDone = false;
    // Keep the grant until the async final usage report has captured it.
    this.tokenGrant = null;
    this.sessionStartedAtMs = null;
    if (this.expiryTimeout) {
      clearTimeout(this.expiryTimeout);
      this.expiryTimeout = null;
    }
  }
}
