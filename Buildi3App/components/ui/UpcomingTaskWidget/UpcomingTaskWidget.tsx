import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UpcomingTaskWidgetProps, TaskFilterPeriod } from "./types";
import { styles } from "./styles";
import { Widget } from "../Widget";
import TaskList from "../TaskList";
import { Typography } from "../Typography";
import Icon from "../Icon";
import BottomSheetTopBar from "../BottomSheetTopBar";

/**
 * UpcomingTaskWidget Component
 *
 * A widget that displays upcoming tasks with:
 * - Filtering by time period (Today, This week, This month, All)
 * - Variable number of task items (1-5)
 * - Empty state handling
 *
 * Following atomic design principles:
 * - Uses Widget organism as the base structure
 * - Uses TaskList organism for content
 * - Creates a specialized organism for the specific use case
 *
 * Based on Figma Design System:
 * - Consistent widget styling and spacing
 * - Filter button with dropdown in top-right
 * - Shows up to 5 tasks max
 *
 * @param tasks - Array of tasks to display
 * @param selectedPeriod - Currently selected filter period
 * @param onTaskPress - Function called when a task is pressed
 * @param onFilterChange - Function called when filter is changed
 * @param onViewAllPress - Function called when View All action is pressed
 * @param showFilter - Whether to show the filter dropdown button
 * @param title - Custom widget title
 * @param widgetProps - Additional widget props to override defaults
 * @param style - Custom container styles
 */
const UpcomingTaskWidget: React.FC<UpcomingTaskWidgetProps> = ({
  tasks = [],
  selectedPeriod = "Today",
  onTaskPress,
  onFilterChange,
  onViewAllPress,
  showFilter = true,
  title = "Upcoming Tasks",
  widgetProps,
  style,
}) => {
  // Ref for bottom sheet modal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Get safe area insets for proper bottom padding
  const insets = useSafeAreaInsets();

  // Bottom sheet configuration
  const snapPoints = useMemo(() => ["40%"], []);

  // State to track if bottom sheet is open
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Filter options
  const filterPeriods: TaskFilterPeriod[] = [
    "Today",
    "This week",
    "This month",
    "All",
  ];

  // Handle filter button press
  const handleFilterPress = () => {
    bottomSheetModalRef.current?.present();
  };

  // Handle filter option selection
  const handleFilterSelect = (period: TaskFilterPeriod) => {
    bottomSheetModalRef.current?.dismiss();
    if (onFilterChange) {
      onFilterChange(period);
    }
  };

  // Handle bottom sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    setIsBottomSheetOpen(index >= 0);
  }, []);

  // Render backdrop for bottom sheet
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Render the filter button for the widget title
  const renderFilterButton = () => {
    if (!showFilter) return null;

    return (
      <TouchableOpacity
        style={styles.filterButton}
        onPress={handleFilterPress}
        accessibilityLabel={`Filter tasks by ${selectedPeriod}`}
        accessibilityRole="button"
      >
        <Typography variant="labelMedium" style={styles.filterText}>
          {selectedPeriod}
        </Typography>
        <Icon name="chevron-down" size="sm" color="actionText" />
      </TouchableOpacity>
    );
  };

  // Render filter options for the bottom sheet
  const renderFilterOptions = useCallback(() => {
    return (
      <View
        style={[
          styles.bottomSheetContent,
          { paddingBottom: Math.max(insets.bottom + 40, 70) },
        ]}
      >
        {filterPeriods.map((period, index) => (
          <Pressable
            key={period}
            style={[
              styles.filterOption,
              index === filterPeriods.length - 1 && styles.lastFilterOption,
            ]}
            onPress={() => handleFilterSelect(period)}
            accessibilityLabel={`Select ${period}`}
            accessibilityRole="radio"
            accessibilityState={{ checked: period === selectedPeriod }}
          >
            <Typography variant="bodyMedium" style={styles.optionText}>
              {period}
            </Typography>
            {period === selectedPeriod && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedCheckmark}>✓</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    );
  }, [filterPeriods, selectedPeriod, handleFilterSelect]);

  return (
    <>
      <Widget
        title={title}
        actionText={selectedPeriod}
        onActionPress={showFilter ? handleFilterPress : undefined}
        hasAction={showFilter}
        showActionIcon={showFilter}
        actionIconName="chevron-down"
        actionIconSize="sm"
        actionIconColor="actionText"
        buttonText="View All Tasks"
        onButtonPress={onViewAllPress}
        showButton={Boolean(onViewAllPress)}
        titleProps={{
          actionStyle: { fontWeight: "500" },
        }}
        style={StyleSheet.flatten([styles.container, style])}
        {...widgetProps}
      >
        <TaskList
          tasks={tasks}
          onTaskPress={onTaskPress}
          maxTasks={5}
          emptyStateMessage={`No tasks ${selectedPeriod.toLowerCase()}`}
        />
      </Widget>

      {/* Filter Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        accessibilityLabel="Period of Time options"
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Select Period</Text>
          </View>
          {renderFilterOptions()}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default UpcomingTaskWidget;
