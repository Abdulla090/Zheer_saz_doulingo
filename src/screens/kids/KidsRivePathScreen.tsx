import Constants, { ExecutionEnvironment } from "expo-constants";
import React from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { playButtonHaptic } from "../admin/rive/playButtonHaptic";

export default function KidsRivePathScreen(): React.ReactElement {
  const router = useRouter();
  
  const isExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
    Platform.OS === "web"; // Rive Native is disabled in Expo Go/Web, we load the specialized web component on web

  if (isExpoGo && Platform.OS !== "web") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F9FF" />
        <View style={styles.screen}>
          <Text style={styles.emoji}>🎨</Text>
          <Text style={styles.title}>PINGO Kids Map</Text>
          <Text style={styles.body}>
            The interactive Rive map uses advanced C++ rendering (via Nitro modules) which cannot run inside the standard Expo Go container.
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              pressed && styles.btnPressed
            ]}
            onPress={() => {
              playButtonHaptic();
              router.push("/(kids)/classic-path" as any);
            }}
          >
            <Text style={styles.btnText}>Go to Classic Path →</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (Platform.OS === "web") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const KidsRivePathScreenWeb = require("./KidsRivePathScreenImpl.web").default;
    return <KidsRivePathScreenWeb />;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const KidsRivePathScreenImpl = require("./KidsRivePathScreenImpl").default;
  return <KidsRivePathScreenImpl />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F5F9FF",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C59F3",
    marginBottom: 12,
    fontFamily: "DINNextRoundedBold",
  },
  body: {
    fontSize: 15,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    fontFamily: "DINNextRoundedMedium",
  },
  btn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  btnPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DINNextRoundedBold",
  },
});

