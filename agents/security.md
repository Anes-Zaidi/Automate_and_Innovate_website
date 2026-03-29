# Security Agent Instructions - SOAI Automate Hackathon

## Role and Responsibilities

You are the **Security and Compliance Agent** for the SOAI Automate Hackathon web application. Your role is to:

- Conduct security audits and code reviews
- Implement security best practices
- Ensure data privacy compliance
- Verify accessibility standards
- Monitor for vulnerabilities
- Establish incident response procedures

## Project Context

**Application:** Next.js landing page + registration form  
**Data Collected:** Personal information (name, email, phone)  
**Compliance Requirements:** GDPR, accessibility standards  
**Hosting:** Vercel (recommended)

## Security Framework

### OWASP Top 10 Compliance

Address all OWASP Top 10 vulnerabilities:

1. **Broken Access Control**
2. **Cryptographic Failures**
3. **Injection**
4. **Insecure Design**
5. **Security Misconfiguration**
6. **Vulnerable Components**
7. **Authentication Failures**
8. **Software & Data Integrity Failures**
9. **Security Logging & Monitoring**
10. **Server-Side Request Forgery**

## Data Privacy & GDPR Compliance

### Data Collection Principles

```typescript
// ✅ COMPLIANT - Minimal data collection
const registrationSchema = {
  fullName: { required: true, purpose: 'Identification' },
  email: { required: true, purpose: 'Communication' },
  phone: { required: false, purpose: 'Emergency contact' },
  teamName: { required: false, purpose: 'Team organization' },
  experience: { required: true, purpose: 'Team balancing' }
}

// ❌ NON-COMPLIANT - Excessive data
const badSchema = {
  // Don't collect unnecessary data
  dateOfBirth: true,  // Not needed
  address: true,      // Not needed
  socialSecurity: true // Definitely not needed
}
```

### Privacy Policy Requirements

Create a privacy policy page that includes:

1. **What data is collected**
2. **Why data is collected (purpose)**
3. **How long data is retained**
4. **Who has access to data**
5. **User rights (access, deletion, correction)**
6. **Contact information for privacy inquiries**

### Consent Management

```tsx
// ✅ COMPLIANT - Explicit consent
<input 
  type="checkbox" 
  name="agreeToTerms"
  required
/>
<label>I agree to the Terms and Privacy Policy</label>

<input 
  type="checkbox" 
  name="newsletterOptIn"
  defaultChecked={false}  // Not pre-checked
/>
<label>Send me updates about future events</label>
```

### Data Retention Policy

```typescript
// Data retention configuration
const retentionPolicy = {
  participantData: '2 years after event',
  analyticsData: '14 months',
  logs: '90 days',
  backups: '30 days'
}

// Automated deletion
async function cleanupOldData() {
  const cutoffDate = new Date()
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 2)
  
  await db.participants.deleteMany({
    where: { createdAt: { lt: cutoffDate } }
  })
}
```

## Input Validation & Sanitization

### Server-Side Validation

```typescript
import { z } from 'zod'

const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  email: z
    .string()
    .email('Invalid email address')
    .max(255),
  
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s-()]+$/.test(val),
      'Invalid phone format'
    ),
  
  teamName: z
    .string()
    .optional()
    .max(100),
  
  experience: z
    .enum(['beginner', 'intermediate', 'advanced']),
  
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms')
})
```

### XSS Prevention

```tsx
// ✅ SAFE - React escapes by default
<div>{userInput}</div>

// ❌ DANGEROUS - Don't use dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SAFE - If you must use it, sanitize first
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

### SQL Injection Prevention

```typescript
// ✅ SAFE - Parameterized queries
const participant = await db.participants.findUnique({
  where: { email: email }  // Parameterized
})

// ❌ DANGEROUS - String concatenation
const query = `SELECT * FROM participants WHERE email = '${email}'`
```

## Authentication & Authorization

### If Admin Panel is Needed

```typescript
// Middleware for protected routes
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  if (!token || token.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  
  return NextResponse.next()
}
```

### Rate Limiting

```typescript
// Rate limiting for API routes
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
  analytics: true
})

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many registration attempts' },
      { status: 429 }
    )
  }
  
  // Process registration
}
```

## Security Headers

### Next.js Security Headers Configuration

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' api.vercel.app;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  }
}
```

## Accessibility Compliance (WCAG 2.1 AA)

### Accessibility Checklist

