import { hapticImpact } from "../../../utils/haptics";
import * as Haptics from "expo-haptics";

export function playButtonHaptic() {
  hapticImpact(Haptics.ImpactFeedbackStyle.Medium);
}
