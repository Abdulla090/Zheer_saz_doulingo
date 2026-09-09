import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { PressableScale } from "../../../components/animations";
import { AppText } from "../../../components/ui/AppText";
import { useGamesTheme } from "../../games/games-theme";
import {
  generateAtomBuilderHtml,
  generateBalanceScaleHtml,
  generateChessTacticsHtml,
  generateCircuitSimHtml,
  generateCoordinateGraphHtml,
  generateLeverTorqueHtml,
  prepareSandboxedHtml,
} from "../../../services/study-simulation-templates";
import type { InteractiveWidgetState } from "../../../services/study-tutor-service";

type TwinoBridgeMessage = {
  type: "haptic" | "solved" | "error" | "ready" | "param_change";
  style?: "light" | "medium" | "heavy" | "success" | "selection";
  message?: string;
  name?: string;
  value?: unknown;
};

/**
 * Resolves the self-contained simulation HTML from either:
 * 1. AI-generated dynamic HTML (`widgetState.html`)
 * 2. AI-generated JavaScript simulation code wrapped into HTML (`widgetState.code`)
 * 3. Topic/preset generator fallback based on `widgetState.type`
 */
function resolveSimulationHtml(
  widgetState: InteractiveWidgetState,
  isDark: boolean,
): string {
  if (
    (widgetState.html && widgetState.html.trim().length > 15) ||
    (widgetState.code && widgetState.code.trim().length > 10)
  ) {
    return prepareSandboxedHtml({
      html: widgetState.html,
      code: widgetState.code,
      title: widgetState.title,
      isDark,
    });
  }

  // Fallback to dynamic simulation templates by preset type
  const type = widgetState.type;
  const cfg = widgetState.config || {};

  switch (type) {
    case "balance-scale":
      return generateBalanceScaleHtml(cfg, isDark);
    case "coordinate-graph":
      return generateCoordinateGraphHtml(cfg, isDark);
    case "lever-torque":
      return generateLeverTorqueHtml(cfg, isDark);
    case "circuit-sim":
      return generateCircuitSimHtml(cfg, isDark);
    case "atom-builder":
      return generateAtomBuilderHtml(cfg, isDark);
    case "chess-tactics":
      return generateChessTacticsHtml(cfg, isDark);
    default:
      return prepareSandboxedHtml({
        title: widgetState.title || "Interactive Concept",
        isDark,
      });
  }
}

/**
 * Sandboxed Dynamic Interactive Code Execution Runner.
 * Renders HTML5 Canvas / SVG / JS generated dynamically by Gemini or curriculum presets.
 * Supports cross-platform execution (WebView on iOS/Android, iframe on Web),
 * touch/drag manipulation, bidirectional messaging, haptics, and error recovery.
 */
