import { PressableScale } from "../../../components/animations/PressableScale";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import { AppText } from "../../../components/ui/AppText";
import type { LessonPathMode } from "../../../data/lesson-content";
import type { SelectedPathLesson } from "../../../hooks/use-path-lesson-selection";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { crossShadow } from "../../../utils/shadows";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import React, { useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SVG_BUTTON_COLOR_SETS, type SvgButtonVariant } from "./list-button";
import {
  isDesktopWebWidth,
  WEB_DESKTOP_NAV_WIDTH,
  WEB_DESKTOP_RAIL_WIDTH,
} from "../../../constants/web-layout";
import { PRIMARY_ACTION } from "../../../constants/primary-action";

const LOCKED_POPUP_FACE = "#475569";
const LOCKED_POPUP_RIM = "#1E293B";

function popupVariant(selection: SelectedPathLesson): SvgButtonVariant {
  const { item } = selection;
  if (item.status === "locked") return "gray";
  if (item.status === "completed") return "gold";
  if (item.type === "cup") return "yellow";
  if (item.sectionTheme === "gray" && item.displayTheme !== "gray") {
    return item.displayTheme as SvgButtonVariant;
  }
  return item.sectionTheme as SvgButtonVariant;
}

export function PathLessonPopup({
  selection,
  pathMode,
  onDismiss,
}: {
  selection: SelectedPathLesson | null;
  pathMode: LessonPathMode;
  onDismiss: () => void;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { t, isKu, isAr } = useI18n();
  const { colors: themeColors, isDark } = useThemeColors();
  const [popupHeight, setPopupHeight] = useState(195);

  if (!selection) return null;

  const { item, sectionTitle } = selection;
  const isLocked = item.status === "locked";
  const isRtl = isKu || isAr;
  const unitNumber = item.displayUnitNumber ?? item.lessonId + 1;
  const lessonNumber = item.sectionItemIndex + 1;
  const variantColors = SVG_BUTTON_COLOR_SETS[popupVariant(selection)];
  const popupFace = isLocked
    ? isDark
      ? LOCKED_POPUP_FACE
      : "#E2E8F0"
    : themeColors.surfaceRaised;
  const popupRim = isLocked
    ? isDark
      ? LOCKED_POPUP_RIM
      : "#94A3B8"
    : variantColors.rim;
  const isDesktopWeb =
    Platform.OS === "web" && isDesktopWebWidth(windowWidth);
  const fallbackViewportWidth = isDesktopWeb
    ? Math.max(
        320,
        windowWidth - WEB_DESKTOP_NAV_WIDTH - WEB_DESKTOP_RAIL_WIDTH,
      )
    : windowWidth;
  const popupViewportWidth = selection.anchor?.rootWidth ?? fallbackViewportWidth;
  const popupWidth = Math.min(popupViewportWidth - 32, 560);
  const popupLeft = (popupViewportWidth - popupWidth) / 2;

  const GAP_OFFSET = 18;
  const BOTTOM_CLEARANCE = 80;

  const nodeTop = selection.anchor?.nodeTop ?? 0;
  const nodeHeight = selection.anchor?.nodeHeight ?? 76;
  const nodeBottom = nodeTop + nodeHeight;

  const placeAbove =
    Boolean(selection.anchor) &&
    nodeBottom + popupHeight + GAP_OFFSET >
      (selection.anchor?.rootHeight ?? windowHeight) -
        Math.max(insets.bottom, 20) -
        BOTTOM_CLEARANCE;

  const popupTop = selection.anchor
    ? placeAbove
      ? Math.max(16, nodeTop - popupHeight - GAP_OFFSET)
      : nodeBottom + GAP_OFFSET
    : undefined;

  const caretLeft = selection.anchor
    ? Math.max(
        24,
        Math.min(popupWidth - 44, selection.anchor.x - popupLeft - 10),
      )
    : 0;

  const startLesson = () => {
    if (isLocked) return;
    router.push({
      pathname: "/lesson",
      params: {
        id: String(item.lessonId),
        q: "0",
        li: String(item.sectionItemIndex),
        pi: String(item.pathIndex),
        mode: pathMode,
        du: String(unitNumber),
        fromPath: "true",
      },
    });
  };

  return (
    <>
      <Animated.View
        entering={FadeIn.duration(90)}
        exiting={FadeOut.duration(70)}
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.scrim,
          isLocked && styles.lockedScrim,
        ]}
      />
      <Animated.View
        entering={FadeInDown.duration(140)}
        exiting={FadeOutDown.duration(90)}
        onTouchStart={(event) => event.stopPropagation()}
        onLayout={(event) => {
          const measuredHeight = event.nativeEvent.layout.height;
          if (Math.abs(measuredHeight - popupHeight) > 0.5) {
            setPopupHeight(measuredHeight);
          }
        }}
        style={[
          styles.popup,
          {
            width: popupWidth,
            left: popupLeft,
            backgroundColor: popupFace,
            borderColor: isLocked ? themeColors.border : `${variantColors.face}80`,
            borderBottomColor: popupRim,
          },
          popupTop != null
            ? { top: popupTop }
            : { bottom: Math.max(insets.bottom + 20, 106) },
        ]}
        accessibilityViewIsModal={false}
      >
        {selection.anchor ? (
          <View
            pointerEvents="none"
            style={[
              placeAbove ? styles.caretBottom : styles.caretTop,
              {
                // Keep this in physical screen coordinates. On native RTL,
                // React Native can swap an absolute `left` value a second time,
                // which points at the English-side node instead of the tapped one.
                transform: [{ translateX: caretLeft }],
                [placeAbove ? "borderTopColor" : "borderBottomColor"]: popupFace,
              },
            ]}
          />
        ) : null}
        <View
          style={[
            styles.headingRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.headingCopy,
              { alignItems: isRtl ? "flex-end" : "flex-start" },
            ]}
          >
            <AppText
              style={[
                styles.title,
                {
                  color: themeColors.foreground,
                  textAlign: isRtl ? "right" : "left",
                  writingDirection: isRtl ? "rtl" : "ltr",
                },
              ]}
              forceKurdishFont={isKu}
              forceLatinFont={!isKu}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.78}
            >
              {sectionTitle || `${t("path.unitShort")} ${unitNumber}`}
            </AppText>
            <AppText
              style={[
                styles.meta,
                {
                  color: themeColors.mutedForeground,
                  textAlign: isRtl ? "right" : "left",
                  writingDirection: isRtl ? "rtl" : "ltr",
                },
              ]}
              forceKurdishFont={isKu}
              forceLatinFont={!isKu}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
            >
              {`${t("path.unitShort")} ${unitNumber}  ·  ${t("path.lessonShort")} ${lessonNumber}`}
            </AppText>
          </View>
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel={t("slang.close")}
            hitSlop={10}
            style={[styles.closeButton, { backgroundColor: themeColors.muted }]}
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={19}
              color={themeColors.foreground}
              strokeWidth={2.4}
            />
          </Pressable>
        </View>

        <PressableScale
          onPress={isLocked ? undefined : startLesson}
          disabled={isLocked}
          accessibilityRole="button"
          accessibilityLabel={t("home.startLesson")}
          style={[styles.startButton, isLocked && styles.lockedStartButton]}
          scaleDown={0.975}
        >
          <AppText
            style={[
              styles.startText,
              { color: isLocked ? "#64748B" : "#FFFFFF" },
            ]}
            forceKurdishFont={isKu}
            forceLatinFont={!isKu}
          >
            {t("home.startLesson")}
          </AppText>
        </PressableScale>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  scrim: {
    backgroundColor: "rgba(15,23,42,0.12)",
    zIndex: 30,
  },
  lockedScrim: {
    backgroundColor: "rgba(15,23,42,0.18)",
  },
  popup: {
    position: "absolute",
    zIndex: 40,
    borderRadius: 26,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderBottomWidth: 6,
    padding: 18,
    gap: 16,
    ...crossShadow({
      color: "#0F172A",
      offsetY: 12,
      blur: 28,
      opacity: 0.26,
      elevation: 12,
    }),
  },
  caretTop: {
    position: "absolute",
    left: 0,
    top: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  caretBottom: {
    position: "absolute",
    left: 0,
    bottom: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  headingRow: {
    alignItems: "flex-start",
    gap: 12,
  },
  headingCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    width: "100%",
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "800",
  },
  meta: {
    width: "100%",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  closePressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.82,
  },
  startButton: {
    width: "100%",
    height: PRIMARY_ACTION.height,
    borderRadius: PRIMARY_ACTION.radius,
    borderCurve: "continuous",
    backgroundColor: PRIMARY_ACTION.face,
    borderBottomWidth: PRIMARY_ACTION.rimWidth,
    borderBottomColor: PRIMARY_ACTION.rim,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  startText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    letterSpacing: 0.35,
  },
  lockedStartButton: {
    backgroundColor: "#F1F5F9",
    borderColor: "#CBD5E1",
    borderBottomColor: "#94A3B8",
  },
});
