import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
  USER_AGE_MAX,
  USER_AGE_MIN,
  USER_SEXES,
  ageFromTrackPosition,
  trackPositionFromAge,
  type UserSex,
} from "../../../constants/user-profile";
import { hapticSelection } from "../../../utils/haptics";
import { AppText } from "../../../components/ui/AppText";
import { IOSPressable } from "../../../components/ui/ios-pressable";
import type { OnboardingTheme } from "./onboarding-theme";

const THUMB_SIZE = 34;

export function OnboardingAgeSlider({
  value,
  onChange,
  label,
  locale,
  theme,
}: {
  value: number;
  onChange: (age: number) => void;
  label: string;
  locale: string;
  theme: OnboardingTheme;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const thumbX = useSharedValue(0);
  const active = useSharedValue(0);
  const lastAge = useSharedValue(value);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const commitAge = useCallback(
    (nextAge: number) => onChange(nextAge),
    [onChange],
  );

  useEffect(() => {
    lastAge.value = value;
    thumbX.value = trackPositionFromAge(value, trackWidth);
  }, [lastAge, thumbX, trackWidth, value]);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(trackWidth > 0)
        .minDistance(0)
        .onBegin((event) => {
          active.value = 1;
          const nextX = Math.min(trackWidth, Math.max(0, event.x));
          const nextAge = ageFromTrackPosition(nextX, trackWidth);
          thumbX.value = nextX;
          if (nextAge !== lastAge.value) {
            lastAge.value = nextAge;
            scheduleOnRN(commitAge, nextAge);
          }
        })
        .onUpdate((event) => {
          const nextX = Math.min(trackWidth, Math.max(0, event.x));
          const nextAge = ageFromTrackPosition(nextX, trackWidth);
          thumbX.value = nextX;
          if (nextAge !== lastAge.value) {
            lastAge.value = nextAge;
            scheduleOnRN(commitAge, nextAge);
          }
        })
        .onFinalize(() => {
          active.value = 0;
          scheduleOnRN(hapticSelection);
        }),
    [active, commitAge, lastAge, thumbX, trackWidth],
  );

  const fillStyle = useAnimatedStyle(() => ({ width: thumbX.value }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: thumbX.value - THUMB_SIZE / 2 },
      { scale: interpolate(active.value, [0, 1], [1, 1.08]) },
    ],
  }));

  const adjustAge = useCallback(
    (delta: number) => {
      onChange(Math.min(USER_AGE_MAX, Math.max(USER_AGE_MIN, value + delta)));
      hapticSelection();
    },
    [onChange, value],
  );

  return (
    <View style={styles.controlGroup}>
      <AppText
        style={styles.controlLabel}
        languageCode={locale}
        latinRole="bold"
        align="center"
        fullWidth
      >
        {label}
      </AppText>

      <View style={styles.ageValuePill}>
        <AppText
          testID="onboarding-age-value"
          style={styles.ageValue}
          languageCode={locale}
          latinRole="bold"
          align="center"
        >
          {String(value)}
        </AppText>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          testID="onboarding-age-slider"
          style={styles.sliderTouchArea}
          onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={label}
          accessibilityValue={{
            min: USER_AGE_MIN,
            max: USER_AGE_MAX,
            now: value,
            text: String(value),
          }}
          accessibilityActions={[
            { name: "increment", label: "+1" },
            { name: "decrement", label: "-1" },
          ]}
          onAccessibilityAction={(event) =>
            adjustAge(event.nativeEvent.actionName === "increment" ? 1 : -1)
          }
          {...(Platform.OS === "web" ? ({ dir: "ltr" } as never) : {})}
        >
          <View style={styles.track} />
          <Animated.View style={[styles.trackFill, fillStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <View style={styles.thumbCore} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.ageBounds}>
        <AppText style={styles.ageBound} languageCode="en">
          {String(USER_AGE_MIN)}
        </AppText>
        <AppText style={styles.ageBound} languageCode="en">
          {String(USER_AGE_MAX)}
        </AppText>
      </View>
    </View>
  );
}

