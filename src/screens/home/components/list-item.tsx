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
} from "@/constants/icons";
import { LessonListItem, SectionTheme } from "@/data/list-items";
import type { LessonPathMode } from "@/data/lesson-content";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { CompletedCheckIcon } from "./completed-check-icon";
import { FirstItemSparkles } from "./first-item-sparkles";
import { LessonProgressRing } from "./lesson-progress-ring";
import { SVG_BUTTON_COLOR_SETS, SvgButton, SvgButtonVariant } from "./list-button";

const LESSON_BUTTON_SIZE = 80;
const CHEST_VISUAL_SIZE = 65;
const PROGRESS_RING_SIZE = 94;
const PROGRESS_RING_OFFSET_X = (LESSON_BUTTON_SIZE - PROGRESS_RING_SIZE) / 2;
const PROGRESS_RING_OFFSET_Y =
  (LESSON_BUTTON_SIZE - PROGRESS_RING_SIZE) / 2 - 5;

const ITEM_SLOT_HEIGHT = 78;
const CURVE_AMPLITUDE_RATIO = 0.18;
const ARC_FREQUENCY = Math.PI / 4;
const CURVE_TENSION = 1.25;

const getDynamicOffset = (globalIndex: number, amplitude: number) => {
  const baseSine = Math.sin(globalIndex * ARC_FREQUENCY);
  const adjustedSine =
    Math.sign(baseSine) * Math.pow(Math.abs(baseSine), CURVE_TENSION);
  return adjustedSine * amplitude * -1;
};

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
  const iconColorOverride = isCompleted
    ? "#FFFFFF"
    : isLocked
      ? undefined
      : globalIndex === 0
        ? "#B26A00"
        : isGrayInProgress
          ? "white"
          : undefined;
  const IconComponent = isCompleted ? CompletedCheckIcon : LESSON_ICON_MAP[type];

  const handleNavigate = () => {
    router.push({
      pathname: "/lesson",
      params: {
        id: String(item.lessonId),
        q: String(item.globalIndex),
        li: String(item.sectionItemIndex),
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
            isCurrentLesson={isCurrent}
            isLocked={isLocked}
            size={LESSON_BUTTON_SIZE}
            onPress={isLocked ? undefined : handleNavigate}
            variant={buttonColor}
            IconComponent={IconComponent}
            iconColor={iconColorOverride}
          />
        )}
      </View>
    </View>
  );
});
