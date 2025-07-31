import React, { useState } from "react";
import { Pressable, View, Animated } from "react-native";
import { ButtonProps } from "./types";
import {
  getButtonStyle,
  getPressStateColors,
  getDisabledColors,
  DEFAULT_VARIANT,
  DEFAULT_SIZE,
} from "./styles";
import { Typography } from "../Typography";
import { Spinner } from "../Spinner";

/**
 * Button component matching your Figma Design System exactly
 *
 * Features:
 * - 3 variants: primary, secondary, text
 * - 3 sizes: small, medium, large
 * - Icon support with proper spacing
 * - Loading states with spinner
 * - Proper accessibility support
 * - Smooth press animations
 * - Disabled state handling
 *
 * @param variant - Button style variant from Figma
 * @param size - Button size configuration
 * @param title - Text to display in button
 * @param iconName - Optional icon name
 * @param loading - Show loading spinner
 * @param disabled - Disable button interaction
 * @param children - Custom button content
 * @param accessibilityLabel - Screen reader label
 * @param props - All other Pressable props
 *
 * @example
 * <Button variant="primary" title="Sign In" />
 * <Button variant="secondary" title="Cancel" size="small" />
 * <Button variant="text" title="Learn More" iconName="arrow-right" />
 * <Button variant="primary" title="Submit" loading={isSubmitting} />
 */
export const Button: React.FC<ButtonProps> = ({
  variant = DEFAULT_VARIANT,
  size = DEFAULT_SIZE,
  title,
  iconName,
  loading = false,
  disabled = false,
  children,
  accessibilityLabel,
  style,
  ...props
}) => {
  // Animation for press feedback
  const [pressAnim] = useState(new Animated.Value(1));
  const [isPressed, setIsPressed] = useState(false);

  // Get styling configuration
  const hasIcon = Boolean(iconName);
  const buttonStyle = getButtonStyle(variant, size, hasIcon);
  const pressColors = getPressStateColors(variant);
  const disabledColors = getDisabledColors();

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Handle press animations and state
  const handlePressIn = () => {
    if (!isDisabled) {
      setIsPressed(true);
      Animated.timing(pressAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!isDisabled) {
      setIsPressed(false);
      Animated.timing(pressAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  // Get final colors based on state
  const finalColors = isDisabled
    ? disabledColors
    : isPressed
    ? pressColors
    : buttonStyle;

  // Render button content
  const renderContent = () => {
    if (children) {
      return children;
    }

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: buttonStyle.gap,
        }}
      >
        {/* Loading spinner - using our custom Spinner */}
        {loading && (
          <Spinner
            size="small"
            color={finalColors.textColor}
            accessibilityLabel="Button loading"
          />
        )}

        {/* Button text */}
        {title && (
          <Typography
            variant="labelMedium"
            style={{
              color: finalColors.textColor,
              textAlign: "center",
            }}
          >
            {title}
          </Typography>
        )}

        {/* Icon placeholder - you can replace this with your icon component */}
        {iconName && !loading && (
          <View
            style={{
              width: buttonStyle.iconSize,
              height: buttonStyle.iconSize,
              backgroundColor: finalColors.textColor,
              borderRadius: buttonStyle.iconSize / 2,
              opacity: 0.8,
            }}
          />
        )}
      </View>
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
      <Pressable
        style={(state) => [
          {
            backgroundColor: finalColors.backgroundColor,
            paddingVertical: buttonStyle.paddingVertical,
            paddingHorizontal: buttonStyle.paddingHorizontal,
            borderRadius: buttonStyle.borderRadius,
            opacity: isDisabled ? 0.6 : 1,
            // Add subtle shadow for depth (like in Figma)
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: variant === "text" ? 0 : 0.1,
            shadowRadius: 4,
            elevation: variant === "text" ? 0 : 2,
          },
          // Handle both function and object styles
          typeof style === "function" ? style(state) : style,
        ]}
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        // Accessibility support
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title || "Button"}
        accessibilityState={{ disabled: isDisabled }}
        {...props}
      >
        {renderContent()}
      </Pressable>
    </Animated.View>
  );
};

export default Button;
