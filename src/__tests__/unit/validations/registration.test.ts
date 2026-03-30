import { describe, it, expect } from 'vitest'
import { registrationSchema } from '@/lib/validations/registration'
import { visitorSchema } from '@/lib/validations/visitor'

describe('Registration Validation Schema', () => {
  describe('teamName', () => {
    it('validates valid team name', () => {
      const result = registrationSchema.safeParse({
        teamName: 'Afak',
        teamLeader: createValidMember(),
        member2: createValidMember(),
        member3: createValidMember(),
        member4: createValidMember(),
      })

      expect(result.success).toBe(true)
    })

    it('rejects team name shorter than 2 characters', () => {
      const result = registrationSchema.safeParse({
        teamName: 'A',
        teamLeader: createValidMember(),
        member2: createValidMember(),
        member3: createValidMember(),
        member4: createValidMember(),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters')
      }
    })

    it('rejects team name longer than 100 characters', () => {
      const result = registrationSchema.safeParse({
        teamName: 'a'.repeat(101),
        teamLeader: createValidMember(),
        member2: createValidMember(),
        member3: createValidMember(),
        member4: createValidMember(),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('not exceed 100 characters')
      }
    })
  })

  describe('teamMember', () => {
    it('validates valid member data', () => {
      const result = registrationSchema.safeParse({
        teamName: 'Afak',
        teamLeader: createValidMember(),
        member2: createValidMember(),
        member3: createValidMember(),
        member4: createValidMember(),
      })

      expect(result.success).toBe(true)
    })

    it('rejects invalid email format', () => {
      const result = registrationSchema.safeParse({
        teamName: 'Afak',
        teamLeader: { ...createValidMember(), email: 'invalid-email' },
        member2: createValidMember(),
        member3: createValidMember(),
        member4: createValidMember(),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email')
      }
    })

    it('rejects phone number with invalid characters', () => {
      const result = registrationSchema.safeParse({
        teamName: 'Afak',
        teamLeader: { ...createValidMember(), phoneNumber: 'abc123' },
        member2: createValidMember(),
        member3: createValidMember(),
        member4: createValidMember(),
      })

      expect(result.success).toBe(false)
    })

    it('rejects first name with numbers', () => {
      const result = registrationSchema.safeParse({
        teamName: 'Afak',
        teamLeader: { ...createValidMember(), firstName: 'John123' },
        member2: createValidMember(),
        member3: createValidMember(),
        member4: createValidMember(),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('only contain letters')
      }
    })

    it('accepts first name with hyphens', () => {
      const result = registrationSchema.safeParse({
        teamName: 'Afak',
        teamLeader: { ...createValidMember(), firstName: 'Jean-Pierre' },
        member2: createValidMember(),
        member3: createValidMember(),
        member4: createValidMember(),
      })

      expect(result.success).toBe(true)
    })

    it('accepts first name with apostrophes', () => {
      const result = registrationSchema.safeParse({
        teamName: 'Afak',
        teamLeader: { ...createValidMember(), firstName: "D'Angelo" },
        member2: createValidMember(),
        member3: createValidMember(),
        member4: createValidMember(),
      })

      expect(result.success).toBe(true)
    })
  })
})

describe('Visitor Validation Schema', () => {
  it('validates valid visitor data', () => {
    const result = visitorSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '123456789',
      organization: 'Estin',
      visitDate: '2026-04-16',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = visitorSchema.safeParse({
      fullName: 'John Doe',
      email: 'invalid',
      phoneNumber: '123456789',
      organization: 'Estin',
      visitDate: '2026-04-16',
    })

    expect(result.success).toBe(false)
  })

  it('rejects short phone number', () => {
    const result = visitorSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '123',
      organization: 'Estin',
      visitDate: '2026-04-16',
    })

    expect(result.success).toBe(false)
  })

  it('rejects missing visit date', () => {
    const result = visitorSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '123456789',
      organization: 'Estin',
      visitDate: '',
    })

    expect(result.success).toBe(false)
  })
})

function createValidMember() {
  return {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '123456789',
    university: 'Estin',
    specialty: 'Informatique',
    year: '2024',
  }
}
