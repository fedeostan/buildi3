import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../../components/ui";
import { colors, spacing } from "../../theme";

/**
 * Home Screen - Main app dashboard
 *
 * This is where users land after completing onboarding
 * Contains the main app functionality
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.sm, // 16px consistent horizontal padding
      paddingTop: Math.max(insets.top, 20) + spacing.lg, // Safe area + 32px base
      paddingBottom: Math.max(insets.bottom, 20) + spacing.sm, // Safe area + 16px base
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Typography variant="h1" style={styles.welcome}>
        Welcome to Buildi! 🚀
      </Typography>

      <Typography variant="bodyMedium" style={styles.subtitle}>
        Your construction management journey starts here
      </Typography>

      {/* TODO: Add main app content here */}
      <View style={styles.placeholder}>
        <Typography variant="bodyLarge" style={styles.placeholderText}>
          Main app content will go here...
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  welcome: {
    color: colors.text,
    marginBottom: spacing.md,
  },

  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
  },

  placeholderText: {
    color: colors.textSecondary,
    textAlign: "center",
  },
});
