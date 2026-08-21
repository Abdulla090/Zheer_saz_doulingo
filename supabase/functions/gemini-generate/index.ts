import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import {
  aiBillingErrorResponse,
  aiBillingResponse,
  reserveAiCredits,
  reverseAiCredits,
  settleAiCredits,
  type AiCharge,
  type MeteredAiFeatureKey,
} from "../_shared/ai-billing.ts";
import {
  finalizeAiUsage,
  startAiUsage,
  type GeminiUsageMetadata,
} from "../_shared/ai-usage.ts";

const MAX_REQUEST_BYTES = 8_500_000;
const MAX_TEXT_CHARS = 12_000;
const DAILY_REQUEST_LIMIT = 120;
const FEATURE_MODELS: Record<Exclude<MeteredAiFeatureKey, `live_tutor_${number}` | "dynamic_tts_minute">, string> = {
  ai_teacher_writing: "gemini-3.6-flash",
  ai_teacher_speaking: "gemini-3.6-flash",
  reading_pronunciation_evaluation: "gemini-3.6-flash",
  reading_passage_generation: "gemini-3.5-flash-lite",
  roleplay_text_response: "gemini-3.5-flash-lite",
  roleplay_voice_response: "gemini-3.5-flash-lite",
};
const ALLOWED_FEATURES = new Set<MeteredAiFeatureKey>([
  "ai_teacher_writing",
  "ai_teacher_speaking",
  "reading_passage_generation",
  "reading_pronunciation_evaluation",
  "roleplay_text_response",
  "roleplay_voice_response",
]);
const FEATURE_MAX_OUTPUT_TOKENS: Record<string, number> = {
  ai_teacher_writing: 768,
  ai_teacher_speaking: 768,
  reading_pronunciation_evaluation: 768,
  reading_passage_generation: 1_024,
  roleplay_text_response: 512,
  roleplay_voice_response: 512,
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-region, prefer",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
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

  const featureKey =
    typeof input.featureKey === "string" &&
    ALLOWED_FEATURES.has(input.featureKey as MeteredAiFeatureKey)
      ? (input.featureKey as MeteredAiFeatureKey)
      : null;
  const idempotencyKey =
    typeof input.idempotencyKey === "string" ? input.idempotencyKey.trim() : "";
  if (!featureKey || idempotencyKey.length < 8 || idempotencyKey.length > 120) {
    return json(
      { code: "INVALID_AI_ACTION", error: "Choose a valid metered AI action." },
      400,
    );
  }
  const model = FEATURE_MODELS[
    featureKey as keyof typeof FEATURE_MODELS
  ];
  if (!model) return json({ error: "AI feature not available" }, 400);

  const userId = ctx.userClaims?.id;
  if (!userId) return json({ error: "Authentication required" }, 401);

  let contents;
  try {
    contents = sanitizeContents(input.contents);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Invalid request" }, 400);
  }

  const containsAudio = contents.some((content) =>
    content.parts.some((part) => "inline_data" in part)
  );
  const contentTextChars = contents.reduce(
    (total, content) => total + content.parts.reduce(
      (partTotal, part) => partTotal + ("text" in part ? part.text.length : 0),
      0,
    ),
    0,
  );
  const requiresAudio = featureKey === "reading_pronunciation_evaluation";
  const forbidsAudio =
    featureKey === "ai_teacher_writing" ||
    featureKey === "reading_passage_generation" ||
    featureKey === "roleplay_text_response" ||
    featureKey === "roleplay_voice_response";
  if ((requiresAudio && !containsAudio) || (forbidsAudio && containsAudio)) {
    return json(
      {
        code: "INVALID_AI_PAYLOAD",
        error: requiresAudio
          ? "This AI action requires one audio recording."
          : "This AI action does not accept audio.",
      },
      400,
    );
  }

  const systemInstruction = input.systemInstruction &&
      typeof input.systemInstruction === "object"
    ? input.systemInstruction
    : null;
  const serializedSystemInstruction = systemInstruction
    ? JSON.stringify(systemInstruction)
    : "";
  if (contentTextChars + serializedSystemInstruction.length > MAX_TEXT_CHARS) {
    return json(
      { code: "AI_TEXT_TOO_LARGE", error: "This AI request is too long." },
      413,
    );
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

  let reservation: AiCharge;
  try {
    reservation = await reserveAiCredits(ctx.supabaseAdmin, {
      userId,
      featureKey,
      idempotencyKey,
    });
  } catch (error) {
    const failure = aiBillingErrorResponse(error);
    return json(failure.body, failure.status);
  }

  try {
    await startAiUsage(ctx.supabaseAdmin, {
      reservationId: reservation.reservationId,
      userId,
      feature: featureKey,
      model,
      creditsCharged: reservation.chargedAmount,
      metadata: { usageSource: "gemini_generate_content" },
    });
  } catch (usageError) {
    console.error("AI usage ledger start failed", {
      name: usageError instanceof Error ? usageError.name : "UnknownError",
    });
    await reverseAiCredits(
      ctx.supabaseAdmin,
      userId,
      reservation.reservationId,
      "usage_ledger_unavailable",
    ).catch(() => null);
    return json(
      { code: "AI_USAGE_LEDGER_UNAVAILABLE", error: "AI service unavailable" },
      503,
    );
  }

  const isTts = false;
  const generationConfig = sanitizeGenerationConfig(input.generationConfig, isTts) ?? {};
  generationConfig.maxOutputTokens = Math.min(
    typeof generationConfig.maxOutputTokens === "number"
      ? generationConfig.maxOutputTokens
      : FEATURE_MAX_OUTPUT_TOKENS[featureKey],
    FEATURE_MAX_OUTPUT_TOKENS[featureKey],
  );
  const body: Record<string, unknown> = { contents, generationConfig };

  if (!isTts && systemInstruction) {
    body.systemInstruction = systemInstruction;
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
      let reversed: AiCharge | null = null;
      try {
        reversed = await reverseAiCredits(
          ctx.supabaseAdmin,
          userId,
          reservation.reservationId,
          `gemini_http_${upstream.status}`,
        );
      } catch (billingError) {
        console.error("AI credit reversal failed", {
          name: billingError instanceof Error ? billingError.name : "UnknownError",
        });
      }
      const upstreamError = payload.error as { message?: unknown } | undefined;
      await finalizeAiUsage(ctx.supabaseAdmin, {
        reservationId: reservation.reservationId,
        userId,
        feature: featureKey,
        model,
        creditsCharged: 0,
        status: "failed",
        usage: payload.usageMetadata as GeminiUsageMetadata | undefined,
        metadata: { providerHttpStatus: upstream.status },
      }).catch((usageError) => {
        console.error("AI usage ledger finalize failed", {
          name: usageError instanceof Error ? usageError.name : "UnknownError",
        });
      });
      const status = upstream.status === 429 ? 429 : upstream.status === 503 ? 503 : 502;
      return json(
        {
          code: "AI_PROVIDER_FAILED",
          error: typeof upstreamError?.message === "string" ? upstreamError.message : "AI request failed",
          billing: reversed ? aiBillingResponse(reversed) : aiBillingResponse(reservation),
        },
        status,
      );
    }

    let settled: AiCharge;
    try {
      settled = await settleAiCredits(
        ctx.supabaseAdmin,
        userId,
        reservation.reservationId,
      );
    } catch (settlementError) {
      // The provider already succeeded, so do not refund. Keeping the
      // reservation open prevents the same request from being run for free.
      console.error("AI credit settlement failed", {
        name: settlementError instanceof Error ? settlementError.name : "UnknownError",
      });
      await finalizeAiUsage(ctx.supabaseAdmin, {
        reservationId: reservation.reservationId,
        userId,
        feature: featureKey,
        model,
        creditsCharged: reservation.chargedAmount,
        status: "billing_pending",
        usage: payload.usageMetadata as GeminiUsageMetadata | undefined,
      }).catch(() => null);
      return json(
        {
          code: "AI_SETTLEMENT_PENDING",
          error: "Your AI result was created, but billing confirmation is pending.",
          billing: aiBillingResponse(reservation),
        },
        503,
      );
    }
    await finalizeAiUsage(ctx.supabaseAdmin, {
      reservationId: reservation.reservationId,
      userId,
      feature: featureKey,
      model,
      creditsCharged: settled.chargedAmount,
      status: "completed",
      usage: payload.usageMetadata as GeminiUsageMetadata | undefined,
    }).catch((usageError) => {
      console.error("AI usage ledger finalize failed", {
        name: usageError instanceof Error ? usageError.name : "UnknownError",
      });
    });
    const billing = aiBillingResponse(settled);
    return json({ ...payload, modelUsed: model, ...billing, billing });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    let reversed: AiCharge | null = null;
    try {
      reversed = await reverseAiCredits(
        ctx.supabaseAdmin,
        userId,
        reservation.reservationId,
        timedOut ? "gemini_timeout" : "gemini_network_failure",
      );
    } catch (billingError) {
      console.error("AI credit reversal failed", {
        name: billingError instanceof Error ? billingError.name : "UnknownError",
      });
    }
    await finalizeAiUsage(ctx.supabaseAdmin, {
      reservationId: reservation.reservationId,
      userId,
      feature: featureKey,
      model,
      creditsCharged: 0,
      status: "failed",
      metadata: { failure: timedOut ? "timeout" : "network" },
    }).catch(() => null);
    return json(
      {
        code: timedOut ? "AI_TIMEOUT" : "AI_PROVIDER_UNAVAILABLE",
        error: timedOut ? "AI request timed out" : "AI service unavailable",
        billing: reversed ? aiBillingResponse(reversed) : aiBillingResponse(reservation),
      },
      503,
    );
  } finally {
    clearTimeout(timeout);
  }
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const res = await generate(req);
    const newHeaders = new Headers(res.headers);
    Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } catch (err) {
    return Response.json(
      { code: "SERVER_ERROR", message: err instanceof Error ? err.message : String(err) },
      { status: 500, headers: corsHeaders },
    );
  }
});
