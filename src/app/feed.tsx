import { Icon3DMessage } from "@/components/icons/Icon3D";
import { tabBarScrollPadding } from "@/constants/layout";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.root}>
      <LinearGradient
        colors={["#F4F9FF", "#FFFFFF"]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          s.content,
          {
            paddingTop: insets.top + 24,
            paddingBottom: tabBarScrollPadding(insets.bottom),
          },
        ]}
      >
        <View style={s.iconWrap}>
          <Icon3DMessage size={48} />
        </View>
        <Text style={s.title}>Community feed</Text>
        <Text style={s.sub}>Coming soon — share progress and tips with other learners.</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrap: {
    marginBottom: 8,
    opacity: 0.9,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
});
