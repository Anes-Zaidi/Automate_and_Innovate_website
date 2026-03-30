'use client'

import Reveal from '@/components/ui/reveal'

export default function CTA() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-2xl">
      {/* Register Button */}
      <Reveal direction="up" delay={0.1}>
        <a
          href="/register"
          className="w-full sm:max-w-xs px-8 sm:px-10 py-3 sm:py-4 font-semibold text-sm sm:text-base rounded transition-all hover:opacity-90 active:scale-95 block text-center"
          style={{ backgroundColor: '#F9621D', color: '#0C0F14' }}
        >
          Register
        </a>
      </Reveal>

      {/* Contact Us Button */}
      <Reveal direction="up" delay={0.2}>
        <a
          href="#visitors"
          className="w-full sm:max-w-xs px-8 sm:px-10 py-3 sm:py-4 font-semibold text-sm sm:text-base rounded transition-all hover:opacity-90 active:scale-95 border-2 block text-center"
          style={{
            borderColor: '#F9621D',
            color: '#F9621D',
          }}
        >
          Contact Us
        </a>
      </Reveal>
    </div>
  )
}
