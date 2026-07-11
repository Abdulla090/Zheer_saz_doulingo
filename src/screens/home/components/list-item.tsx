import {
  Chest,
  LessonBook,
  LessonDumbbell,
  LessonGame,
  LessonHeadphone,
  LessonMicrophone,
  LessonStar,
  LessonVideo,
  NavBarChest,
} from "../../../constants/icons";
import { LessonListItem, SectionTheme } from "../../../data/list-items";
import type { LessonPathMode } from "../../../data/lesson-content";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useI18n } from "../../../hooks/useI18n";
import { FirstItemSparkles } from "./first-item-sparkles";
import { getPathCurveOffset } from "./path-curve";
import { LessonPathBadge } from "./lesson-path-badge";
import { SVG_BUTTON_COLOR_SETS, SvgButton, SvgButtonVariant } from "./list-button";

const STREET_LESSON_BUTTON_SIZE = 64;
const NORMAL_LESSON_BUTTON_SIZE = 80;
const KIDS_LESSON_BUTTON_SIZE = 72;
const CHEST_VISUAL_SIZE = 52;
const NORMAL_CHEST_VISUAL_SIZE = 65;
const KIDS_CHEST_VISUAL_SIZE = 58;
const ITEM_SLOT_HEIGHT = 82;
const NORMAL_ITEM_SLOT_HEIGHT = 96;
const KIDS_ITEM_SLOT_HEIGHT = 90;
function getNormalPathOffset(globalIndex: number, screenWidth: number) {
  const amplitude = screenWidth * 0.18;
  const baseSine = Math.sin(globalIndex * (Math.PI / 4));
  const adjustedSine =
    Math.sign(baseSine) * Math.pow(Math.abs(baseSine), 1.25);
  return adjustedSine * amplitude * -1;
}

const LESSON_ICON_MAP = {
  practice: LessonStar,
  video: LessonVideo,
  reading: LessonBook,
  listening: LessonHeadphone,
  game: LessonGame,
  speaking: LessonMicrophone,
  conversation: LessonDumbbell,
  cup: LessonStar,
} as const;

function pathMetrics(pathMode: LessonPathMode) {
  const isKids = pathMode === "kids";
  const isNormal = pathMode === "normal";
  const lessonButtonSize = isKids
    ? KIDS_LESSON_BUTTON_SIZE
    : isNormal
      ? NORMAL_LESSON_BUTTON_SIZE
      : STREET_LESSON_BUTTON_SIZE;
  const chestSize = isKids
    ? KIDS_CHEST_VISUAL_SIZE
    : isNormal
      ? NORMAL_CHEST_VISUAL_SIZE
      : CHEST_VISUAL_SIZE;
  const slotHeight = isKids
    ? KIDS_ITEM_SLOT_HEIGHT
    : isNormal
      ? NORMAL_ITEM_SLOT_HEIGHT
      : ITEM_SLOT_HEIGHT;
  return {
    lessonButtonSize,
    chestSize,
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
  pathMode?: LessonPathMode;
};

export const ListItem = React.memo(({ item, screenWidth, pathMode = "street" }: ListItemProps) => {
  const router = useRouter();
  const metrics = pathMetrics(pathMode);
  const { isKu } = useI18n();

  const { globalIndex, type, isCurrent, status } = item;

  const isNormalPath = pathMode === "normal";
  const rawOffset = isNormalPath
    ? getNormalPathOffset(globalIndex, screenWidth)
    : getPathCurveOffset(globalIndex, screenWidth);
  const xOffset = isKu ? -rawOffset : rawOffset;
  const isLocked = status === "locked";
  const isGrayInProgress = isCurrent && item.sectionTheme === "gray";
  const buttonColor = resolveButtonVariant(item);
  const iconColorOverride =
    globalIndex === 0 ? "#B26A00" : isGrayInProgress ? "white" : undefined;
  const unitNumber = item.displayUnitNumber ?? item.lessonId + 1;
  const lessonNumber = item.sectionItemIndex + 1;

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

  return (
    <View
      className="justify-center items-center"
      style={{ height: metrics.slotHeight, width: "100%" }}
    >
      <View style={{ zIndex: 2, transform: [{ translateX: xOffset }] }}>
        {globalIndex === 0 ? (
          <FirstItemSparkles size={metrics.lessonButtonSize} />
        ) : null}

        <View
          style={{
            position: "relative",
            width: metrics.lessonButtonSize,
            minHeight: metrics.lessonButtonSize,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {type === "gift" ? (
            <Pressable
              onPress={isLocked ? undefined : handleNavigate}
              disabled={isLocked}
              style={{
                width: metrics.lessonButtonSize,
                height: metrics.lessonButtonSize,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -4,
              }}
            >
              {isLocked || lessonColorTheme(item) === "gray" ? (
                <Chest width={metrics.chestSize} height={metrics.chestSize} />
              ) : (
                <NavBarChest
                  width={metrics.chestSize}
                  height={metrics.chestSize}
                />
              )}
            </Pressable>
          ) : (
            <SvgButton
              isLocked={isLocked}
              isCurrentLesson={isCurrent}
              size={metrics.lessonButtonSize}
              onPress={isLocked ? undefined : handleNavigate}
              variant={buttonColor}
              IconComponent={LESSON_ICON_MAP[type]}
              iconColor={iconColorOverride}
              accessibilityLabel={
                isLocked
                  ? `Unit ${unitNumber} lesson ${lessonNumber}, locked`
                  : `Unit ${unitNumber} lesson ${lessonNumber}${isCurrent ? ", current" : ""}`
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
});

ListItem.displayName = "ListItem";

