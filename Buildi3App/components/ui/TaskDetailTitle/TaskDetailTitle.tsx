import React, { useMemo, useState, useCallback } from "react";
import { View, Pressable } from "react-native";
import { styles } from "./styles";
import { TaskDetailTitleProps } from "./types";
import Input from "../Input";
import MenuBottomSheet from "../MenuBottomSheet";
import Tag from "../Tag";

const stageToLabel: Record<string, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
  blocked: "Blocked",
};

const stageToVariant = (stage?: string) => {
  switch (stage) {
    case "blocked":
      return "red" as const;
    case "completed":
      return "green" as const;
    case "in-progress":
      return "yellow" as const;
    case "not-started":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
};

const ALL_STAGES = [
  { id: "not-started", label: stageToLabel["not-started"] },
  { id: "in-progress", label: stageToLabel["in-progress"] },
  { id: "completed", label: stageToLabel["completed"] },
  { id: "blocked", label: stageToLabel["blocked"] },
];

const TaskDetailTitle: React.FC<TaskDetailTitleProps> = ({
  title,
  stage,
  onTitleChange,
  onTitleCommit,
  onStageSelect,
  allowedStages,
  containerStyle,
}) => {
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const sections = useMemo(() => {
    return [
      {
        title: undefined,
        options: ALL_STAGES.map((opt) => ({
          id: opt.id,
          label: opt.label,
          disabled: allowedStages && !allowedStages.includes(opt.id as any),
        })),
      },
    ];
  }, [allowedStages]);

  const handleStagePress = useCallback(() => {
    setIsSheetVisible(true);
  }, []);

  const handleDismiss = useCallback(() => setIsSheetVisible(false), []);

  const handleOptionSelect = useCallback(
    (option: { id: string }) => {
      setIsSheetVisible(false);
      if (option.id !== stage) {
        onStageSelect?.(option.id as any);
      }
    },
    [stage, onStageSelect]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        <Input
          label="Task Title"
          value={title}
          onChangeText={onTitleChange}
          onBlur={() => onTitleCommit?.(title)}
          placeholder="Enter task title"
          state={title ? "filled" : "default"}
          containerStyle={styles.titleInput}
        />

        <View style={styles.rightOverlay} pointerEvents="box-none">
          <Pressable
            onPress={handleStagePress}
            accessibilityRole="button"
            accessibilityLabel="Change task stage"
            style={styles.stagePressable}
          >
            <Tag
              variant={stageToVariant(stage)}
              text={stageToLabel[stage || "not-started"]}
            />
          </Pressable>
        </View>
      </View>

      <MenuBottomSheet
        isVisible={isSheetVisible}
        onDismiss={handleDismiss}
        onOptionSelect={handleOptionSelect as any}
        sections={sections as any}
        title="Mark as"
      />
    </View>
  );
};

export default TaskDetailTitle;
