import type { PaymentOrderStatus, PaymentProviderName, PaymentStatus } from "./types.ts";

// Database types are regenerated after the migration is applied.
// deno-lint-ignore no-explicit-any
export type PaymentAdminClient = any;

export async function logPayment(
  admin: PaymentAdminClient,
  input: {
    paymentOrderId?: string | null;
    provider?: PaymentProviderName | null;
    level: "info" | "warning" | "error";
    event: string;
    message: string;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await admin.from("payment_logs").insert({
    payment_order_id: input.paymentOrderId ?? null,
    provider: input.provider ?? null,
    level: input.level,
    event: input.event.slice(0, 80),
    message: input.message.slice(0, 500),
    metadata: input.metadata ?? {},
  });
  if (error) {
    console.error("Payment log insert failed", { code: error.code, event: input.event });
  }
}

export async function processVerifiedPayment(
  admin: PaymentAdminClient,
  input: {
    orderId: string;
    provider: PaymentProviderName;
    eventKey: string;
    verified: PaymentStatus;
    payload: Record<string, unknown>;
  },
) {
  return admin.rpc("process_payment_order", {
    p_order_id: input.orderId,
    p_provider: input.provider,
    p_provider_payment_id: input.verified.paymentId ?? "",
    p_provider_status: input.verified.providerStatus,
    p_normalized_status: input.verified.status,
    p_verified_amount: input.verified.amount,
    p_verified_currency: input.verified.currency,
    p_event_key: input.eventKey,
    p_payload: input.payload,
  });
}

export function databaseOrderStatus(value: unknown): PaymentOrderStatus {
  return [
    "pending",
    "processing",
    "completed",
    "failed",
    "cancelled",
    "expired",
    "refunded",
  ].includes(String(value))
    ? (value as PaymentOrderStatus)
    : "pending";
}
