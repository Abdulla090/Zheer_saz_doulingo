import { Icon3DLock } from "../../../components/icons/Icon3D";
import { StyleSheet, Text, View } from "react-native";

/** Locked-section footer — no dead actions, informational only. */
export const ListFooter = () => (
  <View style={s.wrap}>
    <Icon3DLock size={20} />
    <Text style={s.title}>More lessons ahead</Text>
    <Text style={s.sub}>
      Complete lessons above to unlock the next section.
    </Text>
  </View>
);

const s = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },
  sub: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 280,
  },
});
