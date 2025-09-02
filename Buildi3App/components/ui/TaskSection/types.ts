import { ViewStyle } from "react-native";
import { TaskRowProps, TaskStage } from "../TaskRow/types";
import { TaskDragPayload } from "../DraggableTaskRow/types";

export interface TaskSectionProps {
  /** Section title/stage name */
  title: string;
  /** Task stage this section represents */
  stage: TaskStage;
  /** Array of tasks in this section */
  tasks: (TaskRowProps & { stage: TaskStage })[];
  /** Whether section is expanded */
  isExpanded: boolean;
  /** Toggle expansion handler */
  onToggleExpanded: (stage: TaskStage) => void;
  /** Task press handler */
  onTaskPress: (task: TaskRowProps & { stage: TaskStage }) => void;
  /** Task stage change handler */
  onTaskStageChange: (taskId: string, newStage: TaskStage) => void;
  /** Task completion toggle handler (legacy support) */
  onTaskToggleComplete?: (taskId: string, completed: boolean) => void;
  /** Drag start handler */
  onDragStart?: (payload: TaskDragPayload) => void;
  /** Drag end handler */
  onDragEnd?: (payload: TaskDragPayload) => void;
  /** Handle task drop into this section */
  onTaskDrop?: (draggedTask: TaskDragPayload, targetStage: TaskStage) => void;
  /** Optional container style */
  style?: ViewStyle;
}