# TaskList Component

## Overview

The TaskList component displays a collection of tasks using individual TaskItem components. It's designed to handle various states including empty lists and limiting the maximum number of displayed tasks.

## Design Reference

- [Figma Design](https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=43-1237&t=8IkPqWvVPo18mIw5-4)

## Features

- Renders a configurable number of TaskItem components
- Handles empty state with customizable message
- Limits displayed tasks to a maximum number (default: 5)
- Passes the correct `isLastItem` prop to each TaskItem

## Usage

```tsx
import TaskList from '../components/ui/TaskList';
import { Task } from '../components/ui/TaskList/types';

// Sample task data
const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete project proposal',
    dueDate: new Date('2023-06-15T14:00:00'),
    status: 'pending'
  },
  {
    id: 'task-2',
    title: 'Review design mockups',
    dueDate: 'Tomorrow at 3:00 PM',
    status: 'pending'
  }
];

// Basic usage
<TaskList
  tasks={tasks}
  onTaskPress={(taskId) => console.log('Task pressed:', taskId)}
/>

// With maximum limit
<TaskList
  tasks={tasks}
  maxTasks={3}
  onTaskPress={handleTaskPress}
/>

// Custom empty state
<TaskList
  tasks={[]}
  emptyStateMessage="You're all caught up!"
  showEmptyState={true}
/>
```

## Props

| Prop              | Type                     | Required | Default             | Description                               |
| ----------------- | ------------------------ | -------- | ------------------- | ----------------------------------------- |
| tasks             | Task[]                   | Yes      | -                   | Array of tasks to display                 |
| onTaskPress       | (taskId: string) => void | No       | -                   | Function called when a task is pressed    |
| maxTasks          | number                   | No       | 5                   | Maximum number of tasks to display        |
| style             | ViewStyle                | No       | -                   | Custom container styles                   |
| showEmptyState    | boolean                  | No       | true                | Whether to show empty state when no tasks |
| emptyStateMessage | string                   | No       | "No upcoming tasks" | Custom empty state message                |

## Design Tokens Used

- colors.widgetContentArea (empty state background)
- colors.textTertiary (empty state text)
- spacing.sm (padding)
- Typography.bodyMedium (empty state text)
