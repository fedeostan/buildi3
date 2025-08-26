import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../components/ui";
import { colors, spacing } from "../theme";

/**
 * Profile Screen - User profile placeholder
 *
 * Accessed from DashboardHeader profile icon
 * This is a placeholder screen that will contain user profile information
 */
export default function ProfileScreen() {
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
      <Typography variant="h1" style={styles.title}>
        Profile 👤
      </Typography>

      <Typography variant="bodyMedium" style={styles.subtitle}>
        User profile information will go here
      </Typography>

      <View style={styles.placeholder}>
        <Typography variant="bodyLarge" style={styles.placeholderText}>
          • Edit personal information{"\n"}• Manage account settings{"\n"}• View
          project history{"\n"}• Logout option
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

  title: {
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
    alignItems: "flex-start",
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
  },

  placeholderText: {
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
