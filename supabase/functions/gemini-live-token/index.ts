import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const DAILY_SESSION_LIMIT = 40;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

const createToken = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const userId = ctx.userClaims?.id;
  if (!userId) {
    return json({ error: "Authentication required" }, 401);
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

  try {
    const now = Date.now();
    const expireTime = new Date(now + 30 * 60 * 1000);
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
        return json(
          { error: "AI voice service unavailable" },
          upstream.status === 429 ? 429 : 502,
        );
      }

      if (typeof token.name !== "string" || !token.name) {
        return json({ error: "AI voice service unavailable" }, 502);
      }

      return json({
        token: token.name,
        expiresAt: expireTime.toISOString(),
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("Gemini Live token request failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return json({ error: "AI voice service unavailable" }, 502);
  }
});

export default {
  fetch(req: Request) {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    return createToken(req);
  },
};
