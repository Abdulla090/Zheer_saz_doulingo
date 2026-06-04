import Constants from "expo-constants";
import React from "react";

import JsTabsLayout from "@/navigation/JsTabsLayout";
import NativeTabsShell from "@/navigation/NativeTabsShell";

// Force JS tabs on Android for stability (unstable-native-tabs often breaks touches in ScrollViews)
const USE_JS_TABS = true;

export default USE_JS_TABS ? JsTabsLayout : NativeTabsShell;
