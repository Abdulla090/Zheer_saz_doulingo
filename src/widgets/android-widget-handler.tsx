import { appStorage } from "../lib/app-storage";
import { registerWidgetTaskHandler } from "react-native-android-widget";

import { TwinoHomeAndroidWidget } from "./TwinoHomeAndroidWidget";
import {
  ANDROID_WIDGET_NAME,
  WIDGET_SNAPSHOT_KEY,
  type TwinoHomeWidgetPayload,
} from "./widget-types";

const DEFAULT_PAYLOAD: TwinoHomeWidgetPayload = {
  streak: 0,
  dailyXp: 0,
  dailyGoalXp: 15,
  streetPercent: 0,
  normalPercent: 0,
  streetLabel: "Kurdish",
  normalLabel: "English",
  nextTitle: "Start learning",
  nextSubtitle: "Open Twino",
  recentTitle: "",
  recentSubtitle: "",
};

async function readPayload(): Promise<TwinoHomeWidgetPayload> {
  try {
    const raw = await appStorage.getItem(WIDGET_SNAPSHOT_KEY);
    if (!raw) return DEFAULT_PAYLOAD;
    return { ...DEFAULT_PAYLOAD, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PAYLOAD;
  }
}

let registered = false;

/** Registers the Android widget headless task (safe to call more than once). */
export function registerTwinoAndroidWidgetHandler(): void {
  if (registered) return;
  registered = true;

  registerWidgetTaskHandler(async ({ widgetInfo, widgetAction, renderWidget }) => {
    if (widgetInfo.widgetName !== ANDROID_WIDGET_NAME) return;
    if (widgetAction === "WIDGET_DELETED") return;

    const payload = await readPayload();
    renderWidget(<TwinoHomeAndroidWidget {...payload} />);
  });
}
