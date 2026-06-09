import type { PathMode } from "../home/components/PathSwitcher";

import { useLocaleStore } from "../../stores/useLocaleStore";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useI18n } from "../../hooks/useI18n";
import * as Haptics from "expo-haptics";

import React, { useCallback, useMemo, useState } from "react";

import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Animated, { FadeIn, FadeOut, runOnJS } from "react-native-reanimated";

import {
  OnboardingSlide,
  type OnboardingSlideModel,
} from "./components/OnboardingSlide";
import { LanguageSelectionFlow } from "./LanguageSelectionFlow";



const IMAGE_SLIDE_MAX_W = 576;



const STEP_IDS = ["welcome", "paths", "practice", "progress", "ready"] as const;



export function OnboardingFlow() {
  const { width: screenWidth } = useWindowDimensions();



  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const pathMode = useSettingsStore((s) => s.pathMode);

  const setPathMode = useSettingsStore((s) => s.setPathMode);

  const localeReady = useLocaleStore((s) => s.ready);



  const [index, setIndex] = useState(0);
  const [showLangSelection, setShowLangSelection] = useState(false);

  const { isKu } = useI18n();
  const [selectedPath] = useState<PathMode>(

    pathMode === "street" || pathMode === "kids" ? pathMode : "normal",

  );



  const total = STEP_IDS.length;

  const isLast = index === total - 1;



  const slides = useMemo((): OnboardingSlideModel[] => {

    const meta: Record<

      (typeof STEP_IDS)[number],

      { title: string; subtitle: string }

    > = {

      welcome: {

        title: "Learn languages,\nspeak the world.",

        subtitle:

          "Smart AI lessons tailored to you.\nPractice, learn, and speak with\nconfidence.",

      },

      paths: {

        title: "AI-Powered\nLearning",

        subtitle:

          "Personalized lessons that adapt to\nyour level, pace, and goals.",

      },

      practice: {

        title: "Practice\nReal Conversations",

        subtitle:

          "Chat with AI or native speakers and\nbuild real-world communication\nskills.",

      },

      progress: {

        title: "Track Progress,\nStay Motivated",

        subtitle:

          "Set goals, track your growth, and\ncelebrate every step forward.",

      },

      ready: {

        title: "Your Journey\nStarts Now!",

        subtitle:

          "Explore. Learn. Connect.\nThe world is waiting for you.",

      },

    };



    return STEP_IDS.map((id) => ({

      id,

      ...meta[id],

      imageOnly: true,

    }));

  }, []);



  const activeSlide = slides[index];

  const contentWidth = Math.min(screenWidth, IMAGE_SLIDE_MAX_W);



  const finishSlides = useCallback(() => {
    setShowLangSelection(true);
  }, []);

  const finishAll = useCallback(() => {
    setPathMode(selectedPath);
    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    completeOnboarding();
  }, [completeOnboarding, selectedPath, setPathMode]);



  const goToIndex = useCallback(

    (next: number) => {

      const clamped = Math.max(0, Math.min(next, total - 1));

      if (clamped === index) return;

      if (Platform.OS !== "web") {

        void Haptics.selectionAsync();

      }

      setIndex(clamped);

    },

    [index, total],

  );



  const goNext = useCallback(() => {

    if (Platform.OS !== "web") {

      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    }

    if (isLast) {
      finishSlides();
      return;
    }
    goToIndex(index + 1);
  }, [finishSlides, goToIndex, index, isLast]);



  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-16, 16])
        .onEnd((e) => {
          const nextIndex = isKu ? index - 1 : index + 1;
          const prevIndex = isKu ? index + 1 : index - 1;
          if (e.translationX < -48 && e.velocityX <= 0) {
            runOnJS(goToIndex)(nextIndex);
          } else if (e.translationX > 48 && e.velocityX >= 0) {
            runOnJS(goToIndex)(prevIndex);
          }
        }),
    [goToIndex, index, isKu],
  );



  if (!localeReady || !activeSlide) {
    return <View style={styles.root} />;
  }

  if (showLangSelection) {
    return <LanguageSelectionFlow onFinish={finishAll} />;
  }



  return (

    <View style={styles.root}>

      <View

        style={[

          styles.container,

          {

            width: contentWidth,

            paddingTop: 0,

            paddingBottom: 0,

            paddingHorizontal: 0,

          },

        ]}

      >

        <GestureDetector gesture={swipeGesture}>

          <View style={styles.slideClip}>

            <Animated.View

              key={activeSlide.id}

              entering={FadeIn.duration(220)}

              exiting={FadeOut.duration(160)}

              style={styles.slideInner}

            >

              <OnboardingSlide

                slide={activeSlide}

                isLast={isLast}

                onPrimaryPress={goNext}

              />

            </Animated.View>

          </View>

        </GestureDetector>

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  root: {

    flex: 1,

    backgroundColor: "#FFFFFF",

    overflow: "hidden",

    alignItems: "center",

  },

  container: {

    flex: 1,

    overflow: "hidden",

  },

  slideClip: {

    flex: 1,

    overflow: "hidden",

    width: "100%",

  },

  slideInner: {

    flex: 1,

    width: "100%",

    overflow: "hidden",

  },

});


