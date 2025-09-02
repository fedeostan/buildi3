/**
 * EPIC 4 SECURITY ENHANCEMENT - Profile Validation Schemas
 * 
 * Comprehensive Zod validation schemas for user profile management.
 * Includes role-based validation and construction industry specializations.
 */

import { z } from 'zod'

// Name validation constants
const NAME_MIN_LENGTH = 1
const NAME_MAX_LENGTH = 100
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{10,15}$/

/**
 * Valid user roles in the construction management system
 */
export const USER_ROLES = [
  'project_manager',
  'site_supervisor', 
  'foreman',
  'worker',
  'manager',
  'inspector',
  'admin'
] as const

/**
 * Valid trade specializations
 */
export const TRADE_SPECIALTIES = [
  'electrical',
  'plumbing', 
  'carpentry',
  'masonry',
  'hvac',
  'roofing',
  'concrete',
  'painting',
  'flooring',
  'general'
] as const

/**
 * Valid use case categories
 */
export const USE_CASES = [
  'project_management',
  'task_coordination',
  'team_communication',
  'progress_tracking',
  'safety_compliance',
  'resource_management'
] as const

/**
 * Name validation schema with sanitization
 */
export const nameSchema = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH, 'Name is required')
  .max(NAME_MAX_LENGTH, `Name must not exceed ${NAME_MAX_LENGTH} characters`)
  .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .refine(
    (name) => !name.match(/\s{2,}/),
    'Name cannot contain multiple consecutive spaces'
  )

/**
 * Phone number validation schema
 */
export const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE_REGEX, 'Please enter a valid phone number')
  .optional()

/**
 * User role validation schema
 */
export const roleSchema = z.enum(USER_ROLES, {
  errorMap: () => ({ message: 'Please select a valid role' })
})

/**
 * Trade specialty validation schema
 */
export const tradeSpecialtySchema = z.enum(TRADE_SPECIALTIES, {
  errorMap: () => ({ message: 'Please select a valid trade specialty' })
}).optional()

/**
 * Use case validation schema
 */
export const useCaseSchema = z.enum(USE_CASES, {
  errorMap: () => ({ message: 'Please select a valid use case' })
}).optional()

/**
 * Complete profile creation/update schema
 */
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  role: roleSchema,
  tradeSpecialty: tradeSpecialtySchema,
  useCase: useCaseSchema,
})

/**
 * Onboarding completion schema
 */
export const onboardingSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(['manager', 'architect', 'technician', 'employee'], {
    errorMap: () => ({ message: 'Please select your role' })
  }),
  useCase: z.string().min(1, 'Please select your primary use case'),
  jobDescription: z.string().min(1, 'Please select your job description'),
}).refine(
  (data) => {
    // Ensure role and job description are compatible
    const compatibleRoles: Record<string, string[]> = {
      'manager': ['project_manager', 'site_supervisor'],
      'architect': ['project_manager'],
      'technician': ['foreman', 'worker'],
      'employee': ['worker', 'foreman']
    }
    
    return compatibleRoles[data.role]?.length > 0
  },
  {
    message: 'Selected role and job description are not compatible',
    path: ['role']
  }
)

/**
 * Profile update schema (partial updates allowed)
 */
export const profileUpdateSchema = profileSchema.partial()

/**
 * Display name generation and validation
 */
export const displayNameSchema = z
  .string()
  .trim()
  .min(1, 'Display name is required')
  .max(200, 'Display name is too long')
  .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Display name contains invalid characters')

/**
 * Avatar URL validation schema
 */
export const avatarUrlSchema = z
  .string()
  .url('Please provide a valid URL')
  .refine(
    (url) => url.match(/\.(jpg|jpeg|png|gif|webp)$/i),
    'Avatar must be an image file (jpg, jpeg, png, gif, webp)'
  )
  .optional()

/**
 * Certification validation schema
 */
export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuing organization is required'),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  certificateNumber: z.string().optional(),
  isVerified: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.expiryDate) {
      return new Date(data.issueDate) < new Date(data.expiryDate)
    }
    return true
  },
  {
    message: 'Expiry date must be after issue date',
    path: ['expiryDate']
  }
)

/**
 * Complete profile with certifications schema
 */
export const fullProfileSchema = profileSchema.extend({
  displayName: displayNameSchema.optional(),
  avatarUrl: avatarUrlSchema,
  certifications: z.array(certificationSchema).optional(),
})

/**
 * Profile security validation - checks for suspicious patterns
 */
export const profileSecuritySchema = z.object({
  firstName: nameSchema.refine(
    (name) => !containsSuspiciousPatterns(name),
    'Name contains suspicious patterns'
  ),
  lastName: nameSchema.refine(
    (name) => !containsSuspiciousPatterns(name),
    'Name contains suspicious patterns'
  ),
  phone: phoneSchema,
  role: roleSchema,
})

// Helper functions

/**
 * Check for suspicious patterns in names (XSS, injection attempts)
 */
function containsSuspiciousPatterns(input: string): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /\${/,
    /\{\{/,
    /\[object/i,
    /function\s*\(/i,
    /alert\s*\(/i,
    /eval\s*\(/i,
    /DROP\s+TABLE/i,
    /SELECT\s+\*/i,
    /INSERT\s+INTO/i,
    /UPDATE\s+SET/i,
    /DELETE\s+FROM/i,
  ]
  
  return suspiciousPatterns.some(pattern => pattern.test(input))
}

/**
 * Generate display name from first and last name
 */
export const generateDisplayName = (firstName: string, lastName: string): string => {
  const sanitizedFirst = firstName.trim()
  const sanitizedLast = lastName.trim()
  return `${sanitizedFirst} ${sanitizedLast}`.trim()
}

/**
 * Map frontend roles to database roles
 */
export const mapFrontendRoleToDatabase = (frontendRole: string): string => {
  const roleMapping: Record<string, string> = {
    'manager': 'project_manager',
    'architect': 'project_manager',
    'technician': 'foreman',
    'employee': 'worker'
  }
  
  return roleMapping[frontendRole] || frontendRole
}

/**
 * Type exports
 */
export type UserRole = typeof USER_ROLES[number]
export type TradeSpecialty = typeof TRADE_SPECIALTIES[number]
export type UseCase = typeof USE_CASES[number]
export type ProfileInput = z.infer<typeof profileSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type CertificationInput = z.infer<typeof certificationSchema>
export type FullProfileInput = z.infer<typeof fullProfileSchema>

/**
 * Validation helper for profile operations
 */
export const validateProfileInput = <T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const data = schema.parse(input)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        formattedErrors[path] = err.message
      })
      return { success: false, errors: formattedErrors }
    }
    return { success: false, errors: { general: 'Profile validation failed' } }
  }
}