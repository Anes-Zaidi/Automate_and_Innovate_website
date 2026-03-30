# Backend Agent Instructions - SOAI Automate Hackathon

## Role and Responsibilities

You are the **Backend Development Agent** for the SOAI Automate Hackathon web application. Your role is to:

- Design and implement API endpoints
- Define database schemas and data models
- Handle data validation and sanitization
- Implement authentication/authorization if needed
- Ensure data integrity and security
- Plan data flow between frontend and backend

## Project Context

**Current State:** Frontend-only Next.js application with landing page (Hero, About, Sponsors, Schedules, Training Tracks, Speakers, Visitors sections)  
**Needed:** Registration form backend, data storage, email notifications  
**Framework:** Next.js 16.2.1 (App Router with API Routes)  
**Database:** To be determined (recommendations below)

## Recommended Architecture

### Option 1: Next.js API Routes + Serverless Database (Recommended)

```
src/
├── app/
│   └── api/
│       ├── register/
│       │   └── route.ts      # POST handler for registration
│       └── participants/
│           └── route.ts      # GET handler (admin)
```

**Database Options:**
- **Vercel Postgres** - Native integration, serverless (Recommended)
- **Supabase** - PostgreSQL with real-time features, built-in auth
- **PlanetScale** - MySQL-compatible, serverless
- **MongoDB Atlas** - Document database, flexible schema

### Option 2: External API Service

- Use serverless functions (Vercel, Netlify, AWS Lambda)
- Connect to external database
- Keep Next.js as pure frontend

## API Design Standards

### RESTful Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Submit registration | No |
| GET | `/api/participants` | List participants | Yes (Admin) |
| GET | `/api/participants/:id` | Get participant details | Yes (Admin) |
| PUT | `/api/participants/:id` | Update registration | Yes (Admin) |
| DELETE | `/api/participants/:id` | Cancel registration | Yes (Admin) |

### Request/Response Format

```typescript
// POST /api/register
// Request Body
{
  "fullName": string,        // 2-100 chars, letters/spaces/hyphens only
  "email": string,           // Valid email format
  "phone": string,           // Optional, international format
  "teamName": string,        // Optional, 2-100 chars
  "teamSize": number,        // Optional, 1-10
  "experience": "beginner" | "intermediate" | "advanced",
  "agreeToTerms": boolean,   // Must be true
  "newsletterOptIn": boolean // Optional, default false
}

// Success Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "registrationNumber": "AH2026-XXXX",
    "submittedAt": "2026-04-01T10:00:00Z"
  },
  "message": "Registration successful! Check your email for confirmation."
}

// Error Response (400/500)
{
  "success": false,
  "error": "Validation error message",
  "details": { 
    "field": "error message" 
  }
}
```

## Database Schema Design

### Participants Table

```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  team_name VARCHAR(100),
  team_size INTEGER DEFAULT 1,
  experience_level VARCHAR(20) NOT NULL,
  newsletter_opt_in BOOLEAN DEFAULT FALSE,
  agreed_to_terms BOOLEAN NOT NULL,
  registration_source VARCHAR(50) DEFAULT 'web',
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_participants_registration_number ON participants(registration_number);
CREATE INDEX idx_participants_created_at ON participants(created_at);
CREATE INDEX idx_participants_experience ON participants(experience_level);
```

### Registration Numbers Table (for tracking)

```sql
CREATE TABLE registration_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_registrations INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Data Validation Rules

### Registration Form Validation (Zod Schema)

```typescript
import { z } from 'zod'

const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255)
    .transform((val) => val.toLowerCase()),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s-()]+$/.test(val),
      'Please enter a valid phone number'
    ),

  teamName: z
    .string()
    .optional()
    .min(2, 'Team name must be at least 2 characters')
    .max(100, 'Team name must be less than 100 characters'),

  teamSize: z
    .number()
    .optional()
    .min(1, 'Team size must be at least 1')
    .max(10, 'Team size cannot exceed 10'),

  experience: z
    .enum(
      ['beginner', 'intermediate', 'advanced'],
      { errorMap: () => ({ message: 'Please select your experience level' }) }
    ),

  agreeToTerms: z
    .boolean()
    .refine(val => val === true, {
      message: 'You must agree to the terms and conditions'
    }),

  newsletterOptIn: z
    .boolean()
    .optional()
    .default(false)
})

export type RegistrationData = z.infer<typeof registrationSchema>
```

## API Route Implementation Pattern

```typescript
// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { registrationSchema } from '@/lib/validation'
import { db } from '@/lib/db'
import { sendConfirmationEmail } from '@/lib/email'
import { ratelimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? '127.0.0.1'
    const { success: rateLimitSuccess } = await ratelimit.limit(ip)

    if (!rateLimitSuccess) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many registration attempts. Please try again later.' 
        },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = registrationSchema.parse(body)

    // Check for duplicate email
    const existingParticipant = await db.participants.findUnique({
      where: { email: validatedData.email }
    })

    if (existingParticipant) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This email is already registered',
          details: { email: 'A participant with this email already exists' }
        },
        { status: 409 }
      )
    }

    // Generate registration number
    const registrationNumber = await generateRegistrationNumber()

    // Save to database
    const participant = await db.participants.create({
      data: {
        ...validatedData,
        registrationNumber,
        experienceLevel: validatedData.experience
      }
    })

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(participant).catch(console.error)

    return NextResponse.json({
      success: true,
      data: {
        id: participant.id,
        registrationNumber: participant.registrationNumber,
        submittedAt: participant.createdAt
      },
      message: 'Registration successful! Check your email for confirmation.'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message
          return acc
        }, {} as Record<string, string>)
      }, { status: 400 })
    }

    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    }, { status: 500 })
  }
}
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Email Service
SENDGRID_API_KEY=
# or
RESEND_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=https://soai-automate.vercel.app
NEXT_PUBLIC_EVENT_DATE=2026-04-16T09:00:00Z

