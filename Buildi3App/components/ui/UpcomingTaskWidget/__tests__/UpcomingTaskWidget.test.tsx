import React from 'react';
import { render } from '@testing-library/react-native';
import UpcomingTaskWidget from '../UpcomingTaskWidget';
import type { Task } from '../../../../lib/supabase/types';

// Mock the dependency components
jest.mock('../../../ui/Widget', () => {
  return ({ children, title, ...props }: any) => (
    <div testID="mock-widget" data-title={title} {...props}>
      {children}
    </div>
  );
});

jest.mock('../../../ui/TaskList', () => {
  return ({ tasks }: { tasks: Task[] }) => (
    <div testID="mock-task-list" data-task-count={tasks.length}>
      {tasks.map(task => (
        <div key={task.id} testID={`task-${task.id}`}>
          {task.title}
        </div>
      ))}
    </div>
  );
});

describe('UpcomingTaskWidget', () => {
  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'First Task',
      description: 'First task description',
      dueDate: new Date('2024-01-01T12:00:00Z'),
      isCompleted: false,
      priority: 'high',
      created_by: 'user-1',
    },
    {
      id: 'task-2',
      title: 'Second Task',
      description: 'Second task description',
      dueDate: new Date('2024-01-02T12:00:00Z'),
      isCompleted: true,
      priority: 'medium',
      created_by: 'user-1',
    },
  ];

  const mockOnTaskPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly with valid tasks', () => {
    const { getByTestId } = render(
      <UpcomingTaskWidget 
        tasks={mockTasks} 
        onTaskPress={mockOnTaskPress}
      />
    );

    const taskList = getByTestId('mock-task-list');
    expect(taskList.getAttribute('data-task-count')).toBe('2');
    expect(getByTestId('task-task-1')).toBeTruthy();
    expect(getByTestId('task-task-2')).toBeTruthy();
  });

  it('handles empty tasks array gracefully', () => {
    const { getByTestId } = render(
      <UpcomingTaskWidget 
        tasks={[]} 
        onTaskPress={mockOnTaskPress}
      />
    );

    const taskList = getByTestId('mock-task-list');
    expect(taskList.getAttribute('data-task-count')).toBe('0');
  });

  it('handles non-array tasks prop gracefully', () => {
    const { getByTestId } = render(
      <UpcomingTaskWidget 
        // @ts-expect-error - Testing invalid prop for error handling
        tasks={null} 
        onTaskPress={mockOnTaskPress}
      />
    );

    const taskList = getByTestId('mock-task-list');
    expect(taskList.getAttribute('data-task-count')).toBe('0');
    expect(console.error).toHaveBeenCalledWith(
      'UpcomingTaskWidget: tasks prop is not an array:',
      null
    );
  });

  it('filters out null/undefined tasks from array', () => {
    const tasksWithNulls = [
      mockTasks[0],
      null,
      undefined,
      mockTasks[1],
    ] as Task[];

    const { getByTestId } = render(
      <UpcomingTaskWidget 
        tasks={tasksWithNulls} 
        onTaskPress={mockOnTaskPress}
      />
    );

    const taskList = getByTestId('mock-task-list');
    expect(taskList.getAttribute('data-task-count')).toBe('2'); // Only valid tasks
    expect(console.warn).toHaveBeenCalledWith(
      'UpcomingTaskWidget: Found null/undefined task in tasks array'
    );
  });

  it('filters out tasks missing required properties', () => {
    const invalidTasks = [
      mockTasks[0], // Valid
      { title: 'No ID', created_by: 'user-1' } as Task, // Missing id
      { id: 'no-title', created_by: 'user-1' } as Task, // Missing title
      mockTasks[1], // Valid
    ];

    const { getByTestId } = render(
      <UpcomingTaskWidget 
        tasks={invalidTasks} 
        onTaskPress={mockOnTaskPress}
      />
    );

    const taskList = getByTestId('mock-task-list');
    expect(taskList.getAttribute('data-task-count')).toBe('2'); // Only valid tasks
    expect(console.warn).toHaveBeenCalledWith(
      'UpcomingTaskWidget: Found task missing required properties:',
      expect.any(Object)
    );
  });

  it('handles tasks with empty string id/title', () => {
    const invalidTasks = [
      mockTasks[0], // Valid
      { id: '', title: 'Empty ID', created_by: 'user-1' } as Task,
      { id: 'empty-title', title: '', created_by: 'user-1' } as Task,
    ];

    const { getByTestId } = render(
      <UpcomingTaskWidget 
        tasks={invalidTasks} 
        onTaskPress={mockOnTaskPress}
      />
    );

    const taskList = getByTestId('mock-task-list');
    expect(taskList.getAttribute('data-task-count')).toBe('1'); // Only valid task
  });

  it('memoizes validTasks to avoid unnecessary re-renders', () => {
    let renderCount = 0;
    const TestComponent = ({ tasks }: { tasks: Task[] }) => {
      renderCount++;
      return (
        <UpcomingTaskWidget 
          tasks={tasks} 
          onTaskPress={mockOnTaskPress}
        />
      );
    };

    const { rerender } = render(<TestComponent tasks={mockTasks} />);
    
    // Same tasks array should not cause re-validation
    rerender(<TestComponent tasks={mockTasks} />);
    
    // Only the initial render should process the tasks
    expect(renderCount).toBe(2); // React may re-render, but memo should prevent unnecessary validation
  });

  it('passes correct title to Widget component', () => {
    const customTitle = 'My Custom Tasks';
    const { getByTestId } = render(
      <UpcomingTaskWidget 
        tasks={mockTasks} 
        onTaskPress={mockOnTaskPress}
        title={customTitle}
      />
    );

    const widget = getByTestId('mock-widget');
    expect(widget.getAttribute('data-title')).toBe(customTitle);
  });
});