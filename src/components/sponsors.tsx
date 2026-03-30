'use client'

import Reveal from '@/components/ui/reveal'

export default function Sponsors() {
  return (
    <section className="w-full py-16 px-4 sm:py-20 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <Reveal direction="scale" delay={0.2}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 md:mb-20 text-balance" style={{ color: '#F4C430' }}>
            Sponsors & Partners
          </h2>
        </Reveal>

        {/* Sponsor Tiers Grid */}
        <div className="grid grid-cols-1 mt-8 md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20 items-start justify-items-center">
          {/* Silver Sponsor */}
          <Reveal direction="up" delay={0.3}>
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg sm:text-xl font-semibold text-gray-300">Silver</p>
              <div className="w-64 sm:w-72 md:w-80 h-80 sm:h-96 rounded-lg overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2042-Sk5WnGo9VAxiXDr4UpckY0jBNlhpG2.png"
                  alt="Silver sponsor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          {/* Golden Sponsor (Featured) */}
          <Reveal direction="up" delay={0.4}>
            <div className="flex flex-col relative md:-top-16 items-center gap-4">
              <p className="text-lg sm:text-xl font-semibold" style={{ color: '#F4C430' }}>
                Golden
              </p>
              <div className="w-72 sm:w-80 md:w-96 h-96 sm:h-112 md:h-128 rounded-lg overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2041-M8LJiTlPlGbPT7jzWTny5aEbav5lUJ.png"
                  alt="Golden sponsor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          {/* Bronze Sponsor */}
          <Reveal direction="up" delay={0.5}>
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg sm:text-xl font-semibold" style={{ color: '#CD7F32' }}>
                Bronze
              </p>
              <div className="w-64 sm:w-72 md:w-80 h-80 sm:h-96 rounded-lg overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2043-PsfhG5GCVLyucfpEeTRF5wPznFxYMv.png"
                  alt="Bronze sponsor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Partnership CTA */}
        <Reveal direction="up" delay={0.6}>
          <div className="text-center max-w-2xl mx-auto px-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-white">You want to be a partnarie?</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#about"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-md text-white font-semibold border-2 inline-block text-center transition-opacity hover:opacity-90"
                style={{ borderColor: '#FF6B35', color: '#FF6B35' }}
              >
                Learn More
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
