import React from "react";
import { View } from "react-native";
import { SwapItemProps } from "./types";
import { styles } from "./styles";
import { Typography } from "../Typography";
import { colors } from "../../../theme";

/**
 * SwapItem Molecule Component
 *
 * A flexible content area that can hold different components.
 * This is where other components will be "swapped" in and out.
 *
 * Following atomic design principles:
 * - Uses Typography atom for placeholder text
 * - Serves as a container molecule for other components
 * - Reusable across different widget contexts
 *
 * Based on Figma Design System:
 * - Gray background (#F2F3F7)
 * - 16px border radius
 * - 120px minimum height
 * - Centered content alignment
 * - 16px internal padding
 *
 * @param children - Components to render inside the swap area
 * @param placeholderText - Text to show when empty (default: "Add content here")
 * @param style - Custom container styles
 * @param placeholderStyle - Custom placeholder text styles
 * @param minHeight - Minimum height override
 * @param isEmpty - Whether to show placeholder (auto-detected if not specified)
 */
export const SwapItem: React.FC<SwapItemProps> = ({
  children,
  placeholderText = "Add content here",
  style,
  placeholderStyle,
  minHeight,
  isEmpty,
}) => {
  // Auto-detect if empty when not explicitly set
  const isEmptyState = isEmpty !== undefined ? isEmpty : !children;

  return (
    <View
      style={[styles.container, minHeight ? { minHeight } : undefined, style]}
    >
      {isEmptyState ? (
        // Placeholder state - Using Typography atom
        <Typography
          variant="bodyMedium"
          style={[
            {
              color: colors.textTertiary, // #646466 from Figma
              textAlign: "center",
              letterSpacing: 0.03125, // 3.125% from Figma
            },
            placeholderStyle,
          ]}
        >
          {placeholderText}
        </Typography>
      ) : (
        // Content state - Render children with full width
        <View style={styles.contentWrapper}>{children}</View>
      )}
    </View>
  );
};

export default SwapItem;
