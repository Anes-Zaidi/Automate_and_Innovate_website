import { z } from 'zod'

/**
 * Team member validation schema
 * Validates individual team member fields
 */
export const teamMemberSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@domain.com)')
    .max(255, 'Email must not exceed 255 characters'),

  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .min(10, 'Phone number must be at least 10 digits')
    .max(14, 'Phone number must not exceed 14 characters')
    .regex(
      /^(\+213|0)[5-7][0-9]{8}$/,
      'Must be a valid Algerian number (e.g. 0550123456 or +213660123456)'
    ),

  university: z
    .string()
    .min(1, 'University is required')
    .min(2, 'University name must be at least 2 characters')
    .max(255, 'University name must not exceed 255 characters'),

  specialty: z
    .string()
    .min(1, 'Specialty is required')
    .min(2, 'Specialty must be at least 2 characters')
    .max(100, 'Specialty must not exceed 100 characters'),

  role: z.enum(['backend(n8n)', 'frontend'], {
    message: 'Please select a valid role'
  }),
})

/**
 * Registration form validation schema
 * Validates all fields according to business rules
 */
export const registrationSchema = z.object({
  teamName: z
    .string()
    .min(1, 'Team name is required')
    .min(2, 'Team name must be at least 2 characters')
    .max(100, 'Team name must not exceed 100 characters'),

  teamLeader: teamMemberSchema,
  member2: teamMemberSchema,
  member3: teamMemberSchema.optional(),
  member4: teamMemberSchema.optional(),
})

export type TeamMember = z.infer<typeof teamMemberSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
