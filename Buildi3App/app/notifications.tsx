import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../components/ui";
import { colors, spacing } from "../theme";

/**
 * Notifications Screen - Notification hub placeholder
 *
 * Accessed from DashboardHeader notification bell icon
 * This is a placeholder screen that will contain user notifications
 */
export default function NotificationsScreen() {
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
        Notifications 🔔
      </Typography>

      <Typography variant="bodyMedium" style={styles.subtitle}>
        Your notification center
      </Typography>

      <View style={styles.placeholder}>
        <Typography variant="bodyLarge" style={styles.placeholderText}>
          • Project updates{"\n"}• Team messages{"\n"}• System notifications
          {"\n"}• Reminders and alerts
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
