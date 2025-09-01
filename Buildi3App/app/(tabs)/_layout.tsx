import { Tabs } from "expo-router";
import { BottomTabBar, TabBarItem } from "../../components/ui";

/**
 * Tabs Layout - Bottom navigation for main app screens
 *
 * This layout only applies to screens inside the (tabs) folder
 * Onboarding screens at the root level won't show these tabs
 * 
 * Uses our custom BottomTabBar component that matches Figma design exactly
 */

const tabItems: TabBarItem[] = [
  { name: "home", title: "Home", icon: "home" },
  { name: "tasks", title: "Tasks", icon: "check-square" },
  { name: "add-task", title: "Add", icon: "plus" },
  { name: "chat", title: "Chat", icon: "message-square" },
  { name: "assistant", title: "IA", icon: "activity" },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <BottomTabBar
          items={tabItems}
          activeTab={props.state.routeNames[props.state.index]}
          onTabPress={(tabName) => {
            const tabIndex = props.state.routeNames.indexOf(tabName);
            if (tabIndex !== -1) {
              props.navigation.navigate(props.state.routeNames[tabIndex]);
            }
          }}
        />
      )}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="add-task" options={{ title: "Add" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="assistant" options={{ title: "IA" }} />
    </Tabs>
  );
}
