import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import type { ProfileIconProps } from "./types";

/**
 * ProfileIcon Atom Component
 *
 * Following Atomic Design principles - this is an ATOM (smallest building block)
 *
 * Features:
 * - Displays user initials in a circular avatar
 * - Supports Large and Medium sizes (from Figma design system)
 * - Optional notification badge indicator
 * - Uses dummy data for now, will later pull from user.name
 *
 * @param size - Large (58px) or Medium (44px) from Figma specs
 * @param initials - User initials to display (default: "FO" for Federico)
 * @param hasNotification - Whether to show notification badge
 */
const ProfileIcon: React.FC<ProfileIconProps> = ({
  size = "Large",
  initials = "FO",
  hasNotification = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        size === "Large" ? styles.containerLarge : styles.containerMedium,
      ]}
    >
      {/* User Initials Text */}
      <Text
        style={[
          styles.initials,
          size === "Large" ? styles.initialsLarge : styles.initialsMedium,
        ]}
      >
        {initials}
      </Text>

      {/* Notification Badge (appears only when hasNotification is true) */}
      {hasNotification && (
        <View
          style={[
            styles.notificationBadge,
            size === "Large"
              ? styles.notificationBadgeLarge
              : styles.notificationBadgeMedium,
          ]}
        />
      )}
    </View>
  );
};

export default ProfileIcon;
