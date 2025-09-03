import React from 'react';
import { render } from '@testing-library/react-native';
import TaskItem from '../TaskItem';
import type { Task } from '../../../../lib/supabase/types';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: 'test-task-1',
    title: 'Test Task Title',
    description: 'Test task description',
    dueDate: new Date('2024-01-01T12:00:00Z'),
    isCompleted: false,
    priority: 'medium',
    created_by: 'user-1',
  };

  const mockOnTaskPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console errors in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly with valid task data', () => {
    const { getByText } = render(
      <TaskItem task={mockTask} onTaskPress={mockOnTaskPress} />
    );

    expect(getByText('Test Task Title')).toBeTruthy();
  });

  it('handles undefined task prop gracefully', () => {
    const { container } = render(
      // @ts-expect-error - Testing invalid prop for error handling
      <TaskItem task={undefined} onTaskPress={mockOnTaskPress} />
    );

    // Component should return null and log error
    expect(container.children).toHaveLength(0);
    expect(console.error).toHaveBeenCalledWith(
      'TaskItem: task prop is undefined. Component will not render.'
    );
  });

  it('handles task without required id property', () => {
    const invalidTask = { ...mockTask, id: undefined } as any;
    
    const { container } = render(
      <TaskItem task={invalidTask} onTaskPress={mockOnTaskPress} />
    );

    expect(container.children).toHaveLength(0);
    expect(console.error).toHaveBeenCalledWith(
      'TaskItem: task missing required properties (id, title):',
      invalidTask
    );
  });

  it('handles task without required title property', () => {
    const invalidTask = { ...mockTask, title: undefined } as any;
    
    const { container } = render(
      <TaskItem task={invalidTask} onTaskPress={mockOnTaskPress} />
    );

    expect(container.children).toHaveLength(0);
    expect(console.error).toHaveBeenCalledWith(
      'TaskItem: task missing required properties (id, title):',
      invalidTask
    );
  });

  it('handles task with empty string id', () => {
    const invalidTask = { ...mockTask, id: '' } as any;
    
    const { container } = render(
      <TaskItem task={invalidTask} onTaskPress={mockOnTaskPress} />
    );

    expect(container.children).toHaveLength(0);
    expect(console.error).toHaveBeenCalledWith(
      'TaskItem: task missing required properties (id, title):',
      invalidTask
    );
  });

  it('handles task with empty string title', () => {
    const invalidTask = { ...mockTask, title: '' } as any;
    
    const { container } = render(
      <TaskItem task={invalidTask} onTaskPress={mockOnTaskPress} />
    );

    expect(container.children).toHaveLength(0);
    expect(console.error).toHaveBeenCalledWith(
      'TaskItem: task missing required properties (id, title):',
      invalidTask
    );
  });

  it('renders correctly with null dueDate', () => {
    const taskWithNullDate = { ...mockTask, dueDate: null };
    
    const { getByText } = render(
      <TaskItem task={taskWithNullDate} onTaskPress={mockOnTaskPress} />
    );

    expect(getByText('Test Task Title')).toBeTruthy();
    expect(getByText('No date')).toBeTruthy();
  });

  it('renders correctly with undefined dueDate', () => {
    const taskWithUndefinedDate = { ...mockTask, dueDate: undefined };
    
    const { getByText } = render(
      <TaskItem task={taskWithUndefinedDate} onTaskPress={mockOnTaskPress} />
    );

    expect(getByText('Test Task Title')).toBeTruthy();
    expect(getByText('No date')).toBeTruthy();
  });
});