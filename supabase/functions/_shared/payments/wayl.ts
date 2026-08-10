import { PaymentProviderError } from "./errors.ts";
import type {
  CheckoutResult,
  PaymentOrder,
  PaymentOrderStatus,
  PaymentProvider,
  PaymentStatus,
  WebhookResult,
} from "./types.ts";

const WAYL_API_BASE_URL = "https://api.thewayl.com";
const WAYL_CHECKOUT_HOST = "checkout.thewayl.com";
const SIGNATURE_PATTERN = /^[0-9a-f]{64}$/i;

type WaylLink = {
  id?: unknown;
  referenceId?: unknown;
  status?: unknown;
  total?: unknown;
  currency?: unknown;
  url?: unknown;
  completedAt?: unknown;
};

type WaylWebhookPayload = {
  event?: unknown;
  referenceId?: unknown;
  paymentStatus?: unknown;
  paymentProcessor?: unknown;
  total?: unknown;
  code?: unknown;
  id?: unknown;
};

function requiredEnv(name: string) {
  const value = Deno.env.get(name)?.trim();
  if (!value) {
    throw new PaymentProviderError(
      "WAYL_NOT_CONFIGURED",
      "Wayl checkout is waiting for merchant API credentials.",
      503,
    );
  }
  return value;
}

function normalizeHttpsUrl(value: string, name: string) {
  try {
    const url = new URL(value);
    const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol !== "https:" && !(isLocal && url.protocol === "http:")) {
      throw new Error("invalid protocol");
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new PaymentProviderError(
      "WAYL_NOT_CONFIGURED",
      `${name} is not configured correctly.`,
      503,
    );
  }
}

function checkoutUrlIsAllowed(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === WAYL_CHECKOUT_HOST ||
        url.hostname.endsWith(`.${WAYL_CHECKOUT_HOST}`))
    );
  } catch {
    return false;
  }
}

function integerAmount(value: unknown) {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isSafeInteger(parsed) && parsed >= 0
    ? parsed
    : null;
}

