'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-black border-t-2" style={{ borderTopColor: '#FF6B35' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.svg" 
                alt="SOAI" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <div>
                <p className="text-white font-bold">Automate</p>
                <p className="text-white font-bold">& Innovate</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Sponsors
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Schedule
                </a>
              </li>
            </ul>
          </div>

          {/* Secondary Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-lg invisible">Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Tracks
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Mentors
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Visitors
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col gap-6">
            {/* Contact */}
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold text-lg">Contact Us</h3>
              <p className="text-gray-400">
                Email:{' '}
                <a href="mailto:schoolofai@estin.dz" className="text-gray-300 hover:text-white transition-colors">
                  schoolofai@estin.dz
                </a>
              </p>
            </div>

            {/* Social Media */}
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold text-lg">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                 
                  title="Instagram"
                >
                  <Image src="/insta.svg" alt="Instagram" width={40} height={40} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                 
                  title="LinkedIn"
                >
                  <Image src="/linkedin.svg" alt="LinkedIn" width={40} height={40} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                 
                  title="Facebook"
                >
                  <Image src="/facebook.svg" alt="Facebook" width={40} height={40} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800 mb-6" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © 2026 School of AI Bejaia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