export function OnboardingSexSelector({
  value,
  onChange,
  label,
  femaleLabel,
  maleLabel,
  locale,
  theme,
}: {
  value: UserSex | null;
  onChange: (sex: UserSex) => void;
  label: string;
  femaleLabel: string;
  maleLabel: string;
  locale: string;
  theme: OnboardingTheme;
}) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const labels: Record<UserSex, string> = {
    female: femaleLabel,
    male: maleLabel,
  };

  return (
    <View style={styles.controlGroup}>
      <AppText
        style={styles.controlLabel}
        languageCode={locale}
        latinRole="bold"
        align="center"
        fullWidth
      >
        {label}
      </AppText>

      <View
        accessibilityRole="radiogroup"
        style={styles.segmentedControl}
      >
        {USER_SEXES.map((sex) => {
          const selected = value === sex;
          return (
            <IOSPressable
              key={sex}
              testID={`onboarding-sex-${sex}`}
              accessibilityRole="radio"
              accessibilityLabel={labels[sex]}
              accessibilityState={{ selected }}
              onPress={() => {
                hapticSelection();
                onChange(sex);
              }}
              pressScale={0.98}
              style={[
                styles.segment,
                selected && styles.segmentSelected,
              ]}
            >
              <AppText
                style={[
                  styles.segmentLabel,
                  selected && styles.segmentLabelSelected,
                ]}
                languageCode={locale}
                latinRole="bold"
                align="center"
                numberOfLines={1}
              >
                {labels[sex]}
              </AppText>
            </IOSPressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: OnboardingTheme) {
  return StyleSheet.create({
    controlGroup: {
      width: "100%",
      alignItems: "center",
      gap: 10,
    },
    controlLabel: {
      color: theme.mutedInk,
      fontSize: 14,
      lineHeight: 19,
    },
    ageValuePill: {
      minWidth: 74,
      height: 50,
      paddingHorizontal: 18,
      borderRadius: 18,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.borderStrong,
      boxShadow: theme.isDark
        ? "0 8px 18px rgba(0,0,0,0.26)"
        : "0 8px 18px rgba(21,27,36,0.10)",
    },
    ageValue: {
      color: theme.ink,
      fontSize: 25,
      lineHeight: 31,
      fontVariant: ["tabular-nums"],
    },
    sliderTouchArea: {
      width: "88%",
      maxWidth: 420,
      height: 48,
      justifyContent: "center",
      direction: "ltr",
    },
    track: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 8,
      borderRadius: 99,
      backgroundColor: theme.ringTrack,
    },
    trackFill: {
      position: "absolute",
      left: 0,
      height: 8,
      borderRadius: 99,
      backgroundColor: theme.accent,
    },
    thumb: {
      position: "absolute",
      left: 0,
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.borderStrong,
      boxShadow: theme.isDark
        ? "0 5px 12px rgba(0,0,0,0.42)"
        : "0 5px 12px rgba(21,27,36,0.20)",
    },
    thumbCore: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.accent,
    },
    ageBounds: {
      width: "88%",
      maxWidth: 420,
      flexDirection: "row",
      direction: "ltr",
      justifyContent: "space-between",
      marginTop: -8,
    },
    ageBound: {
      color: theme.faintInk,
      fontSize: 12,
      lineHeight: 16,
      fontVariant: ["tabular-nums"],
    },
    segmentedControl: {
      width: "100%",
      minHeight: 54,
      padding: 4,
      borderRadius: 16,
      borderCurve: "continuous",
      flexDirection: "row",
      gap: 4,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    segment: {
      flex: 1,
      minHeight: 46,
      borderRadius: 12,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
    },
    segmentSelected: {
      backgroundColor: theme.accent,
      boxShadow: theme.isDark
        ? "0 3px 8px rgba(0,0,0,0.30)"
        : "0 3px 8px rgba(185,56,32,0.18)",
    },
    segmentLabel: {
      color: theme.mutedInk,
      fontSize: 16,
      lineHeight: 21,
    },
    segmentLabelSelected: {
      color: theme.onAccent,
    },
  });
}
