export type GuidebookAccent = {
  strong: string;
  deep: string;
  tint: string;
  soft: string;
};

const ACCENTS: Record<string, GuidebookAccent> = {
  blue: {
    strong: "#2D7FF9",
    deep: "#185CC5",
    tint: "#EAF2FF",
    soft: "#BFD7FF",
  },
  green: {
    strong: "#16A36A",
    deep: "#087A4B",
    tint: "#E8F8F0",
    soft: "#B5E8CE",
  },
  purple: {
    strong: "#7657E8",
    deep: "#5539B7",
    tint: "#F0ECFF",
    soft: "#D2C8FF",
  },
  yellow: {
    strong: "#D89400",
    deep: "#A86B00",
    tint: "#FFF7DD",
    soft: "#F6D989",
  },
  orange: {
    strong: "#F06A3A",
    deep: "#C84A20",
    tint: "#FFF0EA",
    soft: "#FFC9B5",
  },
  red: {
    strong: "#E74C5B",
    deep: "#B82D3B",
    tint: "#FFEDEF",
    soft: "#FFC5CB",
  },
  mint: {
    strong: "#159B91",
    deep: "#0B716A",
    tint: "#E6F8F6",
    soft: "#AFE5E0",
  },
  gray: {
    strong: "#64748B",
    deep: "#405167",
    tint: "#F1F5F9",
    soft: "#CBD5E1",
  },
};

export function getGuidebookAccent(theme: string): GuidebookAccent {
  return ACCENTS[theme] ?? ACCENTS.blue;
}
