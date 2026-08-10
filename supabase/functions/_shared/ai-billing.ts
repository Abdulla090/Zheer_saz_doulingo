export type MeteredAiFeatureKey =
  | "live_tutor_5"
  | "live_tutor_10"
  | "live_tutor_15"
  | "ai_teacher_writing"
  | "ai_teacher_speaking"
  | "reading_passage_generation"
  | "reading_pronunciation_evaluation"
  | "roleplay_text_response"
  | "roleplay_voice_response"
  | "dynamic_tts_minute";

// Database types are generated after migrations are applied.
// deno-lint-ignore no-explicit-any
type AdminClient = any;

type ReservationRpcRow = {
  new_balance: number;
  charged_amount: number;
  reservation_id: string;
  reservation_status: "reserved" | "settled" | "reversed";
  duplicate: boolean;
};

export type AiCharge = {
  balance: number;
  chargedAmount: number;
  reservationId: string;
  status: "reserved" | "settled" | "reversed";
  idempotent: boolean;
};

export class AiBillingError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "AiBillingError";
  }
}

function rowFrom(data: unknown): ReservationRpcRow | null {
  const value = Array.isArray(data) ? data[0] : data;
  if (!value || typeof value !== "object") return null;
  return value as ReservationRpcRow;
}

function chargeFrom(row: ReservationRpcRow): AiCharge {
  return {
    balance: row.new_balance,
    chargedAmount: row.charged_amount,
    reservationId: row.reservation_id,
    status: row.reservation_status,
    idempotent: row.duplicate === true,
  };
}

function rpcFailure(error: { message?: string; code?: string } | null) {
  const message = error?.message ?? "";
  if (message.includes("INSUFFICIENT_CREDITS")) {
    return new AiBillingError(
      "INSUFFICIENT_CREDITS",
      402,
      "You do not have enough AI credits.",
    );
  }
  if (message.includes("AI_FEATURE_NOT_CONFIGURED")) {
    return new AiBillingError(
      "AI_FEATURE_NOT_CONFIGURED",
      503,
      "This AI feature is not available.",
    );
  }
  if (message.includes("IDEMPOTENCY_CONFLICT")) {
    return new AiBillingError(
      "IDEMPOTENCY_CONFLICT",
      409,
      "That request key was already used for another AI action.",
    );
  }
  return new AiBillingError(
    "AI_BILLING_UNAVAILABLE",
    503,
    "AI credit billing is temporarily unavailable.",
  );
}

export async function reserveAiCredits(
  admin: AdminClient,
  input: {
    userId: string;
    featureKey: MeteredAiFeatureKey;
    idempotencyKey: string;
  },
): Promise<AiCharge> {
  const { data, error } = await admin.rpc("reserve_ai_credits", {
    p_user_id: input.userId,
    p_feature_key: input.featureKey,
    p_idempotency_key: input.idempotencyKey,
  });
  if (error) throw rpcFailure(error);

  const row = rowFrom(data);
  if (!row) throw rpcFailure(null);
  const charge = chargeFrom(row);

  if (charge.idempotent) {
    const code =
      charge.status === "reserved"
        ? "AI_REQUEST_IN_PROGRESS"
        : charge.status === "settled"
          ? "AI_REQUEST_ALREADY_COMPLETED"
          : "AI_REQUEST_REVERSED";
    throw new AiBillingError(
      code,
      409,
      charge.status === "reserved"
        ? "This AI request is already in progress."
        : charge.status === "settled"
          ? "This AI request was already completed."
          : "The previous AI request failed and its credits were returned.",
    );
  }

  return charge;
}

export async function settleAiCredits(
  admin: AdminClient,
  userId: string,
  reservationId: string,
): Promise<AiCharge> {
  const { data, error } = await admin.rpc("settle_ai_credits", {
    p_user_id: userId,
    p_reservation_id: reservationId,
  });
  if (error) throw rpcFailure(error);
  const row = rowFrom(data);
  if (!row) throw rpcFailure(null);
  return chargeFrom(row);
}

export async function reverseAiCredits(
  admin: AdminClient,
  userId: string,
  reservationId: string,
  reason: string,
): Promise<AiCharge> {
  const { data, error } = await admin.rpc("reverse_ai_credits", {
    p_user_id: userId,
    p_reservation_id: reservationId,
    p_reason: reason,
  });
  if (error) throw rpcFailure(error);
  const row = rowFrom(data);
  if (!row) throw rpcFailure(null);
  return chargeFrom(row);
}

export function aiBillingResponse(charge: AiCharge) {
  return {
    balance: charge.balance,
    chargedAmount: charge.chargedAmount,
    reservationId: charge.reservationId,
    transactionId: charge.reservationId,
    idempotencyStatus: charge.idempotent ? "duplicate" : "applied",
  };
}

export function aiBillingErrorResponse(error: unknown) {
  const billingError =
    error instanceof AiBillingError
      ? error
      : new AiBillingError(
          "AI_BILLING_UNAVAILABLE",
          503,
          "AI credit billing is temporarily unavailable.",
        );
  return {
    status: billingError.status,
    body: { code: billingError.code, message: billingError.message },
  };
}
