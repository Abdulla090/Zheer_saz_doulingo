// Request-level Gemini usage accounting. Prices are snapshots from Google's
// public paid-tier pricing on 2026-08-10 and are stored with each row so later
// margin analysis never depends on today's catalog.

// Database types are generated after migrations are applied.
// deno-lint-ignore no-explicit-any
type AdminClient = any;

type ModalityDetail = {
  modality?: unknown;
  tokenCount?: unknown;
  token_count?: unknown;
};

export type GeminiUsageMetadata = {
  promptTokenCount?: unknown;
  prompt_token_count?: unknown;
  candidatesTokenCount?: unknown;
  candidates_token_count?: unknown;
  responseTokenCount?: unknown;
  response_token_count?: unknown;
  thoughtsTokenCount?: unknown;
  thoughts_token_count?: unknown;
  totalTokenCount?: unknown;
  total_token_count?: unknown;
  promptTokensDetails?: unknown;
  prompt_tokens_details?: unknown;
  candidatesTokensDetails?: unknown;
  candidates_tokens_details?: unknown;
  responseTokensDetails?: unknown;
  response_tokens_details?: unknown;
};

type UsageSnapshot = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  audioInputTokens: number;
  audioOutputTokens: number;
  audioDurationSeconds: number;
  estimatedCostUsd: number;
  pricingSnapshot: Record<string, number | string>;
};

const MODEL_PRICING = {
  "gemini-3.5-flash-lite": {
    inputPerMillion: 0.3,
    outputPerMillion: 2.5,
  },
  "gemini-3.6-flash": {
    inputPerMillion: 1.5,
    outputPerMillion: 7.5,
  },
  "gemini-3.1-flash-tts-preview": {
    inputPerMillion: 1,
    outputPerMillion: 20,
  },
  "gemini-3.1-flash-live-preview": {
    inputTextPerMillion: 0.75,
    inputAudioPerMillion: 3,
    outputTextPerMillion: 4.5,
    outputAudioPerMillion: 12,
  },
} as const;

function safeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
}

function firstCount(...values: unknown[]): number {
  for (const value of values) {
    const count = safeCount(value);
    if (count > 0) return count;
  }
  return 0;
}

function details(value: unknown): ModalityDetail[] {
  return Array.isArray(value)
    ? value.filter((item): item is ModalityDetail => Boolean(item && typeof item === "object"))
    : [];
}

function modalityTokens(items: ModalityDetail[], modality: string): number {
  return items.reduce((total, item) => {
    const value = typeof item.modality === "string" ? item.modality.toUpperCase() : "";
    return value === modality
      ? total + firstCount(item.tokenCount, item.token_count)
      : total;
  }, 0);
}

export function snapshotGeminiUsage(
  model: string,
  usage: GeminiUsageMetadata | null | undefined,
  reportedAudioDurationSeconds = 0,
): UsageSnapshot {
  const inputTokens = firstCount(usage?.promptTokenCount, usage?.prompt_token_count);
  const generatedTokens = firstCount(
    usage?.candidatesTokenCount,
    usage?.candidates_token_count,
    usage?.responseTokenCount,
    usage?.response_token_count,
  );
  const thinkingTokens = firstCount(usage?.thoughtsTokenCount, usage?.thoughts_token_count);
  const outputTokens = generatedTokens + thinkingTokens;
  const totalTokens = firstCount(usage?.totalTokenCount, usage?.total_token_count) ||
    inputTokens + outputTokens;
  const promptDetails = details(usage?.promptTokensDetails ?? usage?.prompt_tokens_details);
  const responseDetails = details(
    usage?.candidatesTokensDetails ?? usage?.candidates_tokens_details ??
      usage?.responseTokensDetails ?? usage?.response_tokens_details,
  );
  const audioInputTokens = modalityTokens(promptDetails, "AUDIO");
  const audioOutputTokens = modalityTokens(responseDetails, "AUDIO");
  const derivedAudioSeconds = audioInputTokens > 0
    ? audioInputTokens / 32
    : audioOutputTokens > 0
      ? audioOutputTokens / 25
      : 0;
  const audioDurationSeconds = Math.max(
    0,
    Math.min(20 * 60, reportedAudioDurationSeconds || derivedAudioSeconds),
  );

  let estimatedCostUsd = 0;
  let pricingSnapshot: Record<string, number | string> = { pricedAt: "2026-08-10" };
  if (model === "gemini-3.1-flash-live-preview") {
    const rates = MODEL_PRICING[model];
    const textInput = Math.max(0, inputTokens - audioInputTokens);
    const textOutput = Math.max(0, outputTokens - audioOutputTokens);
    estimatedCostUsd =
      (textInput * rates.inputTextPerMillion + audioInputTokens * rates.inputAudioPerMillion +
        textOutput * rates.outputTextPerMillion + audioOutputTokens * rates.outputAudioPerMillion) /
      1_000_000;
    pricingSnapshot = { ...pricingSnapshot, ...rates };
  } else {
    const rates = MODEL_PRICING[model as keyof typeof MODEL_PRICING];
    if (rates && "inputPerMillion" in rates) {
      estimatedCostUsd =
        (inputTokens * rates.inputPerMillion + outputTokens * rates.outputPerMillion) /
        1_000_000;
      pricingSnapshot = { ...pricingSnapshot, ...rates };
    }
  }

  return {
    inputTokens,
    outputTokens,
    totalTokens,
    audioInputTokens,
    audioOutputTokens,
    audioDurationSeconds,
    estimatedCostUsd: Number(estimatedCostUsd.toFixed(8)),
    pricingSnapshot,
  };
}

export async function startAiUsage(
  admin: AdminClient,
  input: {
    reservationId: string;
    userId: string;
    feature: string;
    model: string;
    creditsCharged: number;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await admin.from("ai_request_usage").insert({
    reservation_id: input.reservationId,
    user_id: input.userId,
    feature: input.feature,
    gemini_model: input.model,
    credits_charged: input.creditsCharged,
    status: "started",
    metadata: input.metadata ?? {},
  });
  if (error) throw error;
}

export async function finalizeAiUsage(
  admin: AdminClient,
  input: {
    reservationId: string;
    userId: string;
    feature: string;
    model: string;
    creditsCharged: number;
    status: "started" | "completed" | "failed" | "billing_pending" | "abandoned";
    usage?: GeminiUsageMetadata | null;
    audioDurationSeconds?: number;
    metadata?: Record<string, unknown>;
  },
) {
  const snapshot = snapshotGeminiUsage(
    input.model,
    input.usage,
    input.audioDurationSeconds,
  );
  const { error } = await admin
    .from("ai_request_usage")
    .update({
      input_tokens: snapshot.inputTokens,
      output_tokens: snapshot.outputTokens,
      total_tokens: snapshot.totalTokens,
      audio_input_tokens: snapshot.audioInputTokens,
      audio_output_tokens: snapshot.audioOutputTokens,
      audio_duration_seconds: snapshot.audioDurationSeconds,
      estimated_api_cost_usd: snapshot.estimatedCostUsd,
      credits_charged: input.creditsCharged,
      status: input.status,
      completed_at: input.status === "completed" ? new Date().toISOString() : null,
      metadata: {
        ...(input.metadata ?? {}),
        pricing: snapshot.pricingSnapshot,
      },
      updated_at: new Date().toISOString(),
    })
    .eq("reservation_id", input.reservationId)
    .eq("user_id", input.userId);
  if (error) throw error;
  return snapshot;
}
