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
import { LessonListItem } from "@/data/list-items";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Platform, Pressable, useWindowDimensions, View } from "react-native";
import { FirstItemSparkles } from "./first-item-sparkles";
import { LessonProgressRing } from "./lesson-progress-ring";
import { SVG_BUTTON_COLOR_SETS, SvgButton } from "./list-button";

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

export type ListItemPressMeasurement = {
  id: string;
  type: LessonListItem["type"];
  globalIndex: number;
  lessonId: number;
  sectionItemIndex: number;
  popupFaceColor: string;
  popupRimColor: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type ListItemProps = {
  item: LessonListItem;
  onPressMeasure?: (measurement: ListItemPressMeasurement) => void;
};

export const ListItem = ({ item, onPressMeasure }: ListItemProps) => {
  const { width } = useWindowDimensions();
  const buttonAnchorRef = useRef<View>(null);
  const router = useRouter();
  const amplitude = width * CURVE_AMPLITUDE_RATIO;

  const { globalIndex, type, sectionTheme, isCurrent, progressSegments } = item;

  const xOffset = getDynamicOffset(globalIndex, amplitude);
  const isGrayInProgress = isCurrent && sectionTheme === "gray";
  const buttonColor =
    type === "cup" ? "yellow" : isGrayInProgress ? "mint" : sectionTheme;
  const popupFaceColor = SVG_BUTTON_COLOR_SETS[buttonColor].face;
  const popupRimColor = SVG_BUTTON_COLOR_SETS[buttonColor].rim;
  const iconColorOverride =
    globalIndex === 0 ? "#B26A00" : isGrayInProgress ? "white" : undefined;

  // ─── Mobile: tap → navigate directly (no popup, no hover on touch screens)
  // ─── Web:    hover → show popup | click → navigate directly
  const handleNavigate = () => {
    router.push(`/lesson?id=${item.lessonId}&q=${item.globalIndex}&li=${item.sectionItemIndex}`);
  };

  const handleHoverIn = () => {
    buttonAnchorRef.current?.measureInWindow((x, y, w, h) => {
      onPressMeasure?.({
        id: item.id,
        type: item.type,
        globalIndex: item.globalIndex,
        lessonId: item.lessonId,
        sectionItemIndex: item.sectionItemIndex,
        popupFaceColor,
        popupRimColor,
        x,
        y,
        width: w,
        height: h,
      });
    });
  };

  const webHoverProps =
    Platform.OS === "web" ? { onMouseEnter: handleHoverIn } : {};

  return (
    <View className={`justify-center items-center h-[${ITEM_SLOT_HEIGHT}]`}>
      <View
        ref={buttonAnchorRef}
        style={{ zIndex: 2, transform: [{ translateX: xOffset }] }}
        {...(webHoverProps as any)}
      >
        {globalIndex === 0 ? (
          <FirstItemSparkles size={LESSON_BUTTON_SIZE} />
        ) : null}

        {isCurrent ? (
          <View
            style={{
              pointerEvents: "none" as any,
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
            onPress={handleNavigate}
            style={{
              width: LESSON_BUTTON_SIZE,
              height: LESSON_BUTTON_SIZE,
              alignItems: "center",
              justifyContent: "center",
              marginTop: -4,
            }}
          >
            {sectionTheme === "gray" ? (
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
            size={LESSON_BUTTON_SIZE}
            onPress={handleNavigate}
            variant={buttonColor}
            IconComponent={LESSON_ICON_MAP[type]}
            iconColor={iconColorOverride}
          />
        )}
      </View>
    </View>
  );
};
