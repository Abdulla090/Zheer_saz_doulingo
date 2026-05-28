import { Chest, NavBarChest } from "@/constants/icons";
import {
  LessonPathIcon,
  type LessonPathIconType,
} from "@/components/icons/LessonPathIcons";
import { LessonListItem, SectionTheme } from "@/data/list-items";
import type { LessonPathMode } from "@/data/lesson-content";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { CompletedCheckIcon } from "./completed-check-icon";
import { CurrentLessonIcon } from "./current-lesson-icon";
import { FirstItemSparkles } from "./first-item-sparkles";
import { LessonProgressRing } from "./lesson-progress-ring";
import { SVG_BUTTON_COLOR_SETS, SvgButton, SvgButtonVariant } from "./list-button";

const LESSON_BUTTON_SIZE = 64;
const CHEST_VISUAL_SIZE = 52;
const PROGRESS_RING_SIZE = 76;
const PROGRESS_RING_OFFSET_X = (LESSON_BUTTON_SIZE - PROGRESS_RING_SIZE) / 2;
const PROGRESS_RING_OFFSET_Y =
  (LESSON_BUTTON_SIZE - PROGRESS_RING_SIZE) / 2 - 4;

const ITEM_SLOT_HEIGHT = 66;
const CURVE_AMPLITUDE_RATIO = 0.18;
const ARC_FREQUENCY = Math.PI / 4;
const CURVE_TENSION = 1.25;
const PATH_ICON_SIZE = 24;

const getDynamicOffset = (globalIndex: number, amplitude: number) => {
  const baseSine = Math.sin(globalIndex * ARC_FREQUENCY);
  const adjustedSine =
    Math.sign(baseSine) * Math.pow(Math.abs(baseSine), CURVE_TENSION);
  return adjustedSine * amplitude * -1;
};

function lessonColorTheme(item: LessonListItem): SectionTheme {
  if (item.sectionTheme === "gray" && item.displayTheme !== "gray") {
    return item.displayTheme;
  }
  return item.sectionTheme;
}

function resolveButtonVariant(item: LessonListItem): SvgButtonVariant {
  if (item.status === "completed") return "gold";
  if (item.status === "locked") return "gray";
  if (item.type === "cup") return "yellow";
  if (item.isCurrent && item.sectionTheme === "gray") return "mint";

  const theme = lessonColorTheme(item);
  if (theme in SVG_BUTTON_COLOR_SETS) {
    return theme as SvgButtonVariant;
  }
  return "blue";
}

function resolveIconColor(
  item: LessonListItem,
  isCompleted: boolean,
  isLocked: boolean,
  isGrayInProgress: boolean,
  globalIndex: number,
): string {
  if (isCompleted) return "#FFFFFF";
  if (isLocked) return "#6B7280";
  if (globalIndex === 0) return "#B26A00";
  if (isGrayInProgress) return "#FFFFFF";
  return "#FFFFFF";
}

type ListItemProps = {
  item: LessonListItem;
  screenWidth: number;
  pathMode?: LessonPathMode;
};

export const ListItem = React.memo(({ item, screenWidth, pathMode = "street" }: ListItemProps) => {
  const router = useRouter();
  const amplitude = screenWidth * CURVE_AMPLITUDE_RATIO;

  const { globalIndex, type, isCurrent, progressSegments, status } = item;

  const xOffset = getDynamicOffset(globalIndex, amplitude);
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const isGrayInProgress = isCurrent && item.sectionTheme === "gray";
  const buttonColor = resolveButtonVariant(item);
  const iconColor = resolveIconColor(
    item,
    isCompleted,
    isLocked,
    isGrayInProgress,
    globalIndex,
  );

  const iconType = (type === "gift" ? "practice" : type) as LessonPathIconType;

  const pathIcon = useMemo(() => {
    if (isCompleted) {
      return (
        <CompletedCheckIcon
          width={PATH_ICON_SIZE}
          height={PATH_ICON_SIZE}
          color={iconColor}
        />
      );
    }
    const glyph = (
      <LessonPathIcon
        type={iconType}
        color={iconColor}
        size={PATH_ICON_SIZE}
        active={isCurrent}
      />
    );
    if (isCurrent) {
      return <CurrentLessonIcon>{glyph}</CurrentLessonIcon>;
    }
    return glyph;
  }, [iconColor, iconType, isCompleted, isCurrent]);

  const handleNavigate = () => {
    router.push({
      pathname: "/lesson",
      params: {
        id: String(item.lessonId),
        q: String(item.globalIndex),
        li: String(item.sectionItemIndex),
        pi: String(item.pathIndex),
        mode: pathMode,
      },
    });
  };

  return (
    <View className="justify-center items-center" style={{ height: ITEM_SLOT_HEIGHT }}>
      <View style={{ zIndex: 2, transform: [{ translateX: xOffset }] }}>
        {globalIndex === 0 ? (
          <FirstItemSparkles size={LESSON_BUTTON_SIZE} />
        ) : null}

        {isCurrent ? (
          <View
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: PROGRESS_RING_OFFSET_X,
              top: PROGRESS_RING_OFFSET_Y,
              zIndex: 0,
            }}
          >
            <LessonProgressRing
              size={PROGRESS_RING_SIZE}
              progressSegments={progressSegments}
            />
          </View>
        ) : null}

        {type === "gift" ? (
          <Pressable
            onPress={isLocked ? undefined : handleNavigate}
            disabled={isLocked}
            style={{
              width: LESSON_BUTTON_SIZE,
              height: LESSON_BUTTON_SIZE,
              alignItems: "center",
              justifyContent: "center",
              marginTop: -4,
            }}
          >
            {isLocked || lessonColorTheme(item) === "gray" ? (
              <Chest width={CHEST_VISUAL_SIZE} height={CHEST_VISUAL_SIZE} />
            ) : (
              <NavBarChest
                width={CHEST_VISUAL_SIZE}
                height={CHEST_VISUAL_SIZE}
              />
            )}
          </Pressable>
        ) : (
          <SvgButton
            isLocked={isLocked}
            isCurrentLesson={isCurrent}
            size={LESSON_BUTTON_SIZE}
            onPress={isLocked ? undefined : handleNavigate}
            variant={buttonColor}
            icon={pathIcon}
            accessibilityLabel={
              isLocked
                ? `Lesson ${globalIndex + 1}, locked`
                : `Lesson ${globalIndex + 1}${isCurrent ? ", current" : ""}`
            }
          />
        )}
      </View>
    </View>
  );
});

ListItem.displayName = "ListItem";
