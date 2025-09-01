import { StyleSheet } from "react-native";
import { colors, spacing, componentSpacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
    paddingTop: componentSpacing.tabBar.paddingTop,
    paddingBottom: componentSpacing.tabBar.paddingBottom,
    height: componentSpacing.tabBar.height,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: componentSpacing.tabBar.gap,
  },
  tabLabel: {
    fontFamily: "Inter",
    fontWeight: "500", // Medium weight from Figma
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  activeLabelColor: {
    color: colors.tabBarActiveText,
  },
  inactiveLabelColor: {
    color: colors.tabBarInactiveText,
  },
});