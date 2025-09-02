/**
 * EPIC 4 SECURITY ENHANCEMENT - Rate Limiting & Abuse Prevention
 * 
 * Client-side rate limiting implementation for production security.
 * Prevents brute force attacks and API abuse in React Native environment.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Authentication rate limits
  AUTH_ATTEMPTS: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockoutMs: 30 * 60 * 1000, // 30 minutes lockout
  },
  
  // API request rate limits
  API_REQUESTS: {
    maxAttempts: 60,
    windowMs: 60 * 1000, // 1 minute
    lockoutMs: 5 * 60 * 1000, // 5 minutes lockout
  },
  
  // Form submission rate limits
  FORM_SUBMISSIONS: {
    maxAttempts: 10,
    windowMs: 60 * 1000, // 1 minute
    lockoutMs: 2 * 60 * 1000, // 2 minutes lockout
  },
  
  // Password reset rate limits
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    lockoutMs: 60 * 60 * 1000, // 1 hour lockout
  },
} as const

/**
 * Rate limit categories
 */
export type RateLimitType = keyof typeof RATE_LIMIT_CONFIG

/**
 * Rate limit attempt record
 */
interface RateLimitRecord {
  count: number
  firstAttempt: number
  lastAttempt: number
  lockedUntil?: number
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  lockedUntil?: number
  retryAfter?: number
}

/**
 * Client-side rate limiting class
 */
class RateLimiter {
  private storageKeyPrefix = 'buildi3_rate_limit_'

  /**
   * Check if an action is rate limited
   */
  async checkRateLimit(
    type: RateLimitType,
    identifier: string
  ): Promise<RateLimitResult> {
    const config = RATE_LIMIT_CONFIG[type]
    const storageKey = this.getStorageKey(type, identifier)
    
    try {
      const recordStr = await AsyncStorage.getItem(storageKey)
      const record: RateLimitRecord = recordStr 
        ? JSON.parse(recordStr) 
        : { count: 0, firstAttempt: Date.now(), lastAttempt: Date.now() }

      const now = Date.now()
      
      // Check if currently locked out
      if (record.lockedUntil && now < record.lockedUntil) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: record.lockedUntil,
          lockedUntil: record.lockedUntil,
          retryAfter: Math.ceil((record.lockedUntil - now) / 1000),
        }
      }

      // Check if window has expired - reset counter
      if (now - record.firstAttempt > config.windowMs) {
        record.count = 0
        record.firstAttempt = now
      }

      // Check if limit exceeded
      if (record.count >= config.maxAttempts) {
        const lockoutEnd = now + config.lockoutMs
        record.lockedUntil = lockoutEnd
        
        await AsyncStorage.setItem(storageKey, JSON.stringify(record))
        
        return {
          allowed: false,
          remaining: 0,
          resetTime: lockoutEnd,
          lockedUntil: lockoutEnd,
          retryAfter: Math.ceil(config.lockoutMs / 1000),
        }
      }

      return {
        allowed: true,
        remaining: config.maxAttempts - record.count,
        resetTime: record.firstAttempt + config.windowMs,
      }
    } catch (error) {
      console.error('Rate limit check error:', error)
      // Default to allowing on error to avoid breaking functionality
      return {
        allowed: true,
        remaining: config.maxAttempts,
        resetTime: Date.now() + config.windowMs,
      }
    }
  }

  /**
   * Record an attempt (increment counter)
   */
  async recordAttempt(
    type: RateLimitType,
    identifier: string
  ): Promise<RateLimitResult> {
    const storageKey = this.getStorageKey(type, identifier)
    
    try {
      const recordStr = await AsyncStorage.getItem(storageKey)
      const record: RateLimitRecord = recordStr 
        ? JSON.parse(recordStr) 
        : { count: 0, firstAttempt: Date.now(), lastAttempt: Date.now() }

      record.count += 1
      record.lastAttempt = Date.now()
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(record))
      
      return this.checkRateLimit(type, identifier)
    } catch (error) {
      console.error('Record attempt error:', error)
      return this.checkRateLimit(type, identifier)
    }
  }

  /**
   * Reset rate limit for an identifier
   */
  async resetRateLimit(type: RateLimitType, identifier: string): Promise<void> {
    const storageKey = this.getStorageKey(type, identifier)
    
    try {
      await AsyncStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Reset rate limit error:', error)
    }
  }

  /**
   * Clear all rate limit data (for testing/development)
   */
  async clearAllRateLimits(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const rateLimitKeys = keys.filter(key => key.startsWith(this.storageKeyPrefix))
      
      if (rateLimitKeys.length > 0) {
        await AsyncStorage.multiRemove(rateLimitKeys)
      }
    } catch (error) {
      console.error('Clear all rate limits error:', error)
    }
  }

  /**
   * Get storage key for rate limit record
   */
  private getStorageKey(type: RateLimitType, identifier: string): string {
    return `${this.storageKeyPrefix}${type}_${identifier}`
  }
}

/**
 * Progressive backoff implementation
 */
