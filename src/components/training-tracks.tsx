'use client'

import { Server, Layout, Briefcase } from 'lucide-react'
import Reveal from '@/components/ui/reveal'

export default function TrainingTracks() {
  const tracks = [
    {
      title: 'Backend',
      icon: Server,
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Lorem ipsum dolor sit amet, consectetur adipisicing elit interdum.'
    },
    {
      title: 'Frontend',
      icon: Layout,
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Lorem ipsum dolor sit amet, consectetur adipisicing elit interdum.'
    },
    {
      title: 'Business',
      icon: Briefcase,
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Lorem ipsum dolor sit amet, consectetur adipisicing elit interdum.'
    }
  ]

  return (
    <section className="w-full py-16 px-4 sm:py-20 border-t border-b" style={{ borderColor: '#FF6B35' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal direction="scale" delay={0.2}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16" style={{ color: '#F4C430' }}>
            Training Tracks
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {tracks.map((track, index) => {
            const Icon = track.icon
            return (
              <Reveal key={index} direction="up" delay={0.3 + index * 0.15}>
                <div
                  className="p-6 sm:p-8 rounded-lg border-2 flex flex-col"
                  style={{ borderColor: '#FF6B35', backgroundColor: '#1A1D21' }}
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-4 mx-auto"
                    style={{ backgroundColor: '#FF6B35' }}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" color="#0C0F14" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-center text-white mb-3 sm:mb-4">
                    {track.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 text-center flex-grow leading-relaxed">
                    {track.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
