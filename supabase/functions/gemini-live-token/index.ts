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

const DAILY_SESSION_LIMIT = 40;
const LIVE_MODEL = "gemini-3.1-flash-live-preview";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

const LIVE_FEATURES: Record<5 | 10 | 15, MeteredAiFeatureKey> = {
  5: "live_tutor_5",
  10: "live_tutor_10",
  15: "live_tutor_15",
};

const createToken = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const userId = ctx.userClaims?.id;
  if (!userId) {
    return json({ error: "Authentication required" }, 401);
  }

  let input: Record<string, unknown>;
  try {
    input = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ code: "INVALID_JSON", error: "Invalid request." }, 400);
  }

  if (input.action === "usage") {
    const reservationId =
      typeof input.reservationId === "string" ? input.reservationId.trim() : "";
    const status = input.status === "completed" || input.status === "abandoned"
      ? input.status
      : "started";
    const audioDurationSeconds = typeof input.audioDurationSeconds === "number" &&
        Number.isFinite(input.audioDurationSeconds)
      ? Math.max(0, Math.min(15 * 60, input.audioDurationSeconds))
      : 0;
    const usageMetadata = input.usageMetadata &&
        typeof input.usageMetadata === "object" &&
        !Array.isArray(input.usageMetadata)
      ? input.usageMetadata as GeminiUsageMetadata
      : undefined;

    if (!UUID_PATTERN.test(reservationId)) {
      return json({ code: "INVALID_USAGE_REPORT", error: "Invalid usage report." }, 400);
    }

    const { data: reservationData, error: reservationError } = await ctx.supabaseAdmin
      .from("ai_credit_reservations")
      .select("feature_key, amount, status")
      .eq("id", reservationId)
      .eq("user_id", userId)
      .maybeSingle();
    const reservation = reservationData as {
      feature_key: string;
      amount: number;
      status: string;
    } | null;
    if (reservationError || !reservation) {
      return json({ code: "USAGE_REPORT_NOT_FOUND", error: "Usage report was not found." }, 404);
    }
    if (!Object.values(LIVE_FEATURES).includes(reservation.feature_key as MeteredAiFeatureKey)) {
      return json({ code: "INVALID_USAGE_REPORT", error: "Invalid usage report." }, 400);
    }

    try {
      const snapshot = await finalizeAiUsage(ctx.supabaseAdmin, {
        reservationId,
        userId,
        feature: reservation.feature_key,
        model: LIVE_MODEL,
        creditsCharged: reservation.status === "reversed" ? 0 : reservation.amount,
        status,
        usage: usageMetadata,
        audioDurationSeconds,
        metadata: { source: "live_client_usage_metadata" },
      });
      return json({ recorded: true, status, usage: snapshot });
    } catch (error) {
      console.error("Gemini Live usage recording failed", {
        name: error instanceof Error ? error.name : "UnknownError",
      });
      return json({ code: "USAGE_RECORDING_UNAVAILABLE", error: "Usage recording is unavailable." }, 503);
    }
  }

  const durationMinutes =
    input.durationMinutes === 5 ||
    input.durationMinutes === 10 ||
    input.durationMinutes === 15
      ? input.durationMinutes
      : null;
  const idempotencyKey =
    typeof input.idempotencyKey === "string" ? input.idempotencyKey.trim() : "";
  if (!durationMinutes || idempotencyKey.length < 8 || idempotencyKey.length > 120) {
    return json(
      {
        code: "INVALID_LIVE_BLOCK",
        error: "Choose a 5, 10, or 15-minute Live Tutor block.",
      },
      400,
    );
  }

  const { data: quotaAllowed, error: quotaError } =
    await ctx.supabaseAdmin.rpc(
      "consume_ai_quota" as never,
      {
        p_user_id: userId,
        p_daily_limit: DAILY_SESSION_LIMIT,
      } as never,
    );

  if (quotaError) {
    console.error("Gemini Live quota check failed", {
      code: quotaError.code,
    });
    return json({ error: "AI service unavailable" }, 503);
  }
  if (!quotaAllowed) {
    return json({ error: "Daily AI limit reached" }, 429);
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY")?.trim();
  if (!apiKey) {
    return json({ error: "AI service unavailable" }, 503);
  }

  let reservation: AiCharge;
  try {
    reservation = await reserveAiCredits(ctx.supabaseAdmin, {
      userId,
      featureKey: LIVE_FEATURES[durationMinutes],
      idempotencyKey,
    });
  } catch (error) {
    const failure = aiBillingErrorResponse(error);
    return json(failure.body, failure.status);
  }

  try {
    const now = Date.now();
    const expireTime = new Date(now + durationMinutes * 60 * 1000);
    const newSessionExpireTime = new Date(now + 60 * 1000);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const upstream = await fetch(
        "https://generativelanguage.googleapis.com/v1alpha/auth_tokens",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            expireTime: expireTime.toISOString(),
            newSessionExpireTime: newSessionExpireTime.toISOString(),
            uses: 1,
          }),
          signal: controller.signal,
        },
      );
      const token = (await upstream.json()) as { name?: unknown };

      if (!upstream.ok) {
        console.error("Gemini Live token request failed", {
          status: upstream.status,
        });
        const reversed = await reverseAiCredits(
          ctx.supabaseAdmin,
          userId,
          reservation.reservationId,
          `gemini_live_http_${upstream.status}`,
        ).catch(() => null);
        return json(
          {
            code: "AI_PROVIDER_FAILED",
            error: "AI voice service unavailable",
            billing: aiBillingResponse(reversed ?? reservation),
          },
          upstream.status === 429 ? 429 : 502,
        );
      }

      if (typeof token.name !== "string" || !token.name) {
        const reversed = await reverseAiCredits(
          ctx.supabaseAdmin,
          userId,
          reservation.reservationId,
          "gemini_live_invalid_token",
        ).catch(() => null);
        return json(
          {
            code: "AI_PROVIDER_FAILED",
            error: "AI voice service unavailable",
            billing: aiBillingResponse(reversed ?? reservation),
          },
          502,
        );
      }

      try {
        await startAiUsage(ctx.supabaseAdmin, {
          reservationId: reservation.reservationId,
          userId,
          feature: LIVE_FEATURES[durationMinutes],
          model: LIVE_MODEL,
          creditsCharged: reservation.chargedAmount,
          metadata: {
            durationMinutes,
            providerUsagePending: true,
          },
        });
      } catch (usageError) {
        console.error("Gemini Live usage ledger start failed", {
          name: usageError instanceof Error ? usageError.name : "UnknownError",
        });
        const reversed = await reverseAiCredits(
          ctx.supabaseAdmin,
          userId,
          reservation.reservationId,
          "gemini_live_usage_ledger_failure",
        ).catch(() => null);
        return json(
          {
            code: "AI_USAGE_LEDGER_UNAVAILABLE",
            error: "AI voice billing is temporarily unavailable.",
            billing: aiBillingResponse(reversed ?? reservation),
          },
          503,
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
        console.error("Gemini Live credit settlement failed", {
          name:
            settlementError instanceof Error
              ? settlementError.name
              : "UnknownError",
        });
        await reverseAiCredits(
          ctx.supabaseAdmin,
          userId,
          reservation.reservationId,
          "gemini_live_settlement_failure",
        ).catch(() => null);
        await finalizeAiUsage(ctx.supabaseAdmin, {
          reservationId: reservation.reservationId,
          userId,
          feature: LIVE_FEATURES[durationMinutes],
          model: LIVE_MODEL,
          creditsCharged: 0,
          status: "failed",
          metadata: { reason: "credit_settlement_failed" },
        }).catch(() => null);
        return json(
          {
            code: "AI_BILLING_UNAVAILABLE",
            error: "AI voice billing is temporarily unavailable.",
          },
          503,
        );
      }

      return json({
        token: token.name,
        durationMinutes,
        expiresAt: expireTime.toISOString(),
        chargedCredits: settled.chargedAmount,
        ...aiBillingResponse(settled),
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("Gemini Live token request failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    const reversed = await reverseAiCredits(
      ctx.supabaseAdmin,
      userId,
      reservation.reservationId,
      "gemini_live_network_failure",
    ).catch(() => null);
    return json(
      {
        code: "AI_PROVIDER_UNAVAILABLE",
        error: "AI voice service unavailable",
        billing: aiBillingResponse(reversed ?? reservation),
      },
      502,
    );
  }
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const res = await createToken(req);
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
