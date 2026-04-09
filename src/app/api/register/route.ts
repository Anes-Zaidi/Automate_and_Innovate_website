import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { teams, participants } from '@/lib/db/schema'
import { registrationSchema } from '@/lib/validations/registration'

// Maximum request body size (10KB)
const MAX_BODY_SIZE = 10 * 1024

/**
 * POST /api/register
 * Create a new team registration with members
 */
export async function POST(request: NextRequest) {
  try {
    // Check content length
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Request body too large' },
        { status: 413 }
      )
    }

    const db = getDb()

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      )
    }

    const validatedData = registrationSchema.parse(body)

    // Check if any team member email already exists
    const allEmails = [
      validatedData.teamLeader.email,
      validatedData.member2.email,
      ...(validatedData.member3 ? [validatedData.member3.email] : []),
      ...(validatedData.member4 ? [validatedData.member4.email] : []),
    ]

    for (const email of allEmails) {
      const existingParticipant = await db.query.participants.findFirst({
        where: (p, { eq }) => eq(p.email, email),
      })

      if (existingParticipant) {
        return NextResponse.json(
          { error: `A participant with email ${email} already exists` },
          { status: 409 }
        )
      }
    }

    // Create team
    const [newTeam] = await db
      .insert(teams)
      .values({
        name: validatedData.teamName,
      })
      .returning()

    // Add team members
    const membersToInsert: Array<{
      firstName: string
      lastName: string
      email: string
      phoneNumber: string | null
      university: string
      specialty: string
      year: string
      isTeamLeader: boolean
    }> = [
      { ...validatedData.teamLeader, phoneNumber: validatedData.teamLeader.phoneNumber || null, isTeamLeader: true },
      { ...validatedData.member2, phoneNumber: validatedData.member2.phoneNumber || null, isTeamLeader: false },
      ...(validatedData.member3 ? [{ ...validatedData.member3, phoneNumber: validatedData.member3.phoneNumber || null, isTeamLeader: false }] : []),
      ...(validatedData.member4 ? [{ ...validatedData.member4, phoneNumber: validatedData.member4.phoneNumber || null, isTeamLeader: false }] : []),
    ]

    const insertedMembers = await db
      .insert(participants)
      .values(
        membersToInsert.map((member) => ({
          teamId: newTeam.id,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phoneNumber: member.phoneNumber,
          university: member.university,
          specialty: member.specialty,
          year: member.year,
          isTeamLeader: member.isTeamLeader,
        }))
      )
      .returning()

    return NextResponse.json(
      {
        success: true,
        message: 'Team registration successful',
        team: {
          id: newTeam.id,
          name: newTeam.name,
          memberCount: insertedMembers.length,
          registeredAt: newTeam.createdAt,
        },
        members: insertedMembers.map((m) => ({
          id: m.id,
          firstName: m.firstName,
          lastName: m.lastName,
          email: m.email,
          isTeamLeader: m.isTeamLeader,
        })),
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

    // Handle database errors - don't leak details
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
