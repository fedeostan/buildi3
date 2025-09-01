import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../../theme";
import { Typography, GeneralHeader, MenuSection } from "../../components/ui";

/**
 * Assistant Screen - AI-powered assistance and intelligence
 *
 * This screen provides AI assistant functionality
 * for project guidance and intelligent recommendations
 */
export default function AssistantScreen() {
  const insets = useSafeAreaInsets();

  // Context-specific menu options for AI Assistant screen
  const assistantMenuSections: MenuSection[] = [
    {
      title: "AI Features",
      options: [
        { id: "new-conversation", label: "New Conversation", icon: "message-square" },
        { id: "project-analysis", label: "Project Analysis", icon: "activity" },
        { id: "task-suggestions", label: "Task Suggestions", icon: "star" },
      ],
    },
    {
      title: "Assistant Tools",
      options: [
        { id: "document-help", label: "Document Help", icon: "help-circle" },
        { id: "code-review", label: "Code Review", icon: "eye" },
        { id: "meeting-notes", label: "Meeting Notes", icon: "edit" },
      ],
    },
    {
      options: [
        { id: "ai-settings", label: "AI Settings", icon: "settings" },
        { id: "training-data", label: "Training Data", icon: "upload" },
      ],
    },
  ];

  // Handle menu option selection
  const handleMenuOptionSelect = (optionId: string) => {
    console.log("Assistant menu option selected:", optionId);
    // TODO: Implement specific actions for each menu option
    switch (optionId) {
      case "new-conversation":
        // Start new AI conversation
        break;
      case "project-analysis":
        // Run project analysis
        break;
      case "task-suggestions":
        // Show AI task suggestions
        break;
      case "document-help":
        // Show document assistance
        break;
      case "code-review":
        // Start code review assistance
        break;
      case "meeting-notes":
        // Create AI-assisted meeting notes
        break;
      case "ai-settings":
        // Navigate to AI settings
        break;
      case "training-data":
        // Manage training data
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
      {/* General Header with AI Assistant-specific menu */}
      <GeneralHeader
        title="AI Assistant"
        menuSections={assistantMenuSections}
        onMenuOptionSelect={handleMenuOptionSelect}
        menuTitle="AI Options"
      />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.placeholderContainer}>
          <Typography variant="h4" style={styles.placeholderTitle}>
            AI Assistant
          </Typography>
          <Typography variant="bodyMedium" style={styles.placeholderText}>
            AI-powered assistance and intelligent recommendations will be available here.
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