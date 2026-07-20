import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });

type WaylWebhook = {
  event?: unknown;
  referenceId?: unknown;
  paymentStatus?: unknown;
  total?: unknown;
  id?: unknown;
};

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeHexEqual(left: string, right: string) {
  if (
    left.length !== 64 ||
    right.length !== 64 ||
    !/^[0-9a-f]{64}$/i.test(left) ||
    !/^[0-9a-f]{64}$/i.test(right)
  ) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function calculateSignature(rawBody: string, secret: string) {
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

function normalizeWaylStatus(value: string) {
  const status = value.trim().toLowerCase();
  if (["complete", "completed", "delivered", "paid"].includes(status)) {
    return "paid";
  }
  if (["cancelled", "canceled", "rejected", "failed"].includes(status)) {
    return "failed";
  }
  if (["expired"].includes(status)) {
    return "expired";
  }
  if (["returned", "refunded"].includes(status)) {
    return "refunded";
  }
  return "pending";
}

const webhook = withSupabase({ auth: "none" }, async (req, ctx) => {
  if (req.method !== "POST") {
    return json({ received: false, code: "METHOD_NOT_ALLOWED" }, 405);
  }
  // The wallet migration is applied before database types are regenerated.
  // deno-lint-ignore no-explicit-any
  const admin = ctx.supabaseAdmin as any;

  const secret = Deno.env.get("WAYL_WEBHOOK_SECRET")?.trim();
  if (!secret || secret.length < 32) {
    console.error("Wayl webhook secret is not configured");
    return json({ received: false, code: "WEBHOOK_NOT_CONFIGURED" }, 503);
  }

  const signature = req.headers.get("x-wayl-signature-256")?.trim() ?? "";
  const rawBody = await req.text();
  if (!rawBody || rawBody.length > 128_000) {
    return json({ received: false, code: "INVALID_BODY" }, 400);
  }

  const calculatedSignature = await calculateSignature(rawBody, secret);
  if (!constantTimeHexEqual(signature, calculatedSignature)) {
    return json({ received: false, code: "INVALID_SIGNATURE" }, 401);
  }

  let payload: WaylWebhook;
  try {
    payload = JSON.parse(rawBody) as WaylWebhook;
  } catch {
    return json({ received: false, code: "INVALID_JSON" }, 400);
  }

  const referenceId =
    typeof payload.referenceId === "string" ? payload.referenceId.trim() : "";
  const waylStatus =
    typeof payload.paymentStatus === "string" ? payload.paymentStatus.trim() : "";
  const eventId = typeof payload.id === "string" ? payload.id.trim() : "";
  const total =
    typeof payload.total === "number" && Number.isSafeInteger(payload.total)
      ? payload.total
      : -1;

  if (
    !referenceId ||
    referenceId.length > 160 ||
    !waylStatus ||
    waylStatus.length > 80 ||
    total < 0
  ) {
    return json({ received: false, code: "INVALID_EVENT" }, 400);
  }

  const normalizedStatus = normalizeWaylStatus(waylStatus);
  const { data, error } = await admin.rpc(
    "record_wayl_payment_event" as never,
    {
      p_reference_id: referenceId,
      p_signature: signature.toLowerCase(),
      p_event_id: eventId,
      p_wayl_status: waylStatus,
      p_normalized_status: normalizedStatus,
      p_total_iqd: total,
      p_payload: payload,
    } as never,
  );

  if (error) {
    const notFound = error.message?.includes("WAYL_PAYMENT_NOT_FOUND");
    const amountMismatch = error.message?.includes("WAYL_AMOUNT_MISMATCH");
    console.error("Wayl event processing failed", {
      code: error.code,
      notFound,
      amountMismatch,
    });
    return json(
      {
        received: false,
        code: notFound
          ? "PAYMENT_NOT_FOUND"
          : amountMismatch
            ? "AMOUNT_MISMATCH"
            : "PROCESSING_FAILED",
      },
      notFound ? 404 : amountMismatch ? 409 : 500,
    );
  }

  const result = Array.isArray(data) ? data[0] : data;
  return json({
    received: true,
    status: result?.payment_status ?? normalizedStatus,
    creditsApplied: Boolean(result?.credits_applied),
  });
});

export default {
  fetch(req: Request) {
    return webhook(req);
  },
};
