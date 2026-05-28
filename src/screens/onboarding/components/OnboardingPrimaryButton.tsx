import { SoftPressableButton } from "@/components/ui/soft-2.5d";
import { rtlTextCenter } from "@/utils/rtl";
import * as Haptics from "expo-haptics";
import { Platform, StyleSheet, Text } from "react-native";

import { useOnboardingLocale } from "../OnboardingLocaleContext";

type Props = {
  label: string;
  onPress: () => void;
  color?: string;
  rimColor?: string;
};

export function OnboardingPrimaryButton({
  label,
  onPress,
  color = "#208AEF",
  rimColor,
}: Props) {
  const { isRtl, locale } = useOnboardingLocale();
  const fontFamily = locale === "ku" ? "Rabar_011" : undefined;

  return (
    <SoftPressableButton
      faceColor={color}
      rimColor={rimColor}
      borderRadius={16}
      onPress={() => {
        if (Platform.OS !== "web") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPress();
      }}
      contentStyle={styles.press}
    >
      <Text
        style={[
          styles.label,
          rtlTextCenter(isRtl),
          fontFamily && { fontFamily },
        ]}
      >
        {label}
      </Text>
    </SoftPressableButton>
  );
}

const styles = StyleSheet.create({
  press: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    zIndex: 1,
  },
});
