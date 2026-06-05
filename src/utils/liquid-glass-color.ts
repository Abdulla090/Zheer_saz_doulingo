const PRIMARY_BLUE_HEX = new Set([
  "#2b59f3",
  "#0a84ff",
  "#1cb0f6",
  "#3b82f6",
  "#2563eb",
  "#1d4ed8",
]);

/** Solid brand-blue CTAs keep fill; neutral surfaces use liquid glass. */
export function isPrimaryBlueButton(color: string): boolean {
  const c = color.trim().toLowerCase().replace(/\s/g, "");
  if (PRIMARY_BLUE_HEX.has(c)) return true;
  if (c.includes("43,89,243") || c.includes("10,132,255")) return true;
  if (c.startsWith("#2b59") || c.startsWith("#0a84")) return true;
  return false;
}

export function prefersLiquidGlass(faceColor: string): boolean {
  if (isPrimaryBlueButton(faceColor)) return false;

  const c = faceColor.trim().toLowerCase().replace(/\s/g, "");
  if (c === "transparent" || c === "white" || c === "#fff" || c === "#ffffff") {
    return true;
  }
  if (c.includes("255,255,255") || c.includes("241,245,249") || c.includes("248,250,252")) {
    return true;
  }
  if (c.includes("f3f4f6") || c.includes("eef2f6") || c.includes("e8edf2")) return true;

  if (c.startsWith("#") && c.length >= 7) {
    const hex = c.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (r > 228 && g > 228 && b > 228) return true;
  }

  return false;
}
