import React from "react";
import { View, SafeAreaView } from "react-native";
import { AppSettingsIcon } from "../../components/icons/AppHugeIcons";
import { AppText } from "../../components/ui/AppText";

export default function MoreScreenWeb() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <View
        style={{
          padding: 24,
          paddingBottom: 16,
          backgroundColor: "#FFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E5E5",
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <AppSettingsIcon size={28} />
          <AppText className="font-rd-bold" style={{ fontSize: 24, color: "#4B4B4B" }}>
            ڕێکخستنەکان (Settings)
          </AppText>
        </View>
        <AppText className="font-rd-medium" style={{ fontSize: 16, color: "#777" }}>
          فۆنتی ئەپ: Rabar 044
        </AppText>
      </View>
    </SafeAreaView>
  );
}
