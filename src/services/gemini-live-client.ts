import {
  GEMINI_LIVE_INPUT_RATE,
  GEMINI_LIVE_MODEL,
  getGeminiLiveWebSocketUrl,
} from "../constants/gemini";

export type LiveSessionPhase = "intro_ku" | "english";

export type LiveServerMessage = Record<string, unknown>;

export type LiveSessionCallbacks = {
  onOpen?: () => void;
  onSetupComplete?: () => void;
  onAudio?: (pcmBase64: string) => void;
  onText?: (text: string) => void;
  onTurnComplete?: () => void;
  onInterrupted?: () => void;
  onClose?: (reason?: string) => void;
  onError?: (message: string) => void;
};

import { useSettingsStore } from "../stores/useSettingsStore";
import { useLocaleStore } from "../stores/useLocaleStore";

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

function buildLiveTutorSystem(): string {
  const level = useSettingsStore.getState().englishLevel || 5;
  const age = useSettingsStore.getState().userAge || "";
  const name = useSettingsStore.getState().userName || "Friend";

  const sourceLangCode = useLocaleStore.getState().selectedSourceLanguage || "ku";
  const targetLangCode = useLocaleStore.getState().selectedTargetLanguage || "en";

  const sourceLangName = getLanguageName(sourceLangCode);
  const targetLangName = getLanguageName(targetLangCode);

  const levelMapping: Record<number, { cefr: string; pace: string; vocab: string; feedback: string }> = {
    1: { cefr: "Beginner (A1)", pace: "very slowly, with long pauses between words", vocab: "very simple words, sentences max 4 words", feedback: sourceLangName },
    2: { cefr: "Beginner (A1)", pace: "very slowly", vocab: "basic A1 words, sentences max 5 words", feedback: sourceLangName },
    3: { cefr: "Elementary (A2)", pace: "slowly", vocab: "simple daily vocabulary, sentences max 6 words", feedback: sourceLangName },
    4: { cefr: "Elementary (A2)", pace: "slowly", vocab: "standard A2 vocabulary, sentences max 7 words", feedback: targetLangName },
    5: { cefr: "Intermediate (B1)", pace: "moderately slowly", vocab: "everyday intermediate B1 vocabulary, sentences max 8-10 words", feedback: targetLangName },
    6: { cefr: "Intermediate (B1)", pace: "normal pace", vocab: "B1 vocabulary, varied sentence structures", feedback: targetLangName },
    7: { cefr: "Upper-Intermediate (B2)", pace: "natural conversational speed", vocab: "rich vocabulary and expressions", feedback: targetLangName },
    8: { cefr: "Upper-Intermediate (B2)", pace: "natural conversational speed", vocab: "B2 level vocabulary, idiomatic phrases", feedback: targetLangName },
    9: { cefr: "Advanced (C1)", pace: "natural native speed", vocab: "slang, idioms, and advanced professional phrasing", feedback: targetLangName },
    10: { cefr: "Advanced / Fluent (C2)", pace: "fast natural native speed", vocab: "nuanced vocabulary, abstract themes, and professional jargon", feedback: targetLangName },
  };

  const currentLevel = levelMapping[level] || levelMapping[5];
  
  const ageGroup = age && parseInt(age, 10) < 13 
    ? "Child (< 13 years old). Make the topics playful, engaging, and kid-friendly (games, pets, school, toys). Use highly encouraging tone."
    : "Adult. Use standard conversational topics (travel, culture, work, interests, daily life).";

  let readySignals = "ready, yes, start, go";
  if (sourceLangCode === "ku") {
    readySignals += ", ئامادەم, بەڵێ, دەست پێ بکە";
  } else if (sourceLangCode === "ar") {
    readySignals += ", جاهز, نعم, ابدأ, مستعد";
  }

  return [
    `You are Twino — a live voice ${targetLangName} tutor for ${sourceLangName} speakers.`,
    `The learner's name is ${name}.`,
    `The learner's age group is: ${ageGroup}`,
    `The learner's ${targetLangName} level is: ${level}/10 which corresponds to CEFR ${currentLevel.cefr}.`,
    `VOICE ONLY. The learner uses spoken audio only. You reply with spoken audio only.`,
    `Never ask the learner to type, read text on screen, or press a ready button.`,
    `Your tone is calm, friendly, encouraging, and modern.`,
    ``,
    `Start in ${sourceLangName}: warm welcome greeting ${name}, explain you'll practice ${targetLangName} together, ask if ready.`,
    `When the learner says they are ready by voice, switch to ${targetLangName}.`,
    `When speaking ${targetLangName}, adapt strictly to their level:`,
    `- Speak ${currentLevel.pace}.`,
    `- Use ${currentLevel.vocab}.`,
    `- Give any linguistic correction/feedback in ${currentLevel.feedback}.`,
    `Teach exactly one useful word or phrase per turn. Keep spoken replies short (2–4 sentences).`,
    `Ready signals: ${readySignals}.`,
  ].join("\n");
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

export class GeminiLiveSession {
  private ws: WebSocket | null = null;
  private callbacks: LiveSessionCallbacks = {};
  private setupDone = false;

  connect(callbacks: LiveSessionCallbacks): Promise<void> {
    this.callbacks = callbacks;
    this.setupDone = false;

    const url = getGeminiLiveWebSocketUrl();
    if (!url) {
      return Promise.reject(new Error("Gemini API key is not configured."));
    }

    return new Promise((resolve, reject) => {
      let settled = false;
      const ws = new WebSocket(url);
      this.ws = ws;

      ws.onopen = () => {
        this.callbacks.onOpen?.();
        this.sendSetup();
      };

      ws.onmessage = async (event) => {
        let data: string | null = null;
        if (typeof event.data === "string") {
          data = event.data;
        } else if (event.data instanceof Blob) {
          data = await event.data.text();
        } else if (event.data instanceof ArrayBuffer) {
          data = new TextDecoder().decode(event.data);
        } else if (event.data?.text) {
          data = await event.data.text();
        }
        console.log("WS MESSAGE:", data?.substring(0, 500));
        if (!data) return;

        const msg = parseServerMessage(data);
        if (!msg) return;

        const err = pick<{ message?: string }>(msg, "error", "error");
        if (err?.message) {
          this.callbacks.onError?.(err.message);
          if (!settled) {
            settled = true;
            reject(new Error(err.message));
          }
          return;
        }

        if ((msg.setupComplete || msg.setup_complete) && !this.setupDone) {
          this.setupDone = true;
          this.callbacks.onSetupComplete?.();
          if (!settled) {
            settled = true;
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

        const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
        if (serverContent?.interrupted) {
          this.callbacks.onInterrupted?.();
        }
        if (serverContent?.turnComplete || serverContent?.turn_complete) {
          this.callbacks.onTurnComplete?.();
        }
      };

      ws.onerror = (event) => {
        console.error("WS ERROR:", event);
        const err = new Error("Live connection failed.");
        this.callbacks.onError?.(err.message);
        if (!settled) {
          settled = true;
          reject(err);
        }
      };

      ws.onclose = (event) => {
        console.warn("WS CLOSE:", event.code, event.reason);
        this.callbacks.onClose?.(event.reason || undefined);
        if (!settled) {
          settled = true;
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
    // Raw WebSocket wire format uses snake_case (see Google cookbook).
    this.send({
      setup: {
        model: `models/${GEMINI_LIVE_MODEL}`,
        generation_config: {
          response_modalities: ["AUDIO"],
          speech_config: {
            voice_config: {
              prebuilt_voice_config: { voice_name: "Kore" },
            },
          },
        },
        system_instruction: {
          parts: [{ text: buildLiveTutorSystem() }],
        },
      },
    });
  }

  startGreeting() {
    this.send({
      client_content: {
        turns: [
          {
            role: "user",
            parts: [{ text: "Start this live voice tutor session now. Greet the learner in Kurdish Sorani by voice and ask them to say when they are ready. Speak only." }],
          },
        ],
        turn_complete: true,
      },
    });
  }

  sendPcmChunk(pcmBase64: string) {
    this.sendAudioChunk(pcmBase64, `audio/pcm;rate=${GEMINI_LIVE_INPUT_RATE}`);
  }

  sendAudioChunk(base64: string, mimeType: string) {
    // Use the new `realtime_input.audio` format.
    // `media_chunks` was deprecated and causes 1007 WebSocket close on newer models.
    this.send({
      realtime_input: {
        audio: { data: base64, mime_type: mimeType },
      },
    });
  }

  sendAudioStreamEnd() {
    this.send({ client_content: { turn_complete: true } });
  }

  sendClientAudio(base64: string, mimeType: string) {
    this.send({
      client_content: {
        turns: [
          {
            role: "user",
            parts: [{ inline_data: { mime_type: mimeType, data: base64 } }],
          },
        ],
        turn_complete: true,
      },
    });
  }

  sendClientText(text: string) {
    this.send({
      client_content: {
        turns: [
          {
            role: "user",
            parts: [{ text }],
          },
        ],
        turn_complete: true,
      },
    });
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.setupDone = false;
  }
}
