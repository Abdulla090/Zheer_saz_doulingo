import "@supabase/functions-js/edge-runtime.d.ts";
import { createPaymentWebhookHandler } from "../_shared/payments/webhook-handler.ts";

export default createPaymentWebhookHandler("wayl");
