'use client'

import { useState, FormEvent } from 'react'
import Reveal from '@/components/ui/reveal'

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

export default function RegistrationForm() {
  const [step, setStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    teamLeader: { ...emptyMember },
    member2: { ...emptyMember },
    member3: { ...emptyMember },
    member4: { ...emptyMember },
  })

  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleMemberChange = (memberKey: keyof FormData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [memberKey]: {
        ...(prev[memberKey] as TeamMember),
        [field]: value,
      },
    }))
  }

  const handleMemberSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
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
  }

  const handleCancel = () => {
    setFormData({
      teamName: '',
      teamLeader: { ...emptyMember },
      member2: { ...emptyMember },
      member3: { ...emptyMember },
      member4: { ...emptyMember },
    })
    setStep(1)
    setStatus('idle')
    setErrorMessage('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
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
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
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

  return (
    <div className="w-full bg-black/50 min-h-screen flex items-center justify-center py-24  px-4">
      <div className="w-full max-w-2xl">
        <Reveal direction="up" delay={0.2}>
          <h1 className="text-4xl font-bold text-white mb-12">Registration Form</h1>
        </Reveal>

        {/* Success Message */}
        {status === 'success' && (
          <Reveal direction="up" delay={0.3}>
            <div className="mb-8 p-4 bg-green-900/50 border border-green-500 rounded">
              <p className="text-green-400 font-medium">
                ✓ Registration successful! Your team is registered.
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, teamName: e.target.value }))}
                    placeholder="Afak"
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3 bg-[#1A1D21]  border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    minLength={2}
                  />
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
                    className="w-full px-4 py-3 bg-[#1A1D21]  border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Last Name</label>
                  <input
                    type="text"
                    value={currentMember.lastName}
                    onChange={(e) => handleMemberChange(currentMemberKey, 'lastName', e.target.value)}
                    placeholder="Abbes"
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3 bg-[#1A1D21]  border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
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
                    className="w-full px-4 py-3 bg-[#1A1D21]  border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Phone Number</label>
                  <input
                    type="tel"
                    value={currentMember.phoneNumber}
                    onChange={(e) => handleMemberChange(currentMemberKey, 'phoneNumber', e.target.value)}
                    placeholder="123456789"
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3 bg-[#1A1D21]  border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
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
                    className="w-full px-4 py-3 bg-[#1A1D21]  border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Specialty</label>
                  <input
                    type="text"
                    value={currentMember.specialty}
                    onChange={(e) => handleMemberChange(currentMemberKey, 'specialty', e.target.value)}
                    placeholder="Informatique"
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3 bg-[#1A1D21]  border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Year */}
              <div className="mb-8">
                <label className="block text-white text-sm font-medium mb-3">Year</label>
                <input
                  type="text"
                  value={currentMember.year}
                  onChange={(e) => handleMemberChange(currentMemberKey, 'year', e.target.value)}
                  placeholder="2024"
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 bg-[#1A1D21]  border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={status === 'submitting' || step === 1}
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
                  ) : step === 4 ? (
                    'Submit'
                  ) : (
                    'Next'
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
