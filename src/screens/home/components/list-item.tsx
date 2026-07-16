import { LessonListItem, SectionTheme } from "../../../data/list-items";
import type { LessonPathMode } from "../../../data/lesson-content";
import { Chest, ChestUnlocked } from "../../../constants/icons";
import { IOSPressable } from "../../../components/ui/ios-pressable";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { View } from "react-native";
import { useI18n } from "../../../hooks/useI18n";
import { FirstItemSparkles } from "./first-item-sparkles";
import { getPathCurveOffset } from "./path-curve";
import { LessonPathBadge } from "./lesson-path-badge";
import { CompletedCheckIcon } from "./completed-check-icon";
import {
  SVG_BUTTON_COLOR_SETS,
  CurrentLessonIcon,
  SvgButton,
  SvgButtonVariant,
} from "./list-button";

const STREET_LESSON_BUTTON_SIZE = 76;
const NORMAL_LESSON_BUTTON_SIZE = 82;
const KIDS_LESSON_BUTTON_SIZE = 78;
const ITEM_SLOT_HEIGHT = 106;
const NORMAL_ITEM_SLOT_HEIGHT = 112;
const KIDS_ITEM_SLOT_HEIGHT = 108;

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

function pathMetrics(pathMode: LessonPathMode) {
  const isKids = pathMode === "kids";
  const isNormal = pathMode === "normal";
  const lessonButtonSize = isKids
    ? KIDS_LESSON_BUTTON_SIZE
    : isNormal
      ? NORMAL_LESSON_BUTTON_SIZE
      : STREET_LESSON_BUTTON_SIZE;
  const slotHeight = isKids
    ? KIDS_ITEM_SLOT_HEIGHT
    : isNormal
      ? NORMAL_ITEM_SLOT_HEIGHT
      : ITEM_SLOT_HEIGHT;
  return {
    lessonButtonSize,
    slotHeight,
  };
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
    onSelect,
  }: ListItemProps) => {
    const router = useRouter();
    const nodeRef = useRef<View>(null);
    const metrics = pathMetrics(pathMode);
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
    const isGrayInProgress = isActiveLesson && item.sectionTheme === "gray";
    const buttonColor = resolveButtonVariant(item);
    const iconColorOverride = isCompleted
      ? "#FFFFFF"
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
      if (onSelect) {
        onSelect(nodeRef.current);
        return;
      }
      handleNavigate();
    };

    return (
      <View
        style={{
          height: metrics.slotHeight,
          width: "100%",
          alignItems: "center",
          paddingTop: Math.max(
            8,
            (metrics.slotHeight - metrics.lessonButtonSize) / 2,
          ),
        }}
      >
        <View style={{ zIndex: 2, transform: [{ translateX: xOffset }] }}>
          {globalIndex === 0 ? (
            <FirstItemSparkles size={metrics.lessonButtonSize} />
          ) : null}

          <View
            ref={nodeRef}
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
                disabled={isLocked && !onSelect}
                onPress={isLocked && !onSelect ? undefined : handleSelect}
                accessibilityRole="button"
                accessibilityLabel={`Unit ${unitNumber} lesson ${lessonNumber}, ${chestKind} chest${isLocked ? ", locked" : isCompleted ? ", completed" : ", current"}`}
                accessibilityState={{
                  disabled: isLocked,
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
                {isActiveLesson && !isLocked ? (
                  <View
                    pointerEvents="none"
                    style={{ position: "absolute", top: 24 }}
                  >
                    <CurrentLessonIcon
                      size={Math.round(metrics.lessonButtonSize * 0.34)}
                    />
                  </View>
                ) : isCompleted ? (
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      top: 25,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#F2A900",
                      borderWidth: 1.5,
                      borderColor: "rgba(255,255,255,0.72)",
                    }}
                  >
                    <CompletedCheckIcon width={21} height={21} />
                  </View>
                ) : null}
              </IOSPressable>
            ) : (
              <SvgButton
                isLocked={isLocked}
                isCurrentLesson={isActiveLesson}
                isSelected={isSelected}
                size={metrics.lessonButtonSize}
                onPress={isLocked && !onSelect ? undefined : handleSelect}
                variant={buttonColor}
                label={isCompleted ? undefined : item.pathIndex + 1}
                IconComponent={isCompleted ? CompletedCheckIcon : undefined}
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
            {!isNormalPath ? (
              <LessonPathBadge
                unitNumber={unitNumber}
                lessonNumber={lessonNumber}
                nodeSize={metrics.lessonButtonSize}
                muted={isLocked}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  },
);

ListItem.displayName = "ListItem";
