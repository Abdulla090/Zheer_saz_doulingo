import React from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { useFontStore } from "@/stores/useFontStore";
import { ChevronRight, Settings, CheckCircle2 } from "lucide-react-native";

// All 57 Rabar fonts from 016 to 072 + 011
export const ALL_RABAR_FONTS = [
  "Rabar_011", ...Array.from({ length: 57 }).map((_, i) => `Rabar_${String(i + 16).padStart(3, "0")}`)
];

export default function MoreScreen() {
  const { selectedFont, setFont } = useFontStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <View style={{ padding: 24, paddingBottom: 16, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#E5E5E5", marginBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Settings color="#4B4B4B" size={28} style={{ marginRight: 12 }} />
          <Text className="font-rd-bold" style={{ fontSize: 24, color: "#4B4B4B" }}>
            ڕێکخستنەکان (Settings)
          </Text>
        </View>
        <Text className="font-rd-medium" style={{ fontSize: 16, color: "#777" }}>
          جۆری فۆنتی دڵخوازت لێرە هەڵبژێرە. گۆڕانکارییەکان یەکسەر جێبەجێ دەبن!
        </Text>
      </View>

      <FlatList
        data={ALL_RABAR_FONTS}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setFont(item)}
            activeOpacity={0.7}
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
                <CheckCircle2 color="#1CB0F6" size={24} style={{ marginRight: 12 }} />
              ) : (
                <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#E5E5E5", marginRight: 12 }} />
              )}
              <Text 
                style={{ 
                  fontFamily: item, 
                  fontSize: 22, 
                  color: selectedFont === item ? "#1CB0F6" : "#4B4B4B",
                  flexShrink: 1 
                }}
              >
                فێربوونی زمان - {item.replace("Rabar_", "فۆنتی ")}
              </Text>
            </View>
            <ChevronRight color={selectedFont === item ? "#1CB0F6" : "#B7B7B7"} size={22} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
