export interface TaskAction {
  /** Unique action identifier */
  id: string;
  /** Display label */
  label: string;
  /** Feather icon name */
  icon: string;
  /** Whether this is a destructive action (shows in red) */
  destructive?: boolean;
  /** Whether action is disabled */
  disabled?: boolean;
}

export interface TaskActionsBottomSheetProps {
  /** Whether the bottom sheet is visible */
  isVisible: boolean;
  /** Close handler */
  onClose: () => void;
  /** Action selection handler */
  onActionSelect: (actionId: string) => void;
  /** Task ID for context */
  taskId?: string;
}