/**
 * EPIC 4 SECURITY ENHANCEMENT - Security Utilities
 * 
 * Comprehensive security utilities for production deployment:
 * - Input sanitization and validation
 * - Security headers configuration  
 * - Content Security Policy (CSP)
 * - CSRF protection utilities
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { authRateLimiter } from './rateLimiting'

/**
 * Security configuration constants
 */
export const SECURITY_CONFIG = {
  // Content Security Policy
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"], // React Native needs unsafe-inline
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'connect-src': ["'self'", "https://api.supabase.co", "https://*.supabase.co"],
    'font-src': ["'self'", "data:"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'frame-ancestors': ["'none'"],
  },
  
  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  },
  
  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'https://api.buildi3.app',
    'https://app.buildi3.app',
  ],
  
  // File upload restrictions
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const

/**
 * Input sanitization class
 */
export class InputSanitizer {
  /**
   * Sanitize string input to prevent XSS
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return ''
    }
    
    return input
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/\\/g, '&#x5C;')
  }

  /**
   * Sanitize HTML content (strip all HTML tags)
   */
  static stripHtml(input: string): string {
    if (typeof input !== 'string') {
      return ''
    }
    
    return input
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .trim()
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(email: string): string {
    if (typeof email !== 'string') {
      return ''
    }
    
    return email
      .toLowerCase()
      .trim()
      .replace(/[^\w@.-]/g, '') // Only allow word chars, @, ., -
  }

  /**
   * Sanitize phone number input
   */
  static sanitizePhone(phone: string): string {
    if (typeof phone !== 'string') {
      return ''
    }
    
    return phone
      .trim()
      .replace(/[^\d\s\-\(\)\+]/g, '') // Only allow digits, spaces, hyphens, parentheses, plus
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumber(input: string | number): number | null {
    if (typeof input === 'number') {
      return isFinite(input) ? input : null
    }
    
    if (typeof input === 'string') {
      const sanitized = input.replace(/[^\d.-]/g, '')
      const parsed = parseFloat(sanitized)
      return isFinite(parsed) ? parsed : null
    }
    
    return null
  }
}

/**
 * Security validation utilities
 */
export class SecurityValidator {
  /**
   * Check if input contains malicious patterns
   */
  static containsMaliciousPatterns(input: string): boolean {
    if (typeof input !== 'string') {
      return false
    }

    const patterns = [
      // XSS patterns
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b/gi,
      /<object\b/gi,
      /<embed\b/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      
      // SQL injection patterns
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/gi,
      /'|(\\x27)|(\\x2D\\x2D)|(\;)|(\\x3B)/gi,
      
      // Command injection patterns
      /(\||&|;|\$\(|\`|\\)/g,
      
      // Path traversal
      /\.\.\//g,
      /\.\.\\+/g,
      
      // Null bytes and control characters
      /[\x00-\x1f\x7f]/g,
    ]
    
    return patterns.some(pattern => pattern.test(input))
  }

  /**
   * Validate file upload security
   */
  static validateFile(file: { type: string; size: number; name: string }): {
    valid: boolean
    error?: string
  } {
    // Check file type
    if (!SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed. Only images and PDFs are permitted.'
      }
    }

    // Check file size
    if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${SECURITY_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB.`
      }
    }

    // Check filename for malicious patterns
    if (SecurityValidator.containsMaliciousPatterns(file.name)) {
      return {
        valid: false,
        error: 'Filename contains invalid characters.'
      }
    }

    return { valid: true }
  }

  /**
   * Validate URL for safe redirects
   */
  static isValidRedirectUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url)
      
      // Only allow HTTPS (except localhost for development)
      if (parsedUrl.protocol !== 'https:' && !parsedUrl.hostname.includes('localhost')) {
        return false
      }
      
      // Check against allowed origins
      const origin = parsedUrl.origin
      return SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin) || 
             parsedUrl.hostname.includes('localhost')
    } catch {
      return false
    }
  }
}

