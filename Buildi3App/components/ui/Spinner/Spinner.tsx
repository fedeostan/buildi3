import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { SpinnerProps } from "./types";
import {
  styles,
  getContainerStyle,
  getSpinnerSize,
  ANIMATION_CONFIG,
  SPINNER_CONSTANTS,
} from "./styles";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Custom Spinner Component
 *
 * Matches Figma design with smooth animations inspired by One UI and Material M3.
 * Features a ring that rotates, expands/contracts, but never fully closes or completes.
 *
 * Key Features:
 * - Smooth rotation animation using native driver
 * - Ring that pulses (expands/contracts) but never disappears
 * - Never completes a full circle (always has a gap)
 * - Size variants using our spacing tokens
 * - Uses design system colors
 * - Proper accessibility support
 *
 * @param size - Size variant (small, medium, large)
 * @param color - Ring color (defaults to colors.buttonPrimary from Figma)
 * @param animating - Whether to animate (default: true)
 * @param style - Custom style overrides
 * @param accessibilityLabel - Screen reader label
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = SPINNER_CONSTANTS.defaultColor,
  animating = true,
  style,
  accessibilityLabel = "Loading",
}) => {
  // Animation values
  const rotationValue = useRef(new Animated.Value(0)).current;
  const arcLengthValue = useRef(
    new Animated.Value(SPINNER_CONSTANTS.minArcLength)
  ).current;

  // Get size configuration
  const sizeConfig = getSpinnerSize(size);
  const containerStyle = getContainerStyle(size);

  /**
   * Start smooth rotation animation
   * Continuous spin with linear easing for consistency
   */
  const startRotationAnimation = () => {
    rotationValue.setValue(0);

    const animation = Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: ANIMATION_CONFIG.rotation.duration,
        easing: Easing.linear,
        useNativeDriver: ANIMATION_CONFIG.rotation.useNativeDriver,
      }),
      { iterations: -1 } // Infinite loop
    );

    animation.start();
    return animation;
  };

  /**
   * Start arc length pulsing animation
   * Creates smooth expanding/contracting effect without diameter changes
   */
  const startArcLengthAnimation = () => {
    const animation = Animated.loop(
      Animated.sequence([
        // Expand from min to max with smooth easing
        Animated.timing(arcLengthValue, {
          toValue: SPINNER_CONSTANTS.maxArcLength,
          duration: ANIMATION_CONFIG.arcLength.duration / 2,
          easing: Easing.inOut(Easing.sin), // Smooth sine wave for natural motion
          useNativeDriver: ANIMATION_CONFIG.arcLength.useNativeDriver,
        }),
        // Contract from max to min with smooth easing
        Animated.timing(arcLengthValue, {
          toValue: SPINNER_CONSTANTS.minArcLength,
          duration: ANIMATION_CONFIG.arcLength.duration / 2,
          easing: Easing.inOut(Easing.sin), // Same easing for seamless transition
          useNativeDriver: ANIMATION_CONFIG.arcLength.useNativeDriver,
        }),
      ]),
      { iterations: -1 }
    );

    animation.start();
    return animation;
  };

  // Start animations when component mounts or animating prop changes
  useEffect(() => {
    if (!animating) return;

    const rotationAnimation = startRotationAnimation();
    const arcAnimation = startArcLengthAnimation();

    // Cleanup function to stop animations
    return () => {
      rotationAnimation.stop();
      arcAnimation.stop();
    };
  }, [animating]);

  // Don't render if not animating
  if (!animating) {
    return null;
  }

  // Interpolate rotation value to degrees
  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={[styles.container, containerStyle, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessible={true}
    >
      <Animated.View
        style={[
          styles.spinner,
          {
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Svg
          width={sizeConfig.width}
          height={sizeConfig.height}
          viewBox={`0 0 ${sizeConfig.width} ${sizeConfig.height}`}
        >
          <AnimatedCircle
            cx={sizeConfig.width / 2}
            cy={sizeConfig.height / 2}
            r={sizeConfig.radius}
            stroke={color}
            strokeWidth={sizeConfig.strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={arcLengthValue.interpolate({
              inputRange: [
                SPINNER_CONSTANTS.minArcLength,
                SPINNER_CONSTANTS.maxArcLength,
              ],
              outputRange: [
                `${
                  SPINNER_CONSTANTS.minArcLength *
                  Math.PI *
                  2 *
                  sizeConfig.radius
                } ${Math.PI * 2 * sizeConfig.radius}`,
                `${
                  SPINNER_CONSTANTS.maxArcLength *
                  Math.PI *
                  2 *
                  sizeConfig.radius
                } ${Math.PI * 2 * sizeConfig.radius}`,
              ],
            })}
            strokeDashoffset={0}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default Spinner;
