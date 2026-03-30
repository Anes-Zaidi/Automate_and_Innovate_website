# Database Setup Guide

## Prerequisites

You need a Neon PostgreSQL database. Follow these steps:

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update the `.env.local` file with your credentials:
```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
ADMIN_SECRET="your-secure-random-string-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generating a Secure Admin Secret

Generate a secure random string for the `ADMIN_SECRET`:
```bash
# Using openssl
openssl rand -hex 32

# Using node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Migration

### Push Schema (Development)

For development, you can push the schema directly:
```bash
pnpm db:push
```

### Generate Migrations (Production)

For production, generate migration files:
```bash
pnpm db:generate
pnpm db:migrate
```

### Open Drizzle Studio

Browse your database with Drizzle Studio:
```bash
pnpm db:studio
```

## API Endpoints

### Public Endpoints

#### POST `/api/register`
Submit a new registration.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "experience": "beginner",
  "occupation": "Student",
  "organization": "University Name",
  "skills": "JavaScript, React, Node.js",
  "motivation": "I want to learn AI and build innovative projects...",
  "agreeToCodeOfConduct": true,
  "agreeToPrivacyPolicy": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "participant": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "registeredAt": "2026-03-30T12:00:00Z"
  }
}
```

### Admin Endpoints

All admin endpoints require Bearer token authentication.

**Headers:**
```
Authorization: Bearer your-admin-secret
```

#### GET `/api/participants`
List all participants with pagination.

**Query Parameters:**
- `limit` (optional, default: 100, max: 500)
- `offset` (optional, default: 0)

**Response:**
```json
{
  "participants": [...],
  "pagination": {
    "total": 150,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

#### GET `/api/participants/:id`
Get a single participant by ID.

#### PUT `/api/participants/:id`
Update a participant by ID.

#### DELETE `/api/participants/:id`
Delete a participant by ID.

## Database Schema

### participants table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT RANDOM | Unique identifier |
| full_name | VARCHAR(100) | NOT NULL | Participant's full name |
| email | VARCHAR(255) | NOT NULL | Email address (unique) |
| phone | VARCHAR(20) | - | Phone number |
| experience | VARCHAR(20) | NOT NULL | beginner/intermediate/advanced |
| occupation | VARCHAR(100) | - | Student/Professional/etc |
| organization | VARCHAR(255) | - | University or company |
| skills | TEXT | - | Comma-separated skills |
| motivation | TEXT | - | Why they want to participate |
| agree_to_code_of_conduct | BOOLEAN | NOT NULL, DEFAULT FALSE | Code of conduct agreement |
| agree_to_privacy_policy | BOOLEAN | NOT NULL, DEFAULT FALSE | Privacy policy agreement |
| registered_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW | Registration timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW | Last update timestamp |

## Security Notes

- Never commit `.env.local` to version control
- Use a strong, unique `ADMIN_SECRET` in production
- All admin endpoints require Bearer token authentication
- Email addresses are unique to prevent duplicate registrations
- All inputs are validated using Zod schemas
- Database connection uses SSL/TLS
