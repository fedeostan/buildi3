import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Typography } from "../Typography";
import Icon from "../Icon";
import { ProjectIconType, ProjectIconColor, ProjectItemProps } from "./types";
import { styles } from "./styles";
import { colors } from "../../../theme";
import CircularProgress from "react-native-circular-progress-indicator";

/**
 * Project icon mapping - static references to all available icon combinations
 */
const PROJECT_ICONS: Record<string, any> = {
  // Building icons
  "Building-Blue Darker": require("../../../assets/icons/project_icons/Project=Building, Color=Blue Darker.svg"),
  "Building-Blue Light": require("../../../assets/icons/project_icons/Project=Building, Color=Blue Light.svg"),
  "Building-Green Light": require("../../../assets/icons/project_icons/Project=Building, Color=Green Light.svg"),
  "Building-Green Pastel": require("../../../assets/icons/project_icons/Project=Building, Color=Green Pastel.svg"),
  "Building-Green Pond": require("../../../assets/icons/project_icons/Project=Building, Color=Green Pond.svg"),
  "Building-Lime": require("../../../assets/icons/project_icons/Project=Building, Color=Lime.svg"),
  "Building-Pink Light": require("../../../assets/icons/project_icons/Project=Building, Color=Pink Light.svg"),
  "Building-Pink": require("../../../assets/icons/project_icons/Project=Building, Color=Pink.svg"),
  "Building-Purple": require("../../../assets/icons/project_icons/Project=Building, Color=Purple.svg"),

  // General icons
  "General-Blue Darker": require("../../../assets/icons/project_icons/Project=General, Color=Blue Darker.svg"),
  "General-Blue Light": require("../../../assets/icons/project_icons/Project=General, Color=Blue Light.svg"),
  "General-Green Light": require("../../../assets/icons/project_icons/Project=General, Color=Green Light.svg"),
  "General-Green Pond": require("../../../assets/icons/project_icons/Project=General, Color=Green Pond.svg"),
  "General-Lime": require("../../../assets/icons/project_icons/Project=General, Color=Lime.svg"),
  "General-Pink Light": require("../../../assets/icons/project_icons/Project=General, Color=Pink Light.svg"),
  "General-Pink": require("../../../assets/icons/project_icons/Project=General, Color=Pink.svg"),
  "General-Purple": require("../../../assets/icons/project_icons/Project=General, Color=Purple.svg"),

  // House icons
  "House-Blue Light": require("../../../assets/icons/project_icons/Project=House, Color=Blue Light.svg"),
  "House-Green Light": require("../../../assets/icons/project_icons/Project=House, Color=Green Light.svg"),
  "House-Green Pastel": require("../../../assets/icons/project_icons/Project=House, Color=Green Pastel.svg"),
  "House-Green Pond": require("../../../assets/icons/project_icons/Project=House, Color=Green Pond.svg"),
  "House-Lime": require("../../../assets/icons/project_icons/Project=House, Color=Lime.svg"),
  "House-Pink Light": require("../../../assets/icons/project_icons/Project=House, Color=Pink Light.svg"),
  "House-Pink": require("../../../assets/icons/project_icons/Project=House, Color=Pink.svg"),
  "House-Purple": require("../../../assets/icons/project_icons/Project=House, Color=Purple.svg"),

  // Outdoors icons
  "Outdoors-Blue Darker": require("../../../assets/icons/project_icons/Project=Outdoors, Color=Blue Darker.svg"),
  "Outdoors-Blue Light": require("../../../assets/icons/project_icons/Project=Outdoors, Color=Blue Light.svg"),
  "Outdoors-Green Light": require("../../../assets/icons/project_icons/Project=Outdoors, Color=Green Light.svg"),
  "Outdoors-Green Pond": require("../../../assets/icons/project_icons/Project=Outdoors, Color=Green Pond.svg"),
  "Outdoors-Lime": require("../../../assets/icons/project_icons/Project=Outdoors, Color=Lime.svg"),
  "Outdoors-Pink Light": require("../../../assets/icons/project_icons/Project=Outdoors, Color=Pink Light.svg"),
  "Outdoors-Pink": require("../../../assets/icons/project_icons/Project=Outdoors, Color=Pink.svg"),
  "Outdoors-Purple": require("../../../assets/icons/project_icons/Project=Outdoors, Color=Purple.svg"),

  // Other project types
  "Project5-Green Pastel": require("../../../assets/icons/project_icons/Project=Project5, Color=Green Pastel.svg"),
  "Project6-Green Pastel": require("../../../assets/icons/project_icons/Project=Project6, Color=Green Pastel.svg"),
  "Project8-Blue Darker": require("../../../assets/icons/project_icons/Project=Project8, Color=Blue Darker.svg"),
};