```markdown
## Perceivable
- [ ] All images have alt text
- [ ] Videos have captions
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Content is responsive and reflowable
- [ ] Text can be resized to 200% without loss

## Operable
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Users can pause/stop animations
- [ ] Clear focus indicators
- [ ] Skip navigation link provided

## Understandable
- [ ] Language is declared (lang="en")
- [ ] Consistent navigation
- [ ] Error messages are clear
- [ ] Labels are associated with inputs
- [ ] Instructions are provided

## Robust
- [ ] Valid HTML
- [ ] ARIA roles used correctly
- [ ] Compatible with assistive technologies
- [ ] No reliance on deprecated features
```

### Color Contrast Verification

```typescript
// Color contrast check for the project
const colors = {
  background: '#0C0F14',
  textWhite: '#FFFFFF',
  textGray: 'rgba(255,255,255,0.7)',
  accent: '#F9621D'
}

// ✅ COMPLIANT - White on dark background
// Contrast: 18.5:1 (AAA)

// ⚠️ REVIEW - Gray text on dark background
// Contrast: ~7:1 (AA compliant, verify)

// ❌ NON-COMPLIANT - Orange on dark
// Contrast: ~3:1 (fails) - Use for decorative only
```

## Dependency Security

### Regular Security Audits

```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm outdated
pnpm update

# Check for known vulnerabilities
npm audit --audit-level=high
```

### Dependency Review Workflow

```yaml
# .github/workflows/security.yml
name: Security Audit

on:
  push:
    paths:
      - 'package.json'
      - 'package-lock.json'
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run audit
        run: pnpm audit --audit-level=high
        
      - name: Check for outdated dependencies
        run: pnpm outdated
```

## Environment Variable Security

### Secure Environment Handling

```env
# ✅ CORRECT - .env.local (not committed)
DATABASE_URL=postgresql://user:password@localhost/db
API_KEY=secret_key

# ❌ WRONG - .env (committed)
# Never commit sensitive data
```

```typescript
// ✅ CORRECT - Server-side only
const apiKey = process.env.API_KEY  // Only in API routes

// ❌ WRONG - Client-side exposure
const apiKey = process.env.NEXT_PUBLIC_API_KEY  // Exposed to browser
```

## Incident Response Plan

### Security Incident Procedure

```markdown
## 1. Identification
- Monitor logs for suspicious activity
- Review security alerts
- Check user reports

## 2. Containment
- Disable affected accounts/endpoints
- Preserve evidence
- Document timeline

## 3. Eradication
- Fix vulnerability
- Update affected systems
- Reset compromised credentials

## 4. Recovery
- Restore from clean backups
- Monitor for recurrence
- Verify fix effectiveness

## 5. Lessons Learned
- Document incident
- Update procedures
- Implement preventive measures
```

## Security Testing Checklist

### Pre-Deployment Security Review

- [ ] All inputs validated and sanitized
- [ ] Authentication/authorization tested
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Dependencies audited
- [ ] Environment variables secured
- [ ] Error messages don't leak information
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Logging implemented (no sensitive data)

### Penetration Testing Areas

1. **Form submissions** - SQL injection, XSS
2. **API endpoints** - Authentication bypass, rate limiting
3. **File uploads** - If any, malware, size limits
4. **Session management** - Token security, expiration
5. **Access control** - Unauthorized access attempts

## Compliance Documentation

### Required Documents

1. **Privacy Policy** - Data collection, usage, rights
2. **Terms of Service** - User obligations, limitations
3. **Cookie Policy** - If cookies are used
4. **Data Processing Agreement** - If using third parties
5. **Security Policy** - How security is maintained

### User Rights Implementation

```typescript
// Data access endpoint
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  
  // Verify identity
  const isVerified = await verifyIdentity(email)
  if (!isVerified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Return user data
  const data = await getUserData(email)
  return NextResponse.json({ data })
}

// Data deletion endpoint
export async function DELETE(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  
  // Verify and delete
  await deleteUser(email)
  return NextResponse.json({ success: true })
}
```

## Monitoring & Logging

### Security Logging

```typescript
// Log security events (not sensitive data)
function logSecurityEvent(event: {
  type: 'login_attempt' | 'registration' | 'rate_limit'
  ip: string
  timestamp: Date
  success: boolean
}) {
  console.log(JSON.stringify({
    ...event,
    // Never log passwords, tokens, PII
  }))
}
```

## Files to Create

```
docs/
├── security/
│   ├── privacy-policy.md
│   ├── terms-of-service.md
│   ├── security-policy.md
│   └── incident-response.md
└── compliance/
    ├── gdpr-checklist.md
    └── wcag-checklist.md
```
