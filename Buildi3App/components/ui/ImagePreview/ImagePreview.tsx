import React, { useState, useEffect } from "react";
import { View, Image as RNImage, ActivityIndicator, Text } from "react-native";
import { Image } from "expo-image";
import Icon from "../Icon";
import Button from "../Button";
import { ImagePreviewProps } from "./types";
import { styles } from "./styles";
import { colors } from "../../../theme";

/**
 * ImagePreview Component - Matching Figma Design System
 *
 * A full-screen image preview component that displays a selected image
 * with Continue and "Choose Another" action buttons.
 *
 * Features:
 * - Exact Figma layout and spacing
 * - Full-screen image display with proper aspect ratio
 * - Image loading and error handling
 * - Primary and text button variants
 * - Accessibility support
 * - Loading states for async operations
 *
 * Based on Figma: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=47-404
 *
 * @param imageUri - URI of the image to display
 * @param onContinue - Callback when Continue button is pressed
 * @param onChooseAnother - Callback when "Choose Another" button is pressed
 * @param style - Custom container styles
 * @param imageStyle - Custom image container styles
 * @param continueText - Continue button text
 * @param chooseAnotherText - Choose another button text
 * @param loading - Loading state for continue button
 * @param accessibilityLabel - Label for screen readers
 *
 * @example
 * <ImagePreview
 *   imageUri="file:///path/to/image.jpg"
 *   onContinue={() => handleContinue()}
 *   onChooseAnother={() => handleChooseAnother()}
 *   loading={uploading}
 * />
 */
const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUri,
  onContinue,
  onChooseAnother,
  style,
  imageStyle,
  continueText = "Continue",
  chooseAnotherText = "Choose Another",
  loading = false,
  accessibilityLabel = "Image Preview",
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [useRNImage, setUseRNImage] = useState(false);

  // Debug the image URI when component mounts or imageUri changes
  useEffect(() => {
    console.log("ImagePreview received URI:", imageUri);
    console.log("URI type:", typeof imageUri);
    console.log("URI length:", imageUri?.length);
    setImageLoading(true);
    setImageError(false);
    setUseRNImage(false);
  }, [imageUri]);

  // Handle image load error
  const handleImageError = (error: any) => {
    console.log("Expo Image failed to load:", imageUri);
    console.log("Error details:", error);

    if (!useRNImage) {
      console.log("Trying with React Native Image as fallback...");
      setUseRNImage(true);
      setImageLoading(true);
      return;
    }

    console.log("Both image libraries failed, showing placeholder");
    setImageError(true);
    setImageLoading(false);
  };

  // Handle image load success
  const handleImageLoad = () => {
    console.log(
      "Image loaded successfully:",
      imageUri,
      useRNImage ? "(RN Image)" : "(Expo Image)"
    );
    setImageError(false);
    setImageLoading(false);
  };

  // Handle RN Image error
  const handleRNImageError = (error: any) => {
    console.log("React Native Image also failed:", error);
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel}
    >
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Image Container */}
        <View style={[styles.imageContainer, imageStyle]}>
          {imageLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading image...</Text>
            </View>
          )}

          {!imageError && !useRNImage ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              contentFit="cover"
              transition={200}
              onError={handleImageError}
              onLoad={handleImageLoad}
              placeholder={undefined}
              accessibilityLabel="Selected image preview"
            />
          ) : !imageError && useRNImage ? (
            <RNImage
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
              onError={handleRNImageError}
              onLoad={handleImageLoad}
              accessibilityLabel="Selected image preview"
            />
          ) : (
            /* Image Placeholder - matches Figma design */
            <View style={styles.imagePlaceholder}>
              <View style={styles.placeholderIconContainer}>
                <Icon
                  name="camera"
                  size="md"
                  color="textSecondary"
                  accessibilityLabel="Image placeholder"
                />
              </View>
              <Text style={styles.errorText}>Failed to load image</Text>
            </View>
          )}
        </View>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Continue Button - Primary */}
          <Button
            variant="primary"
            title={continueText}
            onPress={onContinue}
            style={styles.continueButton}
            loading={loading}
            disabled={loading}
            accessibilityLabel={`${continueText} button`}
          />

          {/* Choose Another Button - Text */}
          <Button
            variant="text"
            title={chooseAnotherText}
            onPress={onChooseAnother}
            style={styles.chooseAnotherButton}
            disabled={loading}
            accessibilityLabel={`${chooseAnotherText} button`}
          />
        </View>
      </View>
    </View>
  );
};

export default ImagePreview;
