/**
 * EPIC 4 SECURITY ENHANCEMENT - Audit Logging Edge Function
 * 
 * Comprehensive audit logging system for security events and critical operations.
 * Implements production-ready audit trail for Buildi3 construction management app.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Audit event types and categories
const AUDIT_CATEGORIES = {
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

const AUDIT_EVENTS = {
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

type AuditCategory = typeof AUDIT_CATEGORIES[keyof typeof AUDIT_CATEGORIES]
type AuditEvent = typeof AUDIT_EVENTS[keyof typeof AUDIT_EVENTS]

interface AuditLogEntry {
  id?: string
  timestamp: string
  category: AuditCategory
  event: AuditEvent
  severity: 'low' | 'medium' | 'high' | 'critical'
  user_id?: string
  session_id?: string
  ip_address?: string
  user_agent?: string
  resource_type?: string
  resource_id?: string
  details: Record<string, any>
  metadata: {
    request_id?: string
    origin?: string
    referer?: string
    method?: string
    url?: string
    status_code?: number
    duration_ms?: number
  }
}

/**
 * Initialize Supabase client for audit logging
 */
function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Extract user information from request
 */
async function extractUserInfo(request: Request): Promise<{
  userId?: string
  sessionId?: string
}> {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return {}
    }

    const token = authHeader.substring(7)
    const supabase = createSupabaseClient()
    
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return {}
    }

    return {
      userId: user.id,
      sessionId: user.aud, // Using audience as session identifier
    }
  } catch (error) {
    console.error('Error extracting user info:', error)
    return {}
  }
}

/**
 * Extract client information from request
 */
function extractClientInfo(request: Request): {
  ipAddress: string
  userAgent: string
} {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ipAddress = cfConnectingIp || 
                   forwarded?.split(',')[0].trim() || 
                   realIp || 
                   'unknown'

  const userAgent = request.headers.get('user-agent') || 'unknown'

  return { ipAddress, userAgent }
}

/**
 * Create audit log entry
 */
