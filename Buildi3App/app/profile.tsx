import React from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Typography, UserAvatar, MenuListItem } from "../components/ui";
import { colors, spacing } from "../theme";
import { useAuth } from "../hooks/useAuth";

/**
 * Profile Screen - Enhanced user menu/launchpad
 *
 * Serves as the main user profile interface with 3 key functions:
 * 1. Personal Details (opens read-only profile screen)
 * 2. Settings (opens placeholder screen)
 * 3. Sign Out (triggers auth signOut)
 *
 * Uses UserAvatar and MenuListItem components following atomic design
 */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, user, loading, signOut } = useAuth();

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.sm, // 16px consistent horizontal padding
      paddingTop: Math.max(insets.top, 20) + spacing.lg, // Safe area + 32px base
      paddingBottom: Math.max(insets.bottom, 20) + spacing.sm, // Safe area + 16px base
    },
  });

  // Navigation handlers
  const handlePersonalDetails = () => {
    router.push('/personal-details');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled by auth state change
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, dynamicStyles.container]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="bodyMedium" style={styles.loadingText}>
          Loading profile...
        </Typography>
      </View>
    );
  }

  // Error state (user not found)
  if (!user) {
    return (
      <View style={[styles.container, styles.errorContainer, dynamicStyles.container]}>
        <Typography variant="h2" style={styles.errorTitle}>
          Profile Unavailable
        </Typography>
        <Typography variant="bodyMedium" style={styles.errorText}>
          Unable to load profile information.
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* User Avatar Section */}
      <View style={styles.avatarSection}>
        <UserAvatar
          firstName={profile?.first_name}
          lastName={profile?.last_name}
          fullName={user.email} // Fallback to email if no name
          size="large"
          showName={true}
        />
      </View>

      {/* Menu Items Section */}
      <View style={styles.menuSection}>
        <MenuListItem
          title="Personal Details"
          iconName="user"
          onPress={handlePersonalDetails}
        />

        <MenuListItem
          title="Settings"
          iconName="settings"
          onPress={handleSettings}
        />

        <MenuListItem
          title="Sign Out"
          iconName="log-out"
          variant="destructive"
          onPress={handleSignOut}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // #F2F3F7
  },

  // Loading state styles
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },

  // Error state styles
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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

  // Avatar section styles
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl, // 40px space between avatar and menu
  },

  // Menu section styles
  menuSection: {
    flex: 1,
  },
});
