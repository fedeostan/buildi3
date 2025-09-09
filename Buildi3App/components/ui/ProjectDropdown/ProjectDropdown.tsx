import React, { useMemo, useRef, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import { colors, spacing } from "../../../theme";
import { useProjects } from "../../../hooks/useProjects";
import { Project } from "../../../lib/supabase/types";
import {
  styles as dropdownStyles,
  getContainerStyle,
} from "../Dropdown/styles";

// SVG imports (generated registry)
// General
import GeneralBlueDarker from "../../../assets/icons/project_icons/Project=General, Color=Blue Darker.svg";
import GeneralBlueLight from "../../../assets/icons/project_icons/Project=General, Color=Blue Light.svg";
import GeneralGreenLight from "../../../assets/icons/project_icons/Project=General, Color=Green Light.svg";
import GeneralGreenPond from "../../../assets/icons/project_icons/Project=General, Color=Green Pond.svg";
import GeneralLime from "../../../assets/icons/project_icons/Project=General, Color=Lime.svg";
import GeneralPinkLight from "../../../assets/icons/project_icons/Project=General, Color=Pink Light.svg";
import GeneralPink from "../../../assets/icons/project_icons/Project=General, Color=Pink.svg";
import GeneralPurple from "../../../assets/icons/project_icons/Project=General, Color=Purple.svg";

// Building
import BuildingBlueDarker from "../../../assets/icons/project_icons/Project=Building, Color=Blue Darker.svg";
import BuildingBlueLight from "../../../assets/icons/project_icons/Project=Building, Color=Blue Light.svg";

// House
import HouseBlueLight from "../../../assets/icons/project_icons/Project=House, Color=Blue Light.svg";
import HouseGreenLight from "../../../assets/icons/project_icons/Project=House, Color=Green Light.svg";
import HouseGreenPastel from "../../../assets/icons/project_icons/Project=House, Color=Green Pastel.svg";
import HouseGreenPond from "../../../assets/icons/project_icons/Project=House, Color=Green Pond.svg";
import HouseLime from "../../../assets/icons/project_icons/Project=House, Color=Lime.svg";
import HousePinkLight from "../../../assets/icons/project_icons/Project=House, Color=Pink Light.svg";
import HousePink from "../../../assets/icons/project_icons/Project=House, Color=Pink.svg";
import HousePurple from "../../../assets/icons/project_icons/Project=House, Color=Purple.svg";

// Outdoors
import OutdoorsBlueDarker from "../../../assets/icons/project_icons/Project=Outdoors, Color=Blue Darker.svg";
import OutdoorsBlueLight from "../../../assets/icons/project_icons/Project=Outdoors, Color=Blue Light.svg";
import OutdoorsGreenLight from "../../../assets/icons/project_icons/Project=Outdoors, Color=Green Light.svg";
import OutdoorsGreenPond from "../../../assets/icons/project_icons/Project=Outdoors, Color=Green Pond.svg";
import OutdoorsLime from "../../../assets/icons/project_icons/Project=Outdoors, Color=Lime.svg";
import OutdoorsPinkLight from "../../../assets/icons/project_icons/Project=Outdoors, Color=Pink Light.svg";
import OutdoorsPink from "../../../assets/icons/project_icons/Project=Outdoors, Color=Pink.svg";
import OutdoorsPurple from "../../../assets/icons/project_icons/Project=Outdoors, Color=Purple.svg";

// Misc project variants
import Project5GreenPastel from "../../../assets/icons/project_icons/Project=Project5, Color=Green Pastel.svg";
import Project6GreenPastel from "../../../assets/icons/project_icons/Project=Project6, Color=Green Pastel.svg";
import Project8BlueDarker from "../../../assets/icons/project_icons/Project=Project8, Color=Blue Darker.svg";

type Props = {
  label?: string;
  value?: string | null; // selected project id
  onSelect?: (project: Project | null) => void;
  disabled?: boolean;
  errorMessage?: string;
  successMessage?: string;
  bottomSheetTitle?: string;
  containerStyle?: any;
  fieldStyle?: any;
  labelStyle?: any;
  selectedTextStyle?: any;
  enableNoneOption?: boolean;
};

const ICON_REGISTRY: Record<string, React.FC<any>> = {
  "General|Blue Darker": GeneralBlueDarker,
  "General|Blue Light": GeneralBlueLight,
  "General|Green Light": GeneralGreenLight,
  "General|Green Pond": GeneralGreenPond,
  "General|Lime": GeneralLime,
  "General|Pink Light": GeneralPinkLight,
  "General|Pink": GeneralPink,
  "General|Purple": GeneralPurple,

  "Building|Blue Darker": BuildingBlueDarker,
  "Building|Blue Light": BuildingBlueLight,

  "House|Blue Light": HouseBlueLight,
  "House|Green Light": HouseGreenLight,
  "House|Green Pastel": HouseGreenPastel,
  "House|Green Pond": HouseGreenPond,
  "House|Lime": HouseLime,
  "House|Pink Light": HousePinkLight,
  "House|Pink": HousePink,
  "House|Purple": HousePurple,

  "Outdoors|Blue Darker": OutdoorsBlueDarker,
  "Outdoors|Blue Light": OutdoorsBlueLight,
  "Outdoors|Green Light": OutdoorsGreenLight,
  "Outdoors|Green Pond": OutdoorsGreenPond,
  "Outdoors|Lime": OutdoorsLime,
  "Outdoors|Pink Light": OutdoorsPinkLight,
  "Outdoors|Pink": OutdoorsPink,
  "Outdoors|Purple": OutdoorsPurple,

  "Project5|Green Pastel": Project5GreenPastel,
  "Project6|Green Pastel": Project6GreenPastel,
  "Project8|Blue Darker": Project8BlueDarker,
};

const getIcon = (
  type?: string | null,
  color?: string | null
): React.ReactNode => {
  const key = `${type || "General"}|${color || "Blue Light"}`;
  const IconComp = ICON_REGISTRY[key] || GeneralBlueLight;
  return <IconComp width={24} height={24} />;
};

export const ProjectDropdown: React.FC<Props> = ({
  label = "Project",
  value,
  onSelect,
  disabled = false,
  errorMessage,
  successMessage,
  bottomSheetTitle,
  containerStyle,
  fieldStyle,
  labelStyle,
  selectedTextStyle,
  enableNoneOption = true,
}) => {
  const { projects, loading } = useProjects({
    orderBy: "name",
    orderDirection: "asc",
  });
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === value) || null,
    [projects, value]
  );

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  const options = useMemo(() => {
    const items = projects.map((p) => ({
      id: p.id,
      label: p.name,
      icon: (
        <View style={localStyles.optionIcon}>
          {getIcon(p.icon_type, p.icon_color)}
        </View>
      ),
    }));

    if (enableNoneOption) {
      items.unshift({
        id: "__none__",
        label: "No Project",
        icon: (
          <View style={localStyles.optionIconNone}>
            <Feather name="minus" size={16} color={colors.textSecondary} />
          </View>
        ),
      } as any);
    }

    return items;
  }, [projects, enableNoneOption]);

  const selectedState: "default" | "filled" | "success" | "error" = errorMessage
    ? "error"
    : successMessage
    ? "success"
    : selectedProject
    ? "filled"
    : "default";

  const handlePress = useCallback(() => {
    if (!disabled) {
      setIsBottomSheetOpen(true);
      bottomSheetRef.current?.present();
    }
  }, [disabled]);

  const handleBottomSheetDismiss = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  const handleOptionSelect = useCallback(
    (id: string) => {
      if (id === "__none__") {
        onSelect?.(null);
      } else {
        const project = projects.find((p) => p.id === id) || null;
        if (project) onSelect?.(project);
      }
      bottomSheetRef.current?.dismiss();
    },
    [onSelect, projects]
  );

  const needsScrolling = useMemo(() => {
    const itemHeight = 56;
    const base = 120;
    const safeBottomSpace = insets.bottom || 34;
    const total = base + options.length * itemHeight + safeBottomSpace + 40;
    // Keep within ~90% screen height; BottomSheet v5 will clamp
    return total > 600;
  }, [options.length, insets.bottom]);

  return (
    <View>
      <Pressable
        style={[
          getContainerStyle(selectedState, disabled),
          containerStyle,
          fieldStyle,
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${label} dropdown`}
        accessibilityState={{ expanded: isBottomSheetOpen, disabled }}
      >
        <View style={dropdownStyles.mainContainer}>
          <View
            style={[dropdownStyles.leftContainer, localStyles.leftContainer]}
          >
            {selectedProject && (
              <View style={localStyles.selectedIcon}>
                {getIcon(selectedProject.icon_type, selectedProject.icon_color)}
              </View>
            )}
            {selectedProject ? (
              <Text
                style={[dropdownStyles.selectedText, selectedTextStyle]}
                numberOfLines={1}
              >
                {selectedProject.name}
              </Text>
            ) : (
              <Text
                style={[
                  dropdownStyles.placeholderText,
                  disabled && dropdownStyles.placeholderTextDisabled,
                  selectedTextStyle,
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            )}
          </View>
          <View style={dropdownStyles.rightContainer}>
            <Feather
              name="chevron-down"
              size={20}
              color={disabled ? colors.disabledText : colors.textSecondary}
            />
          </View>
        </View>
      </Pressable>

      {errorMessage && (
        <Text style={dropdownStyles.errorMessage} accessibilityRole="alert">
          {errorMessage}
        </Text>
      )}
      {successMessage && !errorMessage && (
        <Text style={dropdownStyles.successMessage}>{successMessage}</Text>
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["50%"]}
        enableDynamicSizing
        onDismiss={handleBottomSheetDismiss}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.textTertiary }}
        backdropComponent={(props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.6}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView
          style={{ paddingBottom: Math.max(insets.bottom + 20, 40) }}
        >
          <View style={dropdownStyles.bottomSheetHeader}>
            <Text style={dropdownStyles.bottomSheetTitle}>
              {bottomSheetTitle || "Select Project"}
            </Text>
          </View>

          {needsScrolling ? (
            <BottomSheetScrollView
              contentContainerStyle={[
                dropdownStyles.bottomSheetContent,
                { paddingBottom: Math.max(insets.bottom + 40, 70) },
              ]}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {options.map((opt) => (
                <Pressable
                  key={opt.id}
                  style={({ pressed }) => [
                    dropdownStyles.optionItem,
                    pressed && dropdownStyles.optionItemPressed,
                  ]}
                  onPress={() => handleOptionSelect(opt.id)}
                >
                  {opt.icon}
                  <Text style={dropdownStyles.optionText}>{opt.label}</Text>
                  {((selectedProject && opt.id === selectedProject.id) ||
                    (!selectedProject && opt.id === "__none__")) && (
                    <View style={dropdownStyles.selectedIndicator}>
                      <Text style={dropdownStyles.selectedCheckmark}>✓</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </BottomSheetScrollView>
          ) : (
            <View
              style={[
                dropdownStyles.bottomSheetContent,
                { paddingBottom: Math.max(insets.bottom + 40, 70) },
              ]}
            >
              {options.map((opt) => (
                <Pressable
                  key={opt.id}
                  style={({ pressed }) => [
                    dropdownStyles.optionItem,
                    pressed && dropdownStyles.optionItemPressed,
                  ]}
                  onPress={() => handleOptionSelect(opt.id)}
                >
                  {opt.icon}
                  <Text style={dropdownStyles.optionText}>{opt.label}</Text>
                  {((selectedProject && opt.id === selectedProject.id) ||
                    (!selectedProject && opt.id === "__none__")) && (
                    <View style={dropdownStyles.selectedIndicator}>
                      <Text style={dropdownStyles.selectedCheckmark}>✓</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  leftContainer: {
    alignItems: "flex-start",
  },
  selectedIcon: {
    width: 24,
    height: 24,
    marginRight: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  optionIconNone: {
    width: 24,
    height: 24,
    marginRight: spacing.sm,
    borderRadius: 6,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProjectDropdown;
