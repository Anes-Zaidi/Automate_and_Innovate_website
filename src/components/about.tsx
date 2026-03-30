import Image from 'next/image'
import Reveal from '@/components/ui/reveal'

export default function About() {
  return (
    <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 sm:pt-24 sm:pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <Reveal direction="scale" delay={0.2}>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 sm:mb-16 md:mb-20"
            style={{ color: '#F9C673' }}
          >
            About Us
          </h1>
        </Reveal>

        {/* The Club Section */}
        <Reveal direction="up" delay={0.3}>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {/* Logo Circle */}
            <div className="flex justify-center order-1">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
                <Image
                  src="/soai-logo.png"
                  alt="School of AI Béjaia Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Logo and Text */}
            <div className="flex flex-col items-center md:items-start gap-4 md:gap-6 order-2 text-center md:text-left">
              <div className="flex items-start gap-3 md:gap-4">
                <span style={{ color: '#F9621D' }} className="text-2xl md:text-3xl mt-1">✦</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  The Club: School of AI Béjaia
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                The School of AI Béjaia is a vibrant community dedicated to fostering innovation and excellence in artificial intelligence. We believe in breaking down barriers to entry—months of boilerplate coding and complex backend infrastructure should no longer stand between a student and their impact. Our mission is to empower the next generation of AI developers with the tools, knowledge, and community they need to succeed.
              </p>
            </div>
          </div>
        </Reveal>

        {/* The Vision Section */}
        <Reveal direction="up" delay={0.5}>
          {/* Vision Header and Intro with Image */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 mt-12">
            {/* Left Column - Vision Header and Text */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-3 md:gap-4 mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white pt-2">
                  <span style={{ color: '#F9621D' }} className="flex-shrink-0 leading-none">✦</span>
                  <span className="ml-2">The Vision:</span>
                </h2>
              </div>

              <div className="space-y-4 md:space-y-6">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  The vision of Automate & Innovate is to redefine what it means to be a developer in the era of Artificial Intelligence. At School of AI Béjaia, we believe that outdated barriers to entry—months of boilerplate coding and complex backend infrastructure—should no longer stand between a student and their impact.
                </p>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Our vision is built on three transformative pillars:
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-1 flex items-start justify-center lg:justify-end">
              <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden flex-shrink-0">
                <Image
                  src="/two-guys.png"
                  alt="Professionals collaborating on a project"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Vision Pillars - Full Width */}
          <div className="space-y-6 md:space-y-8">
            {/* Pillar 1 */}
            <Reveal direction="up" delay={0.7}>
              <div className="flex items-start gap-3 mb-3">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex-shrink-0">
                  <span style={{ color: '#F9621D' }}>✦</span>
                </h3>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">Speed as a Feature</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    We want to move the ESTIN community from 'learning to code' to 'learning to launch'. By utilizing n8n as a state-of-the-art backend, we empower our students to build industrial-grade logic at a fraction of the traditional time. We believe the speed of your tools should match the speed of your ideas.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Pillar 2 */}
            <Reveal direction="up" delay={0.8}>
              <div className="flex items-start gap-3 mb-3">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex-shrink-0">
                  <span style={{ color: '#F9621D' }}>✦</span>
                </h3>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">Augmenting Human Creativity</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Through AI-Assisted Development, we are shifting the focus from syntax mastery to structural vision. We envision a future where students use AI as a collaborative partner to deliver high-end user experiences, allowing them to spend more time on innovation and less on debugging.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Pillar 3 */}
            <Reveal direction="up" delay={0.9}>
              <div className="flex items-start gap-3 mb-3">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex-shrink-0">
                  <span style={{ color: '#F9621D' }}>✦</span>
                </h3>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">Impact Over Code</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    The ultimate goal isn't just a working script; it's a solved problem. By concluding with a Public Pitch, our vision is to transform CS students into founders. We aren't just building apps; we are building the next generation of Algerian AI startups.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
