/**
 * EPIC 4 SECURITY ENHANCEMENT - Security Module Index
 * 
 * Central export point for all security utilities and services.
 * Provides comprehensive security framework for production deployment.
 */

// Rate Limiting and Abuse Prevention
export {
  rateLimiter,
  authRateLimiter,
  apiRateLimiter,
  formRateLimiter,
  progressiveBackoff,
  formatRateLimitError,
  withRateLimit,
  type RateLimitType,
  type RateLimitResult,
  ProgressiveBackoff,
  AuthRateLimiter,
  APIRateLimiter,
  FormRateLimiter,
} from './rateLimiting'

// Security Utilities and Headers
export {
  inputSanitizer,
  securityValidator,
  csrfManager,
  sessionSecurity,
  securityLogger,
  createSecurityMiddleware,
  InputSanitizer,
  SecurityValidator,
  CSRFManager,
  SessionSecurity,
  SecurityLogger,
  SECURITY_CONFIG,
} from './securityUtils'

// Audit Logging
export {
  auditLogger,
  auditMiddleware,
  useAuditLogger,
  AuditLogger,
  AuditMiddleware,
  AUDIT_CATEGORIES,
  AUDIT_EVENTS,
  type AuditCategory,
  type AuditEvent,
  type AuditSeverity,
  type AuditLogData,
  type AuditLogResponse,
} from './auditLogger'

/**
 * Security configuration constants
 */
export const PRODUCTION_SECURITY_CONFIG = {
  // Authentication Security
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_MAX_LENGTH: 128,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  SESSION_TIMEOUT_MINUTES: 30,
  
  // Rate Limiting
  AUTH_RATE_LIMIT: 5, // attempts per 15 minutes
  API_RATE_LIMIT: 100, // requests per minute
  FORM_RATE_LIMIT: 10, // submissions per minute
  
  // File Upload Security
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  
  // Content Security
  MAX_INPUT_LENGTH: 2000,
  ALLOWED_HTML_TAGS: [], // No HTML allowed in user input
  
  // Security Monitoring
  LOG_RETENTION_DAYS: 90,
  CRITICAL_EVENT_NOTIFICATION: true,
  SECURITY_SCAN_INTERVAL_HOURS: 24,
} as const

/**
 * Security middleware configuration
 */
export interface SecurityMiddlewareConfig {
  enableRateLimiting: boolean
  enableAuditLogging: boolean
  enableCSRFProtection: boolean
  enableInputSanitization: boolean
  enableSessionSecurity: boolean
}

/**
 * Comprehensive security service that integrates all security features
 */
export class SecurityService {
  private config: SecurityMiddlewareConfig

  constructor(config: Partial<SecurityMiddlewareConfig> = {}) {
    this.config = {
      enableRateLimiting: true,
      enableAuditLogging: true,
      enableCSRFProtection: true,
      enableInputSanitization: true,
      enableSessionSecurity: true,
      ...config,
    }
  }

  /**
   * Initialize security service
   */
  async initialize(): Promise<void> {
    if (this.config.enableSessionSecurity) {
      await sessionSecurity.initializeSession()
    }

    if (this.config.enableCSRFProtection) {
      await csrfManager.refreshToken()
    }

    // Clean up old security logs
    await securityLogger.clearOldLogs(PRODUCTION_SECURITY_CONFIG.LOG_RETENTION_DAYS)

    console.log('Security service initialized with config:', this.config)
  }

  /**
   * Validate and sanitize user input
   */
  async validateInput(
    input: any,
    options: {
      maxLength?: number
      allowHtml?: boolean
      required?: boolean
    } = {}
  ): Promise<{
    valid: boolean
    sanitized?: any
    errors?: string[]
  }> {
    const errors: string[] = []

    // Check required
    if (options.required && (!input || (typeof input === 'string' && !input.trim()))) {
      errors.push('Input is required')
    }

    if (typeof input === 'string') {
      // Check length
      const maxLength = options.maxLength || PRODUCTION_SECURITY_CONFIG.MAX_INPUT_LENGTH
      if (input.length > maxLength) {
        errors.push(`Input exceeds maximum length of ${maxLength} characters`)
      }

      // Check for malicious content
      if (this.config.enableInputSanitization) {
        if (securityValidator.containsMaliciousPatterns(input)) {
          errors.push('Input contains invalid or potentially dangerous content')
          
          // Log security violation
          await auditLogger.logSecurityViolation(
            AUDIT_EVENTS.INVALID_INPUT,
            'high',
            { input: input.substring(0, 100) + '...', reason: 'malicious_patterns' }
          )
        }

        // Sanitize input
        const sanitized = options.allowHtml 
          ? inputSanitizer.sanitizeString(input)
          : inputSanitizer.stripHtml(input)

        return {
          valid: errors.length === 0,
          sanitized,
          errors: errors.length > 0 ? errors : undefined,
        }
      }
    }

    return {
      valid: errors.length === 0,
      sanitized: input,
      errors: errors.length > 0 ? errors : undefined,
    }
  }

