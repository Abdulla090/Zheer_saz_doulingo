import { PaymentProviderError } from "./errors.ts";
import { RasediProvider } from "./rasedi.ts";
import type { PaymentProvider, PaymentProviderName } from "./types.ts";
import { WaylProvider } from "./wayl.ts";

export function getPaymentProvider(name: PaymentProviderName): PaymentProvider {
  return name === "wayl" ? new WaylProvider() : new RasediProvider();
}

export function getConfiguredPaymentProvider() {
  const configured = Deno.env.get("PAYMENT_PROVIDER")?.trim().toLowerCase();
  if (configured !== "wayl" && configured !== "rasedi") {
    throw new PaymentProviderError(
      "PAYMENT_PROVIDER_NOT_CONFIGURED",
      "Checkout is waiting for a configured payment provider.",
      503,
    );
  }
  return getPaymentProvider(configured);
}
