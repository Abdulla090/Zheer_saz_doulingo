import { LessonListItem, SectionTheme } from "../../../data/list-items";
import type { LessonPathMode } from "../../../data/lesson-content";
import { Chest, ChestUnlocked } from "../../../constants/icons";
import { IOSPressable } from "../../../components/ui/ios-pressable";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Platform, View } from "react-native";
import { useI18n } from "../../../hooks/useI18n";
import { FirstItemSparkles } from "./first-item-sparkles";
import { getPathCurveOffset } from "./path-curve";
import { CompletedCheckIcon } from "./completed-check-icon";
import {
  SVG_BUTTON_COLOR_SETS,
  CurrentLessonIcon,
  SvgButton,
  SvgButtonVariant,
} from "./list-button";
import { getPathMetrics } from "./path-metrics";
import { hapticSelection } from "../../../utils/haptics";

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
    const showsActiveStar =
      !isLocked && !isCompleted && (isActiveLesson || item.isCurrent);
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
      hapticSelection();
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
                      backgroundColor: "#F2A900",
                      borderWidth: 1.5,
                      borderColor: "rgba(255,255,255,0.72)",
                    }}
                  >
                    <CompletedCheckIcon
                      width={Math.round(metrics.lessonButtonSize * 0.28)}
                      height={Math.round(metrics.lessonButtonSize * 0.28)}
                    />
                  </View>
                ) : null}
              </IOSPressable>
            ) : (
              <SvgButton
                isLocked={isLocked}
                isCurrentLesson={showsActiveStar}
                isCompleted={isCompleted}
                isSelected={isSelected}
                size={metrics.lessonButtonSize}
                onPress={isLocked && !onSelect ? undefined : handleSelect}
                variant={buttonColor}
                label={item.pathIndex + 1}
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
