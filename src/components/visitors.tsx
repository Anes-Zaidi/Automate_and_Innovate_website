'use client'

export default function Visitors() {
  return (
    <section className="w-full py-20 px-4" style={{ backgroundColor: '#0C0F14' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12" style={{ color: '#F4C430' }}>
          Visitors
        </h2>
        
        <h3 className="text-2xl font-semibold text-white mb-8">
          You wish to visit on the demo day?
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-12 max-w-3xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urma. Curabitur vel bibendum lorem.
        </p>
        
        <button
          className="px-8 py-3 rounded font-semibold hover:opacity-90 transition"
          style={{ backgroundColor: '#FF6B35', color: '#0C0F14' }}
        >
          Register for Demo Day
        </button>
      </div>
    </section>
  )
}
