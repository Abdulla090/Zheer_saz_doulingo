/** Web-only helper to download JSON from admin export. */
export function downloadTextFile(filename: string, content: string) {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
