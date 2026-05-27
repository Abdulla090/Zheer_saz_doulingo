import { TextStyle } from "react-native";

const RTL_CHAR = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

export function isRtlText(text: string): boolean {
  return RTL_CHAR.test(text);
}

export const rtlText: TextStyle = {
  writingDirection: "rtl",
  textAlign: "right",
};

export const ltrText: TextStyle = {
  writingDirection: "ltr",
  textAlign: "left",
};

export const centerText: TextStyle = {
  writingDirection: "ltr",
  textAlign: "center",
};

/** Pick direction from content — use on mixed Kurdish/English screens. */
export function dirForText(text: string): TextStyle {
  return isRtlText(text) ? rtlText : ltrText;
}

/** Full-width RTL block (Kurdish hints/prompts above cards). */
export const rtlBlock: TextStyle = {
  ...rtlText,
  width: "100%",
  alignSelf: "stretch",
};
