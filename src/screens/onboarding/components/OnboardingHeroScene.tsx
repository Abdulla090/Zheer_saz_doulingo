import { AppText } from "@/components/ui/AppText";
import React from "react";
import { StyleSheet, View } from "react-native";

export type OnboardingSceneVariant =
  | "welcome"
  | "paths"
  | "practice"
  | "progress"
  | "ready";

export function OnboardingHeroScene({
  variant,
  height = 324,
}: {
  variant: OnboardingSceneVariant;
  height?: number;
}) {
  return (
    <View style={[styles.root, { height }]}>
      {variant === "welcome" ? <WelcomeScene /> : null}
      {variant === "paths" ? <AiScene /> : null}
      {variant === "practice" ? <ConversationScene /> : null}
      {variant === "progress" ? <ProgressScene /> : null}
      {variant === "ready" ? <ReadyScene /> : null}
    </View>
  );
}

function Penguin({ size = 124, wave = false }: { size?: number; wave?: boolean }) {
  const bodyW = size * 0.72;
  const bodyH = size * 0.82;
  return (
    <View style={[styles.penguinWrap, { width: size, height: size }]}>
      <View style={[styles.penguinShadow, { width: size * 0.82 }]} />
      {wave ? <View style={[styles.wing, styles.wingWave]} /> : null}
      <View style={[styles.body, { width: bodyW, height: bodyH, borderRadius: bodyW / 2 }]}>
        <View style={[styles.face, { width: bodyW * 0.7, height: bodyH * 0.58 }]} />
        <View style={[styles.eye, { left: bodyW * 0.27 }]} />
        <View style={[styles.eye, { right: bodyW * 0.27 }]} />
        <View style={styles.beak} />
      </View>
      {!wave ? <View style={[styles.wing, styles.wingLeft]} /> : null}
      <View style={[styles.wing, styles.wingRight]} />
    </View>
  );
}

function Bubble({ text, style }: { text: string; style?: object }) {
  return (
    <View style={[styles.bubble, style]}>
      <AppText style={styles.bubbleText} forceLatinFont>
        {text}
      </AppText>
    </View>
  );
}

function WelcomeScene() {
  return (
    <View style={styles.scene}>
      <View style={styles.splashCircle} />
      <Bubble text="Hello!" style={styles.bubbleRight} />
      <Bubble text="Hola!" style={styles.bubbleLeft} />
      <View style={styles.globeArc} />
      <View style={styles.welcomePenguin}>
        <Penguin size={140} wave />
      </View>
    </View>
  );
}

