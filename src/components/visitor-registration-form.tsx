'use client'

import { useState, FormEvent } from 'react'
import Reveal from '@/components/ui/reveal'

type FormData = {
  fullName: string
  email: string
  phoneNumber: string
  organization: string
  visitDate: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function VisitorRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    organization: '',
    visitDate: '',
  })

  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/register/visitor', {
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
        fullName: '',
        email: '',
        phoneNumber: '',
        organization: '',
        visitDate: '',
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  // Generate date options for the demo day (April 16-18, 2026)
  const dateOptions = [
    { value: '2026-04-16', label: 'April 16, 2026 - Day 1' },
    { value: '2026-04-17', label: 'April 17, 2026 - Day 2' },
    { value: '2026-04-18', label: 'April 18, 2026 - Demo Day' },
  ]

  return (
    <div className="w-full bg-black/50 min-h-screen flex items-center justify-center py-12 px-4 mt-16">
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
            <div className="mb-8">
              <label className="block text-white text-sm font-medium mb-3">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={status === 'submitting'}
                className="w-full px-4 py-3  border-2 border-orange-500 bg-[#1A1D21]   text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </Reveal>

          {/* Contact Information */}
          <Reveal direction="up" delay={0.4}>
            <div className="mb-8">
              <h2 className="text-white text-sm font-medium mb-6 flex items-center">
                <span className="mr-2">•</span>
                Contact Information
              </h2>

              {/* Email and Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3  border-2 border-orange-500 bg-[#1A1D21]   text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="123456789"
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3  border-2 border-orange-500 bg-[#1A1D21]   text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Organization */}
              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-3">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Company or University"
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3  border-2 border-orange-500 bg-[#1A1D21]   text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Visit Date */}
              <div className="mb-8">
                <label className="block text-white text-sm font-medium mb-3">Visit Date</label>
                <select
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3  border-2 border-orange-500 bg-[#1A1D21]   text-white focus:outline-none focus:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-[#0C0F14]"
                >
                  <option value="" disabled>Select a date</option>
                  {dateOptions.map((date) => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
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
