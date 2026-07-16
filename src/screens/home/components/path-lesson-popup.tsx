import { PressableScale } from "../../../components/animations/PressableScale";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import { LessonPathIcon } from "../../../components/icons/LessonPathIcons";
import { AppText } from "../../../components/ui/AppText";
import type { LessonPathMode } from "../../../data/lesson-content";
import type { SelectedPathLesson } from "../../../hooks/use-path-lesson-selection";
import { useI18n } from "../../../hooks/useI18n";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SVG_BUTTON_COLOR_SETS, type SvgButtonVariant } from "./list-button";

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
  const { width: windowWidth } = useWindowDimensions();
  const { t, isKu, isAr } = useI18n();

  if (!selection) return null;

  const { item, sectionTitle } = selection;
  const isLocked = item.status === "locked";
  const isRtl = isKu || isAr;
  const unitNumber = item.displayUnitNumber ?? item.lessonId + 1;
  const lessonNumber = item.sectionItemIndex + 1;
  const colors = SVG_BUTTON_COLOR_SETS[popupVariant(selection)];
  const popupWidth = Math.min(windowWidth - 32, 560);
  const popupLeft = (windowWidth - popupWidth) / 2;
  const caretLeft = selection.anchor
    ? Math.max(
        22,
        Math.min(popupWidth - 42, selection.anchor.x - popupLeft - 10),
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
        style={[StyleSheet.absoluteFill, styles.scrim]}
      />
      <Animated.View
        entering={FadeInDown.duration(140)}
        exiting={FadeOutDown.duration(90)}
        onTouchStart={(event) => event.stopPropagation()}
        style={[
          styles.popup,
          {
            width: popupWidth,
            left: popupLeft,
            backgroundColor: colors.face,
            borderBottomColor: colors.rim,
          },
          selection.anchor
            ? { top: selection.anchor.y }
            : { bottom: Math.max(insets.bottom + 20, 106) },
        ]}
        accessibilityViewIsModal={false}
      >
        {selection.anchor ? (
          <View
            pointerEvents="none"
            style={[
              styles.caret,
              {
                left: caretLeft,
                borderBottomColor: colors.face,
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
          <View style={styles.iconWell}>
            <LessonPathIcon
              type={item.type === "gift" ? "practice" : item.type}
              color={colors.rim}
              size={25}
              active
              filled
            />
          </View>
          <View
            style={[
              styles.headingCopy,
              { alignItems: isRtl ? "flex-end" : "flex-start" },
            ]}
          >
            <AppText
              style={[
                styles.title,
                isLocked && styles.lockedTitle,
                {
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
                styles.meta,
                isLocked && styles.lockedMeta,
                {
                  textAlign: isRtl ? "right" : "left",
                  writingDirection: isRtl ? "rtl" : "ltr",
                },
              ]}
              forceKurdishFont={isKu}
              forceLatinFont={!isKu}
            >
              {`${t("path.unitShort")} ${unitNumber}  ·  ${t("path.lessonShort")} ${lessonNumber}`}
            </AppText>
          </View>
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel={t("slang.close")}
            hitSlop={10}
            style={styles.closeButton}
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={19}
              color={isLocked ? "#71717A" : "#FFFFFF"}
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
              { color: isLocked ? "#9CA3AF" : colors.rim },
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
    backgroundColor: "rgba(15,23,42,0.08)",
    zIndex: 30,
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
  },
  caret: {
    position: "absolute",
    top: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  headingRow: {
    alignItems: "flex-start",
    gap: 12,
  },
  iconWell: {
    width: 46,
    height: 46,
    borderRadius: 15,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  headingCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    width: "100%",
    color: "#FFFFFF",
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "800",
  },
  meta: {
    width: "100%",
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  lockedTitle: {
    color: "#52525B",
  },
  lockedMeta: {
    color: "#71717A",
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
    minHeight: 52,
    borderRadius: 17,
    borderCurve: "continuous",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
    borderBottomWidth: 4,
    borderBottomColor: "rgba(15,23,42,0.18)",
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
    backgroundColor: "#F4F4F5",
    borderColor: "#D4D4D8",
    borderBottomColor: "#C4C4C8",
  },
});
