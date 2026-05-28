import { I18nManager, Platform, TextStyle, ViewStyle } from "react-native";

export type AppLocale = "en" | "ku";

export function localeIsRtl(locale: AppLocale): boolean {
  return locale === "ku";
}

export function layoutDirection(isRtl: boolean): "rtl" | "ltr" {
  return isRtl ? "rtl" : "ltr";
}

/** Mirror flex + layout for a screen subtree (RN `direction`). */
export function directionStyle(isRtl: boolean): ViewStyle {
  return { direction: layoutDirection(isRtl) };
}

export function rtlRoot(isRtl: boolean): ViewStyle {
  return {
    flex: 1,
    ...directionStyle(isRtl),
  };
}

export function rtlRow(isRtl: boolean): ViewStyle {
  return { flexDirection: isRtl ? "row-reverse" : "row" };
}

export function rtlText(isRtl: boolean, extra?: TextStyle): TextStyle {
  return {
    writingDirection: isRtl ? "rtl" : "ltr",
    textAlign: isRtl ? "right" : "left",
    ...extra,
  };
}

export function rtlTextCenter(isRtl: boolean, extra?: TextStyle): TextStyle {
  return {
    writingDirection: isRtl ? "rtl" : "ltr",
    textAlign: "center",
    ...extra,
  };
}

/** Physical start edge (padding/margin that follows reading direction). */
export function edgeStart(isRtl: boolean, value: number): ViewStyle {
  return isRtl ? { marginRight: value } : { marginLeft: value };
}

export function edgeEnd(isRtl: boolean, value: number): ViewStyle {
  return isRtl ? { marginLeft: value } : { marginRight: value };
}

/**
 * Swipe delta toward "next" in onboarding carousels.
 * LTR: swipe left (negative X). RTL: swipe right (positive X).
 */
export function isSwipeNext(translationX: number, isRtl: boolean): boolean {
  return isRtl ? translationX > 40 : translationX < -40;
}

/**
 * Optional native RTL (icons, system chrome). Layout still uses `direction` per screen.
 * Avoids reload when only using View direction; call when locale changes.
 */
export function syncNativeRtl(isRtl: boolean): void {
  if (Platform.OS === "web") {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", isRtl ? "ckb" : "en");
    }
    return;
  }
  try {
    I18nManager.allowRTL(true);
    if (I18nManager.isRTL !== isRtl) {
      I18nManager.forceRTL(isRtl);
    }
  } catch {
    /* ignore */
  }
}
