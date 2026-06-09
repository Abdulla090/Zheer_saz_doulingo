import { sectionData, type SectionDataItem } from "../../../data/list-items";
import { AppText } from "../../../components/ui/AppText";
import { useI18n } from "../../../hooks/useI18n";
import { ltrText, rtlText } from "../../lesson/games/game-text";
import { StyleSheet, View } from "react-native";

export const ListSectionHeader = ({
  section,
}: {
  section: SectionDataItem;
}) => {
  const { isKu } = useI18n();
  if (section.unitIndex === 0) return null;

  const direction = isKu ? rtlText : ltrText;

  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      <AppText
        style={[styles.title, direction]}
        forceKurdishFont={isKu}
        forceLatinFont={!isKu}
        numberOfLines={2}
      >
        {section.title}
      </AppText>
      <View style={styles.line} />
    </View>
  );
};

/** @deprecated First section is hidden via unitIndex === 0 */
export const FIRST_PATH_SECTION_INDEX = sectionData[0]?.unitIndex ?? 0;

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
  },
});
