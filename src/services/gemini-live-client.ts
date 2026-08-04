import {
  GEMINI_LIVE_INPUT_RATE,
  GEMINI_LIVE_MODEL,
  getGeminiLiveWebSocketUrl,
} from "../constants/gemini";
import { supabase } from "../lib/supabase";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useLocaleStore } from "../stores/useLocaleStore";

export type LiveSessionPhase = "intro_ku" | "english";

export type LiveServerMessage = Record<string, unknown>;

export type LiveSessionCallbacks = {
  onOpen?: () => void;
  onSetupComplete?: () => void;
  onAudio?: (pcmBase64: string) => void;
  onText?: (text: string) => void;
  onInputTranscription?: (text: string) => void;
  onOutputTranscription?: (text: string) => void;
  onTurnComplete?: () => void;
  onInterrupted?: () => void;
  onClose?: (reason?: string) => void;
  onError?: (message: string) => void;
};

type GeminiLiveTokenResponse = {
  token?: string;
};

async function createGeminiLiveToken(): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.access_token) {
    throw new Error("Sign in to use the AI tutor.");
  }

  const { data, error } =
    await supabase.functions.invoke<GeminiLiveTokenResponse>(
      "gemini-live-token",
      { body: {}, timeout: 12_000 },
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
        : httpStatus === 429
          ? "Daily AI limit reached. Try again tomorrow."
          : httpStatus === 502 || httpStatus === 503
            ? "AI tutor service is temporarily unavailable. Please try again."
            : backendMessage || error.message || "Could not start AI tutor session.";

    throw new Error(userMessage);
  }
  if (!data?.token) {
    throw new Error("Could not start AI tutor session.");
  }
  return data.token;
}

function getLanguageName(code: string): string {
  switch (code?.toLowerCase()) {
    case "ku":
      return "Kurdish Sorani";
    case "ar":
      return "Arabic";
    case "en":
      return "English";
    default:
      return "English";
  }
}

