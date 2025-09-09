/**
 * Integration helpers to bridge existing frontend components with new Supabase backend
 * These functions help convert between database types and frontend component props
 */

import { Project, Task } from '../supabase/types'
import { TaskRowProps } from '../../components/ui/TaskRow/types';
import { ProjectItemProps } from '../../components/ui/ProjectItem/types';

/**
 * Convert database project to ProjectItem component props
 */
export const convertProjectToProjectItem = (project: Project): ProjectItemProps => {
  // Map database icon types to frontend component types
  const iconTypeMapping: { [key: string]: ProjectItemProps['projectIconType'] } = {
    'building': 'Building',
    'house': 'House', 
    'outdoors': 'Outdoors',
    'general': 'General'
  }

  // Map database icon colors to frontend component colors
  const iconColorMapping: { [key: string]: ProjectItemProps['projectIconColor'] } = {
    'blue_light': 'Blue Light',
    'green_pond': 'Green Pond',
    'pink': 'Pink',
    'orange': 'Orange',
    'purple': 'Purple',
    'red': 'Red',
    'yellow': 'Yellow'
  }

  return {
    projectName: project.name,
    projectIconType: iconTypeMapping[project.icon_type || 'general'] || 'General',
    projectIconColor: iconColorMapping[project.icon_color || 'blue_light'] || 'Blue Light',
    hasPercentage: true,
    percentage: project.progress_percentage || 0
  }
}

/**
 * Convert database task with project info to TaskRow component props
 */
export const convertTaskToTaskRow = (task: Task & { project?: { name: string } }): TaskRowProps => {
  // Map database stage to frontend stage
  const stageMapping: { [key: string]: TaskRowProps['stage'] } = {
    'not_started': 'not-started',
    'in_progress': 'in-progress',
    'completed': 'completed',
    'blocked': 'blocked'
  }

  return {
    id: task.id,
    title: task.title,
    projectName: task.project?.name || 'No Project',
    dueDate: task.dueDate ? new Date(task.dueDate as string) : new Date(),
    stage: stageMapping[task.stage || 'not_started'] || 'not-started',
    isCompleted: task.stage === 'completed'
  }
}

/**
 * Convert frontend role selection to database role
 */
export const convertFrontendRoleToDatabase = (frontendRole: string): string => {
  const roleMapping: { [key: string]: string } = {
    'manager': 'project_manager',
    'architect': 'project_manager', 
    'technician': 'foreman',
    'employee': 'worker'
  }
  
  return roleMapping[frontendRole] || frontendRole
}

/**
 * Convert database role to user-friendly display name
 */
export const convertDatabaseRoleToDisplay = (databaseRole: string): string => {
  const roleMapping: { [key: string]: string } = {
    'project_manager': 'Project Manager',
    'site_supervisor': 'Site Supervisor',
    'foreman': 'Foreman',
    'worker': 'Worker',
    'manager': 'Manager'
  }
  
  return roleMapping[databaseRole] || databaseRole
}

/**
 * Convert frontend use case to database trade specialty
 */
export const convertUseCaseToTradeSpecialty = (useCase: string): string => {
  const useCaseMapping: { [key: string]: string } = {
    'construction-general': 'general',
    'renovations': 'general',
    'demolition-rebuild': 'general',
    'small-jobs': 'general',
    'budget-quotations': 'general'
  }
  
  return useCaseMapping[useCase] || 'general'
}

/**
 * Create a mock task for testing TaskSection component with real data structure
 */
export const createMockTaskRowProps = (): TaskRowProps[] => {
  return [
    {
      id: '1',
      title: 'Install foundation forms',
      projectName: 'Residential Building',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      stage: 'not-started',
      isCompleted: false
    },
    {
      id: '2', 
      title: 'Rough electrical installation',
      projectName: 'Office Renovation',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      stage: 'in-progress',
      isCompleted: false
    },
    {
      id: '3',
      title: 'Final plumbing inspection',
      projectName: 'Residential Building', 
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (overdue)
      stage: 'blocked',
      isCompleted: false
    }
  ]
}

/**
 * Create mock project props for testing ProjectItem component with real data structure
 */
export const createMockProjectItemProps = (): ProjectItemProps[] => {
  return [
    {
      projectName: 'Residential Building',
      projectIconType: 'Building',
      projectIconColor: 'Blue Light',
      hasPercentage: true,
      percentage: 65
    },
    {
      projectName: 'Office Renovation',
      projectIconType: 'Building',
      projectIconColor: 'Green Pond',
      hasPercentage: true,
      percentage: 30
    },
    {
      projectName: 'Garden Landscaping',
      projectIconType: 'Outdoors',
      projectIconColor: 'Green Pond',
      hasPercentage: true,
      percentage: 80
    }
  ]
}

/**
 * Validate that a task object has all required fields for the frontend
 */
export const validateTaskForFrontend = (task: any): task is Task => {
  return !!(
    task &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    (task.due_date === null || typeof task.due_date === 'string') &&
    (task.stage === null || typeof task.stage === 'string')
  )
}

/**
 * Validate that a project object has all required fields for the frontend  
 */
export const validateProjectForFrontend = (project: any): project is Project => {
  return !!(
    project &&
    typeof project.id === 'string' &&
    typeof project.name === 'string' &&
    (project.icon_type === null || typeof project.icon_type === 'string') &&
    (project.icon_color === null || typeof project.icon_color === 'string') &&
    (project.progress_percentage === null || typeof project.progress_percentage === 'number')
  )
}

/**
 * Error handler for Supabase operations with user-friendly messages
 */
export const handleSupabaseError = (error: any): string => {
  if (!error) return 'An unknown error occurred'
  
  // Common Supabase/PostgreSQL errors
  if (error.code === 'PGRST116') {
    return 'No data found'
  }
  
  if (error.code === '23505') {
    return 'This item already exists'
  }
  
  if (error.code === '23503') {
    return 'Cannot delete - this item is being used elsewhere'
  }
  
  if (error.message?.includes('JWT')) {
    return 'Session expired. Please log in again.'
  }
  
  if (error.message?.includes('RLS')) {
    return 'You do not have permission to perform this action'
  }
  
  // Return the original error message if we don't have a custom one
  return error.message || 'An unexpected error occurred'
}