# Admin (if needed)
ADMIN_EMAIL=admin@soai-automate.com
```

## Email Notification Flow

### Registration Confirmation Email

```typescript
// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail(participant: {
  id: string
  email: string
  fullName: string
  registrationNumber: string
}) {
  try {
    await resend.emails.send({
      from: 'SOAI Automate <noreply@soai-automate.com>',
      to: participant.email,
      subject: 'Registration Confirmed - Automate & Innovate Hackathon',
      html: `
        <div style="font-family: Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #F9621D;">Registration Confirmed!</h1>
          <p>Hi ${participant.fullName},</p>
          <p>Thank you for registering for the <strong>Automate & Innovate Hackathon</strong>.</p>
          <div style="background: #0C0F14; color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Registration Number:</strong> ${participant.registrationNumber}</p>
            <p><strong>Event Date:</strong> April 16-18, 2026</p>
            <p><strong>Location:</strong> ESTIN Amizour Hub</p>
          </div>
          <p>We'll send you more details as the event approaches.</p>
          <p>Best regards,<br/>The SOAI Automate Team</p>
        </div>
      `
    })

    // Mark email as sent in database
    await db.participants.update({
      where: { id: participant.id },
      data: { emailSent: true }
    })

    console.log(`Confirmation email sent to ${participant.email}`)
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    throw error
  }
}
```

### Reminder Email (Scheduled)

```typescript
// Send 1 day before event
export async function sendReminderEmail() {
  const participants = await db.participants.findMany({
    where: { emailSent: true }
  })

  for (const participant of participants) {
    await resend.emails.send({
      from: 'SOAI Automate <noreply@soai-automate.com>',
      to: participant.email,
      subject: 'Reminder: Hackathon Starts Tomorrow!',
      html: `...`
    })
  }
}
```

## Security Considerations

### Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour per IP
  analytics: true,
  prefix: 'soai-automate:ratelimit'
})
```

### Data Sanitization

- ✅ Sanitize all user inputs (Zod handles this)
- ✅ Use parameterized queries (Prisma/Drizzle ORM)
- ✅ Escape output for XSS prevention
- ✅ Validate content types (application/json)

### CORS Configuration

```typescript
// For API routes (if needed)
import { NextResponse } from 'next/server'

export function corsHeaders(origin: string) {
  const allowedOrigins = [
    'https://soai-automate.vercel.app',
    'http://localhost:3000'
  ]
  
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}
```

## Database Connection

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

## Data Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│  API Route   │────▶│  Database   │
│  (React)    │     │ (Next.js)    │     │ (Postgres)  │
└─────────────┘     └──────────────┘     └─────────────┘
       │                   │                    │
       │                   ▼                    │
       │            ┌──────────────┐            │
       │            │  Validation  │            │
       │            │  (Zod)       │            │
       │            └──────────────┘            │
       │                   │                    │
       │                   ▼                    │
       │            ┌──────────────┐            │
       │            │Rate Limiting │            │
       │            │  (Redis)     │            │
       │            └──────────────┘            │
       │                   │                    │
       │                   ▼                    │
       │            ┌──────────────┐            │
       │            │Email Service │            │
       │            │  (Resend)    │            │
       │            └──────────────┘            │
       ▼
┌─────────────┐
│    User     │
│  Feedback   │
└─────────────┘
```

## Testing Requirements

1. **Unit Tests:** Validation logic, utility functions, email templates
2. **Integration Tests:** API endpoints, database operations
3. **E2E Tests:** Full registration flow with email verification
4. **Load Tests:** Concurrent submissions (100+ simultaneous requests)

## Files to Create

```
src/
├── app/
│   └── api/
│       ├── register/
│       │   └── route.ts
│       └── participants/
│           └── route.ts
├── lib/
│   ├── db.ts              # Database connection (Prisma/Drizzle)
│   ├── validation.ts      # Zod validation schemas
│   ├── email.ts           # Email service (Resend/SendGrid)
│   ├── rate-limit.ts      # Rate limiting (Upstash Redis)
│   └── utils.ts           # Helper functions (registration number generator)
├── types/
│   └── registration.ts    # TypeScript types/interfaces
└── emails/
    └── confirmation.tsx   # Email template (React Email)
```

## Best Practices

1. **Always** validate input data with Zod
2. **Always** use parameterized queries (prevent SQL injection)
3. **Always** handle errors gracefully with proper HTTP status codes
4. **Always** log errors (never log sensitive data like passwords, emails)
5. **Never** expose database credentials or API keys in client code
6. **Never** return stack traces to client in production
7. **Use** transactions for multi-step operations
8. **Implement** proper error boundaries and fallbacks
9. **Use** HTTPS in production (enforced by Vercel)
10. **Hash** any sensitive data if stored (not needed for registration)

## Admin Dashboard (Future)

```typescript
// src/app/api/participants/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Verify admin access
  const isAdmin = await verifyAdmin(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const participants = await db.participants.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ success: true, data: participants })
}
```

## Registration Number Generator

```typescript
// Generate format: AH2026-XXXX
export async function generateRegistrationNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `AH${year}-${randomNum}`
}
```
