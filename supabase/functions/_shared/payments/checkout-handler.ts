import { withSupabase } from "@supabase/server";

import { databaseOrderStatus, logPayment, processVerifiedPayment } from "./database.ts";
import { publicProviderError } from "./errors.ts";
import { getConfiguredPaymentProvider, getPaymentProvider } from "./provider.ts";
import type {
  PaymentOrder,
  PaymentProviderName,
  PaymentProductType,
  SubscriptionPlan,
} from "./types.ts";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const paymentCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, {
    status,
    headers: { ...paymentCorsHeaders, "Cache-Control": "no-store" },
  });

type CheckoutBody = {
  action?: "catalog" | "packs" | "create" | "status";
  productId?: unknown;
  creditPackId?: unknown;
  paymentId?: unknown;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  product_type: PaymentProductType;
  amount: number;
  currency: string;
  credits: number | null;
  included_credits: number;
  plan: SubscriptionPlan | null;
  subscription_days: number | null;
  active: boolean;
};

// Conservative per-credit ceiling across Live audio and server-bounded strong
// model evaluation. This is intentionally above Live's ~$0.000594/credit.
const WORST_CASE_GEMINI_USD_PER_CREDIT = 0.00075;
const MIN_COST_SAFETY_MULTIPLIER = 3;

type CostSafetyConfig = {
  iqdPerUsd: number;
  multiplier: number;
};

function getCostSafetyConfig(): CostSafetyConfig | null {
  const iqdPerUsd = Number(Deno.env.get("AI_COST_SAFETY_IQD_PER_USD"));
  const configuredMultiplier = Number(
    Deno.env.get("AI_COST_SAFETY_MULTIPLIER") ?? "3.1",
  );
  if (
    !Number.isFinite(iqdPerUsd) ||
    iqdPerUsd <= 0 ||
    !Number.isFinite(configuredMultiplier) ||
    configuredMultiplier < MIN_COST_SAFETY_MULTIPLIER
  ) {
    return null;
  }
  return { iqdPerUsd, multiplier: configuredMultiplier };
}

function productPassesCostSafety(
  product: ProductRow,
  config: CostSafetyConfig | null,
): boolean {
  if (!config || product.currency !== "IQD") return false;
  const grantedCredits = product.product_type === "credits"
    ? product.credits ?? 0
    : product.included_credits;
  if (grantedCredits <= 0) return false;
  const revenueUsd = product.amount / config.iqdPerUsd;
  const minimumRevenueUsd =
    grantedCredits * WORST_CASE_GEMINI_USD_PER_CREDIT * config.multiplier;
  return revenueUsd >= minimumRevenueUsd;
}

function configuredProviderName(): PaymentProviderName | null {
  const value = Deno.env.get("PAYMENT_PROVIDER")?.trim().toLowerCase();
  return value === "wayl" || value === "rasedi" ? value : null;
}

function productResponse(
  product: ProductRow,
  providerReady: boolean,
  costSafety: CostSafetyConfig | null,
) {
  const costSafetyReady = productPassesCostSafety(product, costSafety);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    productType: product.product_type,
    amount: product.amount,
    currency: product.currency,
    credits: product.credits,
    includedCredits: product.included_credits,
    plan: product.plan,
    subscriptionDays: product.subscription_days,
    costSafetyReady,
    purchasable: product.active && providerReady && costSafetyReady,
  };
}

