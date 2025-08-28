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
 * - ProfileIcon (atom) - User avatar with dynamic initials
 * - Typography (atom) - Date and time-based greeting text
 * - NotificationIcon (atom) - Bell icon with notification count
 *
 * Features:
 * - Responsive layout (space-between)
 * - Time-based greeting (Good morning/evening/night)
 * - Dynamic user initials extraction
 * - Uses spacing variables from design system
 * - Based on Figma design system layout
 * - Accessible and touch-friendly
 *
 * @param userName - User's name for greeting and initials extraction (default: "Federico Ostan")
 * @param date - Date to display (default: current formatted date)
 * @param hasNotifications - Whether user has notifications
 * @param notificationCount - Number of notifications
 * @param onProfilePress - Callback when profile is pressed
 * @param onNotificationPress - Callback when notification icon is pressed
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  style,
  userName = "Federico Ostan",
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

  // Get time-based greeting
  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon";
    } else if (hour >= 18 && hour < 22) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  // Extract initials from user name
  const extractInitials = (fullName: string): string => {
    const names = fullName.trim().split(" ");

    if (names.length === 0) return "U"; // Fallback for empty name
    if (names.length === 1) return names[0].charAt(0).toUpperCase();

    // First letter of first name + first letter of last name
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();

    return firstInitial + lastInitial;
  };

  // Extract first name for greeting
  const getFirstName = (fullName: string): string => {
    const names = fullName.trim().split(" ");
    return names[0] || "User";
  };

  const displayDate = date || getCurrentDate();
  const greeting = getTimeBasedGreeting();
  const firstName = getFirstName(userName);
  const initials = extractInitials(userName);

  return (
    <View style={[styles.container, style]}>
      {/* Left Side: Profile Icon with dynamic initials */}
      <ProfileIcon
        size="Large"
        initials={initials}
        hasNotification={false} // Profile doesn't show notifications in this design
        onPress={onProfilePress}
      />

      {/* Center: Greeting Text with time-based greeting */}
      <View style={styles.greetingContainer}>
        <Typography variant="bodySmall" style={styles.dateText}>
          {displayDate}
        </Typography>
        <Typography variant="h6" style={styles.greetingText}>
          {greeting}, {firstName}
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
