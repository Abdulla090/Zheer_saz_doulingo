import React, { useState } from "react";
import {
  LayoutChangeEvent,
  useWindowDimensions,
  View,
} from "react-native";

import Svg, { Path } from "react-native-svg";

import { Flag } from "@/constants/icons";
import newCourses from "@/data/newCourses";
import { Icon3DPlus } from "@/components/icons/Icon3D";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import ProgressBar from "@/components/shared/progress-bar";
import { useI18n } from "@/hooks/useI18n";
import { AppText } from "@/components/ui/AppText";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type HeaderOverlayContentProps = {
  translateY: SharedValue<number>;
};

const HeaderOverlayContent = ({ translateY }: HeaderOverlayContentProps) => {
  const { width } = useWindowDimensions();
  const { isKu } = useI18n();
  const [scoreBarWidth, setScoreBarWidth] = useState(180);

  const handleScoreBarLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && Math.abs(nextWidth - scoreBarWidth) > 1) {
      setScoreBarWidth(nextWidth);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View className="bg-white w-full  pb-3" style={[animatedStyle]}>
      <Svg
        width={width}
        height={16}
        viewBox={`0 0 ${width} 16`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <AnimatedPath
          d={`M0 8 H40 L51 8 L60 1 L69 8 H${width}`}
          fill="none"
          stroke="#E5E5E5"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>
      <View className="px-4 pt-6">
        <View className="flex-row items-start  gap-3" style={{ flexDirection: isKu ? "row-reverse" : "row" }}>
          <View className="items-center gap-1 ">
            <View className="h-[70px] w-[85px] items-center justify-center rounded-[14px] border-[3px] border-[#1CB0F6]">
              <Flag width={70} height={70} />
            </View>
            <AppText
              className="text-base font-bold text-text-primary"
              forceKurdishFont={isKu}
            >
              ئەڵمانی
            </AppText>
          </View>
          <View className="items-center gap-1  ">
            <View className="h-[70px] w-[85px] scale-[0.75] items-center justify-center rounded-[14px] border-[3px] border-[#AFAFAF] ">
              <Icon3DPlus size={22} />
            </View>
            <AppText className="text-base font-bold text-gray-3" forceKurdishFont={isKu}>
              کۆرس
            </AppText>
          </View>
        </View>

        <View className="mt-3 w-full items-center gap-3 rounded-[10px] border border-[#E5E5E5] py-4">
          <View className="w-full flex-row items-center px-5" style={{ flexDirection: isKu ? "row-reverse" : "row" }}>
            <AppText className="text-lg font-bold text-text-primary" forceLatinFont>
              13
            </AppText>
            <View className="mx-3 flex-1" onLayout={handleScoreBarLayout}>
              <ProgressBar progress={0.72} width={scoreBarWidth} />
            </View>
            <AppText className="text-lg font-bold text-text-primary" forceLatinFont>
              14
            </AppText>
          </View>
          <AppText className="text-xl  text-text-secondary" forceKurdishFont={isKu}>
            خاڵیی ئەڵمانیت ١٣
          </AppText>
          <AppText
            className="text-base uppercase text-[#1CB0F6]"
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
            forceKurdishFont={isKu}
          >
            زیاتر دەربارەی خاڵ
          </AppText>
        </View>
        <View className="mt-3 gap-3 ">
          <AppText
            className="text-[24px] font-bold text-text-primary"
            forceKurdishFont={isKu}
          >
            کۆرسی نوێ
          </AppText>
          <View className="flex-row flex-wrap gap-3" style={{ flexDirection: isKu ? "row-reverse" : "row" }}>
            {newCourses.map((course) => (
              <View key={course.id} className="items-center gap-3">
                <View
                  className="relative h-[55px] w-[75px] items-center justify-center rounded-[10px]"
                  style={[{ backgroundColor: course.color }]}
                >
                  {course.isNew ? (
                    <View className="absolute -right-5 -top-4 z-2 rounded-[8] border-white border-[3] bg-[#FF4B4B] px-[6] py-[6]">
                      <AppText className="text-xs font-bold leading-3 text-white" forceKurdishFont={isKu}>
                        نوێ
                      </AppText>
                    </View>
                  ) : null}
                  <course.image color={"white"} width={40} height={40} />
                </View>
                <AppText
                  className="text-base font-bold text-text-primary"
                  forceKurdishFont={isKu}
                >
                  {course.title}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default HeaderOverlayContent;
