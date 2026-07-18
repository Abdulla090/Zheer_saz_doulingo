import { isGeminiConfigured } from "../constants/gemini";
import { supabase } from "../lib/supabase";

export type GeminiGatewayBody = {
  contents: unknown[];
  generationConfig?: Record<string, unknown>;
  systemInstruction?: Record<string, unknown>;
};

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
  model: string,
  body: GeminiGatewayBody,
  timeoutMs = 30_000,
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
      timeoutMs,
    );
  });

  try {
    const result = await Promise.race([
      supabase.functions.invoke<T>("gemini-generate", {
        body: { model, ...body },
      }),
      timeout,
    ]);

    if (result.error) throw new Error(errorMessage(result.error));
    if (!result.data) throw new Error("Twino AI returned an empty response.");
    return result.data;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
