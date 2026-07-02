import React from "react";
import { Platform } from "react-native";
import { KidsCharacterGameProps } from "./KidsCharacterGame";

export function KidsRiveGame(props: KidsCharacterGameProps) {
  if (Platform.OS === "web") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const KidsRiveGameImplWeb = require("./KidsRiveGameImpl.web").default;
    return <KidsRiveGameImplWeb {...props} />;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const KidsRiveGameImpl = require("./KidsRiveGameImpl").default;
  return <KidsRiveGameImpl {...props} />;
}
