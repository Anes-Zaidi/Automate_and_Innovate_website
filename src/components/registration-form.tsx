/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Reveal from '@/components/ui/reveal'
import { useToast } from '@/components/ui/toast'
import { teamMemberSchema } from '@/lib/validations/registration'

type TeamMember = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  university: string
  specialty: string
  year: string
}

type FormData = {
  teamName: string
  teamLeader: TeamMember
  member2: TeamMember
  member3: TeamMember
  member4: TeamMember
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const emptyMember: TeamMember = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  university: '',
  specialty: '',
  year: '',
}

const STORAGE_KEY = 'hackathon_registration_data'

const STEPS = [
  { label: 'Leader', key: 'teamLeader' },
  { label: 'Member 2', key: 'member2' },
  { label: 'Member 3', key: 'member3' },
  { label: 'Member 4', key: 'member4' },
] as const

// Reusable field component
function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default function RegistrationForm() {
  const router = useRouter()
  const { addToast } = useToast()
  const [step, setStep] = useState<number>(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    teamLeader: { ...emptyMember },
    member2: { ...emptyMember },
    member3: { ...emptyMember },
    member4: { ...emptyMember },
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [csrfToken, setCsrfToken] = useState<string>('')

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setFormData(parsed.formData || formData)
        setStep(parsed.step || 1)
      }
    } catch (error) {
      console.error('Failed to load saved registration data:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf-token')
        const data = await response.json()
        if (data.csrfToken) setCsrfToken(data.csrfToken)
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
      }
    }
    fetchCsrfToken()
  }, [])

  useEffect(() => {
    if (isLoaded && status !== 'success') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, step }))
      } catch (error) {
        console.error('Failed to save registration data:', error)
      }
    }
  }, [formData, step, isLoaded, status])

  const currentMemberKey = STEPS[step - 1].key as keyof FormData
  const currentMember = formData[currentMemberKey] as TeamMember

  const handleMemberChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [currentMemberKey]: {
        ...(prev[currentMemberKey] as TeamMember),
        [field]: value,
      },
    }))
  }

  const getFieldError = (field: string) => fieldErrors[`${currentMemberKey}.${field}`]

  const inputClass = (field: string) => {
    const hasError = getFieldError(field)
    return `w-full px-4 py-3 bg-[#111316] border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
      hasError
        ? 'border-red-500/60 focus:border-red-400'
        : 'border-white/10 focus:border-orange-500/60'
    }`
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1 && (!formData.teamName || formData.teamName.trim().length < 2)) {
      newErrors['teamName'] = 'Team name must be at least 2 characters'
    }

    try {
      teamMemberSchema.parse(currentMember)
    } catch (error: any) {
      if (Array.isArray(error?.errors)) {
        error.errors.forEach((err: any) => {
          const field = err.path?.[0] || 'unknown'
          newErrors[`${currentMemberKey}.${field}`] = err.message || 'Invalid value'
        })
      } else {
        newErrors[`${currentMemberKey}.general`] = 'Invalid information provided'
      }
    }

    setFieldErrors(newErrors)
    Object.values(newErrors).forEach((msg) => addToast(msg, 'error'))
    return Object.keys(newErrors).length === 0
  }

  const handleMemberSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validateCurrentStep()) return
    if (step < 4) {
      setStep(step + 1)
      setFieldErrors({})
      addToast(`Step ${step} completed!`, 'success')
    } else {
      handleSubmit(e)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setStatus('idle')
      setErrorMessage('')
      setFieldErrors({})
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateCurrentStep()) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        const errors = data.details?.map((d: any) => d.message).join(', ')
        throw new Error(errors || data.error || 'Registration failed')
      }

      setStatus('success')
      localStorage.removeItem(STORAGE_KEY)
      addToast('🎉 Registration successful! Redirecting...', 'success')
      setTimeout(() => router.push('/'), 2000)
    } catch (error) {
      setStatus('error')
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred'
      setErrorMessage(msg)
      addToast(msg, 'error')
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-24 px-4">
      <div className="w-full max-w-2xl">

        <Reveal direction="up" delay={0.1}>
          <div className="mb-10">
            <p className="text-orange-500 text-sm font-medium mb-2 uppercase tracking-widest">
              Hackathon
            </p>
            <h1 className="text-4xl font-bold text-white">Registration Form</h1>
          </div>
        </Reveal>

        {/* Step Progress */}
        <Reveal direction="up" delay={0.2}>
          <div className="flex items-center gap-0 mb-10">
            {STEPS.map((s, i) => {
              const stepNum = i + 1
              const isDone = step > stepNum
              const isActive = step === stepNum
              return (
                <div key={s.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                      style={{
                        backgroundColor: isDone ? '#F9621D' : isActive ? 'rgba(249,98,29,0.15)' : 'rgba(255,255,255,0.05)',
                        border: isActive ? '2px solid #F9621D' : isDone ? '2px solid #F9621D' : '2px solid rgba(255,255,255,0.1)',
                        color: isDone || isActive ? '#F9621D' : '#6b7280',
                      }}
                    >
                      {isDone ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span style={{ color: isActive ? '#F9621D' : '#6b7280' }}>{stepNum}</span>
                      )}
                    </div>
                    <span
                      className="text-xs font-medium whitespace-nowrap"
                      style={{ color: isActive ? '#fff' : isDone ? '#9ca3af' : '#4b5563' }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-px mx-2 mb-5 transition-all duration-300"
                      style={{ backgroundColor: step > stepNum ? '#F9621D' : 'rgba(255,255,255,0.08)' }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.3}>
          <div
            className="rounded-xl p-8"
            style={{ backgroundColor: '#0E1013', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Team Name — step 1 only */}
            {step === 1 && (
              <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Field label="Team Name" error={fieldErrors['teamName']}>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, teamName: e.target.value }))}
                    placeholder="e.g. Afak"
                    disabled={status === 'submitting'}
                    className={inputClass('teamName')}
                  />
                </Field>
              </div>
            )}

            {/* Section title */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: '#F9621D' }}
              />
              <h2 className="text-white font-semibold text-base">
                {STEPS[step - 1].label === 'Leader' ? 'Team Leader' : STEPS[step - 1].label} Information
              </h2>
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="First Name" error={getFieldError('firstName')}>
                  <input
                    type="text"
                    value={currentMember.firstName}
                    onChange={(e) => handleMemberChange('firstName', e.target.value)}
                    placeholder="Zakaria"
                    disabled={status === 'submitting'}
                    className={inputClass('firstName')}
                  />
                </Field>
                <Field label="Last Name" error={getFieldError('lastName')}>
                  <input
                    type="text"
                    value={currentMember.lastName}
                    onChange={(e) => handleMemberChange('lastName', e.target.value)}
                    placeholder="Tikialine"
                    disabled={status === 'submitting'}
                    className={inputClass('lastName')}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Email" error={getFieldError('email')}>
                  <input
                    type="email"
                    value={currentMember.email}
                    onChange={(e) => handleMemberChange('email', e.target.value)}
                    placeholder="exemple@estin.dz"
                    disabled={status === 'submitting'}
                    className={inputClass('email')}
                  />
                </Field>
                <Field label="Phone Number" error={getFieldError('phoneNumber')}>
                  <input
                    type="tel"
                    value={currentMember.phoneNumber}
                    onChange={(e) => handleMemberChange('phoneNumber', e.target.value)}
                    placeholder="05XXXXXXXX"
                    disabled={status === 'submitting'}
                    className={inputClass('phoneNumber')}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="University" error={getFieldError('university')}>
                  <input
                    type="text"
                    value={currentMember.university}
                    onChange={(e) => handleMemberChange('university', e.target.value)}
                    placeholder="ESTIN"
                    disabled={status === 'submitting'}
                    className={inputClass('university')}
                  />
                </Field>
                <Field label="Specialty" error={getFieldError('specialty')}>
                  <input
                    type="text"
                    value={currentMember.specialty}
                    onChange={(e) => handleMemberChange('specialty', e.target.value)}
                    placeholder="Informatique"
                    disabled={status === 'submitting'}
                    className={inputClass('specialty')}
                  />
                </Field>
              </div>

              <Field label="Academic Year" error={getFieldError('year')}>
                <input
                  type="number"
                  value={currentMember.year}
                  onChange={(e) => handleMemberChange('year', e.target.value)}
                  placeholder="2022"
                  disabled={status === 'submitting'}
                  className={inputClass('year')}
                  min="2020"
                  max="2026"
                />
              </Field>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={status === 'submitting' || step === 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F9621D', color: '#0A0A0A' }}
                >
                  {status === 'submitting' ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : step === 4 ? (
                    <>
                      Submit Registration
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Next Step
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  )
}