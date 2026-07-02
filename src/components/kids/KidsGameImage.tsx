import {
  kidsImageWellStyle,
  resolveKidsImageSource,
} from "../../utils/resolve-kids-image-source";
import { Image, type ImageStyle } from "expo-image";
import React, { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

type Props = {
  source: unknown;
  style?: StyleProp<ImageStyle>;
  wellStyle?: StyleProp<ViewStyle>;
  recyclingKey?: string;
};

export function KidsGameImage({
  source,
  style,
  wellStyle,
  recyclingKey,
}: Props) {
  const resolved = useMemo(() => resolveKidsImageSource(source), [source]);

  return (
    <View style={[styles.well, wellStyle]}>
      <Image
        source={resolved}
        style={[styles.image, style]}
        contentFit="contain"
        transition={200}
        recyclingKey={recyclingKey}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  well: {
    ...kidsImageWellStyle,
    width: "100%",
    height: "100%",
  },
  image: {
    width: "88%",
    height: "88%",
  },
});
