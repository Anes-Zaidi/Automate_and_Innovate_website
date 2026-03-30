import { MapPin, Clock } from 'lucide-react'
import CTA from './cta'
import Countdown from './countdown'
import Reveal from '@/components/ui/reveal'

export default function Hero() {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center">
        {/* Main Title - on single row */}
        <Reveal direction="scale" delay={0.1}>
          <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight whitespace-nowrap">
              Automate & Innovate
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight whitespace-nowrap" style={{ color: '#F9C673' }}>
              Hackathon
            </h2>
          </div>
        </Reveal>

        {/* Subtitle */}
        <Reveal direction="up" delay={0.3}>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-medium max-w-3xl mt-6">
            Automate the process, Innovate the impact
          </p>
        </Reveal>

        {/* Event Details */}
        <Reveal direction="up" delay={0.5}>
          <div className="flex flex-col items-center mt-8">
            {/* Location */}
            <div className="flex items-center gap-3 sm:gap-4">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" style={{ color: '#F9621D' }} strokeWidth={2} />
              <span className="text-gray-300 text-sm sm:text-base md:text-lg">ESTIN Amizour Hub</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3 sm:gap-4 mt-4">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" style={{ color: '#F9621D' }} strokeWidth={2} />
              <span className="text-gray-300 text-sm sm:text-base md:text-lg">April 16-18</span>
            </div>
          </div>
        </Reveal>
      </div>
    
        <Countdown />
     
      <Reveal direction="up" delay={0.8}>
        <CTA />
      </Reveal>
    </>
  )
}
