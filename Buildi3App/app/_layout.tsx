import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

/**
 * Root Layout - Stack navigator for the entire app
 *
 * Navigation Structure:
 * - index.tsx → redirects to /welcome
 * - welcome.tsx (Create Account / Log In) - NO bottom tabs
 * - signup.tsx (Sign Up) - NO bottom tabs
 * - verify-email.tsx (Email Verification) - NO bottom tabs
 * - complete-profile.tsx (Complete Profile) - NO bottom tabs
 * - role-selection.tsx (Role Selection) - NO bottom tabs
 * - (tabs)/ folder - WITH bottom tabs (main app)
 * - profile.tsx (User Profile) - Full screen modal
 * - notifications.tsx (Notifications Hub) - Full screen modal
 *
 * This allows the authentication and onboarding screens to be full-screen without navigation,
 * while main app screens have proper tab navigation.
 * Profile and notifications are accessible from anywhere via DashboardHeader.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false, // No header for clean full-screen experience
            animation: "slide_from_right", // Smooth transitions
          }}
        >
          {/* Root redirect */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          {/* Create Account / Log In Screen - No bottom tabs */}
          <Stack.Screen
            name="welcome"
            options={{
              title: "Create Account / Log In",
            }}
          />

          {/* Sign Up Flow Screens - No bottom tabs */}
          <Stack.Screen
            name="signup"
            options={{
              title: "Sign Up",
            }}
          />

          <Stack.Screen
            name="verify-email"
            options={{
              title: "Verify Email",
            }}
          />

          <Stack.Screen
            name="create-password"
            options={{
              title: "Create Password",
            }}
          />

          <Stack.Screen
            name="complete-profile"
            options={{
              title: "Complete Profile",
            }}
          />

          <Stack.Screen
            name="role-selection"
            options={{
              title: "Role Selection",
            }}
          />

          {/* Main App Screens - With bottom tabs */}
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "Main App",
            }}
          />

          {/* Profile and Notifications - Full screen modals accessible from DashboardHeader */}
          <Stack.Screen
            name="profile"
            options={{
              title: "Profile",
              presentation: "modal", // Present as modal overlay
            }}
          />

          <Stack.Screen
            name="notifications"
            options={{
              title: "Notifications",
              presentation: "modal", // Present as modal overlay
            }}
          />

          {/* Task Detail - Modal presentation for editing tasks */}
          <Stack.Screen
            name="task-detail"
            options={{
              title: "Task Details",
              presentation: "modal", // Present as modal overlay
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
