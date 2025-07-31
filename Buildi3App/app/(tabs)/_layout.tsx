import { Tabs } from "expo-router";
import { Typography } from "../../components/ui";
import { colors } from "../../theme";
import { View } from "react-native";

/**
 * Tabs Layout - Bottom navigation for main app screens
 *
 * This layout only applies to screens inside the (tabs) folder
 * Onboarding screens at the root level won't show these tabs
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.backgroundSecondary,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Typography
                variant="h5"
                style={{
                  color,
                  fontSize: focused ? 26 : 24,
                  marginBottom: 2,
                }}
              >
                🏠
              </Typography>
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Typography
              variant="labelSmall"
              style={{
                color,
                fontWeight: focused ? "600" : "400",
                fontSize: 12,
              }}
            >
              Home
            </Typography>
          ),
        }}
      />
      <Tabs.Screen
        name="devres"
        options={{
          title: "DevRes",
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Typography
                variant="h5"
                style={{
                  color,
                  fontSize: focused ? 26 : 24,
                  marginBottom: 2,
                }}
              >
                🛍️
              </Typography>
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Typography
              variant="labelSmall"
              style={{
                color,
                fontWeight: focused ? "600" : "400",
                fontSize: 12,
              }}
            >
              DevRes
            </Typography>
          ),
        }}
      />
    </Tabs>
  );
}
