import "@supabase/functions-js/edge-runtime.d.ts";

// Compatibility alias. PAYMENT_PROVIDER controls the adapter; Rasedi remains
// fail-closed until its real merchant documentation and credentials arrive.
export { default } from "../_shared/payments/checkout-handler.ts";
