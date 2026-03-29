'use client'

import { useEffect, useState } from 'react'

export default function Countdown() {
  const [time, setTime] = useState({ days: 52, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const TimerBox = ({ value }: { value: string }) => (
    <div
      className="flex items-center rounded-sm justify-center font-extrabold border-2 sm:border-3 md:border-4 text-lg sm:text-2xl md:text-3xl lg:text-4xl w-14 h-14 sm:w-16 sm:h-16  "
      style={{
        borderColor: '#F9621D',
        color: '#F9621D',
        backgroundColor: 'rgba(249, 98, 29, 0.1)',
        transform: 'skewX(-15deg)',
      }}
    >
      {value}
    </div>
  )

  const TimerGroup = ({ value, label }: { value: number; label: string }) => {
    const digits = String(value).padStart(2, '0').split('')
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {digits.map((digit, index) => (
            <TimerBox key={index} value={digit} />
          ))}
        </div>
        <span className="text-xs sm:text-sm text-gray-400">{label}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10">
      <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-5 flex-wrap">
        <TimerGroup value={time.days} label="Days" />
        <span className="text-2xl sm:text-3xl md:text-4xl self-center -mt-6 sm:-mt-8 md:-mt-10" style={{ color: '#F9621D' }}>:</span>
        <TimerGroup value={time.hours} label="Hours" />
      </div>
    </div>
  )
}