function AiScene() {
  return (
    <View style={styles.scene}>
      <Bubble text="How are you?" style={styles.aiTopBubble} />
      <View style={styles.phoneCard}>
        <Penguin size={116} />
        <Bubble text="I'm good!" style={styles.aiBlueBubble} />
      </View>
      <View style={styles.toolRow}>
        {["Speaking", "Listening", "Vocabulary", "Grammar"].map((label, i) => (
          <View key={label} style={styles.toolChip}>
            <View style={[styles.toolIcon, i % 2 === 0 && styles.toolIconAlt]} />
            <AppText style={styles.toolLabel} forceLatinFont>
              {label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function ConversationScene() {
  return (
    <View style={styles.scene}>
      <View style={styles.mapOrb}>
        <View style={[styles.mapLand, styles.mapLandOne]} />
        <View style={[styles.mapLand, styles.mapLandTwo]} />
        <View style={[styles.pin, styles.pinOne]} />
        <View style={[styles.pin, styles.pinTwo]} />
        <View style={[styles.pin, styles.pinThree]} />
      </View>
      <View style={[styles.avatar, styles.avatarOne]} />
      <View style={[styles.avatar, styles.avatarTwo]} />
      <View style={[styles.avatar, styles.avatarThree]} />
    </View>
  );
}

function ProgressScene() {
  return (
    <View style={styles.scene}>
      <View style={styles.progressCard}>
        <View style={styles.progressTopRow}>
          <AppText style={styles.progressTitle} forceLatinFont>
            Your Progress
          </AppText>
          <AppText style={styles.progressWeek} forceLatinFont>
            This Week
          </AppText>
        </View>
        <AppText style={styles.progressSmall} forceLatinFont>
          XP Gained
        </AppText>
        <AppText style={styles.progressXp} forceLatinFont>
          1,250 XP
        </AppText>
        <View style={styles.chart}>
          {[16, 28, 22, 42, 36, 54, 48].map((h, i) => (
            <View key={i} style={[styles.chartBar, { height: h }]} />
          ))}
        </View>
        <View style={styles.statRow}>
          <Stat value="18" label="Lessons" />
          <Stat value="7 Days" label="Streak" />
          <Stat value="92%" label="Accuracy" />
        </View>
        <View style={styles.streakRow}>
          <AppText style={styles.fire} forceLatinFont>
            7
          </AppText>
          {Array.from({ length: 7 }, (_, i) => (
            <View key={i} style={styles.dayDot} />
          ))}
        </View>
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statBox}>
      <AppText style={styles.statValue} forceLatinFont>
        {value}
      </AppText>
      <AppText style={styles.statLabel} forceLatinFont>
        {label}
      </AppText>
    </View>
  );
}

function ReadyScene() {
  return (
    <View style={styles.scene}>
      <Bubble text="Bonjour" style={styles.readyBubbleLeft} />
      <Bubble text="Hola" style={styles.readyBubbleRight} />
      <Bubble text="こんにちは" style={styles.readyBubbleTop} />
      <View style={styles.readyPenguin}>
        <Penguin size={150} wave />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    minHeight: 240,
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
  splashCircle: {
    position: "absolute",
    bottom: 26,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#EAF5FF",
  },
  globeArc: {
    position: "absolute",
    bottom: -98,
    width: 310,
    height: 190,
    borderTopLeftRadius: 160,
    borderTopRightRadius: 160,
    backgroundColor: "#F6FBFF",
    borderWidth: 1,
    borderColor: "#DBEEFF",
  },
  welcomePenguin: {
    position: "absolute",
    bottom: 4,
  },
  penguinWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  penguinShadow: {
    position: "absolute",
    bottom: 8,
    height: 14,
    borderRadius: 999,
    backgroundColor: "rgba(37,99,235,0.12)",
  },
  body: {
    backgroundColor: "#52A8FF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBE8FF",
    shadowColor: "#2B6DF3",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  face: {
    marginTop: 21,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  eye: {
    position: "absolute",
    top: 43,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#12284D",
  },
  beak: {
    position: "absolute",
    top: 56,
    width: 16,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#FFB74A",
  },
  wing: {
    position: "absolute",
    width: 33,
    height: 58,
    borderRadius: 24,
    backgroundColor: "#2E80EF",
  },
  wingLeft: {
    left: 14,
    top: 55,
    transform: [{ rotate: "24deg" }],
  },
  wingRight: {
    right: 14,
    top: 55,
    transform: [{ rotate: "-24deg" }],
  },
  wingWave: {
    right: 8,
    top: 35,
    transform: [{ rotate: "-48deg" }],
  },
  bubble: {
    position: "absolute",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
    shadowColor: "#94BDF9",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  bubbleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4A7FE8",
    fontFamily: "DINNextRoundedBold",
  },
  bubbleRight: {
    right: 36,
    top: 118,
  },
  bubbleLeft: {
    left: 24,
    top: 168,
  },
  phoneCard: {
    width: 176,
    height: 206,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EDF3FB",
    shadowColor: "#A5B8D3",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  aiTopBubble: {
    top: 22,
    left: 72,
  },
  aiBlueBubble: {
    top: 62,
    right: -34,
    backgroundColor: "#2B73F6",
  },
  toolRow: {
    position: "absolute",
    bottom: 2,
    flexDirection: "row",
    gap: 8,
  },
  toolChip: {
    width: 54,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    shadowColor: "#A5B8D3",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  toolIcon: {
    width: 17,
    height: 17,
    borderRadius: 5,
    backgroundColor: "#2B73F6",
  },
  toolIconAlt: {
    borderRadius: 12,
  },
  toolLabel: {
    fontSize: 7,
    color: "#6B7890",
    fontFamily: "DINNextRoundedBold",
  },
  mapOrb: {
    width: 204,
    height: 204,
    borderRadius: 102,
    backgroundColor: "#EAF4FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D6E9FF",
  },
  mapLand: {
    position: "absolute",
    backgroundColor: "#8EC5FF",
    opacity: 0.55,
  },
  mapLandOne: {
    width: 70,
    height: 42,
    borderRadius: 24,
    left: 48,
    top: 72,
  },
  mapLandTwo: {
    width: 58,
    height: 72,
    borderRadius: 28,
    right: 46,
    bottom: 52,
  },
  pin: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#2B73F6",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  pinOne: {
    top: 68,
    left: 76,
  },
  pinTwo: {
    top: 112,
    right: 64,
  },
  pinThree: {
    bottom: 58,
    left: 102,
  },
  avatar: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D9EFFF",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#A5B8D3",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  avatarOne: {
    top: 32,
    left: 74,
  },
  avatarTwo: {
    top: 92,
    right: 42,
    backgroundColor: "#FFE7D4",
  },
  avatarThree: {
    bottom: 44,
    left: 48,
    backgroundColor: "#E8D9FF",
  },
  progressCard: {
    width: 224,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#A5B8D3",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  progressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#172554",
    fontFamily: "DINNextRoundedBold",
  },
  progressWeek: {
    fontSize: 9,
    color: "#8A98AD",
    fontFamily: "DINNextRoundedBold",
  },
  progressSmall: {
    fontSize: 9,
    color: "#8A98AD",
    fontFamily: "DINNextRoundedBold",
  },
  progressXp: {
    fontSize: 25,
    fontWeight: "900",
    color: "#172554",
    fontFamily: "DINNextRoundedBold",
  },
  chart: {
    height: 72,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginVertical: 12,
  },
  chartBar: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#2B73F6",
  },
  statRow: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#F5F8FD",
  },
  statValue: {
    fontSize: 10,
    fontWeight: "900",
    color: "#172554",
    fontFamily: "DINNextRoundedBold",
  },
  statLabel: {
    marginTop: 2,
    fontSize: 7,
    color: "#8A98AD",
    fontFamily: "DINNextRoundedBold",
  },
  streakRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fire: {
    color: "#FF9600",
    fontSize: 16,
    fontWeight: "900",
    fontFamily: "DINNextRoundedBold",
  },
  dayDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#2B73F6",
  },
  readyPenguin: {
    marginTop: 24,
  },
  readyBubbleLeft: {
    left: 34,
    top: 126,
  },
  readyBubbleRight: {
    right: 24,
    top: 118,
  },
  readyBubbleTop: {
    top: 48,
    right: 54,
  },
});
