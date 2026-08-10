import { PaymentProviderError } from "./errors.ts";
import type {
  CheckoutResult,
  PaymentOrder,
  PaymentProvider,
  PaymentStatus,
  WebhookResult,
} from "./types.ts";

function documentationRequired(): never {
  throw new PaymentProviderError(
    "RASEDI_DOCUMENTATION_REQUIRED",
    "Rasedi checkout is not enabled until merchant API and webhook documentation is supplied.",
    503,
  );
}

/**
 * Rasedi publicly advertises a unified payments API, but its field-level API,
 * status, and signature contract are not publicly documented. This adapter is
 * intentionally fail-closed so Twino business logic never guesses endpoints.
 */
export class RasediProvider implements PaymentProvider {
  readonly name = "rasedi" as const;

  createCheckout(_order: PaymentOrder): Promise<CheckoutResult> {
    return documentationRequired();
  }

  verifyPayment(_paymentId: string): Promise<PaymentStatus> {
    return documentationRequired();
  }

  verifyWebhook(_request: Request): Promise<WebhookResult> {
    return documentationRequired();
  }
}
