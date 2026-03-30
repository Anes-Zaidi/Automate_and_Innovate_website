import Header from '@/components/header'
import Hero from '@/components/hero'
import Countdown from '@/components/countdown'
import CTA from '@/components/cta'
import About from '@/components/about'
import Sponsors from '@/components/sponsors'
import Schedules from '@/components/schedules'
import Speakers from '@/components/speakers'
import TrainingTracks from '@/components/training-tracks'
import Visitors from '@/components/visitors'
import Footer from '@/components/footer'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col relative" style={{ backgroundColor: '#0C0F14' }}>
      {/* Top Corner Glow - Top Right */}
      <div className="fixed -top-20 -right-20 w-[800px] h-[800px] pointer-events-none  z-0">
        <Image
          src="/top-corner-glow.svg"
          alt=""
          fill
          className="object-contain object-right-top"
        />
      </div>

      {/* Grid Decoration Pattern - Three instances across the page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute scale-75 -right-80 rotate-45 top-20 w-[500px] h-[250px] ">
          <Image
            src="/gtid-decoration.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute scale-75 left-1/8 top-1/8 w-[500px] h-[250px] ">
          <Image
            src="/gtid-decoration.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute scale-75 right-1/8 -bottom-1/4 w-[500px] h-[250px] ">
          <Image
            src="/gtid-decoration.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    
      {/* Header */}
      <Header />

      {/* Hero Section with Max Width Container */}
      <div className="relative h-[70vh] z-10 flex-1 flex items-center justify-center w-full pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 border-b " style={{ borderColor: '#FF6B35' }}>
        <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-12">
          <Hero />
          <Countdown />
          <CTA />
        </div>
      </div>

      {/* About Section */}
      <About />

      {/* Sponsors Section */}
      <Sponsors />

      {/* Schedules Section */}
      <Schedules />

     {/* Training Tracks Section */}
      <TrainingTracks />
      
      {/* Speakers & Mentors Section */}
      <Speakers />

 

      {/* Visitors Section */}
      <Visitors />

      {/* Footer */}
      <Footer />
    </main>
  )
}
