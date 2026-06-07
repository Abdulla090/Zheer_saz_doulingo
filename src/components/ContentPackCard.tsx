/**
 * ContentPackCard — modern download card shown when a learning path
 * is not yet downloaded.  Three states: locked → downloading → done.
 */

import { PressableScale } from "@/components/animations";
import {
  type ContentPackMeta,
  type PackId,
  useContentPackStore,
} from "@/stores/useContentPackStore";
import { crossShadow } from "@/utils/shadows";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { confirmAction } from "@/utils/confirm-action";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

// ── Icons ────────────────────────────────────────────────────────────────────

function CloudDownloadIcon({ size = 28, color = "#FFF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 16L12 8M12 16L9 13M12 16L15 13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckCircleIcon({ size = 28, color = "#FFF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill={color}
        opacity={0.2}
      />
      <Path
        d="M8 12L11 15L16 9"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PackageIcon({ size = 44, color = "#1CB0F6" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        opacity={0.15}
      />
      <Path
        d="M2 17L12 22L22 17"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12L12 17L22 12"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Pulsing dot indicator ────────────────────────────────────────────────────

function PulsingDot({ color }: { color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, [scale, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

type Props = {
  pack: ContentPackMeta;
  /** Optional callback after download completes */
  onDownloadComplete?: () => void;
};

export function ContentPackCard({ pack, onDownloadComplete }: Props) {
  const status = useContentPackStore((s) => s.getStatus(pack.id));
  const progress = useContentPackStore((s) => s.getProgress(pack.id));
  const startDownload = useContentPackStore((s) => s.startDownload);
  const cancelDownload = useContentPackStore((s) => s.cancelDownload);
  const { width } = useWindowDimensions();

  // Progress bar animation
  const progressWidth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (status === "downloading") {
      progressWidth.value = withSpring(progress, { damping: 15, stiffness: 100 });
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1000 }),
          withTiming(0.2, { duration: 1000 }),
        ),
        -1,
        true,
      );
    } else if (status === "downloaded") {
      progressWidth.value = withSpring(1, { damping: 12, stiffness: 80 });
      glowOpacity.value = withTiming(0, { duration: 500 });
    } else {
      progressWidth.value = withTiming(0, { duration: 200 });
      glowOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [status, progress, progressWidth, glowOpacity]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as any,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = useCallback(() => {
    if (status === "not_downloaded") {
      confirmAction(
        "Storage & Notification Permission",
        "Phingo needs permission to store the downloaded learning assets on your device and notify you when the download completes. Do you grant permission?",
        async () => {
          if (Platform.OS === "web") {
            if (typeof Notification !== "undefined" && Notification.permission === "default") {
              try {
                await Notification.requestPermission();
              } catch (e) {
                console.warn("Notification request failed:", e);
              }
            }
            startDownload(pack.id);
          } else if (Platform.OS === "android") {
            try {
              const writePerm = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
              const postNotifications = (PermissionsAndroid.PERMISSIONS as any).POST_NOTIFICATIONS || "android.permission.POST_NOTIFICATIONS";
              
              await PermissionsAndroid.requestMultiple([writePerm, postNotifications]);
            } catch (err) {
              console.warn("Android permissions request failed:", err);
            }
            startDownload(pack.id);
          } else {
            startDownload(pack.id);
          }
        },
        { confirmLabel: "Allow", cancelLabel: "Deny" }
      );
    } else if (status === "downloading") {
      cancelDownload(pack.id);
    }
  }, [status, pack.id, startDownload, cancelDownload]);

  // Notify parent when download completes
  useEffect(() => {
    if (status === "downloaded" && onDownloadComplete) {
      const timeout = setTimeout(onDownloadComplete, 600);
      return () => clearTimeout(timeout);
    }
  }, [status, onDownloadComplete]);

  const cardWidth = Math.min(width - 40, 400);

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      style={[styles.wrapper, { width: cardWidth }]}
    >
      <View
        style={[
          styles.card,
          {
            borderColor: status === "downloaded"
              ? pack.accentColor
              : "rgba(241, 245, 249, 0.9)",
          },
          crossShadow({
            color: pack.accentColor,
            offsetY: 12,
            blur: 32,
            opacity: status === "downloading" ? 0.18 : 0.08,
            elevation: 8,
          }),
        ]}
      >
        {/* Top accent gradient stripe */}
        <LinearGradient
          colors={[pack.accentColor, `${pack.accentColor}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentStripe}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: pack.accentColorLight }]}>
            <PackageIcon size={36} color={pack.accentColor} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{pack.titleKey}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {pack.descriptionKey}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: pack.accentColor }]}>
              {pack.unitCount}
            </Text>
            <Text style={styles.statLabel}>Units</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: pack.accentColor }]}>
              {pack.lessonCount}
            </Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: pack.accentColor }]}>
              {pack.sizeLabel}
            </Text>
            <Text style={styles.statLabel}>Size</Text>
          </View>
        </View>

        {/* Progress bar (visible during download) */}
        {status === "downloading" && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressSection}>
            <View style={styles.progressRow}>
              <PulsingDot color={pack.accentColor} />
              <Text style={[styles.progressText, { color: pack.accentColor }]}>
                Downloading... {Math.round(progress * 100)}%
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: pack.accentColor },
                  progressBarStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.progressGlow,
                  { backgroundColor: pack.accentColor },
                  glowStyle,
                ]}
              />
            </View>
          </Animated.View>
        )}

        {/* Download complete banner */}
        {status === "downloaded" && (
          <Animated.View
            entering={FadeIn.duration(400)}
            style={[styles.completeBanner, { backgroundColor: pack.accentColorLight }]}
          >
            <CheckCircleIcon size={20} color={pack.accentColor} />
            <Text style={[styles.completeText, { color: pack.accentColor }]}>
              Downloaded — Ready to learn!
            </Text>
          </Animated.View>
        )}

        {/* Action button */}
        <PressableScale
          onPress={handlePress}
          scaleDown={0.96}
          haptic
          style={styles.btnWrap}
        >
          {status === "not_downloaded" && (
            <LinearGradient
              colors={[pack.accentColor, `${pack.accentColor}DD`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.downloadBtn}
            >
              <CloudDownloadIcon size={22} color="#FFF" />
              <Text style={styles.downloadBtnText}>Download Pack</Text>
            </LinearGradient>
          )}
          {status === "downloading" && (
            <View style={[styles.cancelBtn, { borderColor: pack.accentColor }]}>
              <Text style={[styles.cancelBtnText, { color: pack.accentColor }]}>
                Cancel
              </Text>
            </View>
          )}
        </PressableScale>
      </View>
    </Animated.View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
  },
  accentStripe: {
    height: 4,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 10,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 22,
    marginTop: 10,
    paddingVertical: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    gap: 0,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E2E8F0",
  },
  progressSection: {
    paddingHorizontal: 22,
    paddingTop: 14,
    gap: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 3,
  },
  progressGlow: {
    position: "absolute",
    top: -2,
    right: 0,
    width: 24,
    height: 10,
    borderRadius: 5,
  },
  completeBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 22,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  completeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  btnWrap: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 22,
  },
  downloadBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  downloadBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  cancelBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
