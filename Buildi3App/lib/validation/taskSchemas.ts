/**
 * EPIC 4 SECURITY ENHANCEMENT - Task & Project Validation Schemas
 * 
 * Comprehensive validation for construction management entities:
 * - Tasks with priority, status, and safety validation
 * - Projects with budget, timeline, and resource validation
 * - Material requests with cost and supplier validation
 */

import { z } from 'zod'

// Task validation constants
const TITLE_MIN_LENGTH = 3
const TITLE_MAX_LENGTH = 200
const DESCRIPTION_MAX_LENGTH = 2000
const LOCATION_MAX_LENGTH = 500
const SAFETY_NOTES_MAX_LENGTH = 1000

/**
 * Valid task statuses in construction workflow
 */
export const TASK_STATUSES = [
  'not-started',
  'in-progress', 
  'on-hold',
  'completed',
  'blocked',
  'cancelled'
] as const

/**
 * Valid task priorities
 */
export const TASK_PRIORITIES = [
  'low',
  'medium',
  'high',
  'critical'
] as const

/**
 * Valid task stages
 */
export const TASK_STAGES = [
  'planning',
  'preparation',
  'execution',
  'inspection',
  'completion',
  'handover'
] as const

/**
 * Valid trade requirements
 */
export const TRADE_REQUIREMENTS = [
  'electrical',
  'plumbing',
  'carpentry',
  'masonry',
  'hvac',
  'roofing',
  'concrete',
  'painting',
  'flooring',
  'general',
  'multiple'
] as const

/**
 * Title validation with security checks
 */
export const titleSchema = z
  .string()
  .trim()
  .min(TITLE_MIN_LENGTH, `Title must be at least ${TITLE_MIN_LENGTH} characters`)
  .max(TITLE_MAX_LENGTH, `Title must not exceed ${TITLE_MAX_LENGTH} characters`)
  .refine(
    (title) => !containsMaliciousContent(title),
    'Title contains invalid content'
  )

/**
 * Description validation with security checks
 */
export const descriptionSchema = z
  .string()
  .trim()
  .max(DESCRIPTION_MAX_LENGTH, `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters`)
  .refine(
    (desc) => !containsMaliciousContent(desc),
    'Description contains invalid content'
  )
  .optional()

/**
 * Date validation schema
 */
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .refine(
    (date) => {
      const d = new Date(date)
      return d instanceof Date && !isNaN(d.getTime())
    },
    'Invalid date value'
  )

/**
 * Due date validation (cannot be in the past)
 */
export const dueDateSchema = dateSchema
  .refine(
    (date) => new Date(date) >= new Date(new Date().toISOString().split('T')[0]),
    'Due date cannot be in the past'
  )
  .optional()

/**
 * Hours validation schema
 */
export const hoursSchema = z
  .number()
  .min(0.1, 'Hours must be at least 0.1')
  .max(24, 'Hours cannot exceed 24 per day')
  .multipleOf(0.1, 'Hours must be in 0.1 increments')

/**
 * Task priority validation
 */
export const prioritySchema = z.enum(TASK_PRIORITIES, {
  errorMap: () => ({ message: 'Please select a valid priority' })
})

/**
 * Task status validation
 */
export const statusSchema = z.enum(TASK_STATUSES, {
  errorMap: () => ({ message: 'Please select a valid status' })
})

/**
 * Task stage validation
 */
export const stageSchema = z.enum(TASK_STAGES, {
  errorMap: () => ({ message: 'Please select a valid stage' })
})

/**
 * Trade requirement validation
 */
export const tradeRequiredSchema = z.enum(TRADE_REQUIREMENTS, {
  errorMap: () => ({ message: 'Please select a valid trade requirement' })
}).optional()

/**
 * Location details validation
 */
export const locationDetailsSchema = z
  .string()
  .trim()
  .max(LOCATION_MAX_LENGTH, `Location details must not exceed ${LOCATION_MAX_LENGTH} characters`)
  .refine(
    (location) => !containsMaliciousContent(location),
    'Location details contain invalid content'
  )
  .optional()

/**
 * Safety notes validation
 */
export const safetyNotesSchema = z
  .string()
  .trim()
  .max(SAFETY_NOTES_MAX_LENGTH, `Safety notes must not exceed ${SAFETY_NOTES_MAX_LENGTH} characters`)
  .refine(
    (notes) => !containsMaliciousContent(notes),
    'Safety notes contain invalid content'
  )
  .optional()

/**
 * Materials needed validation
 */
export const materialSchema = z.object({
  name: z.string().min(1, 'Material name is required'),
  quantity: z.number().min(0.1, 'Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  estimatedCost: z.number().min(0, 'Cost cannot be negative').optional(),
  supplier: z.string().optional(),
  urgent: z.boolean().default(false),
})

export const materialsNeededSchema = z.array(materialSchema).optional()

/**
 * Complete task creation schema
 */
export const taskCreateSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  dueDate: dueDateSchema,
  priority: prioritySchema,
  projectId: z.string().uuid('Invalid project ID'),
  stage: stageSchema.default('planning'),
  status: statusSchema.default('not-started'),
  estimatedHours: hoursSchema.optional(),
  locationDetails: locationDetailsSchema,
  safetyNotes: safetyNotesSchema,
  tradeRequired: tradeRequiredSchema,
  weatherDependent: z.boolean().default(false),
  inspectionRequired: z.boolean().default(false),
  materialsNeeded: materialsNeededSchema,
})

