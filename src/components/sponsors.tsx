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

        {/* Sponsors Grid */}
        <div className="flex flex-col sm:flex-row gap-8 md:gap-12 mb-16 md:mb-20 items-center justify-center">
          {/* n8n */}
          <Reveal direction="up" delay={0.3}>
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 rounded-lg overflow-hidden flex items-center justify-center bg-white"
                style={{
                  border: '3px solid #FF6600',
                  boxShadow: '0 0 20px 2px rgba(255, 102, 0, 0.3)',
                }}
              >
                <img
                  src="https://n8n.io/n8n-logo.png"
                  alt="n8n"
                  className="w-2/3 object-contain"
                />
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-300">n8n</p>
            </div>
          </Reveal>

          {/* Estinup */}
          <Reveal direction="up" delay={0.4}>
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 rounded-lg overflow-hidden flex items-center justify-center bg-black"
                style={{
                  border: '3px solid #F4C430',
                  boxShadow: '0 0 20px 2px rgba(244, 196, 48, 0.3)',
                }}
              >
                <img
                  src="/image.png"
                  alt="Estinup"
                  className="w-2/3 object-contain"
                />
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-300">Estinup — ESTIN Bejaia</p>
            </div>
          </Reveal>
        </div>

        {/* Partnership CTA */}
        <Reveal direction="up" delay={0.6}>
          <div className="text-center max-w-2xl mx-auto px-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-white">Interested in Partnering?</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              Join us in shaping the future of AI. Partner with SOAI to showcase your brand to top innovators, gain valuable exposure, and support the next generation of tech leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#about"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-md font-semibold border-2 inline-block text-center transition-opacity hover:opacity-90"
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