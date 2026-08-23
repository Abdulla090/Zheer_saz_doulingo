import { PressableScale } from "../../../components/animations/PressableScale";
import { AppText } from "../../../components/ui/AppText";
import type { LessonPathMode } from "../../../data/lesson-content";
import type { SelectedPathLesson } from "../../../hooks/use-path-lesson-selection";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { crossShadow } from "../../../utils/shadows";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
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

/**
 * Compact node callout: the unit's name, which lesson this is, and one button.
 *
 * The card wears the tapped node's own colour rather than a themed surface, so
 * it reads as an extension of the node it is attached to. That colouring is why
 * there is no close button and no second line of chrome — everything on the
 * card has to survive being drawn on green, purple, or yellow, and the tap
 * target that dismisses it is the whole rest of the screen.
 */

/** Node colours whose face is too pale to carry white text. */
const PALE_FACE_VARIANTS: readonly SvgButtonVariant[] = [
  "gray",
  "yellow",
  "gold",
];

const CARD_MAX_WIDTH = 268;
const CARD_SIDE_MARGIN = 16;
const CARD_PADDING = 16;
const CARET_SIZE = 10;
/** Keeps the caret from sliding out past the card's rounded corners. */
const CARET_EDGE_INSET = 20;

/**
 * Opening height guess, used only for the very first frame before `onLayout`
 * reports the real one. Roughly: padding, a two-line title, the lesson line,
 * and the button.
 */
const ESTIMATED_CARD_HEIGHT = 168;

