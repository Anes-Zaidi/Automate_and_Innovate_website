'use client'

import { useState } from 'react'
import Reveal from '@/components/ui/reveal'

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    teamName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    university: '',
    specialty: '',
    year: '',
  })

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
  }

  const handleNext = () => {
    console.log('Form data:', formData)
  }

  return (
    <div className="w-full bg-black/50 min-h-screen flex items-center justify-center py-12 px-4 mt-16">
      <div className="w-full max-w-2xl mb-12">
        <Reveal direction="up" delay={0.2}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">Registration Form</h1>
        </Reveal>

        {/* Team Name */}
        <Reveal direction="up" delay={0.3}>
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3">Team name</label>
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              placeholder="Afak"
              className="w-full px-4 py-3 bg-[#1A1D21] border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition rounded"
            />
          </div>
        </Reveal>

        {/* Team Leader Information */}
        <Reveal direction="up" delay={0.4}>
          <div className="mb-6">
            <h2 className="text-white text-sm font-medium mb-6 flex items-center">
              <span className="mr-2" style={{ color: '#F9621D' }}>✦</span>
              Team leader information
            </h2>

            {/* First Name */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-3">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Bilel"
                className="w-full px-4 py-3 bg-[#1A1D21] border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition rounded"
              />
            </div>

            {/* Last Name */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-3">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Abbes"
                className="w-full px-4 py-3 bg-[#1A1D21] border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition rounded"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-3">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@estin.dz"
                className="w-full px-4 py-3 bg-[#1A1D21] border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition rounded"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-3">Phone number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="123456789"
                className="w-full px-4 py-3 bg-[#1A1D21] border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition rounded"
              />
            </div>

            {/* University */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-3">University</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="Estin"
                className="w-full px-4 py-3 bg-[#1A1D21] border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition rounded"
              />
            </div>

            {/* Specialty */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-3">Specialty</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Informatique"
                className="w-full px-4 py-3 bg-[#1A1D21] border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition rounded"
              />
            </div>

            {/* Year */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-3">Year</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="2024"
                className="w-full px-4 py-3 bg-[#1A1D21] border-2 border-orange-500 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition rounded"
              />
            </div>
          </div>
        </Reveal>

        {/* Buttons */}
        <Reveal direction="up" delay={0.5}>
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={handleCancel}
              className="w-full sm:w-auto px-8 py-3 bg-gray-700 text-white font-medium rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition"
            >
              Next
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
