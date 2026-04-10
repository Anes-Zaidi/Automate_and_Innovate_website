import { z } from 'zod'

/**
 * Visitor registration form validation schema
 * Validates all fields for demo day visitor registration
 */
export const visitorSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@domain.com)')
    .max(255, 'Email must not exceed 255 characters'),

  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .min(8, 'Phone number must be at least 8 digits')
    .max(20, 'Phone number must not exceed 20 characters')
    .refine(
      (val) => {
        const cleaned = val.replace(/[\s\-.]/g, '')
        const mobileRegex = /^(0[567]\d{8}|\+213[567]\d{8})$/
        const landlineRegex = /^(0[234]\d{8}|\+213[234]\d{8})$/
        return mobileRegex.test(cleaned) || landlineRegex.test(cleaned)
      },
      {
        message: 'Must be a valid Algerian number (e.g. 0550123456 or +213660123456)'
      }
    ),

  organization: z
    .string()
    .min(1, 'Organization is required')
    .min(2, 'Organization name must be at least 2 characters')
    .max(255, 'Organization name must not exceed 255 characters'),

  visitDate: z
    .string()
    .min(1, 'Please select a visit date'),
})

export type VisitorInput = z.infer<typeof visitorSchema>
