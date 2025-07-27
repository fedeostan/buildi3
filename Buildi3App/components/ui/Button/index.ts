// Main Button component
export { Button as default } from "./Button";
export { Button } from "./Button";

// Types for TypeScript users
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  ButtonStyleConfig,
} from "./types";

// Styles and utilities for advanced usage (rarely needed)
export {
  getButtonStyle,
  getPressStateColors,
  getDisabledColors,
  DEFAULT_VARIANT,
  DEFAULT_SIZE,
} from "./styles";