export class ProgressiveBackoff {
  private baseDelayMs = 1000 // 1 second
  private maxDelayMs = 30000 // 30 seconds
  private multiplier = 2

  /**
   * Calculate delay based on attempt number
   */
  calculateDelay(attemptNumber: number): number {
    const delay = this.baseDelayMs * Math.pow(this.multiplier, attemptNumber - 1)
    return Math.min(delay, this.maxDelayMs)
  }

  /**
   * Add jitter to prevent thundering herd
   */
  addJitter(delay: number): number {
    const jitter = Math.random() * 0.1 * delay // 10% jitter
    return delay + jitter
  }

  /**
   * Wait for calculated delay
   */
  async wait(attemptNumber: number): Promise<void> {
    const delay = this.calculateDelay(attemptNumber)
    const delayWithJitter = this.addJitter(delay)
    
    return new Promise(resolve => {
      setTimeout(resolve, delayWithJitter)
    })
  }
}

/**
 * Authentication-specific rate limiting
 */
export class AuthRateLimiter {
  private rateLimiter = new RateLimiter()
  private backoff = new ProgressiveBackoff()

  /**
   * Check and record authentication attempt
   */
  async checkAuthAttempt(email: string): Promise<{
    allowed: boolean
    result: RateLimitResult
  }> {
    const identifier = this.normalizeIdentifier(email)
    
    // Check current rate limit status
    const result = await this.rateLimiter.checkRateLimit('AUTH_ATTEMPTS', identifier)
    
    if (!result.allowed) {
      return { allowed: false, result }
    }

    // Record the attempt
    const updatedResult = await this.rateLimiter.recordAttempt('AUTH_ATTEMPTS', identifier)
    
    return { allowed: true, result: updatedResult }
  }

  /**
   * Handle failed authentication attempt with progressive backoff
   */
  async handleFailedAuth(email: string, attemptNumber: number): Promise<void> {
    // Wait with progressive backoff
    await this.backoff.wait(attemptNumber)
    
    // Additional logging could be added here
    console.warn(`Authentication failed for ${email}, attempt ${attemptNumber}`)
  }

  /**
   * Reset auth rate limit on successful login
   */
  async resetAuthLimit(email: string): Promise<void> {
    const identifier = this.normalizeIdentifier(email)
    await this.rateLimiter.resetRateLimit('AUTH_ATTEMPTS', identifier)
  }

  /**
   * Normalize email identifier for consistent rate limiting
   */
  private normalizeIdentifier(email: string): string {
    return email.toLowerCase().trim()
  }
}

/**
 * API request rate limiting
 */
export class APIRateLimiter {
  private rateLimiter = new RateLimiter()

  /**
   * Check API request rate limit
   */
  async checkAPIRequest(userId: string): Promise<RateLimitResult> {
    return this.rateLimiter.checkRateLimit('API_REQUESTS', userId)
  }

  /**
   * Record API request
   */
  async recordAPIRequest(userId: string): Promise<RateLimitResult> {
    return this.rateLimiter.recordAttempt('API_REQUESTS', userId)
  }
}

/**
 * Form submission rate limiting
 */
export class FormRateLimiter {
  private rateLimiter = new RateLimiter()

  /**
   * Check form submission rate limit
   */
  async checkFormSubmission(formType: string, userId?: string): Promise<RateLimitResult> {
    const identifier = userId || 'anonymous'
    const combinedId = `${formType}_${identifier}`
    
    return this.rateLimiter.checkRateLimit('FORM_SUBMISSIONS', combinedId)
  }

  /**
   * Record form submission
   */
  async recordFormSubmission(formType: string, userId?: string): Promise<RateLimitResult> {
    const identifier = userId || 'anonymous'
    const combinedId = `${formType}_${identifier}`
    
    return this.rateLimiter.recordAttempt('FORM_SUBMISSIONS', combinedId)
  }
}

// Export singleton instances
export const rateLimiter = new RateLimiter()
export const authRateLimiter = new AuthRateLimiter()
export const apiRateLimiter = new APIRateLimiter()
export const formRateLimiter = new FormRateLimiter()
export const progressiveBackoff = new ProgressiveBackoff()

/**
 * Utility function to format rate limit error message
 */
export const formatRateLimitError = (result: RateLimitResult): string => {
  if (result.retryAfter) {
    const minutes = Math.ceil(result.retryAfter / 60)
    return `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
  }
  
  return 'Rate limit exceeded. Please wait before trying again.'
}

/**
 * Rate limiting decorator for functions
 */
export const withRateLimit = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  type: RateLimitType,
  getIdentifier: (...args: T) => string
) => {
  return async (...args: T): Promise<R> => {
    const identifier = getIdentifier(...args)
    const result = await rateLimiter.checkRateLimit(type, identifier)
    
    if (!result.allowed) {
      throw new Error(formatRateLimitError(result))
    }
    
    // Record the attempt
    await rateLimiter.recordAttempt(type, identifier)
    
    return fn(...args)
  }
}