export function normalizeWaylStatus(value: string): PaymentOrderStatus {
  switch (value.trim().toLowerCase()) {
    case "complete":
    case "completed":
    case "delivered":
    case "paid":
      return "completed";
    case "processing":
      return "processing";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "rejected":
    case "failed":
      return "failed";
    case "expired":
      return "expired";
    case "returned":
    case "refunded":
      return "refunded";
    default:
      return "pending";
  }
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeHexEqual(left: string, right: string) {
  if (!SIGNATURE_PATTERN.test(left) || !SIGNATURE_PATTERN.test(right)) {
    return false;
  }
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export async function signWaylWebhook(rawBody: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  return bytesToHex(new Uint8Array(signature));
}

async function waylRequest(path: string, init?: RequestInit) {
  const apiKey = requiredEnv("WAYL_API_KEY");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(`${WAYL_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-WAYL-AUTHENTICATION": apiKey,
        ...init?.headers,
      },
      signal: controller.signal,
    });
    const payload = (await response.json().catch(() => null)) as
      | { data?: WaylLink; message?: unknown }
      | null;

    if (!response.ok || !payload?.data) {
      throw new PaymentProviderError(
        "WAYL_REQUEST_FAILED",
        "Wayl could not complete the payment request.",
        502,
        response.status >= 500,
      );
    }
    return payload.data;
  } catch (error) {
    if (error instanceof PaymentProviderError) throw error;
    throw new PaymentProviderError(
      "WAYL_UNAVAILABLE",
      error instanceof Error && error.name === "AbortError"
        ? "Wayl timed out. Please try again."
        : "Wayl is temporarily unavailable.",
      503,
      true,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export class WaylProvider implements PaymentProvider {
  readonly name = "wayl" as const;

  async createCheckout(order: PaymentOrder): Promise<CheckoutResult> {
    if (order.currency !== "IQD" || order.amount < 1000) {
      throw new PaymentProviderError(
        "WAYL_UNSUPPORTED_ORDER",
        "Wayl currently accepts IQD orders of at least 1,000 IQD.",
        400,
      );
    }

    const webhookSecret = requiredEnv("WAYL_WEBHOOK_SECRET");
    if (webhookSecret.length < 32) {
      throw new PaymentProviderError(
        "WAYL_NOT_CONFIGURED",
        "The Wayl webhook secret must be a strong server-side secret.",
        503,
      );
    }

    const supabaseUrl = normalizeHttpsUrl(requiredEnv("SUPABASE_URL"), "SUPABASE_URL");
    const webUrl = normalizeHttpsUrl(requiredEnv("TWINO_WEB_URL"), "TWINO_WEB_URL");
    const configuredWebhookUrl = Deno.env.get("WAYL_WEBHOOK_URL")?.trim();
    const webhookUrl = configuredWebhookUrl
      ? normalizeHttpsUrl(configuredWebhookUrl, "WAYL_WEBHOOK_URL")
      : `${supabaseUrl}/functions/v1/wayl-webhook`;
    const environment = Deno.env.get("WAYL_ENV") === "live" ? "live" : "test";

    const link = await waylRequest("/api/v1/links", {
      method: "POST",
      body: JSON.stringify({
        env: environment,
        referenceId: order.id,
        total: order.amount,
        currency: "IQD",
        customParameter: order.userId,
        lineItem: [
          {
            label: order.productName.slice(0, 255),
            amount: order.amount,
            type: "increase",
          },
        ],
        webhookUrl,
        webhookSecret,
        redirectionUrl: `${webUrl}/pricing?payment=${encodeURIComponent(order.id)}`,
      }),
    });

    const checkoutUrl = typeof link.url === "string" ? link.url : "";
    if (!checkoutUrlIsAllowed(checkoutUrl)) {
      throw new PaymentProviderError(
        "WAYL_INVALID_CHECKOUT_URL",
        "Wayl returned an invalid checkout URL.",
        502,
      );
    }

    return {
      checkoutUrl,
      paymentId: typeof link.id === "string" ? link.id : null,
      providerStatus: typeof link.status === "string" ? link.status : "Created",
      raw: {
        referenceId: link.referenceId,
        id: link.id,
        status: link.status,
        total: link.total,
        currency: link.currency,
      },
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentStatus> {
    const link = await waylRequest(`/api/v1/links/${encodeURIComponent(paymentId)}`);
    const referenceId = typeof link.referenceId === "string" ? link.referenceId : "";
    const providerStatus = typeof link.status === "string" ? link.status : "";
    const amount = integerAmount(link.total);
    const currency = typeof link.currency === "string" ? link.currency.toUpperCase() : "";

    if (!referenceId || !providerStatus || amount === null || currency !== "IQD") {
      throw new PaymentProviderError(
        "WAYL_INVALID_RESPONSE",
        "Wayl returned an incomplete payment status.",
        502,
      );
    }

    return {
      paymentId: typeof link.id === "string" ? link.id : null,
      referenceId,
      status: normalizeWaylStatus(providerStatus),
      providerStatus,
      amount,
      currency,
      raw: {
        referenceId,
        id: link.id,
        status: providerStatus,
        total: amount,
        currency,
        completedAt: link.completedAt,
      },
    };
  }

  async verifyWebhook(request: Request): Promise<WebhookResult> {
    const secret = requiredEnv("WAYL_WEBHOOK_SECRET");
    const signature = request.headers.get("x-wayl-signature-256")?.trim() ?? "";
    const rawBody = await request.text();

    if (!rawBody || rawBody.length > 128_000) {
      throw new PaymentProviderError(
        "INVALID_WEBHOOK_BODY",
        "Invalid webhook body.",
        400,
      );
    }

    const calculated = await signWaylWebhook(rawBody, secret);
    if (!constantTimeHexEqual(signature, calculated)) {
      throw new PaymentProviderError(
        "INVALID_WEBHOOK_SIGNATURE",
        "Invalid webhook signature.",
        401,
      );
    }

    let payload: WaylWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as WaylWebhookPayload;
    } catch {
      throw new PaymentProviderError("INVALID_WEBHOOK_JSON", "Invalid webhook JSON.", 400);
    }

    const referenceId =
      typeof payload.referenceId === "string" ? payload.referenceId.trim() : "";
    const providerStatus =
      typeof payload.paymentStatus === "string" ? payload.paymentStatus.trim() : "";
    const amount = integerAmount(payload.total);

    if (!referenceId || !providerStatus || amount === null) {
      throw new PaymentProviderError(
        "INVALID_WEBHOOK_EVENT",
        "Invalid webhook event.",
        400,
      );
    }

    return {
      eventKey: signature.toLowerCase(),
      paymentId: referenceId,
      providerPaymentId: typeof payload.id === "string" ? payload.id : null,
      providerStatus,
      status: normalizeWaylStatus(providerStatus),
      amount,
      currency: "IQD",
      // Do not persist Wayl's customer phone/address fields. The fulfillment
      // record only needs payment correlation and status evidence.
      payload: {
        event: payload.event,
        referenceId,
        paymentStatus: providerStatus,
        paymentProcessor: payload.paymentProcessor,
        total: amount,
        code: payload.code,
        id: payload.id,
      },
    };
  }
}
