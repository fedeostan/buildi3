// Typography system
export { default as Typography } from "./Typography";

// Icon system
export { default as Icon } from "./Icon";

// Button system
export { default as Button } from "./Button";

// Profile & Notification atoms (Atomic Design)
export { default as ProfileIcon } from "./ProfileIcon";
export { default as NotificationIcon } from "./NotificationIcon";

// Dashboard organism (Atomic Design)
export { default as DashboardHeader } from "./DashboardHeader";

// Navigation organism (Atomic Design)
export { default as TopNavigationBar } from "./TopNavigationBar";

// Widget system (Atomic Design - Molecules & Organisms)
export { default as WidgetTitle } from "./WidgetTitle";
export { default as SwapItem } from "./SwapItem";
export { default as Widget } from "./Widget";
export { default as NextTaskContainer } from "./NextTaskContainer";
export { default as NextTaskWidget } from "./NextTaskWidget";
export { default as ProjectItem } from "./ProjectItem";
export { default as ProjectList } from "./ProjectList";
export { default as ProjectWidget } from "./ProjectWidget";
export { default as TaskItem } from "./TaskItem";
export { default as TaskList } from "./TaskList";
export { default as UpcomingTaskWidget } from "./UpcomingTaskWidget";
export { default as TaskRow } from "./TaskRow";
export type { TaskRowProps } from "./TaskRow";
export { default as DraggableTaskRow } from "./DraggableTaskRow";
export type { DraggableTaskRowProps, TaskDragPayload, SectionDropPayload } from "./DraggableTaskRow";
export { DragProvider, useDragContext } from "./DragContext";

// Input system (React Native best practices with Figma design)
export { default as Input } from "./Input";
export { default as TextArea } from "./TextArea";
export { default as Dropdown } from "./Dropdown";

// Control system (Interactive components)
export { default as SegmentedControl } from "./SegmentedControl";

// Loading system (Feedback components)
export { default as Spinner } from "./Spinner";

// Bottom Sheet components
export { default as BottomSheetTopBar } from "./BottomSheetTopBar";
export { default as PhotosGrid } from "./PhotosGrid";
export { default as FilesView } from "./FilesView";
export { default as ImagePreview } from "./ImagePreview";
export { default as MediaUploadBottomSheet } from "./MediaUploadBottomSheet";

// Navigation components (Atomic Design - Organisms)
export { default as BottomTabBar } from "./BottomTabBar";
export type { BottomTabBarProps, TabBarItem } from "./BottomTabBar";

// Menu components (Atomic Design - Atoms & Organisms)
export { default as MenuButton } from "./MenuButton";
export { default as MenuBottomSheet } from "./MenuBottomSheet";
export { default as GeneralHeader } from "./GeneralHeader";
export type { MenuButtonProps } from "./MenuButton";
export type {
  MenuOption,
  MenuSection,
  MenuBottomSheetProps,
} from "./MenuBottomSheet";
export type { GeneralHeaderProps } from "./GeneralHeader";

// Task Section component (Atomic Design - Organism)
export { default as TaskSection } from "./TaskSection";
export type { TaskSectionProps } from "./TaskSection";

// Task Actions Bottom Sheet (Atomic Design - Organism)
export { default as TaskActionsBottomSheet } from "./TaskActionsBottomSheet";
export type { TaskActionsBottomSheetProps, TaskAction } from "./TaskActionsBottomSheet";

// Note: Import types directly from component folders when needed:
// import type { TypographyProps } from './components/ui/Typography';
// import type { ButtonProps } from './components/ui/Button';
// import type { IconProps } from './components/ui/Icon';
// import type { ProfileIconProps } from './components/ui/ProfileIcon';
// import type { NotificationIconProps } from './components/ui/NotificationIcon';
// import type { DashboardHeaderProps } from './components/ui/DashboardHeader';
// import type { TopNavigationBarProps, NavigationAction } from './components/ui/TopNavigationBar';
