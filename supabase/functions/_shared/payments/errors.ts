export class PaymentProviderError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 503,
    readonly retryable = false,
  ) {
    super(message);
    this.name = "PaymentProviderError";
  }
}

export function publicProviderError(error: unknown) {
  if (error instanceof PaymentProviderError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
      retryable: error.retryable,
    };
  }

  return {
    code: "PAYMENT_PROVIDER_UNAVAILABLE",
    message: "The payment provider is temporarily unavailable.",
    status: 503,
    retryable: true,
  };
}
