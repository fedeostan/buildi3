import React from "react";
import { View } from "react-native";
import { Typography } from "../Typography";
import ProfileIcon from "../ProfileIcon";
import NotificationIcon from "../NotificationIcon";
import { styles } from "./styles";
import type { DashboardHeaderProps } from "./types";

/**
 * DashboardHeader Organism Component
 *
 * Following Atomic Design principles - this is an ORGANISM (complex component)
 *
 * Combines multiple atoms into a cohesive header:
 * - ProfileIcon (atom) - User avatar with optional notification badge
 * - Typography (atom) - Date and greeting text
 * - NotificationIcon (atom) - Bell icon with notification count
 *
 * Features:
 * - Responsive layout (space-between)
 * - Uses spacing variables from design system
 * - Based on Figma design system layout
 * - Accessible and touch-friendly
 *
 * @param userName - User's name for greeting (default: "Federico")
 * @param date - Date to display (default: current formatted date)
 * @param hasNotifications - Whether user has notifications
 * @param notificationCount - Number of notifications
 * @param onProfilePress - Callback when profile is pressed
 * @param onNotificationPress - Callback when notification icon is pressed
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = "Federico",
  date,
  hasNotifications = false,
  notificationCount = 1,
  onProfilePress,
  onNotificationPress,
}) => {
  // Format current date if none provided
  const getCurrentDate = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("en-US", options);
  };

  const displayDate = date || getCurrentDate();

  return (
    <View style={styles.container}>
      {/* Left Side: Profile Icon */}
      <ProfileIcon
        size="Large"
        initials="FO" // Future: derive from userName
        hasNotification={false} // Profile doesn't show notifications in this design
      />

      {/* Center: Greeting Text */}
      <View style={styles.greetingContainer}>
        <Typography variant="bodySmall" style={styles.dateText}>
          {displayDate}
        </Typography>
        <Typography variant="h6" style={styles.greetingText}>
          Good morning, {userName}
        </Typography>
      </View>

      {/* Right Side: Notification Icon */}
      <NotificationIcon
        hasNotification={hasNotifications}
        notificationCount={notificationCount}
        onPress={onNotificationPress}
      />
    </View>
  );
};

export default DashboardHeader;
