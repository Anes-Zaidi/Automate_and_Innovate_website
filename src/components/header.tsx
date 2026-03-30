'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 border-b fade-up-item" style={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(249, 98, 29, 0.15)' }}>
      <div className=" mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 ">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity">
            <Image
              src="/logo.svg"
              alt="SOAI"
              width={40}
              height={40}
              loading="eager"
              className="w-auto h-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/#home" className="text-sm text-white hover:text-[#F9C673] transition-colors border-b-2  border-[#F9C673] pb-1 cursor-pointer">
              Home
            </a>
            <a href="/#about" className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              About Us
            </a>
                  <a href="/#sponsors" className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              Sponsors
            </a>
            <a href="/#schedule" className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              Schedule
            </a>
            <a href="/#tracks" className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              Tracks
            </a>
            <a href="/#speakers" className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              Speakers
            </a>
      
            <a href="/#visitors" className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              Visitors
            </a>
          </nav>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Register Button */}
          <a
            href="/register"
            className="hidden sm:inline px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#F9621D', color: '#0C0F14' }}
          >
            Register
          </a>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t " style={{ borderColor: 'rgba(249, 98, 29, 0.15)', animationDelay: '0.2s' }}>
            <a href="/#home" className="block text-white hover:text-[#F9C673] transition-colors py-2 text-sm cursor-pointer">
              Home
            </a>
            <a href="/#about" className="block text-gray-400 hover:text-white transition-colors py-2 text-sm cursor-pointer">
              About Us
            </a>
            <a href="/#schedule" className="block text-gray-400 hover:text-white transition-colors py-2 text-sm cursor-pointer">
              Schedule
            </a>
            <a href="/#tracks" className="block text-gray-400 hover:text-white transition-colors py-2 text-sm cursor-pointer">
              Tracks
            </a>
            <a href="/#speakers" className="block text-gray-400 hover:text-white transition-colors py-2 text-sm cursor-pointer">
              Speakers
            </a>
            <a href="/#sponsors" className="block text-gray-400 hover:text-white transition-colors py-2 text-sm cursor-pointer">
              Sponsors
            </a>
            <a href="/#visitors" className="block text-gray-400 hover:text-white transition-colors py-2 text-sm cursor-pointer">
              Visitors
            </a>
            <a
              href="/register"
              className="w-full mt-2 px-4 py-2 text-sm font-semibold rounded transition-opacity hover:opacity-90 block text-center"
              style={{ backgroundColor: '#F9621D', color: '#0C0F14' }}
            >
              Register
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
