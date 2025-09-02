/**
 * EPIC 4 SECURITY ENHANCEMENT - Client-Side Audit Logger
 * 
 * Client library for audit logging integration with Edge Functions.
 * Provides comprehensive audit trail for security events and critical operations.
 */

import { supabase } from '../supabase/client'

/**
 * Audit event categories and types
 */
export const AUDIT_CATEGORIES = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  DATA_ACCESS: 'data_access',
  DATA_MODIFICATION: 'data_modification',
  SYSTEM_CONFIGURATION: 'system_configuration',
  SECURITY_VIOLATION: 'security_violation',
  USER_MANAGEMENT: 'user_management',
  PROJECT_MANAGEMENT: 'project_management',
  TASK_MANAGEMENT: 'task_management',
} as const

export const AUDIT_EVENTS = {
  // Authentication events
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  LOGIN_FAILED: 'login_failed',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  PASSWORD_CHANGED: 'password_changed',
  EMAIL_VERIFICATION: 'email_verification',
  
  // Authorization events
  PERMISSION_DENIED: 'permission_denied',
  ROLE_CHANGED: 'role_changed',
  ACCESS_GRANTED: 'access_granted',
  
  // Data events
  RECORD_CREATED: 'record_created',
  RECORD_UPDATED: 'record_updated',
  RECORD_DELETED: 'record_deleted',
  SENSITIVE_DATA_ACCESSED: 'sensitive_data_accessed',
  BULK_OPERATION: 'bulk_operation',
  
  // Security events
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  INVALID_INPUT: 'invalid_input',
  CSP_VIOLATION: 'csp_violation',
  SECURITY_HEADERS_VIOLATED: 'security_headers_violated',
  
  // System events
  CONFIGURATION_CHANGED: 'configuration_changed',
  ADMIN_ACTION: 'admin_action',
  SYSTEM_ERROR: 'system_error',
  
  // Business events
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  MATERIAL_REQUEST_APPROVED: 'material_request_approved',
  INSPECTION_SCHEDULED: 'inspection_scheduled',
} as const

export type AuditCategory = typeof AUDIT_CATEGORIES[keyof typeof AUDIT_CATEGORIES]
export type AuditEvent = typeof AUDIT_EVENTS[keyof typeof AUDIT_EVENTS]
export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface AuditLogData {
  category: AuditCategory
  event: AuditEvent
  severity: AuditSeverity
  resourceType?: 'project' | 'task' | 'user' | 'material_request' | 'inspection'
  resourceId?: string
  details?: Record<string, any>
  metadata?: Record<string, any>
}

export interface AuditLogResponse {
  success: boolean
  message?: string
  error?: string
  request_id?: string
}

/**
 * Client-side audit logging class
 */
export class AuditLogger {
  private baseUrl: string
  private maxRetries = 3
  private retryDelay = 1000 // 1 second

  constructor() {
    // Get the Supabase URL and construct the Edge Function URL
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ''
    this.baseUrl = `${supabaseUrl}/functions/v1/audit-logger`
  }

