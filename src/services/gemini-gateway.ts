import { isGeminiConfigured } from "../constants/gemini";
import { supabase } from "../lib/supabase";
import type { AiFeatureKey } from "../types/entitlements";

export type GeminiGatewayBody = {
  contents: unknown[];
  generationConfig?: Record<string, unknown>;
  systemInstruction?: Record<string, unknown>;
};

export type GeminiGatewayOptions = {
  featureKey: Exclude<AiFeatureKey, `live_tutor_${number}`>;
  idempotencyKey?: string;
  timeoutMs?: number;
};

export function createAiIdempotencyKey(featureKey: AiFeatureKey): string {
  const random =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${featureKey}:${random}`.slice(0, 120);
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (/unauthorized|jwt|auth/i.test(error.message)) {
      return "Sign in to use Twino's cloud AI features.";
    }
    return error.message;
  }
  return "Twino AI is temporarily unavailable.";
}

export async function generateGeminiContent<T>(
  _model: string,
  body: GeminiGatewayBody,
  options: GeminiGatewayOptions,
): Promise<T> {
  if (!isGeminiConfigured()) {
    throw new Error("Twino AI is not configured.");
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.access_token) {
    throw new Error("Sign in to use Twino's cloud AI features.");
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error("Network timeout: Twino AI took too long.")),
      options.timeoutMs ?? 30_000,
    );
  });

  try {
    const result = await Promise.race([
      supabase.functions.invoke<T>("gemini-generate", {
        body: {
          ...body,
          featureKey: options.featureKey,
          idempotencyKey:
            options.idempotencyKey ?? createAiIdempotencyKey(options.featureKey),
        },
      }),
      timeout,
    ]);

    if (result.error) {
      const response = (result.error as { context?: Response }).context;
      if (response) {
        let backendMessage = "";
        try {
          const payload = (await response.clone().json()) as {
            message?: unknown;
            error?: unknown;
          };
          const message = payload.message ?? payload.error;
          if (typeof message === "string") backendMessage = message.trim();
        } catch {}
        if (backendMessage) throw new Error(backendMessage);
      }
      throw new Error(errorMessage(result.error));
    }
    if (!result.data) throw new Error("Twino AI returned an empty response.");
    return result.data;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
