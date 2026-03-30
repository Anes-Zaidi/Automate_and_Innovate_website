import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { participants } from '@/lib/db/schema'
import { registrationSchema } from '@/lib/validations/registration'

/**
 * POST /api/register
 * Create a new participant registration
 */
export async function POST(request: NextRequest) {
  try {
    const db = getDb()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = registrationSchema.parse(body)

    // Check if email already exists
    const existingParticipant = await db.query.participants.findFirst({
      where: (p, { eq }) => eq(p.email, validatedData.email),
    })

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'A participant with this email already exists' },
        { status: 409 }
      )
    }

    // Insert participant into database
    const [newParticipant] = await db
      .insert(participants)
      .values({
        teamName: validatedData.teamName || null,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber || null,
        university: validatedData.university,
        specialty: validatedData.specialty,
        year: validatedData.year,
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        participant: {
          id: newParticipant.id,
          teamName: newParticipant.teamName,
          firstName: newParticipant.firstName,
          lastName: newParticipant.lastName,
          email: newParticipant.email,
          university: newParticipant.university,
          registeredAt: newParticipant.registeredAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    // Handle database errors
    if (error instanceof Error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { error: 'Failed to complete registration' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
