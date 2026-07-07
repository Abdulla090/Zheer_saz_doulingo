import { Icon3DLock } from "../../../components/icons/Icon3D";
import { StyleSheet, View } from "react-native";
import { AppText } from "../../../components/ui/AppText";
import { useI18n } from "../../../hooks/useI18n";
import React from "react";

/** Locked-section footer — no dead actions, informational only. */
export const ListFooter = () => {
  const { isKu } = useI18n();

  return (
    <View style={s.wrap}>
      <Icon3DLock size={24} />
      <AppText
        style={s.title}
        forceKurdishFont={isKu}
        forceLatinFont={!isKu}
      >
        {isKu ? "وانە و یەکەکانی تر لەبەردەمن" : "More Units Ahead"}
      </AppText>
      <AppText
        style={s.sub}
        forceKurdishFont={isKu}
        forceLatinFont={!isKu}
      >
        {isKu 
          ? "پێویستە هەموو وانەکانی پێشوو تەواو بکەیت بۆ ئەوەی یەکەکان یان ئاستەکانی دواتر چالاک ببن بەپێی ئاستی دیاریکراوت."
          : "You should complete all the other previous lessons first to activate more units based on your target level."
        }
      </AppText>
    </View>
  );
};

const s = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },
  sub: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },
});
