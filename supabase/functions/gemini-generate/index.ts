import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const MAX_REQUEST_BYTES = 8_500_000;
const DAILY_REQUEST_LIMIT = 120;
const ALLOWED_MODELS = new Set([
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.1-flash-tts-preview",
]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store",
    },
  });

type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

function sanitizeContents(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    throw new Error("Invalid contents");
  }

  let audioParts = 0;
  return value.map((entry) => {
    if (!entry || typeof entry !== "object") throw new Error("Invalid content entry");
    const content = entry as Record<string, unknown>;
    const rawParts = content.parts;
    if (!Array.isArray(rawParts) || rawParts.length === 0 || rawParts.length > 12) {
      throw new Error("Invalid content parts");
    }

    const parts: GeminiPart[] = rawParts.map((rawPart) => {
      if (!rawPart || typeof rawPart !== "object") throw new Error("Invalid part");
      const part = rawPart as Record<string, unknown>;

      if (typeof part.text === "string") {
        if (!part.text.trim() || part.text.length > 8_000) throw new Error("Invalid text part");
        return { text: part.text };
      }

      const inline = part.inline_data;
      if (!inline || typeof inline !== "object") throw new Error("Unsupported part");
      const data = (inline as Record<string, unknown>).data;
      const mimeType = (inline as Record<string, unknown>).mime_type;
      if (
        typeof data !== "string" ||
        typeof mimeType !== "string" ||
        !mimeType.startsWith("audio/") ||
        !/^[A-Za-z0-9+/=]+$/.test(data)
      ) {
        throw new Error("Invalid audio part");
      }
      audioParts += 1;
      if (audioParts > 1) throw new Error("Only one audio part is allowed");
      return { inline_data: { mime_type: mimeType.slice(0, 64), data } };
    });

    const role = content.role === "model" ? "model" : "user";
    return { role, parts };
  });
}

function sanitizeGenerationConfig(value: unknown, isTts: boolean) {
  if (!value || typeof value !== "object") return undefined;
  const input = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};

  if (typeof input.temperature === "number" && Number.isFinite(input.temperature)) {
    output.temperature = Math.max(0, Math.min(1, input.temperature));
  }
  if (typeof input.maxOutputTokens === "number" && Number.isFinite(input.maxOutputTokens)) {
    output.maxOutputTokens = Math.max(1, Math.min(4_096, Math.floor(input.maxOutputTokens)));
  }

  if (isTts) {
    output.responseModalities = ["AUDIO"];
    const speechConfig = input.speechConfig as
      | { voiceConfig?: { prebuiltVoiceConfig?: { voiceName?: unknown } } }
      | undefined;
    const voiceName = speechConfig?.voiceConfig?.prebuiltVoiceConfig?.voiceName;
    if (typeof voiceName === "string" && /^[A-Za-z]{2,32}$/.test(voiceName)) {
      output.speechConfig = {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
      };
    }
  }

  return output;
}

const generate = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > MAX_REQUEST_BYTES) return json({ error: "Request too large" }, 413);

  const raw = await req.text();
  if (!raw || raw.length > MAX_REQUEST_BYTES) return json({ error: "Invalid request size" }, 413);

  let input: Record<string, unknown>;
  try {
    input = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const model = typeof input.model === "string" ? input.model : "";
  if (!ALLOWED_MODELS.has(model)) return json({ error: "Model not allowed" }, 400);

  const userId = ctx.userClaims?.id;
  if (!userId) return json({ error: "Authentication required" }, 401);

  let contents;
  try {
    contents = sanitizeContents(input.contents);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Invalid request" }, 400);
  }

  const { data: quotaAllowed, error: quotaError } = await ctx.supabaseAdmin.rpc(
    "consume_ai_quota" as never,
    { p_user_id: userId, p_daily_limit: DAILY_REQUEST_LIMIT } as never,
  );
  if (quotaError) {
    console.error("AI quota check failed", { code: quotaError.code });
    return json({ error: "AI service unavailable" }, 503);
  }
  if (!quotaAllowed) return json({ error: "Daily AI limit reached" }, 429);

  const apiKey = Deno.env.get("GEMINI_API_KEY")?.trim();
  if (!apiKey) return json({ error: "AI service unavailable" }, 503);

  const isTts = model === "gemini-3.1-flash-tts-preview";
  const body: Record<string, unknown> = {
    contents,
    generationConfig: sanitizeGenerationConfig(input.generationConfig, isTts),
  };

  if (!isTts && input.systemInstruction && typeof input.systemInstruction === "object") {
    const serialized = JSON.stringify(input.systemInstruction);
    if (serialized.length <= 20_000) body.systemInstruction = input.systemInstruction;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 50_000);

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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
    const payload = (await upstream.json()) as Record<string, unknown>;
    if (!upstream.ok) {
      const upstreamError = payload.error as { message?: unknown } | undefined;
      const status = upstream.status === 429 ? 429 : upstream.status === 503 ? 503 : 502;
      return json(
        { error: typeof upstreamError?.message === "string" ? upstreamError.message : "AI request failed" },
        status,
      );
    }
    return json(payload);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return json({ error: timedOut ? "AI request timed out" : "AI service unavailable" }, 503);
  } finally {
    clearTimeout(timeout);
  }
});

export default {
  fetch(req: Request) {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    return generate(req);
  },
};
