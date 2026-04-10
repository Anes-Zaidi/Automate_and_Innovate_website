/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Reveal from '@/components/ui/reveal'
import { useToast } from '@/components/ui/toast'
import { visitorSchema } from '@/lib/validations/visitor'
import { Field, getInputClass } from '@/components/ui/field'
import { z } from 'zod'

type FormData = {
  fullName: string
  email: string
  phoneNumber: string
  organization: string
  visitDate: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function VisitorRegistrationForm() {
  const router = useRouter()
  const { addToast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    organization: '',
    visitDate: '',
  })

  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [csrfToken, setCsrfToken] = useState<string>('')

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf-token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken)
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
      }
    }

    fetchCsrfToken()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      organization: '',
      visitDate: '',
    })
    setStatus('idle')
    setErrorMessage('')
    setFieldErrors({})
  }

  const validate = (): boolean => {
    try {
      visitorSchema.parse(formData)
      setFieldErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setFieldErrors(newErrors)
        
        // Show the first error in a toast for quick feedback
        if (error.issues[0]) {
          addToast(error.issues[0].message, 'error')
        }
      }
      return false
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/register/visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          // Map backend validation errors back to fields
          const newErrors: Record<string, string> = {}
          data.details.forEach((d: any) => {
            if (d.path[0]) newErrors[d.path[0]] = d.message
          })
          setFieldErrors(newErrors)
          throw new Error('Please fix the errors below')
        }
        throw new Error(data.error || 'Registration failed')
      }

      setStatus('success')
      
      // Show success toast
      addToast('🎉 Visitor registration successful! See you at the demo day. Redirecting...', 'success')
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error) {
      setStatus('error')
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred'
      setErrorMessage(errorMsg)
      addToast(errorMsg, 'error')
    }
  }

  // Generate date options for the demo day (April 16-18, 2026)
  const dateOptions = [
    { value: '2026-04-16', label: 'April 16, 2026 - Day 1' },
    { value: '2026-04-17', label: 'April 17, 2026 - Day 2' },
    { value: '2026-04-18', label: 'April 18, 2026 - Demo Day' },
  ]

  return (
    <div className="w-full  min-h-screen flex items-center justify-center py-12 px-4 mt-16">
      <div className="w-full max-w-2xl">
        <Reveal direction="up" delay={0.2}>
          <h1 className="text-4xl font-bold text-white mb-12">Visitor Registration</h1>
        </Reveal>

        {/* Success Message */}
        {status === 'success' && (
          <Reveal direction="up" delay={0.3}>
            <div className="mb-8 p-4 bg-green-900/50 border border-green-500 rounded">
              <p className="text-green-400 font-medium">
                ✓ Visitor registration successful! See you at the demo day.
              </p>
            </div>
          </Reveal>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <Reveal direction="up" delay={0.3}>
            <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded">
              <p className="text-red-400 font-medium">
                ✗ {errorMessage}
              </p>
            </div>
          </Reveal>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <Reveal direction="up" delay={0.3}>
            <div className="mb-10">
              <Field label="Full Name" error={fieldErrors.fullName} required>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Zakaria Tikialine"
                  disabled={status === 'submitting'}
                  className={getInputClass(!!fieldErrors.fullName, 'orange')}
                />
              </Field>
            </div>
          </Reveal>
 
          {/* Contact Information */}
          <Reveal direction="up" delay={0.4}>
            <div className="mb-10 p-8 rounded-xl bg-[#0E1013] border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-5 rounded-full bg-orange-500" />
                <h2 className="text-white font-semibold text-base">Contact Information</h2>
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <Field label="Email Address" error={fieldErrors.email} required>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@estin.dz"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!fieldErrors.email, 'orange')}
                  />
                </Field>
                <Field label="Phone Number" error={fieldErrors.phoneNumber}>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="05XXXXXXXX"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!fieldErrors.phoneNumber, 'orange')}
                  />
                </Field>
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Field label="Organization" error={fieldErrors.organization} required>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company or University"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!fieldErrors.organization, 'orange')}
                  />
                </Field>
                <Field label="Visit Date" error={fieldErrors.visitDate} required>
                  <select
                    name="visitDate"
                    value={formData.visitDate}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    className={getInputClass(!!fieldErrors.visitDate, 'orange')}
                  >
                    <option value="" disabled>Select a date</option>
                    {dateOptions.map((date) => (
                      <option key={date.value} value={date.value}>
                        {date.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </Reveal>

          {/* Buttons */}
          <Reveal direction="up" delay={0.5}>
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={status === 'submitting'}
                className="px-8 py-3 bg-gray-700 text-white font-medium rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-8 py-3 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </Reveal>
        </form>
      </div>
    </div>
  )
}