/**
 * CSRF token management
 */
export class CSRFManager {
  private static CSRF_TOKEN_KEY = 'buildi3_csrf_token'
  private static TOKEN_EXPIRY_HOURS = 1

  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    const array = new Uint8Array(32)
    // In React Native, we'll use Math.random as crypto.getRandomValues isn't available
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    const timestamp = Date.now()
    
    return `${token}.${timestamp}`
  }

  /**
   * Store CSRF token
   */
  static async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CSRF_TOKEN_KEY, token)
    } catch (error) {
      console.error('Failed to store CSRF token:', error)
    }
  }

  /**
   * Get stored CSRF token
   */
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.CSRF_TOKEN_KEY)
    } catch (error) {
      console.error('Failed to get CSRF token:', error)
      return null
    }
  }

  /**
   * Validate CSRF token
   */
  static async validateToken(providedToken: string): Promise<boolean> {
    try {
      const storedToken = await this.getToken()
      
      if (!storedToken || !providedToken) {
        return false
      }

      // Check if tokens match
      if (storedToken !== providedToken) {
        return false
      }

      // Check token expiry
      const [, timestampStr] = storedToken.split('.')
      const timestamp = parseInt(timestampStr, 10)
      const expiryTime = timestamp + (this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)
      
      return Date.now() < expiryTime
    } catch (error) {
      console.error('CSRF token validation error:', error)
      return false
    }
  }

  /**
   * Generate and store new token
   */
  static async refreshToken(): Promise<string> {
    const token = this.generateToken()
    await this.storeToken(token)
    return token
  }
}

/**
 * Session security manager
 */
export class SessionSecurity {
  private static SESSION_KEY = 'buildi3_session_security'

  /**
   * Initialize session security data
   */
  static async initializeSession(): Promise<void> {
    const sessionData = {
      startTime: Date.now(),
      lastActivity: Date.now(),
      deviceInfo: await this.getDeviceInfo(),
      csrfToken: await CSRFManager.refreshToken(),
    }

    try {
      await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.error('Failed to initialize session security:', error)
    }
  }

  /**
   * Update last activity timestamp
   */
  static async updateActivity(): Promise<void> {
    try {
      const sessionDataStr = await AsyncStorage.getItem(this.SESSION_KEY)
      if (sessionDataStr) {
        const sessionData = JSON.parse(sessionDataStr)
        sessionData.lastActivity = Date.now()
        await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
      }
    } catch (error) {
      console.error('Failed to update session activity:', error)
    }
  }

  /**
   * Check if session has been inactive too long
   */
  static async isSessionExpired(maxInactiveMinutes: number = 30): Promise<boolean> {
    try {
      const sessionDataStr = await AsyncStorage.getItem(this.SESSION_KEY)
      if (!sessionDataStr) {
        return true
      }

      const sessionData = JSON.parse(sessionDataStr)
      const inactiveTime = Date.now() - sessionData.lastActivity
      const maxInactiveMs = maxInactiveMinutes * 60 * 1000

      return inactiveTime > maxInactiveMs
    } catch (error) {
      console.error('Session expiry check error:', error)
      return true // Err on the side of security
    }
  }

  /**
   * Clear session security data
   */
  static async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.SESSION_KEY)
      await AsyncStorage.removeItem(CSRFManager['CSRF_TOKEN_KEY'])
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  }

  /**
   * Get basic device information for session tracking
   */
  private static async getDeviceInfo(): Promise<Record<string, any>> {
    // In a real React Native app, you'd use react-native-device-info
    // For now, return basic info available in React Native
    return {
      userAgent: 'Buildi3App',
      platform: 'react-native',
      timestamp: Date.now(),
    }
  }
}

/**
 * Security event logger
 */
export class SecurityLogger {
  private static LOG_KEY_PREFIX = 'buildi3_security_log_'

