/* eslint-disable */
import { PressableScale } from "@/components/animations";
import { enterFadeDown } from "@/components/animations/motion";
import {
    CardWaveMini,
    HeroAuraRing,
    PhingoWordmark,
    SettingsTuneIcon,
    WaveformIcon,
} from "@/components/icons/PhingoHomeIcons";
import { Icon3DLayers, Icon3DZapBlue } from "@/components/icons/Icon3D";
import { crossShadow } from "@/utils/shadows";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";
import { AppText } from "@/components/ui/AppText";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContentPackStore } from "@/stores/useContentPackStore";

const C = {
  bgTop: "#F4F9FF",
  bgBottom: "#FFFFFF",
  ink: "#0F172A",
  inkSoft: "#475569",
  inkMuted: "#94A3B8",
  blue: "#208AEF",
  blueLight: "#3B82F6",
  blueGlow: "#93C5FD",
  card: "#FFFFFF",
  cardBorder: "#F1F5F9",
};

type Suggestion = {
  id: string;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  onPress?: () => void;
};

/**
 * Custom Floating Bubble micro-animation for Mascot Stage
 */
function FloatingBubble({
  size,
  delay,
  startX,
  duration,
}: {
  size: number;
  delay: number;
  startX: number;
  duration: number;
}) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    // Loop Y position upward
    translateY.value = withRepeat(
      withSequence(
        withTiming(100, { duration: 0 }),
        withDelay(
          delay,
          withTiming(-100, { duration, easing: Easing.out(Easing.quad) })
        )
      ),
      -1,
      false
    );

    // Fade-in in middle, fade-out at top
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(
          delay,
          withSequence(
            withTiming(0.65, { duration: duration * 0.25 }),
            withTiming(0.65, { duration: duration * 0.45 }),
            withTiming(0, { duration: duration * 0.3 })
          )
        )
      ),
      -1,
      false
    );

    // Minor scaling pulsation
    scale.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 0 }),
        withDelay(
          delay,
          withSequence(
            withTiming(1.1, { duration: duration * 0.5 }),
            withTiming(0.7, { duration: duration * 0.5 })
          )
        )
      ),
      -1,
      true
    );
  }, [translateY, opacity, scale, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: "50%",
    marginLeft: startX,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: "rgba(147, 197, 253, 0.45)",
    borderWidth: 0.75,
    borderColor: "rgba(255, 255, 255, 0.7)",
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle} />;
}

