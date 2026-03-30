/**
 * Test fixtures and mock data for registration tests
 */

export const validTeamData = {
  teamName: 'Afak',
  teamLeader: {
    firstName: 'Bilel',
    lastName: 'Abbes',
    email: 'bilel@estin.dz',
    phoneNumber: '0555123456',
    university: 'ESTIN',
    specialty: 'Informatique',
    year: '2024',
  },
  member2: {
    firstName: 'Mohamed',
    lastName: 'Benali',
    email: 'mohamed@estin.dz',
    phoneNumber: '0555234567',
    university: 'ESTIN',
    specialty: 'Informatique',
    year: '2024',
  },
  member3: {
    firstName: 'Fatima',
    lastName: 'Zohra',
    email: 'fatima@estin.dz',
    phoneNumber: '0555345678',
    university: 'ESTIN',
    specialty: 'Systèmes et Réseaux',
    year: '2024',
  },
  member4: {
    firstName: 'Ahmed',
    lastName: 'Khalil',
    email: 'ahmed@estin.dz',
    phoneNumber: '0555456789',
    university: 'ESTIN',
    specialty: 'Data Science',
    year: '2024',
  },
}

export const validVisitorData = {
  fullName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '0555123456',
  organization: 'ESTIN',
  visitDate: '2026-04-18',
}

export const invalidTeamData = {
  missingEmail: {
    ...validTeamData,
    teamLeader: {
      ...validTeamData.teamLeader,
      email: '',
    },
  },
  invalidEmail: {
    ...validTeamData,
    teamLeader: {
      ...validTeamData.teamLeader,
      email: 'not-an-email',
    },
  },
  shortName: {
    ...validTeamData,
    teamName: 'A',
  },
  invalidPhone: {
    ...validTeamData,
    teamLeader: {
      ...validTeamData.teamLeader,
      phoneNumber: 'abc',
    },
  },
}

export const apiResponses = {
  success: {
    success: true,
    message: 'Team registration successful',
    team: {
      id: 'team-uuid',
      name: 'Afak',
      memberCount: 4,
      registeredAt: new Date().toISOString(),
    },
    members: [
      {
        id: 'member-1-uuid',
        firstName: 'Bilel',
        lastName: 'Abbes',
        email: 'bilel@estin.dz',
        isTeamLeader: true,
      },
      {
        id: 'member-2-uuid',
        firstName: 'Mohamed',
        lastName: 'Benali',
        email: 'mohamed@estin.dz',
        isTeamLeader: false,
      },
      {
        id: 'member-3-uuid',
        firstName: 'Fatima',
        lastName: 'Zohra',
        email: 'fatima@estin.dz',
        isTeamLeader: false,
      },
      {
        id: 'member-4-uuid',
        firstName: 'Ahmed',
        lastName: 'Khalil',
        email: 'ahmed@estin.dz',
        isTeamLeader: false,
      },
    ],
  },
  duplicateEmail: {
    error: 'A participant with this email already exists',
  },
  validationError: {
    error: 'Validation failed',
    details: [
      {
        code: 'invalid_string',
        validation: 'email',
        path: ['teamLeader', 'email'],
        message: 'Please enter a valid email address',
      },
    ],
  },
  serverError: {
    error: 'Failed to complete registration',
  },
}

/**
 * Creates a valid team member object
 */
export function createMember(overrides = {}) {
  return {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '0555123456',
    university: 'ESTIN',
    specialty: 'Informatique',
    year: '2024',
    ...overrides,
  }
}

/**
 * Creates a valid team object
 */
export function createTeam(overrides = {}) {
  return {
    teamName: 'Test Team',
    teamLeader: createMember({ email: 'leader@example.com' }),
    member2: createMember({ email: 'member2@example.com' }),
    member3: createMember({ email: 'member3@example.com' }),
    member4: createMember({ email: 'member4@example.com' }),
    ...overrides,
  }
}