/**
 * Gets the project icon source based on type and color
 * @param iconType - The project icon type (e.g., "Building", "House")
 * @param iconColor - The project icon color variant (e.g., "Blue Light", "Green Pond")
 * @returns The required image source
 */
const getProjectIconSource = (
  iconType?: ProjectIconType,
  iconColor?: ProjectIconColor
) => {
  if (!iconType || !iconColor) return null;

  // Create the mapping key from type and color
  const iconKey = `${iconType}-${iconColor}`;

  // Check if the icon exists in our mapping
  if (PROJECT_ICONS[iconKey]) {
    return PROJECT_ICONS[iconKey];
  } else {
    console.warn(`Project icon not found: ${iconType}, ${iconColor}`);
    return null;
  }
};

/**
 * ProjectItem Molecule Component
 *
 * A component to display a project item with an icon and name.
 * Based on Figma design system layout.
 *
 * Following Atomic Design principles - this is a MOLECULE
 * (combines multiple atoms into a meaningful component)
 *
 * Features:
 * - Project icon (SVG from assets or fallback to Feather icon)
 * - Project name text
 * - Optional progress indicator (percentage)
 * - Uses design system tokens for colors and spacing
 *
 * Variants:
 * - With percentage indicator (circular progress + text)
 * - Without percentage indicator
 * - With SVG project icon (from assets/icons/project_icons/)
 * - With Feather icon (fallback)
 *
 * @param projectName - The name of the project
 * @param iconName - The Feather icon name to display (fallback)
 * @param iconColor - The color of the icon's background (from theme system)
 * @param iconTextColor - The color of the icon itself (from theme system)
 * @param projectIconType - The type of project icon ("Building", "House", etc.)
 * @param projectIconColor - The color variant of project icon ("Blue Light", "Green Pond", etc.)
 * @param hasPercentage - Whether to show a percentage indicator
 * @param percentage - The percentage value to display (0-100)
 * @param style - Optional style overrides
 */
const ProjectItem: React.FC<ProjectItemProps> = ({
  projectName,
  iconName = "home",
  iconColor = "primaryLight",
  iconTextColor = "background",
  projectIconType,
  projectIconColor,
  hasPercentage = false,
  percentage = 0,
  style,
  onPress,
}) => {
  // Get the SVG icon source if project icon type and color are provided
  const svgIconSource = getProjectIconSource(projectIconType, projectIconColor);

  const itemContent = (
    <>
      <View style={styles.leftContainer as any}>
        <View
          style={[
            styles.iconContainer as any,
            {
              backgroundColor: svgIconSource
                ? "transparent"
                : (styles.iconColors as any)[iconColor],
            },
          ]}
        >
          {svgIconSource ? (
            // Use SVG icon when available
            <Image
              source={svgIconSource}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ) : (
            // Fallback to Feather icon
            <Icon name={iconName} color={iconTextColor} size="md" />
          )}
        </View>
        <Typography variant="bodyMedium" style={styles.projectName as any}>
          {projectName}
        </Typography>
      </View>

      {hasPercentage && (
        <View style={styles.progressContainer as any}>
          <CircularProgress
            value={percentage}
            radius={22} // This makes it exactly 44x44px total size
            duration={1000}
            progressValueColor={"#4B4B4D"} // Dark gray text from Figma
            maxValue={100}
            title={"%"}
            titleColor={"#4B4B4D"}
            titleStyle={{
              fontSize: 9,
              fontWeight: "500",
              fontFamily: "Inter_500Medium",
            }}
            activeStrokeColor={"#0E2A73"} // Darker navy blue for progress to match the second image
            activeStrokeWidth={3}
            inActiveStrokeColor={"#E8EBF2"} // Light gray/blue for track
            inActiveStrokeWidth={3}
            activeStrokeSecondaryColor={"#0E2A73"}
            inActiveStrokeOpacity={1}
            progressValueStyle={{
              fontSize: 11,
              fontWeight: "500",
              fontFamily: "Inter_500Medium",
            }}
            strokeLinecap={"round"} // Rounded ends on the progress arc
            valueSuffix={""}
            showProgressValue={true}
          />
        </View>
      )}
    </>
  );

  // If there's an onPress handler, make the item pressable
  return onPress ? (
    <TouchableOpacity
      style={[styles.container as any, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {itemContent}
    </TouchableOpacity>
  ) : (
    <View style={[styles.container as any, style]}>{itemContent}</View>
  );
};

export default ProjectItem;