  /**
   * Check authentication rate limits
   */
  async checkAuthRateLimit(email: string): Promise<{
    allowed: boolean
    result: RateLimitResult
  }> {
    if (!this.config.enableRateLimiting) {
      return { allowed: true, result: { allowed: true, remaining: 999, resetTime: Date.now() } }
    }

    return authRateLimiter.checkAuthAttempt(email)
  }

  /**
   * Handle authentication attempt
   */
  async handleAuthAttempt(
    email: string,
    success: boolean,
    attemptNumber: number = 1
  ): Promise<void> {
    if (!success && this.config.enableRateLimiting) {
      await authRateLimiter.handleFailedAuth(email, attemptNumber)
    }

    if (success && this.config.enableRateLimiting) {
      await authRateLimiter.resetAuthLimit(email)
    }

    // Log authentication event
    if (this.config.enableAuditLogging) {
      await auditLogger.logAuthentication(
        success ? AUDIT_EVENTS.USER_LOGIN : AUDIT_EVENTS.LOGIN_FAILED,
        { email, attemptNumber, timestamp: new Date().toISOString() }
      )
    }
  }

  /**
   * Validate file upload
   */
  validateFileUpload(file: {
    type: string
    size: number
    name: string
  }): { valid: boolean; error?: string } {
    return securityValidator.validateFile(file)
  }

  /**
   * Check session security
   */
  async checkSessionSecurity(): Promise<{
    valid: boolean
    expired: boolean
    refreshed: boolean
  }> {
    if (!this.config.enableSessionSecurity) {
      return { valid: true, expired: false, refreshed: false }
    }

    const expired = await sessionSecurity.isSessionExpired(
      PRODUCTION_SECURITY_CONFIG.SESSION_TIMEOUT_MINUTES
    )

    if (expired) {
      return { valid: false, expired: true, refreshed: false }
    }

    await sessionSecurity.updateActivity()
    return { valid: true, expired: false, refreshed: true }
  }

  /**
   * Generate secure CSRF token
   */
  async generateCSRFToken(): Promise<string | null> {
    if (!this.config.enableCSRFProtection) {
      return null
    }

    return csrfManager.refreshToken()
  }

  /**
   * Validate CSRF token
   */
  async validateCSRFToken(token: string): Promise<boolean> {
    if (!this.config.enableCSRFProtection) {
      return true
    }

    return csrfManager.validateToken(token)
  }

  /**
   * Get security status summary
   */
  async getSecurityStatus(): Promise<{
    initialized: boolean
    rateLimiting: boolean
    auditLogging: boolean
    sessionSecurity: boolean
    csrfProtection: boolean
    recentSecurityEvents: any[]
  }> {
    const recentSecurityEvents = this.config.enableAuditLogging
      ? await auditLogger.getLogs({
          category: AUDIT_CATEGORIES.SECURITY_VIOLATION,
          limit: 10,
        })
      : { data: [] }

    return {
      initialized: true,
      rateLimiting: this.config.enableRateLimiting,
      auditLogging: this.config.enableAuditLogging,
      sessionSecurity: this.config.enableSessionSecurity,
      csrfProtection: this.config.enableCSRFProtection,
      recentSecurityEvents: recentSecurityEvents.data || [],
    }
  }

  /**
   * Perform security health check
   */
  async performSecurityHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical'
    issues: string[]
    recommendations: string[]
  }> {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check recent security violations
    if (this.config.enableAuditLogging) {
      const recentViolations = await auditLogger.getLogs({
        category: AUDIT_CATEGORIES.SECURITY_VIOLATION,
        severity: 'critical',
        fromDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
      })

      if (recentViolations.data && recentViolations.data.length > 0) {
        issues.push(`${recentViolations.data.length} critical security events in the last 24 hours`)
        recommendations.push('Review recent security events and take appropriate action')
      }
    }

    // Check session security
    const sessionExpired = await sessionSecurity.isSessionExpired(
      PRODUCTION_SECURITY_CONFIG.SESSION_TIMEOUT_MINUTES
    )

    if (sessionExpired) {
      recommendations.push('Current session has expired and should be refreshed')
    }

    // Determine overall status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy'
    
    if (issues.length > 0) {
      status = issues.some(issue => issue.includes('critical')) ? 'critical' : 'warning'
    }

    return { status, issues, recommendations }
  }
}

// Export singleton security service instance
export const securityService = new SecurityService()

/**
 * Initialize security service on module load
 */
securityService.initialize().catch(error => {
  console.error('Failed to initialize security service:', error)
})