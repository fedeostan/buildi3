import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    position: "relative",
  },
  titleInput: {
    marginBottom: 0,
    paddingRight: spacing.lg + spacing.md, // ensure content doesn't overlap overlay tag
  },
  rightOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: spacing.sm,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  stagePressable: {
    paddingLeft: spacing.xs,
  },
});