export function buildLiveTutorSystem(): string {
  const level = useSettingsStore.getState().englishLevel || 5;
  const age = useSettingsStore.getState().userAge || "";
  const name = useSettingsStore.getState().userName || "Student";
  const onboardingComplete = useSettingsStore.getState().tutorOnboardingComplete;

  const sourceLangCode = useLocaleStore.getState().selectedSourceLanguage || "ku";
  const targetLangCode = useLocaleStore.getState().selectedTargetLanguage || "en";

  const sourceLangName = getLanguageName(sourceLangCode);
  const targetLangName = getLanguageName(targetLangCode);

  const levelMapping: Record<number, { cefr: string; pace: string; vocab: string; feedback: string; desc: string }> = {
    1: { cefr: "Pre-A1", pace: "very slowly, with long pauses between words", vocab: "greetings, numbers, colors, family words", feedback: sourceLangName, desc: "Greetings, numbers, colors, family words" },
    2: { cefr: "A1", pace: "very slowly", vocab: "everyday nouns/verbs", feedback: sourceLangName, desc: "Everyday nouns/verbs" },
    3: { cefr: "A1+", pace: "slowly", vocab: "daily routine vocabulary", feedback: sourceLangName, desc: "Daily routine vocab" },
    4: { cefr: "A2", pace: "slowly", vocab: "common objects, feelings", feedback: targetLangName, desc: "Common objects, feelings" },
    5: { cefr: "A2+", pace: "moderately slowly", vocab: "shopping, travel, work basics", feedback: targetLangName, desc: "Shopping, travel, work basics" },
    6: { cefr: "B1", pace: "normal pace", vocab: "opinions, descriptions", feedback: targetLangName, desc: "Opinions, descriptions" },
    7: { cefr: "B1+", pace: "natural conversational speed", vocab: "idiomatic everyday phrases", feedback: targetLangName, desc: "Idiomatic everyday phrases" },
    8: { cefr: "B2", pace: "natural conversational speed", vocab: "abstract topics (news, work, plans)", feedback: targetLangName, desc: "Abstract topics (news, work, plans)" },
    9: { cefr: "B2+/C1", pace: "natural native speed", vocab: "professional/academic vocabulary", feedback: targetLangName, desc: "Professional/academic vocab" },
    10: { cefr: "C1/C2", pace: "fast natural native speed", vocab: "native-like range", feedback: targetLangName, desc: "Near-native conversation" },
  };

  const currentLevel = levelMapping[level] || levelMapping[5];
  
  const ageGroup = age && parseInt(age, 10) < 13 
    ? "Child (< 13 years old). Make the topics playful, engaging, and kid-friendly (games, pets, school, toys). Use highly encouraging tone."
    : "Adult. Use standard conversational topics (travel, culture, work, interests, daily life).";

  const systemRules = [
    `You are Twino — a disciplined private English tutor speaking with a ${sourceLangName}-speaking student named ${name}.`,
    `The student's age group is: ${ageGroup}`,
    `VOICE ONLY. The student uses spoken audio only. You reply with spoken audio only.`,
    `Your tone is calm, friendly, encouraging, and modern.`,
    ``,
    `STRICT RULES FOR EVERY TURN:`,
    `- Keep every turn to 1–3 short sentences (roughly 10–25 words). Never lecture.`,
    `- Ask ONE question, then STOP and wait for the student's answer. Never stack multiple questions.`,
    `- No filler phrases (e.g. 'Great question!', 'Sure, let's dive in!', 'Awesome!').`,
    `- Acknowledge briefly ('Good.', 'Nice try.', 'Almost!') and move on.`,
    `- Corrections are always short: state the fixed sentence once, no grammar essays or unsolicited lectures.`,
    `- Never break character to explain what you are doing.`,
  ];

  if (!onboardingComplete) {
    systemRules.push(
      `=== ONBOARDING FLOW ===`,
      `You are in the onboarding phase. Follow these steps exactly:`,
      `1. Greet the student with exactly one sentence in English: 'Hi! I'm your English tutor.'`,
      `2. Immediately after greeting, ask the level question in Kurdish Sorani: 'لە ١ بۆ ١٠، ئاستی ئینگلیزیت چەندە؟'`,
      `3. Wait for the student's answer. They will say a number (1-10) or natural language (e.g. 'I am beginner').`,
      `4. Once they state their level, say 'Perfect! Let's start.' in English and set your state to 'teaching'.`,
      `5. Important: Your first response must be exactly: 'Hi! I'm your English tutor. لە ١ بۆ ١٠، ئاستی ئینگلیزیت چەندە؟'`
    );
  } else {
    systemRules.push(
      `=== TEACHING LOOP (Level ${level}/10 - CEFR ${currentLevel.cefr}) ===`,
      `Student's level focuses on: ${currentLevel.desc}.`,
      `Use vocabulary and sentence complexity appropriate for level ${level} (CEFR ${currentLevel.cefr}).`,
      `Speak ${currentLevel.pace}.`,
      `Use vocabulary like: ${currentLevel.vocab}.`,
      `Give any linguistic corrections or feedback in ${currentLevel.feedback}.`,
      ``,
      `WORD-FIRST PEDAGOGY LOOP:`,
      `You will introduce words from the level's word list. Do the following for each word:`,
      `1. Ask: 'Do you know the word [word]?'`,
      `2. If the student answers 'yes': ask them to 'Use it in a sentence.'`,
      `   - When they reply, evaluate their sentence. Give brief confirmation or a one-line correction/better sentence.`,
      `3. If the student answers 'no' or is unsure: give a one-line definition and one example sentence at their level.`,
      `   - Then ask them to make their own sentence: 'Now, try to make your own sentence using [word].'`,
      `   - Correct/confirm their sentence briefly.`,
      `4. Repeat this loop. Every 3 words taught, pause the word drills and run a short, guided conversation (2-4 turns) reusing the words just practiced.`,
      `5. Do not output JSON. Reply with natural spoken lines only.`
    );
  }

  return systemRules.join("\n");
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
  private setupDone = false;
  private incomingMessageChain: Promise<void> = Promise.resolve();
  private connectionId = 0;

  async connect(callbacks: LiveSessionCallbacks): Promise<void> {
    this.callbacks = callbacks;
    this.setupDone = false;
    const connectionId = ++this.connectionId;
    this.incomingMessageChain = Promise.resolve();

    const ephemeralToken = await createGeminiLiveToken();
    if (connectionId !== this.connectionId) return;
    const url = getGeminiLiveWebSocketUrl(ephemeralToken);

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

  private sendSetup() {
    this.send({
      setup: {
        model: `models/${GEMINI_LIVE_MODEL}`,
        generationConfig: {
          responseModalities: ["AUDIO"],
          thinkingConfig: {
            thinkingLevel: "minimal",
          },
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: useSettingsStore.getState().tutorVoice || "Aoede" },
            },
          },
          maxOutputTokens: 150,
        },
        systemInstruction: {
          parts: [{ text: buildLiveTutorSystem() }],
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    });
  }

  startGreeting() {
    const onboardingComplete = useSettingsStore.getState().tutorOnboardingComplete;
    const promptText = onboardingComplete
      ? "Start this live voice tutor session now. Greet the student briefly in English, and ask if they are ready for their first word drill."
      : "Start this live voice tutor session now. Greet the student with exactly: 'Hi! I'm your English tutor. لە ١ بۆ ١٠، ئاستی ئینگلیزیت چەندە؟'";

    this.sendClientText(promptText);
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

  disconnect() {
    this.connectionId += 1;
    this.ws?.close();
    this.ws = null;
    this.setupDone = false;
  }
}
