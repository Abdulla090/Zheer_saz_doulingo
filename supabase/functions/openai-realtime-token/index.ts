import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const MODEL = "gpt-realtime-2.1";
const DAILY_SESSION_LIMIT = 40;
const MAX_REQUEST_BYTES = 20_000;
const ALLOWED_VOICES = new Set([
  "alloy", "ash", "ballad", "coral", "echo",
  "sage", "shimmer", "verse", "marin", "cedar",
]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, {
    status,
    headers: { ...corsHeaders, "Cache-Control": "no-store" },
  });

const createToken = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const raw = await req.text();
  if (!raw || raw.length > MAX_REQUEST_BYTES) {
    return json({ error: "Invalid request size" }, 413);
  }

  let input: Record<string, unknown>;
  try {
    input = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const userId = ctx.userClaims?.id;
  if (!userId) return json({ error: "Authentication required" }, 401);

  const instructions =
    typeof input.instructions === "string" ? input.instructions.trim() : "";
  if (!instructions || instructions.length > 16_000) {
    return json({ error: "Invalid tutor instructions" }, 400);
  }

  const requestedVoice =
    typeof input.voice === "string" ? input.voice.toLowerCase() : "marin";
  const voice = ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : "marin";

  const { data: quotaAllowed, error: quotaError } = await ctx.supabaseAdmin.rpc(
    "consume_ai_quota" as never,
    { p_user_id: userId, p_daily_limit: DAILY_SESSION_LIMIT } as never,
  );
  if (quotaError) {
    console.error("Realtime quota check failed", { code: quotaError.code });
    return json({ error: "AI service unavailable" }, 503);
  }
  if (!quotaAllowed) return json({ error: "Daily AI limit reached" }, 429);

  const apiKey = Deno.env.get("OPENAI_API_KEY")?.trim();
  if (!apiKey) return json({ error: "AI service unavailable" }, 503);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const upstream = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expires_after: { anchor: "created_at", seconds: 60 },
          session: {
            type: "realtime",
            model: MODEL,
            output_modalities: ["audio"],
            instructions,
            reasoning: { effort: "minimal" },
            max_output_tokens: 180,
            audio: {
              input: {
                format: { type: "audio/pcm", rate: 24000 },
                noise_reduction: { type: "near_field" },
                transcription: { model: "gpt-4o-mini-transcribe" },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 250,
                  silence_duration_ms: 350,
                  create_response: true,
                  interrupt_response: true,
                },
              },
              output: {
                format: { type: "audio/pcm", rate: 24000 },
                voice,
                speed: 1,
              },
            },
          },
        }),
        signal: controller.signal,
      },
    );
    const payload = await upstream.json() as Record<string, unknown>;
    if (!upstream.ok) {
      console.error("OpenAI client secret request failed", {
        status: upstream.status,
      });
      return json({ error: "AI voice service unavailable" }, upstream.status === 429 ? 429 : 502);
    }

    const value = typeof payload.value === "string" ? payload.value : "";
    if (!value) return json({ error: "AI voice service unavailable" }, 502);
    return json({ value, model: MODEL });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return json({ error: timedOut ? "AI voice service timed out" : "AI voice service unavailable" }, 503);
  } finally {
    clearTimeout(timeout);
  }
});

export default {
  fetch(req: Request) {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    return createToken(req);
  },
};