  /**
   * Log an audit event
   */
  async log(data: AuditLogData): Promise<AuditLogResponse> {
    try {
      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession()
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Request-ID': this.generateRequestId(),
      }

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await this.makeRequest('/log', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Audit log error:', errorData)
        return { success: false, error: errorData.error || 'Failed to create audit log' }
      }

      const result = await response.json()
      return { success: true, ...result }
    } catch (error) {
      console.error('Audit logging failed:', error)
      return { success: false, error: 'Network error or service unavailable' }
    }
  }

  /**
   * Get audit logs with filtering
   */
  async getLogs(filters: {
    page?: number
    limit?: number
    category?: AuditCategory
    event?: AuditEvent
    severity?: AuditSeverity
    userId?: string
    resourceType?: string
    resourceId?: string
    fromDate?: string
    toDate?: string
  } = {}): Promise<{
    success: boolean
    data?: any[]
    pagination?: { page: number; limit: number; total: number }
    error?: string
  }> {
    try {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key.replace(/([A-Z])/g, '_$1').toLowerCase(), value.toString())
        }
      })

      const { data: { session } } = await supabase.auth.getSession()
      const headers: Record<string, string> = {}

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await this.makeRequest(`/logs?${params.toString()}`, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        return { success: false, error: errorData.error || 'Failed to fetch audit logs' }
      }

      return await response.json()
    } catch (error) {
      console.error('Get audit logs failed:', error)
      return { success: false, error: 'Network error or service unavailable' }
    }
  }

  /**
   * Helper methods for common audit events
   */
  async logAuthentication(event: AuditEvent, details?: Record<string, any>): Promise<AuditLogResponse> {
    const severity: AuditSeverity = event === AUDIT_EVENTS.LOGIN_FAILED ? 'medium' : 'low'
    
    return this.log({
      category: AUDIT_CATEGORIES.AUTHENTICATION,
      event,
      severity,
      details,
    })
  }

  async logDataAccess(
    resourceType: 'project' | 'task' | 'user',
    resourceId: string,
    event: AuditEvent = AUDIT_EVENTS.SENSITIVE_DATA_ACCESSED,
    details?: Record<string, any>
  ): Promise<AuditLogResponse> {
    return this.log({
      category: AUDIT_CATEGORIES.DATA_ACCESS,
      event,
      severity: 'low',
      resourceType,
      resourceId,
      details,
    })
  }

  async logDataModification(
    resourceType: 'project' | 'task' | 'user',
    resourceId: string,
    event: AuditEvent,
    details?: Record<string, any>
  ): Promise<AuditLogResponse> {
    const severity: AuditSeverity = event === AUDIT_EVENTS.RECORD_DELETED ? 'medium' : 'low'
    
    return this.log({
      category: AUDIT_CATEGORIES.DATA_MODIFICATION,
      event,
      severity,
      resourceType,
      resourceId,
      details,
    })
  }

  async logSecurityViolation(
    event: AuditEvent,
    severity: AuditSeverity = 'high',
    details?: Record<string, any>
  ): Promise<AuditLogResponse> {
    return this.log({
      category: AUDIT_CATEGORIES.SECURITY_VIOLATION,
      event,
      severity,
      details,
    })
  }

  async logProjectEvent(
    projectId: string,
    event: AuditEvent,
    details?: Record<string, any>
  ): Promise<AuditLogResponse> {
    return this.log({
      category: AUDIT_CATEGORIES.PROJECT_MANAGEMENT,
      event,
      severity: 'low',
      resourceType: 'project',
      resourceId: projectId,
      details,
    })
  }

  async logTaskEvent(
    taskId: string,
    event: AuditEvent,
    details?: Record<string, any>
  ): Promise<AuditLogResponse> {
    return this.log({
      category: AUDIT_CATEGORIES.TASK_MANAGEMENT,
      event,
      severity: 'low',
      resourceType: 'task',
      resourceId: taskId,
      details,
    })
  }

  /**
   * Batch logging for multiple events
   */
  async logBatch(events: AuditLogData[]): Promise<AuditLogResponse[]> {
    // Process in parallel but limit concurrency to avoid overwhelming the server
    const results: AuditLogResponse[] = []
    const batchSize = 5

    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(event => this.log(event))
      )
      results.push(...batchResults)
    }

    return results
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest(endpoint: string, options: RequestInit, retryCount = 0): Promise<Response> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        timeout: 10000, // 10 second timeout
      } as any)

      // Retry on server errors (5xx) or network issues
      if (!response.ok && response.status >= 500 && retryCount < this.maxRetries) {
        await this.delay(this.retryDelay * Math.pow(2, retryCount)) // Exponential backoff
        return this.makeRequest(endpoint, options, retryCount + 1)
      }

      return response
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await this.delay(this.retryDelay * Math.pow(2, retryCount))
        return this.makeRequest(endpoint, options, retryCount + 1)
      }
      throw error
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Audit logging middleware for automatic event capture
 */
export class AuditMiddleware {
  private auditLogger: AuditLogger

  constructor(auditLogger: AuditLogger) {
    this.auditLogger = auditLogger
  }

  /**
   * Database operation middleware
   */
  async logDatabaseOperation(
    operation: 'create' | 'update' | 'delete',
    table: string,
    recordId: string,
    data?: Record<string, any>
  ): Promise<void> {
    const eventMap = {
      create: AUDIT_EVENTS.RECORD_CREATED,
      update: AUDIT_EVENTS.RECORD_UPDATED,
      delete: AUDIT_EVENTS.RECORD_DELETED,
    }

    const resourceTypeMap: Record<string, 'project' | 'task' | 'user' | 'material_request' | 'inspection'> = {
      projects: 'project',
      tasks: 'task',
      profiles: 'user',
      material_requests: 'material_request',
      inspections: 'inspection',
    }

    await this.auditLogger.logDataModification(
      resourceTypeMap[table] || 'project', // Default to project if unknown
      recordId,
      eventMap[operation],
      {
        table,
        operation,
        data: data ? Object.keys(data) : undefined, // Log only field names, not values
      }
    )
  }

  /**
   * Authentication middleware
   */
  async logAuthEvent(
    event: 'login' | 'logout' | 'login_failed' | 'password_reset',
    email?: string,
    details?: Record<string, any>
  ): Promise<void> {
    const eventMap = {
      login: AUDIT_EVENTS.USER_LOGIN,
      logout: AUDIT_EVENTS.USER_LOGOUT,
      login_failed: AUDIT_EVENTS.LOGIN_FAILED,
      password_reset: AUDIT_EVENTS.PASSWORD_RESET_REQUESTED,
    }

    await this.auditLogger.logAuthentication(eventMap[event], {
      email,
      ...details,
    })
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger()
export const auditMiddleware = new AuditMiddleware(auditLogger)

/**
 * React Hook for audit logging
 */
export const useAuditLogger = () => {
  return {
    log: auditLogger.log.bind(auditLogger),
    logAuth: auditLogger.logAuthentication.bind(auditLogger),
    logDataAccess: auditLogger.logDataAccess.bind(auditLogger),
    logDataModification: auditLogger.logDataModification.bind(auditLogger),
    logSecurityViolation: auditLogger.logSecurityViolation.bind(auditLogger),
    logProject: auditLogger.logProjectEvent.bind(auditLogger),
    logTask: auditLogger.logTaskEvent.bind(auditLogger),
    getLogs: auditLogger.getLogs.bind(auditLogger),
  }
}