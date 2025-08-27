# TaskItem Component

## Overview

The TaskItem component is a clickable element that displays task information in a clean, organized manner. It's used within the UpcomingTaskWidget to display individual tasks.

## Design Reference

- [Figma Design](https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=43-1180&t=8IkPqWvVPo18mIw5-4)

## Features

- Displays task title and due date
- Shows a chevron-right icon for navigation
- Provides visual feedback when pressed
- Supports different status states (completed, pending, in-progress)
- Adapts to being the last item in a list (no bottom margin)

## Usage

```tsx
import TaskItem from '../components/ui/TaskItem';

// Basic usage
<TaskItem
  id="task-123"
  title="Complete project proposal"
  dueDate={new Date('2023-06-15T14:00:00')}
  onPress={() => handleTaskPress('task-123')}
/>

// With status
<TaskItem
  id="task-456"
  title="Review code changes"
  dueDate="Tomorrow at 2:00 PM"
  status="completed"
  onPress={() => handleTaskPress('task-456')}
/>

// Last item in a list
<TaskItem
  id="task-789"
  title="Send client email"
  dueDate={new Date('2023-06-18T10:00:00')}
  isLastItem={true}
  onPress={() => handleTaskPress('task-789')}
/>
```

## Props

| Prop       | Type                                      | Required | Default   | Description                             |
| ---------- | ----------------------------------------- | -------- | --------- | --------------------------------------- |
| id         | string                                    | Yes      | -         | Unique identifier for the task          |
| title      | string                                    | Yes      | -         | Title/description of the task           |
| dueDate    | Date \| string                            | Yes      | -         | Due date of the task                    |
| status     | 'completed' \| 'pending' \| 'in-progress' | No       | 'pending' | Status of the task                      |
| onPress    | () => void                                | No       | -         | Function called when pressed            |
| isLastItem | boolean                                   | No       | false     | Whether this is the last item in a list |
| style      | ViewStyle                                 | No       | -         | Custom container styles                 |

## Design Tokens Used

- colors.widgetContentArea (background)
- colors.text (title)
- colors.textTertiary (due date)
- colors.actionText (icon)
- spacing.xs (vertical padding)
- spacing.sm (horizontal padding)
- Typography.bodyMedium (title)
- Typography.labelSmall (due date)
