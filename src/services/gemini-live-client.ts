import {
  GEMINI_LIVE_INPUT_RATE,
  GEMINI_LIVE_MODEL,
  getGeminiLiveWebSocketUrl,
} from "@/constants/gemini";

export type LiveSessionPhase = "intro_ku" | "english";

export type LiveServerMessage = Record<string, unknown>;

export type LiveSessionCallbacks = {
  onOpen?: () => void;
  onSetupComplete?: () => void;
  onAudio?: (pcmBase64: string) => void;
  onTurnComplete?: () => void;
  onInterrupted?: () => void;
  onClose?: (reason?: string) => void;
  onError?: (message: string) => void;
};

const TUTOR_SYSTEM = [
  "You are Phingo — a live voice English tutor for Kurdish Sorani speakers.",
  "VOICE ONLY. The learner uses spoken audio only. You reply with spoken audio only.",
  "Never ask the learner to type, read text on screen, or press a ready button.",
  "",
  "Start in Kurdish Sorani: warm welcome, explain you'll practice English together, ask if ready.",
  "When the learner says they are ready by voice, switch to simple English (A2–B1).",
  "Teach one useful word or phrase per turn. Keep spoken replies short (2–4 sentences).",
  "Ready signals: ready, yes, ئامادەم, بەڵێ, دەست پێ بکە.",
].join("\n");

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
          parts: [{ text: TUTOR_SYSTEM }],
        },
      },
    });
  }

  startGreeting() {
    this.send({
      realtime_input: {
        text:
          "Start this live voice tutor session now. Greet the learner in Kurdish Sorani by voice and ask them to say when they are ready.",
      },
    });
  }

  sendPcmChunk(pcmBase64: string) {
    this.sendAudioChunk(pcmBase64, `audio/pcm;rate=${GEMINI_LIVE_INPUT_RATE}`);
  }

  sendAudioChunk(base64: string, mimeType: string) {
    this.send({
      realtime_input: {
        media_chunks: [{ mime_type: mimeType, data: base64 }],
      },
    });
  }

  sendAudioStreamEnd() {
    this.send({ realtime_input: { audio_stream_end: true } });
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.setupDone = false;
  }
}
