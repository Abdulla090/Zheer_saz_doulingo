/** Public contact for store listings and in-app legal screens. */
export const SUPPORT_EMAIL = "support@twino.app";

/** Optional hosted policy URL (GitHub Pages, website). In-app text is always available. */
export const PRIVACY_POLICY_URL =
  process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ??
  "https://abdulla090.github.io/Zheer_saz_doulingo/privacy/";

/** Public help page used by App Store and Google Play listings. */
export const SUPPORT_URL =
  process.env.EXPO_PUBLIC_SUPPORT_URL ??
  "https://abdulla090.github.io/Zheer_saz_doulingo/support/";

/** Hosted credit-pack page used by native builds. Checkout stays on the web. */
export const SUBSCRIPTION_URL =
  process.env.EXPO_PUBLIC_SUBSCRIPTION_URL ??
  "https://twino-six.vercel.app/credits";

export const APP_VERSION = "1.0.0";