async function createAuditLog(
  entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseClient()
    
    const auditEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    }

    // Store in activity_log table with extended audit information
    const { error } = await supabase
      .from('activity_log')
      .insert({
        user_id: auditEntry.user_id,
        activity_type: `${auditEntry.category}:${auditEntry.event}`,
        description: JSON.stringify({
          severity: auditEntry.severity,
          details: auditEntry.details,
          metadata: auditEntry.metadata,
          client: {
            ip_address: auditEntry.ip_address,
            user_agent: auditEntry.user_agent,
          }
        }),
        related_project_id: auditEntry.resource_type === 'project' ? auditEntry.resource_id : null,
        related_task_id: auditEntry.resource_type === 'task' ? auditEntry.resource_id : null,
        created_at: auditEntry.timestamp,
      })

    if (error) {
      console.error('Audit log storage error:', error)
      return { success: false, error: error.message }
    }

    // For critical events, also log to console with alert format
    if (auditEntry.severity === 'critical') {
      console.error('CRITICAL AUDIT EVENT:', JSON.stringify(auditEntry, null, 2))
      
      // In production, you might want to:
      // 1. Send to external SIEM system
      // 2. Trigger security alerts
      // 3. Notify security team
    }

    return { success: true }
  } catch (error) {
    console.error('Audit logging error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Validate audit log request
 */
function validateAuditRequest(body: any): {
  valid: boolean
  error?: string
  entry?: Omit<AuditLogEntry, 'id' | 'timestamp'>
} {
  try {
    // Required fields validation
    if (!body.category || !Object.values(AUDIT_CATEGORIES).includes(body.category)) {
      return { valid: false, error: 'Invalid or missing category' }
    }

    if (!body.event || !Object.values(AUDIT_EVENTS).includes(body.event)) {
      return { valid: false, error: 'Invalid or missing event' }
    }

    if (!body.severity || !['low', 'medium', 'high', 'critical'].includes(body.severity)) {
      return { valid: false, error: 'Invalid or missing severity' }
    }

    // Optional fields validation
    if (body.details && typeof body.details !== 'object') {
      return { valid: false, error: 'Details must be an object' }
    }

    if (body.metadata && typeof body.metadata !== 'object') {
      return { valid: false, error: 'Metadata must be an object' }
    }

    const entry: Omit<AuditLogEntry, 'id' | 'timestamp'> = {
      category: body.category,
      event: body.event,
      severity: body.severity,
      user_id: body.user_id || undefined,
      session_id: body.session_id || undefined,
      ip_address: body.ip_address || undefined,
      user_agent: body.user_agent || undefined,
      resource_type: body.resource_type || undefined,
      resource_id: body.resource_id || undefined,
      details: body.details || {},
      metadata: body.metadata || {},
    }

    return { valid: true, entry }
  } catch (error) {
    return { valid: false, error: 'Invalid request format' }
  }
}

/**
 * Get audit logs with filtering and pagination
 */
async function getAuditLogs(params: URLSearchParams): Promise<{
  success: boolean
  data?: any[]
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
  }
}> {
  try {
    const supabase = createSupabaseClient()
    
    // Parse query parameters
    const page = Math.max(1, parseInt(params.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(params.get('limit') || '50')))
    const category = params.get('category')
    const event = params.get('event')
    const severity = params.get('severity')
    const userId = params.get('user_id')
    const resourceType = params.get('resource_type')
    const resourceId = params.get('resource_id')
    const fromDate = params.get('from_date')
    const toDate = params.get('to_date')
    
    // Build query
    let query = supabase
      .from('activity_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (category) {
      query = query.like('activity_type', `${category}:%`)
    }
    
    if (event) {
      query = query.like('activity_type', `%:${event}`)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (resourceType === 'project' && resourceId) {
      query = query.eq('related_project_id', resourceId)
    }
    
    if (resourceType === 'task' && resourceId) {
      query = query.eq('related_task_id', resourceId)
    }
    
    if (fromDate) {
      query = query.gte('created_at', fromDate)
    }
    
    if (toDate) {
      query = query.lte('created_at', toDate)
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    // Parse and format audit entries
    const formattedData = data?.map(entry => {
      let parsedDescription = {}
      try {
        parsedDescription = JSON.parse(entry.description || '{}')
      } catch {
        parsedDescription = { raw: entry.description }
      }

      const [category, event] = entry.activity_type.split(':')

      return {
        id: entry.id,
        timestamp: entry.created_at,
        category,
        event,
        severity: parsedDescription.severity || 'medium',
        user_id: entry.user_id,
        resource_type: entry.related_project_id ? 'project' : 
                      entry.related_task_id ? 'task' : undefined,
        resource_id: entry.related_project_id || entry.related_task_id,
        details: parsedDescription.details || {},
        metadata: parsedDescription.metadata || {},
        client: parsedDescription.client || {},
      }
    }) || []

    return {
      success: true,
      data: formattedData,
      pagination: {
        page,
        limit,
        total: count || 0,
      }
    }
  } catch (error) {
    console.error('Get audit logs error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Main Edge Function handler
 */
Deno.serve(async (request: Request) => {
  const url = new URL(request.url)
  const method = request.method
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Request-ID',
  }

  // Handle preflight
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const clientInfo = extractClientInfo(request)
    const requestId = crypto.randomUUID()
    
    if (method === 'POST' && url.pathname === '/log') {
      // Create audit log entry
      const body = await request.json()
      const userInfo = await extractUserInfo(request)
      
      const validation = validateAuditRequest(body)
      if (!validation.valid) {
        return new Response(
          JSON.stringify({ error: validation.error }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Merge client and user info into the audit entry
      const auditEntry = {
        ...validation.entry!,
        ...userInfo,
        ...clientInfo,
        metadata: {
          ...validation.entry!.metadata,
          request_id: requestId,
          origin: request.headers.get('origin') || undefined,
          referer: request.headers.get('referer') || undefined,
          method: request.method,
          url: request.url,
        }
      }

      const result = await createAuditLog(auditEntry)
      
      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.error }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Audit log created',
          request_id: requestId
        }),
        { 
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    if (method === 'GET' && url.pathname === '/logs') {
      // Get audit logs with filtering
      const result = await getAuditLogs(url.searchParams)
      
      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.error }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: result.data,
          pagination: result.pagination,
          request_id: requestId,
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    if (method === 'GET' && url.pathname === '/events') {
      // Get available audit events and categories
      return new Response(
        JSON.stringify({
          categories: AUDIT_CATEGORIES,
          events: AUDIT_EVENTS,
          severities: ['low', 'medium', 'high', 'critical'],
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Unknown endpoint
    return new Response(
      JSON.stringify({ 
        error: 'Not found',
        message: 'Available endpoints: POST /log, GET /logs, GET /events'
      }),
      { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Audit logger function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})