import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../../theme";
import { Typography, GeneralHeader, MenuSection } from "../../components/ui";

/**
 * Chat Screen - Messages and communication
 *
 * This screen provides messaging functionality
 * for team communication and notifications
 */
export default function ChatScreen() {
  const insets = useSafeAreaInsets();

  // Context-specific menu options for Chat screen
  const chatMenuSections: MenuSection[] = [
    {
      title: "Chat Actions",
      options: [
        { id: "new-chat", label: "New Chat", icon: "message-square" },
        { id: "search-chats", label: "Search Chats", icon: "search" },
        { id: "group-chat", label: "Create Group", icon: "users" },
      ],
    },
    {
      title: "Status & Availability",
      options: [
        { id: "set-status", label: "Set Status", icon: "activity" },
        { id: "do-not-disturb", label: "Do Not Disturb", icon: "bell-off" },
      ],
    },
    {
      options: [
        { id: "chat-settings", label: "Chat Settings", icon: "settings" },
        { id: "notifications", label: "Notifications", icon: "bell" },
      ],
    },
  ];

  // Handle menu option selection
  const handleMenuOptionSelect = (optionId: string) => {
    console.log("Chat menu option selected:", optionId);
    // TODO: Implement specific actions for each menu option
    switch (optionId) {
      case "new-chat":
        // Start new chat
        break;
      case "search-chats":
        // Show chat search
        break;
      case "group-chat":
        // Create group chat
        break;
      case "set-status":
        // Set user status
        break;
      case "do-not-disturb":
        // Toggle do not disturb
        break;
      case "chat-settings":
        // Navigate to chat settings
        break;
      case "notifications":
        // Navigate to notification settings
        break;
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingTop: Math.max(insets.top, 20),
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* General Header with Chat-specific menu */}
      <GeneralHeader
        title="Chat"
        menuSections={chatMenuSections}
        onMenuOptionSelect={handleMenuOptionSelect}
        menuTitle="Chat Options"
      />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.placeholderContainer}>
          <Typography variant="h4" style={styles.placeholderTitle}>
            Chat
          </Typography>
          <Typography variant="bodyMedium" style={styles.placeholderText}>
            Messaging and communication features will be implemented here.
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  placeholderTitle: {
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  placeholderText: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});