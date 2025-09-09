/**
 * Stage Utilities - Centralized Task Stage Management
 *
 * Provides consistent UI behavior and business logic for all task stages.
 * Solves the issue where stage-dependent UI elements (like checkmark colors)
 * don't update properly when tasks are dragged between different stages.
 *
 * Supports all 4 core database stages: not-started, in-progress, completed, blocked
 */

import { TaskStage } from '../lib/supabase/types';

// Define all available color tokens for stages
type StageColorToken = 'textTertiary' | 'primary' | 'green10' | 'red10' | 'yellow10';

// Define all available icon names for stages  
type StageIconName = 'circle' | 'play-circle' | 'check-circle' | 'alert-circle' | 'eye';

interface StageConfig {
  color: StageColorToken;
  icon: StageIconName;
  label: string;
  isActionable: boolean;
  isCompleted: boolean;
  description: string;
}

/**
 * Centralized configuration for all task stages
 * Maps each stage to its visual representation and behavior
 */
export const STAGE_CONFIG: Record<TaskStage, StageConfig> = {
  'not-started': {
    color: 'textTertiary',    // Gray - neutral/inactive state
    icon: 'circle',           // Empty circle - nothing started
    label: 'Not Started',
    isActionable: true,       // User can work on this
    isCompleted: false,
    description: 'Task has not been started yet'
  },
  'in-progress': {
    color: 'primary',         // Blue - active work state  
    icon: 'play-circle',      // Play icon - work happening
    label: 'In Progress',
    isActionable: true,       // User can continue work
    isCompleted: false,
    description: 'Task is currently being worked on'
  },
  'completed': {
    color: 'green10',         // Green - success state
    icon: 'check-circle',     // Check mark - finished
    label: 'Completed',
    isActionable: false,      // No more work needed
    isCompleted: true,
    description: 'Task has been successfully completed'
  },
  'blocked': {
    color: 'red10',           // Red - error/blocked state
    icon: 'alert-circle',     // Alert icon - needs attention
    label: 'Blocked', 
    isActionable: false,      // Cannot proceed until unblocked
    isCompleted: false,
    description: 'Task is blocked and cannot proceed'
  }
};

/**
 * Get the color token for a task stage
 * Used for icons, badges, and other stage-dependent UI elements
 */
export const getStageColor = (stage: TaskStage): StageColorToken => {
  return STAGE_CONFIG[stage]?.color ?? 'textTertiary';
};

/**
 * Get the icon name for a task stage  
 * Used for checkmarks, status indicators, and stage visualization
 */
export const getStageIcon = (stage: TaskStage): StageIconName => {
  return STAGE_CONFIG[stage]?.icon ?? 'circle';
};

/**
 * Get the human-readable label for a task stage
 * Used for UI display, accessibility labels, and user communication
 */
export const getStageLabel = (stage: TaskStage): string => {
  return STAGE_CONFIG[stage]?.label ?? 'Unknown';
};

/**
 * Check if a task stage represents completion
 * Replaces the old binary completed/not-completed logic
 */
export const isStageCompleted = (stage: TaskStage): boolean => {
  return STAGE_CONFIG[stage]?.isCompleted ?? false;
};

/**
 * Check if a task stage allows user action
 * Used to determine if task can be worked on or modified
 */
export const isStageActionable = (stage: TaskStage): boolean => {
  return STAGE_CONFIG[stage]?.isActionable ?? true;
};

/**
 * Get the description for a task stage
 * Used for tooltips, help text, and detailed explanations
 */
export const getStageDescription = (stage: TaskStage): string => {
  return STAGE_CONFIG[stage]?.description ?? 'Unknown stage';
};

/**
 * Allow free movement between all stages for maximum user flexibility
 * Users can move tasks to any stage (e.g., not-started to completed)
 * This supports real-world scenarios like correcting mistakes or handling unexpected workflow changes
 */
export const STAGE_TRANSITIONS: Record<TaskStage, TaskStage[]> = {
  'not-started': ['in-progress', 'completed', 'blocked'],
  'in-progress': ['not-started', 'completed', 'blocked'],  
  'completed': ['not-started', 'in-progress', 'blocked'],
  'blocked': ['not-started', 'in-progress', 'completed']
};

/**
 * Get valid next stages for a current stage
 * Used for stage transition validation and UI controls
 */
export const getValidTransitions = (stage: TaskStage): TaskStage[] => {
  return STAGE_TRANSITIONS[stage] ?? [];
};

/**
 * Check if a stage transition is valid
 * Used for validation before updating task stages
 */
export const isValidStageTransition = (from: TaskStage, to: TaskStage): boolean => {
  return getValidTransitions(from).includes(to);
};

/**
 * Get the next stage for toggle operations (like checkmark clicks)
 * Provides smart defaults for single-click stage changes
 */
export const getNextToggleStage = (currentStage: TaskStage): TaskStage => {
  switch (currentStage) {
    case 'completed':
      return 'not-started'; // Uncomplete -> reset to beginning
    case 'not-started':
    case 'in-progress': 
    case 'blocked':
      return 'completed'; // Mark as done
    default:
      return 'not-started';
  }
};

/**
 * Check if a stage should show progress indicators
 * Used for progress bars, completion percentages, etc.
 */
export const shouldShowProgress = (stage: TaskStage): boolean => {
  return stage === 'in-progress';
};

/**
 * Get stage priority for sorting/filtering
 * Lower numbers = higher priority for display
 */
export const getStagePriority = (stage: TaskStage): number => {
  const priorities: Record<TaskStage, number> = {
    'blocked': 1,           // Highest priority - needs immediate attention
    'in-progress': 2,       // Second - active work  
    'not-started': 3,       // Third - ready to start
    'completed': 4          // Lowest priority - done
  };
  return priorities[stage] ?? 999;
};

/**
 * Utility function to get all available stages
 * Used for dropdowns, filters, and validation
 */
export const getAllStages = (): TaskStage[] => {
  return Object.keys(STAGE_CONFIG) as TaskStage[];
};

/**
 * Check if a stage represents active work
 * Used for filtering and work assignment logic
 */
export const isActiveStage = (stage: TaskStage): boolean => {
  return stage === 'in-progress' || stage === 'not-started';
};

/**
 * Check if a stage represents a terminal state
 * Used for workflow completion detection
 */
export const isTerminalStage = (stage: TaskStage): boolean => {
  return stage === 'completed';
};

/**
 * Check if a stage represents a blocked/waiting state  
 * Used for bottleneck analysis and workflow optimization
 */
export const isWaitingStage = (stage: TaskStage): boolean => {
  return stage === 'blocked';
};