import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary, // #F5F6FA from Figma (neutral-100)
    borderWidth: 1,
    borderColor: "#E6E6E6", // Border color from Figma
    borderRadius: 16, // Border Radius/large from Figma
    padding: spacing.xs + 4, // 12px padding from Figma (Spacing/ssm)
    alignItems: "center",
    justifyContent: "center",
    minWidth: 48, // Proper touch target
    minHeight: 48, // Proper touch target
  },
  containerPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  containerDisabled: {
    opacity: 0.5,
  },
  icon: {
    // Icon styling handled by Icon component
  },
});