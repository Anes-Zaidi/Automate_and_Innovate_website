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

**Current State:** Frontend-only Next.js application  
**Needed:** Registration form backend, data storage  
**Framework:** Next.js 16.2.1 (App Router with API Routes)  
**Database:** To be determined (recommendations below)

## Recommended Architecture

### Option 1: Next.js API Routes + Serverless Database

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
- **Vercel Postgres** - Native integration, serverless
- **Supabase** - PostgreSQL with real-time features
- **PlanetScale** - MySQL-compatible, serverless
- **MongoDB Atlas** - Document database, flexible schema

### Option 2: External API Service

- Use serverless functions (Vercel, Netlify, AWS Lambda)
- Connect to external database
- Keep Next.js as pure frontend

## API Design Standards

### RESTful Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Submit registration |
| GET | `/api/participants` | List participants (admin) |
| GET | `/api/participants/:id` | Get participant details |
| PUT | `/api/participants/:id` | Update registration |
| DELETE | `/api/participants/:id` | Cancel registration |

### Request/Response Format

```typescript
// POST /api/register
// Request Body
{
  "fullName": string,
  "email": string,
  "phone": string,
  "teamName": string,
  "teamSize": number,
  "experience": "beginner" | "intermediate" | "advanced",
  "agreeToTerms": boolean
}

// Success Response (201)
{
  "success": true,
  "data": {
    "id": string,
    "registrationNumber": string,
    "submittedAt": string
  },
  "message": "Registration successful"
}

// Error Response (400/500)
{
  "success": false,
  "error": "Validation error message",
  "details": { field: "error message" }
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
  experience_level VARCHAR(20),
  agreed_to_terms BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_participants_registration_number ON participants(registration_number);
CREATE INDEX idx_participants_created_at ON participants(created_at);
```

## Data Validation Rules

### Registration Form Validation

```typescript
const registrationSchema = {
  fullName: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/
  },
  email: {
    type: 'string',
    required: true,
    format: 'email',
    maxLength: 255
  },
  phone: {
    type: 'string',
    required: false,
    pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  },
  teamName: {
    type: 'string',
    required: false,
    minLength: 2,
    maxLength: 100
  },
  teamSize: {
    type: 'number',
    required: false,
    min: 1,
    max: 10
  },
  experience: {
    type: 'string',
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  agreeToTerms: {
    type: 'boolean',
    required: true,
    mustBeTrue: true
  }
}
```

## API Route Implementation Pattern

```typescript
// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'  // Or your validation library

// Validation schema
const registerSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  // ... other fields
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate
    const validatedData = registerSchema.parse(body)
    
    // Process registration (save to database)
    const result = await saveRegistration(validatedData)
    
    return NextResponse.json({
      success: true,
      data: result
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
# or
MONGODB_URI=mongodb://...

# API Keys (if using external services)
SENDGRID_API_KEY=...
RESEND_API_KEY=...

# App Configuration
NEXT_PUBLIC_APP_URL=https://...
NODE_ENV=development|production
```

## Email Notification Flow

### Registration Confirmation

```typescript
// After successful registration
await sendEmail({
  to: participant.email,
  subject: 'Registration Confirmed - Automate & Innovate Hackathon',
  template: 'registration-confirmation',
  data: {
    name: participant.fullName,
    registrationNumber: participant.registrationNumber,
    eventDate: 'April 16-18, 2026',
    location: 'ESTIN Amizour Hub'
  }
})
```

## Security Considerations

### Rate Limiting

```typescript
// Limit registration submissions
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success } = await rateLimit(ip, { limit: 5, window: 3600 })
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  // ...
}
```

### Data Sanitization

- Sanitize all user inputs
- Use parameterized queries (prevent SQL injection)
- Escape output for XSS prevention
- Validate content types

### CORS Configuration

```typescript
// For API routes
export const runtime = 'edge'  // Optional: Edge runtime

// Handle CORS headers if needed
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
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
       │            │  Sanitization│            │
       │            └──────────────┘            │
       │                   │                    │
       │                   ▼                    │
       │            ┌──────────────┐            │
       │            │Email Service │            │
       │            │ (SendGrid)   │            │
       │            └──────────────┘            │
       ▼
┌─────────────┐
│    User     │
│  Feedback   │
└─────────────┘
```

## Testing Requirements

1. **Unit Tests:** Validation logic, utility functions
2. **Integration Tests:** API endpoints, database operations
3. **E2E Tests:** Full registration flow
4. **Load Tests:** Concurrent submissions

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
│   ├── db.ts              # Database connection
│   ├── validation.ts      # Validation schemas
│   ├── email.ts           # Email service
│   └── rate-limit.ts      # Rate limiting
└── types/
    └── registration.ts    # TypeScript types
```

## Best Practices

1. **Always** validate input data
2. **Always** use parameterized queries
3. **Always** handle errors gracefully
4. **Always** log errors (not sensitive data)
5. **Never** expose database credentials
6. **Never** return stack traces to client
7. **Use** transactions for multi-step operations
8. **Implement** proper error boundaries
