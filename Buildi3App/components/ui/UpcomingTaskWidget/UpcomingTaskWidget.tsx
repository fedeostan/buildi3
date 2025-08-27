import React, { useState, useRef, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
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
  // State for filter modal visibility
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter options
  const filterPeriods: TaskFilterPeriod[] = [
    "Today",
    "This week",
    "This month",
    "All",
  ];

  // Handle filter button press
  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  // Handle filter option selection
  const handleFilterSelect = (period: TaskFilterPeriod) => {
    setFilterModalVisible(false);
    if (onFilterChange) {
      onFilterChange(period);
    }
  };

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

  // Render the filter modal content
  const renderFilterModal = () => {
    return (
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 30,
              maxHeight: "60%",
            }}
          >
            <BottomSheetTopBar
              cancelText="Close"
              onCancel={() => setFilterModalVisible(false)}
              segmentedOptions={[]}
              selectedTabId=""
              onTabSelect={() => {}}
            />

            <View style={styles.bottomSheetContent}>
              <Typography variant="labelLarge" style={{ marginBottom: 16 }}>
                Filter by period
              </Typography>

              {filterPeriods.map((period, index) => (
                <Pressable
                  key={period}
                  style={[
                    styles.filterOption,
                    index === filterPeriods.length - 1 &&
                      styles.lastFilterOption,
                    period === selectedPeriod && styles.selectedFilterOption,
                  ]}
                  onPress={() => handleFilterSelect(period)}
                  accessibilityLabel={`Filter by ${period}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: period === selectedPeriod }}
                >
                  <Typography
                    variant="bodyMedium"
                    style={{
                      fontWeight: period === selectedPeriod ? "600" : "400",
                    }}
                  >
                    {period}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <Widget
        title={title}
        actionText={selectedPeriod}
        onActionPress={showFilter ? handleFilterPress : undefined}
        hasAction={showFilter}
        buttonText="View All Tasks"
        onButtonPress={onViewAllPress}
        showButton={Boolean(onViewAllPress)}
        titleProps={{
          actionStyle: { fontWeight: "500" },
        }}
        style={[styles.container, style]}
        {...widgetProps}
      >
        <TaskList
          tasks={tasks}
          onTaskPress={onTaskPress}
          maxTasks={5}
          emptyStateMessage={`No tasks ${selectedPeriod.toLowerCase()}`}
        />
      </Widget>

      {/* Filter Modal */}
      {renderFilterModal()}
    </>
  );
};

export default UpcomingTaskWidget;
