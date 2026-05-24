/**
 * LottieAnimation — Universal Lottie wrapper for React Native + Web.
 * Supports local JSON, remote URIs, and bundled require() sources.
 * Auto-plays, loops, and exposes imperative controls for advanced cases.
 *
 * Duolingo-style animations are delivered as Lottie JSON. Pair this with
 * the LOTTIE_PRESETS catalog for ready-to-use mascot, celebration,
 * streak, and feedback animations — no design tools required.
 */

import LottieView, { AnimationObject } from "lottie-react-native";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Platform, StyleProp, View, ViewStyle } from "react-native";

export type LottieSource =
  | string
  | number
  | AnimationObject
  | { uri: string };

export type LottieAnimationHandle = {
  play: (from?: number, to?: number) => void;
  pause: () => void;
  reset: () => void;
};

export type LottieAnimationProps = {
  /** Local require(), remote URL string, or imported JSON object */
  source: LottieSource;
  /** Auto-play on mount (default true) */
  autoPlay?: boolean;
  /** Loop animation (default true) */
  loop?: boolean;
  /** Playback speed (default 1) */
  speed?: number;
  /** Container style — width/height go here */
  style?: StyleProp<ViewStyle>;
  /** Resize mode */
  resizeMode?: "cover" | "contain" | "center";
  /** Called when animation finishes (only when loop is false) */
  onAnimationFinish?: (isCancelled: boolean) => void;
};

/**
 * Normalizes a source into the shape lottie-react-native expects.
 * Accepts plain URL strings for ergonomic use with remote LottieFiles.
 */
function normalizeSource(source: LottieSource) {
  if (typeof source === "string") {
    return { uri: source };
  }
  return source;
}

export const LottieAnimation = forwardRef<LottieAnimationHandle, LottieAnimationProps>(
  function LottieAnimation(
    {
      source,
      autoPlay = true,
      loop = true,
      speed = 1,
      style,
      resizeMode = "contain",
      onAnimationFinish,
    },
    ref
  ) {
    const lottieRef = useRef<LottieView>(null);

    useImperativeHandle(
      ref,
      () => ({
        play: (from?: number, to?: number) => lottieRef.current?.play(from, to),
        pause: () => lottieRef.current?.pause(),
        reset: () => lottieRef.current?.reset(),
      }),
      []
    );

    // Web build of lottie-react-native is functional but stricter about sources.
    // Wrapping in a View ensures consistent layout regardless of platform.
    return (
      <View style={style} pointerEvents="none">
        <LottieView
          ref={lottieRef}
          source={normalizeSource(source) as AnimationObject}
          autoPlay={autoPlay}
          loop={loop}
          speed={speed}
          resizeMode={resizeMode}
          onAnimationFinish={onAnimationFinish}
          style={{ width: "100%", height: "100%" }}
          // iOS-only color filter friendly default — keeps premium look on dark UI
          {...(Platform.OS === "ios" ? { renderMode: "AUTOMATIC" as const } : {})}
        />
      </View>
    );
  }
);
