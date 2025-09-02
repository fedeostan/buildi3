/**
 * EPIC 4 SECURITY ENHANCEMENT - Validation Schemas Index
 * 
 * Central export point for all validation schemas in the Buildi3 construction app.
 * Provides type-safe, comprehensive input validation for production security.
 */

// Authentication Schemas
export {
  signupSchema,
  loginSchema,
  passwordResetSchema,
  passwordUpdateSchema,
  authRateLimitSchema,
  emailSchema,
  passwordSchema,
  formatValidationError,
  validateAuthInput,
  type SignupInput,
  type LoginInput,
  type PasswordResetInput,
  type PasswordUpdateInput,
  type AuthRateLimitData,
} from './authSchemas'

// Profile Schemas
export {
  profileSchema,
  onboardingSchema,
  profileUpdateSchema,
  fullProfileSchema,
  profileSecuritySchema,
  certificationSchema,
  nameSchema,
  phoneSchema,
  roleSchema,
  tradeSpecialtySchema,
  useCaseSchema,
  displayNameSchema,
  avatarUrlSchema,
  generateDisplayName,
  mapFrontendRoleToDatabase,
  validateProfileInput,
  USER_ROLES,
  TRADE_SPECIALTIES,
  USE_CASES,
  type UserRole,
  type TradeSpecialty,
  type UseCase,
  type ProfileInput,
  type OnboardingInput,
  type ProfileUpdateInput,
  type CertificationInput,
  type FullProfileInput,
} from './profileSchemas'

// Task and Project Schemas
export {
  taskCreateSchema,
  taskUpdateSchema,
  taskAssignmentSchema,
  projectCreateSchema,
  projectUpdateSchema,
  materialRequestSchema,
  titleSchema,
  descriptionSchema,
  dateSchema,
  dueDateSchema,
  hoursSchema,
  prioritySchema,
  statusSchema,
  stageSchema,
  tradeRequiredSchema,
  locationDetailsSchema,
  safetyNotesSchema,
  materialsNeededSchema,
  budgetSchema,
  projectStatusSchema,
  supplierInfoSchema,
  sanitizeHtml,
  validateConstructionInput,
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_STAGES,
  TRADE_REQUIREMENTS,
  PROJECT_STATUSES,
  MATERIAL_PRIORITIES,
  MATERIAL_STATUSES,
  type TaskStatus,
  type TaskPriority,
  type TaskStage,
  type TradeRequirement,
  type ProjectStatus,
  type MaterialPriority,
  type MaterialStatus,
  type TaskCreateInput,
  type TaskUpdateInput,
  type TaskAssignmentInput,
  type ProjectCreateInput,
  type ProjectUpdateInput,
  type MaterialRequestInput,
  type MaterialInput,
  type SupplierInfo,
} from './taskSchemas'

/**
 * Universal validation helper that works with any schema
 */
export const validate = <T>(
  schema: import('zod').ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const data = schema.parse(input)
    return { success: true, data }
  } catch (error) {
    if (error instanceof import('zod').ZodError) {
      const formattedErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        formattedErrors[path] = err.message
      })
      return { success: false, errors: formattedErrors }
    }
    return { success: false, errors: { general: 'Validation failed' } }
  }
}

/**
 * Validation configuration for production deployment
 */
export const VALIDATION_CONFIG = {
  // Authentication
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
  
  // Content limits
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 2000,
  LOCATION_MAX_LENGTH: 500,
  SAFETY_NOTES_MAX_LENGTH: 1000,
  
  // Business rules
  MAX_BUDGET: 10000000, // $10M
  MAX_HOURS_PER_TASK: 24,
  MAX_MATERIALS_PER_TASK: 50,
  
  // Rate limiting
  AUTH_ATTEMPTS_PER_MINUTE: 3,
  API_REQUESTS_PER_MINUTE: 60,
  FORM_SUBMISSIONS_PER_MINUTE: 10,
} as const

/**
 * Security validation patterns
 */
export const SECURITY_PATTERNS = {
  XSS_DETECTION: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  SQL_INJECTION: /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/gi,
  COMMAND_INJECTION: /(\||&|;|\$\(|\`)/g,
  PATH_TRAVERSAL: /\.\.\//g,
} as const