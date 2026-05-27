import { Platform } from "react-native";

export const IS_IOS = Platform.OS === "ios";
export const IS_ANDROID = Platform.OS === "android";
export const IS_NATIVE = IS_IOS || IS_ANDROID;

/** Android release builds struggle with clip + SVG in virtualized lists. */
export const PATH_LIST_REMOVE_CLIPPED = IS_IOS;

/** Path nodes: skip SVG gradient defs on Android (url(#id) often fails in APK). */
export const PATH_NODE_SIMPLE_SHINE = IS_ANDROID;
