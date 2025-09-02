import { TaskRowProps, TaskStage } from "../TaskRow/types";

// Drag payload interface - data passed during drag operations
export interface TaskDragPayload {
  id: string;
  title: string;
  projectName?: string;
  dueDate: Date;
  stage: TaskStage;
  isCompleted: boolean;
}

// Extended props for DraggableTaskRow
export interface DraggableTaskRowProps extends TaskRowProps {
  onDragStart?: (payload: TaskDragPayload) => void;
  onDragEnd?: (payload: TaskDragPayload) => void;
}

// Drop zone payload for sections
export interface SectionDropPayload {
  targetStage: TaskStage;
  sectionTitle: string;
}