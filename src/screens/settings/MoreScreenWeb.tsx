import React from "react";
import { View, SafeAreaView } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { PressableScale } from "../../components/animations";
import { useFontStore } from "../../stores/useFontStore";
import { ALL_RABAR_FONTS } from "../../constants/rabar-fonts";
import { Icon3DSettings, Icon3DChevronRight, Icon3DCheckCircle } from "../../components/icons/Icon3D";
import { AppText } from "../../components/ui/AppText";

export default function MoreScreenWeb() {
  const { selectedFont, setFont } = useFontStore();

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
          <Icon3DSettings size={28} />
          <AppText className="font-rd-bold" style={{ fontSize: 24, color: "#4B4B4B" }}>
            ڕێکخستنەکان (Settings)
          </AppText>
        </View>
        <AppText className="font-rd-medium" style={{ fontSize: 16, color: "#777" }}>
          جۆری فۆنتی دڵخوازت لێرە هەڵبژێرە. گۆڕانکارییەکان یەکسەر جێبەجێ دەبن!
        </AppText>
      </View>

      <FlashList
        data={ALL_RABAR_FONTS}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <PressableScale
            onPress={() => setFont(item)}
            scaleDown={0.96}
            style={{
              padding: 18,
              marginBottom: 10,
              borderRadius: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: selectedFont === item ? "#E5F7FF" : "#FFF",
              borderWidth: 2,
              borderColor: selectedFont === item ? "#1CB0F6" : "#E5E5E5",
              boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.05)" as any,
              elevation: 2,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              {selectedFont === item ? (
                <Icon3DCheckCircle size={24} />
              ) : (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#E5E5E5",
                    marginRight: 12,
                  }}
                />
              )}
              <AppText
                style={{
                  fontFamily: item,
                  fontSize: 22,
                  color: selectedFont === item ? "#1CB0F6" : "#4B4B4B",
                  flexShrink: 1,
                }}
              >
                فێربوونی زمان - {item.replace("Rabar_", "فۆنتی ")}
              </AppText>
            </View>
            <Icon3DChevronRight size={22} />
          </PressableScale>
        )}
      />
    </SafeAreaView>
  );
}
