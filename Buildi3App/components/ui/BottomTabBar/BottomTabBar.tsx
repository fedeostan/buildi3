import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Icon from "../Icon";
import { colors, componentSpacing } from "../../../theme";
import { BottomTabBarProps, TabBarButtonProps } from "./types";
import { styles } from "./styles";

/**
 * TabBarButton - Individual tab button component (Molecule)
 * 
 * Internal component for rendering a single tab button
 */
const TabBarButton: React.FC<TabBarButtonProps> = ({ item, isActive, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.tabButton} 
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${item.title} tab`}
    >
      <Icon
        name={item.icon}
        customSize={componentSpacing.tabBar.iconSize}
        color={isActive ? colors.tabBarActiveText : colors.tabBarInactiveText}
      />
      <Text 
        style={[
          styles.tabLabel,
          isActive ? styles.activeLabelColor : styles.inactiveLabelColor
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * BottomTabBar - Navigation tab bar component (Organism)
 *
 * Features:
 * - Uses design tokens for consistent styling
 * - Matches Figma NavBar component exactly
 * - Reusable with configurable tab items
 * - Proper accessibility support
 * - Follows atomic design principles
 *
 * Examples:
 * <BottomTabBar
 *   items={tabItems}
 *   activeTab="home"
 *   onTabPress={(tab) => router.push(`/(tabs)/${tab}`)}
 * />
 */
const BottomTabBar: React.FC<BottomTabBarProps> = ({ 
  items, 
  activeTab, 
  onTabPress 
}) => {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TabBarButton
          key={item.name}
          item={item}
          isActive={activeTab === item.name}
          onPress={() => onTabPress?.(item.name)}
        />
      ))}
    </View>
  );
};

export default BottomTabBar;