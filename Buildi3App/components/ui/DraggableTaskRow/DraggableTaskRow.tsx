import React from "react";
import { Platform, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import TaskRow from "../TaskRow/TaskRow";
import { DraggableTaskRowProps } from "./types";
import { styles } from "./styles";
import { useDragContext } from "../DragContext";
import { colors } from "../../../theme";

/**
 * DraggableTaskRow Component
 *
 * Wraps TaskRow with drag and drop functionality using gesture-handler + reanimated
 * - Enables drag and drop between different task sections
 * - Maintains all existing TaskRow functionality
 * - Provides visual feedback during drag operations
 * - Optimized with React.memo to prevent unnecessary re-renders
 */
const DraggableTaskRow: React.FC<DraggableTaskRowProps> = React.memo(({
  id,
  title,
  projectName,
  dueDate,
  stage = "not-started",
  isCompleted = false,
  onPress,
  onToggleComplete,
  onStageChange,
  onDragStart,
  onDragEnd,
  accessibilityLabel,
  style,
  isLastItem = false,
}) => {
  const { startDrag, endDrag, updateDragPosition } = useDragContext();
  const containerRef = React.useRef<View>(null);
  
  // Shared values for animation
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const initialPosition = useSharedValue({ x: 0, y: 0 });

  // Create payload with task data for drag operations
  const dragPayload = {
    id,
    title,
    projectName,
    dueDate,
    stage,
    isCompleted,
  };

  const handleDragStart = () => {
    try {
      // Haptic feedback on drag start (iOS only)
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      // Measure initial position for absolute coordinates
      containerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
        initialPosition.value = { x, y };
        startDrag(dragPayload, { x, y });
      });
      
      console.log(`Starting drag for task: ${title}`);
      onDragStart?.(dragPayload);
    } catch (error) {
      console.error('Error starting drag:', error);
    }
  };

  const handleDragEnd = () => {
    try {
      console.log(`Ending drag for task: ${title}`);
      endDrag();
      onDragEnd?.(dragPayload);
    } catch (error) {
      console.error('Error ending drag:', error);
    }
  };

  const updateAbsolutePosition = (translationX: number, translationY: number) => {
    const absoluteX = initialPosition.value.x + translationX;
    const absoluteY = initialPosition.value.y + translationY;
    updateDragPosition({ x: absoluteX, y: absoluteY });
  };

  // Long press + pan gesture
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.05);
      runOnJS(handleDragStart)();
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isDragging.value) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
        // Update absolute position for drop zone detection
        runOnJS(updateAbsolutePosition)(event.translationX, event.translationY);
      }
    })
    .onEnd(() => {
      if (isDragging.value) {
        isDragging.value = false;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        runOnJS(handleDragEnd)();
      }
    });

  // Compose gestures - long press must happen first, then pan
  const composedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 1000 : 1,
    elevation: isDragging.value ? 8 : 0,
    shadowOpacity: isDragging.value ? 0.25 : 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    backgroundColor: isDragging.value ? colors.background : 'transparent',
    borderRadius: 8,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View 
        ref={containerRef}
        style={[styles.draggableContainer, animatedStyle, style]}
      >
        <TaskRow
          id={id}
          title={title}
          projectName={projectName}
          dueDate={dueDate}
          stage={stage}
          isCompleted={isCompleted}
          onPress={onPress}
          onToggleComplete={onToggleComplete}
          onStageChange={onStageChange}
          accessibilityLabel={accessibilityLabel}
          isLastItem={isLastItem}
        />
      </Animated.View>
    </GestureDetector>
  );
});

DraggableTaskRow.displayName = 'DraggableTaskRow';

export default DraggableTaskRow;