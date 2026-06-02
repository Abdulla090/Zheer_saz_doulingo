/** Paid shop / subscriptions — off until IAP is implemented. */
export const ENABLE_SHOP = false;

/** Content admin panel — on in dev or when EXPO_PUBLIC_ENABLE_ADMIN=true */
export const ENABLE_ADMIN =
  typeof __DEV__ !== "undefined"
    ? __DEV__ || process.env.EXPO_PUBLIC_ENABLE_ADMIN === "true"
    : process.env.EXPO_PUBLIC_ENABLE_ADMIN === "true";
