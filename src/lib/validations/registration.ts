import { z } from 'zod'

/**
 * Team member validation schema
 * Validates individual team member fields
 */
export const teamMemberSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters')
    .refine(
      (val) => val.includes('@'),
      'Email must contain @ symbol'
    ),

  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(14, 'Phone number must not exceed 14 characters')
    .regex(
      /^(\+213|0)[5-7][0-9]{8}$/,
      'Phone number must be a valid Algerian number (e.g., 05XXXXXXXX or +2135XXXXXXXX)'
    ),

  university: z
    .string()
    .min(2, 'University name must be at least 2 characters')
    .max(255, 'University name must not exceed 255 characters'),

  specialty: z
    .string()
    .min(2, 'Specialty must be at least 2 characters')
    .max(100, 'Specialty must not exceed 100 characters'),

  year: z
    .string()
    .min(4, 'Year must be at least 4 characters')
    .max(10, 'Year must not exceed 10 characters')
    .regex(/^[0-9]{4}$/, 'Year must be a 4-digit number (e.g., 2024)'),
})

/**
 * Registration form validation schema
 * Validates all fields according to business rules
 */
export const registrationSchema = z.object({
  teamName: z
    .string()
    .min(2, 'Team name must be at least 2 characters')
    .max(100, 'Team name must not exceed 100 characters'),

  teamLeader: teamMemberSchema,
  member2: teamMemberSchema,
  member3: teamMemberSchema.optional(),
  member4: teamMemberSchema.optional(),
})

export type TeamMember = z.infer<typeof teamMemberSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
