import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Typography, Spinner } from "../components/ui";
import { colors, spacing } from "../theme";

/**
 * Loading Quote AI Thinking Screen - Shows AI Processing Feedback
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=58-441
 *
 * Purpose:
 * - Provides visual feedback that AI is processing the uploaded quote/image
 * - Shows animated thinking state with spinner and dynamic text
 * - Bridges user between quote preview and final project creation
 * - Placeholder for future AI thinking process integration
 *
 * Features:
 * - Animated dots in title (nothing → . → .. → ... → nothing, repeating)
 * - Large spinner animation using existing Spinner component
 * - Typography matching exact Figma specifications
 * - 10-second timer before navigation to home
 * - Future-ready for AI thinking process display
 * - Exact Figma layout with proper spacing and colors
 *
 * Layout (exact from Figma):
 * - Background: #F2F3F7 (colors.background)
 * - Column layout, center aligned
 * - 32px gap between elements
 * - 32px top/bottom padding, 16px left/right padding
 * - Spinner: 70x70px, primary color
 * - Title: Montserrat 600, 20px, animated dots
 * - Body: Inter 400, 16px, placeholder for AI thoughts
 *
 * Future Integration Notes:
 * - Replace mockAIThoughts with real AI thinking process stream
 * - Connect to AI service that processes uploaded images/quotes
 * - Stream thinking steps in real-time to body text
 * - Handle AI processing errors gracefully
 * - Add retry mechanism if AI processing fails
 */

export default function LoadingQuoteAIThinkingScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Animation state for title dots
  const [dotsCount, setDotsCount] = useState(0); // 0 = no dots, 1-3 = number of dots

  // AI thinking process state (future enhancement)
  const [currentAIThought, setCurrentAIThought] = useState(
    "Analyzing your uploaded content..."
  );

  // Fade animation for body text
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Get user data passed from previous screens
  const userEmail = (params.email as string) || "";
  const verificationCode = (params.code as string) || "";
  const firstName = (params.firstName as string) || "";
  const lastName = (params.lastName as string) || "";
  const role = (params.role as string) || "";
  const useCase = (params.useCase as string) || "";
  const jobDescription = (params.jobDescription as string) || "";
  const mediaUri = params.mediaUri as string;
  const mediaType = params.mediaType as string;
  const mediaId = params.mediaId as string;
  const mediaFilename = params.mediaFilename as string;

  // Mock AI thinking process steps (replace with real AI integration)
  const mockAIThoughts = [
    "Analyzing your uploaded content...",
    "Reading text and extracting key information...",
    "Identifying project requirements and scope...",
    "Generating task breakdown structure...",
    "Setting up project timeline and milestones...",
    "Creating initial project framework...",
    "Finalizing project setup...",
  ];

  /**
   * Animated dots effect for title
   * Cycles through: "" → "." → ".." → "..." → "" (repeat)
   * Updates every 500ms for smooth animation
   */
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDotsCount((prev) => (prev + 1) % 4); // 0, 1, 2, 3, 0, 1, 2, 3...
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  /**
   * Mock AI thinking process simulation with fade animation
   * Cycles through different thinking steps every 2.5 seconds (allows time for fade)
   * TODO: Replace with real AI thinking process stream
   */
  useEffect(() => {
    let thoughtIndex = 0;

    const fadeAndChangeText = () => {
      // Fade out current text
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Change text when fully faded out
        thoughtIndex = (thoughtIndex + 1) % mockAIThoughts.length;
        setCurrentAIThought(mockAIThoughts[thoughtIndex]);

        // Fade in new text
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    };

    // Start the cycle after initial delay
    const thoughtInterval = setInterval(fadeAndChangeText, 2500);

    return () => clearInterval(thoughtInterval);
  }, [fadeAnim]);

  /**
   * Auto-navigation timer
   * Navigate to home screen after 10 seconds
   * TODO: Replace with actual AI processing completion
   */
  useEffect(() => {
    const navigationTimer = setTimeout(() => {
      console.log(
        "AI thinking complete, navigating to home with project data:",
        {
          email: userEmail,
          verificationCode,
          firstName,
          lastName,
          role,
          useCase,
          jobDescription,
          setupMethod: "ai_upload",
          selectedMedia: {
            uri: mediaUri,
            type: mediaType,
            id: mediaId,
            filename: mediaFilename,
          },
        }
      );

      // Navigate to home screen
      router.push("/home");
    }, 10000); // 10 seconds

    return () => clearTimeout(navigationTimer);
  }, []);

  // Generate animated dots string
  const getDots = (count: number): string => {
    return ".".repeat(count);
  };

  // Calculate dynamic padding based on Figma design
  const dynamicStyles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.sm, // 16px horizontal padding from Figma
      paddingTop: Math.max(insets.top, 20) + spacing.lg, // Safe area + 32px base padding
      paddingBottom: Math.max(insets.bottom, 20) + spacing.lg, // Safe area + 32px base padding
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Main Content Container - Column layout with center alignment */}
      <View style={styles.contentContainer}>
        {/* Spinner - Large size matching Figma (70x70px) */}
        <Spinner
          size="large"
          color={colors.buttonPrimary} // #495D92 from Figma
          animating={true}
          accessibilityLabel="AI processing your content"
        />

        {/* Text Container - Title and Body with proper gap */}
        <View style={styles.textContainer}>
          {/* Title with Fixed Width and Animated Dots */}
          <View style={styles.titleContainer}>
            <Typography variant="h3" style={styles.title}>
              Wait we are doing magic{getDots(dotsCount)}
            </Typography>
          </View>

          {/* Body Text - AI Thinking Process with Fade Animation */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Typography variant="bodyLarge" style={styles.bodyText}>
              {currentAIThought}
            </Typography>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // #F2F3F7 from Figma
  },

  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg, // 32px gap between spinner and text container from Figma
  },

  textContainer: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between title and body from Figma
  },

  titleContainer: {
    alignSelf: "center",
    // Fixed width to accommodate full text "Wait we are doing magic..."
    // This prevents the text from shifting when dots animate
    minWidth: 280, // Approximate width for full text with 3 dots
    alignItems: "flex-start", // Left-align text within the fixed container
  },

  title: {
    color: colors.text, // #001848 from Figma
    textAlign: "left", // Left-align within the fixed container
    // Figma specs: Montserrat 600, 20px - matches h3 variant exactly
  },

  bodyText: {
    color: colors.textSubtitle, // #646466 from Figma
    textAlign: "center",
    // Figma specs: Inter 400, 16px - matches bodyLarge variant exactly
  },
});
