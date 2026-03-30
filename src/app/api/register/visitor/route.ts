import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { visitors } from '@/lib/db/schema'
import { visitorSchema } from '@/lib/validations/visitor'

// Maximum request body size (10KB)
const MAX_BODY_SIZE = 10 * 1024

/**
 * POST /api/register/visitor
 * Create a new visitor registration for demo day
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
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      )
    }

    const validatedData = visitorSchema.parse(body)

    // Check if email already exists
    try {
      const existingVisitor = await db.query.visitors.findFirst({
        where: (v, { eq }) => eq(v.email, validatedData.email),
      })

      if (existingVisitor) {
        return NextResponse.json(
          { error: 'A visitor with this email already exists' },
          { status: 409 }
        )
      }
    } catch (dbError) {
      // Handle unique constraint violation
      if (dbError instanceof Error && dbError.message.includes('unique constraint')) {
        return NextResponse.json(
          { error: 'A visitor with this email already exists' },
          { status: 409 }
        )
      }
      throw dbError
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

    // Handle database errors - don't leak details
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
