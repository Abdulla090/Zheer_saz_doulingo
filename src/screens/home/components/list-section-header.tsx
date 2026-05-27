import { sectionData } from "@/data/list-items";
import { StyleSheet, Text, View } from "react-native";

const FIRST_SECTION_TITLE = sectionData[0]?.title;

export const ListSectionHeader = ({ section }: { section: { title: string } }) => {
  if (section?.title === FIRST_SECTION_TITLE) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      <Text style={styles.title} numberOfLines={2}>
        {section.title}
      </Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.3,
    maxWidth: "62%",
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
  },
});
