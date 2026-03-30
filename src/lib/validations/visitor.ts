import { z } from 'zod'

/**
 * Visitor registration form validation schema
 * Validates all fields for demo day visitor registration
 */
export const visitorSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),

  phoneNumber: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(20, 'Phone number must not exceed 20 characters')
    .regex(/^[\d\s+-]+$/, 'Phone number can only contain digits, spaces, hyphens, and plus signs'),

  organization: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(255, 'Organization name must not exceed 255 characters'),

  visitDate: z
    .string()
    .min(1, 'Please select a visit date'),
})

export type VisitorInput = z.infer<typeof visitorSchema>
