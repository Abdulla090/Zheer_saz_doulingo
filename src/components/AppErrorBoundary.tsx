import { useI18n } from "@/hooks/useI18n";
import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) {
      console.error("AppErrorBoundary", error, info.componentStack);
    }
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback onRetry={this.reset} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  return (
    <View
      style={[
        styles.fallback,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Text style={styles.title} accessibilityRole="header">
        {t("errors.title")}
      </Text>
      <Text style={styles.body}>{t("errors.body")}</Text>
      <Pressable
        onPress={onRetry}
        style={styles.btn}
        accessibilityRole="button"
        accessibilityLabel={t("errors.retry")}
      >
        <Text style={styles.btnText}>{t("errors.retry")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A2B48",
    marginBottom: 8,
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: "DINNextRoundedMedium",
  },
  btn: {
    backgroundColor: "#2B59F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
});
