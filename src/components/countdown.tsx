'use client'

import { useEffect, useState } from 'react'

export default function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [animateKey, setAnimateKey] = useState(0)

  useEffect(() => {
    // Trigger initial animation
    setAnimateKey(1)

    // Event date: April 16, 2026
    const eventDate = new Date('2026-04-16T00:00:00').getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = eventDate - now

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    // Set initial value
    setTime(calculateTimeLeft())

    const timer = setInterval(() => {
      setTime(calculateTimeLeft())
    }, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(timer)
  }, [])

  const TimerBox = ({ value, delay }: { value: string; delay: number }) => (
    <div
      className="timer-box timer-box-animate"
      style={{
        borderColor: '#F9621D',
        color: '#F9621D',
        backgroundColor: 'rgba(249, 98, 29, 0.1)',
        animationDelay: `${delay}ms`,
      }}
    >
      {value}
    </div>
  )

  const TimerGroup = ({ value, label, startDelay = 0 }: { value: number; label: string; startDelay?: number }) => {
    const digits = String(value).padStart(2, '0').split('')
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {digits.map((digit, index) => (
            <TimerBox
              key={`${animateKey}-${digit}-${index}`}
              value={digit}
              delay={startDelay + index * 50}
            />
          ))}
        </div>
        <span
          className="text-xs sm:text-sm text-gray-400 label-animate"
          style={{ animationDelay: `${startDelay + 100}ms` }}
        >
          {label}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10">
      <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-5 flex-wrap">
        <TimerGroup value={time.days} label="Days" startDelay={300} />
        <span
          className="text-2xl sm:text-3xl md:text-4xl self-center -mt-6 sm:-mt-8 md:-mt-10 separator-animate"
          style={{ color: '#F9621D', animationDelay: '500ms' }}
        >
          :
        </span>
        <TimerGroup value={time.hours} label="Hours" startDelay={600} />
      </div>
    </div>
  )
}
