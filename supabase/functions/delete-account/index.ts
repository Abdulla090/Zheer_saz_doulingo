import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-region, prefer",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store",
    },
  });

const deleteAccount = withSupabase(
  { auth: "user" },
  async (req, ctx) => {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    // The account id is resolved exclusively from the verified user token.
    // Never accept a user id from the request body for this operation.
    const userId = ctx.userClaims?.id;
    if (!userId) {
      return json({ error: "Authentication required" }, 401);
    }

    const avatarBucket = ctx.supabaseAdmin.storage.from("avatars");
    const { data: avatarObjects, error: avatarListError } = await avatarBucket.list(userId, {
      limit: 100,
    });
    if (avatarListError) {
      console.error("Avatar listing failed", { code: avatarListError.name });
      return json({ error: "Unable to delete account data" }, 500);
    }

    const avatarPaths = (avatarObjects ?? []).map((object) => `${userId}/${object.name}`);
    if (avatarPaths.length > 0) {
      const { error: avatarDeleteError } = await avatarBucket.remove(avatarPaths);
      if (avatarDeleteError) {
        console.error("Avatar deletion failed", { code: avatarDeleteError.name });
        return json({ error: "Unable to delete account data" }, 500);
      }
    }

    const { error } = await ctx.supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error("Account deletion failed", { code: error.code });
      return json({ error: "Unable to delete account" }, 500);
    }

    return json({ deleted: true });
  },
);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const res = await deleteAccount(req);
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
