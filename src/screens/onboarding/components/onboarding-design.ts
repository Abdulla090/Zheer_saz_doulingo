import { Platform } from "react-native";

export const ONBOARDING_DESIGN = {
  canvas: "#FAF7F1",
  paper: "#FCF9F4",
  paperRaised: "#FFFDF8",
  lavender: "#E9E3F0",
  lavenderDeep: "#B5A7CF",
  ink: "#292D2D",
  mutedInk: "#74736F",
  orange: "#EA7A24",
  orangePressed: "#D96A18",
  hairline: "rgba(72, 62, 52, 0.12)",
  paperShadow: "rgba(72, 55, 38, 0.18)",
  serif: Platform.select({
    ios: "Georgia",
    android: "serif",
    web: "Georgia, 'Times New Roman', serif",
    default: "serif",
  }),
} as const;

export const ONBOARDING_PAPER_SHADOW = Platform.select({
  web: {
    boxShadow:
      "0 18px 42px rgba(71, 55, 39, 0.14), 0 3px 8px rgba(71, 55, 39, 0.10), inset 0 1px 0 rgba(255,255,255,0.90)",
  },
  default: {
    shadowColor: "#473727",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
});
