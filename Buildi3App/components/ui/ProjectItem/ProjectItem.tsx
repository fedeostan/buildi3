import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Typography } from "../Typography";
import Icon from "../Icon";
import { ProjectIconType, ProjectIconColor, ProjectItemProps } from "./types";
import { styles } from "./styles";
import { colors } from "../../../theme";
import CircularProgress from "react-native-circular-progress-indicator";
import { SvgProps } from "react-native-svg";

// Import all required SVG icons statically
// Building icons
import BuildingBlueDarkerIcon from "../../../assets/icons/project_icons/Project=Building, Color=Blue Darker.svg";
import BuildingBlueLightIcon from "../../../assets/icons/project_icons/Project=Building, Color=Blue Light.svg";
import BuildingGreenLightIcon from "../../../assets/icons/project_icons/Project=Building, Color=Green Light.svg";
import BuildingGreenPastelIcon from "../../../assets/icons/project_icons/Project=Building, Color=Green Pastel.svg";
import BuildingGreenPondIcon from "../../../assets/icons/project_icons/Project=Building, Color=Green Pond.svg";
import BuildingLimeIcon from "../../../assets/icons/project_icons/Project=Building, Color=Lime.svg";
import BuildingPinkLightIcon from "../../../assets/icons/project_icons/Project=Building, Color=Pink Light.svg";
import BuildingPinkIcon from "../../../assets/icons/project_icons/Project=Building, Color=Pink.svg";
import BuildingPurpleIcon from "../../../assets/icons/project_icons/Project=Building, Color=Purple.svg";

// General icons
import GeneralBlueDarkerIcon from "../../../assets/icons/project_icons/Project=General, Color=Blue Darker.svg";
import GeneralBlueLightIcon from "../../../assets/icons/project_icons/Project=General, Color=Blue Light.svg";
import GeneralGreenLightIcon from "../../../assets/icons/project_icons/Project=General, Color=Green Light.svg";
import GeneralGreenPondIcon from "../../../assets/icons/project_icons/Project=General, Color=Green Pond.svg";
import GeneralLimeIcon from "../../../assets/icons/project_icons/Project=General, Color=Lime.svg";
import GeneralPinkLightIcon from "../../../assets/icons/project_icons/Project=General, Color=Pink Light.svg";
import GeneralPinkIcon from "../../../assets/icons/project_icons/Project=General, Color=Pink.svg";
import GeneralPurpleIcon from "../../../assets/icons/project_icons/Project=General, Color=Purple.svg";

// House icons
import HouseBlueLightIcon from "../../../assets/icons/project_icons/Project=House, Color=Blue Light.svg";
import HouseGreenLightIcon from "../../../assets/icons/project_icons/Project=House, Color=Green Light.svg";
import HouseGreenPastelIcon from "../../../assets/icons/project_icons/Project=House, Color=Green Pastel.svg";
import HouseGreenPondIcon from "../../../assets/icons/project_icons/Project=House, Color=Green Pond.svg";
import HouseLimeIcon from "../../../assets/icons/project_icons/Project=House, Color=Lime.svg";
import HousePinkLightIcon from "../../../assets/icons/project_icons/Project=House, Color=Pink Light.svg";
import HousePinkIcon from "../../../assets/icons/project_icons/Project=House, Color=Pink.svg";
import HousePurpleIcon from "../../../assets/icons/project_icons/Project=House, Color=Purple.svg";

// Outdoors icons
import OutdoorsBlueDarkerIcon from "../../../assets/icons/project_icons/Project=Outdoors, Color=Blue Darker.svg";
import OutdoorsBlueLightIcon from "../../../assets/icons/project_icons/Project=Outdoors, Color=Blue Light.svg";
import OutdoorsGreenLightIcon from "../../../assets/icons/project_icons/Project=Outdoors, Color=Green Light.svg";
import OutdoorsGreenPondIcon from "../../../assets/icons/project_icons/Project=Outdoors, Color=Green Pond.svg";
import OutdoorsLimeIcon from "../../../assets/icons/project_icons/Project=Outdoors, Color=Lime.svg";
import OutdoorsPinkLightIcon from "../../../assets/icons/project_icons/Project=Outdoors, Color=Pink Light.svg";
import OutdoorsPinkIcon from "../../../assets/icons/project_icons/Project=Outdoors, Color=Pink.svg";
import OutdoorsPurpleIcon from "../../../assets/icons/project_icons/Project=Outdoors, Color=Purple.svg";

