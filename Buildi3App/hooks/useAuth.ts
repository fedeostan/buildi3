import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

/**
 * Hook to access authentication context
 * Provides type-safe access to auth state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped in <AuthProvider>.'
    )
  }
  
  return context
}

/**
 * Hook for role-based access control checks
 */
export const useRoleAccess = () => {
  const { profile } = useAuth()
  
  const isManager = profile?.role === 'project_manager' || profile?.role === 'manager'
  const isSupervisor = profile?.role === 'site_supervisor'
  const isForeman = profile?.role === 'foreman'
  const isWorker = profile?.role === 'worker'
  
  const canCreateProjects = isManager
  const canAssignTasks = isManager || isSupervisor
  const canUpdateTaskStatus = isManager || isSupervisor || isForeman || isWorker
  const canRequestMaterials = isManager || isSupervisor || isForeman || isWorker
  const canManageTools = isManager || isSupervisor
  const canViewAllProjects = isManager
  const canViewProjectDetails = isManager || isSupervisor || isForeman
  
  return {
    // Role checks
    isManager,
    isSupervisor,
    isForeman,
    isWorker,
    
    // Permission checks
    canCreateProjects,
    canAssignTasks,
    canUpdateTaskStatus,
    canRequestMaterials,
    canManageTools,
    canViewAllProjects,
    canViewProjectDetails,
    
    // Utility
    userRole: profile?.role || null,
    tradeSpecialty: profile?.trade_specialty || null,
  }
}