/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Reveal from '@/components/ui/reveal'
import { useToast } from '@/components/ui/toast'
import { teamMemberSchema } from '@/lib/validations/registration'
import { Field, getInputClass } from '@/components/ui/field'

type TeamMember = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  university: string
  specialty: string
  role: string
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
  role: '',
}

const STORAGE_KEY = 'hackathon_registration_data'

const STEPS = [
  { label: 'Leader', key: 'teamLeader' },
  { label: 'Member 2', key: 'member2' },
  { label: 'Member 3 (Optional)', key: 'member3' },
  { label: 'Member 4 (Optional)', key: 'member4' },
] as const

// Removed local Field component

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
        setFormData(prev => parsed.formData || prev)
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

    // Clear field error when user starts typing
    if (fieldErrors[`${currentMemberKey}.${field}`]) {
      setFieldErrors(prev => {
        const next = { ...prev }
        delete next[`${currentMemberKey}.${field}`]
        return next
      })
    }
  }

  // Helper to check if a member has any data filled in
  const isMemberStarted = (member: TeamMember) => {
    return Object.values(member).some(val => val.trim() !== '')
  }

  const getFieldError = (field: string) => fieldErrors[`${currentMemberKey}.${field}`]

  // Using imported getInputClass instead of local inputClass

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1 && (!formData.teamName || formData.teamName.trim().length < 2)) {
      newErrors['teamName'] = 'Team name must be at least 2 characters'
    }

    if (step >= 3 && !isMemberStarted(currentMember)) {
      // Optional member (3 or 4) and not started, so it's valid
      setFieldErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const result = teamMemberSchema.safeParse(currentMember)
    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = String(err.path[0]) || 'general'
        newErrors[`${currentMemberKey}.${field}`] = err.message || 'Invalid value'
      })
    }

    setFieldErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      addToast('Please fix the errors highlighted below', 'error')
    }
    
    return Object.keys(newErrors).length === 0
  }

  const validateEntireForm = (): boolean => {
    const allErrors: Record<string, string> = {}
    let firstErrorStep = step

    if (!formData.teamName || formData.teamName.trim().length < 2) {
      allErrors['teamName'] = 'Team name must be at least 2 characters'
      firstErrorStep = 1
    }

    const membersToValidate = [
      { key: 'teamLeader', stepNum: 1 },
      { key: 'member2', stepNum: 2 },
    ]
    
    if (isMemberStarted(formData.member3 as TeamMember)) {
      membersToValidate.push({ key: 'member3', stepNum: 3 })
    }
    
    if (isMemberStarted(formData.member4 as TeamMember)) {
      membersToValidate.push({ key: 'member4', stepNum: 4 })
    }

    membersToValidate.forEach(({ key, stepNum }) => {
      const result = teamMemberSchema.safeParse(formData[key as keyof FormData])
      if (!result.success) {
        result.error.issues.forEach((err) => {
          const field = String(err.path[0]) || 'general'
          allErrors[`${key}.${field}`] = err.message || 'Invalid value'
        })
        if (firstErrorStep === step) firstErrorStep = stepNum
        else if (stepNum < firstErrorStep) firstErrorStep = stepNum
      }
    })

    setFieldErrors(allErrors)
    
    if (Object.keys(allErrors).length > 0) {
      if (firstErrorStep !== step) setStep(firstErrorStep)
      addToast('Please fix the errors highlighted below', 'error')
      return false
    }
    
    return true
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

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    
    // Always validate the entire form before submitting
    if (!validateEntireForm()) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      // Create a submission object that only includes filled optional members
      const submissionData: any = {
        teamName: formData.teamName,
        teamLeader: formData.teamLeader,
        member2: formData.member2,
      }

      // Only include optional members if we've reached their steps and they have data
      if (step >= 3 && isMemberStarted(formData.member3)) {
        submissionData.member3 = formData.member3
      }
      if (step >= 4 && isMemberStarted(formData.member4)) {
        submissionData.member4 = formData.member4
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify(submissionData),
      })

      const data = await response.json()

      if (!response.ok) {
        const validationErrors: Record<string, string> = {}
        let hasFieldErrors = false

        if (data.details && Array.isArray(data.details)) {
          data.details.forEach((d: any) => {
            if (d.path && d.path.length > 0) {
              const fieldPath = d.path.join('.')
              validationErrors[fieldPath] = d.message
              hasFieldErrors = true
            }
          })
        }

        if (hasFieldErrors) {
          setFieldErrors(validationErrors)
          throw new Error('Please fix the errors highlighted in the form.')
        }

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
      
      // Scroll to top of form to see error
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
            {/* Error Message Summary */}
            {status === 'error' && errorMessage && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-5 h-5 rounded-full bg-red-500 shrink-0 flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-red-400 font-bold text-sm uppercase tracking-tight mb-1">Registration Error</h3>
                  <p className="text-red-300/80 text-sm leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}
            {/* Team Name — step 1 only */}
            {step === 1 && (
              <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Field label="Team Name" error={fieldErrors['teamName']} required>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, teamName: e.target.value }))
                      if (fieldErrors['teamName']) setFieldErrors(prev => {
                        const next = { ...prev }; delete next['teamName']; return next
                      })
                    }}
                    placeholder="e.g. Afak"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!fieldErrors['teamName'], 'orange')}
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
                <Field label="First Name" error={getFieldError('firstName')} required>
                  <input
                    type="text"
                    value={currentMember.firstName}
                    onChange={(e) => handleMemberChange('firstName', e.target.value)}
                    placeholder="Zakaria"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!getFieldError('firstName'), 'orange')}
                  />
                </Field>
                <Field label="Last Name" error={getFieldError('lastName')} required>
                  <input
                    type="text"
                    value={currentMember.lastName}
                    onChange={(e) => handleMemberChange('lastName', e.target.value)}
                    placeholder="Tikialine"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!getFieldError('lastName'), 'orange')}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Email" error={getFieldError('email')} required>
                  <input
                    type="email"
                    value={currentMember.email}
                    onChange={(e) => handleMemberChange('email', e.target.value)}
                    placeholder="exemple@estin.dz"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!getFieldError('email'), 'orange')}
                  />
                </Field>
                <Field label="Phone Number" error={getFieldError('phoneNumber')} required>
                  <input
                    type="tel"
                    value={currentMember.phoneNumber}
                    onChange={(e) => handleMemberChange('phoneNumber', e.target.value)}
                    placeholder="05XXXXXXXX"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!getFieldError('phoneNumber'), 'orange')}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="University" error={getFieldError('university')} required>
                  <input
                    type="text"
                    value={currentMember.university}
                    onChange={(e) => handleMemberChange('university', e.target.value)}
                    placeholder="ESTIN"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!getFieldError('university'), 'orange')}
                  />
                </Field>
                <Field label="Specialty" error={getFieldError('specialty')} required>
                  <input
                    type="text"
                    value={currentMember.specialty}
                    onChange={(e) => handleMemberChange('specialty', e.target.value)}
                    placeholder="Informatique"
                    disabled={status === 'submitting'}
                    className={getInputClass(!!getFieldError('specialty'), 'orange')}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Role" error={getFieldError('role')} required>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleMemberChange('role', 'frontend')}
                      disabled={status === 'submitting'}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 border cursor-pointer ${
                        currentMember.role === 'frontend'
                          ? 'bg-[#F9621D]/10 border-[#F9621D] text-[#F9621D]'
                          : 'bg-[#111316] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                      } ${!!getFieldError('role') && currentMember.role !== 'frontend' ? 'border-red-500/50 bg-red-500/5' : ''}`}
                    >
                      Frontend
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMemberChange('role', 'backend(n8n)')}
                      disabled={status === 'submitting'}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 border cursor-pointer ${
                        currentMember.role === 'backend(n8n)'
                          ? 'bg-[#F9621D]/10 border-[#F9621D] text-[#F9621D]'
                          : 'bg-[#111316] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                      } ${!!getFieldError('role') && currentMember.role !== 'backend(n8n)' ? 'border-red-500/50 bg-red-500/5' : ''}`}
                    >
                      Backend (n8n)
                    </button>
                  </div>
                </Field>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={status === 'submitting' || step === 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <div className="flex items-center gap-3">
                  {step >= 2 && step < 4 && (
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={status === 'submitting'}
                      className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      Finish & Submit
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  )
}