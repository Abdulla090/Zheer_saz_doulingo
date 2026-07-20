import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const WAYL_API_BASE_URL = "https://api.thewayl.com";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

type CheckoutBody = {
  action?: "packs" | "create" | "status";
  creditPackId?: unknown;
  paymentId?: unknown;
};

type WaylLink = {
  id?: unknown;
  referenceId?: unknown;
  status?: unknown;
  url?: unknown;
};

type CreditPackRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  credit_amount: number;
  price_iqd: number;
  currency: string;
};

function isAllowedCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "checkout.thewayl.com" ||
        url.hostname.endsWith(".checkout.thewayl.com"))
    );
  } catch {
    return false;
  }
}

function normalizeBaseUrl(value: string) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" &&
    !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))
  ) {
    throw new Error("URL must use HTTPS");
  }
  return url.toString().replace(/\/$/, "");
}

const checkout = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "POST") {
    return json({ code: "METHOD_NOT_ALLOWED", message: "Method not allowed." }, 405);
  }

  const userId = ctx.userClaims?.id;
  if (!userId) {
    return json({ code: "AUTH_REQUIRED", message: "Sign in to continue." }, 401);
  }
  // Database types are generated after the migration is applied. Keep this
  // server-only client untyped until that generation step is available.
  // deno-lint-ignore no-explicit-any
  const admin = ctx.supabaseAdmin as any;

  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return json({ code: "INVALID_JSON", message: "Invalid request body." }, 400);
  }

  const action = body.action ?? "packs";

  if (action === "packs") {
    const { data, error } = await admin
      .from("credit_packs")
      .select("id, slug, name, description, credit_amount, price_iqd, currency")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("price_iqd", { ascending: true });

    if (error) {
      console.error("Credit pack lookup failed", { code: error.code });
      return json(
        { code: "PACKS_UNAVAILABLE", message: "Credit packs are unavailable." },
        503,
      );
    }

    return json({
      packs: (data ?? []).map((pack: CreditPackRow) => ({
        id: pack.id,
        slug: pack.slug,
        name: pack.name,
        description: pack.description,
        creditAmount: pack.credit_amount,
        priceIqd: pack.price_iqd,
        currency: pack.currency,
      })),
    });
  }

  if (action === "status") {
    const paymentId =
      typeof body.paymentId === "string" ? body.paymentId.trim() : "";
    if (!paymentId || paymentId.length > 160) {
      return json(
        { code: "INVALID_PAYMENT", message: "Invalid payment reference." },
        400,
      );
    }

    const { data: payment, error } = await admin
      .from("wayl_payments")
      .select("reference_id, status, wayl_status, credited_at, updated_at")
      .eq("reference_id", paymentId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Payment status lookup failed", { code: error.code });
      return json(
        { code: "STATUS_UNAVAILABLE", message: "Payment status is unavailable." },
        503,
      );
    }
    if (!payment) {
      return json(
        { code: "PAYMENT_NOT_FOUND", message: "Payment was not found." },
        404,
      );
    }

    return json({
      payment: {
        id: payment.reference_id,
        status: payment.status,
        providerStatus: payment.wayl_status,
        creditedAt: payment.credited_at,
        updatedAt: payment.updated_at,
      },
    });
  }

  if (action !== "create") {
    return json({ code: "INVALID_ACTION", message: "Invalid checkout action." }, 400);
  }

  const creditPackId =
    typeof body.creditPackId === "string" ? body.creditPackId.trim() : "";
  if (!UUID_PATTERN.test(creditPackId)) {
    return json({ code: "INVALID_PACK", message: "Choose a valid credit pack." }, 400);
  }

  const { data: allowed, error: rateError } = await admin.rpc(
    "consume_wallet_rate_limit" as never,
    {
      p_scope: "wayl-checkout-create",
      p_subject: userId,
      p_limit: 5,
      p_window_seconds: 300,
    } as never,
  );
  if (rateError) {
    console.error("Checkout rate limit failed", { code: rateError.code });
    return json(
      { code: "CHECKOUT_UNAVAILABLE", message: "Checkout is unavailable." },
      503,
    );
  }
  if (!allowed) {
    return json(
      {
        code: "RATE_LIMITED",
        message: "Too many checkout attempts. Please wait a few minutes.",
      },
      429,
    );
  }

  const { data: pack, error: packError } = await admin
    .from("credit_packs")
    .select("id, name, credit_amount, price_iqd, currency")
    .eq("id", creditPackId)
    .eq("active", true)
    .maybeSingle();

  if (packError) {
    console.error("Credit pack lookup failed", { code: packError.code });
    return json(
      { code: "PACKS_UNAVAILABLE", message: "Credit packs are unavailable." },
      503,
    );
  }
  if (!pack) {
    return json(
      { code: "PACK_NOT_FOUND", message: "That credit pack is not available." },
      404,
    );
  }

  const apiKey = Deno.env.get("WAYL_API_KEY")?.trim();
  const webhookSecret = Deno.env.get("WAYL_WEBHOOK_SECRET")?.trim();
  const webhookUrlValue = Deno.env.get("WAYL_WEBHOOK_URL")?.trim();
  const webUrlValue = Deno.env.get("TWINO_WEB_URL")?.trim();
  const waylEnv = Deno.env.get("WAYL_ENV") === "live" ? "live" : "test";

  if (
    !apiKey ||
    !webhookSecret ||
    webhookSecret.length < 32 ||
    !webhookUrlValue ||
    !webUrlValue
  ) {
    return json(
      {
        code: "WAYL_NOT_CONFIGURED",
        message:
          "Credit checkout is waiting for the merchant account and Wayl API credentials.",
      },
      503,
    );
  }

  let webhookUrl: string;
  let webUrl: string;
  try {
    webhookUrl = normalizeBaseUrl(webhookUrlValue);
    webUrl = normalizeBaseUrl(webUrlValue);
  } catch {
    return json(
      {
        code: "WAYL_NOT_CONFIGURED",
        message: "Checkout URLs are not configured correctly.",
      },
      503,
    );
  }

  const referenceId = `twino-${Date.now()}-${crypto.randomUUID()}`;
  const { data: payment, error: paymentError } = await admin
    .from("wayl_payments")
    .insert({
      user_id: userId,
      reference_id: referenceId,
      credit_pack_id: pack.id,
      credit_amount: pack.credit_amount,
      amount_iqd: pack.price_iqd,
      currency: "IQD",
      status: "pending",
      wayl_status: "Creating",
    })
    .select("id")
    .single();

  if (paymentError || !payment) {
    console.error("Payment record creation failed", { code: paymentError?.code });
    return json(
      { code: "CHECKOUT_UNAVAILABLE", message: "Unable to start checkout." },
      503,
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(`${WAYL_API_BASE_URL}/api/v1/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WAYL-AUTHENTICATION": apiKey,
      },
      body: JSON.stringify({
        env: waylEnv,
        referenceId,
        total: pack.price_iqd,
        currency: "IQD",
        customParameter: payment.id,
        lineItem: [
          {
            label: `${pack.name} — ${pack.credit_amount} TWINO credits`,
            amount: pack.price_iqd,
            type: "increase",
          },
        ],
        webhookUrl,
        webhookSecret,
        redirectionUrl: `${webUrl}/credits?payment=${encodeURIComponent(referenceId)}`,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as
      | { data?: WaylLink; message?: unknown }
      | null;
    const link = payload?.data;
    const checkoutUrl = typeof link?.url === "string" ? link.url : "";

    if (!response.ok || !link || !checkoutUrl || !isAllowedCheckoutUrl(checkoutUrl)) {
      await admin
        .from("wayl_payments")
        .update({
          status: "failed",
          wayl_status: `Create failed (${response.status})`,
        })
        .eq("id", payment.id);
      console.error("Wayl link creation failed", { status: response.status });
      return json(
        {
          code: "WAYL_CHECKOUT_FAILED",
          message: "Wayl could not create the payment page.",
        },
        502,
      );
    }

    const waylPaymentId = typeof link.id === "string" ? link.id : null;
    const waylStatus = typeof link.status === "string" ? link.status : "Created";
    const { error: updateError } = await admin
      .from("wayl_payments")
      .update({
        wayl_payment_id: waylPaymentId,
        checkout_url: checkoutUrl,
        wayl_status: waylStatus,
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Payment record update failed", { code: updateError.code });
      return json(
        { code: "CHECKOUT_UNAVAILABLE", message: "Unable to save checkout." },
        503,
      );
    }

    return json(
      {
        paymentId: referenceId,
        checkoutUrl,
        environment: waylEnv,
      },
      201,
    );
  } catch (error) {
    await admin
      .from("wayl_payments")
      .update({
        status: "failed",
        wayl_status:
          error instanceof Error && error.name === "AbortError"
            ? "Create timed out"
            : "Create request failed",
      })
      .eq("id", payment.id);
    return json(
      {
        code: "WAYL_UNAVAILABLE",
        message:
          error instanceof Error && error.name === "AbortError"
            ? "Wayl checkout timed out. Please try again."
            : "Wayl checkout is temporarily unavailable.",
      },
      503,
    );
  } finally {
    clearTimeout(timeout);
  }
});

export default {
  fetch(req: Request) {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    return checkout(req);
  },
};