export function StudyInteractiveCanvas({
  widgetState,
  style,
}: {
  widgetState: InteractiveWidgetState;
  style?: ViewStyle;
}) {
  const theme = useGamesTheme();
  const isDark = theme.isDark;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showPythonCalculations, setShowPythonCalculations] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const webViewRef = useRef<WebView>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const simulationHtml = useMemo(
    () => resolveSimulationHtml(widgetState, isDark),
    [widgetState, isDark],
  );

  // Reset states when the active widget changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);
    setIsSolved(false);
    setShowPythonCalculations(false);
  }, [widgetState.type, widgetState.title, widgetState.html, reloadKey]);

  // Handle messages dispatched from the sandboxed simulation
  const handleBridgeMessage = useCallback((payload: unknown) => {
    let msg: TwinoBridgeMessage | null = null;
    try {
      if (typeof payload === "string") {
        msg = JSON.parse(payload) as TwinoBridgeMessage;
      } else if (payload && typeof payload === "object") {
        msg = payload as TwinoBridgeMessage;
      }
    } catch {
      return;
    }

    if (!msg) return;

    switch (msg.type) {
      case "ready":
        setIsLoading(false);
        break;
      case "solved":
        setIsSolved(true);
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "haptic":
        if (msg.style === "light") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (msg.style === "medium") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (msg.style === "heavy") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else if (msg.style === "selection") {
          void Haptics.selectionAsync();
        } else if (msg.style === "success") {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        break;
      case "error":
        setHasError(true);
        setErrorMessage(msg.message || "An error occurred in simulation code");
        setIsLoading(false);
        break;
    }
  }, []);

  // Native WebView message handler
  const onWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      handleBridgeMessage(event.nativeEvent.data);
    },
    [handleBridgeMessage],
  );

  // Web iframe message listener
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const onWindowMessage = (event: MessageEvent) => {
      handleBridgeMessage(event.data);
    };

    window.addEventListener("message", onWindowMessage);
    return () => {
      window.removeEventListener("message", onWindowMessage);
    };
  }, [handleBridgeMessage]);

  // Live theme synchronization to sandboxed frame
  useEffect(() => {
    const themeMsg = JSON.stringify({
      type: "set_theme",
      isDark,
      theme: {
        bg: isDark ? "#0F172A" : "#FFFFFF",
        surface: isDark ? "#1E293B" : "#F8FAFC",
        text: isDark ? "#F8FAFC" : "#0F172A",
        muted: isDark ? "#94A3B8" : "#64748B",
        border: isDark ? "#334155" : "#E2E8F0",
      },
    });

    if (Platform.OS === "web") {
      iframeRef.current?.contentWindow?.postMessage(themeMsg, "*");
    } else if (typeof webViewRef.current?.postMessage === "function") {
      webViewRef.current.postMessage(themeMsg);
    }
  }, [isDark]);

  // Dispatch reset message to sandboxed simulation
  const handleResetSimulation = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSolved(false);

    const resetMsg = JSON.stringify({ type: "reset" });
    if (Platform.OS === "web") {
      iframeRef.current?.contentWindow?.postMessage(resetMsg, "*");
    } else if (typeof webViewRef.current?.postMessage === "function") {
      webViewRef.current.postMessage(resetMsg);
    }
  }, []);

  // Reload simulation
  const handleReload = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReloadKey((prev) => prev + 1);
  }, []);

  const hasPythonCode = Boolean(
    widgetState.executedPythonCode || widgetState.executedPythonOutput,
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {/* Apple HIG Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.titleBadgeContainer}>
          <View
            style={[
              styles.simTypeBadge,
              {
                backgroundColor: isSolved
                  ? "rgba(16, 185, 129, 0.15)"
                  : isDark
                    ? "rgba(37, 99, 235, 0.18)"
                    : "rgba(37, 99, 235, 0.10)",
                borderColor: isSolved ? "#10B981" : "rgba(37, 99, 235, 0.3)",
              },
            ]}
          >
            <AppText
              style={[
                styles.simTypeBadgeText,
                { color: isSolved ? "#10B981" : "#2563EB" },
              ]}
            >
              {isSolved ? "✓ EQUILIBRIUM" : (widgetState.title || "SIMULATION").toUpperCase()}
            </AppText>
          </View>

          {hasPythonCode ? (
            <PressableScale
              onPress={() => setShowPythonCalculations((prev) => !prev)}
              style={styles.pyBadge}
            >
              <AppText style={styles.pyBadgeText}>
                {showPythonCalculations ? "Hide Python" : "Python Math"}
              </AppText>
            </PressableScale>
          ) : null}
        </View>

        <View style={styles.actionsGroup}>
          <PressableScale onPress={handleResetSimulation} style={styles.resetBtn}>
            <AppText style={styles.resetBtnText}>Reset</AppText>
          </PressableScale>
        </View>
      </View>

      {/* Collapsible Background Python Execution Disclosure */}
      {showPythonCalculations && hasPythonCode ? (
        <View
          style={[
            styles.pythonDisclosureBox,
            {
              backgroundColor: isDark ? "#0F172A" : "#F1F5F9",
              borderColor: theme.border,
            },
          ]}
        >
          <AppText style={[styles.pythonDisclosureTitle, { color: theme.ink }]}>
            Gemini Python Background Calculations
          </AppText>
          {Boolean(widgetState.executedPythonCode) ? (
            <AppText style={[styles.codeSnippet, { color: theme.mutedInk }]}>
              {widgetState.executedPythonCode}
            </AppText>
          ) : null}
          {Boolean(widgetState.executedPythonOutput) ? (
            <AppText style={[styles.codeOutput, { color: "#10B981" }]}>
              Output: {widgetState.executedPythonOutput}
            </AppText>
          ) : null}
        </View>
      ) : null}

      {/* Dynamic Sandboxed Simulation Frame */}
      <View
        style={styles.runnerViewport}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
      >
        {isLoading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#2563EB" />
          </View>
        ) : null}

        {hasError ? (
          <View style={styles.errorContainer}>
            <AppText style={styles.errorText}>
              {errorMessage || "Simulation encountered a runtime error."}
            </AppText>
            <PressableScale onPress={handleReload} style={styles.retryBtn}>
              <AppText style={styles.retryBtnText}>Reload Simulation</AppText>
            </PressableScale>
          </View>
        ) : Platform.OS === "web" ? (
          <iframe
            key={`web-frame-${reloadKey}-${widgetState.title}`}
            ref={iframeRef}
            srcDoc={simulationHtml}
            sandbox="allow-scripts allow-forms"
            style={{
              width: "100%",
              height: 290,
              border: "none",
              borderRadius: 14,
              backgroundColor: "transparent",
            }}
            title={widgetState.title || "Interactive Simulation"}
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <WebView
            key={`native-wv-${reloadKey}-${widgetState.title}`}
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: simulationHtml }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
            bounces={false}
            onMessage={onWebViewMessage}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderCurve: "continuous",
    borderWidth: 1,
    padding: 14,
    overflow: "hidden",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  simTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  simTypeBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  pyBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
  },
  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  pythonDisclosureBox: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 4,
  },
  pythonDisclosureTitle: {
    fontSize: 11,
    fontWeight: "800",
  },
  codeSnippet: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 10,
    lineHeight: 14,
  },
  codeOutput: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 10,
    fontWeight: "700",
  },
  runnerViewport: {
    width: "100%",
    height: 290,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "transparent",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  webView: {
    width: "100%",
    height: 290,
    backgroundColor: "transparent",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#2563EB",
    borderRadius: 8,
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
