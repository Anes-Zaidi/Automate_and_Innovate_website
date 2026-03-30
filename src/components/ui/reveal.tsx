'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'scale-up' | 'fade' | 'rotate'
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export default function Reveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, rootMargin, once])

  // Map direction to CSS class
  const directionClass = {
    up: 'reveal-up',
    down: 'reveal-down',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
    'scale-up': 'reveal-scale-up',
    fade: 'reveal-fade',
    rotate: 'reveal-rotate',
  }[direction]

  const delayClass = delay > 0 ? `reveal-delay-${Math.round(delay * 1000)}` : ''

  return (
    <div
      ref={ref}
      className={`${directionClass} ${isVisible ? 'is-visible' : ''} ${delayClass} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
