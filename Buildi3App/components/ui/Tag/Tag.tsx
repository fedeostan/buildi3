import React from "react";
import { View, Text } from "react-native";
import { TagProps, DateTagProps } from "./types";
import { styles } from "./styles";
import { getTagVariant, getTagText } from "./utils";

/**
 * Tag Atom Component
 *
 * Following Atomic Design principles - this is an ATOM (smallest building block)
 *
 * Features:
 * - 3 color variants: red (overdue), yellow (today/tomorrow), green (future)
 * - Compact design with proper padding and border radius
 * - Uses design system colors exclusively
 * - Supports custom styling overrides
 *
 * @param variant - Tag color variant (red, yellow, green)
 * @param text - Tag text content
 * @param style - Custom container style override
 * @param textStyle - Custom text style override
 * @param accessibilityLabel - Label for screen readers
 */
const Tag: React.FC<TagProps> = ({
  variant,
  text,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case "red":
        return {
          container: styles.redContainer,
          text: styles.redText,
        };
      case "yellow":
        return {
          container: styles.yellowContainer,
          text: styles.yellowText,
        };
      case "green":
        return {
          container: styles.greenContainer,
          text: styles.greenText,
        };
      default:
        return {
          container: styles.greenContainer,
          text: styles.greenText,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View
      style={[styles.container, variantStyles.container, style]}
      accessible={true}
      accessibilityLabel={accessibilityLabel || `${variant} tag: ${text}`}
      accessibilityRole="text"
    >
      <Text style={[styles.text, variantStyles.text, textStyle]}>{text}</Text>
    </View>
  );
};

/**
 * DateTag Component - Smart tag that automatically determines variant and text based on due date
 *
 * Features:
 * - Automatically calculates variant (red/yellow/green) based on due date logic
 * - Dynamically generates text based on date difference
 * - Formats dates as "11 Sep" style
 * - Handles special cases: Today, Tomorrow, Yesterday
 *
 * @param dueDate - Due date for the tag
 * @param currentDate - Current date (defaults to now)
 * @param style - Custom container style override
 * @param textStyle - Custom text style override
 * @param accessibilityLabel - Label for screen readers
 */
export const DateTag: React.FC<DateTagProps> = ({
  dueDate,
  currentDate = new Date(),
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const variant = getTagVariant(dueDate, currentDate);
  const text = getTagText(dueDate, currentDate);

  return (
    <Tag
      variant={variant}
      text={text}
      style={style}
      textStyle={textStyle}
      accessibilityLabel={accessibilityLabel || `Due date: ${text}`}
    />
  );
};

export default Tag;