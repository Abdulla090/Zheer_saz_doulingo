export type PaymentProviderName = "wayl" | "rasedi";

export type PaymentOrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired"
  | "refunded";

export type PaymentProductType = "credits" | "subscription";
export type SubscriptionPlan = "plus" | "pro" | "max";

export type PaymentOrder = {
  id: string;
  userId: string;
  provider: PaymentProviderName;
  amount: number;
  currency: string;
  productType: PaymentProductType;
  credits: number | null;
  includedCredits: number;
  plan: SubscriptionPlan | null;
  subscriptionDays: number | null;
  productName: string;
};

export type CheckoutResult = {
  checkoutUrl: string;
  paymentId: string | null;
  providerStatus: string;
  raw: Record<string, unknown>;
};

export type PaymentStatus = {
  paymentId: string | null;
  referenceId: string;
  status: PaymentOrderStatus;
  providerStatus: string;
  amount: number;
  currency: string;
  raw: Record<string, unknown>;
};

export type WebhookResult = {
  eventKey: string;
  paymentId: string;
  providerPaymentId: string | null;
  providerStatus: string;
  status: PaymentOrderStatus;
  amount: number;
  currency: string;
  payload: Record<string, unknown>;
};

export interface PaymentProvider {
  readonly name: PaymentProviderName;
  createCheckout(order: PaymentOrder): Promise<CheckoutResult>;
  verifyPayment(paymentId: string): Promise<PaymentStatus>;
  verifyWebhook(request: Request): Promise<WebhookResult>;
  refund?(paymentId: string): Promise<void>;
}
