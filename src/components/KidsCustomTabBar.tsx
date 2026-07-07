import { Icon3DGradCap, Icon3DBook, Icon3DSettings } from "./icons/Icon3D";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

type TabBarButtonProps = {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
};

function TabBarButton({ routeName, isFocused, onPress }: TabBarButtonProps) {
  const scale = useSharedValue(isFocused ? 1.15 : 1.0);
  const indicatorOpacity = useSharedValue(isFocused ? 1.0 : 0.0);
  const indicatorScale = useSharedValue(isFocused ? 1.0 : 0.4);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1.0, { damping: 10, stiffness: 120 });
    indicatorOpacity.value = withSpring(isFocused ? 1.0 : 0.0, { damping: 12 });
    indicatorScale.value = withSpring(isFocused ? 1.0 : 0.4, { damping: 10, stiffness: 120 });
  }, [indicatorOpacity, indicatorScale, isFocused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
    transform: [{ scale: indicatorScale.value }],
  }));

  const renderIcon = () => {
    // Keep sizes exact to match Sphere size constraints
    const size = 38;
    switch (routeName) {
      case "index":
        return <Icon3DGradCap size={size} />;
      case "classic-path":
        return <Icon3DBook size={size} />;
      case "profile":
        return <Icon3DSettings size={size} />;
      default:
        return <Icon3DGradCap size={size} />;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabBtn}
    >
      <Animated.View style={[styles.iconWrap, animatedStyle]}>
        {renderIcon()}
      </Animated.View>
      <Animated.View style={[styles.indicator, indicatorStyle]} />
    </Pressable>
  );
}

export function KidsCustomTabBar({ state, descriptors, navigation }: any) {
  const currentRouteName = state.routes[state.index].name;

  // Hide custom tab bar on Rive Map screen, as it has its own embedded tab bar.
  if (currentRouteName === "index") {
    return null;
  }

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const handlePress = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabBarButton
            key={route.key}
            routeName={route.name}
            isFocused={isFocused}
            onPress={handlePress}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    height: 76,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 12,
    // iOS Soft Shadow
    shadowColor: "#1A202C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    // Android Shadow
    elevation: 8,
  },
  tabBtn: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50", // Kid-friendly green active indicator
    marginTop: 4,
  },
});
