import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: { persistSession: false },
    });

    const body = await req.json();
    const { transactionId, status, userId, planId } = body;

    if (!transactionId || !status || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: subError } = await serviceClient
      .from("subscriptions")
      .update({ status: status === "success" ? "completed" : "failed" })
      .eq("provider_tx_id", transactionId);

    if (subError) {
      console.warn("Failed to update subscription:", subError.message);
    }

    let tierName = "Super";
    const numericPlanId = Number(planId);
    if (numericPlanId === 2) tierName = "Super Family";
    if (numericPlanId === 3) tierName = "Max";
    if (numericPlanId === 4) tierName = "Max Family";

    if (status === "success") {
      const { error: profileError } = await serviceClient
        .from("profiles")
        .update({
          is_premium: true,
          subscription_tier: tierName,
        })
        .eq("id", userId);

      if (profileError) {
        throw profileError;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
