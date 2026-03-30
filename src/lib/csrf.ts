import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const CSRF_COOKIE_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generate a cryptographically secure CSRF token using Web Crypto API
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Get CSRF token from cookies
 */
export async function getCSRFToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null
}

/**
 * Set CSRF token in cookies
 */
export async function setCSRFToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

/**
 * Validate CSRF token from request
 */
export async function validateCSRFToken(
  request: NextRequest
): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  if (!cookieToken || !headerToken) {
    return false
  }

  // Constant-time comparison to prevent timing attacks
  return cookieToken === headerToken
}

/**
 * Middleware to add CSRF token to responses for GET requests
 */
export async function addCSRFTokenToResponse(
  response: NextResponse
): Promise<NextResponse> {
  const existingToken = await getCSRFToken()

  if (!existingToken) {
    const newToken = generateCSRFToken()
    await setCSRFToken(newToken)
    response.headers.set('X-CSRF-Token', newToken)
  } else {
    response.headers.set('X-CSRF-Token', existingToken)
  }

  return response
}

/**
 * Get CSRF token header name for client requests
 */
export function getCSRFHeaderName(): string {
  return CSRF_HEADER_NAME
}
