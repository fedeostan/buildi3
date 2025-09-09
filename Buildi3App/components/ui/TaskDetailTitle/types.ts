import { ViewStyle } from "react-native";
import { TaskStage } from "../../../lib/supabase/types";

export interface TaskDetailTitleProps {
  /** Current task title */
  title: string;
  /** Current task stage */
  stage?: TaskStage | null;
  /** Allowed stage transitions */
  allowedStages?: TaskStage[];
  /** Title change handler (uncommitted) */
  onTitleChange?: (text: string) => void;
  /** Commit title change on blur */
  onTitleCommit?: (text: string) => void;
  /** Stage selection handler */
  onStageSelect?: (stage: TaskStage) => void;
  /** Optional style */
  containerStyle?: ViewStyle;
}
