import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

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

type CreditsBody = {
  action?: "balance" | "history" | "spend";
  amount?: unknown;
  reason?: unknown;
  idempotencyKey?: unknown;
};

type CreditTransactionRow = {
  id: string;
  type: string;
  amount: number;
  balance_after: number;
  reason: string | null;
  created_at: string;
};

function configuredCosts() {
  const raw = Deno.env.get("CREDIT_SPEND_COSTS_JSON")?.trim();
  if (!raw) return new Map<string, number>();

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return new Map(
      Object.entries(parsed)
        .filter(
          (entry): entry is [string, number] =>
            /^[a-z][a-z0-9_]{2,63}$/.test(entry[0]) &&
            typeof entry[1] === "number" &&
            Number.isSafeInteger(entry[1]) &&
            entry[1] > 0,
        )
        .map(([reason, amount]) => [reason, amount]),
    );
  } catch {
    return new Map<string, number>();
  }
}

const credits = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "POST") {
    return json({ code: "METHOD_NOT_ALLOWED", message: "Method not allowed." }, 405);
  }

  const userId = ctx.userClaims?.id;
  if (!userId) {
    return json({ code: "AUTH_REQUIRED", message: "Sign in to continue." }, 401);
  }
  // Database types are generated after the wallet migration is applied.
  // deno-lint-ignore no-explicit-any
  const admin = ctx.supabaseAdmin as any;

  let body: CreditsBody;
  try {
    body = (await req.json()) as CreditsBody;
  } catch {
    return json({ code: "INVALID_JSON", message: "Invalid request body." }, 400);
  }

  const action = body.action ?? "balance";

  if (action === "balance") {
    const { data, error } = await admin
      .from("credit_balances")
      .select("balance, updated_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Credit balance lookup failed", { code: error.code });
      return json(
        { code: "BALANCE_UNAVAILABLE", message: "Credit balance is unavailable." },
        503,
      );
    }

    return json({
      balance: data?.balance ?? 0,
      updatedAt: data?.updated_at ?? null,
    });
  }

  if (action === "history") {
    const { data, error } = await admin
      .from("credit_transactions")
      .select("id, type, amount, balance_after, reason, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Credit history lookup failed", { code: error.code });
      return json(
        { code: "HISTORY_UNAVAILABLE", message: "Credit history is unavailable." },
        503,
      );
    }

    return json({
      transactions: (data ?? []).map((transaction: CreditTransactionRow) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        balanceAfter: transaction.balance_after,
        reason: transaction.reason,
        createdAt: transaction.created_at,
      })),
    });
  }

  if (action !== "spend") {
    return json({ code: "INVALID_ACTION", message: "Invalid credit action." }, 400);
  }

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  const requestedAmount =
    typeof body.amount === "number" && Number.isSafeInteger(body.amount)
      ? body.amount
      : -1;
  const idempotencyKey =
    typeof body.idempotencyKey === "string" ? body.idempotencyKey.trim() : "";
  const costs = configuredCosts();
  const serverAmount = costs.get(reason);

  if (
    !serverAmount ||
    requestedAmount !== serverAmount ||
    idempotencyKey.length < 8 ||
    idempotencyKey.length > 120
  ) {
    return json(
      {
        code: "INVALID_SPEND",
        message: "This credit action is not configured.",
      },
      400,
    );
  }

  const { data: allowed, error: rateError } = await admin.rpc(
    "consume_wallet_rate_limit" as never,
    {
      p_scope: "credit-spend",
      p_subject: userId,
      p_limit: 30,
      p_window_seconds: 60,
    } as never,
  );
  if (rateError) {
    console.error("Credit spend rate limit failed", { code: rateError.code });
    return json(
      { code: "SPEND_UNAVAILABLE", message: "Credit spending is unavailable." },
      503,
    );
  }
  if (!allowed) {
    return json(
      {
        code: "RATE_LIMITED",
        message: "Too many credit requests. Please wait a moment.",
      },
      429,
    );
  }

  const { data, error } = await admin.rpc(
    "spend_credits" as never,
    {
      p_user_id: userId,
      p_amount: serverAmount,
      p_reason: reason,
      p_idempotency_key: idempotencyKey,
    } as never,
  );

  if (error) {
    if (error.message?.includes("INSUFFICIENT_CREDITS")) {
      return json(
        {
          code: "INSUFFICIENT_CREDITS",
          message:
            "You do not have enough credits. Visit the TWINO website to add credits.",
        },
        402,
      );
    }
    console.error("Credit spend failed", { code: error.code });
    return json(
      { code: "SPEND_UNAVAILABLE", message: "Unable to spend credits." },
      503,
    );
  }

  const result = Array.isArray(data) ? data[0] : data;
  return json({
    balance: result?.new_balance ?? 0,
    transactionId: result?.transaction_id ?? null,
    duplicate: Boolean(result?.duplicate),
  });
});

export default {
  fetch(req: Request) {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    return credits(req);
  },
};
