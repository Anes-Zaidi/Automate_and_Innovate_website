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
    .refine(
      (val) => {
        // Remove spaces, hyphens, and dots for validation
        const cleaned = val.replace(/[\s\-.]/g, '')
        
        // Algerian mobile: 05/06/07 + 8 digits OR +213 5/6/7 + 8 digits
        const mobileRegex = /^(0[567]\d{8}|\+213[567]\d{8})$/
        
        // Algerian landline: 02/03/04 + 8 digits OR +213 2/3/4 + 8 digits  
        const landlineRegex = /^(0[234]\d{8}|\+213[234]\d{8})$/
        
        return mobileRegex.test(cleaned) || landlineRegex.test(cleaned)
      },
      {
        message: 'Please enter a valid Algerian phone number (e.g., 05XX XX XX XX or +213 5XX XX XX XX)'
      }
    ),

  organization: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(255, 'Organization name must not exceed 255 characters'),

  visitDate: z
    .string()
    .min(1, 'Please select a visit date'),
})

export type VisitorInput = z.infer<typeof visitorSchema>
