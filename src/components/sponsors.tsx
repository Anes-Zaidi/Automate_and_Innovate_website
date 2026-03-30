import { Button } from '@/components/ui/button'
import Reveal from '@/components/ui/reveal'

export default function Sponsors() {
  return (
    <section className="w-full py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <Reveal direction="scale" delay={0.2}>
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-20 text-balance" style={{ color: '#F4C430' }}>
            Sponsors & Partners
          </h2>
        </Reveal>

        {/* Sponsor Tiers Grid */}
        <div className="grid grid-cols-1 mt-12 md:grid-cols-3 gap-12 mb-20 items-start justify-items-center">
          {/* Silver Sponsor */}
          <Reveal direction="right" delay={0.3}>
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-semibold text-gray-300">Silver</p>
              <div className="w-80 h-96 rounded-lg overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2042-Sk5WnGo9VAxiXDr4UpckY0jBNlhpG2.png"
                  alt="Silver sponsor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          {/* Golden Sponsor (Featured) */}
          <Reveal direction="up" delay={0.5}>
            <div className="flex flex-col relative -top-16 items-center gap-4">
              <p className="text-xl font-semibold" style={{ color: '#F4C430' }}>
                Golden
              </p>
              <div className="w-96 h-128 rounded-lg overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2041-M8LJiTlPlGbPT7jzWTny5aEbav5lUJ.png"
                  alt="Golden sponsor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          {/* Bronze Sponsor */}
          <Reveal direction="left" delay={0.7}>
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-semibold" style={{ color: '#CD7F32' }}>
                Bronze
              </p>
              <div className="w-80 h-96 rounded-lg overflow-hidden">
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
        <Reveal direction="up" delay={0.9}>
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white">You want to be a partnarie?</h3>
            <p className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
              Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="px-8 py-3 rounded-md text-[#0C0F14] font-semibold" style={{ backgroundColor: '#FF6B35' }}>
                Be A Partenaire
              </Button>
              <Button
                className="px-8 py-3 rounded-md text-white font-semibold border-2"
                style={{ borderColor: '#FF6B35', color: '#FF6B35' }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
