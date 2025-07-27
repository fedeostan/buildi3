import React from "react";
import { Text } from "react-native";
import { TypographyProps } from "./types";
import { typographyStyles, DEFAULT_VARIANT } from "./styles";

/**
 * Typography component matching your Figma Design System exactly
 *
 * Uses your exact font specifications:
 * - Headers: Montserrat font family (600/500 weight)
 * - Body: Inter font family (400 weight)
 * - Labels: Inter font family (500 weight)
 *
 * @param variant - Typography style variant from Figma
 * @param children - Text content to display
 * @param style - Additional custom styles (optional)
 * @param props - All other React Native Text props
 *
 * @example
 * <Typography variant="h1">Welcome to Buildi3</Typography>
 * <Typography variant="bodyMedium">This is regular content</Typography>
 * <Typography variant="labelSmall" style={{color: '#666'}}>Helper text</Typography>
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = DEFAULT_VARIANT,
  children,
  style,
  ...props
}) => {
  // Get the exact style from Figma for this variant
  const baseStyle = typographyStyles[variant];

  return (
    <Text
      style={[
        baseStyle,
        style, // Custom styles override base styles
      ]}
      {...props} // Pass through all Text props (onPress, numberOfLines, etc.)
    >
      {children}
    </Text>
  );
};

export default Typography;
