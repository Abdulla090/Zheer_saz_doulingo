export const ALL_RABAR_FONTS = [
  "Rabar_011",
  ...Array.from({ length: 57 }).map((_, i) => `Rabar_${String(i + 16).padStart(3, "0")}`),
];
