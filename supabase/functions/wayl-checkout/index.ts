import "@supabase/functions-js/edge-runtime.d.ts";

// Compatibility alias for web bundles deployed before `create-checkout`.
// Provider selection and all Twino business logic live in the shared handler.
export { default } from "../_shared/payments/checkout-handler.ts";
