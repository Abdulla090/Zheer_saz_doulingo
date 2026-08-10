import { withSupabase } from "@supabase/server";

import { logPayment, processVerifiedPayment } from "./database.ts";
import { PaymentProviderError, publicProviderError } from "./errors.ts";
import { getPaymentProvider } from "./provider.ts";
import type { PaymentProviderName } from "./types.ts";

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "Content-Type": "application/json" },
  });

export function createPaymentWebhookHandler(providerName: PaymentProviderName) {
  const webhook = withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method !== "POST") {
      return json({ received: false, code: "METHOD_NOT_ALLOWED" }, 405);
    }
    // deno-lint-ignore no-explicit-any
    const admin = ctx.supabaseAdmin as any;
    const provider = getPaymentProvider(providerName);

    try {
      const webhookResult = await provider.verifyWebhook(req);
      const { data: order, error: orderError } = await admin
        .from("payment_orders")
        .select("id, amount, currency, provider_payment_id")
        .eq("id", webhookResult.paymentId)
        .eq("provider", providerName)
        .maybeSingle();

      if (orderError || !order) {
        throw new PaymentProviderError(
          "PAYMENT_ORDER_NOT_FOUND",
          "Payment order was not found.",
          404,
        );
      }

      // Wayl exposes a documented status lookup. Treat the signed webhook as a
      // notification and the provider API response as the fulfillment proof.
      const verified = await provider.verifyPayment(order.id);
      if (
        verified.referenceId !== order.id ||
        verified.amount !== webhookResult.amount ||
        verified.currency !== webhookResult.currency ||
        verified.amount !== order.amount ||
        verified.currency !== order.currency
      ) {
        throw new PaymentProviderError(
          "PAYMENT_VERIFICATION_MISMATCH",
          "Payment verification did not match the order.",
          409,
        );
      }

      const { data, error } = await processVerifiedPayment(admin, {
        orderId: order.id,
        provider: providerName,
        eventKey: webhookResult.eventKey,
        verified,
        payload: {
          webhook: webhookResult.payload,
          verification: verified.raw,
        },
      });

      if (error) {
        const mismatch = error.message?.includes("MISMATCH");
        throw new PaymentProviderError(
          mismatch ? "PAYMENT_ORDER_MISMATCH" : "PAYMENT_PROCESSING_FAILED",
          mismatch
            ? "Payment verification did not match the order."
            : "Payment processing failed.",
          mismatch ? 409 : 500,
          !mismatch,
        );
      }

      const result = Array.isArray(data) ? data[0] : data;
      await logPayment(admin, {
        paymentOrderId: order.id,
        provider: providerName,
        level: "info",
        event: "webhook_processed",
        message: result?.duplicate
          ? "Duplicate webhook acknowledged without fulfillment."
          : "Verified webhook processed.",
        metadata: {
          status: result?.order_status ?? verified.status,
          duplicate: Boolean(result?.duplicate),
        },
      });

      return json({
        received: true,
        status: result?.order_status ?? verified.status,
        duplicate: Boolean(result?.duplicate),
        creditsApplied: Boolean(result?.credits_applied),
        subscriptionPlan: result?.subscription_plan ?? "free",
        subscriptionExpiresAt: result?.subscription_expires_at ?? null,
      });
    } catch (error) {
      const safe = publicProviderError(error);
      await logPayment(admin, {
        provider: providerName,
        level: "error",
        event: "webhook_failed",
        message: safe.message,
        metadata: { code: safe.code, retryable: safe.retryable },
      });
      return json({ received: false, code: safe.code }, safe.status);
    }
  });

  return {
    fetch(req: Request) {
      return webhook(req);
    },
  };
}
