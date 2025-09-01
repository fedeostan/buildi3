import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary, // Widget/Background from Figma - white
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // Widget/Border from Figma - #EDEEF2
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm, // 16px horizontal padding from Figma
    paddingTop: spacing.xxl, // 48px top padding from Figma (Spacing/xxl)
    paddingBottom: spacing.sm + 4, // 12px bottom padding from Figma
    minHeight: 80, // Minimum height for proper layout
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm, // Space between title and button
  },
  title: {
    fontFamily: "Montserrat",
    fontWeight: "600", // SemiBold from Figma
    fontSize: 28, // Header/1 size from Figma
    lineHeight: 28, // 100% line height from Figma
    letterSpacing: 0.1,
    color: colors.text, // Text/Header from Figma - #001848
  },
  menuButtonContainer: {
    // Menu button styling handled by MenuButton component
  },
});