  /**
   * Log security event
   */
  static async logSecurityEvent(
    event: string,
    details: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<void> {
    const logEntry = {
      timestamp: Date.now(),
      event,
      details,
      severity,
      userAgent: 'Buildi3App',
    }

    try {
      const logKey = `${this.LOG_KEY_PREFIX}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await AsyncStorage.setItem(logKey, JSON.stringify(logEntry))
      
      // Also log to console for development
      console.warn(`Security Event [${severity.toUpperCase()}]:`, event, details)
      
      // In production, you might want to send this to a security monitoring service
      if (severity === 'critical') {
        // Send to monitoring service
        console.error('CRITICAL SECURITY EVENT:', logEntry)
      }
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }

  /**
   * Get recent security logs
   */
  static async getRecentLogs(hours: number = 24): Promise<any[]> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const logKeys = keys.filter(key => key.startsWith(this.LOG_KEY_PREFIX))
      
      const logs = await Promise.all(
        logKeys.map(async (key) => {
          try {
            const logStr = await AsyncStorage.getItem(key)
            return logStr ? JSON.parse(logStr) : null
          } catch {
            return null
          }
        })
      )

      const validLogs = logs.filter(log => log !== null)
      const cutoffTime = Date.now() - (hours * 60 * 60 * 1000)
      
      return validLogs
        .filter(log => log.timestamp > cutoffTime)
        .sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('Failed to get security logs:', error)
      return []
    }
  }

  /**
   * Clear old security logs
   */
  static async clearOldLogs(olderThanDays: number = 7): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const logKeys = keys.filter(key => key.startsWith(this.LOG_KEY_PREFIX))
      const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000)
      
      const keysToRemove: string[] = []
      
      for (const key of logKeys) {
        try {
          const logStr = await AsyncStorage.getItem(key)
          if (logStr) {
            const log = JSON.parse(logStr)
            if (log.timestamp < cutoffTime) {
              keysToRemove.push(key)
            }
          }
        } catch {
          // Invalid log, remove it
          keysToRemove.push(key)
        }
      }
      
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove)
      }
    } catch (error) {
      console.error('Failed to clear old security logs:', error)
    }
  }
}

/**
 * Security middleware for API calls
 */
export const createSecurityMiddleware = () => {
  return {
    /**
     * Pre-request security checks
     */
    async beforeRequest(config: any): Promise<any> {
      // Update session activity
      await SessionSecurity.updateActivity()
      
      // Check session expiry
      const isExpired = await SessionSecurity.isSessionExpired()
      if (isExpired) {
        throw new Error('Session expired. Please log in again.')
      }

      // Add CSRF token to headers
      const csrfToken = await CSRFManager.getToken()
      if (csrfToken) {
        config.headers = {
          ...config.headers,
          'X-CSRF-Token': csrfToken,
        }
      }

      // Add security headers
      config.headers = {
        ...config.headers,
        ...SECURITY_CONFIG.SECURITY_HEADERS,
      }

      return config
    },

    /**
     * Post-response security checks
     */
    async afterResponse(response: any): Promise<any> {
      // Log any security-related response headers or status codes
      if (response.status === 429) {
        await SecurityLogger.logSecurityEvent(
          'rate_limit_exceeded',
          { url: response.config?.url, status: response.status },
          'medium'
        )
      }

      return response
    },

    /**
     * Error handling with security logging
     */
    async onError(error: any): Promise<any> {
      if (error.response?.status === 401) {
        await SecurityLogger.logSecurityEvent(
          'unauthorized_request',
          { url: error.config?.url, status: error.response.status },
          'high'
        )
      } else if (error.response?.status === 403) {
        await SecurityLogger.logSecurityEvent(
          'forbidden_request',
          { url: error.config?.url, status: error.response.status },
          'high'
        )
      }

      throw error
    }
  }
}

// Export singleton instances and utilities
export const inputSanitizer = InputSanitizer
export const securityValidator = SecurityValidator
export const csrfManager = CSRFManager
export const sessionSecurity = SessionSecurity
export const securityLogger = SecurityLogger