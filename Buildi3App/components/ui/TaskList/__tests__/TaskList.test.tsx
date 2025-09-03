import React from 'react';
import { render } from '@testing-library/react-native';
import TaskList from '../TaskList';
import type { Task } from '../../../../lib/supabase/types';

describe('TaskList', () => {
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
    const { getByText } = render(
      <TaskList tasks={mockTasks} onTaskPress={mockOnTaskPress} />
    );

    expect(getByText('First Task')).toBeTruthy();
    expect(getByText('Second Task')).toBeTruthy();
  });

  it('renders empty state when no tasks provided', () => {
    const { getByText } = render(
      <TaskList tasks={[]} onTaskPress={mockOnTaskPress} />
    );

    expect(getByText('No upcoming tasks')).toBeTruthy();
  });

  it('renders custom empty state message', () => {
    const { getByText } = render(
      <TaskList 
        tasks={[]} 
        onTaskPress={mockOnTaskPress}
        emptyStateMessage="Custom empty message"
      />
    );

    expect(getByText('Custom empty message')).toBeTruthy();
  });

  it('limits tasks to maxTasks parameter', () => {
    const manyTasks = Array.from({ length: 10 }, (_, i) => ({
      id: `task-${i}`,
      title: `Task ${i}`,
      created_by: 'user-1',
    })) as Task[];

    const { queryByText } = render(
      <TaskList tasks={manyTasks} onTaskPress={mockOnTaskPress} maxTasks={3} />
    );

    expect(queryByText('Task 0')).toBeTruthy();
    expect(queryByText('Task 1')).toBeTruthy();
    expect(queryByText('Task 2')).toBeTruthy();
    expect(queryByText('Task 3')).toBeFalsy(); // Should not render beyond maxTasks
  });

  it('passes correct task object to TaskItem', () => {
    // This test ensures the task is passed as a single object, not spread
    const { getByText } = render(
      <TaskList tasks={[mockTasks[0]]} onTaskPress={mockOnTaskPress} />
    );

    // If TaskItem receives the task object correctly, it should render the title
    expect(getByText('First Task')).toBeTruthy();
  });

  it('handles tasks with missing properties gracefully', () => {
    const invalidTasks = [
      // Valid task
      mockTasks[0],
      // Task without id (should not cause crash due to TaskItem defensive programming)
      { title: 'No ID Task', created_by: 'user-1' } as Task,
      // Task without title (should not cause crash due to TaskItem defensive programming)
      { id: 'no-title', created_by: 'user-1' } as Task,
    ];

    // This should not crash the component
    const { getByText } = render(
      <TaskList tasks={invalidTasks} onTaskPress={mockOnTaskPress} />
    );

    // Valid task should still render
    expect(getByText('First Task')).toBeTruthy();
  });

  it('handles null/undefined tasks in array gracefully', () => {
    const tasksWithNulls = [
      mockTasks[0],
      null,
      undefined,
      mockTasks[1],
    ] as Task[];

    // This should not crash the component
    const { getByText } = render(
      <TaskList tasks={tasksWithNulls} onTaskPress={mockOnTaskPress} />
    );

    // Valid tasks should still render
    expect(getByText('First Task')).toBeTruthy();
    expect(getByText('Second Task')).toBeTruthy();
  });

  it('does not show empty state when showEmptyState is false', () => {
    const { queryByText } = render(
      <TaskList 
        tasks={[]} 
        onTaskPress={mockOnTaskPress} 
        showEmptyState={false}
      />
    );

    expect(queryByText('No upcoming tasks')).toBeFalsy();
  });
});