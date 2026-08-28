import { LessonListItem, SectionTheme } from "../../../data/list-items";
import type { LessonPathMode } from "../../../data/lesson-content";
import {
  Chest,
  ChestUnlocked,
  LessonBook,
  LessonDumbbell,
  LessonGame,
  LessonHeadphone,
  LessonMicrophone,
  LessonStar,
  LessonVideo,
} from "../../../constants/icons";
import { IOSPressable } from "../../../components/ui/ios-pressable";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Platform, View } from "react-native";
import { useI18n } from "../../../hooks/useI18n";
import { getPathCurveOffset } from "./path-curve";
import { CompletedCheckIcon } from "./completed-check-icon";
import {
  SVG_BUTTON_COLOR_SETS,
  CurrentLessonIcon,
  SvgButton,
  SvgButtonVariant,
} from "./list-button";
import { NormalPathNode } from "./normal-path-node";
import { LessonProgressRing } from "./lesson-progress-ring";
import { getPathMetrics } from "./path-metrics";
import { NormalPathCurveMascot } from "./normal-path-curve-mascot";
import { mascotForUnit, unitMascotSlot } from "./path-unit-mascots";
import { hapticSelection } from "../../../utils/haptics";

/** Node face icon per lesson type, as in the reference path. */
const LESSON_ICON_MAP = {
  practice: LessonStar,
  video: LessonVideo,
  reading: LessonBook,
  listening: LessonHeadphone,
  game: LessonGame,
  speaking: LessonMicrophone,
  conversation: LessonDumbbell,
  gift: LessonStar,
  cup: LessonStar,
} as const;

/** Ring geometry from the reference — 94px ring centred on an 80px node. */
const PROGRESS_RING_SIZE_RATIO = 94 / 80;

export type UnitChestKind = "silver" | "gold";

export function resolveUnitChestKind(
  sectionItemIndex: number,
  unitLessonCount: number,
): UnitChestKind | undefined {
  if (unitLessonCount <= 0) return undefined;
  if (sectionItemIndex === unitLessonCount - 1) return "gold";

  const middleLessonIndex = Math.floor((unitLessonCount - 1) / 2);
  return sectionItemIndex === middleLessonIndex ? "silver" : undefined;
}

function getNormalPathOffset(globalIndex: number, screenWidth: number) {
  const amplitude = screenWidth * 0.18;
  const baseSine = Math.sin(globalIndex * (Math.PI / 4));
  const adjustedSine = Math.sign(baseSine) * Math.pow(Math.abs(baseSine), 1.25);
  return adjustedSine * amplitude * -1;
}

function lessonColorTheme(item: LessonListItem): SectionTheme {
  if (item.sectionTheme === "gray" && item.displayTheme !== "gray") {
    return item.displayTheme;
  }
  return item.sectionTheme;
}

function resolveButtonVariant(item: LessonListItem): SvgButtonVariant {
  if (item.status === "locked") return "gray";
  if (item.status === "completed") return "gold";
  if (item.type === "cup") return "yellow";
  if (item.isCurrent && item.sectionTheme === "gray") return "mint";

  const theme = lessonColorTheme(item);
  if (theme in SVG_BUTTON_COLOR_SETS) {
    return theme as SvgButtonVariant;
  }
  return "blue";
}

type ListItemProps = {
  item: LessonListItem;
  screenWidth: number;
  unitLessonCount: number;
  pathMode?: LessonPathMode;
  isActiveLesson?: boolean;
  isSelected?: boolean;
  /**
   * Whether the learner has reached this item's unit. Drives the peak mascot's
   * locked state, which is a unit-level question rather than a row-level one —
   * a mascot sitting on a still-locked row inside the unit you are working
   * through should stay in colour.
   */
  isUnitReached?: boolean;
  onSelect?: (node: View | null) => void;
};

