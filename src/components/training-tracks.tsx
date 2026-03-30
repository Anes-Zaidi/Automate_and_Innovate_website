'use client'

import { Server, Layout, Briefcase } from 'lucide-react'

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
    <section className="w-full py-20 px-4 border-t border-b" style={{ borderColor: '#FF6B35' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#F4C430' }}>
          Training Tracks
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tracks.map((track, index) => {
            const Icon = track.icon
            return (
              <div
                key={index}
                className="p-8 rounded-lg border-2 flex flex-col"
                style={{ borderColor: '#FF6B35', backgroundColor: '#1A1D21' }}
              >
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto"
                  style={{ backgroundColor: '#FF6B35' }}
                >
                  <Icon className="w-8 h-8" color="#0C0F14" />
                </div>
                <h3 className="text-xl font-semibold text-center text-white mb-4">
                  {track.title}
                </h3>
                <p className="text-sm text-gray-400 text-center flex-grow">
                  {track.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
