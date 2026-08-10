import "@supabase/functions-js/edge-runtime.d.ts";
import { createPaymentWebhookHandler } from "../_shared/payments/webhook-handler.ts";

// This endpoint is already wired and fail-closed. RasediProvider will begin
// verifying signatures only after Rasedi supplies its merchant documentation.
export default createPaymentWebhookHandler("rasedi");
