import { TextProps } from "react-native";

// Typography variants exactly matching your Figma design system
export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "labelLarge"
  | "labelMedium"
  | "labelSmall"
  | "bodyLarge"
  | "bodyMedium"
  | "bodySmall"
  | "code";

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
}

// Style definition interface
export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: "400" | "500" | "600" | "700";
  lineHeight: number;
  letterSpacing: number;
}
