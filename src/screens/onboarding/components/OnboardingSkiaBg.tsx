/**
 * OnboardingSkiaBg — Beautiful light-themed gradient background.
 * Soft blue gradient rising from the bottom, fading to pure white at the top.
 */

import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function OnboardingSkiaBg() {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#F3F7FF", "#E6EEFF"]}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.5, y: 1 }}
    />
  );
}

