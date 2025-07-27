import React from "react";
import { View } from "react-native";
import { WidgetProps } from "./types";
import { styles } from "./styles";
import { WidgetTitle } from "../WidgetTitle";
import { SwapItem } from "../SwapItem";
import { Button } from "../Button";

/**
 * Widget Organism Component
 *
 * A complete widget that combines multiple molecules into a cohesive unit.
 * This is the main reusable component that serves as a skeleton for consistency.
 *
 * Following atomic design principles:
 * - Combines WidgetTitle molecule (title + action)
 * - Combines SwapItem molecule (content area)
 * - Combines Button atom (actions)
 * - Creates a complete organism that can be reused across the app
 *
 * Based on Figma Design System:
 * - White background with border
 * - 16px border radius and padding
 * - 16px gap between elements
 * - Consistent structure across all widgets
 *
 * @param title - The widget title text
 * @param actionText - Optional action text in the title
 * @param onActionPress - Callback for title action
 * @param hasAction - Whether to show title action
 * @param children - Content for the swap area
 * @param placeholderText - Placeholder when swap area is empty
 * @param buttonText - Text for the bottom button
 * @param onButtonPress - Callback for button press
 * @param showButton - Whether to show the button (default: true)
 * @param buttonVariant - Button style variant
 * @param style - Custom container styles
 * @param titleProps - Override props for title component
 * @param swapItemProps - Override props for swap item component
 * @param swapItemMinHeight - Custom height for swap area
 */
export const Widget: React.FC<WidgetProps> = ({
  title,
  actionText = "Action",
  onActionPress,
  hasAction = true,
  children,
  placeholderText = "Add content here",
  buttonText = "Button",
  onButtonPress,
  showButton = true,
  buttonVariant = "secondary",
  style,
  titleProps,
  swapItemProps,
  swapItemMinHeight,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Widget Title - Using WidgetTitle molecule */}
      <WidgetTitle
        title={title}
        actionText={actionText}
        onActionPress={onActionPress}
        hasAction={hasAction}
        {...titleProps}
      />

      {/* Swap Content Area - Using SwapItem molecule */}
      <SwapItem
        placeholderText={placeholderText}
        minHeight={swapItemMinHeight}
        {...swapItemProps}
      >
        {children}
      </SwapItem>

      {/* Button Group - Using Button atom */}
      {showButton && (
        <View style={styles.buttonGroup}>
          <Button
            variant={buttonVariant}
            title={buttonText}
            onPress={onButtonPress}
            style={styles.button}
          />
        </View>
      )}
    </View>
  );
};

export default Widget;
