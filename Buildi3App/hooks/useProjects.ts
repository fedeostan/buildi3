import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import { Tables } from '../lib/supabase/types'
import { useAuth } from './useAuth'

// Type alias for convenience
type Project = Tables<'projects'>

interface UseProjectsOptions {
  includeCompleted?: boolean
  orderBy?: 'name' | 'created_at' | 'updated_at' | 'progress_percentage'
  orderDirection?: 'asc' | 'desc'
}

export const useProjects = (options: UseProjectsOptions = {}) => {
  const { user, profile } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    includeCompleted = false,
    orderBy = 'updated_at',
    orderDirection = 'desc'
  } = options

  useEffect(() => {
    if (!user) {
      setProjects([])
      setLoading(false)
      return
    }

    fetchProjects()

    // Set up real-time subscription for projects
    const subscription = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects',
          filter: `created_by=eq.${user.id}`
        },
        (payload) => {
          console.log('Project change detected:', payload)
          
          if (payload.eventType === 'INSERT') {
            const newProject = payload.new as Project
            setProjects(prev => {
              // Avoid duplicates
              if (prev.find(p => p.id === newProject.id)) return prev
              return [newProject, ...prev]
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedProject = payload.new as Project
            setProjects(prev => prev.map(project => 
              project.id === updatedProject.id ? updatedProject : project
            ))
          } else if (payload.eventType === 'DELETE') {
            const deletedProject = payload.old as Project
            setProjects(prev => prev.filter(project => project.id !== deletedProject.id))
          }
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [user, includeCompleted, orderBy, orderDirection])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('projects')
        .select('*')

      // Filter based on user role
      if (profile?.role === 'project_manager' || profile?.role === 'manager') {
        // Managers can see all projects they created
        query = query.eq('created_by', user!.id)
      } else {
        // Other roles can see projects they're members of
        // This would need to be enhanced with a proper join or RPC call
        // For now, we'll show all projects for simplicity
        query = query.eq('created_by', user!.id)
      }

      // Filter completed projects if not included
      if (!includeCompleted) {
        query = query.neq('status', 'completed')
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })

      const { data, error: queryError } = await query

      if (queryError) {
        throw queryError
      }

      setProjects(data as Project[])
    } catch (err: any) {
      console.error('Error fetching projects:', err)
      setError(err.message || 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: {
    name: string
    description?: string
    icon_type?: string
    icon_color?: string
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to create projects')
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          created_by: user.id,
          status: 'planning',
          progress_percentage: 0,
          icon_type: projectData.icon_type || 'General',
          icon_color: projectData.icon_color || 'Blue Light',
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update local state
      setProjects(prev => [data as Project, ...prev])

      // Log activity
      await supabase
        .from('activity_log')
        .insert({
          user_id: user.id,
          activity_type: 'project_created',
          description: `Created project: ${projectData.name}`,
          related_project_id: data.id,
        })

      return { project: data as Project, error: null }
    } catch (err: any) {
      console.error('Error creating project:', err)
      return { project: null, error: err.message || 'Failed to create project' }
    }
  }

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === projectId ? data as Project : project
      ))

      return { project: data as Project, error: null }
    } catch (err: any) {
      console.error('Error updating project:', err)
      return { project: null, error: err.message || 'Failed to update project' }
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) {
        throw error
      }

      // Update local state
      setProjects(prev => prev.filter(project => project.id !== projectId))

      return { error: null }
    } catch (err: any) {
      console.error('Error deleting project:', err)
      return { error: err.message || 'Failed to delete project' }
    }
  }

  const refreshProjects = () => {
    fetchProjects()
  }

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
  }
}

// Hook for getting a single project by ID
export const useProject = (projectId: string | null) => {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) {
      setProject(null)
      setLoading(false)
      return
    }

    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    if (!projectId) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (queryError) {
        throw queryError
      }

      setProject(data as Project)
    } catch (err: any) {
      console.error('Error fetching project:', err)
      setError(err.message || 'Failed to fetch project')
      setProject(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshProject = () => {
    fetchProject()
  }

  return {
    project,
    loading,
    error,
    refreshProject,
  }
}