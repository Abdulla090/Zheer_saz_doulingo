import { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SafeContainerProps = {
  children: ReactNode;
  className?: string;
  edges?: ("top" | "bottom")[];
  paddingTop?: number;
  paddingBottom?: number;
  style?: any;
  [key: string]: any;
};

const SafeContainer = ({
  children,
  className,
  edges = ["top"],
  paddingTop = 0,
  paddingBottom = 0,
  style,
  ...props
}: SafeContainerProps) => {
  const insets = useSafeAreaInsets();
  const top = edges?.includes("top") ? insets.top : 0;
  const bottom = edges?.includes("bottom") ? insets.bottom : 0;

  return (
    <View
      className={` ${className ?? ""}`}
      style={[
        {
          paddingTop: top + paddingTop,
          paddingBottom: bottom + paddingBottom,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default SafeContainer;
