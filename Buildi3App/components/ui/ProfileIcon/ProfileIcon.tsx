import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
 * - Touchable for navigation to profile screen
 *
 * @param size - Large (58px) or Medium (44px) from Figma specs
 * @param initials - User initials to display (default: "FO" for Federico)
 * @param hasNotification - Whether to show notification badge
 * @param onPress - Callback when profile icon is pressed
 */
const ProfileIcon: React.FC<ProfileIconProps> = ({
  size = "Large",
  initials = "FO",
  hasNotification = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
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
    </TouchableOpacity>
  );
};

export default ProfileIcon;
