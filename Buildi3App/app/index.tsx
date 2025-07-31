import { Redirect } from "expo-router";

/**
 * Root Index - Redirects to the Create Account / Log In screen
 *
 * This follows Expo Router conventions where index.tsx is the entry point
 * but redirects to the actual first screen with a meaningful name.
 */
export default function Index() {
  return <Redirect href="/welcome" />;
}
