import { AppText } from "@/components/ui/AppText";
import type { LegalDocId } from "@/content/legal";
import { getLegalDocument } from "@/content/legal";
import { PRIVACY_POLICY_URL, SUPPORT_EMAIL } from "@/constants/app-meta";
import { openHttpsUrl, openMailto } from "@/utils/safe-link";
import { useI18n } from "@/hooks/useI18n";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  docId: LegalDocId;
};

export function LegalDocumentScreen({ docId }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { locale, isKu } = useI18n();
  const doc = getLegalDocument(docId, locale);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <ArrowLeft size={22} color="#1A2B48" strokeWidth={2.5} />
        </Pressable>
        <AppText style={styles.title} forceKurdishFont={isKu} numberOfLines={2}>
          {doc.title}
        </AppText>
        <View style={styles.backSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updated}>
          {isKu ? "دوایین نوێکردنەوە: " : "Last updated: "}
          {doc.lastUpdated}
        </Text>

        {doc.sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <AppText style={styles.sectionTitle} forceKurdishFont={isKu}>
              {section.title}
            </AppText>
            {section.paragraphs.map((p, i) => (
              <AppText
                key={`${section.title}-${i}`}
                style={styles.paragraph}
                forceKurdishFont={isKu}
              >
                {p}
              </AppText>
            ))}
          </View>
        ))}

        {docId === "privacy" && PRIVACY_POLICY_URL ? (
          <Pressable
            onPress={() => void openHttpsUrl(PRIVACY_POLICY_URL)}
            style={[styles.supportBox, { marginBottom: 12 }]}
          >
            <Text style={styles.supportLabel}>
              {isKu ? "وەشانی وێب" : "Web version"}
            </Text>
            <Text style={styles.supportEmail} numberOfLines={1}>
              {PRIVACY_POLICY_URL}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => void openMailto(SUPPORT_EMAIL)}
          style={styles.supportBox}
        >
          <Text style={styles.supportLabel}>
            {isKu ? "پشتیوانی" : "Support"}
          </Text>
          <Text style={styles.supportEmail}>{SUPPORT_EMAIL}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  back: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backSpacer: {
    width: 40,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#1A2B48",
    textAlign: "center",
    fontFamily: "DINNextRoundedBold",
  },
  updated: {
    fontSize: 13,
    color: "#777",
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "DINNextRoundedMedium",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A2B48",
    marginBottom: 8,
    fontFamily: "DINNextRoundedBold",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B4B4B",
    marginBottom: 10,
    fontFamily: "DINNextRoundedMedium",
  },
  supportBox: {
    marginTop: 28,
    padding: 16,
    backgroundColor: "#E5F7FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#B8E4FF",
  },
  supportLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1CB0F6",
    fontFamily: "DINNextRoundedBold",
  },
  supportEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A2B48",
    marginTop: 4,
    fontFamily: "DINNextRoundedMedium",
  },
});
