import { NextResponse } from 'next/server'
import { generateCSRFToken, getCSRFToken, setCSRFToken } from '@/lib/csrf'

/**
 * GET /api/csrf-token
 * Get or refresh CSRF token for the client
 */
export async function GET() {
  let token = await getCSRFToken()

  if (!token) {
    token = generateCSRFToken()
    await setCSRFToken(token)
  }

  const response = NextResponse.json({ csrfToken: token })
  response.headers.set('X-CSRF-Token', token)
  return response
}
