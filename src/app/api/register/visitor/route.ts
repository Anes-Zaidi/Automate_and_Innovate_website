import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { visitors } from '@/lib/db/schema'
import { visitorSchema } from '@/lib/validations/visitor'

/**
 * POST /api/register/visitor
 * Create a new visitor registration for demo day
 */
export async function POST(request: NextRequest) {
  try {
    const db = getDb()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = visitorSchema.parse(body)

    // Check if email already exists
    const existingVisitor = await db.query.visitors.findFirst({
      where: (v, { eq }) => eq(v.email, validatedData.email),
    })

    if (existingVisitor) {
      return NextResponse.json(
        { error: 'A visitor with this email already exists' },
        { status: 409 }
      )
    }

    // Insert visitor into database
    const [newVisitor] = await db
      .insert(visitors)
      .values({
        fullName: validatedData.fullName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber || null,
        organization: validatedData.organization,
        visitDate: validatedData.visitDate,
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        message: 'Visitor registration successful',
        visitor: {
          id: newVisitor.id,
          fullName: newVisitor.fullName,
          email: newVisitor.email,
          organization: newVisitor.organization,
          visitDate: newVisitor.visitDate,
          registeredAt: newVisitor.registeredAt,
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
      console.error('Visitor registration error:', error)
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
