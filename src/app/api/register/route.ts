import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
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

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
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
      const { data: existingParticipant, error: checkError } = await supabase
        .from('participants')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (checkError) {
        throw checkError
      }

      if (existingParticipant) {
        return NextResponse.json(
          { error: `A participant with email ${email} already exists` },
          { status: 409 }
        )
      }
    }

    // Create team
    const { data: newTeam, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: validatedData.teamName,
      })
      .select()
      .single()

    if (teamError || !newTeam) {
      console.error('Team creation error:', teamError)
      return NextResponse.json(
        { error: 'Failed to create team' },
        { status: 500 }
      )
    }

    // Add team members
    const membersToInsert = [
      { ...validatedData.teamLeader, phoneNumber: validatedData.teamLeader.phoneNumber || null, isTeamLeader: true, teamId: newTeam.id },
      { ...validatedData.member2, phoneNumber: validatedData.member2.phoneNumber || null, isTeamLeader: false, teamId: newTeam.id },
      ...(validatedData.member3 ? [{ ...validatedData.member3, phoneNumber: validatedData.member3.phoneNumber || null, isTeamLeader: false, teamId: newTeam.id }] : []),
      ...(validatedData.member4 ? [{ ...validatedData.member4, phoneNumber: validatedData.member4.phoneNumber || null, isTeamLeader: false, teamId: newTeam.id }] : []),
    ].map((member) => ({
      team_id: member.teamId,
      first_name: member.firstName,
      last_name: member.lastName,
      email: member.email,
      phone_number: member.phoneNumber,
      university: member.university,
      specialty: member.specialty,
      year: member.year,
      is_team_leader: member.isTeamLeader,
    }))

    const { data: insertedMembers, error: membersError } = await supabase
      .from('participants')
      .insert(membersToInsert)
      .select()

    if (membersError || !insertedMembers) {
      console.error('Participants insertion error:', membersError)
      // Rollback team creation if participants fail (Supabase doesn't have cross-request transactions easily without RPC)
      // For now we'll just log and return error
      return NextResponse.json(
        { error: 'Failed to register team members' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Team registration successful',
        team: {
          id: newTeam.id,
          name: newTeam.name,
          memberCount: insertedMembers.length,
          registeredAt: newTeam.created_at,
        },
        members: insertedMembers.map((m) => ({
          id: m.id,
          firstName: m.first_name,
          lastName: m.last_name,
          email: m.email,
          isTeamLeader: m.is_team_leader,
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

