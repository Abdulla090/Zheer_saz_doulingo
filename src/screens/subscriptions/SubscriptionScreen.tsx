import SafeContainer from "@/components/shared/safe-container";
import { tabBarScrollPadding } from "@/constants/layout";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Icon3DCheck } from "@/components/icons/Icon3D";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const plans = [
  {
    id: 1,
    name: "Super",
    price: 10,
    isRecommended: true,
    description: "فێربە بەبێ بێزارکردن",
    features: ["پشووی بێ سنوور", "بەبێ ڕیکلام"],
  },
  {
    id: 2,
    name: "Super Family",
    description: "شەریکایەتی سوپەر و پاشەکەوت بکە",
    price: 20,
    isRecommended: false,
    features: ["بۆ تۆ و ٥ کەسی تر", "تەنها ٣€ زیاترە لە مانگێکدا "],
  },
  {
    id: 3,
    name: "Max",
    price: 20,
    isRecommended: false,
    features: [
      "پەیوەندی ڤیدیۆیی لەگەڵ لیلی",
      "نواندنی ڕۆڵ",
      "فیدباکی ڕاستەوخۆ",
      "پشووی بێ سنوور",
      "بەبێ ڕیکلام",
    ],
    description: "بەرزترین ئاستی فێربوون",
  },
  {
    id: 4,
    name: "Max Family",
    price: 20,
    isRecommended: false,
    description: "بەرزترین ئاستی فێربوون",
    features: ["بۆ تۆ و ٥ کەسی تر", "تەنها ٥€ زیاترە لە مانگێکدا "],
  },
];
const PlanCard = ({ plan }: { plan: (typeof plans)[0] }) => {
  return (
    <View
      className={`relative mb-4 mt-4 w-[90%] self-center justify-center bg-white gap-4 rounded-lg  ${
        plan.isRecommended
          ? "border-gray-5 border-x-2 border-b-2 overflow-visible py-8 px-4"
          : "border-gray-5 border-2 overflow-hidden py-4 px-4"
      }`}
    >
      {plan.isRecommended && (
        <View className="absolute top-0 -left-[3px]  -right-[3px]">
          <LinearGradient
            colors={["#904DF9", "#497FFE", "#26C09A"]}
            locations={[0, 0.68, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: "100%",
              height: 35,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              justifyContent: "center",
            }}
          >
            <Text className="text-white px-4 text-lg font-rd-medium">
              پێشنیارکراو
            </Text>
          </LinearGradient>
        </View>
      )}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-text-primary text-2xl font-rd-bold">
            {plan.name}
          </Text>
          <Text className="text-text-secondary text-sm font-rd-medium">
            {plan.description}
          </Text>
          {plan.features.map((feature) => (
            <View key={feature} className="flex-row items-center gap-2">
              <Icon3DCheck size={22} />
              <Text
                key={feature}
                className="text-text-secondary text-sm font-rd-medium"
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
        <Image
          source={require("@/assets/images/characters/zari.png")}
          contentFit="contain"
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View
        style={{
          marginTop: 10,
          height: 44,
          borderRadius: 12,
          backgroundColor: "#E8EDF2",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.72,
        }}
      >
        <Text className="text-text-secondary text-sm font-rd-bold">
          بەشداریکردن بەم زووانە
        </Text>
      </View>
    </View>
  );
};
export const SubscriptionScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1  bg-white">
      <SafeContainer className="px-4 pt-2 pb-2 bg-[#0E3270]">
        <Text className="text-white text-2xl font-rd-bold">بەشداریکردن</Text>
        <Text className="text-text-quaternary text-sm font-rd-medium">
          بەراوردکردنی پلانەکان
        </Text>
        <Image
          source={require("@/assets/images/Cry_Super.png")}
          style={{ width: 150, height: 150, alignSelf: "center" }}
        />
      </SafeContainer>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: tabBarScrollPadding(insets.bottom),
        }}
      >
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </ScrollView>
    </View>
  );
};
