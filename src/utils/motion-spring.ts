import { Motion } from "../screens/lesson/games/game-design";
import { Platform } from "react-native";
import {
  Easing,
  withSpring,
  withTiming,
  type WithSpringConfig,
} from "react-native-reanimated";

/** Web Reanimated does not support custom spring easing — use timing there. */
export function springMotion(to: number, config: WithSpringConfig = Motion.soft) {
  if (Platform.OS === "web") {
    return withTiming(to, { duration: 220, easing: Easing.out(Easing.cubic) });
  }
  return withSpring(to, config);
}
