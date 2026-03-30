'use client'

export default function Speakers() {
  return (
    <section className="w-full py-20 px-4 border-b" style={{ borderColor: '#FF6B35' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#F4C430' }}>
          Speakers & Mentors
        </h2>
        
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Speaker Image */}
          <div
            className="w-64 h-64 rounded-full border-8 flex-shrink-0"
            style={{ borderColor: '#FF6B35' }}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
              alt="Abbes Bilel"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {/* Speaker Info */}
          <div className="flex-grow">
            <h3 className="text-3xl font-bold text-white mb-2">Abbes Bilel</h3>
            <p className="text-lg mb-6" style={{ color: '#F4C430' }}>
              UI/UX Designer
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urma. Curabitur vel bibendum lorem.
            </p>
            <a
              href="#"
              className="inline-block px-8 py-3 rounded font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: '#FF6B35', color: '#0C0F14' }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
