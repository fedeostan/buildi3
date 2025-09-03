import React from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Typography, TopNavigationBar, UserAvatar } from "../components/ui";
import { colors, spacing } from "../theme";
import { useAuth } from "../hooks/useAuth";

/**
 * Personal Details Screen - Read-only profile display
 *
 * Shows user profile information in a read-only format
 * Accessed from Profile screen "Personal Details" menu item
 * Uses TopNavigationBar pattern for consistent navigation
 */
export default function PersonalDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, user, loading } = useAuth();

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingTop: Math.max(insets.top, 20),
      paddingBottom: Math.max(insets.bottom, 20) + spacing.sm,
    },
  });

  // Navigation handler
  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, dynamicStyles.container]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="bodyMedium" style={styles.loadingText}>
          Loading profile details...
        </Typography>
      </View>
    );
  }

  // Error state
  if (!user) {
    return (
      <View style={[styles.container, styles.errorContainer, dynamicStyles.container]}>
        <View style={styles.navigationContainer}>
          <TopNavigationBar
            leftAction={{
              icon: "chevron-left",
              label: "Back",
              onPress: handleBack,
            }}
          />
        </View>
        <View style={styles.errorContent}>
          <Typography variant="h2" style={styles.errorTitle}>
            Profile Unavailable
          </Typography>
          <Typography variant="bodyMedium" style={styles.errorText}>
            Unable to load profile information.
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TopNavigationBar
          leftAction={{
            icon: "chevron-left",
            label: "Back",
            onPress: handleBack,
          }}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section with Avatar */}
        <View style={styles.headerSection}>
          <UserAvatar
            firstName={profile?.first_name}
            lastName={profile?.last_name}
            fullName={user.email} // Fallback to email
            size="large"
            showName={true}
          />
        </View>

        {/* Profile Details Card */}
        <View style={styles.detailsCard}>
          <Typography variant="h3" style={styles.cardTitle}>
            Personal Information
          </Typography>

          {/* First Name */}
          <View style={styles.fieldGroup}>
            <Typography variant="labelMedium" style={styles.fieldLabel}>
              First Name
            </Typography>
            <Typography variant="bodyLarge" style={styles.fieldValue}>
              {profile?.first_name || "Not provided"}
            </Typography>
          </View>

          {/* Last Name */}
          <View style={styles.fieldGroup}>
            <Typography variant="labelMedium" style={styles.fieldLabel}>
              Last Name
            </Typography>
            <Typography variant="bodyLarge" style={styles.fieldValue}>
              {profile?.last_name || "Not provided"}
            </Typography>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Typography variant="labelMedium" style={styles.fieldLabel}>
              Email
            </Typography>
            <Typography variant="bodyLarge" style={styles.fieldValue}>
              {user.email}
            </Typography>
          </View>

          {/* Phone */}
          <View style={styles.fieldGroup}>
            <Typography variant="labelMedium" style={styles.fieldLabel}>
              Phone
            </Typography>
            <Typography variant="bodyLarge" style={styles.fieldValue}>
              {profile?.phone || "Not provided"}
            </Typography>
          </View>

          {/* Role */}
          <View style={styles.fieldGroup}>
            <Typography variant="labelMedium" style={styles.fieldLabel}>
              Role
            </Typography>
            <Typography variant="bodyLarge" style={styles.fieldValue}>
              {profile?.role ? profile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Not assigned"}
            </Typography>
          </View>

          {/* Trade Specialty */}
          {profile?.trade_specialty && (
            <View style={styles.fieldGroup}>
              <Typography variant="labelMedium" style={styles.fieldLabel}>
                Trade Specialty
              </Typography>
              <Typography variant="bodyLarge" style={styles.fieldValue}>
                {profile.trade_specialty}
              </Typography>
            </View>
          )}

          {/* Display Name */}
          {profile?.display_name && (
            <View style={styles.fieldGroup}>
              <Typography variant="labelMedium" style={styles.fieldLabel}>
                Display Name
              </Typography>
              <Typography variant="bodyLarge" style={styles.fieldValue}>
                {profile.display_name}
              </Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // #F2F3F7
  },

  // Navigation
  navigationContainer: {
    paddingHorizontal: spacing.sm, // 16px horizontal padding
    marginBottom: spacing.md, // 24px space below navigation
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.sm, // 16px horizontal padding
    paddingBottom: spacing.xl, // Extra bottom padding for scroll
  },

  // Loading state
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },

  // Error state
  errorContainer: {
    flex: 1,
  },

  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },

  errorTitle: {
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  errorText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Header section
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl, // 40px space between avatar and details
  },

  // Details card
  detailsCard: {
    backgroundColor: colors.backgroundSecondary, // White background
    borderRadius: 16,
    padding: spacing.lg, // 32px internal padding
  },

  cardTitle: {
    color: colors.text,
    marginBottom: spacing.lg, // 32px space below title
  },

  // Field styles
  fieldGroup: {
    marginBottom: spacing.md, // 24px space between fields
  },

  fieldLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2, // 4px space between label and value
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  fieldValue: {
    color: colors.text,
    minHeight: 24, // Ensure consistent spacing even with empty values
  },
});