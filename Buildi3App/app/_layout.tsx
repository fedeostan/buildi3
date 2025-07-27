import { Tabs } from "expo-router";
import { Typography } from "../components";
import { colors } from "../theme";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
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
            name="index"
            options={{
              title: "Home",
              href: "/",
              tabBarIcon: ({ focused, color }) => (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
              href: "/devres",
              tabBarIcon: ({ focused, color }) => (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
