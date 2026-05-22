import { SvgAppButton } from "@/components/shared/svg-app-button";
import { LessonType } from "@/data/list-items";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type LessonPressPopupProps = {
  top: SharedValue<number>;
  pointerCenterX: SharedValue<number>;
  progress: SharedValue<number>;
  faceColor: SharedValue<string>;
  rimColor: SharedValue<string>;
  lessonType: LessonType;
  lessonId: number;
  globalIndex: number;
  sectionItemIndex: number;
  height?: number;
};

const LESSON_POPUP_CONTENT: Record<
  LessonType,
  { title: string; buttonLabel: string }
> = {
  practice: { title: "ڕاهێنان: شارەزایی سەرەکی", buttonLabel: "ڕاهێنان +10 XP" },
  video: { title: "ڤیدیۆ: سەیرکە و فێربە", buttonLabel: "سەیرکردن +12 XP" },
  reading: { title: "خوێندنەوە: چیرۆکی خێرا", buttonLabel: "خوێندنەوە +12 XP" },
  listening: { title: "گوێگرتن: سەرنجدان لە دەنگ", buttonLabel: "گوێگرتن +12 XP" },
  gift: { title: "خەڵات: سندوقەکە ئامادەیە", buttonLabel: "کردنەوەی سندوق" },
  game: { title: "یاری: شێوازی ململانێ", buttonLabel: "یاریکردن +15 XP" },
  speaking: { title: "قسەکردنی: بە دەنگی بەرز بیڵێ", buttonLabel: "قسەکردن +15 XP" },
  conversation: {
    title: "گفتوگۆ: وتووێژی ڕاستەقینە",
    buttonLabel: "قسەکردن +15 XP",
  },
  cup: { title: "یەکە تەواو بوو: تاقیکردنەوەی کۆتایی", buttonLabel: "دەستپێکردنی تاقیکردنەوە" },
};

export const LessonPressPopup = ({
  top,
  pointerCenterX,
  progress,
  faceColor,
  rimColor,
  lessonType,
  lessonId,
  globalIndex,
  sectionItemIndex,
  height = 116,
}: LessonPressPopupProps) => {
  const router = useRouter();
  
  // Use the global index for the title, so each dot is a uniquely numbered lesson
  const baseContent = LESSON_POPUP_CONTENT[lessonType];
  const popupContent = {
    ...baseContent,
    title: lessonType === "cup" ? baseContent.title : `وانەی ${globalIndex + 1} - ${baseContent.title.split(":")[0]}`,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    top: top.value,
    height,
    opacity: interpolate(
      progress.value,
      [0, 0.35, 0.72, 1],
      [0, 0.2, 0.88, 1],
    ),
    transform: [
      { scale: progress.value },
      { translateY: (1 - progress.value) * 8 },
    ],
  }));

  const pointerAnimatedStyle = useAnimatedStyle(() => ({
    left: pointerCenterX.value - 8,
    backgroundColor: faceColor.value,
    borderColor: faceColor.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: faceColor.value,
    borderColor: faceColor.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: rimColor.value,
  }));

  return (
    <Animated.View
      style={[styles.container, animatedStyle, { pointerEvents: "box-none" } as any]}
    >
      <Animated.View style={[styles.pointer, pointerAnimatedStyle]} />
      <Animated.View
        className="px-4 justify-between py-3"
        style={[styles.card, cardAnimatedStyle]}
      >
        <Text className="text-white text-xl font-rd-bold" numberOfLines={1}>
          {popupContent.title}
        </Text>
        <SvgAppButton
          width="100%"
          height={42}
          color="#1CB0F6"
          backgroundColor="#1490CC"
          leftRadius={12}
          rightRadius={12}
          pressDepth={4}
          onPress={() => {
            router.push(`/lesson?id=${lessonId}&q=${globalIndex}&li=${sectionItemIndex}`);
          }}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            className="text-base font-rd-bold"
            style={{ color: "#FFFFFF", fontWeight: "800" }}
          >
            {popupContent.buttonLabel}
          </Text>
        </SvgAppButton>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: "10%",
    width: "80%",
    zIndex: 40,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
  },
  pointer: {
    position: "absolute",
    top: -8,
    width: 16,
    height: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    transform: [{ rotate: "45deg" }],
    zIndex: 41,
  },
});
