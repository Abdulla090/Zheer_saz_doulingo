import {
  getGeminiApiKey,
  hasDirectGeminiKey,
  isGeminiConfigured,
} from "../constants/gemini";
import { supabase } from "../lib/supabase";
import type { AiFeatureKey } from "../types/entitlements";

export type GeminiGatewayBody = {
  contents: unknown[];
  generationConfig?: Record<string, unknown>;
  systemInstruction?: Record<string, unknown>;
  tools?: unknown[];
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

async function generateViaGoogleDirect<T>(
  model: string,
  body: GeminiGatewayBody,
  apiKey: string,
  timeoutMs: number,
): Promise<T> {
  // Map outdated model identifiers to the active 2026 Google Gemini model
  let resolvedModel = model;
  if (
    resolvedModel.startsWith("gemini-3.8") ||
    resolvedModel.startsWith("gemini-3.5") ||
    resolvedModel.startsWith("gemini-2.5") ||
    resolvedModel.startsWith("gemini-2.0") ||
    resolvedModel.startsWith("gemini-1.5")
  ) {
    resolvedModel = "gemini-3.6-flash";
  }

  // Normalize contents to ensure inline_data is compatible with Google Gemini v1beta
  const sanitizedContents = Array.isArray(body.contents)
    ? body.contents.map((content: any) => {
        if (!content || typeof content !== "object") return content;
        const parts = Array.isArray(content.parts)
          ? content.parts.map((part: any) => {
              if (part?.inlineData) {
                return {
                  inline_data: {
                    mime_type: part.inlineData.mimeType || part.inlineData.mime_type,
                    data: part.inlineData.data,
                  },
                };
              }
              return part;
            })
          : [];
        return { ...content, parts };
      })
    : body.contents;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${resolvedModel}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: sanitizedContents,
          generationConfig: body.generationConfig,
          systemInstruction: body.systemInstruction,
          tools: body.tools,
        }),
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Gemini direct API error (${res.status}): ${errText}`);
    }

    const data = (await res.json()) as T;
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateGeminiContent<T>(
  model: string,
  body: GeminiGatewayBody,
  options: GeminiGatewayOptions,
): Promise<T> {
  if (!isGeminiConfigured()) {
    throw new Error("Twino AI is not configured.");
  }

  // 1. Direct Gemini API call if direct key is available
  const directKey = getGeminiApiKey();
  if (directKey) {
    try {
      return await generateViaGoogleDirect<T>(
        model,
        body,
        directKey,
        options.timeoutMs ?? 35_000,
      );
    } catch (directErr) {
      console.warn(
        "Direct Gemini call failed, attempting Supabase gateway fallback...",
        directErr,
      );
    }
  }

  // 2. Fallback to Supabase gemini-generate function
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
          model,
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
