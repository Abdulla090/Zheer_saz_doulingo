/**
 * ContentPackCard — activation card for bundled learning paths.
 */

import { PressableScale } from "./animations";
import {
  type ContentPackMeta,
  useContentPackStore,
} from "../stores/useContentPackStore";
import { crossShadow } from "../utils/shadows";
import { PRIMARY_ACTION } from "../constants/primary-action";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

// ── Icons ────────────────────────────────────────────────────────────────────

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

// ── Main Component ───────────────────────────────────────────────────────────

type Props = {
  pack: ContentPackMeta;
  /** Optional callback after a bundled path is activated. */
  onDownloadComplete?: () => void;
};

export function ContentPackCard({ pack, onDownloadComplete }: Props) {
  const status = useContentPackStore((s) => s.getStatus(pack.id));
  const startDownload = useContentPackStore((s) => s.startDownload);
  const { width } = useWindowDimensions();

  const handlePress = useCallback(() => {
    if (status === "not_downloaded" || status === "error") {
      startDownload(pack.id);
    }
  }, [status, pack.id, startDownload]);

  // Notify the parent after local activation completes.
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
            opacity: status === "downloaded" ? 0.14 : 0.08,
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
            <Text style={styles.statLabel}>Access</Text>
          </View>
        </View>

        {/* Activation complete banner */}
        {status === "downloaded" && (
          <Animated.View
            entering={FadeIn.duration(400)}
            style={[styles.completeBanner, { backgroundColor: pack.accentColorLight }]}
          >
            <CheckCircleIcon size={20} color={pack.accentColor} />
            <Text style={[styles.completeText, { color: pack.accentColor }]}>
              Added — Ready to learn!
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
          {(status === "not_downloaded" || status === "error") && (
            <LinearGradient
              colors={status === "error" ? ["#EF4444", "#DC2626"] : [PRIMARY_ACTION.face, PRIMARY_ACTION.face]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.downloadBtn,
                status === "error" && styles.downloadBtnError,
              ]}
            >
              {status === "error" ? null : <PackageIcon size={22} color="#FFF" />}
              <Text style={styles.downloadBtnText}>
                {status === "error" ? "Could not add — Try again" : "Add to My Paths"}
              </Text>
            </LinearGradient>
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
    height: PRIMARY_ACTION.height,
    borderRadius: PRIMARY_ACTION.radius,
    borderBottomWidth: PRIMARY_ACTION.rimWidth,
    borderBottomColor: PRIMARY_ACTION.rim,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  downloadBtnError: {
    borderBottomColor: "#B91C1C",
  },
  downloadBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
