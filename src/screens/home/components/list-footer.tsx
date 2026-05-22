import { SvgAppButton } from "@/components/shared/svg-app-button";
import { BUTTON_FACE_RIM_COLORS } from "@/constants/button-theme-colors";
import { Icon3DLock } from "@/components/icons/Icon3D";
import { Text, useWindowDimensions, View } from "react-native";
export const ListFooter = () => {
  const { width: windowWidth } = useWindowDimensions();
  const FOOTER_THEME = {
    surfaceClassName: "bg-gray-6",
    badgeClassName: "bg-gray-5",
    lockColor: BUTTON_FACE_RIM_COLORS.gray.rim,
    buttonFace: BUTTON_FACE_RIM_COLORS.gray.face,
    buttonRim: BUTTON_FACE_RIM_COLORS.gray.rim,
  };
  return (
    <View
      className={`${FOOTER_THEME.surfaceClassName} justify-center items-center pb-10 pt-4 gap-4`}
    >
      <View className={`${FOOTER_THEME.badgeClassName} p-1 rounded-sm`}>
        <Text className="text-base font-rd-regular text-text-secondary">
          UP NEXT
        </Text>
      </View>
      <View className="flex-row gap-1">
        <Icon3DLock size={22} />
        <Text className="text-base font-rd-bold text-text-secondary">
          Section 3
        </Text>
      </View>
      <Text className="text-lg w-[80%] text-center font-rd-regular text-text-secondary">
        Learn more foundational concepts and sentencess for basic confversations
      </Text>
      <SvgAppButton
        backgroundColor={FOOTER_THEME.buttonRim}
        color="#fff"
        leftRadius={10}
        rightRadius={10}
        strokeLeftWidth={1}
        strokeLeftPressedWidth={5}
        strokeRightWidth={1}
        strokeRightPressedWidth={5}
        pressDepth={4}
        width={windowWidth * 0.8}
        height={40}
        onPress={() => {}}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: FOOTER_THEME.buttonRim,
          borderRadius: 10,
        }}
      >
        <Text className="text-base font-rd-bold text-blue-base">Jump Here</Text>
      </SvgAppButton>
    </View>
  );
};
