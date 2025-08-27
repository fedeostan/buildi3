# UpcomingTaskWidget Component

## Overview

The UpcomingTaskWidget component is a specialized widget that displays a list of upcoming tasks with filtering capabilities. It allows users to filter tasks by different time periods and view task details.

## Design Reference

- [Figma Design](https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=43-1440&t=8IkPqWvVPo18mIw5-4)

## Features

- Displays tasks using the TaskList component
- Shows up to 5 tasks (configurable)
- Filter dropdown with "Today", "This week", "This month", and "All" options
- Empty state handling with contextual messages
- Optional "View All" button
- Bottom sheet for filter selection

## Usage

```tsx
import UpcomingTaskWidget from '../components/ui/UpcomingTaskWidget';
import { Task } from '../components/ui/TaskList/types';
import { TaskFilterPeriod } from '../components/ui/UpcomingTaskWidget/types';

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

// State management
const [filteredTasks, setFilteredTasks] = useState(tasks);
const [filterPeriod, setFilterPeriod] = useState<TaskFilterPeriod>('Today');

// Filter handler
const handleFilterChange = (period: TaskFilterPeriod) => {
  setFilterPeriod(period);
  // Apply filter logic here
  // ...
};

// Basic usage
<UpcomingTaskWidget
  tasks={filteredTasks}
  selectedPeriod={filterPeriod}
  onFilterChange={handleFilterChange}
  onTaskPress={(taskId) => navigateToTaskDetails(taskId)}
  onViewAllPress={() => navigateToAllTasks()}
/>

// Without filter
<UpcomingTaskWidget
  tasks={tasks}
  showFilter={false}
  title="All Tasks"
/>
```

## Props

| Prop           | Type                               | Required | Default          | Description                                     |
| -------------- | ---------------------------------- | -------- | ---------------- | ----------------------------------------------- |
| tasks          | Task[]                             | Yes      | []               | Array of tasks to display                       |
| selectedPeriod | TaskFilterPeriod                   | No       | "Today"          | Currently selected filter period                |
| onTaskPress    | (taskId: string) => void           | No       | -                | Function called when a task is pressed          |
| onFilterChange | (period: TaskFilterPeriod) => void | No       | -                | Function called when filter period changes      |
| onViewAllPress | () => void                         | No       | -                | Function called when View All action is pressed |
| showFilter     | boolean                            | No       | true             | Whether to show the filter dropdown             |
| title          | string                             | No       | "Upcoming Tasks" | Custom widget title                             |
| widgetProps    | Partial<WidgetProps>               | No       | -                | Additional widget props to override defaults    |
| style          | ViewStyle                          | No       | -                | Custom container styles                         |

## Design Tokens Used

- colors.actionText (filter text)
- colors.hover (selected filter background)
- colors.border (filter option dividers)
- spacing.sm (padding)
- Typography.labelMedium (filter text)
- Typography.labelLarge (filter title)
- Typography.bodyMedium (filter options)
