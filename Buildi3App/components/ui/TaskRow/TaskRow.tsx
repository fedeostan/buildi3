import React from "react";
import { Pressable, View } from "react-native";
import { styles } from "./styles";
import { TaskRowProps } from "./types";
import { Typography } from "../Typography";
import { DateTag, getTagText } from "../Tag";
import Icon from "../Icon";
import { spacing } from "../../../theme";

/**
 * TaskRow Component
 *
 * A simplified task list item matching the Figma design system:
 * - Title on the left using Typography
 * - DateTag on the right with smart variant/text from dueDate
 * - Uses only theme tokens for spacing and colors
 */
const TaskRow: React.FC<TaskRowProps> = ({
  id,
  title,
  projectName,
  dueDate,
  isCompleted = false,
  onPress,
  onToggleComplete,
  accessibilityLabel,
  style,
  isLastItem = false,
}) => {
  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed,
          style,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel || `Task: ${title}, due ${getTagText(dueDate)}`
        }
      >
        <Pressable
          style={styles.checkButton}
          onPress={() => onToggleComplete && onToggleComplete(id, !isCompleted)}
          accessibilityRole="button"
          accessibilityLabel={
            isCompleted ? "Mark as incomplete" : "Mark as complete"
          }
        >
          <Icon
            name="check-circle"
            size="md"
            color={isCompleted ? "green10" : "textTertiary"}
            style={{ marginLeft: -spacing.xs / 4 }}
          />
        </Pressable>
        <View style={styles.content}>
          <Typography variant="bodyLarge" style={styles.title}>
            {title}
          </Typography>
          {!!projectName && (
            <Typography variant="bodyMedium" style={styles.project}>
              {projectName}
            </Typography>
          )}
        </View>
        <View style={styles.right}>
          <DateTag dueDate={dueDate} />
        </View>
      </Pressable>
      {!isLastItem && <View style={styles.divider} />}
    </View>
  );
};

export default TaskRow;