const GAP_OFFSET = 14;
const BOTTOM_CLEARANCE = 80;

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
  const { colors } = useThemeColors();
  const [cardHeight, setCardHeight] = useState(ESTIMATED_CARD_HEIGHT);

  if (!selection) return null;

  const { item, sectionTitle } = selection;
  const isLocked = item.status === "locked";
  const isCompleted = item.status === "completed";
  const isRtl = isKu || isAr;
  const unitNumber = item.displayUnitNumber ?? item.lessonId + 1;
  const lessonNumber = item.sectionItemIndex + 1;

  const variant = popupVariant(selection);
  const variantColors = SVG_BUTTON_COLOR_SETS[variant];
  const isPaleFace = PALE_FACE_VARIANTS.includes(variant);
  const cardFace = variantColors.face;
  const cardRim = variantColors.rim;
  const ink = isPaleFace ? "#243044" : "#FFFFFF";
  const inkSoft = isPaleFace ? "rgba(36,48,68,0.66)" : "rgba(255,255,255,0.84)";
  const actionInk = isLocked ? colors.mutedForeground : colors.foreground;

  const isDesktopWeb = Platform.OS === "web" && isDesktopWebWidth(windowWidth);
  const fallbackViewportWidth = isDesktopWeb
    ? Math.max(
        320,
        windowWidth - WEB_DESKTOP_NAV_WIDTH - WEB_DESKTOP_RAIL_WIDTH,
      )
    : windowWidth;
  const viewportWidth = selection.anchor?.rootWidth ?? fallbackViewportWidth;
  const cardWidth = Math.min(
    viewportWidth - CARD_SIDE_MARGIN * 2,
    CARD_MAX_WIDTH,
  );

  const nodeTop = selection.anchor?.nodeTop ?? 0;
  const nodeHeight = selection.anchor?.nodeHeight ?? 76;
  const nodeBottom = nodeTop + nodeHeight;

  /*
   * Centred on the node rather than on the viewport. A full-width card could be
   * centred either way and still land under the finger; this one is narrow
   * enough that viewport-centring would push it a long way off the node it
   * belongs to, with the caret stretched over to reach.
   */
  const anchorX = selection.anchor?.x ?? viewportWidth / 2;
  const cardLeft = Math.max(
    CARD_SIDE_MARGIN,
    Math.min(
      viewportWidth - cardWidth - CARD_SIDE_MARGIN,
      anchorX - cardWidth / 2,
    ),
  );

  const placeAbove =
    Boolean(selection.anchor) &&
    nodeBottom + cardHeight + GAP_OFFSET >
      (selection.anchor?.rootHeight ?? windowHeight) -
        Math.max(insets.bottom, 20) -
        BOTTOM_CLEARANCE;

  const cardTop = selection.anchor
    ? placeAbove
      ? Math.max(16, nodeTop - cardHeight - GAP_OFFSET)
      : nodeBottom + GAP_OFFSET
    : undefined;

  const caretLeft = selection.anchor
    ? Math.max(
        CARET_EDGE_INSET,
        Math.min(
          cardWidth - CARET_EDGE_INSET - CARET_SIZE * 2,
          anchorX - cardLeft - CARET_SIZE,
        ),
      )
    : 0;

  const startLesson = () => {
    if (isLocked || isCompleted) return;
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

  const lessonLine = selection.unitLessonCount
    ? t("path.lessonOfCount", {
        current: lessonNumber,
        total: selection.unitLessonCount,
      })
    : `${t("path.lessonShort")} ${lessonNumber}`;

  return (
    <>
      <Animated.View
        entering={FadeIn.duration(100).easing(Easing.out(Easing.cubic))}
        exiting={FadeOut.duration(80).easing(Easing.in(Easing.quad))}
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.scrim, isLocked && styles.lockedScrim]}
      />
      <Pressable
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel={t("common.close")}
        style={styles.dismissTarget}
      />
      <Animated.View
        entering={FadeInDown.duration(135).easing(Easing.out(Easing.cubic))}
        exiting={FadeOutDown.duration(100).easing(Easing.in(Easing.quad))}
        onTouchStart={(event) => event.stopPropagation()}
        onLayout={(event) => {
          const measured = event.nativeEvent.layout.height;
          if (Math.abs(measured - cardHeight) > 0.5) setCardHeight(measured);
        }}
        style={[
          styles.card,
          {
            width: cardWidth,
            left: cardLeft,
            backgroundColor: cardFace,
            borderBottomColor: cardRim,
          },
          cardTop != null
            ? { top: cardTop }
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
                [placeAbove ? "borderTopColor" : "borderBottomColor"]: cardFace,
              },
            ]}
          />
        ) : null}

        <AppText
          style={[
            styles.title,
            {
              color: ink,
              textAlign: isRtl ? "right" : "left",
              writingDirection: isRtl ? "rtl" : "ltr",
            },
          ]}
          forceKurdishFont={isKu}
          forceLatinFont={!isKu}
          numberOfLines={2}
        >
          {sectionTitle || `${t("path.unitShort")} ${unitNumber}`}
        </AppText>

        <AppText
          style={[
            styles.lessonLine,
            {
              color: inkSoft,
              textAlign: isRtl ? "right" : "left",
              writingDirection: isRtl ? "rtl" : "ltr",
            },
          ]}
          forceKurdishFont={isKu}
          forceLatinFont={!isKu}
          numberOfLines={1}
        >
          {lessonLine}
        </AppText>

        <PressableScale
          onPress={isLocked || isCompleted ? undefined : startLesson}
          activateOnPressIn={Platform.OS !== "web"}
          disabled={isLocked || isCompleted}
          accessibilityRole="button"
          accessibilityLabel={t("home.startLesson")}
          style={[
            styles.action,
            {
              backgroundColor: isLocked ? colors.muted : colors.surfaceRaised,
              borderBottomColor: colors.border,
            },
          ]}
          scaleDown={0.975}
        >
          <AppText
            style={[styles.actionText, { color: actionInk }]}
            forceKurdishFont={isKu}
            forceLatinFont={!isKu}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
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
  dismissTarget: {
    ...StyleSheet.absoluteFill,
    zIndex: 31,
  },
  lockedScrim: {
    backgroundColor: "rgba(15,23,42,0.18)",
  },
  card: {
    position: "absolute",
    // Popup coordinates come from physical window measurements. Keep this
    // overlay LTR so React Native does not mirror `left` in RTL languages.
    ...(Platform.OS !== "web" ? ({ direction: "ltr" } as const) : {}),
    zIndex: 40,
    borderRadius: 20,
    borderCurve: "continuous",
    borderBottomWidth: 5,
    padding: CARD_PADDING,
    gap: 4,
    ...crossShadow({
      color: "#0F172A",
      offsetY: 10,
      blur: 22,
      opacity: 0.24,
      elevation: 10,
    }),
  },
  caretTop: {
    position: "absolute",
    left: 0,
    top: -CARET_SIZE,
    width: 0,
    height: 0,
    borderLeftWidth: CARET_SIZE,
    borderRightWidth: CARET_SIZE,
    borderBottomWidth: CARET_SIZE,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  caretBottom: {
    position: "absolute",
    left: 0,
    bottom: -CARET_SIZE,
    width: 0,
    height: 0,
    borderLeftWidth: CARET_SIZE,
    borderRightWidth: CARET_SIZE,
    borderTopWidth: CARET_SIZE,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  title: {
    width: "100%",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
  },
  lessonLine: {
    width: "100%",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  action: {
    width: "100%",
    marginTop: 10,
    height: 46,
    borderRadius: 13,
    borderCurve: "continuous",
    borderBottomWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  actionText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
});
