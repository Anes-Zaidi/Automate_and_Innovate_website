// Test validation schema
import { teamMemberSchema } from './src/lib/validations/registration'

const testCases = [
  {
    name: 'Invalid phone (74578494)',
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '74578494',
      university: 'Test',
      specialty: 'Test',
      year: '2024',
    },
    shouldPass: false,
  },
  {
    name: 'Invalid email (123@ezaeezaeza)',
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: '123@ezaeezaeza',
      phoneNumber: '0556789012',
      university: 'Test',
      specialty: 'Test',
      year: '2024',
    },
    shouldPass: false,
  },
  {
    name: 'Valid Algerian data',
    data: {
      firstName: 'Mohamed',
      lastName: 'Benali',
      email: 'mohamed@example.com',
      phoneNumber: '0556789012',
      university: 'ESTIN',
      specialty: 'Informatique',
      year: '2024',
    },
    shouldPass: true,
  },
]

console.log('Testing validation schema...\n')

testCases.forEach((testCase) => {
  try {
    teamMemberSchema.parse(testCase.data)
    const passed = true
    const result = passed === testCase.shouldPass ? '✅ PASS' : '❌ FAIL'
    console.log(`${result} - ${testCase.name}`)
    if (passed !== testCase.shouldPass) {
      console.log(`  Expected: ${testCase.shouldPass ? 'valid' : 'invalid'}, Got: ${passed ? 'valid' : 'invalid'}`)
    }
  } catch (error: any) {
    const passed = false
    const result = passed === testCase.shouldPass ? '✅ PASS' : '❌ FAIL'
    console.log(`${result} - ${testCase.name}`)
    if (passed !== testCase.shouldPass) {
      console.log(`  Expected: ${testCase.shouldPass ? 'valid' : 'invalid'}, Got: ${passed ? 'valid' : 'invalid'}`)
      console.log(`  Errors:`, error.errors?.map((e: any) => e.message).join(', '))
    }
  }
})
