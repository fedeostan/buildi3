import { IconSize } from "./types";

// Icon size mapping following design system principles
// These sizes work well for mobile interfaces
export const iconSizes: Record<IconSize, number> = {
  xs: 12, // Very small icons (indicators, bullets)
  sm: 16, // Small icons (form elements, inline text)
  md: 20, // Medium icons (default, most common)
  lg: 24, // Large icons (navigation, important actions)
  xl: 32, // Extra large icons (prominent features)
  "2xl": 40, // Very large icons (hero sections, major actions)
};

// Default icon size - medium is most commonly used
export const defaultIconSize: IconSize = "md";
