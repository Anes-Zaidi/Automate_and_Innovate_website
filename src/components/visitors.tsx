'use client'

import Reveal from '@/components/ui/reveal'

export default function Visitors() {
  return (
    <section className="w-full py-16 px-4 sm:py-20" style={{ backgroundColor: '#0C0F14' }}>
      <div className="max-w-4xl mx-auto text-center">
        <Reveal direction="scale" delay={0.2}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12" style={{ color: '#F4C430' }}>
            Visitors
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.4}>
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8">
            You wish to visit on the demo day?
          </h3>
        </Reveal>

        <Reveal direction="up" delay={0.5}>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 sm:mb-12 px-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urma. Curabitur vel bibendum lorem.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.6}>
          <a
            href="/register"
            className="inline-block px-6 sm:px-8 py-3 rounded font-semibold hover:opacity-90 transition text-sm sm:text-base"
            style={{ backgroundColor: '#FF6B35', color: '#0C0F14' }}
          >
            Register for Demo Day
          </a>
        </Reveal>
      </div>
    </section>
  )
}