/**
 * Task update schema (allows partial updates)
 */
export const taskUpdateSchema = taskCreateSchema.partial().extend({
  id: z.string().uuid('Invalid task ID'),
  actualHours: hoursSchema.optional(),
  completionNotes: descriptionSchema,
})

/**
 * Task assignment schema
 */
export const taskAssignmentSchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  assignedTo: z.string().uuid('Invalid user ID'),
  notes: descriptionSchema,
})

// Project Validation Schemas

/**
 * Valid project statuses
 */
export const PROJECT_STATUSES = [
  'planning',
  'active',
  'on-hold',
  'completed',
  'cancelled'
] as const

/**
 * Budget validation schema
 */
export const budgetSchema = z
  .number()
  .min(0, 'Budget cannot be negative')
  .max(10000000, 'Budget cannot exceed $10,000,000')
  .multipleOf(0.01, 'Budget must be in cents')

/**
 * Project status validation
 */
export const projectStatusSchema = z.enum(PROJECT_STATUSES, {
  errorMap: () => ({ message: 'Please select a valid project status' })
})

/**
 * Project creation schema
 */
export const projectCreateSchema = z.object({
  name: titleSchema,
  description: descriptionSchema,
  location: locationDetailsSchema,
  budget: budgetSchema.optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  estimatedCompletionDate: dateSchema.optional(),
  status: projectStatusSchema.default('planning'),
  weatherDependent: z.boolean().default(false),
  tradeCategories: z.array(z.enum(TRADE_REQUIREMENTS)).optional(),
  safetyRequirements: z.array(z.string()).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate)
    }
    return true
  },
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
)

/**
 * Project update schema
 */
export const projectUpdateSchema = projectCreateSchema.partial().extend({
  id: z.string().uuid('Invalid project ID'),
  progressPercentage: z.number().min(0).max(100).optional(),
  actualCompletionDate: dateSchema.optional(),
})

// Material Request Validation Schemas

/**
 * Material request priority levels
 */
export const MATERIAL_PRIORITIES = [
  'low',
  'medium',
  'high',
  'urgent'
] as const

/**
 * Material request statuses
 */
export const MATERIAL_STATUSES = [
  'pending',
  'approved',
  'ordered',
  'delivered',
  'cancelled'
] as const

/**
 * Supplier information schema
 */
export const supplierInfoSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  contact: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
}).optional()

/**
 * Material request schema
 */
export const materialRequestSchema = z.object({
  materialName: z.string().min(1, 'Material name is required'),
  description: descriptionSchema,
  quantity: z.number().min(0.1, 'Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  estimatedCost: z.number().min(0, 'Estimated cost cannot be negative').optional(),
  actualCost: z.number().min(0, 'Actual cost cannot be negative').optional(),
  priority: z.enum(MATERIAL_PRIORITIES).default('medium'),
  status: z.enum(MATERIAL_STATUSES).default('pending'),
  neededByDate: dueDateSchema,
  deliveryDate: dateSchema.optional(),
  projectId: z.string().uuid('Invalid project ID'),
  taskId: z.string().uuid('Invalid task ID').optional(),
  supplierInfo: supplierInfoSchema,
})

// Helper Functions

/**
 * Check for malicious content in user input
 */
function containsMaliciousContent(input: string): boolean {
  const maliciousPatterns = [
    // XSS patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b/gi,
    /<object\b/gi,
    /<embed\b/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    
    // SQL injection patterns
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/gi,
    /('|(\\x27)|(\\x2D\\x2D)|(\;)|(\\x3B))/gi,
    
    // Command injection patterns
    /(\||&|;|\$\(|\`)/g,
    
    // Path traversal
    /\.\.\//g,
    
    // Null bytes
    /\0/g,
  ]
  
  return maliciousPatterns.some(pattern => pattern.test(input))
}

/**
 * Sanitize HTML content
 */
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Type Exports
export type TaskStatus = typeof TASK_STATUSES[number]
export type TaskPriority = typeof TASK_PRIORITIES[number]
export type TaskStage = typeof TASK_STAGES[number]
export type TradeRequirement = typeof TRADE_REQUIREMENTS[number]
export type ProjectStatus = typeof PROJECT_STATUSES[number]
export type MaterialPriority = typeof MATERIAL_PRIORITIES[number]
export type MaterialStatus = typeof MATERIAL_STATUSES[number]

export type TaskCreateInput = z.infer<typeof taskCreateSchema>
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>
export type TaskAssignmentInput = z.infer<typeof taskAssignmentSchema>
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
export type MaterialRequestInput = z.infer<typeof materialRequestSchema>
export type MaterialInput = z.infer<typeof materialSchema>
export type SupplierInfo = z.infer<typeof supplierInfoSchema>

/**
 * Validation helper for construction entities
 */
export const validateConstructionInput = <T>(
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
    return { success: false, errors: { general: 'Validation failed' } }
  }
}