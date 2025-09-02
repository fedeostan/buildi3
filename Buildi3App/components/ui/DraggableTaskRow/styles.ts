import { StyleSheet } from "react-native";
import { colors } from "../../../theme";

export const styles = StyleSheet.create({
  draggableContainer: {
    // Base container for draggable task row
  },
  dragInactive: {
    // Default state when not being dragged
    opacity: 1,
  },
  dragging: {
    // Visual feedback while dragging
    opacity: 0.8,
    elevation: 8, // Android shadow
    shadowColor: colors.text, // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: colors.background,
    borderRadius: 8,
    transform: [{ scale: 1.05 }], // Slightly larger while dragging
  },
  dragReleased: {
    // Visual feedback when drag is released
    opacity: 0.9,
  },
});