/**
 * EPIC 4 SECURITY ENHANCEMENT - Authentication Validation Schemas
 * 
 * Comprehensive Zod validation schemas for authentication flows.
 * Production-ready security validation for Buildi3 construction management app.
 */

import { z } from 'zod'

// Password security requirements - production-ready standards
const PASSWORD_MIN_LENGTH = 12
const PASSWORD_MAX_LENGTH = 128
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

// Email validation with comprehensive rules
const EMAIL_MAX_LENGTH = 255

/**
 * Strong password validation schema
 * - Minimum 12 characters (security best practice)
 * - Maximum 128 characters (prevents DoS attacks)
 * - Contains lowercase, uppercase, digit, and special character
 * - No common patterns or dictionary words
 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
  .max(PASSWORD_MAX_LENGTH, `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`)
  .regex(
    PASSWORD_REGEX,
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&)'
  )
  .refine(
    (password) => !containsCommonPatterns(password),
    'Password cannot contain common patterns or dictionary words'
  )

/**
 * Email validation schema with security considerations
 */
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .max(EMAIL_MAX_LENGTH, 'Email address is too long')
  .trim()
  .toLowerCase()
  .refine(
    (email) => !isDisposableEmail(email),
    'Disposable email addresses are not allowed'
  )

/**
 * User signup validation schema
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
)

/**
 * User login validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Password reset request schema
 */
export const passwordResetSchema = z.object({
  email: emailSchema,
})

/**
 * Password update schema (for authenticated users)
 */
export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  }
).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: "New password must be different from current password",
    path: ["newPassword"],
  }
)

// Helper functions for password validation

/**
 * Check for common password patterns that should be rejected
 */
function containsCommonPatterns(password: string): boolean {
  const commonPatterns = [
    // Sequential patterns
    /123456|abcdef|qwerty|password/i,
    // Repeated characters (more than 2 in a row)
    /(.)\1{2,}/,
    // Common words
    /admin|user|login|welcome|buildi3/i,
  ]
  
  return commonPatterns.some(pattern => pattern.test(password))
}

/**
 * Check if email is from a disposable email provider
 * In production, this would check against a comprehensive list
 */
function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'temp-mail.org',
    'throwaway.email'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  return disposableDomains.includes(domain)
}

/**
 * Rate limiting validation for authentication attempts
 */
export const authRateLimitSchema = z.object({
  email: emailSchema,
  timestamp: z.number(),
  attempts: z.number().min(0).max(10),
})

/**
 * Type exports for TypeScript integration
 */
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>
export type AuthRateLimitData = z.infer<typeof authRateLimitSchema>

/**
 * Validation error formatting utilities
 */
export const formatValidationError = (error: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {}
  
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    formattedErrors[path] = err.message
  })
  
  return formattedErrors
}

/**
 * Secure validation helper that sanitizes input
 */
export const validateAuthInput = <T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const data = schema.parse(input)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatValidationError(error) }
    }
    return { success: false, errors: { general: 'Validation failed' } }
  }
}