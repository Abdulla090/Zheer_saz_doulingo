import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, {
    status,
    headers: { ...corsHeaders, "Cache-Control": "no-store" },
  });

const account = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "POST") {
    return json({ code: "METHOD_NOT_ALLOWED", message: "Method not allowed." }, 405);
  }

  const userId = ctx.userClaims?.id;
  if (!userId) {
    return json({ code: "AUTH_REQUIRED", message: "Sign in to continue." }, 401);
  }
  // deno-lint-ignore no-explicit-any
  const admin = ctx.supabaseAdmin as any;

  const { error: expiryError } = await admin.rpc("expire_user_subscription", {
    p_user_id: userId,
  });
  if (expiryError) {
    console.error("Subscription expiry refresh failed", { code: expiryError.code });
    return json(
      { code: "ACCOUNT_UNAVAILABLE", message: "Account billing is unavailable." },
      503,
    );
  }

  const { error: starterError } = await admin.rpc("grant_starter_credits", {
    p_user_id: userId,
  });
  if (starterError) {
    console.error("Starter credit grant failed", { code: starterError.code });
    return json(
      { code: "ACCOUNT_UNAVAILABLE", message: "Account billing is unavailable." },
      503,
    );
  }

  const [walletResult, subscriptionResult, pricesResult] = await Promise.all([
    admin
      .from("wallets")
      .select("credit_balance, updated_at")
      .eq("user_id", userId)
      .maybeSingle(),
    admin
      .from("subscriptions")
      .select("plan, status, starts_at, expires_at, provider, updated_at")
      .eq("user_id", userId)
      .maybeSingle(),
    admin
      .from("ai_credit_prices")
      .select("feature_key, credit_cost")
      .eq("active", true),
  ]);

  if (walletResult.error || subscriptionResult.error || pricesResult.error) {
    console.error("Billing account lookup failed", {
      walletCode: walletResult.error?.code,
      subscriptionCode: subscriptionResult.error?.code,
      pricesCode: pricesResult.error?.code,
    });
    return json(
      { code: "ACCOUNT_UNAVAILABLE", message: "Account billing is unavailable." },
      503,
    );
  }

  const subscription = subscriptionResult.data;
  const plan =
    subscription?.status === "active" &&
    ["plus", "pro", "max"].includes(subscription.plan)
      ? subscription.plan
      : "free";
  const features = {
    normal_path: true,
    street_path: plan !== "free",
    kids_path: plan !== "free",
    exam_preview: plan !== "free",
    exam_enhanced: plan === "pro" || plan === "max",
    exam_full: plan === "max",
    mock_exam_preview: plan !== "free",
    mock_exam_full: plan === "max",
    advanced_ai_features: plan === "pro" || plan === "max",
    advanced_ai_evaluation: plan === "max",
  };
  const aiPrices = Object.fromEntries(
    (pricesResult.data ?? []).map(
      (row: { feature_key: string; credit_cost: number }) => [
        row.feature_key,
        row.credit_cost,
      ],
    ),
  );
  const creditBalance = walletResult.data?.credit_balance ?? 0;
  const expiresAt = plan === "free" ? null : subscription?.expires_at ?? null;
  return json({
    wallet: {
      creditBalance,
      updatedAt: walletResult.data?.updated_at ?? null,
    },
    subscription: {
      plan: subscription?.plan ?? "free",
      status: subscription?.status ?? "active",
      startsAt: subscription?.starts_at ?? null,
      expiresAt: subscription?.expires_at ?? null,
      provider: subscription?.provider ?? null,
      updatedAt: subscription?.updated_at ?? null,
    },
    entitlements: {
      currentPlan: plan,
      expiresAt,
      features,
      creditBalance,
      aiPrices,
    },
  });
});

export default {
  fetch(req: Request) {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    return account(req);
  },
};