const checkout = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "POST") {
    return json({ code: "METHOD_NOT_ALLOWED", message: "Method not allowed." }, 405);
  }

  const userId = ctx.userClaims?.id;
  if (!userId) {
    return json({ code: "AUTH_REQUIRED", message: "Sign in to continue." }, 401);
  }
  // deno-lint-ignore no-explicit-any
  const admin = ctx.supabaseAdmin as any;

  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return json({ code: "INVALID_JSON", message: "Invalid request body." }, 400);
  }

  const action = body.action ?? "catalog";

  if (action === "catalog" || action === "packs") {
    const providerName = configuredProviderName();
    let providerReady = false;
    if (providerName) {
      try {
        getConfiguredPaymentProvider();
        providerReady = true;
      } catch {
        providerReady = false;
      }
    }
    const costSafety = getCostSafetyConfig();

    let query = admin
      .from("billing_products")
      .select(
        "id, slug, name, description, product_type, amount, currency, credits, included_credits, plan, subscription_days, active",
      )
      .order("sort_order", { ascending: true })
      .order("amount", { ascending: true });

    if (action === "packs") {
      query = query.eq("product_type", "credits").eq("active", true);
    } else {
      query = query.or("active.eq.true,product_type.eq.subscription");
    }
    const { data, error } = await query;

    if (error) {
      console.error("Billing catalog lookup failed", { code: error.code });
      return json(
        { code: "CATALOG_UNAVAILABLE", message: "Pricing is unavailable." },
        503,
      );
    }

    const products = (data ?? []).map((product: ProductRow) =>
      productResponse(product, providerReady, costSafety)
    );
    return json({
      provider: providerName,
      providerReady,
      costSafetyReady: Boolean(costSafety),
      products,
      // Compatibility for older Twino web bundles during rollout.
      packs: action === "packs" ? products.map((product: ReturnType<typeof productResponse>) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        creditAmount: product.credits,
        priceIqd: product.amount,
        currency: product.currency,
      })) : undefined,
    });
  }

  if (action === "status") {
    const orderId = typeof body.paymentId === "string" ? body.paymentId.trim() : "";
    if (!UUID_PATTERN.test(orderId)) {
      return json({ code: "INVALID_PAYMENT", message: "Invalid payment reference." }, 400);
    }

    const { data: order, error } = await admin
      .from("payment_orders")
      .select(
        "id, provider, status, provider_status, provider_payment_id, completed_at, updated_at, product_type, credits, included_credits, plan, subscription_days",
      )
      .eq("id", orderId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Payment order lookup failed", { code: error.code });
      return json(
        { code: "STATUS_UNAVAILABLE", message: "Payment status is unavailable." },
        503,
      );
    }
    if (!order) {
      return json({ code: "PAYMENT_NOT_FOUND", message: "Payment was not found." }, 404);
    }

    let status = databaseOrderStatus(order.status);
    let providerStatus = order.provider_status;
    let verificationPending = false;

    if (status === "pending" || status === "processing") {
      try {
        const provider = getPaymentProvider(order.provider as PaymentProviderName);
        const verified = await provider.verifyPayment(order.id);
        if (verified.referenceId !== order.id) {
          throw new Error("Provider reference mismatch");
        }

        const processed = await processVerifiedPayment(admin, {
          orderId: order.id,
          provider: provider.name,
          eventKey: `reconcile:${order.id}:${verified.status}`,
          verified,
          payload: { source: "status_reconciliation", verification: verified.raw },
        });
        if (processed.error) throw processed.error;
        const result = Array.isArray(processed.data) ? processed.data[0] : processed.data;
        status = databaseOrderStatus(result?.order_status ?? verified.status);
        providerStatus = verified.providerStatus;
      } catch (verificationError) {
        verificationPending = true;
        await logPayment(admin, {
          paymentOrderId: order.id,
          provider: order.provider,
          level: "warning",
          event: "status_verification_failed",
          message: "Provider status verification did not complete.",
          metadata: {
            code:
              verificationError instanceof Error
                ? verificationError.name
                : "UNKNOWN_ERROR",
          },
        });
      }
    }

    return json({
      payment: {
        id: order.id,
        status,
        provider: order.provider,
        providerStatus,
        providerPaymentId: order.provider_payment_id,
        productType: order.product_type,
        credits: order.credits,
        includedCredits: order.included_credits,
        plan: order.plan,
        subscriptionDays: order.subscription_days,
        completedAt: order.completed_at,
        updatedAt: order.updated_at,
        verificationPending,
      },
    });
  }

  if (action !== "create") {
    return json({ code: "INVALID_ACTION", message: "Invalid checkout action." }, 400);
  }

  const productIdValue =
    typeof body.productId === "string"
      ? body.productId.trim()
      : typeof body.creditPackId === "string"
        ? body.creditPackId.trim()
        : "";
  if (!UUID_PATTERN.test(productIdValue)) {
    return json({ code: "INVALID_PRODUCT", message: "Choose a valid product." }, 400);
  }

  const { data: allowed, error: rateError } = await admin.rpc(
    "consume_wallet_rate_limit",
    {
      p_scope: "payment-checkout-create",
      p_subject: userId,
      p_limit: 5,
      p_window_seconds: 300,
    },
  );
  if (rateError) {
    console.error("Checkout rate limit failed", { code: rateError.code });
    return json({ code: "CHECKOUT_UNAVAILABLE", message: "Checkout is unavailable." }, 503);
  }
  if (!allowed) {
    return json(
      { code: "RATE_LIMITED", message: "Too many checkout attempts. Try again shortly." },
      429,
    );
  }

  const { data: product, error: productError } = await admin
    .from("billing_products")
    .select(
      "id, slug, name, description, product_type, amount, currency, credits, included_credits, plan, subscription_days, active",
    )
    .eq("id", productIdValue)
    .eq("active", true)
    .maybeSingle();

  if (productError) {
    console.error("Billing product lookup failed", { code: productError.code });
    return json({ code: "CATALOG_UNAVAILABLE", message: "Pricing is unavailable." }, 503);
  }
  if (!product) {
    return json({ code: "PRODUCT_NOT_FOUND", message: "That product is unavailable." }, 404);
  }


  const costSafety = getCostSafetyConfig();
  if (!productPassesCostSafety(product as ProductRow, costSafety)) {
    console.error("Checkout blocked by AI cost safety", {
      productId: product.id,
      configured: Boolean(costSafety),
    });
    return json(
      {
        code: "COST_SAFETY_NOT_READY",
        message: "Checkout is temporarily unavailable while pricing safety is verified.",
      },
      503,
    );
  }

  if (product.product_type === "subscription" && product.plan) {
    await admin.rpc("expire_user_subscription", { p_user_id: userId });
    const { data: currentSubscription, error: subscriptionError } = await admin
      .from("subscriptions")
      .select("plan, status, expires_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (subscriptionError) {
      console.error("Subscription downgrade check failed", {
        code: subscriptionError.code,
      });
      return json(
        { code: "CHECKOUT_UNAVAILABLE", message: "Checkout is unavailable." },
        503,
      );
    }
    const planRank: Record<string, number> = { free: 0, plus: 1, pro: 2, max: 3 };
    if (
      (planRank[currentSubscription?.plan ?? "free"] ?? 0) > planRank[product.plan] &&
      currentSubscription.status === "active" &&
      typeof currentSubscription.expires_at === "string" &&
      Date.parse(currentSubscription.expires_at) > Date.now()
    ) {
      return json(
        {
          code: "ACTIVE_PLAN_DOWNGRADE_BLOCKED",
          message: "A lower plan cannot be purchased while a higher plan is active.",
        },
        409,
      );
    }
  }

  let provider;
  try {
    provider = getConfiguredPaymentProvider();
  } catch (error) {
    const safe = publicProviderError(error);
    return json({ code: safe.code, message: safe.message, retryable: safe.retryable }, safe.status);
  }

  const { data: insertedOrder, error: insertError } = await admin
    .from("payment_orders")
    .insert({
      user_id: userId,
      product_id: product.id,
      provider: provider.name,
      amount: product.amount,
      currency: product.currency,
      product_type: product.product_type,
      credits: product.credits,
      included_credits: product.included_credits,
      plan: product.plan,
      subscription_days: product.subscription_days,
      status: "pending",
      provider_status: "Creating",
    })
    .select("id")
    .single();

  if (insertError || !insertedOrder) {
    console.error("Payment order creation failed", { code: insertError?.code });
    return json(
      { code: "CHECKOUT_UNAVAILABLE", message: "Unable to start checkout." },
      503,
    );
  }

  const paymentOrder: PaymentOrder = {
    id: insertedOrder.id,
    userId,
    provider: provider.name,
    amount: product.amount,
    currency: product.currency,
    productType: product.product_type,
    credits: product.credits,
    includedCredits: product.included_credits,
    plan: product.plan,
    subscriptionDays: product.subscription_days,
    productName: product.name,
  };

  try {
    const result = await provider.createCheckout(paymentOrder);
    const { error: updateError } = await admin
      .from("payment_orders")
      .update({
        provider_payment_id: result.paymentId,
        provider_status: result.providerStatus,
        checkout_url: result.checkoutUrl,
        metadata: { checkout: result.raw },
      })
      .eq("id", insertedOrder.id);

    if (updateError) throw updateError;

    await logPayment(admin, {
      paymentOrderId: insertedOrder.id,
      provider: provider.name,
      level: "info",
      event: "checkout_created",
      message: "Hosted checkout created.",
    });

    return json(
      {
        paymentId: insertedOrder.id,
        provider: provider.name,
        checkoutUrl: result.checkoutUrl,
      },
      201,
    );
  } catch (error) {
    const safe = publicProviderError(error);
    await admin
      .from("payment_orders")
      .update({
        status: "failed",
        failure_code: safe.code,
        provider_status: "Checkout creation failed",
      })
      .eq("id", insertedOrder.id);
    await logPayment(admin, {
      paymentOrderId: insertedOrder.id,
      provider: provider.name,
      level: "error",
      event: "checkout_create_failed",
      message: safe.message,
      metadata: { code: safe.code, retryable: safe.retryable },
    });
    return json({ code: safe.code, message: safe.message, retryable: safe.retryable }, safe.status);
  }
});

export default {
  fetch(req: Request) {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: paymentCorsHeaders });
    }
    return checkout(req);
  },
};
