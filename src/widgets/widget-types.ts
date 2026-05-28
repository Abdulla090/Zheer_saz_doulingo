export type { PhingoWidgetPayload, PhingoWidgetId } from "./widget-payload";
export { WIDGET_SNAPSHOT_KEY, WIDGET_IDS } from "./widget-payload";

/** @deprecated Use PhingoWidgetPayload */
export type PhingoHomeWidgetPayload = import("./widget-payload").PhingoWidgetPayload;
