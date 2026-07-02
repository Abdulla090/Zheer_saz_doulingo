import type { ImageSource } from "expo-image";
import { Platform } from "react-native";

/**
 * Kids game PNGs are often white line-art on transparency. They must render
 * on a dark well to stay visible. This helper also fixes web asset URIs.
 */
export function resolveKidsImageSource(source: unknown): ImageSource {
  if (!source) {
    return source as ImageSource;
  }

  if (typeof source === "object" && source !== null && "uri" in source) {
    return source as ImageSource;
  }

  if (Platform.OS === "web") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Asset } = require("expo-asset") as typeof import("expo-asset");
    const asset = Asset.fromModule(source as number);
    return { uri: asset.uri };
  }

  return source as ImageSource;
}

export const kidsImageWellStyle = {
  backgroundColor: "#1E293B",
  borderRadius: 18,
  overflow: "hidden" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};
