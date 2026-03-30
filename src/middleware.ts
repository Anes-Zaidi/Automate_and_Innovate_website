import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateCSRFToken, getCSRFToken, validateCSRFToken } from '@/lib/csrf'

// Simple in-memory store for rate limiting
// In production, use a distributed store like Redis or Upstash
const requestCounts = new Map<string, { count: number; timestamp: number }>()

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // Max 100 requests per window
}

// Stricter limits for registration endpoints
const REGISTRATION_RATE_LIMIT = {
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
  MAX_REQUESTS: 5, // Max 5 registration attempts per hour
}

// Bot detection patterns
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /slurp/i,
  /wget/i,
  /curl/i,
  /python/i,
  /node/i,
  /go-http-client/i,
  /java/i,
  /php/i,
  /perl/i,
  /scrapy/i,
  /axios/i,
  /httpclient/i,
  /postman/i,
  /insomnia/i,
  /python-requests/i,
  /fasthttp/i,
  /aiohttp/i,
  /http\.rb/i,
  /faraday/i,
  /mechanize/i,
  /selenium/i,
  /phantomjs/i,
  /headless/i,
  /puppeteer/i,
  /playwright/i,
  /undici/i,
  /node-fetch/i,
  /got/i,
  /request-promise/i,
  /superagent/i,
  /ky/i,
  /ofetch/i,
  /axios-fetch/i,
  /fetch-ponyfill/i,
  /cross-fetch/i,
  /isomorphic-fetch/i,
  /node-libcurl/i,
  /request/i,
]

/**
 * Check if user agent is a bot
 */
function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true // Block requests without user-agent
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent))
}

/**
 * Check rate limit for general requests
 */
function isRateLimited(ip: string, isRegistration = false): boolean {
  const now = Date.now()
  const config = isRegistration ? REGISTRATION_RATE_LIMIT : RATE_LIMIT
  const windowStart = now - config.WINDOW_MS

  // Clean up old entries
  for (const [key, value] of requestCounts.entries()) {
    if (value.timestamp < windowStart) {
      requestCounts.delete(key)
    }
  }

  // Get current count for IP
  const ipRecord = requestCounts.get(ip)

  if (!ipRecord) {
    // First request from this IP
    requestCounts.set(ip, { count: 1, timestamp: now })
    return false
  }

  // Check if rate limit exceeded
  if (ipRecord.count >= config.MAX_REQUESTS) {
    return true
  }

  // Increment count
  requestCounts.set(ip, {
    count: ipRecord.count + 1,
    timestamp: now,
  })

  return false
}

/**
 * Get client IP from request
 */
function getClientIp(req: NextRequest): string {
  // Try to get IP from various headers
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Handle multiple IPs in the header
    const ips = forwardedFor.split(',').map((ip) => ip.trim())
    return ips[0] // Take the first IP
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to unknown if no IP found
  return 'unknown'
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.neon.tech",
      "frame-ancestors 'none'",
    ].join('; ')
  )

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // HSTS (HTTP Strict Transport Security)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  return response
}

export async function middleware(req: NextRequest) {
  const ip = getClientIp(req)
  const userAgent = req.headers.get('user-agent')
  const pathname = req.nextUrl.pathname

  // Only apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Bot detection - block automated attacks
    if (isBot(userAgent)) {
      console.warn(`🛡️ Blocked bot request from IP: ${ip}`)
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden - Automated requests not allowed' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Stricter rate limiting for registration endpoints
    const isRegistration = pathname.startsWith('/api/register')
    if (isRateLimited(ip, isRegistration)) {
      const limit = isRegistration
        ? REGISTRATION_RATE_LIMIT.MAX_REQUESTS
        : RATE_LIMIT.MAX_REQUESTS
      const window = isRegistration
        ? REGISTRATION_RATE_LIMIT.WINDOW_MS / 60000
        : RATE_LIMIT.WINDOW_MS / 60000

      console.warn(
        `🛡️ Rate limited request from IP: ${ip} (${pathname})`
      )
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `You have exceeded ${limit} requests per ${window} minutes. Please try again later.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(isRegistration ? 3600 : 900),
          },
        }
      )
    }

    // CSRF protection for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const isValid = await validateCSRFToken(req)
      if (!isValid) {
        console.warn(`🛡️ CSRF validation failed from IP: ${ip}`)
        return new NextResponse(
          JSON.stringify({ error: 'Forbidden - Invalid CSRF token' }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
    }
  }

  // Continue to the next middleware/route
  let response = NextResponse.next()

  // Add CSRF token to responses for client to use
  // Only for non-API GET requests (pages) - API will handle themselves
  if (req.method === 'GET' && !pathname.startsWith('/api/')) {
    const token = await getCSRFToken()
    if (!token) {
      const newToken = generateCSRFToken()
      response.cookies.set('csrf_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      })
      response.headers.set('X-CSRF-Token', newToken)
    } else {
      response.headers.set('X-CSRF-Token', token)
    }
  }

  // Add security headers to all responses
  return addSecurityHeaders(response)
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all routes for CSRF and security headers
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
