import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import { Tables, Task, TaskStage, TypeConverters } from '../lib/supabase/types'
import { TaskRowProps } from '../components/ui/TaskRow/types'
import { useAuth } from './useAuth'

// Database task type for internal use
type DbTask = Tables<'tasks'>

interface UseTasksOptions {
  projectId?: string
  assignedTo?: string
  stage?: string
  includeCompleted?: boolean
  orderBy?: 'title' | 'due_date' | 'created_at' | 'priority'
  orderDirection?: 'asc' | 'desc'
}

export const useTasks = (options: UseTasksOptions = {}) => {
  const { user, profile } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    projectId,
    assignedTo,
    stage,
    includeCompleted = true,
    orderBy = 'due_date',
    orderDirection = 'asc'
  } = options

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    fetchTasks()

    // Set up real-time subscription for task changes
    const subscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: projectId ? `project_id=eq.${projectId}` : undefined
      }, (payload) => {
        handleTaskChange(payload)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, projectId, assignedTo, stage, includeCompleted, orderBy, orderDirection])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('tasks')
        .select(`
          *,
          project:projects(name),
          assigned_user:profiles!tasks_assigned_to_fkey(first_name, last_name),
          created_user:profiles!tasks_created_by_fkey(first_name, last_name)
        `)

      // Apply filters based on user role and options
      if (profile?.role === 'worker') {
        // Workers only see tasks assigned to them
        query = query.eq('assigned_to', user!.id)
      } else if (profile?.role === 'foreman') {
        // Foremen see tasks assigned to them or created by them
        query = query.or(`assigned_to.eq.${user!.id},created_by.eq.${user!.id}`)
      }
      // Managers and supervisors see all tasks (filtered by project if specified)

      // Apply additional filters
      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      if (assignedTo) {
        query = query.eq('assigned_to', assignedTo)
      }

      if (stage) {
        query = query.eq('stage', stage)
      }

      if (!includeCompleted) {
        query = query.neq('stage', 'completed')
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })

      const { data, error: queryError } = await query

      if (queryError) {
        throw queryError
      }

      // Convert database tasks to frontend tasks
      const frontendTasks = data.map(dbTask => TypeConverters.taskFromDatabase(dbTask))
      setTasks(frontendTasks)
    } catch (err: any) {
      console.error('Error fetching tasks:', err)
      setError(err.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskChange = (payload: any) => {
    const { eventType, new: newTask, old: oldTask } = payload

    switch (eventType) {
      case 'INSERT':
        const newFrontendTask = TypeConverters.taskFromDatabase(newTask)
        setTasks(prev => [newFrontendTask, ...prev])
        break
      case 'UPDATE':
        const updatedFrontendTask = TypeConverters.taskFromDatabase(newTask)
        setTasks(prev => prev.map(task => 
          task.id === newTask.id ? updatedFrontendTask : task
        ))
        break
      case 'DELETE':
        setTasks(prev => prev.filter(task => task.id !== oldTask.id))
        break
    }
  }

  const createTask = async (taskData: {
    title: string
    description?: string
    project_id?: string
    assigned_to?: string
    due_date?: string
    priority?: string
    trade_required?: string
    weather_dependent?: boolean
    estimated_hours?: number
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to create tasks')
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          created_by: user.id,
          stage: 'not-started',
          status: 'todo', // For backward compatibility
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Log activity
      await supabase
        .from('activity_log')
        .insert({
          user_id: user.id,
          activity_type: 'task_created',
          description: `Created task: ${taskData.title}`,
          related_task_id: data.id,
          related_project_id: taskData.project_id,
        })

      return { task: TypeConverters.taskFromDatabase(data), error: null }
    } catch (err: any) {
      console.error('Error creating task:', err)
      return { task: null, error: err.message || 'Failed to create task' }
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Update status for backward compatibility
      if (updates.stage) {
        const statusMapping: { [key: string]: string } = {
          'not-started': 'todo',
          'in-progress': 'in_progress',
          'completed': 'completed',
          'blocked': 'todo',
          'under-inspection': 'in_progress'
        }
        updates.status = statusMapping[updates.stage]
      }

      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Log activity for significant updates
      if (updates.stage || updates.assigned_to) {
        const activityType = updates.stage ? 'task_status_updated' : 'task_assigned'
        const description = updates.stage 
          ? `Task status changed to ${updates.stage}` 
          : 'Task assignment updated'

        await supabase
          .from('activity_log')
          .insert({
            user_id: user!.id,
            activity_type: activityType,
            description,
            related_task_id: taskId,
            related_project_id: data.project_id,
          })
      }

      return { task: TypeConverters.taskFromDatabase(data), error: null }
    } catch (err: any) {
      console.error('Error updating task:', err)
      return { task: null, error: err.message || 'Failed to update task' }
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) {
        throw error
      }

      return { error: null }
    } catch (err: any) {
      console.error('Error deleting task:', err)
      return { error: err.message || 'Failed to delete task' }
    }
  }

  const assignTask = async (taskId: string, userId: string) => {
    return updateTask(taskId, { assigned_to: userId })
  }

  const updateTaskStage = async (taskId: string, newStage: TaskStage) => {
    return updateTask(taskId, { stage: newStage })
  }

  const refreshTasks = () => {
    fetchTasks()
  }

  // Convert unified tasks to TaskRowProps format for UI components
  const getTasksForUI = (): TaskRowProps[] => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      projectName: (task as any).project?.name || 'No Project',
      dueDate: typeof task.dueDate === 'string' ? new Date(task.dueDate) : task.dueDate || new Date(),
      stage: (task.stage as TaskStage) || 'not-started',
      isCompleted: task.isCompleted || false
    }))
  }

  // Group tasks by stage for TaskSection component
  const getTasksByStage = () => {
    const tasksByStage: Record<TaskStage, TaskRowProps[]> = {
      'not-started': [],
      'in-progress': [],
      'completed': [],
      'blocked': []
    }

    const uiTasks = getTasksForUI()
    
    uiTasks.forEach(task => {
      if (task.stage && tasksByStage[task.stage]) {
        tasksByStage[task.stage].push(task)
      }
    })

    return tasksByStage
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    updateTaskStage,
    refreshTasks,
    // UI helper methods
    getTasksForUI,
    getTasksByStage,
  }
}

// Hook for getting a single task by ID
export const useTask = (taskId: string | null) => {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!taskId) {
      setTask(null)
      setLoading(false)
      return
    }

    fetchTask()
  }, [taskId])

  const fetchTask = async () => {
    if (!taskId) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(name, icon_type, icon_color),
          assigned_user:profiles!tasks_assigned_to_fkey(first_name, last_name, trade_specialty),
          created_user:profiles!tasks_created_by_fkey(first_name, last_name)
        `)
        .eq('id', taskId)
        .single()

      if (queryError) {
        throw queryError
      }

      setTask(TypeConverters.taskFromDatabase(data))
    } catch (err: any) {
      console.error('Error fetching task:', err)
      setError(err.message || 'Failed to fetch task')
      setTask(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshTask = () => {
    fetchTask()
  }

  return {
    task,
    loading,
    error,
    refreshTask,
  }
}