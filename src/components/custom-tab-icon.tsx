import React from "react";
import Animated from "react-native-reanimated";
import { CSS_RELEASE_MS } from "@/components/animations/motion";

type SvgIconProps = {
  width?: number;
  height?: number;
  opacity?: number;
};

type CustomTabIconProps = {
  focused: boolean;
  Icon: React.ComponentType<SvgIconProps>;
};

export function CustomTabIcon({ focused, Icon }: CustomTabIconProps) {
  return (
    <Animated.View
      className={`p-2 rounded-lg items-center justify-center ${focused ? "bg-[#DDF4FF] border-[2] border-[#63C9F9]" : ""}`}
      style={{
        opacity: focused ? 1 : 0.88,
        transitionProperty: "opacity",
        transitionDuration: CSS_RELEASE_MS,
        transitionTimingFunction: "ease-out",
      }}
    >
      <Icon width={26} height={26} opacity={1} />
    </Animated.View>
  );
}