export function PhingoHomeScreen({
  onOpenLearningPath,
}: {
  onOpenLearningPath?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const floatY = useSharedValue(0);
  const glow = useSharedValue(0.92);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.92, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [floatY, glow]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const auraStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 0.97 + glow.value * 0.03 }],
  }));

  const streetAvailable = useContentPackStore((s) => s.isAvailable("street"));

  const suggestions: Suggestion[] = [
    {
      id: "street-path",
      title: streetAvailable ? "Street English" : "Street English",
      subtitle: streetAvailable ? "Daily path" : "Download to unlock",
      Icon: ({ size }) => <Icon3DZapBlue size={size ?? 36} active />,
      onPress: () => router.push("/dashboard?mode=street"),
    },
    {
      id: "normal-path",
      title: "Normal English",
      subtitle: "Structured units",
      Icon: ({ size }) => <Icon3DLayers size={size ?? 36} active />,
      onPress: () => router.push("/dashboard?mode=normal"),
    },
    {
      id: "speak",
      title: "Practice Speaking",
      subtitle: "Let's chat",
      Icon: CardWaveMini,
      onPress: () => router.push("/feed"),
    },
  ];

  const cardW = Math.min(156, width * 0.44);

  const handleTalk = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/feed");
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[C.bgTop, C.bgBottom, "#FFFFFF"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 120,
        }}
      >
        {/* Header */}
        <Animated.View entering={enterFadeDown(20)} style={styles.header}>
          <PhingoWordmark height={26} />
          <PressableScale
            onPress={() => router.push("/more")}
            scaleDown={0.92}
            style={styles.settingsBtn}
          >
            <SettingsTuneIcon size={22} color={C.inkSoft} />
          </PressableScale>
        </Animated.View>

        {/* Hero copy */}
        <Animated.View entering={enterFadeDown(40)} style={styles.heroCopy}>
          <AppText style={styles.eyebrow}>Your AI Language Partner</AppText>
          <AppText style={styles.headline}>
            I'm <AppText style={styles.headlineAccent}>Phingo.</AppText>
          </AppText>
          <AppText style={styles.subline}>Let's talk, learn and grow together.</AppText>
        </Animated.View>

        {/* Mascot stage with floating bubbles & layered glows */}
        <Animated.View entering={enterFadeDown(60)} style={styles.mascotStage}>
          {/* Radial soft ambient glow background */}
          <View style={styles.stageGlow} />

          {/* Layered White/Blue Glowing Aura Rings */}
          <Animated.View style={[styles.auraWrap, auraStyle]}>
            <HeroAuraRing size={Math.min(width * 0.74, 280)} />
          </Animated.View>

          {/* Floating interactive water bubbles (reduced for perf) */}
          <View style={styles.bubblesContainer}>
            <FloatingBubble size={6} delay={0} startX={-65} duration={4800} />
            <FloatingBubble size={10} delay={1500} startX={-20} duration={5200} />
            <FloatingBubble size={8} delay={3000} startX={45} duration={4400} />
          </View>

          {/* Robot mascot float */}
          <Animated.View style={[styles.mascotWrap, mascotStyle]}>
            <Image
              source={require("../../../assets/images/characters/dolphin-mascot.jpg")}
              contentFit="contain"
              style={{
                width: Math.min(width * 0.68, 260),
                height: Math.min(width * 0.68, 260),
              }}
            />
          </Animated.View>
        </Animated.View>

        {/* CTA "Tap to talk" pill button */}
        <Animated.View entering={enterFadeDown(80)} style={styles.ctaWrap}>
          <PressableScale onPress={handleTalk} scaleDown={0.96} haptic>
            <LinearGradient
              colors={["#4FA2F1", "#2563EB", "#1E65EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.talkBtn,
                crossShadow({
                  color: C.blue,
                  offsetY: 10,
                  blur: 24,
                  opacity: 0.32,
                  elevation: 10,
                }),
              ]}
            >
              <WaveformIcon size={20} color="#FFFFFF" />
              <AppText style={styles.talkLabel}>Tap to talk</AppText>
            </LinearGradient>
          </PressableScale>
        </Animated.View>

        {/* Custom SVG Banner Widget */}
        <Animated.View entering={enterFadeDown(90)} style={styles.svgWidgetWrap}>
          <View style={[styles.svgWidgetCard, crossShadow({
            color: C.blue,
            offsetY: 6,
            blur: 16,
            opacity: 0.12,
            elevation: 5,
          })]}>
            <Image
              source={require("../../../assets/images/home/home svg also widget svg.svg")}
              contentFit="contain"
              style={{ width: "100%", height: 110 }}
            />
          </View>
        </Animated.View>

        {/* Suggestions */}
        <Animated.View entering={enterFadeDown(100)} style={styles.section}>
          <AppText style={styles.sectionTitle}>Suggested for you</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {suggestions.map((item, index) => (
              <PressableScale
                key={item.id}
                onPress={item.onPress}
                scaleDown={0.96}
                style={[
                  styles.suggestCard,
                  { width: cardW },
                  index === 0 && { marginLeft: 20 },
                  crossShadow({
                    color: "#0F172A",
                    offsetY: 8,
                    blur: 20,
                    opacity: 0.04,
                    elevation: 3,
                  }),
                ]}
              >
                <View>
                  <AppText style={styles.cardTitle}>{item.title}</AppText>
                  <AppText style={styles.cardSub}>{item.subtitle}</AppText>
                </View>
                <View style={styles.cardIconSlot}>
                  <item.Icon size={36} />
                </View>
              </PressableScale>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgBottom },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingBottom: 8,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(241,245,249,0.9)",
  },
  heroCopy: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 4,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  headline: {
    fontSize: 38,
    fontWeight: "800",
    color: C.ink,
    letterSpacing: -0.75,
    lineHeight: 46,
    textAlign: "center",
  },
  headlineAccent: {
    color: C.blue,
  },
  subline: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    color: C.inkSoft,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 290,
  },
  mascotStage: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
    marginTop: 8,
    marginBottom: 8,
  },
  stageGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(147, 197, 253, 0.15)",
  },
  auraWrap: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  bubblesContainer: {
    position: "absolute",
    width: 220,
    height: 220,
    overflow: "hidden",
    borderRadius: 110,
    zIndex: 1,
  },
  mascotWrap: {
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaWrap: {
    paddingHorizontal: 28,
    marginBottom: 28,
  },
  talkBtn: {
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  talkLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  svgWidgetWrap: {
    paddingHorizontal: 22,
    marginBottom: 24,
  },
  svgWidgetCard: {
    backgroundColor: "#F4F9FF",
    borderRadius: 24,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.15)",
    overflow: "hidden",
  },
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.ink,
    letterSpacing: -0.3,
    paddingHorizontal: 22,
    marginBottom: 14,
  },
  cardsRow: {
    paddingRight: 22,
    gap: 14,
  },
  suggestCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 142,
    borderWidth: 1,
    borderColor: C.cardBorder,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.ink,
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  cardSub: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 4,
  },
  cardIconSlot: {
    alignItems: "flex-start",
    marginTop: 10,
  },
});
