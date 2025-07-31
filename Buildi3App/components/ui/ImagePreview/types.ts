export interface ImagePreviewProps {
  /**
   * URI of the image to display
   */
  imageUri: string;

  /**
   * Callback when Continue button is pressed
   */
  onContinue: () => void;

  /**
   * Callback when "Choose Another" button is pressed
   */
  onChooseAnother: () => void;

  /**
   * Custom style for the container
   */
  style?: any;

  /**
   * Custom style for the image container
   */
  imageStyle?: any;

  /**
   * Continue button text (default: "Continue")
   */
  continueText?: string;

  /**
   * Choose another button text (default: "Choose Another")
   */
  chooseAnotherText?: string;

  /**
   * Loading state for the continue button
   */
  loading?: boolean;

  /**
   * Accessibility label for the screen
   */
  accessibilityLabel?: string;
}
