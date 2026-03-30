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

  // Load saved data from localStorage on mount
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

  // Fetch CSRF token on mount
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

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && status !== 'success') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, step }))
      } catch (error) {
        console.error('Failed to save registration data:', error)
      }
    }
  }, [formData, step, isLoaded, status])

  const handleMemberChange = (memberKey: keyof FormData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [memberKey]: {
        ...(prev[memberKey] as TeamMember),
        [field]: value,
      },
    }))
    // Don't clear errors on typing - only clear on Next/Submit attempt
  }

  const validateCurrentStep = (): boolean => {
    const currentMemberKey = getCurrentMemberKey()
    const currentMember = formData[currentMemberKey] as TeamMember

    const newErrors: Record<string, string> = {}

    // Validate team name on step 1
    if (step === 1) {
      if (!formData.teamName || formData.teamName.trim().length < 2) {
        newErrors['teamName'] = 'Team name must be at least 2 characters'
      }
    }

    // Validate team member fields using Zod schema
    try {
      teamMemberSchema.parse(currentMember)
    } catch (error) {
      if (error instanceof Error && 'errors' in error && Array.isArray(error.errors)) {
        const zodError = error as any
        zodError.errors.forEach((err: any) => {
          const field = err.path?.[0] || 'unknown'
          const key = `${currentMemberKey}.${field}`
          const message = err.message || 'Invalid value'
          newErrors[key] = message
          console.error(`Validation error for ${key}:`, message)
        })
      } else {
        console.error('Unexpected validation error structure:', error)
        // Fallback: add a generic error
        newErrors[`${currentMemberKey}.general`] = 'Invalid information provided'
      }
    }

    setFieldErrors(newErrors)

    // Show toast for each error
    const errorMessages = Object.values(newErrors)
    console.log('Validation errors:', errorMessages)
    
    errorMessages.forEach((msg) => {
      addToast(msg, 'error')
    })

    const isValid = errorMessages.length === 0
    console.log('Validation result:', isValid ? 'PASS' : 'FAIL')
    
    return isValid
  }

  const handleMemberSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateCurrentStep()) {
      return
    }

    if (step < 4) {
      setStep(step + 1)
      addToast(`Step ${step} completed! Continue with next member.`, 'success')
    } else {
      handleSubmit(e)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
    setStatus('idle')
    setErrorMessage('')
    setFieldErrors({})
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Final validation before submission
    if (!validateCurrentStep()) {
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const payload = {
        teamName: formData.teamName,
        teamLeader: formData.teamLeader,
        member2: formData.member2,
        member3: formData.member3,
        member4: formData.member4,
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          const errors = data.details.map((d: any) => d.message).join(', ')
          throw new Error(errors)
        }
        throw new Error(data.error || 'Registration failed')
      }

      setStatus('success')

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY)

      // Show success toast
      addToast('🎉 Registration successful! Your team is registered. Redirecting...', 'success')

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

  const getMemberTitle = () => {
    switch (step) {
      case 1:
        return 'Team leader information'
      case 2:
        return 'Member 2 information'
      case 3:
        return 'Member 3 information'
      case 4:
        return 'Member 4 information'
      default:
        return ''
    }
  }

  const getCurrentMemberKey = (): keyof FormData => {
    switch (step) {
      case 1:
        return 'teamLeader'
      case 2:
        return 'member2'
      case 3:
        return 'member3'
      case 4:
        return 'member4'
      default:
        return 'teamLeader'
    }
  }

  const currentMemberKey = getCurrentMemberKey()
  const currentMember = formData[currentMemberKey] as TeamMember

  const getFieldError = (field: string) => {
    return fieldErrors[`${currentMemberKey}.${field}`]
  }

  const getInputClass = (field: string) => {
    const hasError = getFieldError(field)
    const baseClass = "w-full px-4 py-3 bg-[#1A1D21] border-2 text-white placeholder-gray-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
    
    if (hasError) {
      return `${baseClass} border-red-500 focus:border-red-400`
    }
    return `${baseClass} border-orange-500 focus:border-orange-400`
  }

  return (
    <div className="w-full  min-h-screen flex items-center justify-center py-24 px-4">
      <div className="w-full max-w-2xl">
        <Reveal direction="up" delay={0.2}>
          <h1 className="text-4xl font-bold text-white mb-12">Registration Form</h1>
        </Reveal>

   

        {/* Steps 1-4: Member Forms */}
        {step >= 1 && step <= 4 && (
          <Reveal direction="up" delay={0.4}>
            {/* Team Name input - only on step 1 */}
            {step === 1 && (
              <div className="mb-8">
                <div className="mb-8">
                  <label className="block text-white text-sm font-medium mb-3">Team Name</label>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, teamName: e.target.value }))
                      if (fieldErrors['teamName']) {
                        setFieldErrors((prev) => {
                          const newErrors = { ...prev }
                          delete newErrors['teamName']
                          return newErrors
                        })
                      }
                    }}
                    placeholder="Afak"
                    disabled={status === 'submitting'}
                    className={getInputClass('teamName')}
                    required
                    minLength={2}
                  />
                  {fieldErrors['teamName'] && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors['teamName']}
                    </p>
                  )}
                </div>
                <h2 className="text-white text-sm font-medium mb-6 flex items-center">
                  <span className="mr-2">•</span>
                  Team leader information
                </h2>
              </div>
            )}

            {/* Member section headers for steps 2-4 */}
            {step >= 2 && (
              <div className="mb-8">
                <h2 className="text-white text-sm font-medium mb-6 flex items-center">
                  <span className="mr-2">•</span>
                  {getMemberTitle()}
                </h2>
              </div>
            )}

            <form onSubmit={handleMemberSubmit}>
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">First Name</label>
                  <input
                    type="text"
                    value={currentMember.firstName}
                    onChange={(e) => handleMemberChange(currentMemberKey, 'firstName', e.target.value)}
                    placeholder="Bilel"
                    disabled={status === 'submitting'}
                    className={getInputClass('firstName')}
                    required
                  />
                  {getFieldError('firstName') && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {getFieldError('firstName')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Last Name</label>
                  <input
                    type="text"
                    value={currentMember.lastName}
                    onChange={(e) => handleMemberChange(currentMemberKey, 'lastName', e.target.value)}
                    placeholder="Abbes"
                    disabled={status === 'submitting'}
                    className={getInputClass('lastName')}
                    required
                  />
                  {getFieldError('lastName') && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {getFieldError('lastName')}
                    </p>
                  )}
                </div>
              </div>

              {/* Email and Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Email</label>
                  <input
                    type="email"
                    value={currentMember.email}
                    onChange={(e) => handleMemberChange(currentMemberKey, 'email', e.target.value)}
                    placeholder="exemple@estin.dz"
                    disabled={status === 'submitting'}
                    className={getInputClass('email')}
                    required
                  />
                  {getFieldError('email') && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {getFieldError('email')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Phone Number</label>
                  <input
                    type="tel"
                    value={currentMember.phoneNumber}
                    onChange={(e) => handleMemberChange(currentMemberKey, 'phoneNumber', e.target.value)}
                    placeholder="05XXXXXXXX or +2135XXXXXXXX"
                    disabled={status === 'submitting'}
                    className={getInputClass('phoneNumber')}
                    required
                  />
                  {getFieldError('phoneNumber') && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {getFieldError('phoneNumber')}
                    </p>
                  )}
                </div>
              </div>

              {/* University and Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">University</label>
                  <input
                    type="text"
                    value={currentMember.university}
                    onChange={(e) => handleMemberChange(currentMemberKey, 'university', e.target.value)}
                    placeholder="Estin"
                    disabled={status === 'submitting'}
                    className={getInputClass('university')}
                    required
                  />
                  {getFieldError('university') && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {getFieldError('university')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Specialty</label>
                  <input
                    type="text"
                    value={currentMember.specialty}
                    onChange={(e) => handleMemberChange(currentMemberKey, 'specialty', e.target.value)}
                    placeholder="Informatique"
                    disabled={status === 'submitting'}
                    className={getInputClass('specialty')}
                    required
                  />
                  {getFieldError('specialty') && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {getFieldError('specialty')}
                    </p>
                  )}
                </div>
              </div>

              {/* Year */}
              <div className="mb-8">
                <label className="block text-white text-sm font-medium mb-3">Year</label>
                <input
                  type="number"
                  value={currentMember.year}
                  onChange={(e) => handleMemberChange(currentMemberKey, 'year', e.target.value)}
                  placeholder="2024"
                  disabled={status === 'submitting'}
                  className={getInputClass('year')}
                  required
                  min="1900"
                  max="2100"
                />
                {getFieldError('year') && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {getFieldError('year')}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={status === 'submitting' || step === 1}
                  className="px-8 py-3 bg-gray-700 text-white font-medium rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
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
                  ) : step === 4 ? (
                    'Submit Registration'
                  ) : (
                    <>
                      Next Step
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </div>
  )
}
