'use client'

import Reveal from '@/components/ui/reveal'

export default function Speakers() {
  return (
    <section className="w-full py-16 px-4 sm:py-20 border-b" style={{ borderColor: '#FF6B35' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal direction="scale" delay={0.2}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16" style={{ color: '#F4C430' }}>
            Speakers & Mentors
          </h2>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Speaker Image */}
          <Reveal direction="up" delay={0.4}>
            <div
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-8 flex-shrink-0 mx-auto"
              style={{ borderColor: '#FF6B35' }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                alt="Abbes Bilel"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </Reveal>

          {/* Speaker Info */}
          <Reveal direction="up" delay={0.5}>
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Abbes Bilel</h3>
              <p className="text-base sm:text-lg mb-4 md:mb-6" style={{ color: '#F4C430' }}>
                UI/UX Designer
              </p>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 md:mb-8">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urma. Curabitur vel bibendum lorem.
              </p>
              <a
                href="https://www.linkedin.com/company/school-of-ai-bejaia/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 sm:px-8 py-3 rounded font-semibold hover:opacity-90 transition text-sm sm:text-base"
                style={{ backgroundColor: '#FF6B35', color: '#0C0F14' }}
              >
                LinkedIn
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
