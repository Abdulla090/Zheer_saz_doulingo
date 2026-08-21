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
  action?: "balance" | "history";
};

type CreditTransactionRow = {
  id: string;
  type: string;
  amount: number;
  balance_after: number;
  reason: string | null;
  created_at: string;
};

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
      .from("wallets")
      .select("credit_balance, updated_at")
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
      balance: data?.credit_balance ?? 0,
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

  return json(
    {
      code: "INVALID_ACTION",
      message: "Balances are changed only by verified purchases and AI services.",
    },
    400,
  );
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const res = await credits(req);
    const newHeaders = new Headers(res.headers);
    Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } catch (err) {
    return Response.json(
      { code: "SERVER_ERROR", message: err instanceof Error ? err.message : String(err) },
      { status: 500, headers: corsHeaders },
    );
  }
});
