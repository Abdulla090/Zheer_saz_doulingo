import { AppText } from "../../../components/ui/AppText";
import { TwinoMascot } from "../../../components/mascot/TwinoMascot";
import React from "react";
import { StyleSheet, View, Platform } from "react-native";


export type OnboardingSceneVariant =
  | "meet_twin"
  | "learn_conversation"
  | "grow_every_day"
  | "achieve_fluency";

export function OnboardingHeroScene({
  variant,
  height = 320,
}: {
  variant: OnboardingSceneVariant;
  height?: number;
}) {
  return (
    <View style={[styles.root, { height }]}>
      {variant === "learn_conversation" && <MascotScene variant="learn_conversation" />}
      {variant === "grow_every_day" && <MascotScene variant="grow_every_day" />}
      {variant === "achieve_fluency" && <MascotScene variant="achieve_fluency" />}
    </View>
  );
}

function MascotScene({ variant }: { variant: OnboardingSceneVariant }) {
  if (variant === "learn_conversation") {
    return (
      <View style={styles.scene}>
        <View style={styles.mascotsRow}>
          <View style={[styles.mascotWrapper, { marginTop: 12 }]}>
            <View style={[styles.helloBubble, { top: -28 }]}>
              <AppText style={styles.helloBubbleText} forceLatinFont latinRole="bold">
                Hello! 👋
              </AppText>
            </View>
            <TwinoMascot mascotId="pingo" pose="wave" size={190} />
          </View>
        </View>
      </View>
    );
  }

  if (variant === "grow_every_day") {
    return (
      <View style={styles.scene}>
        <View style={styles.mascotsRow}>
          <View style={[styles.mascotWrapper, { marginTop: 12 }]}>
            <View style={[styles.helloBubble, { top: -28 }]}>
              <AppText style={styles.helloBubbleText} forceLatinFont latinRole="bold">
                Ready? 🚀
              </AppText>
            </View>
            <TwinoMascot
              mascotId="violet"
              pose="encouraging"
              size={184}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.scene}>
      <View style={styles.mascotsRow}>
        <View style={styles.mascotWrapper}>
          <TwinoMascot mascotId="pingo" pose="winning" size={170} />
        </View>

        <View style={[styles.mascotWrapper, { marginTop: 12 }]}>
          <View style={styles.helloBubble}>
            <AppText style={styles.helloBubbleText} forceLatinFont latinRole="bold">
              {"Let's go! ✨"}
            </AppText>
          </View>
          <TwinoMascot mascotId="violet" pose="happy" size={166} />
        </View>
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
  convoBubble: {
    position: "absolute",
    top: -38,
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: "#DCFCE7",
    ...Platform.select({
      web: {
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.04)",
      },
      default: {
        shadowColor: "#000000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      },
    }),
  },
  convoBubbleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
    fontFamily: "DINNextRoundedBold",
  },
  growBubble: {
    position: "absolute",
    top: -38,
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    ...Platform.select({
      web: {
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.04)",
      },
      default: {
        shadowColor: "#000000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      },
    }),
  },
  growBubbleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
    fontFamily: "DINNextRoundedBold",
  },
  shadowOffset: {
    // Offset slightly to align with the visual base of the slide
    marginBottom: 8,
  },
});
