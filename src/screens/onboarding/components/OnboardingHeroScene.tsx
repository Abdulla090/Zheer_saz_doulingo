import { AppText } from "../../../components/ui/AppText";
import React from "react";
import { StyleSheet, View, Image, Platform } from "react-native";
import MascotOrange from "../../../../assets/images/svg/newmascotorange.svg";
import MascotPurple from "../../../../assets/images/svg/newmascotpurple.svg";
import { LinearGradient } from "expo-linear-gradient";

export type OnboardingSceneVariant =
  | "meet_twin"
  | "learn_conversation"
  | "grow_every_day";

export function OnboardingHeroScene({
  variant,
  height = 320,
}: {
  variant: OnboardingSceneVariant;
  height?: number;
}) {
  return (
    <View style={[styles.root, { height }]}>
      {variant === "meet_twin" ? (
        <MeetTwinScene />
      ) : (
        <OtherScene variant={variant} />
      )}
    </View>
  );
}

function MeetTwinScene() {
  return (
    <View style={styles.scene}>
      {/* Logo at the top - Using logo-glow for the text logo */}
      <Image
        source={require("../../../../assets/images/logo-glow.png")}
        style={styles.logoImage}
      />
      
      <View style={styles.mascotsRow}>
        {/* Orange Mascot on left — cropped with overflow:hidden wrapper
            instead of runtime viewBox override (which crashes react-native-svg
            on Android release builds) */}
        <View style={styles.mascotWrapper}>
          <View style={[styles.orangeMascotCropper, { transform: [{ scaleX: -1 }] }]}>
            <MascotOrange width={110} height={130} />
          </View>
        </View>
        
        {/* Purple Mascot on right */}
        <View style={[styles.mascotWrapper, { marginTop: 12 }]}>
          {/* Custom Hello! bubble */}
          <View style={styles.helloBubble}>
            <AppText style={styles.helloBubbleText} forceLatinFont latinRole="bold">
              Hello!
            </AppText>
          </View>
          <MascotPurple width={120} height={120} />
        </View>
      </View>
    </View>
  );
}

function OtherScene({ variant }: { variant: OnboardingSceneVariant }) {
  return (
    <View style={styles.otherScene}>
      <View style={styles.bottomGradientWrapper}>
        <LinearGradient
          colors={["rgba(37, 99, 235, 0)", "rgba(37, 99, 235, 0.4)", "rgba(37, 99, 235, 0.8)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  scene: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 220,
    height: 70,
    resizeMode: "contain",
    marginBottom: 24,
  },
  mascotsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  mascotWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  orangeMascotCropper: {
    width: 90,
    height: 135,
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  helloBubble: {
    position: "absolute",
    top: -38,
    right: 0,
    backgroundColor: "#ECF1FE",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: "#E1EBFF",
    ...Platform.select({
      web: {
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
      },
      default: {
        shadowColor: "#000000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      },
    }),
  },
  helloBubbleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2F69FF",
    fontFamily: "DINNextRoundedBold",
  },
  otherScene: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bottomGradientWrapper: {
    width: "150%",
    height: "60%",
    position: "absolute",
    bottom: -20,
    borderTopLeftRadius: 400,
    borderTopRightRadius: 400,
    overflow: "hidden",
  },
});
