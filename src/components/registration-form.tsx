'use client'

import { useState, FormEvent } from 'react'
import Reveal from '@/components/ui/reveal'

type FormData = {
  teamName: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  university: string
  specialty: string
  year: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    university: '',
    specialty: '',
    year: '',
  })

  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCancel = () => {
    setFormData({
      teamName: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      university: '',
      specialty: '',
      year: '',
    })
    setStatus('idle')
    setErrorMessage('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          // Format validation errors
          const errors = data.details.map((d: any) => d.message).join(', ')
          throw new Error(errors)
        }
        throw new Error(data.error || 'Registration failed')
      }

      setStatus('success')
      setFormData({
        teamName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        university: '',
        specialty: '',
        year: '',
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  return (
    <div className="w-full  min-h-screen flex items-center justify-center py-12 px-4 mt-16">
      <div className="w-full max-w-2xl">
        <Reveal direction="up" delay={0.2}>
          <h1 className="text-4xl font-bold text-white mb-12">Registration Form</h1>
        </Reveal>

        {/* Success Message */}
        {status === 'success' && (
          <Reveal direction="up" delay={0.3}>
            <div className="mb-8 p-4 bg-green-900/50 border border-green-500 rounded">
              <p className="text-green-400 font-medium">
                ✓ Registration successful! We&apos;ll be in touch soon.
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
          {/* Team Name */}
          <Reveal direction="up" delay={0.3}>
            <div className="mb-8">
              <label className="block text-white text-sm font-medium mb-3">Team name</label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                placeholder="Afak"
                disabled={status === 'submitting'}
                className="w-full bg-[#1A1D21] px-4 py-3 border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </Reveal>

          {/* Team Leader Information */}
          <Reveal direction="up" delay={0.4}>
            <div className="mb-8">
              <h2 className="text-white text-sm font-medium mb-6 flex items-center">
                <span className="mr-2">•</span>
                Team leader information
              </h2>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Bilel"
                    disabled={status === 'submitting'}
                    className="w-full bg-[#1A1D21] px-4 py-3 border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Abbes"
                    disabled={status === 'submitting'}
                    className="w-full bg-[#1A1D21] px-4 py-3 border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email and Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@estin.dz"
                    disabled={status === 'submitting'}
                    className="w-full bg-[#1A1D21] px-4 py-3 border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Phone number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="123456789"
                    disabled={status === 'submitting'}
                    className="w-full bg-[#1A1D21] px-4 py-3 border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* University and Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">University</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="Estin"
                    disabled={status === 'submitting'}
                    className="w-full bg-[#1A1D21] px-4 py-3 border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Specialty</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="Informatique"
                    disabled={status === 'submitting'}
                    className="w-full bg-[#1A1D21] px-4 py-3 border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Year */}
              <div className="mb-8">
                <label className="block text-white text-sm font-medium mb-3">Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2024"
                  disabled={status === 'submitting'}
                  className="w-full bg-[#1A1D21] px-4 py-3 border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
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
                  'Next'
                )}
              </button>
            </div>
          </Reveal>
        </form>
      </div>
    </div>
  )
}
