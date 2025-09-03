# TaskItem Component - 1:1 Figma Implementation

## Overview

The TaskItem component is a clickable element that displays task information with perfect Figma design system compliance. Enhanced with proper Typography variants, completion status indicators, and consistent design token usage.

## Design Reference

- [Figma Design](https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=43-1180&t=RR70TF6y3NyuIflv-4)

## Features

- **Status Indicator**: 4px left border showing completion state (gray/green)
- **Dash Variant**: Left dash uses Tag variant alpha backgrounds (red/yellow/green) based on due date
- **Enhanced Typography**: Uses bodyLarge for title, bodyMedium for due label/value
- **Smart Date Formatting**: Today/Tomorrow/Yesterday with time display
- **Visual States**: Proper completed state with strikethrough and opacity
- **Navigation**: Chevron-right icon for task navigation
- **Accessibility**: Comprehensive screen reader support
- **Press Feedback**: Scale animation on interaction

## Usage

```tsx
import { TaskItem } from '@/components/ui';

// Basic usage with Task object
<TaskItem
  task={{
    id: "task-123",
    title: "Complete project proposal",
    dueDate: new Date('2023-06-15T14:00:00'),
    isCompleted: false
  }}
  onTaskPress={(task) => handleTaskNavigation(task)}
/>

// Completed task
<TaskItem
  task={{
    id: "task-456",
    title: "Review code changes",
    dueDate: new Date('2023-06-16T14:00:00'),
    isCompleted: true
  }}
  onTaskPress={(task) => handleTaskNavigation(task)}
/>

// With completion toggle
<TaskItem
  task={taskData}
  onTaskPress={(task) => router.push(`/task/${task.id}`)}
  onToggleComplete={(taskId) => updateTaskCompletion(taskId)}
/>
```

## Props

| Prop               | Type                     | Required | Description                                      |
| ------------------ | ------------------------ | -------- | ------------------------------------------------ |
| task               | Task                     | Yes      | Task object with id, title, dueDate, isCompleted |
| onTaskPress        | (task: Task) => void     | No       | Function called when task is pressed             |
| onToggleComplete   | (taskId: string) => void | No       | Function called to toggle completion             |
| onTaskLongPress    | (task: Task) => void     | No       | Function called on long press for drag           |
| isDragging         | boolean                  | No       | Whether task is being dragged                    |
| showDragHandle     | boolean                  | No       | Whether to show drag handle                      |
| style              | ViewStyle                | No       | Custom container styles                          |
| accessibilityLabel | string                   | No       | Custom accessibility label                       |

## Enhanced Design Tokens Used

- **Backgrounds**: `colors.backgroundSecondary` (white card)
- **Status Indicator**: `colors.border` (inactive), `colors.success` (completed)
- **Typography**: `colors.text` (title), `colors.textSecondary` (description)
- **Layout**: `spacing.sm` (16px padding), `spacing.xs` (8px margins)
- **Typography Variants**: `bodyLarge` (title), `bodyMedium` (description)
- **Icons**: `actionText` color for chevron-right
- **Due Row**: `Due:` label + value in a row with 4px gap
- **Background**: `colors.widgetContentArea` with `borderRadius: 16`
- **Icon**: Chevron size 24 (`size="lg"`) with `colors.textSubtitle`
- **Dash Colors**: `colors.redAlpha10`, `colors.yellowAlpha10`, `colors.greenAlpha10`
