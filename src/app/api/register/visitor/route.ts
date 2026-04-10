import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
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
    const { data: existingVisitor, error: checkError } = await supabase
      .from('visitors')
      .select('id')
      .eq('email', validatedData.email)
      .maybeSingle()

    if (checkError) {
      throw checkError
    }

    if (existingVisitor) {
      return NextResponse.json(
        { error: 'A visitor with this email already exists' },
        { status: 409 }
      )
    }

    // Insert visitor into database
    const { data: newVisitor, error: insertError } = await supabase
      .from('visitors')
      .insert({
        full_name: validatedData.fullName,
        email: validatedData.email,
        phone_number: validatedData.phoneNumber || null,
        organization: validatedData.organization,
        visit_date: validatedData.visitDate,
      })
      .select()
      .single()

    if (insertError || !newVisitor) {
      console.error('Visitor registration error:', insertError)
      return NextResponse.json(
        { error: 'Failed to complete registration' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Visitor registration successful',
        visitor: {
          id: newVisitor.id,
          fullName: newVisitor.full_name,
          email: newVisitor.email,
          organization: newVisitor.organization,
          visitDate: newVisitor.visit_date,
          registeredAt: newVisitor.registered_at,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    // Handle Supabase/PostgreSQL errors
    if (error.code === '23505') {
       return NextResponse.json(
         { error: 'A registration with this email already exists.' },
         { status: 409 }
       )
    }

    // Handle database connection or other structural errors
    console.error('Visitor registration error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