export const ListItem = React.memo(
  ({
    item,
    screenWidth,
    unitLessonCount,
    pathMode = "street",
    isActiveLesson = false,
    isSelected = false,
    isUnitReached = true,
    onSelect,
  }: ListItemProps) => {
    const router = useRouter();
    const nodeRef = useRef<View>(null);
    const compactWeb = Platform.OS === "web" && screenWidth < 768;
    const metrics = getPathMetrics(pathMode, compactWeb);
    const { isKu, isAr } = useI18n();

    const { globalIndex, status } = item;

    const isNormalPath = pathMode === "normal";
    const rawOffset = isNormalPath
      ? getNormalPathOffset(globalIndex, screenWidth)
      : getPathCurveOffset(globalIndex, screenWidth);
    const isRtl = isKu || isAr;
    const xOffset = isRtl ? -rawOffset : rawOffset;
    const isLocked = status === "locked";
    const isCompleted = status === "completed";
    const isUnavailable = isCompleted;
    const LessonNodeIcon = isCompleted
      ? CompletedCheckIcon
      : (LESSON_ICON_MAP[item.type] ?? LessonStar);
    const showsActiveStar =
      !isLocked && !isCompleted && (isActiveLesson || item.isCurrent);
    const isGrayInProgress = isActiveLesson && item.sectionTheme === "gray";
    const buttonColor = resolveButtonVariant(item);
    const iconColorOverride = isCompleted
      ? "#49340E"
      : isGrayInProgress
        ? "white"
        : undefined;
    const unitNumber = item.displayUnitNumber ?? item.lessonId + 1;
    const lessonNumber = item.sectionItemIndex + 1;
    const chestKind = resolveUnitChestKind(
      item.sectionItemIndex,
      unitLessonCount,
    );
    const RewardChest = chestKind === "gold" ? ChestUnlocked : Chest;
    /** The one branch below that renders `NormalPathNode`. */
    const isNormalPathNode = isNormalPath && !chestKind;

    // Normal path only: the mascot fills the gap the curve leaves at its
    // extremes. Anchored to the unit, so each unit gets its own two companions
    // in its own colour rather than a running global count.
    const mascotSlot = isNormalPath
      ? unitMascotSlot(globalIndex, item.sectionItemIndex, unitLessonCount)
      : null;
    const unitMascotId = mascotSlot
      ? mascotForUnit(lessonColorTheme(item), mascotSlot.slot)
      : null;

    const handleNavigate = () => {
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
    const handleSelect = () => {
      hapticSelection();
      if (onSelect && !isUnavailable) {
        onSelect(nodeRef.current);
        return;
      }
      handleNavigate();
    };

    // Street and kids nodes are taller than `lessonButtonSize` — they also carry
    // a rim and a ground shadow below the face — so centring on the face size
    // alone would sit every node low in its slot. The occupied height is
    // approximated before splitting the remainder.
    //
    // The normal path's SVG node draws entirely inside its own box, so it just
    // centres, exactly as the reference does.
    const slotPaddingTop = isNormalPath
      ? 0
      : Math.max(
          6,
          Math.round((metrics.slotHeight - metrics.lessonButtonSize * 1.16) / 2),
        );

    return (
      <View
        style={{
          height: metrics.slotHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: isNormalPath ? "center" : "flex-start",
          paddingTop: slotPaddingTop,
        }}
      >
        {mascotSlot && unitMascotId ? (
          <NormalPathCurveMascot
            globalIndex={globalIndex}
            nodeOffsetX={xOffset}
            slotHeight={metrics.slotHeight}
            slotPaddingTop={slotPaddingTop}
            isLocked={!isUnitReached}
            mascotId={unitMascotId}
            slot={mascotSlot.slot}
          />
        ) : null}

        <View style={{ zIndex: 2, transform: [{ translateX: xOffset }] }}>
          <View
            ref={nodeRef}
            // This is the view the popup anchors to, so it has to survive
            // Android's layout-only view flattening — a collapsed view has no
            // native counterpart for `measureInWindow` to report.
            collapsable={isNormalPathNode ? false : undefined}
            style={{
              position: "relative",
              width: metrics.lessonButtonSize,
              minHeight: metrics.lessonButtonSize,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {chestKind ? (
              <IOSPressable
                disabled={isLocked || isUnavailable}
                onPress={isLocked || isUnavailable ? undefined : handleSelect}
                accessibilityRole="button"
                accessibilityLabel={`Unit ${unitNumber} lesson ${lessonNumber}, ${chestKind} chest${isLocked ? ", locked" : isCompleted ? ", completed" : ", current"}`}
                accessibilityState={{
                  disabled: isLocked || isUnavailable,
                  selected: isSelected,
                }}
                style={{
                  width: metrics.lessonButtonSize,
                  height: metrics.lessonButtonSize,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RewardChest
                  width={metrics.lessonButtonSize}
                  height={metrics.lessonButtonSize}
                />
                {showsActiveStar && !isLocked ? (
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      top: Math.round(metrics.lessonButtonSize * 0.31),
                    }}
                  >
                    <CurrentLessonIcon
                      size={Math.round(metrics.lessonButtonSize * 0.4)}
                    />
                  </View>
                ) : isCompleted ? (
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      top: Math.round(metrics.lessonButtonSize * 0.32),
                      width: Math.round(metrics.lessonButtonSize * 0.39),
                      height: Math.round(metrics.lessonButtonSize * 0.39),
                      borderRadius: Math.round(metrics.lessonButtonSize * 0.2),
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FFC72C",
                      borderWidth: 1.5,
                      borderColor: "#8E5000",
                    }}
                  >
                    <CompletedCheckIcon
                      width={Math.round(metrics.lessonButtonSize * 0.28)}
                      height={Math.round(metrics.lessonButtonSize * 0.28)}
                      color="#49340E"
                    />
                  </View>
                ) : null}
              </IOSPressable>
            ) : isNormalPath ? (
              <>
                {showsActiveStar ? (
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LessonProgressRing
                      size={Math.round(
                        metrics.lessonButtonSize * PROGRESS_RING_SIZE_RATIO,
                      )}
                      progressSegments={item.progressSegments}
                      activeColor={
                        SVG_BUTTON_COLOR_SETS[buttonColor]?.face ?? "#B87BEF"
                      }
                    />
                  </View>
                ) : null}
                <NormalPathNode
                  isLocked={isLocked}
                  isUnavailable={isUnavailable}
                  isCurrentLesson={showsActiveStar}
                  isCompleted={isCompleted}
                  isSelected={isSelected}
                  size={metrics.lessonButtonSize}
                  onPress={isLocked || isUnavailable ? undefined : handleSelect}
                  variant={buttonColor}
                  IconComponent={LessonNodeIcon}
                  iconColor={iconColorOverride}
                  accessibilityLabel={
                    isLocked
                      ? `Unit ${unitNumber} lesson ${lessonNumber}, locked`
                      : isCompleted
                        ? `Unit ${unitNumber} lesson ${lessonNumber}, completed`
                        : `Unit ${unitNumber} lesson ${lessonNumber}${isActiveLesson ? ", current" : ""}`
                  }
                />
              </>
            ) : (
              <SvgButton
                isLocked={isLocked}
                isUnavailable={isUnavailable}
                isCurrentLesson={showsActiveStar}
                isCompleted={isCompleted}
                isSelected={isSelected}
                size={metrics.lessonButtonSize}
                onPress={isLocked || isUnavailable ? undefined : handleSelect}
                activateOnPressIn={Platform.OS !== "web"}
                variant={buttonColor}
                IconComponent={isCompleted ? CompletedCheckIcon : undefined}
                label={isCompleted ? undefined : item.pathIndex + 1}
                iconColor={iconColorOverride}
                accessibilityLabel={
                  isLocked
                    ? `Unit ${unitNumber} lesson ${lessonNumber}, locked`
                    : isCompleted
                      ? `Unit ${unitNumber} lesson ${lessonNumber}, completed`
                      : `Unit ${unitNumber} lesson ${lessonNumber}${isActiveLesson ? ", current" : ""}`
                }
              />
            )}
          </View>
        </View>
      </View>
    );
  },
);

ListItem.displayName = "ListItem";