// Other project types
import Project5GreenPastelIcon from "../../../assets/icons/project_icons/Project=Project5, Color=Green Pastel.svg";
import Project6GreenPastelIcon from "../../../assets/icons/project_icons/Project=Project6, Color=Green Pastel.svg";
import Project8BlueDarkerIcon from "../../../assets/icons/project_icons/Project=Project8, Color=Blue Darker.svg";

/**
 * Static mapping of project icons
 * This approach ensures all icons are bundled correctly
 */
const PROJECT_ICON_MAP: Record<string, React.FC<SvgProps>> = {
  // Building icons
  "Building-Blue Darker": BuildingBlueDarkerIcon,
  "Building-Blue Light": BuildingBlueLightIcon,
  "Building-Green Light": BuildingGreenLightIcon,
  "Building-Green Pastel": BuildingGreenPastelIcon,
  "Building-Green Pond": BuildingGreenPondIcon,
  "Building-Lime": BuildingLimeIcon,
  "Building-Pink Light": BuildingPinkLightIcon,
  "Building-Pink": BuildingPinkIcon,
  "Building-Purple": BuildingPurpleIcon,

  // General icons
  "General-Blue Darker": GeneralBlueDarkerIcon,
  "General-Blue Light": GeneralBlueLightIcon,
  "General-Green Light": GeneralGreenLightIcon,
  "General-Green Pond": GeneralGreenPondIcon,
  "General-Lime": GeneralLimeIcon,
  "General-Pink Light": GeneralPinkLightIcon,
  "General-Pink": GeneralPinkIcon,
  "General-Purple": GeneralPurpleIcon,

  // House icons
  "House-Blue Light": HouseBlueLightIcon,
  "House-Green Light": HouseGreenLightIcon,
  "House-Green Pastel": HouseGreenPastelIcon,
  "House-Green Pond": HouseGreenPondIcon,
  "House-Lime": HouseLimeIcon,
  "House-Pink Light": HousePinkLightIcon,
  "House-Pink": HousePinkIcon,
  "House-Purple": HousePurpleIcon,

  // Outdoors icons
  "Outdoors-Blue Darker": OutdoorsBlueDarkerIcon,
  "Outdoors-Blue Light": OutdoorsBlueLightIcon,
  "Outdoors-Green Light": OutdoorsGreenLightIcon,
  "Outdoors-Green Pond": OutdoorsGreenPondIcon,
  "Outdoors-Lime": OutdoorsLimeIcon,
  "Outdoors-Pink Light": OutdoorsPinkLightIcon,
  "Outdoors-Pink": OutdoorsPinkIcon,
  "Outdoors-Purple": OutdoorsPurpleIcon,

  // Other project types
  "Project5-Green Pastel": Project5GreenPastelIcon,
  "Project6-Green Pastel": Project6GreenPastelIcon,
  "Project8-Blue Darker": Project8BlueDarkerIcon,
};

/**
 * Gets the project icon component based on type and color
 */
const getProjectIconComponent = (
  iconType?: ProjectIconType,
  iconColor?: ProjectIconColor
): React.FC<SvgProps> | null => {
  if (!iconType || !iconColor) return null;

  // Create the mapping key from type and color
  const iconKey = `${iconType}-${iconColor}`;

  // Return the component from our mapping
  return PROJECT_ICON_MAP[iconKey] || null;
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
  // Get the icon component using our static mapping
  const IconComponent = useMemo(() => {
    // Default to House Blue Light if no specific icon is requested
    const type = projectIconType || "House";
    const color = projectIconColor || "Blue Light";

    return getProjectIconComponent(type, color);
  }, [projectIconType, projectIconColor]);

  const itemContent = (
    <>
      <View style={styles.leftContainer as any}>
        <View
          style={[
            styles.iconContainer as any,
            {
              backgroundColor: IconComponent
                ? "transparent"
                : (styles.iconColors as any)[iconColor],
            },
          ]}
        >
          {IconComponent ? (
            // Use SVG icon as React component when available
            <IconComponent width={40} height={40} style={{ padding: 0 }} />
          ) : (
            // Fallback to Feather icon
            <Icon name={iconName} color={iconTextColor} size="lg" />
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
