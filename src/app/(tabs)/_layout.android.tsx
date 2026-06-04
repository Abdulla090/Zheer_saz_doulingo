import { CustomTabBar } from "@/components/CustomTabBar";
import { ENABLE_SHOP } from "@/constants/feature-flags";
import { TabBarVisibilityProvider } from "@/context/tab-bar-visibility";
import { Tabs } from "expo-router";

function AndroidTabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2B59F3",
        tabBarInactiveTintColor: "#8E95A3",
        animation: "fade",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="feed" />
      <Tabs.Screen
        name="subscription"
        options={{ href: ENABLE_SHOP ? undefined : null }}
      />
      <Tabs.Screen name="more" />
      <Tabs.Screen name="quest" options={{ href: null }} />
      <Tabs.Screen name="league" options={{ href: null }} />
      <Tabs.Screen
        name="lesson"
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="guidebook"
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="roleplay"
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="ai-teacher"
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="slang"
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen name="privacy-policy" options={{ href: null }} />
      <Tabs.Screen name="ai-safety" options={{ href: null }} />
      <Tabs.Screen name="terms" options={{ href: null }} />
      <Tabs.Screen
        name="admin/index"
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="admin/unit"
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="admin/lesson"
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <TabBarVisibilityProvider>
      <AndroidTabsLayout />
    </TabBarVisibilityProvider>
  );
}
