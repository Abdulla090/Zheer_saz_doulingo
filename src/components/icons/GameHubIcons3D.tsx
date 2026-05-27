import {
  Icon3DGamepad,
  Icon3DGradCap,
  Icon3DLayers,
  Icon3DMic,
  Icon3DMessage,
  Icon3DBook,
} from "@/components/icons/Icon3D";
import React from "react";

/** Soft 3D hub icons — same extruded style as lesson / home UI */
export function OrderWordsGameIcon3D({ size = 56 }: { size?: number }) {
  return <Icon3DLayers size={size} active />;
}

export function PairWordsGameIcon3D({ size = 56 }: { size?: number }) {
  return <Icon3DBook size={size} />;
}

export function SpeakUpGameIcon3D({ size = 56 }: { size?: number }) {
  return <Icon3DMic size={size} />;
}

export function AiTeacherGameIcon3D({ size = 56 }: { size?: number }) {
  return <Icon3DGradCap size={size} />;
}

export function RolePlayGameIcon3D({ size = 56 }: { size?: number }) {
  return <Icon3DMessage size={size} />;
}

export function GamesHubIcon3D({ size = 56 }: { size?: number }) {
  return <Icon3DGamepad size={size} />;
}
