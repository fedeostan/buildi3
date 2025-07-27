import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "../Icon";
import { styles } from "./styles";
import type { NotificationIconProps } from "./types";

/**
 * NotificationIcon Atom Component
 *
 * Following Atomic Design principles - this is an ATOM (smallest building block)
 *
 * Features:
 * - Bell icon using Feather icons (bell icon name)
 * - Optional notification count badge
 * - Shows or hides based on hasNotification prop
 * - Touchable for interaction
 * - Based on Figma design system
 *
 * @param hasNotification - Whether user has notifications
 * @param notificationCount - Number of notifications (shows up to 99+)
 * @param onPress - Callback when notification icon is pressed
 */
const NotificationIcon: React.FC<NotificationIconProps> = ({
  hasNotification = false,
  notificationCount = 1,
  onPress,
}) => {
  // Format notification count (show 99+ for large numbers)
  const formatCount = (count: number): string => {
    if (count > 99) return "99+";
    return count.toString();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={
        hasNotification
          ? `${notificationCount} notifications`
          : "No notifications"
      }
      accessibilityRole="button"
    >
      {/* Bell Icon - using Feather icon */}
      <Icon
        name="bell"
        customSize={24} // 24px from Figma
        color="#495D92" // From Figma design system
      />

      {/* Notification Badge - only shows when hasNotification is true */}
      {hasNotification && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatCount(notificationCount)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationIcon;
